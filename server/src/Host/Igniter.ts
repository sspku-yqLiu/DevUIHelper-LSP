import { SupportFrameName, SupportComponentName, ParseOption } from '../parser/type';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { host, logger } from '../server';
import { SnapShot } from './Host';
import * as fs from 'fs';
import { RootNode } from '../parser/WareHouse/Storage';
const info = require('../source/info.js');
/*
 * @Author: your name
 * @Date: 2020-06-05 20:55:45
 * @LastEditTime: 2020-06-05 22:12:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\Host\Igniter.ts
 */ 
export class Igniter {
	private FrameName: SupportFrameName = SupportFrameName.Null;
	private componentList:SupportComponentName[] = [];
	private componentToUrl = new Map<SupportComponentName, string>();
	private rootPaths:string[] = [];
	constructor() {
	}
	init() {

	}
	parseTextDocument(textDocument: TextDocument, parseOption: ParseOption) {
		let { root, errors } = host.parser.parseTextDocument(textDocument, parseOption);
		host.snapshotMap.set(textDocument.uri, new SnapShot(root, errors, textDocument));
		//ROOTLogger
		// logger.debug(JSON.stringify(root));
		//ALERT:DEBUG用,发行版应该删除
		// fs.writeFile(__dirname+'\\result.json',JSON.stringify(root),(err)=>{
		// 	if(err){
		// 		logger.debug("SometionWronbg Happen!! ______________")
		// 		logger.debug(err.message);

		// 		throw err;
		// 	}
		// 	logger.debug("Data Wirte Done !!! ______________")
		// });
		// logger.debug(process.execPath);
		// logger.debug(__dirname);
		// logger.debug(process.cwd());
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
			if (this.FrameName !== SupportFrameName.Null && this.componentList !== [])
				this.rootPaths.forEach(root=>{
					this.parseAllDocument(root+'src');
				});
			logger.info(`Parsing Done! Loading Source...`);
			this.loadSourceTree();
			logger.info('Igniter Done, Extension Start...');
			logger.info(`Welcome To DevUIHelper`);
			logger.info(`Thanks To Zoujie Linruihong Wangyihui and Zhangke`);
			logger.info(`Thanks To PKU_Huawei class`);
			logger.info(`This extension was built by yqLiu, enjoy it!`);
		} catch{ }
		return { frame: this.FrameName, components: this.componentList };
	}
	parseAllDocument(path: string): void {
		let pa = [];
		try{
			 pa = fs.readdirSync(path);
		}catch{
			return;
		}
		pa.forEach(element => {
			const info = fs.statSync(path + '\\' + element);
			if (info.isDirectory()) {
				// logger.debug(`dir:${path+'\\'+element}`);
				this.parseAllDocument(path + '/' + element);
			} else {
				// logger.debug(`file:${path+'\\'+element}`);
			}
		});
	}
	checkProjectFrameworkAndComponentName(nodeModulesPath: string): void {
		// let result:IgniterResult ={Frame:SupportFrameName.Null,Components:[]};
		let pa = fs.readdirSync(nodeModulesPath);
		if(!pa){
			return;
		}
		pa.forEach(ele => {
			let _path = nodeModulesPath + '/' + ele;
			const info = fs.statSync(_path);
			if (info.isDirectory()) {
				if (_path.endsWith('ng-devui')) {
					if(!this.componentList.includes(SupportComponentName.DevUI))
					this.componentList.push(SupportComponentName.DevUI);
					logger.info(`Find Devui At ${_path}`);
					this.componentToUrl.set(SupportComponentName.DevUI, _path);
				}
				// this.checkProjectFrameworkAndComponentName(_path);
				else if (_path.endsWith("/@angular")) {
					this.FrameName = SupportFrameName.Angular;
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
		for (let com of this.componentToUrl.values()) {
			this._loadSouceTree(com).then(value=>{
				host.HTMLComoponentSource =value[0];
				host.HTMLDirectiveSource =value[1];
			});
		}
	}
	async _loadSouceTree(comPath: string):Promise<RootNode[]> {
		return new Promise((resolve, rejects) => {
			// fs.readFile(comPath+"/wch/info.json", { encoding: 'UTF-8' }, (err, data) => {
			// 	if (err) {
			// 		rejects(err.message);
			// 	} else {
			// 		const comInfo = JSON.parse(data);
			// 		// logger.debug(comInfo[0]);
			// 		resolve(host.architect.build(comInfo));
			// 	}
			// });
			resolve(host.architect.build(info.devuiInfo,SupportComponentName.DevUI));
		});
	}
}