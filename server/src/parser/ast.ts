/*
 * @Author: your name
 * @Date: 2020-04-07 18:42:40
 * @LastEditTime: 2020-05-14 08:48:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\ast.ts
 */
import * as lsp from 'vscode-languageserver';
import { htmlInfo } from '../source/html_info';
import {Span} from '../DataStructor/type';
import {  TokenType, NodeStatus,HTMLASTNodeType, tagSubNodes, TreeError, ParseErrorLevel, SearchResult, ParseResult, SearchResultType } from './type';
import { Token, Cursor } from './lexer';
import { threadId } from 'worker_threads';
import { LinkNode, LinkedList } from '../DataStructor/LinkList';
import { isTagProps } from './utils';
export const tagTokenTypesSet = new Set([
										TokenType.ATTR_NAME,
										TokenType.ATTR_VALE_END,
										TokenType.ATTR_VALUE,
										TokenType.ATTR_VALUE_START,
										TokenType.DIRECTIVE,
										TokenType.TEMPLATE,
										TokenType.COMMENT,
										
										]);
export const attrTypesSet = new Set([
										TokenType.ATTR_NAME,
										TokenType.DIRECTIVE,
										TokenType.TEMPLATE,
										]);
									
										
export class TreeBuilder {
	index:number = 0;
	buildStack:HTMLTagAST[]=[];
	tagInBuld: HTMLTagAST | undefined;
	attrInBuild:HTMLATTRAST|undefined;
	currentSpan:Span= new Span(-1,-1);
	currentToken :Token = new Token(TokenType.DOCUMENT,-1);
	roots: HTMLAST[] = [];
	root:HTMLTagAST;
	errors:TreeError[]=[];
	// currentSpan: Span | undefined;
	constructor(private tokens: Token[]) { 
		this.root = new HTMLTagAST(new Span(0,0),"$$ROOT$$");
	}
	build(): ParseResult {
		if(this.tokens.length<1){
			return {root:this.root,errors:[]};
		}
		this.init();
		this.buildStack.push(this.root);
		try{
			while(this.currentToken.getType()!== TokenType.EOF) {
				/* build element */
				if (this.currentToken.getType() === TokenType.TAG_START) {
					this.buildNewTag();
				}
				else if(this.currentToken.getType()===TokenType.CLOSED_TAG) {
					this.closeTagContent();
				}
				else {
					this.advance();
				}
			}
		}catch{

		}
		this.buildRoot();
		return {root:this.root,errors:this.errors};
	}
	/**
	 * TAG相关
	 */
	buildNewTag(){
		if(this.tagInBuld){
			//TODO: 这里面要加上一个属性关闭的函数。
			this.closeTagInBuild();
			this.tagInBuld.linkListPointer = this.getStackpeek().getTagLists()?.content.insertNode(this.tagInBuld);
			this.tagInBuld = undefined;
		}
		this.tagInBuld = new HTMLTagAST(this.currentSpan);
		this.tagInBuld.buildLinkedLists();
		this.advance();
		if (this.currentToken.getType() === TokenType.TAG_NAME) {
			this.setNodeName(this.currentSpan,this.currentToken.value);
			this.advance();
		}
		while(tagTokenTypesSet.has(this.currentToken.getType())){
			//build inner ATTR 
			if (attrTypesSet.has(this.currentToken.getType())) {
				this.startNewATTR();
			}
			else{
				if (this.attrInBuild){
					if(this.currentToken.getType()=== TokenType.ATTR_VALUE){
						this.addValueNode();
					}
				}else{
					throw Error(`we need to add something into attr ,but we cannot find at ${this.currentSpan.start}`);
				}
			}
			this.advance();
		}
		if(this.currentToken.getType() === TokenType.TAG_END||this.currentToken.getType() === TokenType.TAG_SELF_END){
			this.closeTagInBuild(this.currentSpan.end);
			this.advance();
		}else{
			return;
		}
	}
	closeTagContent(){
		let _contentEnd= this.currentSpan.start-1;
		this.advance();
		if(this.currentToken.getType()!==TokenType.TAG_NAME){
			return;
		}
		let _closeTagName = this.currentToken.value;
		let _cursor =-1;
		for(let i:number = this.buildStack.length-1;i>0;i--){
			if(_closeTagName == this.buildStack[i].getName()){
				_cursor = i;break;
			}	
		}
		if(_cursor!==-1){
			this.advance();
			while(this.buildStack.length>_cursor){
				this.buildStack.pop()?.closeContent(_contentEnd,this.currentSpan.end);
			}
		}
		else{
			this.errors.push(new TreeError(this.currentSpan,`this closed tag cannot find its Open tag!!`,ParseErrorLevel.ERROR));
		}
		this.advance();
	}
	setNodeName(span:Span,name?:string){
		name = name?name:"";
		this.tagInBuld?.setName(name,span);
	}
	/**
	 * 关闭标签 start content.
	 * @param end 
	 */
	closeTagInBuild(end?:number){
		this.buildAttr();
		if(!this.tagInBuld){
			throw Error(`this tag does not have lists, please check parser!!!`);
		}else{
			this.tagInBuld!.closeTag(end);
			this.tagInBuld!.parentPointer = this.getStackpeek();
			this.addToList(this.getStackpeek().subLists!.content,this.tagInBuld);
			let _content = this.tagInBuld?.getTagLists()!.content;
			if(this.currentToken.getType() === TokenType.TAG_END){
				_content.headInfo.span.start = this.currentSpan.end+1;
				this.buildStack.push(this.tagInBuld!);
			}else{
				_content.headInfo.span = new Span(-1,-1);
			}
			this.tagInBuld=undefined;
		}
	}

