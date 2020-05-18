import { HTMLInfoNode } from './source/html_info';
import { Span } from './DataStructure/type';
import { HTMLAST } from './parser/ast';
import { SupportFrameName,SupportComponentNames } from './parser/type';

/*
 * @Author: your name
 * @Date: 2020-04-15 14:26:49
 * @LastEditTime: 2020-05-18 22:31:33
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
}
export enum CompletionType{
	Name,
	FUll,
	NONE
}
export enum FileType{
	HTML,
	TypeScript
}
export interface IgniterResult{
	Frame:SupportFrameName,
	Components:SupportComponentNames[]
}
// export const ATTRREGX = /^(?:\[\(([^\)]*)\)\]|\[([^\]]*)\]|\(([^\)]*)\))$/;
// const INPUTREG = /\[([^\)]*)\]/
// const OUTPUT =/\(([^\)]*)\)/
// const INOUTPUTREG = /\[\(([^\)]*)\)\]/
// const ADD = /\+[a-zA-z]/
