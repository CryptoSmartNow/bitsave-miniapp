import type { SavingsPlan } from "@/types";
import { getTokenLogo, getChainLogo } from "@/lib/utils";
import { useSwitchChain } from "wagmi";
import { base } from "viem/chains";
import { usePrices } from "@/components/PriceComponents";

type props = {
  plan: SavingsPlan;
};

const CompletedSavingPlanCard = ({ plan }: props) => {
  const { data: currentChain } = useSwitchChain();
  const { goodDollarPrice } = usePrices();

  console.log("[componentmmmm] good dollar price", goodDollarPrice);

  return (
    <div
      key={plan.id}
      className="relative bg-white/70 backdrop-blur-2xl rounded-3xl border border-[#81D7B4]/30 shadow-[0_8px_32px_rgba(129,215,180,0.18),0_1.5px_8px_rgba(34,158,217,0.10)] p-7 md:p-8 hover:shadow-[0_16px_48px_rgba(129,215,180,0.22)] transition-all duration-300 group overflow-hidden flex flex-col gap-6 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/60 before:to-[#81D7B4]/10 before:opacity-80 before:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:shadow-[inset_0_2px_16px_rgba(129,215,180,0.10),inset_0_1.5px_8px_rgba(34,158,217,0.08)] after:pointer-events-none"
    >
      {/* Decorative gradients */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-[#81D7B4]/30 to-[#229ED9]/20 rounded-full blur-3xl z-0"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-[#229ED9]/20 to-[#81D7B4]/30 rounded-full blur-3xl z-0"></div>
      <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>

      {/* Header Row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#81D7B4]/20 p-2 rounded-xl border border-[#81D7B4]/30 shadow-sm">
            <img
              src={plan.isEth ? "/eth.png" : getTokenLogo(plan.tokenName, plan.tokenLogo)}
              alt={plan.isEth ? "ETH" : plan.tokenName}
              className="w-6 h-6"
            />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight mb-0.5 truncate max-w-[180px] sm:max-w-[220px] md:max-w-[300px]">
              {plan.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/20 text-[#163239] text-xs font-medium shadow-sm">
                <img
                  src={plan.isEth ? "/eth.png" : getTokenLogo(plan.tokenName, plan.tokenLogo)}
                  alt={plan.isEth ? "ETH" : plan.tokenName}
                  className="w-4 h-4 mr-1"
                />
                {plan.isEth ? "ETH" : plan.tokenName}
                <span className="mx-1 text-gray-300">|</span>
                <img
                  src={getChainLogo(currentChain?.id ?? base.id)}
                  alt={currentChain?.name ?? "Base"}
                  className="w-4 h-4 mr-1"
                />
                {currentChain?.name ?? "Base"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars Row */}
      <div className="flex flex-col md:flex-row md:items-end md:space-x-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_2px_12px_rgba(129,215,180,0.08)] px-4 py-4 gap-4 md:gap-0">
        {/* Progress to Completion */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-700 font-semibold flex items-center gap-1">
              Progress
              <span className="ml-1 text-gray-400" title="How close you are to your savings goal">
                (to completion)
              </span>
            </span>
            <span className="font-bold text-gray-900">{Math.round(plan.progress)}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100/80 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#81D7B4] to-green-400 rounded-full shadow-[0_0_12px_rgba(129,215,180,0.6)]"
              style={{ width: `${plan.progress}%` }}
            ></div>
          </div>
        </div>
        {/* $BTS Rewards */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-700 font-semibold flex items-center gap-1">
              $BTS Rewards
              <span
                className="ml-1 text-gray-400"
                title="Earned only when you complete your savings"
              >
                (on completion)
              </span>
            </span>
            <span className="font-bold text-gray-900">
              {plan.tokenName === "Gooddollar"
                ? (parseFloat(plan.currentAmount) * goodDollarPrice * 0.005 * 1000).toFixed(2)
                : (parseFloat(plan.currentAmount) * 0.005 * 1000).toFixed(2)}{" "}
              $BTS
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100/80 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#229ED9] to-[#81D7B4] rounded-full shadow-[0_0_12px_rgba(34,158,217,0.3)]"
              style={{ width: `${plan.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Current Amount:</span>
          <span className="text-base font-bold text-gray-900">
            {plan.isEth ? (
              <>
                {parseFloat(plan.currentAmount).toFixed(4)}{" "}
                <span className="text-xs font-medium text-gray-500 ml-1">ETH</span>
              </>
            ) : plan.tokenName === "Gooddollar" ? (
              <>
                {parseFloat(plan.currentAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}{" "}
                <span className="text-xs font-medium text-gray-500 ml-1">$G</span>{" "}
                <span className="text-xs text-gray-400 ml-2">
                  ($
                  {(parseFloat(plan.currentAmount) * goodDollarPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USD)
                </span>
              </>
            ) : plan.tokenName === "USDGLO" ? (
              <>
                ${parseFloat(plan.currentAmount).toFixed(2)}{" "}
                <span className="text-xs font-medium text-gray-500 ml-1">USDGLO</span>
              </>
            ) : plan.tokenName === "cUSD" ? (
              <>
                ${parseFloat(plan.currentAmount).toFixed(2)}{" "}
                <span className="text-xs font-medium text-gray-500 ml-1">cUSD</span>
              </>
            ) : (
              <>
                {parseFloat(plan.currentAmount).toFixed(2)}{" "}
                <span className="text-xs font-medium text-gray-500 ml-1">{plan.tokenName}</span>
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Time Left:</span>
          <span className="text-sm font-semibold text-gray-800">
            {(() => {
              const currentDate = new Date();
              const maturityTimestamp = Number(plan.maturityTime || 0);
              const maturityDate = new Date(maturityTimestamp * 1000);
              if (isNaN(maturityDate.getTime())) return "";
              const remainingTime = maturityDate.getTime() - currentDate.getTime();
              const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));
              if (remainingDays === 0) return "Completed";
              if (remainingDays === 1) return "1 day";
              if (remainingDays < 30) return `${remainingDays} days`;
              const remainingMonths = Math.ceil(remainingDays / 30);
              if (remainingMonths === 1) return "1 month";
              if (remainingMonths > 1) return `${remainingMonths} months`;
              return "";
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompletedSavingPlanCard;
