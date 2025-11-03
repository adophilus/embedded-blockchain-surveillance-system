// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Status} from "../src/core/SurveillanceSession.sol";
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

        string memory id = "1";
        string memory sessionId = registry.create(
            id,
            "Test Session",
            "Test Description",
            block.timestamp,
            block.timestamp + 1 hours,
            Status.UPCOMING
        );
        assertEq(registry.findById(id).id, sessionId);
    }
}
