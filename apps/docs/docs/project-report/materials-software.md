---
layout: doc
---

# Materials: Software

This section details the software materials used in the implementation of the Embedded Blockchain Surveillance System, including frameworks, libraries, development tools, and infrastructure components. Visual representations of these components can be found in the [System Images](/project-report/images) section.

## Development Frameworks and Libraries

### Smart Contract Development
1. **Solidity v0.8.24+**
   - Primary programming language for smart contract development
   - Ethereum Virtual Machine (EVM) compatible
   - Provides strong typing and explicit error handling

2. **OpenZeppelin Contracts v5.x**
   - Industry-standard library for secure smart contract development
   - Provided critical components:
     - `AccessControl` for role-based permission management
     - Standardized error handling patterns
     - Security best practices implementation

3. **Foundry Development Toolkit**
   - Comprehensive development environment for Ethereum smart contracts
   - Included tools:
     - Forge for compilation, testing, and deployment
     - Cast for interacting with deployed contracts
     - Anvil for local blockchain testing

### Backend Development
4. **Hono Framework**
   - Lightweight web framework for building cloud server applications
   - TypeScript support
   - Fast and efficient routing for API endpoints

5. **IPFS Client (Helia)**
   - Integration library for decentralized storage operations
   - Used for storing surveillance video streams and criminal mugshots
   - Content addressing through Content Identifiers (CIDs)

6. **faceapi.js**
   - AI-powered face detection and recognition library
   - Used for criminal identification in video streams
   - Runs on backend server for AI processing

### Frontend Development
7. **React Framework**
   - Component-based JavaScript library for building user interfaces
   - State management capabilities
   - Integration with blockchain through viem library

8. **Viem Library**
   - TypeScript interface for interacting with Ethereum-compatible blockchains
   - Type-safe contract interaction
   - Blockchain state management

## Development Tools

### Runtime and Package Management
1. **Node.js**
   - JavaScript runtime environment
   - Enables server-side JavaScript execution

2. **pnpm**
   - Fast, disk space efficient package manager
   - Monorepo management capabilities
   - Efficient dependency resolution

### Type Safety
3. **TypeScript**
   - Typed superset of JavaScript
   - Compile-time error detection
   - Enhanced developer experience and code maintainability

## Infrastructure Components

### Hosting and Deployment
1. **3.5GB VPS from Racknerd**
   - Cloud server infrastructure for backend services
   - Sufficient computational resources for AI processing
   - Reliable network connectivity for IoT device communication

### Blockchain Infrastructure
2. **Polygon Blockchain Network**
   - Ethereum-compatible Layer 2 solution
   - Low-cost transaction processing
   - High throughput for frequent surveillance event recording

3. **thirdweb IPFS Gateway**
   - Decentralized storage access
   - Reliable content retrieval
   - Content addressing for surveillance footage

## Software Dependencies

### Smart Contract Dependencies
- **@openzeppelin/contracts**: Security-focused smart contract library
- **forge-std**: Testing and development utilities for Foundry

### Backend Dependencies
- **hono**: Web framework for API development
- **helia**: IPFS client for storage operations
- **face-api.js**: Face detection and recognition library
- **@typespec/http**: API specification framework

### Frontend Dependencies
- **react**: Component-based UI library
- **viem**: Ethereum blockchain interaction
- **@tanstack/react-query**: State management for blockchain data

## Documentation and Visualization Tools

1. **VitePress**
   - Static site generation for documentation
   - Markdown-based content creation
   - Responsive design capabilities

2. **D2 Diagrams**
   - System architecture visualization
   - Component relationship mapping
   - Flow diagram creation

## Development Environment Tools

1. **Code Editor/IDE**: VS Code with appropriate extensions for TypeScript, Solidity, and React development
2. **Version Control**: Git with GitHub for collaboration and code management
3. **Task Runner**: PNPM for monorepo management and dependency resolution
4. **Testing Framework**: Foundry's testing framework for smart contracts
5. **Network Tools**: Anvil for local blockchain testing and development

## Software Interface Visualization

### IPFS Dashboard
![IPFS Dashboard](../images/ipfs-dashboard.jpg)
*Dashboard showing the IPFS storage interface where surveillance videos are stored with content addressing through CIDs*

The thirdweb IPFS Gateway provides a user-friendly interface for managing decentralized storage of surveillance footage. The dashboard allows officials to:
- View stored video streams with their unique CIDs
- Monitor storage usage and costs
- Access video metadata and timestamps
- Verify the immutability of stored content