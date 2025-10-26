# IPFS Integration Overview

This section provides an overview of the IPFS (InterPlanetary File System) integration in the Embedded Blockchain Surveillance System. IPFS is used for decentralized storage of surveillance video streams and related data.

## What is IPFS?

IPFS (InterPlanetary File System) is a peer-to-peer hypermedia protocol designed to preserve and grow humanity's knowledge by making the web upgradeable, resilient, and more open. Unlike traditional HTTP, which locates files by their location, IPFS locates files by their content using content addressing.

## Why IPFS for Surveillance Systems?

### Decentralization
- No single point of failure for critical surveillance footage.
- Video streams are distributed across multiple nodes, ensuring high availability.
- Resilient to server outages and censorship.

### Immutability
- Content addressing ensures the integrity of surveillance data.
- Video footage and evidence cannot be altered without changing their address (CID).
- Provides a tamper-evident audit trail for all recorded events.

### Cost Efficiency
- Reduced hosting costs for large video files through distribution.
- No recurring fees for storing static assets like criminal profile images.

### Permanence
- Surveillance data remains available as long as at least one node pins it.
- Eliminates the risk of broken links to critical evidence.
- Provides archival quality storage for long-term retention of surveillance records.

## Use Cases in the Surveillance System

### Surveillance Data
- Raw video footage from IoT devices.
- Processed video streams with detected objects or faces.
- Timestamps and metadata associated with each event.

### Criminal Profiles
- Mugshots and other identifying images.
- Case files and related evidence.

### System Logs
- Immutable logs of system operations and errors.
- Audit trails for device and session management.

## Technical Implementation

### Content Addressing
Files are stored using content identifiers (CIDs) that are cryptographic hashes of the file content. This ensures:
- **Uniqueness:** Identical files have identical CIDs.
- **Integrity:** Any change to a file results in a new CID.
- **Verifiability:** Anyone can verify the authenticity of a file by hashing its content.

### Gateway Access
While IPFS is a peer-to-peer network, users and applications typically access files through HTTP gateways:
- `https://ipfs.io/ipfs/{cid}`
- `https://gateway.pinata.cloud/ipfs/{cid}`
- A self-hosted or project-specific gateway.

### Pinning Services
To ensure file availability, content is "pinned" to reliable IPFS nodes:
- **Pinata:** Used for persistent storage and easy management of pinned content.
- **Self-hosted nodes:** Can be used for redundancy and greater control.

## Integration Architecture

```
IoT Device -> Cloud Server -> IPFS Network
   ^             |                ^
   |             v                |
   +------- Smart Contract (stores CIDs) --+
```

1.  **Capture & Upload:** An IoT device captures a video stream and sends it to the cloud server.
2.  **Process & Store:** The server processes the video (e.g., for face detection), uploads the raw and/or processed data to IPFS, and gets a CID in return.
3.  **Record on-chain:** The server calls a smart contract function to create a `SurveillanceEvent`, storing the IPFS CID and other relevant metadata on the blockchain.
4.  **Retrieve & Display:** The web application queries the smart contract for event data, retrieves the associated files from IPFS using the CID, and displays them to the user.

## Security Model

### Trust Assumptions
- IPFS ensures **content integrity** (the data you retrieve is the data that was stored) but not **content availability**.
- Pinning services are trusted to keep the data available.
- The blockchain provides an immutable, tamper-proof record of which CIDs are associated with which events.

### Limitations
- **Public by Default:** All data on the public IPFS network is accessible to anyone who has the CID. Sensitive data must be encrypted *before* being uploaded.
- **No Guarantee of Uptime:** Without a reliable pinning service, data may become unavailable if the nodes storing it go offline.

## Future Developments

### Private Networks & Encryption
- Implementation of private IPFS networks or encryption layers for sensitive surveillance footage.
- On-the-fly decryption for authorized users.

### Performance Optimizations
- Using IPFS-aware CDNs to speed up content delivery for frequently accessed footage.
- Implementing caching strategies in the web application.
