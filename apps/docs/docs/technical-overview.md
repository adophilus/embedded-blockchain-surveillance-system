# Technical Overview

This document provides a comprehensive overview of the technical implementation of the Embedded Blockchain Surveillance System, specifically addressing the materials used, methods employed, and rationale behind key design decisions for project reporting requirements.

## Project Report Materials and Methods

For the purposes of project documentation and reporting, this section explicitly outlines the materials and methods used in the implementation of the Embedded Blockchain Surveillance System.

## System Overview

The Embedded Blockchain Surveillance System is a decentralized application built on Ethereum-compatible blockchain networks. It provides a secure, transparent, and immutable platform for surveillance operations while leveraging blockchain technology for data integrity and trust. The system integrates IoT devices (ESP32-CAM) with motion sensors to detect motion, record video streams, and store evidence on IPFS with blockchain-verified timestamps.

## Materials and Technologies Used

### Smart Contract Development
- **Solidity v0.8.24+** - Primary language for smart contract implementation
- **OpenZeppelin Contracts v5.x** - Industry-standard library for secure smart contract development, providing:
  - `AccessControl` for role-based permission management
  - Standardized error handling and security patterns
- **Foundry** - Development toolkit for:
  - Smart contract compilation and deployment
  - Comprehensive testing framework
  - Gas optimization analysis

### Frontend Development
- **React** - Component-based JavaScript library for building the web application interface
- **Viem** - TypeScript interface for interacting with Ethereum-compatible blockchains
- **Helia** - IPFS client for managing video stream access
- **TypeScript** - Type-safe development for enhanced code quality

### Backend Development
- **Hono** - Web framework for building cloud server applications
- **Helia** - IPFS client for storing video streams
- **faceapi.js** - AI-powered face detection library for criminal identification

### IoT Integration
- **ESP32-CAM** - Microcontroller with camera for surveillance hardware
- **Motion sensors** - PIR sensors for detecting movement
- **Regular interval image capture** - Video streams implemented as images taken at intervals (e.g., once every 10 seconds)

### Documentation
- **VitePress** - Static site generator for documentation
- **D2 Diagrams** - Visualization tool for system architecture diagrams

### Infrastructure
- **IPFS** - Decentralized storage for surveillance video streams and related data
- **Hardhat/Foundry** - Local blockchain development networks for testing

## Implementation Methods

### Modular Contract Architecture

The system employs a **registry pattern** to manage different surveillance entities, addressing contract size limitations and improving maintainability:

#### Core Registries
1. **SurveillanceEventRegistry** - Manages surveillance event recording and detection status
2. **CriminalProfileRegistry** - Handles criminal profile information and mugshots
3. **SurveillanceSessionRegistry** - Orchestrates surveillance session creation and lifecycle management
4. **IoTDeviceRegistry** - Manages IoT devices and their associated surveillance events

Each registry follows the same architectural pattern:
- Inherits from OpenZeppelin's `AccessControl` for secure role management
- Provides CRUD operations for its respective entity type
- Stores entity data in structured mappings for efficient retrieval
- Emits events for transparency and off-chain indexing

#### Central Coordination Contract
The **SurveillanceSystem** contract serves as the primary interface:
- Coordinates interactions between all registries
- Implements system-wide administrative functions
- Delegates entity-specific operations to appropriate registries
- Reduces individual contract complexity through proper separation of concerns

### Access Control Strategy

Role-based access control is implemented using OpenZeppelin's `AccessControl`:
- **ADMIN_ROLE** - Granted to system administrators for privileged operations
- **OFFICIAL_ROLE** - Granted to authorized officials for viewing surveillance data
- Hierarchical permission model ensures appropriate access levels
- Default admin roles automatically assigned to contract deployers
- Secure role delegation between interconnected contracts

### Data Storage and Retrieval

#### On-Chain Storage
- Structured mappings for efficient event lookup
- Event emission for all state-changing operations
- Gas-optimized data structures for cost-effective operations

#### Off-Chain Storage (IPFS)
- Video streams and surveillance media stored on IPFS using Content Identifiers (CIDs)
- Timestamp and detection status stored on-chain to ensure immutability
- Immutable storage ensuring evidence integrity

