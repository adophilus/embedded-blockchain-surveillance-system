import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { GetCriminalProfileByIdUseCase } from "./interface";
import type { CriminalProfileService } from "@/features/criminal/service";

export class GetCriminalProfileByIdUseCaseImplementation
	implements GetCriminalProfileByIdUseCase
{
	constructor(private readonly service: CriminalProfileService) {}

	async execute(
		payload: Request.Path,
	): Promise<Result<Response.Success, Response.Error>> {
		const findCriminalProfileByIdResult = await this.service.findById(
			payload.criminalId,
		);

		if (findCriminalProfileByIdResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		const criminalProfile = findCriminalProfileByIdResult.value;

		if (!criminalProfile) {
			return Result.err({
				code: "ERR_CRIMINAL_PROFILE_NOT_FOUND",
			});
		}

		criminalProfile.aliases;

		return Result.ok({
			code: "CRIMINAL_PROFILE_DETAILS",
			data: criminalProfile,
		});
	}
}
