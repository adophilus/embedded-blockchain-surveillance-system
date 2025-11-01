// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {SurveillanceSessionRegistry} from "../src/registries/SurveillanceSessionRegistry.sol";
import {ISurveillanceSessionRegistry} from "../src/registries/ISurveillanceSessionRegistry.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract SurveillanceSessionRegistryTest is Test {
    SurveillanceSessionRegistry public registry;

    function setUp() public {
        registry = new SurveillanceSessionRegistry(Config.ADMIN);
    }

    function test_CreateSession() public {
        vm.startPrank(Config.ADMIN);

        (string memory sessionId, address sessionAddress) = registry.create("Test Session", "Test Description", block.timestamp, block.timestamp + 1 hours, ISurveillanceSessionRegistry.SessionStatus.UPCOMING);
        assertNotEq(sessionAddress, address(0));
        assertEq(registry.findById(sessionId), sessionAddress);
    }
}
