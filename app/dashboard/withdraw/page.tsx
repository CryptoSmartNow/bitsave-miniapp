"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useWriteContract } from "wagmi";
import CONTRACT_ABI from "@/app/abi/contractABI.js";
import { trackTransaction, trackError } from "@/lib/interactionTracker";
import { config } from "@/app/providers";
import { base } from "viem/chains";
import { estimateGas, waitForTransactionReceipt } from "@wagmi/core";
import { encodeFunctionData, Hex } from "viem";
import CHILD_CONTRACT_ABI from "@/app/abi/childContractABI";

const BASE_CONTRACT_ADDRESS = "0x3593546078eecd0ffd1c19317f53ee565be6ca13";
const CELO_CONTRACT_ADDRESS = "0x7d839923Eb2DAc3A0d1cABb270102E481A208F33";

export default function WithdrawPage() {
  const [withdrawalName, setWithdrawalName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const { writeContractAsync } = useWriteContract();

  const getContractAddress = () => {
    return config.state.chainId === base.id ? BASE_CONTRACT_ADDRESS : CELO_CONTRACT_ADDRESS;
  };

  const getExplorerUrl = (txHash: string) => {
    return config.state.chainId === base.id
      ? `https://basescan.org/tx/${txHash}`
      : `https://celoscan.io/tx/${txHash}`;
  };

  const handleWithdraw = async () => {
    if (!withdrawalName) {
      setError("Please enter a withdrawal name");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const gasEstimate = await estimateGas(config, {
        to: getContractAddress(),
        data: encodeFunctionData({
          abi: [...CONTRACT_ABI, ...CHILD_CONTRACT_ABI],
          functionName: "withdrawSaving",
          args: [withdrawalName],
        }),
      });

      console.log("Gas estimate for withdrawal:", gasEstimate.toString());
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);

      const tx = await writeContractAsync({
        address: getContractAddress(),
        abi: [...CONTRACT_ABI, ...CHILD_CONTRACT_ABI],
        functionName: "withdrawSaving",
        args: [withdrawalName],
      });

      setTxHash(tx);

      // Track transaction
      await trackTransaction("withdrawal", { txHash: tx });

      const receipt = await waitForTransactionReceipt(config, { hash: tx, confirmations: 1 });

      if (receipt.status === "success") {
        setSuccess(true);
        setWithdrawalName("");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err: unknown) {
      console.error("Withdrawal error:", err);
      setError(err instanceof Error ? err.message : "Withdrawal failed. Please try again.");
      await trackError(err instanceof Error ? err.message : "Unknown error", {
        component: "withdrawal",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setWithdrawalName("");
    setError("");
    setSuccess(false);
    setTxHash("");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Withdrawal Successful!</h2>
            <p className="text-gray-600 mb-6">Your withdrawal has been processed successfully.</p>
            {txHash && (
              <a
                href={getExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
              >
                View Transaction
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
            <div>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-[#81D7B4] text-white rounded-lg hover:bg-[#6bc4a1] transition-colors font-medium"
              >
                Make Another Withdrawal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#81D7B4] to-[#6bc4a1] p-6">
            <h1 className="text-2xl font-bold text-white mb-2">Withdraw Savings</h1>
            <p className="text-white/90">
              Enter your savings plan name to instantly withdraw your funds
            </p>
          </div>

          <div className="p-6">
            {/* Withdrawal Name Form */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="withdrawalName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Withdrawal Name *
                </label>
                <input
                  type="text"
                  id="withdrawalName"
                  value={withdrawalName}
                  onChange={(e) => setWithdrawalName(e.target.value)}
                  placeholder="Enter your savings plan name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent outline-none transition-all"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleWithdraw}
                disabled={isLoading || !withdrawalName}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Withdrawal...
                  </>
                ) : (
                  "Withdraw Funds"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
