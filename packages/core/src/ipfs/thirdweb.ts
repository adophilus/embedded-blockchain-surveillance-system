import { Result } from "true-myth";
import type {
  IpfsClient,
  IpfsUploadFileError,
  ResolveUriError,
} from "./interface";
import { upload, resolveScheme } from "thirdweb/storage";
import { createThirdwebClient as createTwClient } from "thirdweb";

export const createThirdwebClient = (secretKey: string) => {
  return createTwClient({
    secretKey,
  });
};

class ThirdwebIpfsClient implements IpfsClient {
  constructor(private readonly client: Helia) { }

  public async uploadFile(
    file: File,
  ): Promise<Result<string, IpfsUploadFileError>> {
    try {
      const uris = await upload({
        client: this.client,
        files: [file],
      });
      return Result.ok(uris[0]);
    } catch (e: any) {
      console.error("Error uploading file to IPFS:", e);
      return Result.err({
        type: "IpfsUploadError",
        message: e.message || "Failed to upload file to IPFS",
      });
    }
  }

  public async resolveUri(
    uri: string,
  ): Promise<Result<string, ResolveUriError>> {
    return resolveScheme(uri);
  }
}

export { ThirdwebIpfsClient };
