// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

enum IoTDeviceStatus {
    ACTIVE,
    INACTIVE,
    MAINTENANCE
}

struct IoTDevice {
    string id;
    string device_code;
    string location;
    IoTDeviceStatus status;
    string ip_address;
    uint last_heartbeat;
    uint created_at;
    uint updated_at;
}

