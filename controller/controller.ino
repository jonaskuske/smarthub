#include <Arduino.h>
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

bool einbruchTriggered = false;
#define einbruchCode 16724175

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

    Serial.println("Connecting to Server...");
    socketClient.begin(SOCKET_SERVER_ADDRESS);
}

void loop() {
    socketClient.loop();

    long distance = einbruchSensor.getCurrentDistance();

    if (distance <= 10 && !einbruchTriggered) {
        Serial.println("Alaaaaarm! Einbruch!");
        Serial.println(distance);
        einbruchTriggered = true;
        socketClient.emit(ALARM_TRIGGERED);
        // EVENT AN SERVER SENDEN HIER !
    }

    if (einbruchTriggered) {
        // LED ALARM
        digitalWrite(EINBRUCH_LED, HIGH);
        delay(100);
        digitalWrite(EINBRUCH_LED, LOW);
        delay(100);
    } else if (!einbruchTriggered) {
        digitalWrite(EINBRUCH_LED, LOW);
    }

    // IR FERNBEDIENUNG CODE AUSLESEN (ZUM ABSCHALTEN DES ALARMS)
    if (irrecv.decode(&ir_results)) {
        // Wenn auf IR Remote 1 gedrückt wird, Alarm ausschalten
        if (ir_results.value == einbruchCode) {
            einbruchTriggered = false;
            Serial.println("Einbruch ausgeschaltet");
            // Event Einbruch abgeschaltet an Server senden
        }
        irrecv.resume();
    }
}