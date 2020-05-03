/*
 * @Author: your name
 * @Date: 2020-04-05 20:30:54
 * @LastEditTime: 2020-05-02 09:29:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUI-Language-Support\server\src\type.ts
 */
/**
 * Token 相关
 */
import {HTMLAST} from './ast';

import * as lsp from 'vscode-languageserver';
import { HTMLInfoNode } from '../source/html_info';

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
export enum SupportFrameName{
	Angular,
	Vue,
	React
}
export interface ParseOption{
	/**
	 * 所使用的的框架名称
	 */
	frameName:SupportFrameName,
	/**
	 * 所使用的UI库的特征
	 * 例如DevUI -> d- / elementUI -> e- 
	 */
	tagMarkedPrefixs:string[]
}
export enum TokenType{
	TAG_START,
	CLOSED_TAG_START,
	TAG_NAME,
	TAG_END,
	TAG_SELF_END,
	//TODO: 如果未来有更多使用我们插件的人，
	//那么这里应该对每一个支持的插件都有对应的MARK Type
	MARKED_DEVUI_ELEMENT_VALUE,
	TEMPLATE,
	DIRECTIVE,
	ATTR_NAME,
	ATTR_VALUE_START,
	ATTR_VALUE,
	ATTR_VALE_END,
	COMMENT,
	DOCUMENT
	
}
export enum NodeState{
	DEFAULT,
	NEW,
	MODIFIED,
	DELETE
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
	ATTR,
	CONTENT,
	DIRECTIVE,
	CURRENT,
	TEMPLATE
}



export interface ParseResult{
	
	/**
	 * 是否提供补全标签
	 */
	noCompletionFlag:boolean;
	
	/**
	 * 指针所在的范围是key还是value
	 */
	spanKind:Spankind|undefined;
	
	/**
	 * 终端节点
	 */
	terminalNode:HTMLAST|undefined;

	/**
	 * 节点互换表
	 */
	 HTMLAstToHTMLInfoNode :Map<HTMLAST,HTMLInfoNode>

}

/**
 * AST相关
 */




