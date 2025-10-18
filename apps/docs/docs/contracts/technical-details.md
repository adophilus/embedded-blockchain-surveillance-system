# Smart Contracts Technical Details

This section provides detailed information about the smart contracts developed for the Embedded Blockchain Surveillance System. The contracts are written in Solidity and deployed on a compatible blockchain network.

## Contract Architecture: Modular Design

The smart contract suite employs a modular design approach, where core entities of the surveillance system are encapsulated within their own dedicated Solidity contracts. This "hybrid" structure enhances clarity, maintainability, and reusability by separating concerns.

Specifically, the following core entities each have their own contract, located in `apps/contracts/src/core/`:

*   **`SurveillanceEvent.sol`**: Manages surveillance event-specific data and logic.
*   **`SurveillanceSession.sol`**: Handles surveillance session parameters, state, and event recording.
*   **`IoTDevice.sol`**: Defines surveillance IoT devices and their associated information.
*   **`CriminalProfile.sol`**: Manages criminal profiles and their eligibility for detection.

This separation allows for independent development, testing, and potential upgrades of each component, while the main `SurveillanceSystem.sol` contract orchestrates interactions between these core modules.

### `SurveillanceEvent.sol`

This file defines the `SurveillanceEvent` struct, which is a fundamental data structure used to manage surveillance event records within the surveillance system. It is not a contract itself, but rather a blueprint for event objects.

**Key Fields:**

*   `timestamp` (uint): Unix timestamp when the surveillance event was recorded.
*   `detected` (bool): Tracks whether a criminal was detected during this surveillance event.

### `CriminalProfile.sol`

This file defines the `CriminalProfile` struct, representing a criminal profile in the database. Similar to `SurveillanceEvent.sol`, this is a data structure definition, not a deployable contract.

**Key Fields:**

*   `id` (uint): A unique identifier for the criminal profile.
*   `name` (string): The full name of the criminal.
*   `aliases` (string): Known aliases of the suspect.
*   `cid` (string): An IPFS Content Identifier (CID) pointing to mugshot and additional criminal information.

### `IoTDevice.sol`

The `IoTDevice` contract manages surveillance IoT devices, their details, and the events associated with them. Each `IoTDevice` contract is deployed independently and is responsible for its own set of surveillance events.

**State Variables:**

*   `deviceId` (string): The unique identifier for the IoT device.
*   `location` (string): The location where the device is installed.
*   `cid` (string): An IPFS Content Identifier (CID) for the device's configuration or metadata.
*   `admin` (address): The address of the administrator who deployed this device contract and has privileges to register surveillance events.
*   `eventCount` (uint): A counter for the total number of events recorded by this device.
*   `events` (mapping(uint => SurveillanceEvent)): A mapping from an event ID to its `SurveillanceEvent` struct.
*   `active` (bool): A flag indicating whether the device is currently active for surveillance.

**Events:**

*   `EventRecorded(uint indexed eventId, uint timestamp, bool detected)`: Emitted when a new surveillance event is successfully recorded.

**Functions:**

*   `constructor(string memory _deviceId, string memory _location, string memory _cid)`: Initializes the device with a unique ID, location, CID, and sets the deployer as the admin.
*   `recordEvent(uint _timestamp, bool _detected) external onlyAdmin returns (uint)`: Allows the admin to record a new surveillance event for the device. Returns the event ID.
*   `getEvent(uint _eventId) external view returns (uint timestamp, bool detected)`: Retrieves the details of a specific event by its ID.
*   `getAllEvents() external view returns (uint[] memory timestamps, bool[] memory detections)`: Returns arrays containing the details of all recorded events for the device.

### `SurveillanceSession.sol`

The `SurveillanceSession` contract manages the lifecycle of a single surveillance session, including its start and end times, associated IoT devices, video stream storage, and criminal detection results. It relies on the `SurveillanceEvent` struct and interacts with `IoTDevice` contracts.

**State Variables:**

