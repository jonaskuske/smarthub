#ifndef DistanceController_h
#define DistanceController_h

#include "Arduino.h"

/**
 * Klasse zur Ansteuerung eines Ultraschall-Sensors
 */
class DistanceController {
 public:
  DistanceController(int triggerPin, int echoPin);
  long getCurrentDistance();

 private:
  int _triggerPin, _echoPin;
  void _sendPulse();
};

#endif
