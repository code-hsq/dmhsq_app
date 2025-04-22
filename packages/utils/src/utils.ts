import { QrCodeLoginConfig, LoginConfig } from './types';

export const getQrCodeUrlReqNoSend = (config: QrCodeLoginConfig) => {
  const { appId, token, baseUrl } = config;
  const url = baseUrl + `/appuser/qrcode`;
  return {
    url,
    method: 'GET',
    headers: { 'x-app-id': appId, 'x-app-token': token, responseType: 'blob' },
  };
};

export const getQrCodeQueryReqNoSend = (config: QrCodeLoginConfig) => {
  const { appId, token, baseUrl } = config;
  const url = baseUrl + `/appuser/queryCode`;
  return {
    url,
    method: 'POST',
    headers: { 'x-app-id': appId, 'x-app-token': token },
  };
};
