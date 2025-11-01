// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IoTDevice} from "../core/IoTDevice.sol";
import "../common/Errors.sol";
import "./IIoTDeviceRegistry.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract IoTDeviceRegistry is IIoTDeviceRegistry {
    address public admin;
            mapping(string => address) public devices;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function register(
        string memory _id,
        string memory _device_code,
        string memory _location,
        IoTDevice.Status _status,
        string memory _ip_address,
        uint _last_heartbeat
    ) external onlyAdmin returns (address _addr) {
        IoTDevice newDevice = new IoTDevice(_id, _device_code, _location, _status, _ip_address, _last_heartbeat);
        devices[_id] = address(newDevice);

        emit DeviceRegistered(_id, address(newDevice));
        return (address(newDevice));
    }

    function findById(string memory _id) external view returns (address) {
        return devices[_id];
    }
}
