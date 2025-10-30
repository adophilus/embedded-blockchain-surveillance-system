import tf from "@tensorflow/tfjs-node";
import faceapi from "@vladmandic/face-api";

import canvas from "canvas";
import { Result } from "true-myth";
import type {
	CriminalProfileService,
	CreateCriminalProfileServiceError,
	FindCriminalProfileByIdServiceError,
	DetectCriminalsInStreamServiceError,
	DetectCriminalsInStreamServiceSuccess,
	ListCriminalsServiceError,
} from "./interface";
import type { CriminalProfileRepository } from "../repository";
import type { Logger } from "@/features/logger";
import type { CriminalProfile } from "@/types";
import { loadImage, type Image } from "canvas";
import { config } from "@/features/config";

export class CriminalProfileServiceImplementation
	implements CriminalProfileService
{
	private static readonly MIN_CONFIDENCE = 0.15;
	private static readonly MAX_RESULTS = 5;

	constructor(
		private readonly repository: CriminalProfileRepository,
		private readonly options: faceapi.SsdMobilenetv1Options,
		private readonly logger: Logger,
	) {}

	public static async init(
		repository: CriminalProfileRepository,
		logger: Logger,
	): Promise<CriminalProfileServiceImplementation> {
		faceapi.env.monkeyPatch({
			Canvas: canvas.Canvas,
			Image: canvas.Image,
			ImageData: canvas.ImageData,
		} as any);

		// @ts-ignore
		await faceapi.tf.setBackend("tensorflow");
		// @ts-ignore
		await faceapi.tf.ready();

		const modelPath = config.ai.modelPath;
		await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
		await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
		await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
		await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
		await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
		const options = new faceapi.SsdMobilenetv1Options({
			minConfidence: CriminalProfileServiceImplementation.MIN_CONFIDENCE,
			maxResults: CriminalProfileServiceImplementation.MAX_RESULTS,
		});

		return new CriminalProfileServiceImplementation(
			repository,
			options,
			logger,
		);
	}

	public async create(
		payload: CriminalProfile.Insertable,
	): Promise<
		Result<CriminalProfile.Selectable, CreateCriminalProfileServiceError>
	> {
		const res = await this.repository.create(payload);
		if (res.isErr) {
			this.logger.error("Repository failed to create criminal", res.error);
			return Result.err("ERR_UNEXPECTED");
		}
		return Result.ok(res.value);
	}

	public async findById(
		id: string,
	): Promise<
		Result<
			CriminalProfile.Selectable | null,
			FindCriminalProfileByIdServiceError
		>
	> {
		try {
			const res = await this.repository.findById(id);
			if (res.isErr) {
				this.logger.error(
					"Repository failed to find criminal by id",
					res.error,
				);
				return Result.err("ERR_UNEXPECTED");
			}
			return Result.ok(res.value);
		} catch (error) {
			this.logger.error("Unexpected error finding criminal by id", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(): Promise<
		Result<CriminalProfile.Selectable[], ListCriminalsServiceError>
	> {
		return this.repository.list();
	}

	public async detectCriminalsInStream(
		stream: ArrayBuffer,
	): Promise<
		Result<
			DetectCriminalsInStreamServiceSuccess,
			DetectCriminalsInStreamServiceError
		>
	> {
		try {
			this.logger.info("Starting criminal detection in surveillance stream");

			// Validate input
			if (!stream || stream.byteLength === 0) {
				this.logger.error("Invalid stream data received");
				return Result.err("ERR_IMAGE_PROCESSING_FAILED");
			}

			// Convert ArrayBuffer to Buffer and load image
			const imageBuffer = Buffer.from(stream);
			const image = await loadImage(imageBuffer);

			if (!image || image.width === 0 || image.height === 0) {
				this.logger.error("Invalid image data - unable to process");
				return Result.err("ERR_IMAGE_PROCESSING_FAILED");
			}

			this.logger.info(`Processing image: ${image.width}x${image.height}`);

			// Detect all faces in the image
			const detections = await this.runDetections(image);

			this.logger.info("Ran face detections");

			if (detections.length === 0) {
				this.logger.info("No faces detected in the image");
				return Result.ok({
					detected: false,
					matches: [],
				});
			}

			this.logger.info(`Detected ${detections.length} face(s) in the image`);

			// Get all criminal profiles for matching
			const criminalsResult = await this.repository.list();
			if (criminalsResult.isErr) {
				this.logger.error(
					"Failed to load criminal profiles",
					criminalsResult.error,
				);
				return Result.err("ERR_UNEXPECTED");
			}

			const criminals = criminalsResult.value;
			if (criminals.length === 0) {
				this.logger.info("No criminal profiles available for matching");
				return Result.ok({
					detected: false,
					matches: [],
				});
			}

			this.logger.info(
				`Loaded ${criminals.length} criminal profiles for matching`,
			);

			// Create labeled face descriptors for known criminals
			const labeledFaceDescriptors = await Promise.all(
				criminals
					.filter((criminal) => criminal.mugshot?.url)
					.map(async (criminal) => {
						try {
							this.logger.debug(
								`Processing mugshot for criminal ${criminal.id}`,
							);
							const criminalImage = await loadImage(
								criminal.mugshot?.url || "",
							);
							const criminalDetection = await faceapi
								.detectSingleFace(criminalImage as unknown as HTMLImageElement)
								.withFaceLandmarks()
								.withFaceDescriptor();

							if (!criminalDetection) {
								this.logger.warn(
									`Failed to create face descriptor for criminal ${criminal.id}`,
								);
								return null;
							}

							return new faceapi.LabeledFaceDescriptors(criminal.id, [
								criminalDetection.descriptor,
							]);
						} catch (error) {
							this.logger.warn(
								`Error processing criminal ${criminal.id} image:`,
								error,
							);
							return null;
						}
					}),
			);

			const validDescriptors = labeledFaceDescriptors.filter(
				(d): d is faceapi.LabeledFaceDescriptors => !!d,
			);
			if (validDescriptors.length === 0) {
				this.logger.warn("No valid criminal face descriptors could be created");
				return Result.ok({
					detected: false,
					matches: [],
				});
			}

			this.logger.info(
				`Created ${validDescriptors.length} valid criminal face descriptors`,
			);

			// Create face matcher with confidence threshold
			const faceMatcher = new faceapi.FaceMatcher(validDescriptors, 0.6);
			const matches: Array<{
				criminal: CriminalProfile.Selectable;
				confidence: number;
				boundingBox?: {
					x: number;
					y: number;
					width: number;
					height: number;
				};
			}> = [];

			// Match each detected face against known criminals
			for (const detection of detections) {
				const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

				if (bestMatch.label !== "unknown" && bestMatch.distance < 0.4) {
					const criminal = criminals.find((c) => c.id === bestMatch.label);
					if (criminal) {
						// Convert distance to confidence (lower distance = higher confidence)
						const confidence = Math.max(0, 1 - bestMatch.distance);

						// Extract bounding box from detection
						const boundingBox = detection.detection.box
							? {
									x: detection.detection.box.x,
									y: detection.detection.box.y,
									width: detection.detection.box.width,
									height: detection.detection.box.height,
								}
							: undefined;

						matches.push({
							criminal,
							confidence,
							boundingBox,
						});

						this.logger.info(
							`Criminal match found: ${criminal.name} (confidence: ${confidence.toFixed(3)})`,
						);
					}
				}
			}

			this.logger.info(
				`Criminal detection completed: ${matches.length} matches found`,
			);
			return Result.ok({
				detected: matches.length > 0,
				matches,
			});
		} catch (error) {
			this.logger.error("Error in criminal detection", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	private async runDetections(image: Image) {
		const c = canvas.createCanvas(image.width, image.height);
		const ctx = c.getContext("2d");
		ctx.drawImage(image, 0, 0, image.width, image.height);

		// Detect all faces in the image
		const detections = await faceapi
			// @ts-ignore
			.detectAllFaces(c)
			.withFaceLandmarks()
			.withFaceDescriptors();

		return detections;
	}
}
