// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IIoTDevice} from "./IIoTDevice.sol";
import "../common/Errors.sol";

contract IoTDevice is IIoTDevice {
    string private id;
    string private device_code;
    string private location;
    Status private status;
    string private ip_address;
    uint private last_heartbeat;

    constructor(string memory _id, string memory _device_code, string memory _location, IIoTDevice.Status _status, string memory _ip_address, uint _last_heartbeat) {
        id = _id;
        device_code = _device_code;
        location = _location;
        status = _status;
        ip_address = _ip_address;
        last_heartbeat = _last_heartbeat;
    }

    function get() external view returns (string memory, string memory, string memory, Status, string memory, uint) {
        return (id, device_code, location, status, ip_address, last_heartbeat);
    }

    function updateHeartbeat(uint _new_heartbeat) external {
        last_heartbeat = _new_heartbeat;
    }
}