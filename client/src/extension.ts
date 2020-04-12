/*
 * @Author: your name
 * @Date: 2020-03-04 17:55:03
 * @LastEditTime: 2020-04-11 21:03:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \lsp-sample\client\src\extension.ts
 */
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient';
import{registerCommands} from './commands';
import {projectLoadingNotification} from './protocol';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	RevealOutputChannelOn
} from 'vscode-languageclient';

let client: LanguageClient;
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

export function activate(context: vscode.ExtensionContext) {
	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: lsp.ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		},
		
	};

	// Options to control the language client
	let clientOptions: lsp.LanguageClientOptions = {
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

		revealOutputChannelOn: lsp.RevealOutputChannelOn.Never,
		
	};
	
	

	// Create the language client and start the client.
	const forceDebug = process.env['NG_DEBUG'] === 'true';
	/* 名字和id 不影响提示效果*/ 
	client = new lsp.LanguageClient(
		// 'languageServerExample',
		// 'Language Server Example',
		'DevUILanguageSupport',
		'DevUI Language Support',
		serverOptions,
		clientOptions
	);

	/* 保证客户端能够在扩展关闭的同时关闭，并开启客户端*/
	context.subscriptions.push(...registerCommands(client),client.start());
	
	/**
	 * @description: 对client的变化进行应答 
	 * @param {type} 
	 * @return: 
	 */
	client.onDidChangeState((e) =>{
		let task : {resolve:() => void}|undefined;
		if(e.newState == lsp.State.Running){
			client.onNotification(projectLoadingNotification.start,()=>{
				if(task){
					task.resolve();
					task = undefined;
				}
				vscode.window.withProgress({
					location:vscode.ProgressLocation.Window, 
					title:'Initialzing DevUI language features',
				},
				()=> new Promise((resolve)=>{
					task = {resolve};
				}));
			});
			client.onNotification(projectLoadingNotification.finish,()=>{
				if(task){
					task.resolve();
					task = undefined;
				}
			});
		}
	});
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
