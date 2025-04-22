export interface LoginConfig {
  appId: string;
  token: string;
  baseUrl: string;
}

export interface QrCodeLoginConfig extends LoginConfig {}
