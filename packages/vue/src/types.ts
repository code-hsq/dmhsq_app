export interface QR_UserInfo {
  nickname: string;
  avatarUrl: string;
  id: string;
}

export enum QR_Status {
  NO_SCAN = 1,
  HAD_SCAN = 2,
  HAD_LOGIN = 3,
}
