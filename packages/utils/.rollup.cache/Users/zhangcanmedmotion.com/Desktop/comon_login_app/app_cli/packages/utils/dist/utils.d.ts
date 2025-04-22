import { QrCodeLoginConfig } from './types';
export declare const getQrCodeUrlReqNoSend: (config: QrCodeLoginConfig) => {
    url: string;
    method: string;
    headers: {
        'x-app-id': string;
        'x-app-token': string;
        responseType: string;
    };
};
export declare const getQrCodeQueryReqNoSend: (config: QrCodeLoginConfig) => {
    url: string;
    method: string;
    headers: {
        'x-app-id': string;
        'x-app-token': string;
    };
};
