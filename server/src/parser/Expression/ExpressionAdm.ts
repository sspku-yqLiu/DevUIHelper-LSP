/*
 * @Author: your name
 * @Date: 2020-06-05 23:04:19
 * @LastEditTime: 2020-06-08 20:43:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\Expression\ExpressionAdm.ts
 */ 
import { WhiteCharsAndLTAndLTANDSPLASH } from '../chars';
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { ExpressionParams, ExpressionResult } from '../../type';
import { Span } from '../DataStructure/type';
import { convertSpanToRange } from '../../util';
import { logger } from '../../server';
import { ExpresssionLexer } from './ExpressionLexer';
import { JsxEmit } from 'typescript/lib/tsserverlibrary';

export class ExpressionAdm{
	private componentPrefix:string[]=[];
	private htmltag:string[]=[];
	private expLexer = new ExpresssionLexer();
	constructor(prefixs:string[]){
		this.componentPrefix = prefixs;
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

 
		expression = expression.substr(1);
		logger.debug(JSON.stringify(this.expLexer.parse(expression)));
		// if(this.componentPrefix[])
		let expressionResult = expression+'$';
		//completionItem制作。
		let _completionItem = CompletionItem.create(expression);
		_completionItem.kind =CompletionItemKind.Function;
		_completionItem.textEdit={range:convertSpanToRange(textDocument,span),newText:`${expressionResult}`};
		_completionItem.detail=`${expressionResult}`;
		logger.debug(`create:${expression}`);
		return [_completionItem];
	}
}