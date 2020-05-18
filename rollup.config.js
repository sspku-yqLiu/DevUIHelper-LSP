/*
 * @Author: your name
 * @Date: 2020-03-14 14:45:36
 * @LastEditTime: 2020-05-18 16:26:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUI-Language-Support\rollup.config.js
 */
import * as fs from 'fs';
import commonjs from 'rollup-plugin-commonjs';

module.exports = [
  {
    input: 'client/out/extension.js',
    output: {
      file: 'Release/client/index.js',
      format: 'cjs',
      exports: 'named',
    },
    external: [
      'path',
      'vscode',
      'vscode-languageclient',
    ],
    plugins: [
      commonjs(),
    ],
  },
  {
    input: 'server/out/server.js',
    output: {
      file: 'Release/server/index.js',
      format: 'amd',
    },
    external: [
      'fs',
      'path',
      'typescript/lib/tsserverlibrary',
      'vscode-languageserver',
      'vscode-uri',
      'log4js',
      'vscode-languageserver-textdocument',
      'rollup-plugin-commonjs',
      'commonjs-proxy'
    ],
    plugins: [
      commonjs(),
    ],
  },
];
