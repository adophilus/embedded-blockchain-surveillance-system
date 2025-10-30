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
import type { NotificationTokenService } from "@/features/notification/token/service";

export class IotDeviceUploadUseCaseImplementation
	implements IotDeviceUploadUseCase
{
	constructor(
		private readonly service: IotDeviceService,
		private readonly criminalService: CriminalProfileService,
		private readonly surveillanceSessionService: SurveillanceSessionService,
		private readonly surveillanceEventService: SurveillanceEventService,
		private readonly notificationService: NotificationTokenService,
		private readonly logger: Logger,
	) {}

	private convertImageBase64ToFile(base64String: string): File {
		const buffer = Buffer.from(base64String, "base64");
		const file = new File([buffer], "upload.jpg", { type: "image/jpeg" });
		return file;
	}

	async execute(
		payload: Request.Path & Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		this.logger.info(
			`Processing IoT stream upload from device: ${payload.deviceId}`,
		);

		const imageFile = this.convertImageBase64ToFile(payload.image);

		const uploadResult = await this.service.uploadStream(
			payload.deviceId,
			imageFile,
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

		const imageArrayBuffer = await imageFile.arrayBuffer();

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
				for (const [index, match] of detection.matches.entries()) {
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

					await this.notificationService.broadcast({
						title: "Criminal Detected!",
						body: `Detected ${match.criminal.name} with ${(match.confidence * 100).toFixed(1)}% confidence.`,
						tag: `CRIMINAL_DETECTED_${match.criminal.id}`,
					});
				}
			} else {
				this.logger.info("No criminals detected in the stream");
			}
		}

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
		} else {
			this.logger.info(`Surveillance event created: ${eventResult.value.id}`);
		}

		this.logger.info("IoT stream processing completed");
		return Result.ok({
			code: "STREAM_UPLOADED",
		});
	}
}
