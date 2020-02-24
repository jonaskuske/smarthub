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

int buttonState = 0;
bool einbruchTriggered = false;
bool alarmLaut = false;
bool systemAn = false;
bool countdown = false;
bool tempCountdown = false;
long distance = 50;

#define einbruchCode 16724175
#define systemCode 16718055

#define DHTTYPE DHT11
DHT dht(THERMO, DHTTYPE);

void makeStatusGreen() {
    analogWrite(STATUS_LED_GREEN, 255);
    analogWrite(STATUS_LED_RED, 0);
}
void makeStatusRed() {
    analogWrite(STATUS_LED_GREEN, 0);
    analogWrite(STATUS_LED_RED, 255);
}

void turnKettleOn(const char *payload, size_t length) {
    motor.write(90);
    delay(1000);
    motor.write(0);
    socketClient.emit(TURN_KETTLE_ON_SUCCESS);
}

void handleConnect(const char *payload, size_t length) {
    socketClient.emit(REGISTER_CONTROLLER);
    makeStatusGreen();
}

void handleDisconnect(const char *payload, size_t length) {
    makeStatusRed();
}

void handleDisableEvent(const char *payload, size_t length) {
    disableAlarm();
}

void disableAlarm() {
    einbruchTriggered = false;
    Serial.println("Alarm ausgeschaltet");
    if (alarmLaut) {
        socketClient.emit(ALARM_DISABLED);
    }
    systemAn = false;
    alarmLaut = false;
}

void handleStartEvent(const char *payload, size_t length) {
    startSys();
}

void startSys() {
    systemAn = true;
    countdown = false;
    socketClient.emit(SYS_STARTED);
    Serial.println("System gestartet & Systemstart an Server gemeldet");
}

void setup() {
    Serial.begin(115200);

    pinMode(STATUS_LED_RED, OUTPUT);
    pinMode(STATUS_LED_GREEN, OUTPUT);
    pinMode(STATUS_LED_BLUE, OUTPUT);
    pinMode(EINBRUCH_LED, OUTPUT);
    irrecv.enableIRIn();

    motor.attach(SERVO_PIN);
    makeStatusRed();
    digitalWrite(EINBRUCH_LED, LOW);
    motor.write(0);

    dht.begin();

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
    socketClient.on(TURN_KETTLE_ON, turnKettleOn);
    socketClient.on(DISABLE_ALARM, handleDisableEvent);
    socketClient.on(START_SYS, handleStartEvent);

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
            socketClient.emit(ALARM_TRIGGERED);
            alarmLaut = true;
        }
        digitalWrite(EINBRUCH_LED, HIGH);
        delay(100);
        digitalWrite(EINBRUCH_LED, LOW);
        delay(100);
    }

    if (!einbruchTriggered) {
        digitalWrite(EINBRUCH_LED, LOW);
    }

    // IR FERNBEDIENUNG CODE AUSLESEN (ZUM ABSCHALTEN DES ALARMS)
    if (irrecv.decode(&ir_results)) {
        // Wenn auf IR Remote 1 gedrückt wird, Alarm ausschalten
        if (ir_results.value == einbruchCode) {
            disableAlarm();
        }

        if (ir_results.value == systemCode && !systemAn) {
            // wenn Counter abgelaufen
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

    Vo = analogRead(THERMO_TEST);
    R2 = R1 * (1023.0 / (float)Vo - 1.0);
    logR2 = log(R2);
    T = (1.0 / (c1 + c2 * logR2 + c3 * logR2 * logR2 * logR2));
    T = T - 273.15;

    delay(500);

    if (!tempCountdown) {
        startTempTime = millis();
        stopTempTime = startTempTime + 5000;
        tempCountdown = true;
    }
    if (millis() >= stopTempTime) {
        char result[8];
        dtostrf(T, 6, 2, result);
        socketClient.emit(TEMPERATUR, result);
        Serial.println(result);
        Serial.print("Temperature: ");
        Serial.print(T);
        Serial.println(" C");
        tempCountdown = false;
    }
}