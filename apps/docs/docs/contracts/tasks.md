# Development Tasks and Flow

This document outlines the refined flow of operations for the Embedded Blockchain Surveillance System, incorporating considerations for a more comprehensive system design. It also includes questions raised during the review process to ensure all aspects are addressed.

## Review Questions

During the review of the initial flow, the following questions and considerations were raised:





## Refined Flow of Operations

Based on the above considerations, here is a refined flow of operations for the Embedded Blockchain Surveillance System:

1.  **Admin creates a surveillance session:** The administrator initiates a new surveillance session by specifying its name, a detailed description, the official start and end times (Unix timestamps), and an IPFS Content Identifier (CID) for any initial surveillance-related configuration or media.

2.  **Admin registers IoT surveillance devices:** For each surveillance device in the system, the administrator creates a new `IoTDevice` contract. This involves providing the device's unique ID, its location, and an IPFS CID for its configuration or metadata.

3.  **Admin adds devices to the surveillance session:** The administrator then associates the registered `IoTDevice` contracts with the specific surveillance session. This step registers which devices are officially participating in the current surveillance session.

4.  **IoT devices detect motion and record video:** When motion sensors on an IoT device are triggered, the device begins recording video at regular intervals (e.g., once every 10 seconds) and sends these images to the cloud server for processing.

5.  **Cloud server stores video on IPFS and stores CID on chain:** The cloud server receives the video stream (as images) from IoT devices, stores them on IPFS, and records the CID and timestamp on the blockchain via the `IoTDevice.recordEvent` function.

6.  **Cloud server performs AI processing for criminal detection:** The cloud server runs face detection using faceapi.js to check if the video stream contains images of any suspects in the criminal database.

7.  **Officials are alerted when criminals are detected:** If a matching criminal is detected in the video stream, the system automatically alerts the officials through the web application.

8.  **Admin ends the surveillance session:** After the `endTime` of the surveillance session has passed, the administrator explicitly calls the `endSession()` function on the `SurveillanceSession` contract to formally conclude the surveillance period.

9.  **Surveillance results are tallied and displayed:** Once the session has officially ended, the web application retrieves the final surveillance event data and results by calling the `getSessionResults()` function on the `SurveillanceSession` contract. This function returns a comprehensive breakdown of events and detection status per device. These results are then presented to the officials in a clear and transparent manner.