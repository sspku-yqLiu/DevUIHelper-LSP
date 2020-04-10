/*
 * @Author: your name
 * @Date: 2020-04-08 20:38:08
 * @LastEditTime: 2020-04-10 14:49:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\completion.ts
 */
import{MarkUpBuilder}from './util';
import{Parser} from './parser/parser';
import { Element,Attribute } from './source/html_info';
import{htmlInfo,parser} from'./server'; 
import { Spankind } from './parser/type';
import{CompletionItem,MarkupContent,MarkupKind,CompletionItemKind} from 'vscode-languageserver';
export function  provideCompletionItems(offset:number,uri:string): CompletionItem[] {

	const parseResult = parser.searchASTChain(offset,uri);
	let element,attr;
	//如果不在元素中或者在元素中，但不在key value 中
	if(parseResult.noCompletionFlag == true)
		return [];
	//那么它一定在元素中
	if(parseResult.element){
		//如果最近的地方是attr
		if(parseResult.attr){
			element = htmlInfo.findElement(parseResult.element);
			if(!element){
				return [];
			}
			if(parseResult.Spankind === Spankind.KEY){
				return CompletionforATTRKey(element);
			}
			if(parseResult.Spankind === Spankind.VALUE){
				return CompletionforATTRValue(element.getAttribute(parseResult.attr));
			}

		}
		//如果最近的是 element 
		else{
			if(parseResult.Spankind===Spankind.KEY){
				return CompletionforElement();
			}
			if(parseResult.Spankind===Spankind.VALUE){
				element = htmlInfo.findElement(parseResult.element);
				if(!element){
					return [];
				}
				return CompletionforATTRKey(element);
			}
		}
	}
	return [];
}
export function CompletionforATTRKey(element:Element):CompletionItem[]{
	let result:CompletionItem[] = [];
	return element.getAttributes().map(attr=>{
		let completionItem =  CompletionItem.create(attr.getName());
		completionItem.detail= attr.getSortDescription();
		completionItem.documentation = new MarkUpBuilder().addSpecialContent('typescript',[
															"Type:"+attr.getValueType()+
															"DefaultValue:"+attr.getDefaultValue(),
															"Description:"+ attr.getSortDescription()]).getMarkUpContent();
															
															
    if(attr.getcompletionKind()!==CompletionItemKind.Function){
        completionItem.insertText ="["+attr.getName()+"]=\"${1:}\"";
    }else{
        completionItem.insertText ="("+attr.getName()+")=\"${1:}\"";
    }
    completionItem.preselect = true;
    return completionItem;
	});
}
export function CompletionforATTRValue(attr:Attribute){
	let result:CompletionItem[] = [];
	return attr.getValueSet().map(value=>{
		let completionItem =  CompletionItem.create(value);
		completionItem.detail= `这是${value}类型`;
		completionItem.documentation = new MarkUpBuilder().addContent("![DevUIHelper演示](https://github.com/istarwyh/DevUIHelper/blob/master/demo.gif)").getMarkUpContent();													
    completionItem.preselect = true;
    return completionItem;
	});
}
export function CompletionforElement(){
	return htmlInfo.getElementsName().map(element=>{
		let completionItem =  CompletionItem.create(element);
		completionItem.kind= CompletionItemKind.Class;
		return completionItem;
	});
}
