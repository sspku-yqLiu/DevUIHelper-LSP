/*
 * @Author: your name
 * @Date: 2020-05-12 14:52:22
 * @LastEditTime: 2020-05-14 08:42:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP V4.0\server\src\GlobalData\GlobalData.ts
 */
import {SearchResult,ParseOption, TreeError, SearchResultType} from '../parser/type';
import { HTMLAST, HTMLTagAST} from '../parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { htmlSourceTreeRoot,logger, host } from '../server';
import { HTMLInfoNode, Attribute, RootNode } from '../source/html_info';
import { YQ_Parser,SearchParser } from '../parser/parser';
import { HoverProvider } from '../HoverProvider';
import { TextDocuments } from 'vscode-languageserver';
import { convertStringToName,adjustSpanToAbosultOffset } from '../util';
import { HoverSearchResult } from '../type';
import { Span } from '../DataStructor/type';
import { CompletionProvider } from '../completion';


export class Host{
	public parser = new YQ_Parser();
	public hunter = new Hunter();
	public igniter = new Igniter();
	public snapshotMap = new Map<string,SnapShot>();
	public hoverProvider = new HoverProvider();
	public completionProvider = new CompletionProvider();
	public documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
	constructor(){
	}
}
export class Hunter{
	private searchParser = new SearchParser();
	constructor(){

	}

	searchTerminalASTForCompletion(offset:number,uri:string):SearchResult|undefined{
		return this.searchTerminalAST(offset-1,uri);
	}
	searchTerminalASTForHover(offset:number,uri:string):HoverSearchResult{
		let{ast,type}= this.searchTerminalAST(offset,uri);
		if(!ast) {throw Error(`this offset does not in any Node :${offset}`)}
		let _span = ast.nameSpan.clone();
		adjustSpanToAbosultOffset(ast,_span);
		let _map = host.snapshotMap.get(uri)?.HTMLAstToHTMLInfoNode;
		if(!_span){
			return{node:undefined,span:undefined};
		}
		if(type === SearchResultType.Null||!ast){
			return{node:undefined,span:_span};
		}else{
			let _htmlInfoNode = this.findHTMLInfoNode(ast,_map!);
			return {node:_htmlInfoNode,span:_span};
		}
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

	findHTMLInfoNode(ast:HTMLAST,map:Map<HTMLAST,HTMLInfoNode>):HTMLInfoNode|undefined{

		//表内存在则直接返回
		let res = map.get(ast);
		if(res){return res;}

		if(ast.getName()=="$$ROOT$$"){
			let _htmlroot = htmlSourceTreeRoot;
			map.set(ast,_htmlroot);
			return _htmlroot;
		}
		let _name =ast.getName();
		let _parentast =ast.parentPointer;
		//没有指针报错
		if(!_parentast||!_name){ throw Error(`None parent cursor or name of node ${_name}`)}
		if(ast instanceof HTMLTagAST){
			return htmlSourceTreeRoot.getsubNode(_name);
		}
		else{
			//表内没有则向上递归
			_name = convertStringToName(_name);
			let _parentInfoNode = map.get(_parentast);
			if(!_parentInfoNode){
				 _parentInfoNode = this.findHTMLInfoNode(_parentast,map);
			}
			if(_parentInfoNode){
				let _currentInfoNode = _parentInfoNode?.getsubNode(_name);
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
	parseTextDocument(textDocument:TextDocument,parseOption:ParseOption){
		let {root,errors}=host.parser.parseTextDocument(textDocument,parseOption);
		host.snapshotMap.set(textDocument.uri,new SnapShot(root,errors,textDocument));
		logger.debug(JSON.stringify(root));
	}
}
export class SnapShot{
	public HTMLAstToHTMLInfoNode = new Map<HTMLAST,HTMLInfoNode>();
	constructor(
		public root:HTMLAST,
		public errors:TreeError[],
		public textDocument:TextDocument,
		){
		}
}