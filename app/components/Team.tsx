"use client";

const teamMembers = [
  {
    name: "KarlaGod",
    role: "Founder",
    avatar: "/images/karlagod.jpg",
    socials: {
      twitter: "https://twitter.com/_karlagod",
      github: "https://github.com/karlagod",
      farcaster: "https://farcaster.xyz/karlagod",
    },
  },
  {
    name: "Primidac",
    role: "Full Stack Developer",
    avatar: "/images/primidac.png",
    socials: {
      twitter: "https://twitter.com/primidac",
      github: "https://github.com/primidac",
    },
  },
  {
    name: "Xpan",
    role: "Blockchain Developer",
    avatar: "/images/xpan.jpg",
    socials: {
      twitter: "https://twitter.com/xpanvictor",
      github: "https://github.com/xpanvictor",
    },
  },
  {
    name: "Glory Wejinya",
    role: "Social Media Manager",
    avatar: "/images/glory.jpg",
    socials: {
      twitter: "https://x.com/gloorry_?t=nlvALCd1L77vnMy8_S2FmQ&s=09",
    },
  },
  {
    name: "Nissi Favour",
    role: "Community Manager",
    avatar: "/images/nissi.jpg",
    socials: {
      twitter: "https://x.com/Fabulous_Nizzy?t=aLvp6VQJsr0YN3h0NCOzbA&s=09",
    },
  },
];

