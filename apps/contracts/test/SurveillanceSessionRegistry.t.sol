// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {SurveillanceSessionRegistry} from "../src/registries/SurveillanceSessionRegistry.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract SurveillanceSessionRegistryTest is Test {
    SurveillanceSessionRegistry public registry;

    function setUp() public {
        registry = new SurveillanceSessionRegistry(Config.ADMIN);
    }

    function test_CreateSession() public {
        vm.startPrank(Config.ADMIN);

        (uint sessionId, address sessionAddress) = registry.createSession("QmCID1");
        assertEq(sessionId, 1);
        assertNotEq(sessionAddress, address(0));
        assertEq(registry.sessionCount(), 1);
        assertEq(registry.getSession(1), sessionAddress);
        assertTrue(registry.isSession(sessionAddress));
    }

    function test_RevertWhen_GetInvalidSession() public {
        vm.expectRevert(InvalidId.selector);
        registry.getSession(999);
    }
}
