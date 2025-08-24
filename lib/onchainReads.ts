import sdk from "@farcaster/miniapp-sdk";
import { config } from "../app/providers";
import { readContract } from "@wagmi/core";
import BITSAVE_ABI from "../app/abi/contractABI.js";
import CHILDCONTRACT_ABI from "../app/abi/childContractABI.js";
import { Address, Hex, zeroAddress } from "viem";
import type { ChainId } from "../types";

export async function getJoiningFee(
  contractAddress: Address,
  chainId: ChainId = config.state.chainId
) {
  const result = (await readContract(config, {
    abi: BITSAVE_ABI,
    address: contractAddress as Address,
    functionName: "JoinLimitFee",
    chainId,
  })) as bigint;

  return result;
}

export async function getCreateSavingsFee(
  contractAddress: Address,
  chainId: ChainId = config.state.chainId
) {
  const result = (await readContract(config, {
    abi: BITSAVE_ABI,
    address: contractAddress as Address,
    functionName: "SavingFee",
    chainId,
  })) as bigint;

  return result;
}

export async function getAllUserSavings(childContract: string, chainId: ChainId) {
  // First get all savings names
  const savingsNames = await getUserVaultNames(childContract, chainId);

  // Then get all savings data
  const savingsPromises = savingsNames.map(async (name) => {
    const savingData = await getSaving(childContract, name, chainId);
    return {
      name,
      ...savingData,
    };
  });

  const allSavings = await Promise.all(savingsPromises);

  // Return all savings (both valid and invalid)
  // Invalid savings (isValid = false) are completed/withdrawn savings
  return allSavings;
}

export async function getUserChildContract(
  contractAddress: Address,
  userAccount: string,
  chainId: ChainId = config.state.chainId
) {
  return (await readContract(config, {
    abi: BITSAVE_ABI,
    address: contractAddress as Address,
    functionName: "getUserChildContractAddress",
    account: userAccount as Address,
    chainId,
  })) as Address;
}

export async function getUserVaultNames(childContract: string, chainId: ChainId) {
  const result = (await readContract(config, {
    abi: CHILDCONTRACT_ABI,
    address: childContract as Address,
    functionName: "getSavingsNames",
    chainId,
  })) as { savingsNames: string[] };

  return result.savingsNames;
}

export async function getSaving(childContract: string, savingName: string, chainId: ChainId) {
  const result = (await readContract(config, {
    abi: CHILDCONTRACT_ABI,
    address: childContract as Address,
    functionName: "getSaving",
    args: [savingName],
    chainId,
  })) as {
    isValid: boolean;
    amount: bigint;
    tokenId: Hex;
    interestAccumulated: bigint;
    startTime: bigint;
    penaltyPercentage: bigint;
    maturityTime: bigint;
    isSafeMode: boolean;
  };

  return result;
}
