import path from 'path';
import { BuildConfig } from '@hulljs/webpack';

export default (env:string):BuildConfig => {
  console.log('env:', env);
  const config:BuildConfig = {
    projectType: 'react',
    entry: path.resolve(__dirname, './src/index'),
    outputPath: path.resolve(__dirname, './build'),
    outputPublicPath: '/',
    htmlPluginConfig: {
      title: 'hull-webpack-react',
      template: path.resolve(__dirname, './public/index.html'),
      favicon: path.join(__dirname, './public/favicon.ico'),
    },
    splitChunks: {
      cacheGroups: {
        reactChunks: {
          name: 'reactChunks',
          test: (module:any) => new RegExp(/react/).test(module.context),
          chunks: 'all',
        },
      },
    },
  };
  return config;
};
