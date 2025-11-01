// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IIoTDevice.sol";
import "../common/Errors.sol";

contract IoTDevice is IIoTDevice {
    string public id;
    string public device_code;
    string public location;
    string public cid;
    address public admin;
    uint public eventCount;
    mapping(uint => SurveillanceEvent) private events;
    bool public active;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(string memory _id, string memory _device_code, string memory _location, string memory _cid, address _admin) {
        id = _id;
        device_code = _device_code;
        location = _location;
        cid = _cid;
        admin = _admin;
        active = true;
    }
}
