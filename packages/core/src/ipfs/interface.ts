import type { Result } from "true-myth";

export type IpfsUploadError = { type: "IpfsUploadError"; message: string };
export type UnknownIpfsError = { type: "UnknownIpfsError"; message: string };
export type UriNotFoundError = { type: "URINotFoundError" };
export type IpfsUploadFileError = IpfsUploadError | UnknownIpfsError;
export type ResolveUriError = UriNotFoundError | UnknownIpfsError;

export type Cid = string;
export type Uri = string;

export abstract class IpfsClient {
	public abstract uploadFile(
		file: File,
	): Promise<Result<Cid, IpfsUploadError | UnknownIpfsError>>;

	public abstract cidToUri(cid: Cid): Promise<Result<Uri, ResolveUriError>>;
}
