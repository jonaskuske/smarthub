#include <Servo.h>  //Die Servobibliothek wird aufgerufen.

Servo servoblau;

int incoming;

// Erstellt für das Programm ein Servo mit dem Namen
// „servoblau“
void setup() {
    Serial.begin(9600);
    servoblau.attach(8);  // Servo wird mit Pin8 verbunden
}

void loop() {
    if (Serial.available() > 0) {
        incoming = Serial.parseInt();
        if (incoming <= 360 && incoming >= 0 && Serial.read() != -1) {
            Serial.println(incoming);
            servoblau.write(incoming);
        }
    }
    delay(100);
}
