'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var vscode = _interopDefault(require('vscode'));
var vscodeLanguageclient = _interopDefault(require('vscode-languageclient'));

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var commands = createCommonjsModule(function (module, exports) {
var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * 重启DeuUIServer
 * @param client language client
 */
function restartDevUIServer(client) {
    return {
        id: 'angular.restartDevUIServer',
        execute() {
            return __awaiter(this, void 0, void 0, function* () {
                yield client.stop();
                return client.start();
            });
        },
    };
}
function registerCommands(client) {
    const commands = [
        restartDevUIServer(client),
    ];
    const disposables = commands.map((command) => {
        return vscode.commands.registerCommand(command.id, command.execute);
    });
    return disposables;
}
exports.registerCommands = registerCommands;

});

var protocol = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: your name
 * @Date: 2020-03-07 15:48:43
 * @LastEditTime: 2020-03-07 15:48:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \lsp-sample\client\src\protocol.ts
 */

exports.projectLoadingNotification = {
    start: new vscodeLanguageclient.NotificationType0('DevUI-language-service/projectLoadingStart'),
    finish: new vscodeLanguageclient.NotificationType0('DevUI-language-service/projectLoadingFinish')
};

});

var extension = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });





const vscode_languageclient_1 = vscodeLanguageclient;
let client;
// let provider1 = vscode.languages.registerCompletionItemProvider('html',{
// 	async provideCompletionItems(document:vscode.TextDocument,position:vscode.Position,token:vscode.CancellationToken,context:vscode.CompletionContext){
// 		let item: vscode.CompletionItem = await instance.post('/complete', { code: getLine(document, position) })
//                 .then(function (response: any) {
//                     console.log('complete: ' + response.data);
//                     return new vscode.CompletionItem(response.data);
//                 })
//                 .catch(function (error: Error) {
//                     console.log(error);
//                     return new vscode.CompletionItem('No suggestion');
// 				});
// 		return [item];
// 	}
// })
function activate(context) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions
        },
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: [
            { scheme: 'file', language: 'html' },
            { scheme: 'file', language: 'typescript' },
        ],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            // fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
            /* 为什么这个地方要用tsconfig? */
            fileEvents: vscode.workspace.createFileSystemWatcher('**/tsconfig.json')
        },
        revealOutputChannelOn: vscodeLanguageclient.RevealOutputChannelOn.Never,
    };
    // Create the language client and start the client.
    const forceDebug = process.env['NG_DEBUG'] === 'true';
    /* 名字和id 不影响提示效果*/
    client = new vscodeLanguageclient.LanguageClient(
    // 'languageServerExample',
    // 'Language Server Example',
    'DevUILanguageSupport', 'DevUI Language Support', serverOptions, clientOptions);
    /* 保证客户端能够在扩展关闭的同时关闭，并开启客户端*/
    context.subscriptions.push(...commands.registerCommands(client), client.start());
    /**
     * @description: 对client的变化进行应答
     * @param {type}
     * @return:
     */
    client.onDidChangeState((e) => {
        let task;
        if (e.newState == vscodeLanguageclient.State.Running) {
            client.onNotification(protocol.projectLoadingNotification.start, () => {
                if (task) {
                    task.resolve();
                    task = undefined;
                }
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Window,
                    title: 'Initialzing DevUI language features',
                }, () => new Promise((resolve) => {
                    task = { resolve };
                }));
            });
            client.onNotification(protocol.projectLoadingNotification.finish, () => {
                if (task) {
                    task.resolve();
                    task = undefined;
                }
            });
        }
    });
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;

});

var extension$1 = /*@__PURE__*/unwrapExports(extension);

exports.default = extension$1;
