import { Result } from "true-myth";
import type { IpfsClient, IpfsUploadFileError } from "./interface";
import { type Helia } from "helia";
import { unixfs, type UnixFS } from "@helia/unixfs";
import { createHeliaHTTP } from "@helia/http";
import {
	// delegatedHTTPRouting,
	httpGatewayRouting,
} from "@helia/routers";

export const createHeliaIpfsClient = async (): Promise<HeliaIpfsClient> => {
	const helia = await createHeliaHTTP({
		routers: [
			// delegatedHTTPRouting("https://delegated-ipfs.dev"),
			httpGatewayRouting({
				gateways: ["http://localhost:5001"],
			}),
		],
	});
	return new HeliaIpfsClient(helia);
};

class HeliaIpfsClient implements IpfsClient {
	private declare fs: UnixFS;

	constructor(helia: Helia) {
		this.fs = unixfs(helia);
	}

	public async uploadFile(
		file: File,
	): Promise<Result<string, IpfsUploadFileError>> {
		try {
			const arrayBuffer = await file.arrayBuffer();
			const content = new Uint8Array(arrayBuffer);

			const result = await this.fs.addFile({ content, path: file.name });
			console.log("IPFS upload result:", result);
			return Result.ok(result.toString());
		} catch (e: any) {
			console.error("Error uploading file to IPFS:", e);
			return Result.err({
				type: "IpfsUploadError",
				message: e.message || "Failed to upload file to IPFS",
			});
		}
	}
}

export { HeliaIpfsClient };
