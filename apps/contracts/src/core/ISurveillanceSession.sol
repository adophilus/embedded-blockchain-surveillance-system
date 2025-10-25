// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceEvent, Detection} from "./SurveillanceEvent.sol";

interface ISurveillanceSession {
    event SessionStarted(uint startTime, uint endTime);
    event DeviceAdded(address indexed device);
    event EventRecorded(
        uint indexed eventId,
        address indexed device,
        uint created_at
    );
    event SessionEnded();

    function admin() external view returns (address);

    function startTime() external view returns (uint);

    function endTime() external view returns (uint);

    function sessionStarted() external view returns (bool);

    function sessionEnded() external view returns (bool);

    function cid() external view returns (string memory);

    function associatedDevices(address) external view returns (bool);

    function deviceEventCounts(address) external view returns (uint);

    function startSession(uint _startTime, uint _endTime) external;

    function endSession() external;

    function addDevice(address _device) external;

    function recordEvent(
        string memory _id,
        string[] memory _criminal_profile_ids,
        string memory _device_id,
        string memory _session_id,
        uint _created_at
    ) external returns (uint);

    function getAllEvents()
        external
        view
        returns (
            string[] memory ids,
            string[][] memory criminal_profile_ids,
            string[] memory device_ids,
            string[] memory session_ids,
            uint[] memory created_ats
        );

    function getEventCount() external view returns (uint);

    function getSessionResults()
        external
        view
        returns (
            address[] memory devices,
            uint[] memory eventCounts,
            bool[] memory detectionStatus
        );
}
