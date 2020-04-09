/*
 * @Author: your name
 * @Date: 2020-04-09 18:58:10
 * @LastEditTime: 2020-04-09 19:43:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\parser.ts
 */
import {Spankind,ParseResult} from './type';
import { HTMLAST } from './ast';
import { Tokenizer } from './tokenize';
import { TreeBuilder} from './ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
export class Parser{
	// private tokenizer:Tokenizer;
	// private treebuilder:TreeBuilder;
	private astNodeChain:HTMLAST[]=[];
	private noCompletionFlag:boolean=false;
	private completionSpanKind:Spankind|undefined;
	private snapshotSet = <{[uri:string]:SnapShot}>{};
	constructor(){
	}
	parseTextDocument(uri:string,textDocument:TextDocument){
		const tokenizer = new Tokenizer(textDocument,"DevUI"); 
		const tokens = tokenizer.Tokenize();
		const treebuilder = new TreeBuilder(tokens);
		const root = treebuilder.build();
		this.snapshotSet[uri]= new SnapShot(root,textDocument);
	}
	searchASTChain(offset:number,uri:string):ParseResult{
		//init 
		this.astNodeChain = []
		this.noCompletionFlag = false;
		let astNames:string[] = [];
		//parse
		const{ rootAST,textDocument } = this.snapshotSet[uri];
		if(!rootAST){
			throw Error(`Snap shot does not have this file : ${uri}, please parse it befor use it!`);
		}
		//进行搜索
		this.DFS(rootAST,offset);
		let text:string = textDocument.getText();
		astNames = this.astNodeChain.map(astnode=>{
			let{start ,end } = astnode.getSpan();
			return text.substring(start,end);
		});
		return {
			noCompletionFlag:this.noCompletionFlag,

			Spankind:this.completionSpanKind ,

			root:astNames[0],

			element:astNames[1],
		
			attr:astNames[2]
		
		}

	}
	DFS(ast:HTMLAST,offset:number){
		if(ast.inSpan(offset)){
			if(ast.inKeySpan(offset)){
				this.astNodeChain.push(ast);
				this.completionSpanKind=Spankind.KEY;
				return;
			}
			if(ast.inValueSpan(offset)){
				this.astNodeChain.push(ast);
				this.completionSpanKind=Spankind.VALUE;
				for( let subast of ast.getSubNodes()){
					this.DFS(subast,offset);
				}
			}
			this.noCompletionFlag=true;
		}
		return;
	}
}


export class SnapShot{
	constructor(
		public rootAST:HTMLAST,
		public textDocument:TextDocument
		){}
}