// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IoTDevice} from "../core/IoTDevice.sol";
import "../common/Errors.sol";
import "./IIoTDeviceRegistry.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {DeviceAlreadyExists, DeviceNotFound} from "../common/Errors.sol";

contract IoTDeviceRegistry is IIoTDeviceRegistry {
    address public admin;
    mapping(string => address) public devices;
    string[] private deviceIds; // To keep track of all device IDs

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
        IoTDevice.Status _status,
        string memory _ip_address,
        uint _last_heartbeat
    ) external onlyAdmin returns (address _addr) {
        if (devices[_id] != address(0)) revert DeviceAlreadyExists(_id); // Add a check for existing device
        IoTDevice newDevice = new IoTDevice(_id, _device_code, _location, _status, _ip_address, _last_heartbeat);
        devices[_id] = address(newDevice);
        deviceIds.push(_id); // Add the new device ID to the array

        emit DeviceRegistered(_id, address(newDevice));
        return (address(newDevice));
    }

    function updateHeartbeat(string memory _id, uint _timestamp) external onlyAdmin {
        address deviceAddr = devices[_id];
        if (deviceAddr == address(0)) revert DeviceNotFound(_id); // Add a check for non-existent device
        IoTDevice(deviceAddr).updateHeartbeat(_timestamp);
        emit DeviceHeartbeatUpdated(_id, _timestamp);
    }

    function findById(string memory _id) external view returns (address) {
        return devices[_id];
    }

    function list() external view returns (address[] memory) {
        address[] memory allDevices = new address[](deviceIds.length);
        for (uint i = 0; i < deviceIds.length; i++) {
            allDevices[i] = devices[deviceIds[i]];
        }
        return allDevices;
    }
}
