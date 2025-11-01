import { Result } from "true-myth";
import type { StorageService, UploadError } from "./interface";
import type { IpfsClient } from "@embedded-blockchain-surveillance-system/core";
import type { MediaDescription } from "@/types";

export class IpfsStorageService implements StorageService {
	constructor(private readonly client: IpfsClient) {}

	public async upload(
		payload: File,
	): Promise<Result<MediaDescription, UploadError>> {
		const uploadResult = await this.client.uploadFile(payload);

		if (uploadResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const cid = uploadResult.value;
		const uriResult = await this.client.cidToUri(cid);

		if (uriResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const uri = uriResult.value;

		return Result.ok({
			id: cid,
			source: "ipfs",
			url: uri,
		});
	}
}
