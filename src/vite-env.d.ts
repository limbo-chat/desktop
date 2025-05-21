/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_LIMBO_API_VERSION: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
