import type { config } from "./app/providers";

export type ChainId = (typeof config.chains)[number]["id"];
