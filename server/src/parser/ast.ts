/*
 * @Author: your name
 * @Date: 2020-04-07 18:42:40
 * @LastEditTime: 2020-06-08 14:57:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\ast.ts
 */
import * as lsp from 'vscode-languageserver';
import {Span} from '../DataStructure/type';
import {  TokenType, NodeStatus,HTMLASTNodeType, tagSubNodes, TreeError, ParseErrorLevel, SearchResult, ParseResult, SearchResultType } from './type';
import { Token, Cursor } from './lexer';
import { threadId } from 'worker_threads';
import { LinkNode, LinkedList } from '../DataStructure/LinkList';
import { isTagProps } from './utils';
import { logger } from '../server';
import { getJSDocThisTag } from 'typescript/lib/tsserverlibrary';
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
				else if(this.currentToken.getType()===TokenType.COMMENT){
					this.buildComment();
				}else{
					this.advance();
				}
			}
		}catch(e){
			logger.debug(e);
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
			// this.tagInBuld.linkListPointer = this.getStackpeek().getTagLists()?.content.insertNode(this.tagInBuld);
			// this.tagInBuld = undefined;
		}
		this.tagInBuld = new HTMLTagAST(this.currentSpan);
		// this.tagInBuld.buildLinkedLists();
		this.advance();
		if (this.currentToken.getType() === TokenType.TAG_NAME) {
			this.setNodeName(this.currentSpan,this.currentToken.value);
			if(this.currentToken.value == "script" || this.currentToken.value== "style"){
				this.buildStack.push(this.tagInBuld);
				this.tagInBuld =undefined;
				return;
			}
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
		if(this.tagInBuld){
			this.closeTagInBuild();
		}
		let _contentEnd= this.currentSpan.start-1;
		this.advance();
		if(this.currentToken.getType()!==TokenType.TAG_END_NAME){
			return;
		}
		let _closeTagName = this.currentToken.value;
		if(!_closeTagName){
			this.errors.push(new TreeError(this.currentSpan,`this closed tag cannot find its content!!`,this.getStackpeek(),ParseErrorLevel.ERROR));
			return;
		}
		let _cursor =-1;
		for(let i:number = this.buildStack.length-1;i>0;i--){
			if(_closeTagName == this.buildStack[i].getName()){
				_cursor = i;break;
			}	
		}
		if(_cursor!==-1){
			this.advance();
			while(this.buildStack.length>_cursor){
				_contentEnd = this.buildStack.pop()!.closeContent(_contentEnd,_contentEnd+_closeTagName.length+1);
			}
		}
		else{
			this.errors.push(new TreeError(this.currentSpan,`this closed tag cannot find its Open tag!!`,this.getStackpeek(),ParseErrorLevel.ERROR));
		}
		this.advance();
	}
	setNodeName(span:Span,name?:string){
		name = name?name:"";
		this.tagInBuld?.setName(name,span);
		this.tagInBuld!.getSpan().end = span.end;
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
			// this.tagInBuld!.parentPointer = this.getStackpeek();
			this.addToList(this.getStackpeek().content,this.tagInBuld);
			let _content = this.tagInBuld.content;
			if(this.currentToken.getType() === TokenType.TAG_END){
				this.tagInBuld.domain.end = this.currentSpan.end;
				_content.headInfo.span.start = this.currentSpan.end+1;
				this.buildStack.push(this.tagInBuld!);
			}else{
				_content.headInfo.span = new Span(-1,-1);
			}
			this.currentSpan.selfShift(this.tagInBuld.tagOffset,true);
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
	 * 注释
	 */
	buildComment(){
		let _commentAST = new HTMLAST(HTMLASTNodeType.COMMENT,this.currentSpan);
		if(this.tagInBuld){
			this.addToList(this.tagInBuld.attrList!.comment,_commentAST);
		}
		this.addToList(this.getStackpeek().content,_commentAST);
		this.advance();
	}
	/**
	 * 属性相关
	 */
	//开始的时候我们并没有把它插入到链表之中

	startNewATTR(){
		this.buildLastAttr();

		if(this.currentToken.getType()===TokenType.TEMPLATE){
			this.attrInBuild = new HTMLATTRAST(HTMLASTNodeType.TEMPLATE,this.currentSpan,this.currentToken.value);
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
		if(list.length===0&&!(node instanceof HTMLTagAST)){
			list.headInfo.span.start = node!.getSpan().start;
		}
		node.linkListPointer=list.insertNode(node);
		if(!(node instanceof HTMLTagAST)){
			node.parentPointer = this.tagInBuld;
			list.headInfo.span.end=node.getSpan().end;
		}else{
			node.parentPointer = this.getStackpeek();
			list.headInfo.span.end=node.getSpan().end+node.tagOffset;
		}

	}
	buildLastAttr(){
		if(this.attrInBuild){
			this.buildAttr();
			this.attrInBuild = undefined;
		}
	}
	init(){
		this.currentToken = this.tokens[0];
		this.currentSpan= this.currentToken!.getSpan();
		let _tokentype:TokenType = this.currentToken.getType();

	}
	advance(){
		if(this.index<this.tokens.length)
			this.currentToken = this.tokens[++this.index];
		else{
			throw Error(`this is the last!!!`);
		}
		this.currentSpan = this.currentToken.getSpan();
		this.adjustSpan();
		if(this.currentToken.getType()===TokenType.COMMENT){
			let _commentAst = new HTMLAST(HTMLASTNodeType.COMMENT,this.currentSpan);
			this.getStackpeek().attrList!.comment.insertNode(_commentAst);
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
		protected nodeSpan:Span,
		protected name?:string|undefined,
		public parentPointer?:HTMLAST|undefined,
		) {
			this.parentPointer=parentPointer;
	}
	getSpan(){return this.nodeSpan;}

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
		return {ast:undefined,type:this.type===HTMLASTNodeType.COMMENT?SearchResultType.Null: SearchResultType.Name};
	}
	toJSON =()=>{
		return{
			nameSpan:`name:${this.name} namespan:${this.nameSpan.toJSON()}`,
		};
	}
	getSearchResultKind(){
		// switch(this.type){
		// 	case(HTMLASTNodeType.)
		// }
	}
}
export class HTMLTagAST extends HTMLAST{
	linkListPointer:LinkNode<HTMLAST>|undefined;
	attrList: tagSubNodes|undefined;
	content:LinkedList<HTMLAST>;
	tagOffset: number;
	domain:Span;
	// attrLists :LinkNode<HTMLAST>|undefined;
	constructor(
		domain:Span,
		name?:string|undefined,
		parentPointer?:HTMLAST|undefined,){
		super(HTMLASTNodeType.TAG,domain,name,parentPointer);
		this.content =  new LinkedList<HTMLTagAST>({name:"content",span:new Span(-1,-1)});
		this.buildLinkedLists();
		this.tagOffset = domain.start;
		this.nodeSpan.selfShift(this.tagOffset,false);
		this.domain = this.nodeSpan.clone();
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
		let  _comment:LinkedList<HTMLTagAST> = new LinkedList<HTMLTagAST>(
		   {name:"comment",span:new Span(-1,-1)}
		   );
		
	   this.attrList = {
		   directive:_directive,
		   template:_template,
		   attr:_attr,
		   comment:_comment
	   };

   	}
	findATTREnd():number{
		if(this.type!==HTMLASTNodeType.TAG){
			return -1;
		}
		return Math.max(this.attrList!.attr.headInfo.span.end,
			this.attrList!.template.headInfo.span.end,
			this.attrList!.directive.headInfo.span.end,
			this.content.headInfo.span.end,
			this.nameSpan!.end);
	}
	
	closeContent(contentEnd:number,end:number):number{
		this.content.headInfo.span.end=contentEnd;
		this.domain.end = end;
		return end+this.tagOffset;
	}
	closeTag(end?:number){
		let _end =this.findATTREnd();
		this.nodeSpan.end = end?end:_end;
		this.domain.end = end?end:_end;
	}
	getTagLists():tagSubNodes|undefined{
		return this.attrList;
	}
	getDomain(){
		return this.domain;
	}
	toJSON =()=>{
		return{
			nodeSpan:this.nodeSpan,
			domain:this.domain,
			nameSpan:`name:${this.name} namespan:${this.nameSpan.toJSON()}`,
			content: this.content,
			lists:this.attrList,
			tagOffset:this.tagOffset
		};
	}
	search(offset:number):SearchResult{
		// offset -= this.tagOffset;
		// if(!this.domain.inSpan(offset)){
		// 	return{ast:undefined,type:SearchResultType.Null};
		// }
		if(!this.name||this.nameSpan.inSpan(offset)){
			return {ast:undefined,type:SearchResultType.Name};
		}
		if(this.nodeSpan.inSpan(offset)){
			for(let listName in this.attrList){
				let _list= this.attrList[listName];
				if(!_list.headInfo.span.inSpan(offset)){
					continue;
				}else{
					let _result = _list.getElement((param:HTMLAST)=>{
						return param.getSpan().inSpan(offset);
					});
					if(_result){
						return {ast:_result,type:SearchResultType.Null};
					}
				}
			}
			return {ast:undefined,type:SearchResultType.Value};
		}
		if(this.content.headInfo.span.inSpan(offset)){
			let _result = this.content.getElement((param:HTMLAST)=>{
				if(param instanceof HTMLTagAST){
					return param.getDomain().inSpan(offset-param.tagOffset);
				}
			});
			return _result?{ast:_result,type:SearchResultType.Null}:{ast:undefined,type:SearchResultType.Content};
		}
		return {ast:undefined,type:SearchResultType.Null};
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
		this.nodeSpan.end = node.getSpan().end;
		this.valueNode = node;
		node.parentPointer = this;
		this.valueNode.nameSpan = this.valueNode.getSpan();
	}
	toJSON =()=>{
		return{
			nameSpan:`name:${this.name} namespan:${this.nameSpan.toJSON()}`,
			valueNode:this.valueNode,
			span:this.nodeSpan,
		};
	}
	search(offset:number):SearchResult{	
		if(this.nameSpan.inSpan(offset)){
			return {ast:undefined,type:SearchResultType.Name};
		}
		if(this.valueNode?.getSpan().inSpan(offset)){
			return{ast:this.valueNode,type:SearchResultType.Null};
		}
		return{ast:undefined,type:SearchResultType.Null};
	}
}
export class HTMLCommentAST extends HTMLAST{
	constructor(span?:Span){
		super(HTMLASTNodeType.COMMENT,span?span:new Span(-1,-1));
	}
}
