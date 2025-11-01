// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/IoTDevice.sol";
import "../common/Errors.sol";
import "./IIoTDeviceRegistry.sol";

contract IoTDeviceRegistry is IIoTDeviceRegistry {
    address public admin;
    uint public deviceCount;
            mapping(uint => address) public devices;
    mapping(address => bool) public isDevice;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function registerDevice(
        string memory _deviceId,
        string memory _location,
        string memory _cid
    ) external onlyAdmin returns (uint deviceId, address deviceAddress) {
        deviceCount++;
        string memory id = string(abi.encodePacked(_deviceId, block.timestamp));
        IoTDevice newDevice = new IoTDevice(id, _deviceId, _location, _cid, msg.sender);
        devices[deviceCount] = address(newDevice);
        isDevice[address(newDevice)] = true;

        emit DeviceRegistered(deviceCount, address(newDevice));
        return (deviceCount, address(newDevice));
    }

    function getDevice(uint _deviceId) external view returns (address) {
        if (_deviceId == 0 || _deviceId > deviceCount) revert InvalidId();
        return devices[_deviceId];
    }
}
