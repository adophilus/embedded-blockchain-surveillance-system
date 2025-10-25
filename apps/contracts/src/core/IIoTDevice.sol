// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceEvent, Detection} from "./SurveillanceEvent.sol";

interface IIoTDevice {
    event EventRecorded(uint indexed eventId, uint timestamp);

    function deviceId() external view returns (string memory);

    function location() external view returns (string memory);

    function cid() external view returns (string memory);

    function admin() external view returns (address);

    function eventCount() external view returns (uint);

    function active() external view returns (bool);

    /**
     * Create a SurveillanceEvent. The interface accepts the full event payload
     * so implementers have everything required to persist the event.
     */
    function recordEvent(
        string memory _id,
        string[] memory _criminal_profile_ids,
        string memory _device_id,
        string memory _session_id,
        uint _created_at
    ) external returns (uint);

    function getEvent(
        uint _eventId
    )
        external
        view
        returns (
            string memory id,
            string[] memory criminal_profile_ids,
            string memory device_id,
            string memory session_id,
            uint created_at
        );

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
}
