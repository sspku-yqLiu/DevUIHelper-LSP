import { HTMLInfoNode } from './source/html_info';
import { Span } from './DataStructor/type';

/*
 * @Author: your name
 * @Date: 2020-04-15 14:26:49
 * @LastEditTime: 2020-05-14 08:34:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\type.ts
 */
export enum CompletionRangeKind{
	ADD=1,
	INOUTPUT=2,
	INPUT=3,
	OUTPUT=4,
	NONE=5
}
export interface HoverSearchResult{
	node:HTMLInfoNode|undefined,
	span:Span|undefined;
}
// export const ATTRREGX = /^(?:\[\(([^\)]*)\)\]|\[([^\]]*)\]|\(([^\)]*)\))$/;
// const INPUTREG = /\[([^\)]*)\]/
// const OUTPUT =/\(([^\)]*)\)/
// const INOUTPUTREG = /\[\(([^\)]*)\)\]/
// const ADD = /\+[a-zA-z]/
