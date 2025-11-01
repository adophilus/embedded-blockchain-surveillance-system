// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ISurveillanceSession.sol";
import "../common/Errors.sol";
import "./SurveillanceEvent.sol";

contract SurveillanceSession is ISurveillanceSession {
    string public id;
    address public admin;
    string public title;
    string public description;
    uint public start_timestamp;
    uint public end_timestamp;
    ISurveillanceSessionRegistry.SessionStatus public status;
    uint public created_at;
    uint public updated_at;

    mapping(string => SurveillanceEvent) public events;
    string[] public eventIds;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin, string memory _id, string memory _title, string memory _description, uint _start_timestamp, uint _end_timestamp, ISurveillanceSessionRegistry.SessionStatus _status) {
        admin = _admin;
        id = _id;
        title = _title;
        description = _description;
        start_timestamp = _start_timestamp;
        end_timestamp = _end_timestamp;
        status = _status;
        created_at = block.timestamp;
        updated_at = block.timestamp;
    }

    function get() external view returns (string memory, string memory, string memory, uint, uint, ISurveillanceSessionRegistry.SessionStatus, uint, uint) {
        return (id, title, description, start_timestamp, end_timestamp, status, created_at, updated_at);
    }

    function recordEvent(string memory _id, string[] memory _criminal_profile_ids, string memory _cid, string memory _device_id) external returns (string memory) {
        if (status != ISurveillanceSessionRegistry.SessionStatus.ACTIVE) revert SessionNotActive();
        
        Detection[] memory detections = new Detection[](_criminal_profile_ids.length);
        for (uint i = 0; i < _criminal_profile_ids.length; i++) {
            detections[i] = Detection(_criminal_profile_ids[i]);
        }

        SurveillanceEvent memory newEvent = SurveillanceEvent({
            id: _id,
            sessionId: id,
            deviceId: _device_id,
            timestamp: block.timestamp,
            detections: detections,
            cid: _cid,
            createdAt: block.timestamp
        });

        events[_id] = newEvent;
        eventIds.push(_id);

        emit EventRecorded(_id);
        return _id;
    }
}
