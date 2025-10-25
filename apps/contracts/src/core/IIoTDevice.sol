// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceEvent} from "./SurveillanceEvent.sol";

interface IIoTDevice {
    event EventRecorded(uint indexed eventId, uint timestamp);

    function deviceId() external view returns (string memory);

    function location() external view returns (string memory);

    function cid() external view returns (string memory);

    function admin() external view returns (address);

    function eventCount() external view returns (uint);

    function events(
        uint
    )
        external
        view
        returns (
            string id,
            Detection[] detections,
            string device_id,
            string session_id,
            uint created_at
        );

    function active() external view returns (bool);

    function recordEvent(
        uint _timestamp,
        bool _detected
    ) external returns (uint);

    function getEvent(
        uint _eventId
    )
        external
        view
        returns (
            string id,
            Detection[] detections,
            string device_id,
            string session_id,
            uint created_at
        );

    function getAllEvents()
        external
        view
        returns (uint[] memory timestamps, bool[] memory detections);
}
