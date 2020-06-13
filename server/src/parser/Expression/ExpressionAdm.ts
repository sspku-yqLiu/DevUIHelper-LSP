/*
 * @Author: your name
 * @Date: 2020-06-05 23:04:19
 * @LastEditTime: 2020-06-08 20:43:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\Expression\ExpressionAdm.ts
 */ 
import { WhiteCharsAndLTAndGTANDSPLASH, WhiteCharsAndLT, $AT,WhiteCharsAndLTAndSLASH } from '../chars';
import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';
import { ExpressionParams, ExpressionResult } from '../../type';
import { Span } from '../DataStructure/type';
import { convertSpanToRange, MarkUpBuilder } from '../../util';
import { logger } from '../../server';
import { ExpresssionLexer } from './ExpressionLexer';
import { JsxEmit } from 'typescript/lib/tsserverlibrary';

export class ExpressionAdm{
	private componentPrefix:string[]=[];
	private htmltag:string[]=[];
	private expLexer = new ExpresssionLexer();
	private mkbuilder = new MarkUpBuilder();
	constructor(prefixs:string[]){
		this.componentPrefix = prefixs;
	}
	getExpression(offset:number,text:string):ExpressionResult{
		let start = offset,end = offset;
		while(!(WhiteCharsAndLTAndSLASH.includes(text.charCodeAt(start)))&&start>0){
			start--;
		}
		// if(text.charCodeAt(start)===$AT){
		// 	start--;
		// }
		while(!(WhiteCharsAndLTAndGTANDSPLASH.includes(text.charCodeAt(end)))&&end<text.length){
			end++;
		}
		// logger.debug(`get:${text.substring(start+1,end)}`);
		return {res:text.substring(start+1,end),span: new Span(start+1,end)};
	}
	createCompletion(params:ExpressionParams):CompletionItem[]{
		let{textDocument,span,expression} = params;
		// expression = expression.substr(1);
		if(!expression.startsWith('@')){
			return [];
		}
		let expressionResult = this.expLexer.parse(expression.substring(1),['d']);
		if(!expressionResult){
			return [];
		}
		//completionItem制作。
		let _completionItem = CompletionItem.create(expression);
		_completionItem.kind =CompletionItemKind.Function;
		_completionItem.textEdit={range:convertSpanToRange(textDocument,span),newText:`${expressionResult}`};
		// _completionItem.documentation= this.mkbuilder.setSpecialContent('html',`${expressionResult.replace(/(\$[0-9])|(\$\{(\s|\S)*\})/g,"")}`).getMarkUpContent();
		_completionItem.documentation= this.mkbuilder.setSpecialContent('html',`${expressionResult}`).getMarkUpContent();
		_completionItem.insertTextFormat=InsertTextFormat.Snippet;
		// logger.debug(`create:${expressionResult}`);
		return [_completionItem];
	}
}