/*
 * @Author: your name
 * @Date: 2020-05-03 09:30:22
 * @LastEditTime: 2020-05-14 08:39:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \UI_Components_Helper\server\src\HoverProvider.ts
 */

import{convertStringToName,getRangeFromDocument,getsubstringForSpan, autoSelectCompletionRangeKind, getRangefromSpan, convertSpanToRange}from './util';
import { HTMLInfoNode, Element, Attribute } from './source/html_info';
import{htmlSourceTreeRoot,host} from'./server'; 
import { SupportFrameName } from './parser/type';
import{CompletionItem,Range, HoverParams, Hover} from 'vscode-languageserver';
import { HTMLAST } from './parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
export class HoverProvider{
 	constructor(){}
 	provideHoverInfoForHTML(params:HoverParams): Hover|undefined {
		let _document = host.documents.get(params.textDocument.uri);
		if(!_document){ 
			return  {contents:"Error!!!"}; 
		}
		
		let _offset = _document!.offsetAt(params.position);

		host.igniter.parseTextDocument(_document,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]});
		let _result = host.hunter.searchTerminalASTForHover(_offset,params.textDocument.uri);
		let {node,span} =  _result;
		if(!span){
			return;  
		}else if(!node||!(node.getHoverInfo())){
			return {contents:"Error!!!",range:convertSpanToRange(span,_document)};
		}
		return {contents: node.getHoverInfo()!.contents,range:convertSpanToRange(span,_document)};
	}
}