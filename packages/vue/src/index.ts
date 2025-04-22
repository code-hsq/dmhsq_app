import {
  getQrCodeQueryReqNoSend,
  getQrCodeUrlReqNoSend,
  QrCodeLoginConfig,
} from '@dmhsq_app/utils';
import type { Ref } from 'vue';
import { ref, reactive, computed } from 'vue';
export * from './types';
import { QR_UserInfo, QR_Status } from './types';

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

export const useQrCodeLogin = (config: QrCodeLoginConfig) => {
  const timeOut = 60;

  // Validate config
  const validateConfig = () => {
    if (!config.appId) {
      throw new Error('appId is required');
    }
    if (!config.token) {
      throw new Error('token is required');
    }
    if (!config.baseUrl) {
      throw new Error('baseUrl is required');
    }
  };

  validateConfig();

  const state = reactive<QrCodeState>({
    loading: false,
    success: true,
    url: '',
    key: '',
    loginSuccess: false,
    token: '',
    userInfo: {} as QR_UserInfo,
    status: 0,
    qrCodeTimeOut: false,
    expiration: 0,
  });

  const times: Ref<number> = ref(0);
  const timer: Ref<number | null> = ref(null);
  const qrCodeReq = getQrCodeUrlReqNoSend(config);
  const qrCodeQueryReq = getQrCodeQueryReqNoSend(config);

  const clearTimer = () => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  const queryStatus = async () => {
    state.qrCodeTimeOut = false;
    clearTimer();

    const send = async () => {
      try {
        const response = await fetch(qrCodeQueryReq.url, {
          method: qrCodeQueryReq.method,
          headers: {
            ...qrCodeQueryReq.headers,
            'content-type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({
            key: state.key,
          }),
        });

        const res = await response.json();

        if (res.data.status === QR_Status.HAD_LOGIN) {
          clearTimer();
          state.status = res.data.status;
          state.userInfo = res.data.userInfo;
          state.loginSuccess = true;
          state.token = res.data.token;
          state.expiration = res.data.expiration;
        } else {
          state.status = res.data.status;
        }
      } catch (error) {
        console.error('Error querying QR code status:', error);
        state.success = false;
      }
    };

    timer.value = setInterval(() => {
      times.value += 3;
      send();
      if (times.value >= timeOut) {
        clearTimer();
        state.loginSuccess = false;
        state.qrCodeTimeOut = true;
      }
    }, 3000);
  };

  const getQrCode = async () => {
    try {
      clearTimer();
      state.loading = true;
      
      const response = await fetch(qrCodeReq.url, {
        method: qrCodeReq.method,
        headers: {
          ...qrCodeReq.headers,
        },
        mode: 'cors',
      });

      const key = response.headers.get('x-app-key') || '';
      const blob = await response.blob();
      const _url = window.URL.createObjectURL(new Blob([blob]));
      
      state.url = _url;
      state.key = key;
      state.loading = false;
      state.success = true;
      state.status = 1;
      
      queryStatus();
    } catch (error) {
      state.loading = false;
      state.success = false;
      console.error('Error getting QR code:', error);
      throw error;
    }
  };

  // Cleanup function
  const cleanup = () => {
    clearTimer();
    if (state.url) {
      URL.revokeObjectURL(state.url);
    }
  };

  return {
    loading: computed(() => state.loading),
    url: computed(() => state.url),
    success: computed(() => state.success),
    key: computed(() => state.key),
    token: computed(() => state.token),
    loginSuccess: computed(() => state.loginSuccess),
    userInfo: computed(() => state.userInfo),
    status: computed(() => state.status),
    qrCodeTimeOut: computed(() => state.qrCodeTimeOut),
    expiration: computed(() => state.expiration),
    getQrCode,
    cleanup,
  };
};
