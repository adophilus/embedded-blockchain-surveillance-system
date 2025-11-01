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

    function listEvents() external view returns (string[] memory ids, string[][] memory criminal_profile_ids, string[] memory cids, string[] memory device_codes, uint[] memory created_ats) {
        uint eventCount = eventIds.length;
        ids = new string[](eventCount);
        criminal_profile_ids = new string[][](eventCount);
        cids = new string[](eventCount);
        device_codes = new string[](eventCount);
        created_ats = new uint[](eventCount);

        for (uint i = 0; i < eventCount; i++) {
            string memory eventId = eventIds[i];
            SurveillanceEvent memory e = events[eventId];
            ids[i] = e.id;
            criminal_profile_ids[i] = e.criminal_profile_ids;
            cids[i] = e.cid;
            device_codes[i] = e.device_code;
            created_ats[i] = e.created_at;
        }
    }

    function recordEvent(string memory _id, string[] memory _criminal_profile_ids, string memory _cid, string memory _device_code) external returns (string memory) {
        if (status != ISurveillanceSessionRegistry.SessionStatus.ACTIVE) revert SessionNotActive();
        
        SurveillanceEvent memory newEvent = SurveillanceEvent({
            id: _id,
            criminal_profile_ids: _criminal_profile_ids,
            cid: _cid,
            device_code: _device_code,
            created_at: block.timestamp
        });

        events[_id] = newEvent;
        eventIds.push(_id);

        emit EventRecorded(_id);
        return _id;
    }
}
