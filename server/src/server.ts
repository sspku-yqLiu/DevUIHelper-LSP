/*
 * @Author: your name
 * @Date: 2020-05-15 12:53:58
 * @LastEditTime: 2020-05-18 21:55:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\server.ts
 */ 
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import{configure,getLogger} from 'log4js';

import { Host } from './Host/Host';
import { DConnection } from './DConnection';
configure({
    appenders: {
        devuihelper: {
            type: "console",
        },
    },
    categories: { default: { appenders: ["devuihelper"], level: "debug" } }
});
export const logger = getLogger("devuihelper");
export const host = new Host();
export const dconnection =new DConnection(host,logger);
dconnection.info(`hello DevUIHelper`);
dconnection.info(`Thanks To Zoujie Linruihong Wangyihui and Zhangke`);
dconnection.info(`Thanks To PKU_Huawei class`);
dconnection.info(`This extension was built by yqLiu, enjoy it!`);
dconnection.listen();
