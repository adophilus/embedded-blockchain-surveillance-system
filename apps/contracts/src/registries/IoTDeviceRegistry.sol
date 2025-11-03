// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IoTDevice, IoTDeviceStatus} from "../core/IoTDevice.sol";
import "../common/Errors.sol";
import "./IIoTDeviceRegistry.sol";

contract IoTDeviceRegistry is IIoTDeviceRegistry {
    address public admin;
    mapping(string => IoTDevice) public devices;
    string[] private deviceIds;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function create(
        string memory _id,
        string memory _device_code,
        string memory _location,
        IoTDeviceStatus _status,
        string memory _ip_address,
        uint _last_heartbeat
    ) external onlyAdmin returns (IoTDevice memory) {
        if (bytes(devices[_id].id).length != 0) revert DeviceAlreadyExists(_id);

        IoTDevice memory newDevice = IoTDevice({
            id: _id,
            device_code: _device_code,
            location: _location,
            status: _status,
            ip_address: _ip_address,
            last_heartbeat: _last_heartbeat
        });

        devices[_id] = newDevice;
        deviceIds.push(_id); // Add the new device ID to the array

        emit DeviceRegistered(newDevice);
        return newDevice;
    }

    function updateHeartbeat(
        string memory _id,
        uint _timestamp
    ) external onlyAdmin {
        if (bytes(devices[_id].id).length == 0) revert DeviceNotFound(_id);
        devices[_id].last_heartbeat = _timestamp;
        emit DeviceHeartbeatUpdated(_id, _timestamp);
    }

    function findById(
        string memory _id
    ) external view returns (IoTDevice memory) {
        if (bytes(devices[_id].id).length == 0) revert DeviceNotFound(_id);
        return devices[_id];
    }

    function list() external view returns (IoTDevice[] memory) {
        IoTDevice[] memory allDevices = new IoTDevice[](deviceIds.length);
        for (uint i = 0; i < deviceIds.length; i++) {
            allDevices[i] = devices[deviceIds[i]];
        }
        return allDevices;
    }
}

