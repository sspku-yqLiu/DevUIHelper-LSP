/**
 * @license
 * Some of this lexerCode is from Angular/complier. 
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Span} from '../DataStructor/type';
import {TokenType} from './type';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as chars from './chars';
import {logger} from '../server';
export class Token{
	private end:number=-1;
	private span:Span;
	public value:string|undefined;
	constructor(
		private type:TokenType,
		private start:number,
	){
		this.span= new Span(start,-1);
	}
	build(end:number){
		this.end = end;
		this.span = new Span(this.start,end);
	}
	setSpan(start:number,end:number){
		this.span = new Span(start,end);
	}
	getSpan():Span{
		return this.span;
	}
	getType(){
		return this.type;
	}
	setType(type:TokenType){
		this.type = type;
	}
	getValue(){
		return this.value;
	}
}
export class TokenizeOption{
	constructor(
		private _startLabel : string
	){}
	public get startLabel() : string {
		return this._startLabel;
	}
	public set startLabel(v : string) {
		this._startLabel = v;
	}
}
export class TokenizeOptions{
	private SCHEMA = <{[optionName:string]:TokenizeOption}>{};
	constructor(){
		const tokenizeOptionForDevUI = new TokenizeOption("<d-");
		this.SCHEMA['DevUI'] = tokenizeOptionForDevUI;
	}
	getTokenizeOption(name:string):TokenizeOption{
		if(this.SCHEMA[name]){
			return this.SCHEMA[name];
		}
		throw Error(`Cannot find TokenizeOption : ${name}`);
	}	
}


export class Tokenizer{
	protected cursor:Cursor;
	private result:Token[] = [];
	constructor(
		private content:string,
		private start:number=0,
		private end:number = content.length
	){
		this.cursor = new Cursor(content,start,end);		
	}
		/**
		 * Token解析器
		 */
	private _tokenInBuild:Token|undefined;
	Tokenize():Token[]{
		/* 初始化 */
		this.result= [];
		try{
			/**
			 * 直到指定的位置或者是文件末尾停下
			 */
			while(this.cursor.offset<this.end){
				if(this.tryGet(chars.$LT)){
					this._tokenInBuild = new Token(TokenType.TAG_START,this.cursor.offset-1);
					if(this.tryGet(chars.$BANG) ){
						if(this.tryGet(chars.$MINUS)){
							this.buildComment();
						}else{
							this.buildDocumentTag();
						}
					}else if(this.tryGet(chars.$SLASH)){
						this.buildClosedTag()
					}
					else{
						this.buildOpenTag();
					}
				}
				else{
					this.cursor.advance();
				}
			}
		}catch(e){
			this.buildToken();
		}
		// this._tokenInBuild= new Token(TokenType.EOF,-1);
		// this.buildToken();
		//ALERT:这仅用于测试！，发行版请去掉以下内容，否则将严重影响性能！
		this.result.forEach(token=>{
			// logger.debug(this.content.substring(token.getSpan()!.start,token.getSpan()!.end+1));
			if(token.getValue()){
				logger.debug(token.value);
				logger.debug(token.getType().toString());
			}
		});
		return this.result;
	}
	/**
	 * Try家族
	 */
	 //注意这里有指针移动
	tryGet(char:number){
		if(this.cursor.peek() === char){
			this.cursor.advance();
			return true;
		}
		return false
	}
	tryAdvanceThrogh(chars:number[]){
		while(chars.includes(this.cursor.peek())){
			this.cursor.advance();
		}
		return;
	}

	tryStopAt(chars:number[]){

		// if(this._tokenInBuild){
		// 	if([TokenType.ATTR_NAME,TokenType.ATTR_VALUE])
		// }
		while(!chars.includes(this.cursor.peek())){
			const num = this.cursor.peek();
			this.cursor.advance();
		}
		return;
	}
	
	tryStopbyFilter(favor:number[],disgust:number[]):boolean{
		while(!disgust.includes(this.cursor.peek())&&!favor.includes(this.cursor.peek())){
			this.cursor.advance();
		}
		//如果是被喜欢的字符截断
		if(favor.includes(this.cursor.peek())){
			return true;
		}
		//如果是被不应该出现的字符截断
		if(disgust.includes(this.cursor.peek())){
			return false;
		}

		//如果是因为找不到想要的字符 return true
		return true;
	}

	/**
	 * Token工厂家族
	 */

	startToken(tokenType:TokenType){
		this._tokenInBuild= new Token(tokenType,this.cursor.getoffset());
	}
	//注意我们build的时候取的是offset的前一位
	buildToken(){
		if(this._tokenInBuild){
			this._tokenInBuild.build(this.cursor.getoffset()-1);
			//我们仅对应该记录value的token生成value:
			if([2,5,6,7,9].indexOf(this._tokenInBuild.getType())!==-1){
				this._tokenInBuild.value = this.content.substring(this._tokenInBuild.getSpan().start,this._tokenInBuild.getSpan().end+1);
			}
			else if(this._tokenInBuild.getType()===TokenType.CLOSED_TAG){
				this._tokenInBuild.value = this.content.substring(this._tokenInBuild.getSpan().start+2,this._tokenInBuild.getSpan().end).replace(" ","");
			}
			this.result.push(this._tokenInBuild);
			this._tokenInBuild=undefined;
		}
	}

	/**
	 * Token装配车间
	 */

	buildOpenTag(){
		// this.cursor.advance();
		this.buildToken();
		if(this.cursor.peek()===chars.$GT||this.cursor.peek()===chars.$SLASH){
			this.buildATTROrEndToken(this.cursor.peek());
			return;
		}
		else{
			this.startToken(TokenType.TAG_NAME);
			//如果关闭的情况下 closeTag
			if(!this.tryStopbyFilter([chars.$GT,chars.$SLASH,chars.$LT],chars.WhiteChars)){
				this.buildToken();
			}
			if(this.cursor.peek() === chars.$LT)
				return;
			while(!this.buildATTROrEndToken(this.cursor.peek()))
				this.cursor.advance();
		}

	}

	buildClosedTag(){
		// this.cursor.advance();
		this._tokenInBuild?.setType(TokenType.CLOSED_TAG);
		// this.buildToken();
		// this.startToken(TokenType.TAG_NAME);
		// this._tokenInBuild = new Token(TokenType.TAG_NAME,this.cursor.offset);
		this.tryStopAt([chars.$GT]);

		// this._tokenInBuild = new Token(TokenType.TAG_END,this.cursor.offset);
		this.cursor.advance();
		this.buildToken();
		this.buildToken();
	}

	buildATTROrEndToken(char:number){
		if(char === chars.$LT){
			return true;
		}
		if([chars.$GT,chars.$SLASH].indexOf(char)!==-1){
			this.buildTagSelfClosedToken(char);
			return true;
		}else if(chars.WhiteChars.indexOf(char)!==-1){
		}else{
			this.buildATTRToken();
		}
		return false;
	}

	buildTagSelfClosedToken(char:number){

		this.buildToken();
		if(char===chars.$GT){
			this.startToken(TokenType.TAG_END);
			this.cursor.advance();
		}
		else{
			this.startToken(TokenType.TAG_SELF_END);
			this.cursor.advance();
			if(!this.tryGet(chars.$GT)){
				throw Error(`this / does not have a > follw!`)
			}
		}
		this.buildToken();
	}
 
	buildInnerAttrToken(){
		this.startToken(TokenType.TEMPLATE);
		this.tryStopAt([chars.$GT,...chars.WhiteChars]);
		this.buildToken();
	}
	buildATTRToken(){	
		if(this.cursor.peek()===chars.$HASH){
			this.startToken(TokenType.TEMPLATE);
		}else{
			this.startToken(TokenType.ATTR_NAME);
		}
		if(this.tryStopbyFilter([chars.$EQ,],[chars.$GT,chars.$SLASH,chars.$LT,...chars.WhiteChars])){
			this.buildToken();
		}else{
			this.buildToken();
			this.cursor.offset--;
			return;
		}
		 
		this.startToken(TokenType.ATTR_VALUE_START);
		this.cursor.advance();
		if(this.tryStopbyFilter([chars.$DQ],[chars.$GT,chars.$SLASH])){
			this.cursor.advance();
			this.buildToken();

		}else{
			this.buildToken();
			this.cursor.offset--;
			return;
		}
		this.startToken(TokenType.ATTR_VALUE);
		this.tryStopAt([chars.$DQ]);
		this.buildToken();

		this.startToken(TokenType.ATTR_VALE_END);
		this.cursor.advance();			
		this.buildToken();
		this.cursor.offset--;
	}
	buildElementEndToken(){
		this.startToken(TokenType.TAG_END);
		this.cursor.advance();
		this.buildToken();
	}
	buildComment(){
		this._tokenInBuild = new Token(TokenType.COMMENT,this.cursor.offset-3);
		let _end = this.content.indexOf("-->",this.cursor.offset);
		this.cursor = new Cursor(this.content,_end+3,this.cursor.getEOF());
		this.buildToken();
	}
	buildDocumentTag(){
		this._tokenInBuild = new Token(TokenType.DOCUMENT,this.cursor.offset-2);
		this.tryStopAt([chars.$GT]);
		this.cursor.advance();
		this.buildToken();
	}
	/**
	 * 功能函数
	 */

} 
export class Cursor{
	public peekvalue = -1;
	constructor(
		private text:string,
		public offset:number,
		private EOF:number
	){}
	getoffset(){return this.offset}
	advance(){
		let peek = this.peek();
		if(peek===chars.$BACKSLASH){
			this.offset++;
		}
		this.offset++;
		if(this.offset >=this.EOF){
			this.offset++;
			throw Error(`Char At EOF At ${this.offset}`);
		}
	}  

	peek():number{
		this.peekvalue = this.text.charCodeAt(this.offset);
		return this.text.charCodeAt(this.offset);
	}
	createSpanRight(cursor:Cursor){
		return new Span(this.offset,cursor.offset);
	}
	copy(){
		return new Cursor(this.text,this.offset,this.EOF);
	}
	forceAdvance(){
		this.offset++;
	}
	getEOF(){
		return this.EOF;
	}
}
// while(this.cursor.getoffset()<this.end){
// 	//解决string和lspoffset不同的问题
// 	this.cursor.forceAdvance();			
// 	this.buildOpenTag();
// 	/*开始属性ATTR */
// 	while(this.cursor.peek()!==chars.$GT){
// 		this.tryAdvanceThrogh(chars.WhiteChars);
// 		/**
// 		 * #开头类型(内属性)
// 		 */
// 		if(this.cursor.peek() === chars.$HASH){
// 			this.buildInnerAttrToken();
// 		/**
// 		 * 普通属性
// 		 */
// 		}else if(this.cursor.peek() !== chars.$GT){
// 			this.buildATTRToken();		
// 		}
// 	}
// }