import * as fs from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve'

module.exports = [
  {
    input: 'client/out/extension.js',
    output: {
      file: 'dist/client/index.js',
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
      file: 'dist/server/index.js',
      format: 'amd',
    },
    external: [
      'fs',
      'path',
      'typescript/lib/tsserverlibrary',
      'vscode-languageserver',
      'vscode-uri',
    ],
    watch:{
      include:'lib/**'
    },
    plugins:[
      commonjs({
        sourceMap:false,
      })
    ]
  },
];
