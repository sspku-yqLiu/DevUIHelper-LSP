import{configure,getLogger, Logger} from 'log4js';
import { Host } from './parser/Host/Host';
import { DConnection } from './DConnection';
export const logger = createLogger();
export const host = new Host();
export const dconnection =new DConnection(host,logger);

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