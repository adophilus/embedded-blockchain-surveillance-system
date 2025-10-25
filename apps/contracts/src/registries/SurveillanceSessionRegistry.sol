// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/SurveillanceSession.sol";
import "../common/Errors.sol";
import "./ISurveillanceSessionRegistry.sol";

contract SurveillanceSessionRegistry is ISurveillanceSessionRegistry {
    address public admin;
    uint public sessionCount;
            mapping(uint => address) public sessions;
    mapping(address => bool) public isSession;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function createSession(
        string memory _cid
    ) external onlyAdmin returns (uint sessionId, address sessionAddress) {
        sessionCount++;
        SurveillanceSession newSession = new SurveillanceSession(msg.sender, _cid);
        sessions[sessionCount] = address(newSession);
        isSession[address(newSession)] = true;

        emit SessionCreated(sessionCount, address(newSession));
        return (sessionCount, address(newSession));
    }

    function getSession(uint _sessionId) external view returns (address) {
        if (_sessionId == 0 || _sessionId > sessionCount) revert InvalidId();
        return sessions[_sessionId];
    }
}
