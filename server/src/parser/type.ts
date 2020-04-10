/*
 * @Author: your name
 * @Date: 2020-04-05 20:30:54
 * @LastEditTime: 2020-04-10 14:27:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUI-Language-Support\server\src\type.ts
 */
/**
 * Token 相关
 */
import { CompletionItem, } from 'vscode-languageserver';
import {Element,Attribute,htmlInfo} from '../source/html_info';

import * as lsp from 'vscode-languageserver';

export class Span{
	/**
	 * 开始的和结束范围,使用offset进行标注
	 */
	constructor(
		public start:number,
		public end:number
	){}
	build(end:number){
		this.end = end;
	}
	inSpan(offset:number):boolean {
		if(!this.end){
			return false;
		}
		if(offset>=this.start&&offset<=this.end){return true;}
		return false;
	}
	inCompletionSpan(offset:number):boolean{
		if(!this.end){
			return false;
		}
		if(offset>=this.start&&offset<=this.end+1){return true;}
		return false;
	}
}
export enum TokenType{
	ELEMENT_START,
	ELEMENT_VALUE,
	INNER_ATTR,
	ATTR_NAME,
	ATTR_VALUE_START,
	ATTR_VALUE,
	ATTR_VALE_END,
	ELEMENT_END
}
export enum Spankind{
	KEY,
	VALUE
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
export interface ParseResult{
	
	/**
	 * 是否提供补全标签
	 */
	noCompletionFlag:boolean;
	
	/**
	 * 指针所在的范围是key还是value
	 */
	Spankind:Spankind|undefined;
	
	/**
	 *是否有根节点
	 */
	root:string|undefined;
	
	/**
	 * element节点
	 */
	element:string|undefined;
	
	/**
	 * 属性节点
	 */
	attr:string|undefined;



}

/**
 * AST相关
 */




