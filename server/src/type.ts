import { HTMLInfoNode } from './parser/WareHouse/Storage';
import { Span } from './parser/DataStructure/type';
import { HTMLAST } from './parser/yq-Parser/ast';
import { SupportFrameName,SupportComponentName } from './parser/yq-Parser/type';
import { TextDocument } from 'vscode-languageserver-textdocument';

/*
 * @Author: your name
 * @Date: 2020-04-15 14:26:49
 * @LastEditTime: 2020-06-08 16:51:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\type.ts
 */
export enum CompletionRangeKind{
	NONE,
	ADD,
	INOUTPUT,
	INPUT,
	OUTPUT,
	TAG,
}
export interface HoverSearchResult{
	node:HTMLInfoNode|undefined,
	span:Span|undefined;
}
export interface CompletionSearchResult{
	node:HTMLInfoNode|undefined,
	span:Span|undefined;
	ast:HTMLAST;
	type:CompletionType;
	expressionParams?:ExpressionParams;
}
export enum CompletionType{
	Name,
	FUll,
	NONE,
	Expression
}
export enum FileType{
	HTML,
	TypeScript
}
export interface IgniterResult{
	Frame:SupportFrameName;
	Components:SupportComponentName[];
}
export interface ExpressionParams{
	expression:string;
	span:Span;
	textDocument:TextDocument;
}
export interface ExpressionResult{
	res:string;
	span:Span;
}
// export const ATTRREGX = /^(?:\[\(([^\)]*)\)\]|\[([^\]]*)\]|\(([^\)]*)\))$/;
// const INPUTREG = /\[([^\)]*)\]/
// const OUTPUT =/\(([^\)]*)\)/
// const INOUTPUTREG = /\[\(([^\)]*)\)\]/
// const ADD = /\+[a-zA-z]/
