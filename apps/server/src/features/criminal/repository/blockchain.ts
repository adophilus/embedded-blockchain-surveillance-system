import { Result } from "true-myth";
import type {
	CriminalProfileRepository,
	CreateCriminalError,
	FindCriminalByIdError,
	ListCriminalsError,
} from "./interface";
import type { CriminalProfile } from "@/types";
import type {
	BlockchainSurveillanceSystem,
	CriminalProfileDetails,
} from "@embedded-blockchain-surveillance-system/core";
import type { Writable } from "type-fest";

export class BlockchainCriminalProfileRepository
	implements CriminalProfileRepository
{
	constructor(private readonly system: BlockchainSurveillanceSystem) {}

	public async create(
		payload: CriminalProfile.Insertable,
	): Promise<Result<CriminalProfile.Selectable, CreateCriminalError>> {
		const result = await this.system.registerCriminalProfile(
			payload.name,
			payload.aliases,
			payload.offenses,
			payload.mugshot?.id ?? "",
		);

		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const findResult = await this.findById(result.value);
		if (findResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		if (findResult.value === null) {
			return Result.err("ERR_UNEXPECTED");
		}

		return Result.ok(findResult.value);
	}

	private normalizeCriminalProfileDetails(
		criminalProfileDetails: CriminalProfileDetails,
	): CriminalProfile.Selectable {
		const { cid, created_at, updated_at, ..._rest } = criminalProfileDetails;
		const rest = _rest as Writable<CriminalProfile.Selectable>;

		const criminalProfile: CriminalProfile.Selectable = {
			...rest,
			mugshot:
				cid === ""
					? null
					: {
							id: cid,
							source: "ipfs",
							url: `https://ipfs.io/ipfs/${cid}`,
						},
			created_at: Number(created_at),
			updated_at: Number(updated_at),
		};

		return criminalProfile;
	}

	public async findById(
		id: string,
	): Promise<Result<CriminalProfile.Selectable | null, FindCriminalByIdError>> {
		const result = await this.system.getCriminalProfile(id);
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const criminalProfile = this.normalizeCriminalProfileDetails(result.value);

		return Result.ok(criminalProfile);
	}

	public async list(): Promise<
		Result<CriminalProfile.Selectable[], ListCriminalsError>
	> {
		const result = await this.system.listCriminalProfiles();
		if (result.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const criminalProfiles = result.value.map(
			this.normalizeCriminalProfileDetails,
		);

		return Result.ok(criminalProfiles);
	}
}
