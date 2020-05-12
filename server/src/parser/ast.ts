/*
 * @Author: your name
 * @Date: 2020-04-07 18:42:40
 * @LastEditTime: 2020-05-12 10:10:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\ast.ts
 */
import * as lsp from 'vscode-languageserver';
import { htmlInfo } from '../source/html_info';
import {Span} from '../DataStructor/type';
import {  TokenType, NodeStatus,ASTNodeType, tagSubNodes, TreeError, ParseErrorLevel } from './type';
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
	buildStack:TagASTNode[]=[];
	tagInBuld: TagASTNode | undefined;
	attrInBuild:ATTRASTNode|undefined;
	currentSpan:Span= new Span(-1,-1);
	currentToken :Token = new Token(TokenType.DOCUMENT,-1);
	roots: HTMLAST[] = [];
	root:TagASTNode;
	errors:TreeError[]=[];
	// currentSpan: Span | undefined;
	constructor(private tokens: Token[]) { 
		this.root = new TagASTNode(new Span(0,0));
	}
	build(): TagASTNode {
		if(this.tokens.length<1){
			return this.root;
		}
		this.init();
		this.buildStack.push(this.root);
		try{
			while(this.currentToken.getType()!== TokenType.EOF) {
				this.adjustSpan(this.currentSpan);
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
		return this.root;
	}
	/**
	 * TAG相关
	 */
	buildNewTag(){
		if(this.tagInBuld){
			//TODO: 这里面要加上一个属性关闭的函数。
			this.buildLastTag();
			this.tagInBuld.linkListPointer = this.getStackpeek().getTagLists()?.content.insertNode(this.tagInBuld);
			this.tagInBuld = undefined;
		}
		this.tagInBuld = new TagASTNode(this.currentSpan);
		this.tagInBuld.buildLinkedLists();
		this.advance();
		if (this.currentToken.getType() === TokenType.TAG_NAME) {
			this.setTagName(this.currentSpan,this.currentToken.value);
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
			this.closeTagInBuildAt();
			this.advance();
		}else{
			return;
		}
	}
	closeTagContent(){
		let _cursor =-1;
		for(let i:number = this.buildStack.length-1;i>0;i--){
			if(this.currentToken.value == this.buildStack[i].getName()){
				_cursor = i;break;
			}	
		}
		if(_cursor!==-1){
			while(this.buildStack.length>_cursor){
				this.buildStack.pop()?.closeContent(this.currentSpan.end);
			}
		}
		else{
			this.errors.push(new TreeError(this.currentSpan,`this closed tag cannot find its Open tag!!`,ParseErrorLevel.ERROR));
		}
		this.advance();
	}
	buildLastTag(){
		if(this.attrInBuild){
			this.buildAttr();
		}
		this.tagInBuld?.closeTag();
		this.tagInBuld=undefined;
	}
	setTagName(span:Span,name?:string){
		name = name?name:"";
		this.tagInBuld?.setName(name,span);
	}
	/**
	 * 关闭标签 start content.
	 * @param end 
	 */
	closeTagInBuildAt(){
		this.buildAttr();
		if(!this.tagInBuld){
			throw Error(`this tag does not have lists, please check parser!!!`);
		}else{
			let _content = this.tagInBuld?.getTagLists()!.content;
			this.tagInBuld!.closeTag();
			this.tagInBuld!.parentPointer = this.getStackpeek();
			this.addToList(this.getStackpeek().attrLists!.content,this.tagInBuld);
			if(this.currentToken.getType() === TokenType.TAG_END){
				_content.headInfo.span.start = this.currentSpan.end+1;
				this.buildStack.push(this.tagInBuld!);
			}else  {
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
		let _endOfTokens:number = this.currentToken.getSpan().end;
		if(this.attrInBuild){
			this.buildAttr();
		}
		if(this.tagInBuld){
			this.buildLastTag();
			for(let ast of this.buildStack){
				ast.closeContent(this.currentSpan.end);
			}
			this.tagInBuld = undefined;
		}
		this.root.build(_endOfTokens);
	}
	/**
	 * 属性相关
	 */
	//开始的时候我们并没有把它插入到链表之中

	startNewATTR(){
		this.buildLastAttr();
		let _list =null;
		if(this.currentToken.getType()===TokenType.TEMPLATE){
			this.attrInBuild = new ATTRASTNode(ASTNodeType.TEMPLATE,this.currentSpan,this.currentToken.value);
			_list = this.tagInBuld!.getTagLists()!.template;
		}else{
			this.attrInBuild = new ATTRASTNode(ASTNodeType.ATTR,this.currentSpan,this.currentToken.value);
		}
	}
	addValueNode(){
		let _valueNode = new HTMLAST(ASTNodeType.ATTR_VALUE,this.currentSpan,this.currentToken.value);
		this.attrInBuild?.addValueNode(_valueNode);
	}
	buildAttr(){
		if(!this.attrInBuild){
			return;
		}
		if(this.attrInBuild.getType()===ASTNodeType.TEMPLATE){
			this.addToList(this.tagInBuld?.getTagLists()!.template,this.attrInBuild);
		}
		else if(this.attrInBuild?.valueNode){
			this.addToList(this.tagInBuld?.getTagLists()!.attr,this.attrInBuild);
		}else{
			this.attrInBuild?.setType(ASTNodeType.DIRECTIVE);
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
	adjustSpan(_span:Span){
		for(let ast of this.buildStack){
			_span.shift(ast.tagStart,false);
		}
		if(this.tagInBuld){
			_span.shift(this.tagInBuld.tagStart,false);
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
		node.parentPointer = this.tagInBuld;
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
		this.adjustSpan(this.currentSpan);
	}
}
export class HTMLAST  {
	linkListPointer:LinkNode<HTMLAST>|undefined;
	status:NodeStatus = NodeStatus.DEFAULT;
	parentPointer:HTMLAST|undefined;
	nameSpan:Span=new Span(-1,-1);
	//2020/5/11 应该把tag和普通的HTMLAST区分开来
	tagStart:number = -1;
	constructor(
		protected type:ASTNodeType,
		protected span:Span= new Span(-1,-1),
		protected name?:string|undefined,
		parentPointer?:HTMLAST|undefined,
		) {
			this.parentPointer=parentPointer;
	}
	getSpan(){return this.span;}

	getName(){
		return this.name;
	}
	setName(name:string,nameSpan:Span){
		this.name = name;
		this.nameSpan = nameSpan;
	}
	build(end: number) {
		if(this.span.start!==-1){
			this.span.end= end;
		}
		else{
			throw Error(`this element or attr does not have start!!!`);
		}
	}
	getType(){
		return this.type;
	}
	setType(type:ASTNodeType){
		this.type = type;
	}
	//TODO: 请重写搜索函数
	search():boolean{
		return false;
	}
	toJSON =()=>{
		return{
			name:this.name
		}
	}
}
export class TagASTNode extends HTMLAST{
	linkListPointer:LinkNode<TagASTNode>|undefined;
	attrLists: tagSubNodes|undefined;
	tagOffset: number|undefined;
	// attrLists :LinkNode<HTMLAST>|undefined;
	constructor(
		span:Span,
		name?:string|undefined,
		parentPointer?:HTMLAST|undefined,){
		super(ASTNodeType.TAG,span,name,parentPointer);
		this.buildLinkedLists();
		this.tagOffset = span.start;
	}
	
	buildLinkedLists(){
		let  _directive:LinkedList<ATTRASTNode> = new LinkedList<ATTRASTNode>(
			{name:"directive",span:new Span(-1,-1)}
		   );
		let  _template:LinkedList<ATTRASTNode> = new LinkedList<ATTRASTNode>(
		   {name:"template",span:new Span(-1,-1)}
		   );
		let  _attr:LinkedList<ATTRASTNode> = new LinkedList<ATTRASTNode>(
		   {name:"attribute",span:new Span(-1,-1)}
		   );
		let  _content:LinkedList<TagASTNode> = new LinkedList<TagASTNode>(
		   {name:"content",span:new Span(-1,-1)}
		   );
	   this.attrLists = {
		   directive:_directive,
		   template:_template,
		   attr:_attr,
		   content:_content
	   }
   }
	findATTREnd():number{
		if(this.type!==ASTNodeType.TAG){
			return -1;
		}
		return Math.max(this.attrLists!.attr.headInfo.span.end,
			this.attrLists!.template.headInfo.span.end,
			this.attrLists!.directive.headInfo.span.end,
			this.attrLists!.content.headInfo.span.end,
			this.nameSpan!.end);
	}
	closeContent(end:number){
		this.attrLists!.content.headInfo.span.end=end;
	}
	closeTag(){
		this.span.end = this.findATTREnd();
	}
	getTagLists():tagSubNodes|undefined{
		return this.attrLists;
	}
	toJSON =()=>{
		return{
			name:this.name,
			lists:this.attrLists,
		}
	}

} 
export class ATTRASTNode extends HTMLAST{
	valueNode:HTMLAST|null = null;
	linkListPointer:LinkNode<ATTRASTNode>|undefined;
	constructor(
	 	type:ASTNodeType,
		span:Span= new Span(-1,-1),
		name?:string|undefined,
		parentPointer?:HTMLAST|undefined,
		) {
			super(type,span,name,parentPointer);
	}
	addValueNode(node:HTMLAST){
		this.span.end = node.getSpan().end;
		this.valueNode = node;
		node.parentPointer = this;
	}
	toJSON =()=>{
		return{
			name:this.name,
			valueNode:this.valueNode
		}
	}
}
