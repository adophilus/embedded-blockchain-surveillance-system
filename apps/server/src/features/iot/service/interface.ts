import type { Result } from "true-myth";

export type IotDeviceServiceError = 
  | "ERR_DEVICE_NOT_FOUND"
  | "ERR_UNEXPECTED";

export abstract class IotDeviceService {
  /**
   * Update the heartbeat timestamp for an IoT device
   * @param deviceId - The ID of the IoT device
   * @param timestamp - The timestamp of the heartbeat
   * @returns Result indicating success or failure
   */
  public abstract updateHeartbeat(
    deviceId: string,
    timestamp: Date
  ): Promise<Result<{ acknowledged: boolean }, IotDeviceServiceError>>;
}
