interface EnvConfig {
  API_URL: string;
  AUTH_URL: string;
  WS_URL: string;
  CLIENT_COOKIE: string;
  PRODUCTION: boolean;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const envConfig = window.envConfig as EnvConfig;
