export interface QR_UserInfo {
    nickname: string;
    avatarUrl: string;
    id: string;
}
export declare enum QR_Status {
    NO_SCAN = 0,
    HAD_SCAN = 1,
    HAD_LOGIN = 2
}
