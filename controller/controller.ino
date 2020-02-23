#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Servo.h>
#include <SocketIoClient.h>
#include <pins_arduino.h>
#include "config.h"

SocketIoClient socketClient;

void turnKettleOn(const char *payload, size_t length) {
    motor.write(90);
    delay(1000);
    motor.write(180);
    //digitalWrite(LED_PIN, HIGH);
    socketClient.emit(TURN_KETTLE_ON_SUCCESS);
}

Servo motor;

void setup() {
    Serial.begin(115200);

    // pinMode(LED_PIN, OUTPUT);
    motor.attach(SERVO_PIN);

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

    Serial.println("Connecting to Server...");
    socketClient.begin(SOCKET_SERVER_ADDRESS);

    Serial.println("Controller is ready.");
}

void loop() {
    socketClient.loop();
}