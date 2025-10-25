import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { ListCriminalProfileUseCase } from "./interface";
import type { CriminalProfileService } from "@/features/criminal/service";
import { Pagination } from "@/features/pagination";

export class ListCriminalProfilesUseCaseImplementation
	implements ListCriminalProfileUseCase
{
	constructor(private readonly service: CriminalProfileService) {}

	async execute(
		payload: Request.Query,
	): Promise<Result<Response.Success, Response.Error>> {
		const listCriminalProfilesResult = await this.service.list();

		if (listCriminalProfilesResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		const criminalProfiles = listCriminalProfilesResult.value;

		return Result.ok({
			code: "CRIMINAL_PROFILES_LIST",
			data: Pagination.paginate(criminalProfiles, {
				page: 1,
				per_page: criminalProfiles.length,
				total: criminalProfiles.length,
			}),
		});
	}
}
