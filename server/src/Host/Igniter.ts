import { SupportFrameName, SupportComponentName, ParseOption } from '../parser/type';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { host, logger } from '../server';
import { SnapShot } from './Host';
import * as fs from 'fs';
import { RootNode } from '../parser/WareHouse/Storage';
import { devuiInfo } from '../source/info';

// const info = require('../source/info.js');
/*
 * @Author: your name
 * @Date: 2020-06-05 20:55:45
 * @LastEditTime: 2020-06-05 22:12:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\Host\Igniter.ts
 */ 
export class Igniter {
	public parseOption:ParseOption = {frame:SupportFrameName.Null,components:[]};
	private componentToUrl = new Map<SupportComponentName, string>();

	private rootPaths:string[] = [];
	constructor() {
	}
	init() {

	}
	parseTextDocument(textDocument: TextDocument, parseOption: ParseOption) {
		if(!textDocument){
			logger.error(`Parsing Failed`);
		}
		let { root, errors } = host.parser.parseTextDocument(textDocument, parseOption);
		host.snapshotMap.set(textDocument.uri, new SnapShot(root, errors, textDocument));
		return;
		//ROOTLogger
		// logger.debug(JSON.stringify(root));
	}
	ignite(path: string): ParseOption {
		const _index = path.indexOf('\\src');
		let _flag = true;
		let _srcpath = path + '\\src';
		let _nodeModulePath = path ;
		try {
			this.checkProjectFrameworkAndComponentName(_nodeModulePath);
			logger.info(`Scanner Done!,
RootPaths:${this.rootPaths}
Parsing Document...`);
			this.loadSourceTree();
			logger.info('Igniter Done, Extension Start...');
			logger.info(`Welcome To DevUIHelper`);
			logger.info(`Thanks To Zoujie Linruihong Wangyihui and Zhangke`);
			logger.info(`Thanks To PKU_Huawei class`);
			logger.info(`This extension was built by yqLiu, enjoy it!`);
		} catch{ 
			logger.error(`Ingiter Failed, Please connect us throught github.`);
		}
		return this.parseOption;
	}
	parseAllDocument(): void {
		const fileReadyToParse = [];
		if (this.parseOption.frame !== SupportFrameName.Null && this.parseOption.components !== []){
			this.rootPaths.forEach(root=>{
				_parseAllDocument(root+'src');
			});
		}
		logger.debug(fileReadyToParse);

		fileReadyToParse.forEach(file=>{
			logger.debug(`Parsing ${file}`);
			let textDocument = host.getDocumentFromURI(file);
			host.parser.parseTextDocument(textDocument,this.parseOption);
		});

		//rec
		function _parseAllDocument(path){
			logger.debug(`checking ${path}`);
			let pa = fs.readdirSync(path);
			pa.forEach(element => {
				const info = fs.statSync(path + '\\' + element);
				if (info.isDirectory()) {
					_parseAllDocument(path + '\\' + element);
				} else {
					if(element.endsWith('html')){
						fileReadyToParse.push(path + '\\' + element);
					}
				}		
			});
			return;
		}

	}
	checkProjectFrameworkAndComponentName(nodeModulesPath: string): void {
		//for developers
		if(nodeModulesPath.endsWith('devui')){
			this.parseOption={components:[SupportComponentName.DevUI],frame:SupportFrameName.Angular};
			return;
		}

		let pa = fs.readdirSync(nodeModulesPath);
		if(!pa){
			return;
		}
		pa.forEach(ele => {
			let _path = nodeModulesPath + '/' + ele;
			const info = fs.statSync(_path);
			if (info.isDirectory()) {
				if (_path.endsWith('devui')) {
					if(!this.parseOption.components.includes(SupportComponentName.DevUI))
					this.parseOption.components.push(SupportComponentName.DevUI);
					logger.info(`Find Devui At ${_path}`);
					this.componentToUrl.set(SupportComponentName.DevUI, _path);
				}
				// this.checkProjectFrameworkAndComponentName(_path);
				else if (_path.endsWith("/@angular")) {
					this.parseOption.frame = SupportFrameName.Angular;
					let _tempPath  = _path.replace(/node_modules(\S)*/g,"");
					if(!this.rootPaths.includes(_tempPath)){
						this.rootPaths.push(_tempPath);
					}
					logger.info(`Find Angular At ${_path}`);
				}else{
					this.checkProjectFrameworkAndComponentName(_path);
				}
			}
		});
	}
	loadSourceTree() {
		logger.info(`Parsing Done! Loading Source...`);
		//TODO: 将它编程所有路径 使check定死。
		for (let com of ['tempPath']) {
			this._loadSouceTree(com).then(value=>{
				host.HTMLComoponentSource =value[0];
				host.HTMLDirectiveSource =value[1];
			});
		}
	}
	async _loadSouceTree(comPath: string):Promise<RootNode[]> {
		return new Promise((resolve, rejects) => {
			resolve(host.architect.build(devuiInfo,SupportComponentName.DevUI));
		});
	}
}