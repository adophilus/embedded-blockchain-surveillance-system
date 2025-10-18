# Smart Contracts Overview

This section provides a high-level overview of the smart contracts developed for the Embedded Blockchain Surveillance System. The contracts are written in Solidity and deployed on a compatible blockchain network.

For detailed technical specifications of each contract, please refer to the [Technical Details](/contracts/technical-details) page.

## Core Contracts

The smart contract suite employs a modular design approach, where core entities of the surveillance system are encapsulated within their own dedicated Solidity contracts. This structure enhances clarity, maintainability, and reusability by separating concerns.

### `SurveillanceEvent.sol`

Defines the `SurveillanceEvent` struct, a fundamental data structure for managing surveillance event records (timestamp, location, IPFS CID, criminal detection status) within the surveillance system. It is a blueprint for event objects, not a deployable contract.

### `CriminalProfile.sol`

Defines the `CriminalProfile` struct, representing a criminal profile in the database. It includes fields for a unique ID, name, aliases, IPFS CID for mugshot and additional information. This is a data structure definition, not a deployable contract.

### `IoTDevice.sol`

Manages surveillance IoT devices, their details (device ID, location, status, IPFS CID for configuration), and the events associated with them. Each `IoTDevice` contract is deployed independently and allows its administrator to register and manage surveillance devices.

### `SurveillanceSession.sol`

Manages the lifecycle of a single surveillance session, including its start and end times, associated IoT devices, video stream storage, and criminal detection results. It interacts with `IoTDevice` contracts and utilizes the `SurveillanceEvent` struct to track events and detection status.

### `SurveillanceSystem.sol`

Serves as the central hub for creating and managing surveillance sessions and criminal profiles. It acts as a factory for `SurveillanceSession` and `IoTDevice` contracts, allowing an administrator to create new sessions and devices and retrieve their addresses. It also handles the recording of surveillance events and their associated IPFS CIDs.