	/**
	 * 将tag正常关闭 之后插入栈中。
	 * @param end 
	 */
	buildTag(end:number){
		
	}
	buildRoot(){
		let _endOfTokens:number = this.currentSpan.end;
		if(this.attrInBuild){
			this.buildAttr();
		}
		if(this.tagInBuld){
			_endOfTokens += this.tagInBuld.tagOffset;
			this.closeTagInBuild(); 
		}
		while(this.buildStack.length>0){
			_endOfTokens = this.buildStack.pop()!.closeContent(_endOfTokens,_endOfTokens);
		}
	}
	/**
	 * 属性相关
	 */
	//开始的时候我们并没有把它插入到链表之中

	startNewATTR(){
		this.buildLastAttr();
		let _list =null;
		if(this.currentToken.getType()===TokenType.TEMPLATE){
			this.attrInBuild = new HTMLATTRAST(HTMLASTNodeType.TEMPLATE,this.currentSpan,this.currentToken.value);
			_list = this.tagInBuld!.getTagLists()!.template;
		}else{
			this.attrInBuild = new HTMLATTRAST(HTMLASTNodeType.ATTR,this.currentSpan,this.currentToken.value);
		}
	}
	addValueNode(){
		let _valueNode = new HTMLAST(HTMLASTNodeType.ATTR_VALUE,this.currentSpan,this.currentToken.value);
		this.attrInBuild?.addValueNode(_valueNode);
	}
	buildAttr(){
		if(!this.attrInBuild){
			return;
		}
		if(this.attrInBuild.getType()===HTMLASTNodeType.TEMPLATE){
			this.addToList(this.tagInBuld?.getTagLists()!.template,this.attrInBuild);
		}
		else if(this.attrInBuild?.valueNode){
			this.addToList(this.tagInBuld?.getTagLists()!.attr,this.attrInBuild);
		}else{
			this.attrInBuild?.setType(HTMLASTNodeType.DIRECTIVE);
			this.addToList(this.tagInBuld?.getTagLists()!.directive,this.attrInBuild);
		}
		this.attrInBuild=undefined;
	}
	
	
	/**
	 * 返回栈顶元素。
	 */
	getStackpeek(){
		return this.buildStack[this.buildStack.length-1];
	}
	adjustSpan(){
		for(let ast of this.buildStack){
			this.currentSpan.selfShift(ast.tagOffset,false);
		}
		if(this.tagInBuld){
			this.currentSpan.selfShift(this.tagInBuld.tagOffset,false);
		}
	}
	/**
	 * 工具函数
	 */
	addToList(list:LinkedList<HTMLAST>,node:HTMLAST|undefined){
		if(!node){
			throw Error(`the Node is undefined at list${list.toString()}`);
		}
		if(list.length===0){
			list.headInfo.span.start = node!.getSpan().start;
		}
		node.linkListPointer=list.insertNode(node);
		if(!(node instanceof HTMLTagAST)){
			node.parentPointer = this.tagInBuld;
		}
		list.headInfo.span.end=node.getSpan().end;
	}
	buildLastAttr(){
		if(this.attrInBuild){
			this.buildAttr();
			this.attrInBuild = undefined;
		}
	}
	init(){
		this.currentSpan= this.currentToken!.getSpan();
		let _tokentype:TokenType = this.currentToken.getType();
		this.currentToken = this.tokens[0];
	}
	advance(){
		if(this.index<this.tokens.length)
			this.currentToken = this.tokens[++this.index];
		else{
			throw Error(`this is the last!!!`)
		}
		this.currentSpan = this.currentToken.getSpan();
		this.adjustSpan();
		if(this.currentToken.getType()===TokenType.COMMENT){
			let _commentAst = new HTMLAST(HTMLASTNodeType.COMMENT,this.currentSpan);
			this.getStackpeek().subLists!.comment.insertNode(_commentAst);
			this.advance();
		}

	}
}
export class HTMLAST  {
	linkListPointer:LinkNode<HTMLAST>|undefined;
	status:NodeStatus = NodeStatus.DEFAULT;
	// parentPointer:HTMLAST|undefined;
	nameSpan:Span=new Span(-1,-1);
	//2020/5/11 应该把tag和普通的HTMLAST区分开来
	constructor(
		protected type:HTMLASTNodeType,
		protected span:Span,
		protected name?:string|undefined,
		public parentPointer?:HTMLAST|undefined,
		) {
			this.parentPointer=parentPointer;
	}
	getSpan(){return this.span;}

