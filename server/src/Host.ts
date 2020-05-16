/*
 * @Author: your name
 * @Date: 2020-05-12 14:52:22
 * @LastEditTime: 2020-05-16 19:29:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP V4.0\server\src\GlobalData\GlobalData.ts
 */
import {SearchResult,ParseOption, TreeError, SearchResultType} from './parser/type';
import { HTMLAST, HTMLTagAST} from './parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { logger, host } from './server';
import { HTMLInfoNode, Attribute, RootNode, DevUIParamsConstructor } from './source/html_info';
import { YQ_Parser,SearchParser } from './parser/parser';
import { HoverProvider } from './HoverProvider';
import { TextDocuments } from 'vscode-languageserver';
import { convertStringToName,adjustSpanToAbosulutOffset } from './util';
import { HoverSearchResult } from './type';
import { Span } from './DataStructure/type';
import { CompletionProvider } from './CompletionProvider';
import * as fs from 'fs';
import { stringify } from 'querystring';


export class Host{
	public parser = new YQ_Parser();
	public hunter = new Hunter();
	public igniter = new Igniter();
	public snapshotMap = new Map<string,SnapShot>();
	public hoverProvider = new HoverProvider();
	public completionProvider = new CompletionProvider();
	public documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
	public htmlSourceTreeRoot = new DevUIParamsConstructor().build();
	constructor(){

	}
	getDocumentFromURI(uri:string):TextDocument{
		let _result = this.documents.get(uri)
		if(!_result){
			throw Error(`Cannot get file from uri ${uri}`)
		}
		return _result;
	}
	getSnapShotFromURI(uri:string):SnapShot{
		let _result = this.snapshotMap.get(uri);
		if(!_result){
			throw Error(`Cannot get snapShot from uri ${uri}`)
		}
		return _result;
	}
}
export class Hunter{
	private searchParser = new SearchParser();
	constructor(){

	}

	searchTerminalAST(offset:number,uri:string):SearchResult{
		let _snapShot = host.snapshotMap.get(uri);
		if(!_snapShot){throw Error(`this uri does not have a snapShot: ${uri}`)}
		const{ root,textDocument,HTMLAstToHTMLInfoNode } = _snapShot;
		if(!root){
			throw Error(`Snap shot does not have this file : ${uri}, please parse it befor use it!`);
		}
		let _result = this.searchParser.DFS(offset,root);
		//调整Node位置
		return _result?_result:{ast:undefined,type:SearchResultType.Null};
	}

	findHTMLInfoNode(ast:HTMLAST|undefined,uri:string,map?:Map<HTMLAST,HTMLInfoNode>):HTMLInfoNode|undefined{
		if(!ast){
			throw Error(`ast Does not Exits in file: ${uri}`)
		}
		if(!map){
			map = host.getSnapShotFromURI(uri).HTMLAstToHTMLInfoNode;
		}
		//表内存在则直接返回
		let res = map.get(ast);
		if(res){return res;}

		if(ast.getName()=="$$ROOT$$"){
			let _htmlroot = host.htmlSourceTreeRoot;
			map.set(ast,_htmlroot);
			return _htmlroot;
		}
		let _name =ast.getName();
		let _parentast =ast.parentPointer;
		//没有指针报错
		if(!_parentast||!_name){ throw Error(`None parent cursor or name of node ${_name}`)}
		if(ast instanceof HTMLTagAST){
			return host.htmlSourceTreeRoot.getSubNode(_name);
		}
		else{
			//表内没有则向上递归
			_name = convertStringToName(_name);
			let _parentInfoNode = map.get(_parentast);
			if(!_parentInfoNode){
				 _parentInfoNode = this.findHTMLInfoNode(_parentast,uri);
			}
			if(_parentInfoNode){
				let _currentInfoNode = _parentInfoNode?.getSubNode(_name);
				if(_currentInfoNode){
					map.set(ast,_currentInfoNode);
				}
				return _currentInfoNode;
			}
		}
	}
}
export class Agent{
	
}
export class Igniter{
	constructor(){}
	init(){
		
	}
	parseTextDocument(textDocument:TextDocument,parseOption:ParseOption){
		let {root,errors}=host.parser.parseTextDocument(textDocument,parseOption);
		host.snapshotMap.set(textDocument.uri,new SnapShot(root,errors,textDocument));
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
}
export class SnapShot{
	public HTMLAstToHTMLInfoNode = new Map<HTMLAST,HTMLInfoNode>();
	public context:string = "";
	constructor(
		public root:HTMLAST,
		public errors:TreeError[],
		public textDocument:TextDocument,
		){
			this.context = this.textDocument.getText();
		}
}