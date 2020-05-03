
import{converStringToName,getRangeFromDocument,getsubstringForSpan, autoSelectCompletionRangeKind, getRangefromSpan}from './util';
import { HTMLInfoNode, Element, Attribute } from './source/html_info';
import{htmlSourceTreeRoot,parser} from'./server'; 
import { Spankind } from './parser/type';
import{CompletionItem,Range, HoverParams, Hover} from 'vscode-languageserver';
import { HTMLAST } from './parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
export class HoverProvider{
	private currentDocument:TextDocument|undefined;
	private astToInfoMap:Map<HTMLAST,HTMLInfoNode>|undefined;
	private text:string = '';
	private currentRange =  Range.create(-1,-1,-1,-1);
	private wordAtCursor = "";
 constructor(){}
 	// provideHoverInfoForHTML(_offset:number,_textDocument:TextDocument): Hover|undefined {
	
	// //分析及初始化
	// 	const parseResult = parser.searchTerminalAST(_offset,_textDocument.uri);
	// 	let{noCompletionFlag,spanKind,terminalNode,HTMLAstToHTMLInfoNode} = parseResult;
	// 	if(noCompletionFlag)
	// 		return undefined;
	// 	this.currentDocument  = _textDocument;
	// 	this.astToInfoMap = HTMLAstToHTMLInfoNode;
	// 	this.text= this.currentDocument!.getText();
	// 	this.currentRange = getRangefromSpan(terminalNode?.keySpan,this.currentDocument);

	// 	if(!terminalNode){
	// 		return undefined;
	// 	}
	// 	// 仅在keySpan进行提示
	// 	if(spanKind==Spankind.KEY){
	// 		return this.getHTMLHoverInfo(terminalNode,HTMLAstToHTMLInfoNode);
	// 	}else{
	// 		return undefined;
	// 	}
	// }

	// getHTMLHoverInfo(terminalNode:HTMLAST,map:Map<HTMLAST,HTMLInfoNode>):Hover|undefined{
	// 	if(!terminalNode){
	// 		throw Error(`出现了现有parser所不能理解的问题，请检测parser是否被修改`);
	// 	}
	// 	//如果map中有
	// 	let _htmlInfoNode = map.get(terminalNode);
	// 	if(_htmlInfoNode){
	// 		return _htmlInfoNode.getHoverInfo();
	// 	}
	// 	//否则进入查找
	// 	 _htmlInfoNode = this.findHTMLInfoNode(terminalNode);
	// 	if(_htmlInfoNode){
	// 		return _htmlInfoNode.getHoverInfo();
	// 	}
	// 	return undefined;
	// }


	// findHTMLInfoNode(_htmlast:HTMLAST):HTMLInfoNode|undefined{

	// 	//表内存在则直接返回
	// 	let res = this.astToInfoMap?.get(_htmlast);
	// 	if(res){return res;}

	// 	//表内没有则向上递归
	// 	let _parentast = _htmlast.getparent();
	// 	if(!_parentast){
	// 		let _htmlroot = htmlSourceTreeRoot;
	// 		this.astToInfoMap!.set(_htmlast,_htmlroot);
	// 		return _htmlroot;
	// 	}
	// 	else{
	// 		let _parentInfoNode = this.astToInfoMap!.get(_parentast)
	// 		if(!_parentInfoNode){
	// 			 _parentInfoNode = this.findHTMLInfoNode(_parentast);
	// 		}
	// 		if(_parentInfoNode){
	// 			let {start,end} = _htmlast.getKeySpan();
	// 			let _infoNodeName = converStringToName(this.text.substring(start,end+1));
	// 			let _currentInfoNode = _parentInfoNode?.getsubNode(_infoNodeName);

	// 			if(_currentInfoNode){
	// 				this.astToInfoMap!.set(_htmlast,_currentInfoNode);
	// 			}
	// 			return _currentInfoNode;
	// 		}

	// 	}
	// }
}