/*
 * @Author: your name
 * @Date: 2020-05-12 14:52:22
 * @LastEditTime: 2020-05-12 22:25:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP V4.0\server\src\GlobalData\GlobalData.ts
 */
import {SearchResult,ParseOption, TreeError} from '../parser/type';
import { HTMLAST, HTMLTagAST} from '../parser/ast';
import { Tokenizer } from '../parser/lexer';
import { TreeBuilder} from '../parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { htmlSourceTreeRoot,logger } from '../server';
import { HTMLInfoNode, Attribute, RootNode } from '../source/html_info';
import { YQ_Parser } from '../parser/parser';

export const snapshotSet = <{[uri:string]:SnapShot}>{};
export class Host{
	private parser = new YQ_Parser();
	private hunter = new Hunter();

	constructor(){
	}
	parseTextDocument(textDocument:TextDocument,parseOption:ParseOption){
		let {root,errors}=this.parser.parseTextDocument(textDocument,parseOption);
		snapshotSet[textDocument.uri]= new SnapShot(root,errors,textDocument);
		logger.debug(JSON.stringify(root));
	}
}
export class Hunter{
	private noCompletionFlag:boolean = false;
	private terminalNode:HTMLAST|undefined;
	constructor(){

	}
	searchTerminalASTForCompletion(offset:number,uri:string){
		this.searchTerminalAST(offset-1,uri);
	}
	searchTerminalASTForHover(offset:number,uri:string){
		this.searchTerminalAST(offset,uri);
	}
	searchTerminalAST(offset:number,uri:string):SearchResult{
		const{ root,textDocument,HTMLAstToHTMLInfoNode } = snapshotSet[uri];
		if(!root){
			throw Error(`Snap shot does not have this file : ${uri}, please parse it befor use it!`);
		}
		let _result = root.search(offset);
		return {

			noCompletionFlag:this.noCompletionFlag,

			terminalNode : _result,

			HTMLAstToHTMLInfoNode:HTMLAstToHTMLInfoNode
		}
	}
}
export class SnapShot{
	constructor(
		public root:HTMLAST,
		public errors:TreeError[],
		public textDocument:TextDocument,
		public HTMLAstToHTMLInfoNode = new Map<HTMLAST,HTMLInfoNode>()
		){}
}