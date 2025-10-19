# Smart Contracts Deployment

This section details the process of deploying the smart contracts to a blockchain network. We use Foundry for contract deployment.

## Blockchain Deployment

The smart contracts are deployed on the **Polygon blockchain** for cost efficiency and scalability, making it economically viable to record frequent surveillance events.

## Backend Infrastructure

The cloud server backend is deployed on a **3.5GB VPS from Racknerd**, providing sufficient computational resources for:
- Processing video streams from IoT devices
- Running AI processing (face detection) with faceapi.js
- Storing surveillance footage temporarily before IPFS upload

## IPFS Integration

The system uses **[thirdweb](https://thirdweb.com) as the IPFS gateway** for reliable decentralized storage access, ensuring video footage is securely and permanently stored with content addressing capabilities.