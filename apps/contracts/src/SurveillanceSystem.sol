// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ISurveillanceSystem.sol";
import "./registries/ICriminalProfileRegistry.sol";
import "./registries/IIoTDeviceRegistry.sol";
import "./registries/ISurveillanceSessionRegistry.sol";
import "./common/Errors.sol";

contract SurveillanceSystem is ISurveillanceSystem {
    address public admin;
    address public criminalProfileRegistry;
    address public iotDeviceRegistry;
    address public surveillanceSessionRegistry;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(
        address _criminalProfileRegistry,
        address _iotDeviceRegistry,
        address _surveillanceSessionRegistry
    ) {
        admin = msg.sender;
        criminalProfileRegistry = _criminalProfileRegistry;
        iotDeviceRegistry = _iotDeviceRegistry;
        surveillanceSessionRegistry = _surveillanceSessionRegistry;
    }
}
