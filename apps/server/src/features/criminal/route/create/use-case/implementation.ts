import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { CreateCriminalProfileUseCase } from "./interface";
import type { CriminalProfileService } from "@/features/criminal/service";
import { ulid } from "ulidx";
import type { StorageService } from "@/features/storage/service";
import type { MediaDescription } from "@/types";

export class CreateCriminalProfileUseCaseImplementation
	implements CreateCriminalProfileUseCase
{
	constructor(
		private readonly service: CriminalProfileService,
		private readonly storage: StorageService,
	) {}

	async execute(
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		let uploadedMugshot: MediaDescription | null = null;

		console.log(payload);

		const { mugshot, ..._restPayload } = payload;
		if (mugshot) {
			const uploadResult = await this.storage.upload(mugshot);
			if (uploadResult.isErr) {
				return Result.err({ code: "ERR_UNEXPECTED" });
			}
			uploadedMugshot = uploadResult.value;
		}

		const result = await this.service.create({
			..._restPayload,
			id: ulid(),
			aliases: payload.aliases ?? [],
			offenses: payload.offenses ?? [],
			mugshot: uploadedMugshot,
		});

		if (result.isErr) {
			return Result.err({ code: "ERR_UNEXPECTED" });
		}

		return Result.ok({
			code: "CRIMINAL_PROFILE_UPLOADED",
		});
	}
}
