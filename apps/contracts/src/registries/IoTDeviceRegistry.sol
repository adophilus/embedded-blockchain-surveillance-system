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
        string memory _device_code,
        string memory _location,
        string memory _cid
    ) external onlyAdmin returns (uint device_code, address deviceAddress) {
        deviceCount++;
        string memory id = string(abi.encodePacked(_device_code, block.timestamp));
        IoTDevice newDevice = new IoTDevice(id, _device_code, _location, _cid, msg.sender);
        devices[deviceCount] = address(newDevice);
        isDevice[address(newDevice)] = true;

        emit DeviceRegistered(deviceCount, address(newDevice));
        return (deviceCount, address(newDevice));
    }

    function getDevice(uint _device_code) external view returns (address) {
        if (_device_code == 0 || _device_code > deviceCount) revert InvalidId();
        return devices[_device_code];
    }
}
