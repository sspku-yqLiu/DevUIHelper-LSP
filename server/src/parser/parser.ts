/*
 * @Author: your name
 * @Date: 2020-04-09 18:58:10
 * @LastEditTime: 2020-05-11 20:02:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\parser.ts
 */
import {ParseResult,ParseOption} from './type';
import { HTMLAST,  } from './ast';
import { Tokenizer } from './lexer';
import { TreeBuilder} from './ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { htmlSourceTreeRoot } from '../server';
import { HTMLInfoNode, Attribute, RootNode } from '../source/html_info';
export class Parser{

	private snapshotSet = <{[uri:string]:SnapShot}>{};
	constructor(){
	}
	parseTextDocument(textDocument:TextDocument,parseOption:ParseOption){
		const uri = textDocument.uri;
		const tokenizer = new Tokenizer(textDocument.getText()); 
		const tokens = tokenizer.Tokenize();
		const treebuilder =new TreeBuilder(tokens);
		const root = treebuilder.build();
		this.snapshotSet[uri]= new SnapShot(root,textDocument);
		JSON.stringify(root);
	}
	
}
export class TextParser{
	
}
// export class SerachParser{
// 		// private tokenizer:Tokenizer;
// 	// private treebuilder:TreeBuilder;
// 	// private astNodeChain:HTMLAST[]=[];
// 	private noCompletionFlag:boolean=false;
// 	private completionSpanKind:Spankind|undefined;
// 	private terminalNode:HTMLAST|undefined;
// 	searchTerminalAST(offset:number,uri:string):ParseResult{
// 		//init 
// 		//this.astNodeChain = []
// 		this.noCompletionFlag = false;
// 		// let astNames:string[] = [];
// 		const{ rootAST,textDocument,HTMLAstToHTMLInfoNode } = this.snapshotSet[uri];
// 		if(!rootAST){
// 			throw Error(`Snap shot does not have this file : ${uri}, please parse it befor use it!`);
// 		}
// 		//进行搜索
// 		this.DFSForCompletion(rootAST,offset);
// 		let text:string = textDocument.getText();
// 		// astNames = this.astNodeChain.map(astnode=>{
// 		// 	let{start ,end } = astnode.keySpan;
// 		// 	return text.substring(start,end+1);
// 		// });
// 		// this.terminalNode = this.astNodeChain.pop();
// 		//不可能存在不在根节点的位置

// 		return {

// 			noCompletionFlag:this.noCompletionFlag,

// 			spanKind:this.completionSpanKind,

// 			terminalNode : this.terminalNode,

// 			HTMLAstToHTMLInfoNode:HTMLAstToHTMLInfoNode
// 		}

// 	}
// 	DFSForCompletion(ast:HTMLAST,offset:number){
// 		if(ast.inCompletionSpan(offset)){
// 			this.terminalNode = ast;
// 			if((ast.keySpan.start===-1)&&(ast.valueSpan.start===-1)){
// 				this.completionSpanKind=Spankind.KEY;
// 				return;
// 			}
// 			else if(ast.inCompletionKeySpan(offset)){
// 				this.completionSpanKind=Spankind.KEY;
// 				return;
// 			}
// 			else if(ast.inCompletionValueSpan(offset)){
// 				this.completionSpanKind=Spankind.VALUE;
// 				for( let subast of ast.getSubNodes()){
// 					this.DFSForCompletion(subast,offset);
// 				}
// 			}else{
// 				this.noCompletionFlag=true;
// 			}
// 		}
// 		return;
// 	}
// }


export class SnapShot{
	constructor(
		public rootAST:HTMLAST,
		public textDocument:TextDocument,
		public HTMLAstToHTMLInfoNode = new Map<HTMLAST,HTMLInfoNode>()
		){}
	
}