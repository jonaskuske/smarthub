#include <Arduino.h>
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <IRrecv.h>
#include <IRremoteESP8266.h>
#include <IRutils.h>
#include <Servo.h>
#include <SocketIoClient.h>
#include <pins_arduino.h>
#include "config.h"
#include "src/distanceController/DistanceController.h"

SocketIoClient socketClient;
Servo motor;
DistanceController einbruchSensor(TRIGGER_PIN, ECHO_PIN);

IRrecv irrecv(IR_RECEIVER);
decode_results ir_results;

// Variablen Deklaration
unsigned long startTime;
unsigned long stopTime;
unsigned long startTime_System;
unsigned long stopTime_System;
unsigned long startTempTime;
unsigned long stopTempTime;
unsigned long startKettleTime;
unsigned long stopKettleTime;

int buttonState = 0;
bool einbruchTriggered = false;
bool alarmLaut = false;
bool alarmTriggered = false;
bool systemAn = false;
bool countdown = false;
bool tempCountdown = false;
bool kettleCountdown = false;
bool silentMode = false;
long distance = 50;

// IR Tasten-Codes
#define einbruchCode 16724175
#define systemCode 16718055

#define DHTTYPE DHT11
DHT dht_raum(THERMO, DHTTYPE);
DHT dht_wasser(THERMO_WASSER, DHTTYPE);

// Funktionen
void makeStatusOn() {
    digitalWrite(STATUS_LED, HIGH);
}
void makeStatusOff() {
    digitalWrite(STATUS_LED, LOW);
}

void turnKettleOn(const char *payload, size_t length) {
    motor.write(90);
    delay(1000);
    motor.write(0);
    socketClient.emit(UPDATE_KETTLE_ACTIVE_STATE, "true");
    startKettleTime = millis();
    stopKettleTime = startKettleTime + 105000;
    kettleCountdown = true;
}

void handleConnect(const char *payload, size_t length) {
    socketClient.emit(REGISTER_CONTROLLER);
    makeStatusOn();
}

void handleDisconnect(const char *payload, size_t length) {
    makeStatusOff();
}

void handleDisableEvent(const char *payload, size_t length) {
    disableAlarm();
}

void handleEnableSilent(const char *payload, size_t length) {
    silentMode = true;
    socketClient.emit(UPDATE_ALARM_SILENT_MODE_STATE, "true");
}

void handleDisableSilent(const char *payload, size_t length) {
    silentMode = false;
    socketClient.emit(UPDATE_ALARM_SILENT_MODE_STATE, "false");
}

void disableAlarm() {
    einbruchTriggered = false;
    Serial.println("Alarm ausgeschaltet");
    socketClient.emit(UPDATE_ALARM_STATE, "\"disabled\"");
    systemAn = false;
    alarmLaut = false;
    alarmTriggered = false;
    distance = 50;
}

void handleStartEvent(const char *payload, size_t length) {
    startSys();
}

void startSys() {
    systemAn = true;
    countdown = false;
    socketClient.emit(UPDATE_ALARM_STATE, "\"enabled\"");
    Serial.println("System gestartet & Systemstart an Server gemeldet");
}

void alarmCountdown() {
    Serial.println("Countdown vor Alarm läuft.");
    Serial.println(distance);
    startTime = millis();
    stopTime = startTime + 5000;
    einbruchTriggered = true;
}

void alarmTrigger() {
    if (!alarmTriggered) {
        Serial.println("Timer abgelaufen. Stiller Alarm wird laut & an Server gesendet.");
        socketClient.emit(UPDATE_ALARM_STATE, "\"ringing\"");
        if (!silentMode) {
            alarmLaut = true;
        }
        alarmTriggered = true;
    }
    if (!silentMode) {
        digitalWrite(EINBRUCH_LED, HIGH);
        delay(100);
        digitalWrite(EINBRUCH_LED, LOW);
        delay(100);
    }
}

void startAlarmCountdown() {
    Serial.println("Countdown für Alarmanlagen-Start gestartet");
    startTime_System = millis();
    stopTime_System = startTime_System + 3000;
    countdown = true;
}

void kettleTemp() {
    // Wassertemperatur über DHT für HUB auslesen & übermitteln
    float temp_wasser = dht_wasser.readTemperature();
    char result_wasser[8];
    dtostrf(temp_wasser, 6, 2, result_wasser);
    socketClient.emit(UPDATE_KETTLE_TEMP, result_wasser);
    Serial.print("Wasser-Temperatur: ");
    Serial.print(temp_wasser);
    Serial.println(" Grad Celsius");
}

