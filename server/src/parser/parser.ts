/*
 * @Author: your name
 * @Date: 2020-04-09 18:58:10
 * @LastEditTime: 2020-05-12 16:00:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\parser.ts
 */
import {SearchResult,ParseOption, TreeError, ParseResult} from './type';
import { HTMLAST,  } from './ast';
import { Tokenizer } from './lexer';
import { TreeBuilder} from './ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { htmlSourceTreeRoot,logger } from '../server';
import { HTMLInfoNode, Attribute, RootNode } from '../source/html_info';
export class YQ_Parser{

	constructor(){
	}
	parseTextDocument(textDocument:TextDocument,parseOption:ParseOption):ParseResult{
		const uri = textDocument.uri;
		const tokenizer = new Tokenizer(textDocument.getText()); 
		const tokens = tokenizer.Tokenize();
		const treebuilder =new TreeBuilder(tokens);
		return treebuilder.build();
	}
	
	
}
export class TextParser{
	
}
export class SerachParser{
		// private tokenizer:Tokenizer;
	// private treebuilder:TreeBuilder;
	// private astNodeChain:HTMLAST[]=[];
	private noCompletionFlag:boolean=false;
	private terminalNode:HTMLAST|undefined;
	
}


