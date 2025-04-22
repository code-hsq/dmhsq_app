import {
  getQrCodeQueryReqNoSend,
  getQrCodeUrlReqNoSend,
  QrCodeLoginConfig,
} from '@dmhsq_app/utils';
import { ref, reactive, computed } from 'vue';
export * from './types';
import { QR_UserInfo, QR_Status } from './types';

export const useQrCodeLogin = (config: QrCodeLoginConfig) => {
  const timeOut = 60;
  if (!config.appId) {
    throw new Error('appId is required');
  }
  if (!config.token) {
    throw new Error('token is required');
  }
  if (!config.baseUrl) {
    throw new Error('baseUrl is required');
  }
  const state = reactive({
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
  const times = ref(0);
  const timer = ref();
  const qrCodeReq = getQrCodeUrlReqNoSend(config);
  const qrCodeQueryReq = getQrCodeQueryReqNoSend(config);

  const queryStatus = () => {
    state.qrCodeTimeOut = false;
    timer.value = setInterval(() => {
      times.value += 3;
      send();
      if (times.value >= timeOut) {
        clearInterval(timer.value);
        state.loginSuccess = false;
        state.qrCodeTimeOut = true;
      }
    }, 3000);
    const send = () =>
      fetch(qrCodeQueryReq.url, {
        method: qrCodeQueryReq.method,
        headers: {
          ...qrCodeQueryReq.headers,
          'content-type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          key: state.key,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          if (res.data.status == QR_Status.HAD_LOGIN) {
            timer.value = null;
            clearInterval(timer.value);
            state.status = res.data.status;
            state.userInfo = res.data.userInfo;
            state.loginSuccess = true;
            state.token = res.data.token;
            state.expiration = res.data.expiration;
          } else {
            state.status = res.data.status;
          }
        });
  };

  const getQrCode = () => {
    try {
      if (timer.value) {
        timer.value = null;
        clearInterval(timer.value);
      }
      state.loading = true;
      fetch(qrCodeReq.url, {
        method: qrCodeReq.method,
        headers: {
          ...qrCodeReq.headers,
        },
        mode: 'cors',
      })
        .then(async (response) => {
          const key = response.headers.get('x-app-key') || '';
          const blob = await response.blob();
          const _url = window.URL.createObjectURL(new Blob([blob]));
          state.url = _url;
          state.key = key;
          state.loading = false;
          state.success = true;
          state.status = 1;
          queryStatus();
        })
        .catch((error) => {
          state.success = false;
          throw error;
        });
    } catch (error) {
      state.loading = false;
      state.success = false;
      throw error;
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
  };
};