### Testing and Quality Assurance

Comprehensive testing strategy includes:
- Unit tests for individual contract functions
- Integration tests for cross-contract interactions
- Edge case validation for error handling
- Gas consumption analysis for optimization
- Security audit preparation through standardized patterns

## Design Rationale

### Registry Pattern Adoption

The registry pattern was chosen to address several key challenges:

1. **Contract Size Limitations**: Ethereum has a 24KB contract size limit. By distributing functionality across multiple specialized contracts, we avoid hitting this ceiling while maintaining rich feature sets.

2. **Scalability**: Independent registries allow for horizontal scaling as more IoT devices and surveillance sessions are added.

3. **Maintainability**: Modular design enables isolated updates and debugging without affecting unrelated system components.

4. **Security**: Smaller, focused contracts reduce attack surface and simplify security audits.

### Role-Based Access Control

OpenZeppelin's AccessControl was selected over custom implementations because:

1. **Industry Standard**: Widely adopted and battle-tested implementation
2. **Flexibility**: Supports complex role hierarchies and granular permissions
3. **Gas Efficiency**: Optimized implementation reduces transaction costs
4. **Security**: Eliminates common access control vulnerabilities

### IPFS Integration

Decentralized storage was integrated to:

1. **Reduce On-Chain Storage Costs**: Video streams are expensive to store directly on-chain
2. **Enable Rich Surveillance Content**: Support detailed video evidence and criminal mugshots
3. **Maintain Immutability**: Ensure stored content cannot be tampered with
4. **Provide Global Accessibility**: Decentralized storage ensures evidence availability

### AI Processing Implementation

Face detection using faceapi.js was chosen as the "AI processing" component to:
1. **Enable Automated Criminal Detection**: Automatically identify suspects in surveillance footage
2. **Reduce Manual Monitoring**: Alert officials only when criminals are detected
3. **Improve Response Times**: Immediate notifications when suspicious activity is identified
4. **Maintain Privacy Standards**: Processing occurs on the backend server, not on devices

## Deployment Architecture

The system follows a multi-component deployment pattern:

1. **IoT Device Setup**: ESP32-CAM devices configured with motion sensors and image capture capabilities
2. **Cloud Server Deployment**: Backend server running Hono framework with IPFS integration and AI processing
3. **Smart Contract Deployment**: Individual registries deployed with appropriate admin roles
4. **Frontend Deployment**: React application for officials to monitor surveillance sessions
5. **Cross-Component Configuration**: Proper API endpoints and contract addresses configured

This deployment strategy ensures:
- Proper initialization sequence across all system components
- Secure role distribution and API key management
- Flexible configuration options for different surveillance environments

## Future Considerations

### Enhanced AI Capabilities

Planned improvements include more advanced AI processing using:
- **Machine learning models** for improved face recognition accuracy
- **Real-time processing capabilities** for immediate detection and response
- **Behavioral analysis** to identify suspicious activities beyond face matching

### Enhanced IoT Integration

Consideration for more sophisticated IoT devices to:
- Enable 24/7 monitoring with advanced sensors
- Implement edge computing for on-device processing
- Support multiple camera angles and perspectives

## Conclusion

The Embedded Blockchain Surveillance System represents a thoughtful application of modern blockchain and IoT development practices. By leveraging established patterns, industry-standard libraries, and careful architectural planning, the system provides a robust foundation for secure, transparent surveillance operations while remaining extensible for future enhancements.

### Summary for Project Reporting

**Materials Used:**
- Solidity v0.8.24+ for smart contract development
- OpenZeppelin Contracts v5.x for secure contract patterns
- Foundry development toolkit for compilation and testing
- React and TypeScript for the web application frontend
- Hono framework for the backend server
- Helia for IPFS integration
- faceapi.js for AI-powered face detection
- ESP32-CAM for IoT surveillance devices
- VitePress for documentation generation

**Methods Employed:**
- Registry pattern architecture for modular contract design
- Role-based access control using OpenZeppelin's AccessControl
- Event-driven architecture for transparency and off-chain indexing
- Gas optimization techniques for cost-effective operations
- Comprehensive testing strategy including unit and integration tests
- IoT-device to blockchain workflow for surveillance automation