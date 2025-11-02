import { Result } from "true-myth";
import type {
	IpfsClient,
	IpfsUploadFileError,
	ResolveUriError,
	Uri,
} from "./interface";
import { PinataSDK } from "pinata";

export const createPinataClient = (jwt: string, gateway: string): PinataSDK => {
	return new PinataSDK({
		pinataJwt: jwt,
		pinataGateway: gateway,
	});
};

export class PinataIpfsClient implements IpfsClient {
	constructor(private readonly client: PinataSDK) {}

	public async uploadFile(
		file: File,
	): Promise<Result<string, IpfsUploadFileError>> {
		try {
			const res = await this.client.upload.public.file(file);
			return Result.ok(res.cid);
		} catch (e: unknown) {
			console.error("Error uploading file to IPFS:", e);
			return Result.err({
				type: "IpfsUploadError",
				message: (e as any).message || "Failed to upload file to IPFS",
			});
		}
	}

	public async cidToUri(cid: string): Promise<Result<Uri, ResolveUriError>> {
		try {
			const uri = await this.client.gateways.public.convert(cid);
			return Result.ok(uri);
		} catch (err: unknown) {
			console.error("Error converting CID to URI:", err);
			return Result.err({
				type: "URINotFoundError",
			});
		}
	}
}

