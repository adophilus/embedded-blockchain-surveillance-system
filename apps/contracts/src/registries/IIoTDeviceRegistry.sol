// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IIoTDevice} from "../core/IoTDevice.sol";

interface IIoTDeviceRegistry {
    event DeviceRegistered(string id, address addr);

    function register(
        string memory _id,
        string memory _device_code,
        string memory _location,
        IIoTDevice.Status _status,
        string memory _ip_address,
        uint _last_heartbeat
) external returns (address _addr);
    function findById(string memory _id) external view returns (address);
}