void roomTemp() {
    // Luftfeuchtigkeit & Temperatur für HUB auslesen & übermitteln
    float luft = dht_raum.readHumidity();
    float temp = dht_raum.readTemperature();
    char result_temp[8];
    dtostrf(temp, 6, 2, result_temp);
    socketClient.emit(UPDATE_ROOM_TEMP, result_temp);
    char result_hum[8];
    dtostrf(luft, 6, 2, result_hum);
    socketClient.emit(UPDATE_ROOM_HUMIDITY, result_hum);
    Serial.print("Luftfeuchtigkeit: ");
    Serial.print(luft);
    Serial.println(" %");
    Serial.print("Temperatur: ");
    Serial.print(temp);
    Serial.println(" Grad Celsius");
}

void kettleState() {
    socketClient.emit(UPDATE_KETTLE_ACTIVE_STATE, "false");
    Serial.println("Kettle aus");
    kettleCountdown = false;
}

// Setup
void setup() {
    Serial.begin(115200);

    pinMode(STATUS_LED, OUTPUT);
    pinMode(EINBRUCH_LED, OUTPUT);
    digitalWrite(EINBRUCH_LED, LOW);

    irrecv.enableIRIn();
    motor.attach(SERVO_PIN);
    motor.write(0);

    makeStatusOff();
    noTone(BUZZER);

    dht_raum.begin();
    dht_wasser.begin();

    Serial.println("Connecting WiFi...");
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    // Warten, bis WiFi verbunden ist
    while (WiFi.status() != WL_CONNECTED) {
        delay(200);
        Serial.print(".");
    }

    Serial.println("WiFi connected.");

    // Socket Event Handlers
    socketClient.on("connect", handleConnect);
    socketClient.on("disconnect", handleDisconnect);
    socketClient.on(ACTION_KETTLE_TURN_ON, turnKettleOn);
    socketClient.on(ACTION_ALARM_DISABLE, handleDisableEvent);
    socketClient.on(ACTION_ALARM_ENABLE, handleStartEvent);
    socketClient.on(ACTION_ALARM_ENABLE_SILENT_MODE, handleEnableSilent);
    socketClient.on(ACTION_ALARM_DISABLE_SILENT_MODE, handleDisableSilent);

    Serial.println("Connecting to Server...");
    socketClient.begin(SOCKET_SERVER_ADDRESS, SOCKET_SERVER_PORT);
}

// Loop
void loop() {
    socketClient.loop();

    // Ultraschall-Sensor einschalten
    if (systemAn) {
        distance = einbruchSensor.getCurrentDistance();
    }

    // Bei Aktivität Alarm-Countdown auslösen
    if (distance <= 10 && !einbruchTriggered) {
        alarmCountdown();
    }

    // Nach 5 Sek stiller Alarm -> lauter Alarm + Nachricht an Server
    if (millis() >= stopTime && einbruchTriggered) {
        alarmTrigger();
    }

    // Bei Alarm Buzzer einschalten
    if (alarmLaut) {
        tone(BUZZER, 900);
    } else {
        noTone(BUZZER);
    }

    // Nach Beenden des Alarms LED & Buzzer deaktivieren
    if (!einbruchTriggered) {
        digitalWrite(EINBRUCH_LED, LOW);
        noTone(BUZZER);
    }

    // IR Fernbedienung Eingaben auslesen & verarbeiten
    if (irrecv.decode(&ir_results)) {
        // Wenn auf IR Remote 1 gedrückt wird, Alarm ausschalten
        if (ir_results.value == einbruchCode) {
            disableAlarm();
        }

        // Wenn auf IR Remote 2 gedrückt wird, Alarmanlagen-Start-Countdown starten
        if (ir_results.value == systemCode && !systemAn) {
            startAlarmCountdown();
        }

        irrecv.resume();
    }

    // Wenn Start-Timer abgelaufen ist, Alarmanlage aktivieren
    if (millis() >= stopTime_System && countdown && !systemAn) {
        startSys();
    }

    // Temperatur Countdown starten
    if (!tempCountdown) {
        startTempTime = millis();
        stopTempTime = startTempTime + 5000;
        tempCountdown = true;
    }

    // Nach Ablauf des Countdown (alle 5 Sek.) Temperaturen auslesen & übermitteln
    // Danach Countdown zurücksetzen
    if (millis() >= stopTempTime && tempCountdown) {
        kettleTemp();
        roomTemp();
        tempCountdown = false;
    }

    // Nachdem Countdown abgelaufen ist (Wasser kocht), State an Server senden
    if (millis() >= stopKettleTime && kettleCountdown) {
        kettleState();
    }
}