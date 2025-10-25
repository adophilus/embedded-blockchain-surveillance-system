// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISurveillanceSessionRegistry {
    event SessionCreated(uint indexed sessionId, address sessionAddress);

    function sessionCount() external view returns (uint);
    function isSession(address) external view returns (bool);

    function createSession(string memory _cid) external returns (uint sessionId, address sessionAddress);
}
