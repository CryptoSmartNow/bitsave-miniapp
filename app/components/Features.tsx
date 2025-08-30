"use client";

export default function Features() {
  const featureItems = [
    {
      title: "Designed for Secure Savings",
      description:
        "Bitsave provides goal-based savings plans with non-custodial smart contracts; you own your funds, withdraw your savings at any time.",
      detail:
        "Stable & Secure SavingsEnables recurring stablecoin savings, no risks of market volatility on your stable coin savings.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-8 h-8 text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v8m-5-4h10"
          />
        </svg>
      ),
      color: "primary",
    },
    {
      title: "Designed for Simplicity",
      description:
        "Experience a clean and intuitive savings experience, on-chain savings easier than saving in a traditional account.",
      detail:
        "No DeFi Jargon, Just Simple Savings,No complex staking, yield farming, or trading—just secure, goal-based savings with a user-friendly interface",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-8 h-8 text-secondary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
          />
        </svg>
      ),
      color: "secondary",
    },
    {
      title: "Designed for Security & Control",
      description:
        "Peace of mind with a non-custodial savings model, users have full control of their savings.",
      detail:
        "Parent-child Smart Contracts structure for Security Each savings plan is stored in a user-owned smart contract (child contract), reducing risks of hacks or centralized failures. No pooled funds. Just secure, private savings.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-8 h-8 text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      color: "accent",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-b from-white to-[#f8fafa]"
    >
      {/* Enhanced background elements */}
      <div className="absolute -z-10 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] top-1/4 left-0 transform -translate-x-1/2"></div>
      <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] bottom-0 right-0 transform translate-x-1/3"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-24 h-24 border border-primary/20 rounded-lg rotate-12 opacity-30 hidden lg:block"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 border border-secondary/20 rounded-lg -rotate-12 opacity-30 hidden lg:block"></div>

      <div className="container mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          {/* Enhanced title with decorative elements - Centered and more stunning */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/30 backdrop-blur-sm shadow-[0_0_15px_rgba(129,215,180,0.2)] mx-auto relative overflow-hidden group">
              {/* Holographic shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#81D7B4]/0 via-[#81D7B4]/20 to-[#81D7B4]/0 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#81D7B4]/0 via-[#81D7B4]/10 to-[#81D7B4]/0 animate-shimmer-slow"></div>

              <div className="w-3 h-3 rounded-full bg-[#81D7B4] animate-pulse relative z-10"></div>
              <span className="text-sm font-semibold text-[#81D7B4] uppercase tracking-wider relative z-10">
                Powerful Features
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">
              Key Features
            </span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Designed for growth, ease, and peace of mind - everything you need for successful crypto
            savings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {featureItems.map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/90 p-8 rounded-xl border border-[#81D7B4]/10 relative overflow-hidden group hover:bg-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(129,215,180,0.15)] shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#81D7B4]/5 rounded-full blur-3xl group-hover:bg-[#81D7B4]/10 transition-colors"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#81D7B4]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#81D7B4"
                    className="w-8 h-8"
                  >
                    {feature.icon.props.children}
                  </svg>
                </div>

                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <span className="text-[#81D7B4]">{feature.title}</span>
                </h3>

                <p className="text-gray-600 mb-6">{feature.description}</p>

                <div className="p-4 backdrop-blur-md bg-white/80 rounded-lg border border-[#81D7B4]/10 shadow-sm relative">
                  <p className="text-sm">
                    <span className="font-bold text-[#81D7B4]">Strategy: </span>
                    <span className="text-[#81D7B4]">{feature.detail}</span>
                  </p>

                  {/* Add glowing dot indicator */}
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#81D7B4] animate-pulse"></div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#81D7B4]/30 rounded-br-lg opacity-70"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* animation keyframes */}
      <style jsx>{`
        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-15px) translateX(10px);
          }
          50% {
            transform: translateY(5px) translateX(-10px);
          }
          75% {
            transform: translateY(10px) translateX(5px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes shimmer-slow {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes shimmer-delayed {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
