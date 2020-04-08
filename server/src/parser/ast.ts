/*
 * @Author: your name
 * @Date: 2020-04-07 18:42:40
 * @LastEditTime: 2020-04-07 18:42:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\ast.ts
 */
import * as lsp from 'vscode-languageserver';
import{htmlInfo} from '../source/html_info';
import { Span, TokenType } from './type';
import{Token} from './tokenize';
export enum AST_Type{
	ELEMENT,
	ATTR
}
export interface ASTNode{
	/**
	 * 检测是否存在于补全范围内
	 * @param offset 
	 */
	inCompletionSpan(offset:number):boolean;

	/**
	 * 获取补全列表
	 * @param position 给定补全的位置
	 */

	getCompletion(textPosition: lsp.TextDocumentPositionParams):lsp.CompletionItem[];
}
export class TreeBuilder{
	builderStack : AST[]=[];
	roots : AST[]=[];
	constructor(private tokens:Token[],errors?:Error){}
	build():AST[]{
		for( let token of this.tokens){
			/* buildelement */
			if(token.getType()===TokenType.ATTR_VALUE_START && token.getSpan()){
				this.builderStack.push(new AST(token.getSpan()!.start,AST_Type.ELEMENT));
			}
			if(token.getType()===TokenType.ATTR_VALUE_START && token.getSpan()){
				this.builderStack.push(new AST(token.getSpan()!.start,AST_Type.ELEMENT));
			}
		}
	}
}
export class AST implements ASTNode{
	element:Element|undefined;
	subNodes:Node[]=[];
	parent:Node|undefined;
	keySpan:Span|undefined;
	valueSpan:Span|undefined;
	span:Span|undefined;

	constructor(private start:number,
		private type:AST_Type
		){
			this.span = new Span(start,-1);
		}
	build(){

	}
	getCompletion(cursor: lsp.TextDocumentPositionParams):CompletionItem[]{
		// if(this.completionSpan.inSpan(cursor.position)){
		// 	// if(this.type===AST_Type.ELEMENT){
		// 	// // const completionInfo:CompletionItem[]|undefined= this.element?.getCompletion();
		// 	// return completionInfo? completionInfo:[];	
		// 	// }
		// 	// if(this.type===AST_Type.ATTR){
		// 	// 	// const completionInfo:CompletionItem[]|undefined= this.element?.getCompletion();
		// 	// 	return completionInfo? completionInfo:[];
		// 	// }		
		// }
		return [];

	}
}
