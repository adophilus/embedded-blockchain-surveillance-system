// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ISurveillanceSession.sol";
import "../common/Errors.sol";
import "./SurveillanceEvent.sol";

contract SurveillanceSession is ISurveillanceSession {
    address public admin;
    string public title;
    string public description;
    uint public start_timestamp;
    uint public end_timestamp;
    ISurveillanceSessionRegistry.SessionStatus public status;

    mapping(address => bool) public associatedDevices;
    mapping(address => uint) public deviceEventCounts;
    mapping(uint => SurveillanceEvent) public events;
    uint private eventCount;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyAssociatedDevice() {
        if (!associatedDevices[msg.sender]) revert NotRegistered();
        _;
    }

    constructor(address _admin, string memory _title, string memory _description, uint _start_timestamp, uint _end_timestamp, ISurveillanceSessionRegistry.SessionStatus _status) {
        admin = _admin;
        title = _title;
        description = _description;
        start_timestamp = _start_timestamp;
        end_timestamp = _end_timestamp;
        status = _status;
    }

    function addDevice(address _device) external onlyAdmin {
        if (status != ISurveillanceSessionRegistry.SessionStatus.ACTIVE) revert SessionNotActive();
        if (_device == address(0)) revert InvalidAddress();

        associatedDevices[_device] = true;
    }

    function recordEvent(uint _timestamp, bool _detected) external onlyAssociatedDevice returns (uint) {
        if (status != ISurveillanceSessionRegistry.SessionStatus.ACTIVE) revert SessionNotActive();
        eventCount++;
        events[eventCount] = SurveillanceEvent(_timestamp, _detected);
        deviceEventCounts[msg.sender]++;
        emit EventRecorded(eventCount, msg.sender, _timestamp);
        return eventCount;
    }
}