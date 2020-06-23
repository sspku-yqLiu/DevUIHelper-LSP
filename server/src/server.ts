import{configure,getLogger, Logger} from 'log4js';
import { Host } from './Host/Host';
import { DConnection } from './DConnection';

export const logger = createLogger();
export const host = new Host();
export const dconnection =new DConnection(host,logger);
dconnection.info(`hello DevUIHelper`);
dconnection.info(`Thanks To Zoujie Linruihong Wangyihui and Zhangke`);
dconnection.info(`Thanks To PKU_Huawei class`);
dconnection.info(`This extension was built by yqLiu, enjoy it!`);
dconnection.listen();
export function createLogger():Logger{
    configure({
        appenders: {
            devuihelper: {
                type: "console",
            },
        },
        categories: { default: { appenders: ["devuihelper"], level: "debug" } }
    });
    return getLogger("devuihelper");
}