export default function Team() {
  return (
    <section
      id="team"
      className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden bg-[#f8fafa]"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 -z-10 bg-[url('/grain-texture.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 -z-10 bg-[url('/circuit-pattern.svg')] opacity-[0.02] pointer-events-none"></div>

      {/* Floating Elements */}
      <div className="absolute -z-10 w-[600px] h-[600px] bg-[#81D7B4]/5 rounded-full blur-[100px] top-1/4 right-0 transform translate-x-1/3 animate-pulse-slow"></div>
      <div className="absolute -z-10 w-[500px] h-[500px] bg-[#81D7B4]/5 rounded-full blur-[100px] bottom-0 left-0 transform -translate-x-1/3 animate-pulse-slow-delayed"></div>

      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#81D7B4]/10 border border-[#81D7B4]/30 mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(129,215,180,0.2)] mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#81D7B4]/0 via-[#81D7B4]/20 to-[#81D7B4]/0 animate-shimmer"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#81D7B4]/0 via-[#81D7B4]/10 to-[#81D7B4]/0 animate-shimmer-slow"></div>

            <div className="w-2 h-2 rounded-full bg-[#81D7B4] animate-pulse relative z-10"></div>
            <span className="text-sm font-medium text-[#81D7B4] uppercase tracking-wider relative z-10">
              Meet Our Team
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">
              The Minds Behind BitSave
            </span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A team of DeFi experts and builders dedicated to revolutionizing crypto savings.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Container */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#f8fafa] to-white/80 shadow-[20px_20px_60px_rgba(0,0,0,0.05),-20px_-20px_60px_rgba(255,255,255,0.8)] border border-white/50 transition-all duration-500 group-hover:shadow-[25px_25px_75px_rgba(0,0,0,0.1),-25px_-25px_75px_rgba(255,255,255,0.9)] backdrop-blur-xl">
                {/* Card Background Effects */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  {/* Gradient Mesh */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent opacity-50"></div>
                  <div className="absolute inset-0 bg-[#81D7B4]/5 mix-blend-overlay"></div>

                  {/* Animated Background Patterns */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
                    <div className="absolute -right-1/2 -top-1/2 w-full h-full bg-gradient-to-br from-[#81D7B4]/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                    <div
                      className="absolute -left-1/2 -bottom-1/2 w-full h-full bg-gradient-to-tl from-[#81D7B4]/10 to-transparent rounded-full blur-3xl animate-pulse-slow"
                      style={{ animationDelay: "-2s" }}
                    ></div>
                  </div>

                  {/* Decorative Grid */}
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#81D7B4 1px, transparent 1px), linear-gradient(90deg, #81D7B4 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                </div>

                {/* Inner Content Container */}
                <div className="relative z-10">
                  {/* Avatar Container */}
                  <div className="relative w-32 h-32 mx-auto mb-8 group/avatar">
                    {/* Outer Glow */}
                    <div className="absolute -inset-3 bg-gradient-to-br from-[#81D7B4]/40 via-[#81D7B4]/20 to-transparent opacity-0 group-hover/avatar:opacity-100 blur-xl transition-all duration-700"></div>

                    {/* Squircle Frame */}
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[inset_0_0_30px_rgba(129,215,180,0.2)] transition-all duration-500 group-hover/avatar:shadow-[inset_0_0_50px_rgba(129,215,180,0.3)]">
                      {/* Gradient Border */}
                      <div className="absolute inset-0 p-[1px] rounded-[2rem] bg-gradient-to-br from-[#81D7B4]/50 via-[#81D7B4]/30 to-[#81D7B4]/10">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-md"></div>
                      </div>

                      {/* Image Container */}
                      <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                        />

                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500"></div>

                        {/* Shine Effect */}
                        <div
                          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover/avatar:translate-x-full"
                          style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                        ></div>
                      </div>
                    </div>

                    {/* Decorative Corner Accents */}
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-6 h-6 opacity-0 group-hover/avatar:opacity-100 transition-all duration-700"
                        style={{
                          top: i < 2 ? "-2px" : "auto",
                          bottom: i >= 2 ? "-2px" : "auto",
                          left: i % 2 === 0 ? "-2px" : "auto",
                          right: i % 2 === 1 ? "-2px" : "auto",
                          background: `conic-gradient(from ${90 * i}deg, transparent 0deg, #81D7B4/10 90deg, transparent 180deg)`,
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Member Info */}
                  <div className="text-center relative">
                    {/* Name Container */}
                    <div className="relative inline-block mb-4">
                      <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                        {member.name}
                      </h3>
                      <div className="h-px w-0 bg-gradient-to-r from-[#81D7B4] via-[#81D7B4]/60 to-transparent group-hover:w-full transition-all duration-700"></div>
                    </div>

                    {/* Role Badge - Now below name */}
                    <div className="relative mb-6">
                      <div className="inline-block">
                        <div className="relative px-4 py-2 rounded-xl bg-[#81D7B4]/10 border border-[#81D7B4]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] backdrop-blur-sm group-hover:bg-[#81D7B4]/15 transition-colors duration-500">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#81D7B4]/0 via-[#81D7B4]/10 to-[#81D7B4]/0 animate-shimmer"></div>
                          <p className="text-[#81D7B4] text-sm font-medium relative z-10">
                            {member.role}
                          </p>
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute -inset-2 rounded-xl bg-[#81D7B4]/20 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center items-center gap-4">
                      {Object.entries(member.socials).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative group/icon"
                        >
                          {/* Icon Container */}
                          <div className="relative">
                            {/* Neumorphic Shadow */}
                            <div className="absolute inset-0 rounded-xl bg-[#f8fafa] shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)] opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>

                            {/* Icon Button */}
                            <div className="relative w-10 h-10 rounded-xl bg-[#f8fafa] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] flex items-center justify-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#81D7B4]/10">
                              <div className="text-[#81D7B4] transform group-hover/icon:scale-110 transition-transform duration-300">
                                {platform === "twitter" && (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                  </svg>
                                )}
                                {platform === "github" && (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                  </svg>
                                )}
                                {platform === "farcaster" && (
                                  <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle cx="16" cy="16" r="16" fill="#8A63D2" />
                                    <path
                                      d="M21.5 10.5C21.5 9.67157 20.8284 9 20 9H12C11.1716 9 10.5 9.67157 10.5 10.5V21.5C10.5 22.3284 11.1716 23 12 23H20C20.8284 23 21.5 22.3284 21.5 21.5V10.5Z"
                                      fill="white"
                                    />
                                    <path
                                      d="M16 13.5C17.3807 13.5 18.5 14.6193 18.5 16C18.5 17.3807 17.3807 18.5 16 18.5C14.6193 18.5 13.5 17.3807 13.5 16C13.5 14.6193 14.6193 13.5 16 13.5Z"
                                      fill="#8A63D2"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute -inset-2 bg-[#81D7B4]/20 rounded-xl blur-lg opacity-0 group-hover/icon:opacity-50 transition-opacity duration-300"></div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.07] pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-45">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#81D7B4] animate-spin-slow"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#81D7B4] animate-spin-slow"
                      style={{ animationDirection: "reverse" }}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#81D7B4] animate-spin-slow"
                    />
                  </svg>
                </div>

                {/* Corner Patterns */}
                <div className="absolute top-0 left-0 w-16 h-16 opacity-[0.07] pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <pattern
                      id="grid"
                      x="0"
                      y="0"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="5" cy="5" r="1" fill="currentColor" className="text-[#81D7B4]" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Bottom Right Circuit Pattern */}
                <div className="absolute bottom-0 right-0 w-20 h-20 opacity-[0.07] pointer-events-none transform rotate-45">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M10,50 L90,50 M50,10 L50,90 M30,30 L70,70 M70,30 L30,70"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#81D7B4]"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>

                {/* Animated Border */}
                <div
                  className="absolute inset-[-1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(129,215,180,0.3), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
