import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { log } from '../utils';

interface IgetAliasFromConfigRe {
    isTypeScript:boolean;
    alias:Record<string, string>;
    modules:string[];
}

// 从tsconfig.json 和jsconfig.json获取配置
export const getAliasAndModulesFromConfig = (appDirectory:string):IgetAliasFromConfigRe => {
  const tsConfigPath = resolve(appDirectory, 'tsconfig.json');
  const jsConfigPath = resolve(appDirectory, 'jsconfig.json');

  const hasTsConfig = existsSync(tsConfigPath);
  const hasJsConfig = existsSync(jsConfigPath);

  if(hasTsConfig && hasJsConfig){
    log.warn('同时存在 tsconfig.json 和 jsconfig.json,优先使用tsconfig.json');
  }

  const getAliasFromConfig = (configPath:string):IgetAliasFromConfigRe => {
    try {
      const config = JSON.parse(readFileSync(configPath).toString()).compilerOptions || {};
      const { baseUrl = '', paths = {} } = config;
      const absoluteBaseUrl = resolve(appDirectory, baseUrl);
      const modules = [resolve(appDirectory, 'node_modules'), absoluteBaseUrl];
      const alias:Record<string, string> = {};

      Object.keys(paths).forEach((item) => {
        const key = item.replace('/*', '');
        const value = resolve(absoluteBaseUrl, paths[item][0].replace('/*', '').replace('*', ''));
        alias[key] = value;
      });

      return {
        isTypeScript: hasTsConfig,
        alias,
        modules,
      };
    } catch (error:any) {
      log.error(error);
      throw new Error(error);
    }
  };

  const config:IgetAliasFromConfigRe = {
    isTypeScript: false,
    modules: [],
    alias: {},
  };

  return (hasTsConfig || hasTsConfig) ? getAliasFromConfig(hasTsConfig ? tsConfigPath : jsConfigPath) : config;
};
