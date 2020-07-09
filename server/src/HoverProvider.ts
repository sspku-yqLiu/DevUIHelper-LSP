/*
 * @Author: your name
 * @Date: 2020-05-03 09:30:22
 * @LastEditTime: 2020-06-05 14:59:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \UI_Components_Helper\server\src\HoverProvider.ts
 */

import{adjustSpanToAbosulutOffset, convertSpanToRange}from './util';
import{host} from'./server'; 
import { SearchResultType, } from './parser/type';
import {HoverSearchResult,} from './type';
import{ HoverParams, Hover} from 'vscode-languageserver';

export class HoverProvider{
 	constructor(){}
 	provideHoverInfoForHTML(params:HoverParams): Hover|undefined {
		//Alert:测试用
		// let temp = host;
		// host.igniter.parseAllDocument();
		
		if(!host.configuration.provideHover){
			return;
		}
		let _document = host.documents.get(params.textDocument.uri);
		if(!_document){ 
			return  {contents:"Error!!!"}; 
		}	
		let _offset = _document!.offsetAt(params.position);
		let _zone = host.errorZone;
		if(host.errorZone.find(e=>e.inSpan(_offset))){
			return;
		}
		// host.igniter.parseTextDocument(_document,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]});
		let _result = this.searchTerminalASTForHover(_offset,params.textDocument.uri);
		let {node,span} =  _result;
		if(!span){
			return;  
		}else if(!node||!(node.getHoverInfo())){
			return ;
		}
		return {contents: node.getHoverInfo()!.contents,range:convertSpanToRange(_document,span)};
	}

	searchTerminalASTForHover(offset:number,uri:string):HoverSearchResult{
		let{ast,type}= host.hunter.searchTerminalAST(offset,uri);
		if(!ast) {throw Error(`this offset does not in any Node :${offset}`);}
		let _span = ast.nameSpan.clone();
		adjustSpanToAbosulutOffset(ast,_span);
		if(!_span){
			return{node:undefined,span:undefined};
		}
		if(type === SearchResultType.Null||!ast){
			return{node:undefined,span:_span};
		}else{
			let _htmlInfoNode = host.hunter.findHTMLInfoNode(ast,uri);
			return {node:_htmlInfoNode,span:_span};
		}
	}
}