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

int Vo;
float R1 = 10000;
float logR2, R2, T;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;

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
bool systemAn = false;
bool countdown = false;
bool tempCountdown = false;
bool kettleCountdown = false;
long distance = 50;

#define einbruchCode 16724175
#define systemCode 16718055

#define DHTTYPE DHT11
DHT dht_raum(THERMO, DHTTYPE);
DHT dht_wasser(THERMO_WASSER, DHTTYPE);

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
    // char kettleState[8];
    // dtostrf(true, 6, 2, kettleState);
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

void disableAlarm() {
    einbruchTriggered = false;
    Serial.println("Alarm ausgeschaltet");
    // char alarmStateDisabled[8];
    // dtostrf("disabled", 6, 2, alarmStateDisabled);
    socketClient.emit(UPDATE_ALARM_STATE, "\"disabled\"");
    systemAn = false;
    alarmLaut = false;
    distance = 50;
}

void handleStartEvent(const char *payload, size_t length) {
    startSys();
}

void startSys() {
    systemAn = true;
    countdown = false;
    // char alarmStateEnabled[8];
    // dtostrf("enabled", 6, 2, alarmStateEnabled);
    socketClient.emit(UPDATE_ALARM_STATE, "\"enabled\"");
    Serial.println("System gestartet & Systemstart an Server gemeldet");
}

void setup() {
    Serial.begin(115200);

    pinMode(STATUS_LED, OUTPUT);
    pinMode(EINBRUCH_LED, OUTPUT);
    irrecv.enableIRIn();

    motor.attach(SERVO_PIN);
    makeStatusOff();
    digitalWrite(EINBRUCH_LED, LOW);
    motor.write(0);

    noTone(BUZZER);

    dht_raum.begin();
    dht_wasser.begin();

    Serial.println("Connecting WiFi...");
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    // Wait until WiFi is connected
    while (WiFi.status() != WL_CONNECTED) {
        delay(200);
        Serial.print(".");
    }

    Serial.println("WiFi connected.");

    // Attach socket event handlers
    socketClient.on("connect", handleConnect);
    socketClient.on("disconnect", handleDisconnect);
    socketClient.on(ACTION_KETTLE_TURN_ON, turnKettleOn);
    socketClient.on(ACTION_ALARM_DISABLE, handleDisableEvent);
    socketClient.on(ACTION_ALARM_ENABLE, handleStartEvent);

    Serial.println("Connecting to Server...");
    socketClient.begin(SOCKET_SERVER_ADDRESS, SOCKET_SERVER_PORT);
}

void loop() {
    socketClient.loop();

    if (systemAn) {
        distance = einbruchSensor.getCurrentDistance();
    }

    if (distance <= 10 && !einbruchTriggered) {
        Serial.println("Stiller Alarm ausgelöst. Countdown läuft.");
        Serial.println(distance);
        startTime = millis();
        stopTime = startTime + 5000;
        einbruchTriggered = true;
    }

    if (millis() >= stopTime && einbruchTriggered) {
        if (!alarmLaut) {
            Serial.println("Timer abgelaufen. Stiller Alarm wird laut & an Server gesendet.");
            // char alarmStateRinging[8];
            // dtostrf("ringing", 6, 2, alarmStateRinging);
            socketClient.emit(UPDATE_ALARM_STATE, "\"ringing\"");
            alarmLaut = true;
        }
        digitalWrite(EINBRUCH_LED, HIGH);
        delay(100);
        digitalWrite(EINBRUCH_LED, LOW);
        delay(100);
    }

    if (alarmLaut) {
        tone(BUZZER, 900);
    } else {
        noTone(BUZZER);
    }

    if (!einbruchTriggered) {
        digitalWrite(EINBRUCH_LED, LOW);
        noTone(BUZZER);
    }

    // IR FERNBEDIENUNG CODE AUSLESEN (ZUM ABSCHALTEN DES ALARMS)
    if (irrecv.decode(&ir_results)) {
        // Wenn auf IR Remote 1 gedrückt wird, Alarm ausschalten
        if (ir_results.value == einbruchCode) {
            disableAlarm();
        }

        if (ir_results.value == systemCode && !systemAn) {
            // Wenn auf IR Remote 2 gedrückt wird, System-Start-Countdown starten
            Serial.println("Countdown für System-Start gestartet");
            startTime_System = millis();
            stopTime_System = startTime_System + 3000;
            countdown = true;
        }

        irrecv.resume();
    }

    if (millis() >= stopTime_System && countdown && !systemAn) {
        startSys();
    }

    if (!tempCountdown) {
        startTempTime = millis();
        stopTempTime = startTempTime + 5000;
        tempCountdown = true;
    }
    if (millis() >= stopTempTime && tempCountdown) {
        // Wassertemperatur über DHT für HUB auslesen & übermitteln
        float temp_wasser = dht_wasser.readTemperature();
        char result_wasser[8];
        dtostrf(temp_wasser, 6, 2, result_wasser);
        socketClient.emit(UPDATE_KETTLE_TEMP, result_wasser);
        Serial.print("Wasser-Temperatur: ");
        Serial.print(temp_wasser);
        Serial.println(" Grad Celsius");

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

        tempCountdown = false;
    }

    if (millis() >= stopKettleTime && kettleCountdown) {
        // char kettleState[8];
        //dtostrf(false, 6, 2, kettleState);
        socketClient.emit(UPDATE_KETTLE_ACTIVE_STATE, "false");
        Serial.println("Kettle aus");
        kettleCountdown = false;
    }
    // Kettle Status auf False nach 95 Sek.
}