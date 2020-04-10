/*
 * @Author: your name
 * @Date: 2020-04-09 18:58:10
 * @LastEditTime: 2020-04-10 14:50:04
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
	parseTextDocument(textDocument:TextDocument){
		const uri = textDocument.uri;
		const tokenizer = new Tokenizer(textDocument,"DevUI"); 
		const tokens = tokenizer.Tokenize();
		const treebuilder =new TreeBuilder(tokens);
		const root = treebuilder.build();
		this.snapshotSet[uri]= new SnapShot(root,textDocument);
	}
	searchASTChain(offset:number,uri:string):ParseResult{
		//init 
		this.astNodeChain = []
		this.noCompletionFlag = false;
		let astNames:string[] = [];



		const{ rootAST,textDocument } = this.snapshotSet[uri];
		if(!rootAST){
			throw Error(`Snap shot does not have this file : ${uri}, please parse it befor use it!`);
		}
		//进行搜索
		this.DFSForCompletion(rootAST,offset);
		let text:string = textDocument.getText();
		astNames = this.astNodeChain.map(astnode=>{
			let{start ,end } = astnode.getSpan();
			return text.substring(start,end);
		});
		return {
			noCompletionFlag:this.noCompletionFlag,

			Spankind:this.completionSpanKind,

			root:astNames[0],

			element:astNames[1],
		
			attr:astNames[2]
		
		}

	}
	DFSForCompletion(ast:HTMLAST,offset:number){
		if(ast.inCompletionSpan(offset)){
			this.astNodeChain.push(ast);
			
			if(ast.inCompletionKeySpan(offset)){
				this.completionSpanKind=Spankind.KEY;
				return;
			}
			else if(ast.inCompletionValueSpan(offset)){
				this.completionSpanKind=Spankind.VALUE;
				for( let subast of ast.getSubNodes()){
					this.DFSForCompletion(subast,offset);
				}
			}else{
				this.noCompletionFlag=true;
			}

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