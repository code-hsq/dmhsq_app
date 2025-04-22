# `@dmhsq_app/vue`

> 快速接入 DMHSQ_APP 应用管理中心的 vue hooks 和 组件库包
> 目前只完成了获取二维码和二维码登录状态 二维码统一为 60s 3s 检查一次状态 暂不开放 refresh_token

## Usage

```sh
npm install @dmhsq_app/vue
```

首先去应用平台获取 token 和 appId

baseUrl 为应用平台地址/api

```js
import { useQrCodeLogin } from '@dmhsq_app/vue';

const {
  getQrCode, // 获取二维码
  loading, // 二维码请求loading
  success, // 二维码获取状态
  url, // 二维码url
  key, // 标志符 基本用不到
  token, // 用户的令牌
  loginSuccess, // 是否登录成功
  userInfo, // 用户信息
  status, // 二维码状态 QR_Status 0 未扫码 1 已扫码 2 已登录
  qrCodeTimeOut, // 二维码是否过期
  expiration, // token 有效时长
} = useQrCodeLogin({
  appId: 'xxxxx',
  token: 'xxxx',
  baseUrl: 'xxxx',
});

getQrCode();
```
