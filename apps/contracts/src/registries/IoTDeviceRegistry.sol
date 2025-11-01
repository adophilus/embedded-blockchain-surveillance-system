// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IoTDevice} from "../core/IoTDevice.sol";
import "../common/Errors.sol";
import "./IIoTDeviceRegistry.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract IoTDeviceRegistry is IIoTDeviceRegistry {
    address public admin;
    uint public deviceCount;
            mapping(string => address) public devices;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function register(
        string memory _device_code,
        string memory _location,
        IoTDevice.Status _status,
        string memory _ip_address,
        uint _last_heartbeat
    ) external onlyAdmin returns (string memory _id, address _addr) {
        deviceCount++;
        string memory id = Strings.toString(deviceCount);
        IoTDevice newDevice = new IoTDevice(id, _device_code, _location, _status, _ip_address, _last_heartbeat);
        devices[id] = address(newDevice);

        emit DeviceRegistered(id, address(newDevice));
        return (id, address(newDevice));
    }

    function findById(string memory _id) external view returns (address) {
        return devices[_id];
    }
}
