"use client";

import { useRef, useState } from "react";

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Step data with updated content
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description:
        "Compatible with Coinbase wallet, MetaMask, WalletConnect, and other popular wallets.",
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
            d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Fund Your Wallet",
      description:
        "Deposit any stable coin like USDC into your connected wallet. We support a wide range of stable coins.",
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
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Create Your Savings",
      description:
        "With just a few clicks; choose your assets, set your savings goals, and save for your rent, schoolfees, vacation etc.",
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
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-gradient-to-b from-white to-[#f8fafa]"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 -z-10 bg-[url('/noise.jpg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(129,215,180,0.12)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Decorative blobs */}
      <div className="absolute -z-10 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[150px] bottom-1/4 right-0 transform translate-x-1/2 animate-pulse-slow"></div>
      <div className="absolute -z-10 w-[600px] h-[600px] bg-secondary/8 rounded-full blur-[150px] top-1/4 left-0 transform -translate-x-1/3 animate-pulse-slow"></div>

      {/* Enhanced floating particles */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => {
          const top = (i * 7) % 100;
          const left = (i * 6) % 100;
          const size = 1 + (i % 4);

          return (
            <div
              key={i}
              className="absolute rounded-full bg-primary/60"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: 0.3 + ((i * 3) % 30) / 100,
                animation: `float-particle ${8 + ((i * 4) % 12)}s ease-in-out infinite ${(i * 0.33) % 5}s`,
              }}
            ></div>
          );
        })}
      </div>

      <div className="container mx-auto">
        {/* Enhanced title section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div
            className="flex items-center justify-center mb-6 animate-fade-in-scale"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Enhanced badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/30 backdrop-blur-sm shadow-[0_0_15px_rgba(129,215,180,0.2)] mx-auto relative overflow-hidden group">
              {/* Holographic shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#81D7B4]/0 via-[#81D7B4]/20 to-[#81D7B4]/0 animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#81D7B4]/0 via-[#81D7B4]/10 to-[#81D7B4]/0 animate-shimmer-slow"></div>

              <div className="w-3 h-3 rounded-full bg-[#81D7B4] animate-pulse relative z-10"></div>
              <span className="text-sm font-semibold text-[#81D7B4] uppercase tracking-wider relative z-10">
                Simple Process
              </span>
            </div>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-6 relative inline-block animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              How It Works
            </span>
            <div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-80 animate-expand-width"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </h2>

          <p
            className="text-gray-600 text-lg max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Start your crypto savings journey in three simple steps
          </p>
        </div>

        {/* Enhanced steps with modern cards */}
        <div className="relative mb-20">
          {/* Connecting line with animation */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 hidden md:block -translate-y-1/2 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-pulse-slow"></div>
          </div>

          {/* Steps in a responsive row/column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step number with enhanced visibility */}
                <div className="absolute left-1/2 -top-8 transform -translate-x-1/2 w-16 h-16 rounded-full bg-white flex items-center justify-center text-xl font-bold z-20 shadow-[0px_8px_20px_rgba(129,215,180,0.3),4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)] border border-[#81D7B4]/30">
                  <span className="text-[#81D7B4] font-extrabold text-xl">{step.number}</span>
                </div>

                {/* Card with enhanced glassmorphism and hover effects */}
                <div className="bg-white/90 p-8 pt-12 rounded-2xl border border-[#81D7B4]/10 relative overflow-hidden group transition-all duration-500 h-full shadow-[0px_10px_30px_rgba(0,0,0,0.04),0px_0px_0px_1px_rgba(129,215,180,0.1)] hover:shadow-[0px_20px_40px_rgba(0,0,0,0.08),0px_0px_0px_1px_rgba(129,215,180,0.3)]">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-[#81D7B4]/5 opacity-80 pointer-events-none"></div>

                  {/* Background glow */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#81D7B4]/10 rounded-full blur-3xl group-hover:bg-[#81D7B4]/20 transition-colors"></div>

                  {/* Card content */}
                  <div className="relative z-10">
                    {/* Icon with enhanced visibility */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-[#81D7B4]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8),inset_1px_1px_1px_rgba(255,255,255,0.5)]">
                      <div className="text-[#81D7B4] w-10 h-10">{step.icon}</div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
                      <span className="text-[#81D7B4]">{step.title}</span>
                    </h3>

                    <p className="text-gray-600 text-center">{step.description}</p>

                    {/* Enhanced animated indicator for active step */}
                    {activeStep === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#81D7B4]/70 via-[#81D7B4] to-[#81D7B4]/80 animate-expand-width" />
                    )}
                  </div>

                  {/* Enhanced decorative corner accents */}
                  <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-[#81D7B4]/50 rounded-tl-lg opacity-80 group-hover:border-[#81D7B4]/80 transition-colors"></div>
                  <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#81D7B4]/50 rounded-br-lg opacity-80 group-hover:border-[#81D7B4]/80 transition-colors"></div>
                </div>

                {/* Enhanced arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 items-center justify-center w-8 h-8 rounded-full bg-white shadow-[0px_5px_15px_rgba(129,215,180,0.25),4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="text-[#81D7B4]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced keyframe animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
      `}</style>
    </section>
  );
}
