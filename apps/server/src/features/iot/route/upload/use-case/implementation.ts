import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { IotDeviceUploadUseCase } from "./interface";
import type { IotDeviceService } from "@/features/iot/service";
import type { CriminalProfileService } from "@/features/criminal/service";
import type { SurveillanceSessionService } from "@/features/surveillance/session/service";
import type { SurveillanceEventService } from "@/features/surveillance/events/service";
import type { Logger } from "@/features/logger";
import type { SurveillanceEvent } from "@/types";
import { ulid } from "ulidx";

export class IotDeviceUploadUseCaseImplementation
	implements IotDeviceUploadUseCase
{
	constructor(
		private readonly service: IotDeviceService,
		private readonly criminalService: CriminalProfileService,
		private readonly surveillanceSessionService: SurveillanceSessionService,
		private readonly surveillanceEventService: SurveillanceEventService,
		private readonly logger: Logger,
	) {}

	async execute(
		payload: Request.Path & Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		this.logger.info(
			`Processing IoT stream upload from device: ${payload.deviceId}`,
		);

		// Upload the stream to storage
		const uploadResult = await this.service.uploadStream(
			payload.deviceId,
			payload.image,
		);

		if (uploadResult.isErr) {
			switch (uploadResult.error) {
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

		const uploadedMedia = uploadResult.value;

		this.logger.info("Stream uploaded successfully");

		// Get current/active surveillance session
		this.logger.info("Getting current/active surveillance session");
		const sessionsResult = await this.surveillanceSessionService.list();

		if (sessionsResult.isErr) {
			this.logger.error(
				"Failed to get surveillance sessions",
				sessionsResult.error,
			);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		const activeSession = sessionsResult.value.find(
			(session) => session.status === "ACTIVE",
		);

		if (!activeSession) {
			this.logger.warn("No active surveillance session found");
			return Result.ok({
				code: "STREAM_UPLOADED",
			});
		}

		this.logger.info(
			`Found active session: ${activeSession.title} (ID: ${activeSession.id})`,
		);

		this.logger.info("Starting criminal detection");

		// Convert image to ArrayBuffer for criminal detection
		const imageArrayBuffer = await payload.image.arrayBuffer();

		// Detect criminals in the stream
		const criminalDetectionResult =
			await this.criminalService.detectCriminalsInStream(imageArrayBuffer);

		const criminalDetections: Array<{ criminal_profile_id: string }> = [];

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

					// Add to detections array for surveillance event
					criminalDetections.push({
						criminal_profile_id: match.criminal.id,
					});
				});

				// Notify officials about criminal detection
				this.logger.warn(
					"ALERT: Criminal detection requires immediate attention!",
				);
				this.logger.warn(`Session: ${activeSession.title}`);
				this.logger.warn(`Device: ${payload.deviceId}`);
				this.logger.warn(
					`Criminals detected: ${detection.matches.map((m) => m.criminal.name).join(", ")}`,
				);
			} else {
				this.logger.info("No criminals detected in the stream");
			}
		}

		// Create surveillance event
		this.logger.info("Creating surveillance event");
		const surveillanceEvent: SurveillanceEvent.Insertable = {
			id: ulid(),
			media: uploadedMedia,
			session_id: activeSession.id,
			device_id: payload.deviceId,
			detections: criminalDetections,
		};

		const eventResult =
			await this.surveillanceEventService.create(surveillanceEvent);

		if (eventResult.isErr) {
			this.logger.error(
				"Failed to create surveillance event",
				eventResult.error,
			);
			// Continue with success response even if event creation fails
		} else {
			this.logger.info(`Surveillance event created: ${eventResult.value.id}`);
		}

		this.logger.info("IoT stream processing completed");
		return Result.ok({
			code: "STREAM_UPLOADED",
		});
	}
}