	getName():string|undefined{
		return this.name;
	}
	setName(name:string,nameSpan:Span){
		this.name = name;
		this.nameSpan = nameSpan;
	}

	getType(){
		return this.type;
	}
	setType(type:HTMLASTNodeType){
		this.type = type;
	}
	//普通的节点只需要检查span
	search(offset:number):SearchResult{
		if(this.span.inSpan(offset)){
			return {ast:undefined,type:SearchResultType.Name};
		}
		return{ast:undefined,type:SearchResultType.Null};
	}
	toJSON =()=>{
		return{
			name:this.name,
			span:this.span
		}
	}
}
export class HTMLTagAST extends HTMLAST{
	linkListPointer:LinkNode<HTMLAST>|undefined;
	subLists: tagSubNodes|undefined;
	tagOffset: number;
	// attrLists :LinkNode<HTMLAST>|undefined;
	constructor(
		span:Span,
		name?:string|undefined,
		parentPointer?:HTMLAST|undefined,){
		super(HTMLASTNodeType.TAG,span,name,parentPointer);
		this.buildLinkedLists();
		this.tagOffset = span.start;
		this.span.selfShift(this.tagOffset,false);
	}
	
	buildLinkedLists(){
		let  _directive:LinkedList<HTMLATTRAST> = new LinkedList<HTMLATTRAST>(
			{name:"directive",span:new Span(-1,-1)}
		   );
		let  _template:LinkedList<HTMLATTRAST> = new LinkedList<HTMLATTRAST>(
		   {name:"template",span:new Span(-1,-1)}
		   );
		let  _attr:LinkedList<HTMLATTRAST> = new LinkedList<HTMLATTRAST>(
		   {name:"attribute",span:new Span(-1,-1)}
		   );
		let  _content:LinkedList<HTMLTagAST> = new LinkedList<HTMLTagAST>(
		   {name:"content",span:new Span(-1,-1)}
		   );
		let  _comment:LinkedList<HTMLTagAST> = new LinkedList<HTMLTagAST>(
		   {name:"comment",span:new Span(-1,-1)}
		   );
		
	   this.subLists = {
		   directive:_directive,
		   template:_template,
		   attr:_attr,
		   content:_content,
		   comment:_comment
	   }

   	}
	findATTREnd():number{
		if(this.type!==HTMLASTNodeType.TAG){
			return -1;
		}
		return Math.max(this.subLists!.attr.headInfo.span.end,
			this.subLists!.template.headInfo.span.end,
			this.subLists!.directive.headInfo.span.end,
			this.subLists!.content.headInfo.span.end,
			this.nameSpan!.end);
	}
	closeContent(contentEnd:number,end:number):number{
		this.subLists!.content.headInfo.span.end=contentEnd;
		this.span.end = end;
		return end+this.tagOffset;
	}
	closeTag(end?:number){
		this.span.end = end?end:this.findATTREnd();
	}
	getTagLists():tagSubNodes|undefined{
		return this.subLists;
	}
	toJSON =()=>{
		return{
			span:this.span,
			nameSpan:this.nameSpan,
			contentSpan:this.subLists!.content.headInfo.span,
			name:this.name,
			lists:this.subLists,
			tagOffset:this.tagOffset

		}
	}
	search(offset:number):SearchResult{
		// offset -= this.tagOffset;
		if(!this.span.inSpan(offset)){
			return{ast:undefined,type:SearchResultType.Null};
		}
		if(!this.name||this.nameSpan.inSpan(offset)){
			return {ast:undefined,type:SearchResultType.Name};
		}
		for(let listName in this.subLists){
			let _list= this.subLists[listName];
			if(!_list.headInfo.span.inSpan(offset)){
				continue;
			}else{
				let _result = _list.getElement((param:HTMLAST)=>{
					if(param instanceof HTMLTagAST){
						return param.getSpan().inSpan(offset-param.tagOffset);
					}
					return param.getSpan().inSpan(offset);
				});
				if(_result){
					return {ast:_result,type:SearchResultType.Null};
				}
			}
		}
 
		return this.subLists?.comment.headInfo.span.inSpan(offset)?
		{ast:undefined,type:SearchResultType.Content}:{ast:undefined,type:SearchResultType.Value};
	}
} 
export class HTMLATTRAST extends HTMLAST{
	valueNode:HTMLAST|undefined;
	linkListPointer:LinkNode<HTMLAST>|undefined;
	constructor(
	 	type:HTMLASTNodeType,
		span:Span= new Span(-1,-1),
		name?:string|undefined,
		parentPointer?:HTMLAST|undefined,
		) {
			super(type,span,name,parentPointer);
			this.nameSpan = span.clone();
	}
	addValueNode(node:HTMLAST){
		this.span.end = node.getSpan().end;
		this.valueNode = node;
		node.parentPointer = this;
		this.valueNode.nameSpan = this.valueNode.getSpan();
	}
	toJSON =()=>{
		return{
			name:this.name,
			valueNode:this.valueNode,
			span:this.span,
			nameSpan:this.nameSpan
		}
	}
	search(offset:number):SearchResult{
		
		if(this.nameSpan.inSpan(offset)){
			return {ast:undefined,type:SearchResultType.Name};
		}
		if(this.valueNode?.getSpan().inSpan(offset)){
			return{ast:this.valueNode,type:SearchResultType.Null};
		}
		return{ast:undefined,type:SearchResultType.Null}

	}
}
