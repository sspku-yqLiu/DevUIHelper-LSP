/*
 * @Author: your name
 * @Date: 2020-04-07 18:42:40
 * @LastEditTime: 2020-04-12 12:38:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\ast.ts
 */
import * as lsp from 'vscode-languageserver';
import { htmlInfo } from '../source/html_info';
import { Span, TokenType } from './type';
import { Token } from './tokenize';
import { threadId } from 'worker_threads';
export enum ASTType {
	ROOT,
	ELEMENT,
	ATTR
}
export interface AST {

	/**
	 * 检测是否存在于key范围内
	 * @param offset 
	 */
	inKeySpan(offset: number): boolean;

	/**
	 * 检测是否存在于value范围内
	 * @param textPosition
	 */
	inValueSpan(offset:number):boolean;

	getKeySpan():Span
}
export class TreeBuilder {
	//NOTE:也许不适用stack也可以进行Ast建立，stack的好处在于可以依次退栈，但是我们也许并不需要。
	// builderStack : AST[]=[];
	elementInBuild: HTMLAST | undefined;
	attrInBuild:HTMLAST|undefined;
	roots: HTMLAST[] = [];
	root:HTMLAST;
	// currentSpan: Span | undefined;
	constructor(private tokens: Token[], errors?: Error) { 
		this.root = new HTMLAST(ASTType.ROOT,new Span(1,-1));
	}
	build(): HTMLAST {
		if(this.tokens.length<1){
			return new HTMLAST(ASTType.ROOT,new Span(0,0));
		}
		for (let token of this.tokens) {
			let _currentSpan:Span|undefined = token!.getSpan();
			let _tokentype:TokenType = token.getType();
			if (_currentSpan) {
				/* build element */

				if (token.getType() === TokenType.ELEMENT_START) {
					this.elementInBuild = new HTMLAST(ASTType.ELEMENT,new Span(token.getSpan()!.start,-1),this.root);
				}
				else {
					if (this.elementInBuild) {		
						if (_tokentype === TokenType.ELEMENT_VALUE) {
							this.elementInBuild.setKeySpan(_currentSpan);
							this.elementInBuild.setValueStart(_currentSpan.end+1)
						}
						else if(_tokentype === TokenType.ELEMENT_END){
							this.closeElementAt(_currentSpan.end);
						}
						//build inner ATTR 
						else if (_tokentype === TokenType.INNER_ATTR) {
							this.attrInBuild = new HTMLAST(ASTType.ATTR,_currentSpan,this.attrInBuild);
							this.attrInBuild.singleDog();
							this.closeAttrAt(token.getSpan()!.end);
						}
						//build normal ATTR 
						else if(_tokentype=== TokenType.ATTR_NAME){
							//如果这时有没有build完成的attr应该让他先build，我们认为这个attr没有build成功
							if(this.attrInBuild){
								this.attrInBuild.buildWithoutEnd();
							}
							this.attrInBuild = new HTMLAST(ASTType.ATTR,new Span(_currentSpan.start,-1),this.elementInBuild);
							this.attrInBuild.setKeySpan(_currentSpan);
						}
						else{
							if (this.attrInBuild){
								if(_tokentype=== TokenType.ATTR_VALUE_START){}
								else if(_tokentype=== TokenType.ATTR_VALUE){
									this.attrInBuild.setValueSpan(_currentSpan);
								}
								else if(_tokentype === TokenType.ATTR_VALE_END){
									this.closeAttrAt(token.getSpan()!.end);
								}
							}else{
								throw Error(`we need to add something into attr ,but we cannot find at ${_currentSpan.start}`);
							}
						}
					} else {
						throw Error(`we need to add something into element but we cannot find at %${_currentSpan.start}`);
					}
				}
			}
			else {
				throw Error(`this token does not have have span:${token.getSpan()}`);
			}
		}
		this.buildRoot();
		return this.root;
	}
	closeAttrAt(end:number){
		if(this.elementInBuild&&this.attrInBuild){
			if(this.attrInBuild.getSpan().end===-1){
				this.attrInBuild.buildWithoutEnd();
			}
		this.elementInBuild.subNodes.push(this.attrInBuild);
		this.attrInBuild = undefined;
		}else{
			throw Error(`没有找到build中的元素或者属性！位于：${end}`)
		}
	}
	closeElementAt(end:number){
		if(this.attrInBuild){
			this.closeAttrAt(end);
		}

		if(this.elementInBuild){
			this.elementInBuild.build(end);
			this.roots.push(this.elementInBuild);
			this.elementInBuild.valueSpan.end = end-1;
		}
		else{
			throw Error(`we need to build an element ,but we cannot find at${end}`);
		}
		this.elementInBuild= undefined;
	}
	buildRoot(){
		const endOfTokens:number = this.tokens.pop()!.getSpan().end;


		if(this.attrInBuild){
			this.attrInBuild.build(endOfTokens);
			this.elementInBuild!.valueSpan.end = endOfTokens;
			this.elementInBuild?.subNodes.push(this.attrInBuild);
		}
		if(this.elementInBuild){
			this.elementInBuild.build(endOfTokens);
			this.roots.push(this.elementInBuild);
			this.elementInBuild = undefined;
		}
		this.root.build(endOfTokens);
		this.root.singleKing();
		this.root.subNodes = this.roots;
	}
	
}
export class HTMLAST implements AST {
	element: Element | undefined;
	subNodes: HTMLAST[] = [];
	keySpan: Span = new Span(-1,-1);
	valueSpan: Span = new Span(-1,-1);
	spanStart: number = -1;
	constructor(
		private type:ASTType,
		private span:Span= new Span(-1,-1),
		private parent?:HTMLAST|undefined) {
			this.valueSpan = new Span(-1,-1);
			this.keySpan = new Span(-1,-1);
	}
	getSpan(){return this.span;}

