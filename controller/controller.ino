#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include "config.h"

SocketIoClient socketClient;

void turnLedOn(const char *payload, size_t length) {
    digitalWrite(LED_PIN, HIGH);
    socketClient.emit(TURN_LED_ON_SUCCESS);
}

void setup() {
    Serial.begin(115200);

    pinMode(LED_PIN, OUTPUT);

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
    socketClient.on(TURN_LED_ON, turnLedOn);

    Serial.println("Connecting to Server...");
    socketClient.begin(SOCKET_SERVER_ADDRESS);

    Serial.println("Controller is ready.");
}

void loop() {
    socketClient.loop();
}