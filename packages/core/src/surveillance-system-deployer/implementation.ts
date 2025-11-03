import type { Address, Hex, Abi, ContractConstructorArgs } from "viem";
import { Result } from "true-myth";
import type {
	SurveillanceSystemDeployer,
	DeployContractError,
	DeploySystemError,
} from "./interface";
import SurveillanceSystemMetadata from "@embedded-blockchain-surveillance-system/contracts/SurveillanceSystem.sol/SurveillanceSystem.json";
import CriminalProfileRegistryMetadata from "@embedded-blockchain-surveillance-system/contracts/CriminalProfileRegistry.sol/CriminalProfileRegistry.json";
import IoTDeviceRegistryMetadata from "@embedded-blockchain-surveillance-system/contracts/IoTDeviceRegistry.sol/IoTDeviceRegistry.json";
import SurveillanceSessionRegistryMetadata from "@embedded-blockchain-surveillance-system/contracts/SurveillanceSessionRegistry.sol/SurveillanceSessionRegistry.json";
import SurveillanceEventRegistryMetadata from "@embedded-blockchain-surveillance-system/contracts/SurveillanceEventRegistry.sol/SurveillanceEventRegistry.json";
import type { Wallet } from "../wallet";

const SurveillanceSystemABI = SurveillanceSystemMetadata.abi as Abi;
const SurveillanceSystemBytecode = SurveillanceSystemMetadata.bytecode
	.object as Hex;

const CriminalProfileRegistryABI = CriminalProfileRegistryMetadata.abi as Abi;
const CriminalProfileRegistryBytecode = CriminalProfileRegistryMetadata.bytecode
	.object as Hex;

const IoTDeviceRegistryABI = IoTDeviceRegistryMetadata.abi as Abi;
const IoTDeviceRegistryBytecode = IoTDeviceRegistryMetadata.bytecode
	.object as Hex;

const SurveillanceSessionRegistryABI =
	SurveillanceSessionRegistryMetadata.abi as Abi;
const SurveillanceSessionRegistryBytecode = SurveillanceSessionRegistryMetadata
	.bytecode.object as Hex;

const SurveillanceEventRegistryABI = SurveillanceEventRegistryMetadata.abi as Abi;
const SurveillanceEventRegistryBytecode = SurveillanceEventRegistryMetadata.bytecode.object as Hex;

class BlockchainSurveillanceSystemDeployer
	implements SurveillanceSystemDeployer
{
	constructor(private readonly wallet: Wallet) {}

	private async deployContract<A extends Abi>(
		abi: A,
		bytecode: Hex,
		args?: ContractConstructorArgs<A>,
	): Promise<Result<Address, DeployContractError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();

			const account = walletClient.account;
			const chain = walletClient.chain;

			if (!account) {
				return Result.err({ type: "InvalidDeployerAccountError" });
			}

			const hash = await walletClient.deployContract({
				abi,
				account,
				bytecode,
				args: args ?? [],
				chain,
			} as any);

			const receipt = await publicClient.waitForTransactionReceipt({
				hash,
			});

			if (!receipt.contractAddress) {
				return Result.err({ type: "DeploymentFailedError" });
			}

			return Result.ok(receipt.contractAddress);
		} catch (e: any) {
			console.error("Contract deployment failed:", e);
			return Result.err({ type: "UnknownDeployerError" });
		}
	}

	private async deployCriminalProfileRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(
			CriminalProfileRegistryABI,
			CriminalProfileRegistryBytecode,
			[this.wallet.getAddress()],
		);
	}

	private async deployIoTDeviceRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(
			IoTDeviceRegistryABI,
			IoTDeviceRegistryBytecode,
			[this.wallet.getAddress()],
		);
	}

	private async deploySurveillanceSessionRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(
			SurveillanceSessionRegistryABI,
			SurveillanceSessionRegistryBytecode,
			[this.wallet.getAddress()],
		);
	}

	private async deploySurveillanceEventRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(
			SurveillanceEventRegistryABI,
			SurveillanceEventRegistryBytecode,
			[this.wallet.getAddress()],
		);
	}

	private async deploySurveillanceSystem(
		criminalProfileRegistryAddress: Address,
		iotDeviceRegistryAddress: Address,
		surveillanceSessionRegistryAddress: Address,
		surveillanceEventRegistryAddress: Address,
	): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(
			SurveillanceSystemABI,
			SurveillanceSystemBytecode,
			[
				criminalProfileRegistryAddress,
				iotDeviceRegistryAddress,
				surveillanceSessionRegistryAddress,
				surveillanceEventRegistryAddress,
			],
		);
	}

	public async deploySystem(): Promise<Result<Address, DeploySystemError>> {
		const criminalProfileRegistryResult =
			await this.deployCriminalProfileRegistry();
		if (criminalProfileRegistryResult.isErr) {
			return Result.err(criminalProfileRegistryResult.error);
		}
		const criminalProfileRegistryAddress = criminalProfileRegistryResult.value;

		const iotDeviceRegistryResult = await this.deployIoTDeviceRegistry();
		if (iotDeviceRegistryResult.isErr) {
			return Result.err(iotDeviceRegistryResult.error);
		}
		const iotDeviceRegistryAddress = iotDeviceRegistryResult.value;

		const surveillanceSessionRegistryResult =
			await this.deploySurveillanceSessionRegistry();
		if (surveillanceSessionRegistryResult.isErr) {
			return Result.err(surveillanceSessionRegistryResult.error);
		}
		const surveillanceSessionRegistryAddress =
			surveillanceSessionRegistryResult.value;

		const surveillanceEventRegistryResult = await this.deploySurveillanceEventRegistry();
		if (surveillanceEventRegistryResult.isErr) {
			return Result.err(surveillanceEventRegistryResult.error);
		}
		const surveillanceEventRegistryAddress = surveillanceEventRegistryResult.value;

		const surveillanceSystemResult = await this.deploySurveillanceSystem(
			criminalProfileRegistryAddress,
			iotDeviceRegistryAddress,
			surveillanceSessionRegistryAddress,
			surveillanceEventRegistryAddress,
		);
		if (surveillanceSystemResult.isErr) {
			return Result.err(surveillanceSystemResult.error);
		}
		const surveillanceSystemAddress = surveillanceSystemResult.value;

		return Result.ok(surveillanceSystemAddress);
	}
}

export { BlockchainSurveillanceSystemDeployer };