	setKeySpan(span: Span) {
		this.keySpan = span;
	}
	getKeySpan(){
		return this.keySpan;
	}
	
	setValueSpan(span: Span) {
		this.valueSpan = span;
	}
	setValueStart(start:number){
		this.valueSpan.start=start;
	}

	build(end: number) {
		if(this.span.start!==-1){
			this.span .end= end;
		}
		else{
			throw Error(`this element or attr does not have start!!!`);
		}
	}
	/**
	 * 这里写了两个特殊的函数，他们的命名比较奇葩
	 * 1.单身狗函数
	 * 没有value的属性，我们称之为单身狗。
	 * 写着写着不知道为什么眼泪就留下来了...
	 */
	singleDog(){
		this.keySpan= this.span;
	}
	/**
	 * 2.单身王者函数
	 * 他没有key属性,只有value属性。
	 * 自己一个人仍然可以过得很快乐
	 */
	singleKing(){
		this.valueSpan = this.span;
	}

	inSpan(offset:number):boolean{
		return this.span.inSpan(offset);
	}
	inKeySpan(offset:number):boolean{
		if(!this.keySpan){
			return false;
		}
		return this.keySpan.inSpan(offset);
	}
	inValueSpan(offset:number):boolean{
		if(!this.valueSpan){
			return false;
		}
		return this.valueSpan.inSpan(offset);
	}

	inCompletionSpan(offset:number):boolean{
		return this.span.inCompletionSpan(offset);
	}
	inCompletionKeySpan(offset:number):boolean{
		if(!this.keySpan){
			return false;
		}
		return this.keySpan.inCompletionSpan(offset);
	}
	inCompletionValueSpan(offset:number):boolean{
		if(!this.valueSpan){
			return false;
		}
		return this.valueSpan.inCompletionSpan(offset);
	}
	getSubNodes():HTMLAST[]{
		return this.subNodes;
	}
	getType(){
		return this.type;
	}
	getparent(){
		return this.parent;
	}
	buildWithoutEnd(){
		this.span.end = Math.max(this.keySpan.end,this.valueSpan.end);
	}

	
}
