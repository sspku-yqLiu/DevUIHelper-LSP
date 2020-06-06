/*
 * @Author: your name
 * @Date: 2020-06-05 23:04:19
 * @LastEditTime: 2020-06-06 08:59:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\Expression\ExpressionAdm.ts
 */ 
import { WhiteChars, WhiteCharsAndLTAndLTANDSPLASH } from '../parser/chars';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { start } from 'repl';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { ExpressionParams, ExpressionResult } from '../type';
import { Span } from '../DataStructure/type';
import { convertSpanToRange } from '../util';
import { logger } from '../server';

export class ExpressionAdm{
	constructor(){

	}
	getExpression(offset:number,text:string):ExpressionResult{
		let start = offset,end = offset;
		while(!(WhiteCharsAndLTAndLTANDSPLASH.includes(text.charCodeAt(start)))&&start>0){
			start--;
		}
		while(!(WhiteCharsAndLTAndLTANDSPLASH.includes(text.charCodeAt(end)))&&end<text.length){
			end++;
		}
		logger.debug(`get:${text.substring(start+1,end)}`);
		return {res:text.substring(start+1,end),span: new Span(start+1,end)};
	}
	createCompletion(params:ExpressionParams){
		let{textDocument,span,expression} = params;
		let _completionItem = CompletionItem.create(expression);
		_completionItem.kind =CompletionItemKind.Function;
		_completionItem.textEdit={range:convertSpanToRange(textDocument,span),newText:`<${expression}></${expression}>`};
		logger.debug(`create:${expression}`);
		return [_completionItem];
	}
}