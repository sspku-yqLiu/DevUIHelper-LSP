/*
 * @Author: your name
 * @Date: 2020-04-09 18:58:10
 * @LastEditTime: 2020-05-16 17:50:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\parser.ts
 */
import {SearchResult,ParseOption, TreeError, ParseResult, SearchResultType} from './type';
import { HTMLAST, HTMLTagAST,  } from './ast';
import { Tokenizer } from './lexer';
import { TreeBuilder} from './ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { logger } from '../../server';
export class YQ_Parser{
	constructor(){
	}
	parseTextDocument(textDocument:TextDocument,parseOption:ParseOption):ParseResult{
		const uri = textDocument.uri;
		const tokenizer = new Tokenizer(textDocument); 
		const tokens = tokenizer.Tokenize();
		const treebuilder =new TreeBuilder(tokens);
		return treebuilder.build();
	}
}
export class TextParser{
	
}
export class SearchParser{
	constructor(){}
	DFS(offset:number,root:HTMLAST):SearchResult|undefined{
		if(root instanceof HTMLTagAST){
			offset-=root.tagOffset;
		}
		let _searchresult = root.search(offset);
		let{ast,type}= _searchresult;
		if(!_searchresult||(!ast&&type===SearchResultType.Null)){
			return;
		}
		else if(!ast&&type!==SearchResultType.Null){
			return {ast:root,type:type};
		}else if(ast){
			let _result = this.DFS(offset,ast);
			return _result;
		}
	}
}


