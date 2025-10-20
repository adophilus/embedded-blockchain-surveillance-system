---
layout: doc
---

# Materials: Overview

This section provides a high-level overview of the materials used in the implementation of the Embedded Blockchain Surveillance System. The materials are categorized into software and hardware components that work together to create a comprehensive surveillance solution.

## System Components Overview

The Embedded Blockchain Surveillance System combines multiple technologies to achieve its objectives:

### Software Infrastructure
- **Smart Contracts**: Built with Solidity and OpenZeppelin, deployed on Polygon blockchain
- **Cloud Backend**: Hono framework with IPFS integration and AI processing capabilities
- **Frontend Application**: React-based interface for officials to monitor surveillance sessions
- **AI Processing**: faceapi.js for criminal detection in video streams

### Hardware Components
- **IoT Surveillance Devices**: ESP32-CAM microcontrollers with integrated cameras
- **Motion Sensors**: PIR sensors for detecting movement and triggering recordings

### Infrastructure
- **Server Infrastructure**: 3.5GB VPS from Racknerd for cloud server deployment
- **Blockchain Network**: Polygon for cost-efficient and scalable transaction processing
- **Decentralized Storage**: IPFS via thirdweb gateway for secure video storage

## Technology Stack Summary

The system leverages a comprehensive technology stack designed to provide:

- **Decentralized Data Storage**: IPFS for video stream storage with blockchain verification
- **AI-Powered Detection**: Automated criminal identification using face detection
- **Real-Time Monitoring**: IoT devices with motion sensors providing continuous surveillance
- **Immutable Records**: Blockchain-based timestamping and event logging
- **Secure Access**: Role-based authentication and authorization for officials