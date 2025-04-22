'use strict';

var vue = require('vue');

const getQrCodeUrlReqNoSend = config => {
  const {
    appId,
    token,
    baseUrl
  } = config;
  const url = baseUrl + `/appuser/qrcode`;
  return {
    url,
    method: 'GET',
    headers: {
      'x-app-id': appId,
      'x-app-token': token,
      responseType: 'blob'
    }
  };
};
const getQrCodeQueryReqNoSend = config => {
  const {
    appId,
    token,
    baseUrl
  } = config;
  const url = baseUrl + `/appuser/queryCode`;
  return {
    url,
    method: 'POST',
    headers: {
      'x-app-id': appId,
      'x-app-token': token
    }
  };
};

exports.QR_Status = void 0;
(function (QR_Status) {
  QR_Status[QR_Status["NO_SCAN"] = 1] = "NO_SCAN";
  QR_Status[QR_Status["HAD_SCAN"] = 2] = "HAD_SCAN";
  QR_Status[QR_Status["HAD_LOGIN"] = 3] = "HAD_LOGIN";
})(exports.QR_Status || (exports.QR_Status = {}));

const useQrCodeLogin = config => {
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
  const state = vue.reactive({
    loading: false,
    success: true,
    url: '',
    key: '',
    loginSuccess: false,
    token: '',
    userInfo: {},
    status: 0,
    qrCodeTimeOut: false,
    expiration: 0
  });
  const times = vue.ref(0);
  const timer = vue.ref(null);
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
            'content-type': 'application/json'
          },
          mode: 'cors',
          body: JSON.stringify({
            key: state.key
          })
        });
        const res = await response.json();
        if (res.data.status === exports.QR_Status.HAD_LOGIN) {
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
          ...qrCodeReq.headers
        },
        mode: 'cors'
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
    loading: vue.computed(() => state.loading),
    url: vue.computed(() => state.url),
    success: vue.computed(() => state.success),
    key: vue.computed(() => state.key),
    token: vue.computed(() => state.token),
    loginSuccess: vue.computed(() => state.loginSuccess),
    userInfo: vue.computed(() => state.userInfo),
    status: vue.computed(() => state.status),
    qrCodeTimeOut: vue.computed(() => state.qrCodeTimeOut),
    expiration: vue.computed(() => state.expiration),
    getQrCode,
    cleanup
  };
};

exports.useQrCodeLogin = useQrCodeLogin;
//# sourceMappingURL=index.cjs.js.map