*   `admin` (address): The address of the surveillance session administrator, typically the deployer of this contract.
*   `startTime` (uint): The Unix timestamp when the surveillance session officially begins.
*   `endTime` (uint): The Unix timestamp when the surveillance session officially ends.
*   `sessionStarted` (bool): A flag indicating whether the surveillance session has started.
*   `sessionEnded` (bool): A flag indicating whether the surveillance session has ended.
*   `cid` (string): An IPFS Content Identifier (CID) for the stored video stream or surveillance-related media.
*   `associatedDevices` (mapping(address => bool)): A mapping to track which `IoTDevice` contracts are participating in this surveillance session.
*   `deviceEventCounts` (mapping(address => uint)): Stores the event counts for each associated IoT device. `deviceAddress => eventCount`.
*   `events` (mapping(uint => SurveillanceEvent)): Manages the surveillance events using the `SurveillanceEvent` struct.

**Events:**

*   `SessionStarted(uint startTime, uint endTime)`: Emitted when the surveillance session officially begins.
*   `DeviceAdded(address indexed device)`: Emitted when an IoT device is successfully added to the session.
*   `EventRecorded(uint indexed eventId, address indexed device, uint timestamp)`: Emitted when a surveillance event is successfully recorded.
*   `SessionEnded()`: Emitted when the surveillance session officially ends.

**Modifiers:**

*   `onlyAdmin()`: Restricts function access to the `admin` address.
*   `onlyDuringSession()`: Ensures a function can only be called during the active surveillance session period.
*   `onlyAssociatedDevice()`: Ensures a function can only be called by an associated IoT device.
*   `onlyAfterSession()`: Ensures a function can only be called after the surveillance session has ended.

**Functions:**

*   `constructor(address _admin, string memory _cid)`: Initializes the session with an administrator and an IPFS CID.
*   `startSession(uint _startTime, uint _endTime) external onlyAdmin`: Sets the start and end times for the session and marks it as started.
*   `endSession() external onlyAdmin onlyAfterSession`: Marks the surveillance session as ended.
*   `addDevice(address _device) external onlyAdmin`: Adds an `IoTDevice` contract to the list of associated devices.
*   `recordEvent(uint _timestamp, bool _detected) external onlyAssociatedDevice onlyDuringSession returns (uint)`: Allows an associated IoT device to record a surveillance event.
*   `getEventCount(uint _eventId) external view returns (uint)`: Returns the details of a given surveillance event.
*   `getSessionResults() external view onlyAfterSession returns (address[] memory devices, uint[] memory eventCounts, bool[] memory detectionStatus)`: Returns the results of the surveillance session after it has ended.

### `SurveillanceSystem.sol`

The `SurveillanceSystem` contract serves as the central hub for creating and managing surveillance sessions and criminal profiles within the blockchain surveillance system. It acts as a factory for `SurveillanceSession` and `IoTDevice` contracts.

**State Variables:**

*   `admin` (address): The address of the administrator who deployed this contract and has the authority to create new surveillance sessions and criminal profiles.
*   `sessionCount` (uint): A counter for the total number of surveillance sessions created through this system.
*   `deviceCount` (uint): A counter for the total number of IoT devices registered through this system.
*   `sessions` (mapping(uint => SurveillanceSession)): A mapping from a session ID to its corresponding `SurveillanceSession` contract address.
*   `devices` (mapping(uint => IoTDevice)): A mapping from a device ID to its corresponding `IoTDevice` contract address.

**Events:**

*   `SessionCreated(uint indexed sessionId, address sessionAddress)`: Emitted when a new surveillance session contract is successfully created.
*   `DeviceRegistered(uint indexed deviceId, address deviceAddress)`: Emitted when a new IoT device contract is successfully registered.

**Modifiers:**

*   `onlyAdmin()`: Restricts function access to the `admin` address.

**Functions:**

*   `constructor()`: Sets the deployer of this contract as the `admin`.
*   `createSession(string memory _cid) external onlyAdmin returns (uint)`: Creates a new `SurveillanceSession` contract, assigns it a unique ID, and returns the ID. The `_cid` parameter is an IPFS CID for surveillance-related media.
*   `registerDevice(string memory _deviceId, string memory _location, string memory _cid) external onlyAdmin returns (uint)`: Creates a new `IoTDevice` contract, assigns it a unique ID, and returns the ID. The `_deviceId`, `_location`, and `_cid` parameters are for the device's details.
*   `getSession(uint _sessionId) external view returns (address)`: Retrieves the address of a `SurveillanceSession` contract given its ID.
*   `getDevice(uint _deviceId) external view returns (address)`: Retrieves the address of an `IoTDevice` contract given its ID.