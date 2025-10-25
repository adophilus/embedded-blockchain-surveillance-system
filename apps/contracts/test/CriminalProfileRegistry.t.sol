// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {CriminalProfileRegistry} from "../src/registries/CriminalProfileRegistry.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract CriminalProfileRegistryTest is Test {
    CriminalProfileRegistry public registry;

    function setUp() public {
        registry = new CriminalProfileRegistry(Config.ADMIN);
    }

    function test_RegisterCriminalProfile() public {
        vm.startPrank(Config.ADMIN);

        string[] memory aliases = new string[](1);
        aliases[0] = "Test Alias";
        string[] memory offenses = new string[](1);
        offenses[0] = "Test Offense";

        uint criminalId = registry.registerCriminalProfile("Test Criminal", aliases, offenses, "QmTestCID");
        assertEq(criminalId, 1);
        assertEq(registry.nextCriminalId(), 2);

        (uint id, string memory name, string[] memory retrievedAliases, string[] memory retrievedOffenses, string memory cid) = registry.getCriminalProfile(criminalId);
        assertEq(id, criminalId);
        assertEq(name, "Test Criminal");
        assertEq(retrievedAliases[0], "Test Alias");
        assertEq(retrievedOffenses[0], "Test Offense");
        assertEq(cid, "QmTestCID");
    }

    function test_RevertWhen_RegisterEmptyName() public {
        vm.startPrank(Config.ADMIN);
        string[] memory aliases = new string[](0);
        string[] memory offenses = new string[](0);
        vm.expectRevert(EmptyName.selector);
        registry.registerCriminalProfile("", aliases, offenses, "QmTestCID");
    }

    function test_UpdateCriminalProfile() public {
        vm.startPrank(Config.ADMIN);

        string[] memory aliases = new string[](1);
        aliases[0] = "Test Alias";
        string[] memory offenses = new string[](1);
        offenses[0] = "Test Offense";
        uint criminalId = registry.registerCriminalProfile("Test Criminal", aliases, offenses, "QmTestCID");

        string[] memory newAliases = new string[](1);
        newAliases[0] = "New Alias";
        string[] memory newOffenses = new string[](1);
        newOffenses[0] = "New Offense";
        registry.updateCriminalProfile(criminalId, "New Name", newAliases, newOffenses, "QmNewCID");

        (uint id, string memory name, string[] memory retrievedAliases, string[] memory retrievedOffenses, string memory cid) = registry.getCriminalProfile(criminalId);
        assertEq(id, criminalId);
        assertEq(name, "New Name");
        assertEq(retrievedAliases[0], "New Alias");
        assertEq(retrievedOffenses[0], "New Offense");
        assertEq(cid, "QmNewCID");
    }

    function test_RevertWhen_UpdateInvalidId() public {
        vm.startPrank(Config.ADMIN);
        string[] memory aliases = new string[](0);
        string[] memory offenses = new string[](0);
        vm.expectRevert(InvalidId.selector);
        registry.updateCriminalProfile(999, "New Name", aliases, offenses, "QmNewCID");
    }
}
