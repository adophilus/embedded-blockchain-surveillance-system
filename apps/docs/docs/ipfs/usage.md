# IPFS Usage

This section details how IPFS is used within the Embedded Blockchain Surveillance System, including how video data is uploaded from IoT devices, retrieved by the cloud server, and linked to smart contracts via CIDs and timestamps.

## Overview

IPFS (InterPlanetary File System) is used in the Embedded Blockchain Surveillance System to provide decentralized storage for:

- Surveillance video streams from IoT devices.
- Mugshots and other images for criminal profiles.
- Metadata and logs related to surveillance sessions.

By using IPFS, the system ensures that this critical data is:
- **Permanently available** (as long as it is pinned).
- **Tamper-proof** (immutable once stored).
- **Distributed** (no single point of failure).

## Data Storage Architecture

### Content Addressing

All files stored on IPFS are referenced by their Content Identifier (CID), which is a cryptographic hash of the file content. This ensures:

1.  **Immutability**: Files cannot be changed without generating a new CID.
2.  **Verifiability**: Anyone can verify file integrity by hashing the content.
3.  **Deduplication**: Identical files are stored only once across the network.

### File Types and Usage

| File Type | Usage | Example CID |
|---|---|---|
| Surveillance Video | Raw or processed video footage from an event | `bafybeig...` |
| Criminal Mugshot | Profile images for criminal identification | `bafkreib...` |
| Session Metadata | JSON file containing details about a surveillance session | `bafkreih...` |

## Integration with Smart Contracts

### Storing References

Rather than storing large files on the blockchain, smart contracts store only the CIDs:

```solidity
struct CriminalProfile {
    uint id;
    string name;
    string[] aliases;
    string[] offenses;
    string cid; // IPFS CID for mugshot
}

struct SurveillanceEvent {
    uint id;
    uint sessionId;
    uint deviceId;
    uint timestamp;
    Detection[] detections;
    string cid; // IPFS CID for video footage
    uint createdAt;
}
```

### Retrieving Files

When the web application needs to display a criminal's mugshot or a surveillance video:

1.  The smart contract is queried for the relevant record (e.g., a `CriminalProfile` or `SurveillanceEvent`).
2.  The `cid` is extracted from the struct.
3.  An IPFS gateway is used to retrieve the file: `https://ipfs.io/ipfs/{cid}`.
4.  The file (image or video) is displayed to the user.

## Upload Process (IoT Device -> Server -> IPFS)

1.  **Capture:** An IoT device (like an ESP32-CAM) detects motion and captures a video stream.
2.  **Transmit:** The device sends the video data to the central cloud server.
3.  **Process & Upload:** The server receives the data. It may perform initial processing (like face detection) and then uploads the video file to IPFS using a library like `helia`.
4.  **Get CID:** IPFS returns a unique CID for the uploaded video.
5.  **Smart Contract Update:** The server calls the `recordEvent` function on the appropriate `SurveillanceSession` contract, passing the CID, timestamp, and any detection data. The blockchain transaction creates an immutable link between the on-chain event and the off-chain video data.

## Retrieval Process (Web App)

1.  **Smart Contract Query:** The frontend queries a `SurveillanceSession` contract to get a list of events.
2.  **Extract CID:** For a specific event, the frontend gets the `cid` from the `SurveillanceEvent` struct.
3.  **IPFS Gateway Access:** The frontend constructs the IPFS URL and retrieves the video file from an IPFS gateway.
4.  **File Display:** The retrieved video is displayed in the UI, often using an HTML5 video player.

## Security Considerations

### Content Integrity
- CIDs cryptographically guarantee that the video footage or mugshot has not been tampered with since it was first recorded.
- The link between the on-chain event and the off-chain data is immutable.

### Privacy
- **All data on the public IPFS network is public.**
- For a real-world application, sensitive surveillance footage **must be encrypted** on the server *before* being uploaded to IPFS.
- Decryption keys would need to be managed securely and only made available to authorized users (e.g., via the application backend).

## Best Practices

### File Optimization
- Compress video streams using modern codecs (like H.264 or VP9) to reduce file size without significant quality loss.
- Standardize on efficient image formats like WebP for mugshots.

### Pinning Strategy
- Use a reliable pinning service like Pinata to ensure that all critical evidence is permanently available.
- Implement automated pinning for all new surveillance events.

### Error Handling
- Implement fallback IPFS gateways in the web application in case one is down.
- Use loading indicators and handle cases where video retrieval might be slow.
