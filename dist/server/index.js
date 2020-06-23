define(function () { 'use strict';

    Object.defineProperty(exports, "__esModule", { value: true });
    const log4js_1 = require("log4js");
    const Host_1 = require("./Host/Host");
    const DConnection_1 = require("./DConnection");
    log4js_1.configure({
        appenders: {
            devuihelper: {
                type: "console",
            },
        },
        categories: { default: { appenders: ["devuihelper"], level: "debug" } }
    });
    exports.logger = log4js_1.getLogger("devuihelper");
    exports.host = new Host_1.Host();
    exports.dconnection = new DConnection_1.DConnection(exports.host, exports.logger);
    exports.dconnection.info(`hello DevUIHelper`);
    exports.dconnection.info(`Thanks To Zoujie Linruihong Wangyihui and Zhangke`);
    exports.dconnection.info(`Thanks To PKU_Huawei class`);
    exports.dconnection.info(`This extension was built by yqLiu, enjoy it!`);
    exports.dconnection.listen();

});
