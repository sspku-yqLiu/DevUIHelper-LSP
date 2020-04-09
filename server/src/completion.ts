/*
 * @Author: your name
 * @Date: 2020-04-08 20:38:08
 * @LastEditTime: 2020-04-09 22:12:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\completion.ts
 */
import{documents} from './server';
import{TextDocumentPositionParams} from 'vscode-languageserver';
import {TextDocument} from 'vscode-languageserver-textdocument';
import{Parser} from './parser/parser';
import { htmlInfo } from './source/html_info';
import { Spankind } from './parser/type';
import{CompletionItem} from 'vscode-languageserver';
export function  provideCompletionItems(offset:number,uri:string): CompletionItem[] {
	const parser = new Parser();
	const parseResult = parser.searchASTChain(offset,uri);
	let element,attr;
	if(parseResult.noCompletionFlag == true)
		return [];
	if(parseResult.element){
		if(parseResult.Spankind===Spankind.KEY){
			return htmlInfo.getElementsName().map(element=>{
				return CompletionItem.create(element);
			});
		}
		if(parseResult.Spankind === Spankind.VALUE)
		element = htmlInfo.findElement(parseResult.element);
	}

	if(parseResult.attr)
		attr = element?.getAttribute(parseResult.attr);	



}