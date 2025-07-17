/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_LIMBO_API_VERSION: string;
	readonly VITE_DISCORD_INVITE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
