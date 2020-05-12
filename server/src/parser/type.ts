/*
 * @Author: your name
 * @Date: 2020-04-05 20:30:54
 * @LastEditTime: 2020-05-12 16:34:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUI-Language-Support\server\src\type.ts
 */
/**
 * Token 相关
 */
import {HTMLAST, HTMLATTRAST, HTMLTagAST} from './ast';
import {Span} from '../DataStructor/type';
import * as lsp from 'vscode-languageserver';
import { HTMLInfoNode } from '../source/html_info';
import { LinkedList } from '../DataStructor/LinkList';


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
	TAG_START,//
	CLOSED_TAG,//
	TAG_NAME,//
	TAG_END,//
	TAG_SELF_END,//
	//TODO: 如果未来有更多使用我们插件的人，
	//那么这里应该对每一个支持的插件都有对应的MARK Type
	TEMPLATE,//
	DIRECTIVE,//
	ATTR_NAME,//
	ATTR_VALUE_START,//
	ATTR_VALUE,//
	ATTR_VALE_END,//
	COMMENT,//
	DOCUMENT,//
	EOF
	
}
export enum NodeStatus{
	DEFAULT,
	NEW,
	MODIFIED,
	DELETE
}
//Question  为什么linkType不能加private
export interface NodeHead{
	/**
	 * 本链表类型
	 */
	readonly linkType:any;

	/**
	 * 链表跨度
	 */
	span:Span;

	/**
	 * 链表状态
	 */
	status:NodeStatus;

}
export enum TagHeadNodeType{
	DIRECTIVE,
	TEMPLATE,
	ATTR,
	CONTENT
}
export class TagLinkedListHead implements NodeHead{
	readonly linkType:TagHeadNodeType;
	span:Span;
	status:NodeStatus;
	constructor(type:TagHeadNodeType){
		this.linkType = type;
		this.span = new Span(-1,-1);
		this.status = NodeStatus.DEFAULT;
	}
	setSpanStart(offset:number){
		this.span.start = offset;
	}
	setSpanEnd(offset:number){
		this.span.end = offset;
	}
	setStatus(status:NodeStatus){
		this.status = status;
	}
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




export interface SearchResult{
	
	/**
	 * 是否提供补全标签
	 */
	noCompletionFlag:boolean;
	
	
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
export enum HTMLASTNodeType{
	TAG,
	ATTR,
	ATTR_VALUE,
	DIRECTIVE,
	TEMPLATE,
	NAME,
}
export interface tagSubNodes{
	/**
	 * 指令
	 */
	// [directive:string]:LinkedList<HTMLATTRAST>,
	[directive:string]:LinkedList<HTMLAST>,
	// /**
	//  * 模板
	//  */
	// [template:string]:LinkedList<HTMLATTRAST>
	// /**
	//  * 属性
	//  */
	// [attr:string]:LinkedList<HTMLATTRAST>
	// /**
	//  * 内容
	//  */
	// [content:string]:LinkedList<HTMLTagAST>

}
export enum ParseErrorLevel {
	WARNING,
	ERROR,
  }
  
export class TreeError{
	constructor(
		public span: Span, public msg: string,
      public level: ParseErrorLevel = ParseErrorLevel.ERROR
	){}
}
export interface ParseResult{
	root:HTMLAST,
	errors:TreeError[]
} 


