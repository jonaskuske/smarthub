#ifndef controller_config_h
#define controller_config_h

#include "events.h"
#include "pins.h"

const char *WIFI_SSID = "Internet";
const char *WIFI_PASSWORD = "Safety1st";

#ifdef PRODUCTION
const char *SOCKET_SERVER_ADDRESS = "smarthub.jonaskuske.de";
const int SOCKET_SERVER_PORT = 80;
#else
const char *SOCKET_SERVER_ADDRESS = "192.168.0.20";
const int SOCKET_SERVER_PORT = 3030;
#endif

#endif