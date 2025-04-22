import { QrCodeLoginConfig } from '@dmhsq_app/utils';
export * from './types';
import { QR_UserInfo } from './types';
export interface QrCodeState {
    loading: boolean;
    success: boolean;
    url: string;
    key: string;
    loginSuccess: boolean;
    token: string;
    userInfo: QR_UserInfo;
    status: number;
    qrCodeTimeOut: boolean;
    expiration: number;
}
export declare const useQrCodeLogin: (config: QrCodeLoginConfig) => {
    loading: import("vue").ComputedRef<boolean>;
    url: import("vue").ComputedRef<string>;
    success: import("vue").ComputedRef<boolean>;
    key: import("vue").ComputedRef<string>;
    token: import("vue").ComputedRef<string>;
    loginSuccess: import("vue").ComputedRef<boolean>;
    userInfo: import("vue").ComputedRef<{
        nickname: string;
        avatarUrl: string;
        id: string;
    }>;
    status: import("vue").ComputedRef<number>;
    qrCodeTimeOut: import("vue").ComputedRef<boolean>;
    expiration: import("vue").ComputedRef<number>;
    getQrCode: () => Promise<void>;
    cleanup: () => void;
};
