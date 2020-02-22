#include <Arduino.h>;
#include <Servo.h>;

#define LED D7
#define SERVO D4

Servo motor;

void setup() {
    Serial.begin(9600);
    motor.attach(SERVO);
    pinMode(LED, OUTPUT);
}

void loop() {
    digitalWrite(LED, LOW);
    motor.write(180);
    delay(2000);

    digitalWrite(LED, HIGH);
    motor.write(90);
    delay(2000);

    if (Serial.available() > 0) {
        int incoming = Serial.parseInt();
        Serial.println(incoming);
    }
}