import { readFileSync } from 'fs';
import baseConfig from '../../rollup.config.base.js';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

// 复用基础配置
const config = {
  ...baseConfig,
  input: 'src/index.ts',
  // 设置全局变量名映射（用于 UMD 格式）
  output: baseConfig.output.map((output) => {
    if (output.format === 'umd') {
      return {
        ...output,
        globals: {
          '@dmhsq_app/utils': 'DAppUtils',
        },
      };
    }
    return output;
  }),
};

export default config;
