---
layout: doc
---

# Methods Employed

This document provides a detailed account of the methods employed in the implementation of the Embedded Blockchain Surveillance System, specifically tailored for inclusion in academic or technical project reports.

## System Architecture Design

The Embedded Blockchain Surveillance System was implemented using a **registry pattern architecture**, which addresses Ethereum's 24KB contract size limitation while maintaining system functionality:

#### Core Registry Modules
1. **SurveillanceEventRegistry** - Manages surveillance event recording and detection status
2. **CriminalProfileRegistry** - Handles criminal profile information and mugshots
3. **SurveillanceSessionRegistry** - Orchestrates surveillance session creation and lifecycle management
4. **IoTDeviceRegistry** - Manages IoT surveillance devices and their associated events

Each registry implements:
- Role-based access control using OpenZeppelin's `AccessControl`
- Structured data storage in mappings for efficient retrieval
- Event emission for transparency and off-chain indexing
- Standardized interfaces for consistent interaction patterns

#### Central Coordination Layer
The **SurveillanceSystem** contract serves as the primary interface:
- Coordinates interactions between all registry modules
- Implements system-wide administrative functions
- Delegates entity-specific operations to appropriate registries
- Reduces individual contract complexity through proper separation of concerns

## Access Control Implementation

Role-based access control was implemented using OpenZeppelin's proven `AccessControl` pattern:
- **ADMIN_ROLE** designated for system administrators
- **OFFICIAL_ROLE** designated for authorized surveillance officials
- Hierarchical permission model ensuring appropriate access levels
- Default admin roles automatically assigned to contract deployers
- Secure role delegation between interconnected contracts

## Data Storage Strategy

A hybrid storage approach was employed to optimize cost and functionality:

#### On-Chain Storage
- Structured mappings for efficient event lookup and retrieval
- Event emission for all state-changing operations
- Gas-optimized data structures for cost-effective operations
- Timestamp and detection status for surveillance events

#### Off-Chain Storage (IPFS)
- Video streams and surveillance media stored using Content Identifiers (CIDs)
- Criminal mugshots and profile information decentralized
- Immutable storage ensuring evidence integrity and permanence

## IoT Integration Architecture

The system implements IoT-to-blockchain workflow:

#### ESP32-CAM Integration
- Motion sensor triggers initiate video recording
- Regular interval image capture (e.g., once every 10 seconds)
- Network communication with backend server
- Cloud server receives video streams for processing

#### Cloud Server Processing
- Hono framework handles API requests
- Video streams stored on IPFS via Helia client
- CID and timestamp recorded on blockchain
- AI processing with faceapi.js for criminal detection

## Testing Methodology

A comprehensive testing strategy was implemented to ensure system reliability:

#### Unit Testing
- Individual contract function validation
- Edge case scenario testing
- Error condition verification
- Gas consumption analysis

#### Integration Testing
- Cross-contract interaction validation
- Registry pattern coordination testing
- End-to-end surveillance workflow verification
- IoT-to-blockchain data flow testing

#### Security Considerations
- Access control boundary testing
- Unauthorized operation prevention
- Reentrancy protection validation
- Integer overflow/underflow safeguards

## Deployment Architecture

The system follows a multi-component deployment pattern:

1. **IoT Device Setup**
   - ESP32-CAM devices configured with motion sensors
   - Image capture and network communication capabilities
   - Proper initialization sequence for device registration

2. **Cloud Server Deployment**
   - Backend server running Hono framework
   - IPFS integration via Helia client
   - AI processing capabilities with faceapi.js

3. **Smart Contract Deployment**
   - Individual registries deployed with appropriate admin roles
   - Cross-contract permission setup through role granting

4. **Frontend Deployment**
   - React application for officials to monitor surveillance sessions
   - Blockchain integration via viem library
   - IPFS access via Helia client

5. **Post-Deployment Validation**
   - System parameter verification
   - Administrative function accessibility confirmation
   - Integration testing of all components

## Rationale Behind Design Choices

### Registry Pattern Adoption

The registry pattern was specifically chosen to address:

1. **Contract Size Limitations** - Ethereum's 24KB limit necessitated distribution of functionality
2. **Scalability Requirements** - Independent registries allow for horizontal scaling as more IoT devices are added
3. **Maintenance Benefits** - Modular design enables isolated updates and debugging
4. **Security Advantages** - Smaller, focused contracts reduce attack surface

### Role-Based Access Control

OpenZeppelin's AccessControl was selected over custom implementations because:

1. **Industry Standard** - Widely adopted and extensively tested implementation
2. **Flexibility** - Supports complex role hierarchies and granular permissions
3. **Gas Efficiency** - Optimized implementation reduces transaction costs
4. **Security** - Eliminates common access control vulnerabilities

### IPFS Integration

Decentralized storage was integrated to:

1. **Optimize Costs** - Video streams are expensive to store directly on-chain
2. **Enable Rich Content** - Support detailed video evidence and criminal profiles
3. **Ensure Immutability** - Guarantee stored content cannot be tampered with
4. **Provide Availability** - Decentralized storage ensures evidence persistence

### AI Processing Implementation

faceapi.js was chosen as the "AI processing" component to:
1. **Enable Automated Detection** - Automatically identify suspects in surveillance footage
2. **Reduce Manual Monitoring** - Alert officials only when criminals are detected
3. **Improve Response Times** - Immediate notifications when suspicious activity is identified
4. **Maintain Privacy Standards** - Processing occurs on the backend server

## Development Methodology

The project was developed using **Agile methodology**, which emphasized:

1. **Iterative Development** - Features were developed in small, manageable increments
2. **Continuous Integration** - Regular integration of new functionality with existing codebase
3. **Frequent Testing** - Comprehensive testing at each development stage
4. **Adaptive Planning** - Flexibility to adjust requirements and implementation based on findings
5. **Collaborative Approach** - Regular communication and feedback loops

The development followed an iterative approach:

1. **Requirements Analysis** - Defined core surveillance system functionalities
2. **Architecture Design** - Established registry pattern structure for IoT integration
3. **Contract Development** - Implemented individual surveillance registry modules
4. **Backend Development** - Created Hono server with IPFS and AI processing
5. **Frontend Development** - Implemented React interface for officials
6. **Testing Implementation** - Created comprehensive test suite
7. **Integration Testing** - Verified IoT-to-blockchain workflow
8. **Documentation Generation** - Produced detailed technical documentation
9. **Deployment Preparation** - Configured deployment scripts and procedures

## Deployment Target

The Embedded Blockchain Surveillance System is designed for deployment on the **Polygon blockchain**, chosen for its:

1. **Scalability** - High throughput and low latency compared to Ethereum mainnet
2. **Cost Efficiency** - Significantly lower gas fees than Ethereum mainnet, essential for frequent surveillance event recording
3. **EVM Compatibility** - Seamless compatibility with existing Ethereum development tools
4. **Security** - Robust security model with proof-of-stake consensus
5. **Developer Experience** - Familiar development environment for Ethereum developers

The system leverages Polygon's infrastructure to provide a cost-effective and scalable solution for blockchain-based surveillance while maintaining the security and decentralization benefits of blockchain technology.