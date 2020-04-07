/*
 * @Author: your name
 * @Date: 2020-04-05 20:30:54
 * @LastEditTime: 2020-04-07 18:45:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUI-Language-Support\server\src\type.ts
 */
/**
 * Token 相关
 */
import { CompletionItem, } from 'vscode-languageserver';
import {Element,Attribute,htmlSource} from '../source/html_info';

import * as lsp from 'vscode-languageserver';

export class Span{
	/**
	 * 开始的和结束范围,使用offset进行标注
	 */
	constructor(
		public start:number,
		public end:number
	){}
	inSpan(offset:number):boolean {
		if(offset>=this.start&&offset<=this.end){return true;}
		return false;
	}
}
export enum TokenType{
	ELEMENT_START,
	INNER_ATTR,
	ATTR_NAME,
	ATTR_VALUE,
	ELEMENT_END
}
export class Token{

	constructor(
		private type:TokenType,
		private span?:Span|undefined 
	){}
	setSpan(start:number,end:number){
		this.span = new Span(start,end);
	}
}
export enum AST_Type{
	ELEMENT,
	ATTR
}

export class Cursor{
	
}


/**
 * AST相关
 */

export interface Node{
	// /**
	//  * 内容所在的Span
	//  */
	// readonly span:Span;

	// /**
	//  * 依据这个节点内容提供补全的span
	//  */
	// readonly completionSpan:Span;

	// /**
	//  * 节点的唯一标识符
	//  */
	// readonly key:string;

	/**
	 * 获取补全列表
	 * @param position 给定补全的位置
	 */

	getCompletion(textPosition: lsp.TextDocumentPositionParams):CompletionItem[];
}


export class AST implements Node{
	element:Element|undefined;
	subNodes:Node[];
	parent:Node|undefined;

	constructor(
		parent:Node,
		private type:AST_Type,
		 private span:Span,
		 private completionSpan:Span,
		 private key:string
		){
			this.parent = parent;
			this.element = htmlSource.findElement(key.substring(3));
			this.subNodes= [];
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
