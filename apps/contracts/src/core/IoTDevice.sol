// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct IoTDevice {
    string id;
    string device_code;
    string location;
    Status status;
    string ip_address;
    uint last_heartbeat;
}