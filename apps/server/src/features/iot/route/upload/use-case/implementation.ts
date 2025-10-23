import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { IotDeviceUploadUseCase } from "./interface";
import type { IotDeviceService } from "@/features/iot/service";
import type { CriminalProfileService } from "@/features/criminal/service";
import type { Logger } from "@/features/logger";

export class IotDeviceUploadUseCaseImplementation
	implements IotDeviceUploadUseCase
{
	constructor(
		private readonly service: IotDeviceService,
		private readonly criminalService: CriminalProfileService,
		private readonly logger: Logger,
	) {}

	async execute(
		payload: Request.Path & Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		this.logger.info(
			`Processing IoT stream upload from device: ${payload.deviceId}`,
		);

		// Upload the stream to storage
		const result = await this.service.uploadStream(
			payload.deviceId,
			payload.image,
		);

		if (result.isErr) {
			switch (result.error) {
				case "ERR_DEVICE_NOT_FOUND": {
					return Result.err({
						code: "ERR_DEVICE_NOT_FOUND",
					});
				}
				default: {
					return Result.err({
						code: "ERR_UNEXPECTED",
					});
				}
			}
		}

		this.logger.info(
			"Stream uploaded successfully, starting criminal detection",
		);

		// Convert image to ArrayBuffer for criminal detection
		const imageArrayBuffer = await payload.image.arrayBuffer();

		// Detect criminals in the stream
		const criminalDetectionResult =
			await this.criminalService.detectCriminalsInStream(imageArrayBuffer);

		if (criminalDetectionResult.isErr) {
			this.logger.error(
				"Criminal detection failed",
				criminalDetectionResult.error,
			);
		} else {
			const detection = criminalDetectionResult.value;

			if (detection.detected && detection.matches.length > 0) {
				this.logger.warn(
					`CRIMINAL DETECTED: Found ${detection.matches.length} criminal(s) in stream`,
				);

				// Log details of detected criminals
				detection.matches.forEach((match, index) => {
					this.logger.warn(
						`Criminal ${index + 1}: ${match.criminal.name} (ID: ${match.criminal.id}) - Confidence: ${(match.confidence * 100).toFixed(1)}%`,
					);

					if (match.boundingBox) {
						this.logger.info(
							`Location: x=${match.boundingBox.x}, y=${match.boundingBox.y}, w=${match.boundingBox.width}, h=${match.boundingBox.height}`,
						);
					}
				});

				// TODO: Add new surveillance event with criminal detection
				// TODO: Notify officials about criminal detection
				// TODO: Store detection results in database
			} else {
				this.logger.info("No criminals detected in the stream");
			}
		}

		// TODO: get current/active surveillance session
		// TODO: add new surveillance event
		// TODO: notify officials (if criminal is in stream)

		this.logger.info("IoT stream processing completed");
		return Result.ok({
			code: "STREAM_UPLOADED",
		});
	}
}
