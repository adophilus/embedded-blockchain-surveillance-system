// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IIoTDevice} from "../core/IoTDevice.sol";

interface IIoTDeviceRegistry {
    event DeviceRegistered(string id, address addr);
    event DeviceHeartbeatUpdated(string id, uint timestamp);

    function create(
        string memory _id,
        string memory _device_code,
        string memory _location,
        IIoTDevice.Status _status,
        string memory _ip_address,
        uint _last_heartbeat
    ) external returns (address _addr);

    function updateHeartbeat(string memory _id, uint _timestamp) external;
    function findById(string memory _id) external view returns (address);
    function list() external view returns (address[] memory);
}
