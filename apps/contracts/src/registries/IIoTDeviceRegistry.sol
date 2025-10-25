// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IIoTDeviceRegistry {
    event DeviceRegistered(uint indexed deviceId, address deviceAddress);

    function deviceCount() external view returns (uint);
    function isDevice(address) external view returns (bool);

    function registerDevice(string memory _deviceId, string memory _location, string memory _cid) external returns (uint deviceId, address deviceAddress);
}
