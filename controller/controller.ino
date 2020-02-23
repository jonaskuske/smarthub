#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Servo.h>
#include <SocketIoClient.h>
#include <pins_arduino.h>
#include "config.h"

SocketIoClient socketClient;

Servo motor;

void turnKettleOn(const char *payload, size_t length) {
    motor.write(90);
    delay(1000);
    motor.write(180);
    socketClient.emit(TURN_KETTLE_ON_SUCCESS);
}

void connectedLED(const char *payload, size_t length) {
    Serial.println("Connected. Green");
    analogWrite(LED_RED, 0);
    analogWrite(LED_GREEN, 255);
}

void disconnectedLED(const char *payload, size_t length) {
    Serial.println("Disonnected. RED");
    analogWrite(LED_GREEN, 0);
    analogWrite(LED_RED, 255);
}

void setup() {
    Serial.begin(115200);

    pinMode(LED_RED, OUTPUT);
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_BLUE, OUTPUT);
    motor.attach(SERVO_PIN);

    analogWrite(LED_RED, 255);

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
    socketClient.on(TURN_KETTLE_ON, turnKettleOn);
    socketClient.on("connect", connectedLED);
    socketClient.on("disconnect", disconnectedLED);
    Serial.println("Connecting to Server...");
    socketClient.begin(SOCKET_SERVER_ADDRESS);

    Serial.println("Controller is ready.");
}

void loop() {
    socketClient.loop();
}