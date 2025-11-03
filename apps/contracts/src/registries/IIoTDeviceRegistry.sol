// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IoTDevice, IoTDeviceStatus} from "../core/IoTDevice.sol"; // Changed

interface IIoTDeviceRegistry {
    event DeviceRegistered(IoTDevice device);
    event DeviceHeartbeatUpdated(string id, uint timestamp);

    function create(
        string memory _id,
        string memory _device_code,
        string memory _location,
        IoTDeviceStatus _status,
        string memory _ip_address,
        uint _last_heartbeat
    ) external returns (IoTDevice memory);

    function updateHeartbeat(string memory _id, uint _timestamp) external;

    function findById(
        string memory _id
    ) external view returns (IoTDevice memory);

    function list() external view returns (IoTDevice[] memory);
}

