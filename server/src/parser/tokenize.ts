import {Span,TokenType} from './type';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as chars from './chars';
import {logger} from '../server';
export class Token{
	private end:number=-1;
	private span:Span;
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
	private _text:string;
	protected _cursor:Cursor;
	private _result:Token[] = [];
	private _tokenizeOption:TokenizeOption;
	constructor(
		private textdocument:TextDocument,
		_tokenizeOption:TokenizeOption|string){
			if((_tokenizeOption instanceof TokenizeOption)){
				this._tokenizeOption = _tokenizeOption;
				
			}else{
				this._tokenizeOption = new TokenizeOptions().getTokenizeOption(_tokenizeOption);
			}
			this._text = textdocument.getText();
			/* -1 为了*/ 
			this._cursor = new Cursor(this._text,this._text.indexOf(this._tokenizeOption.startLabel,0));
		}
		/**
		 * Token解析器
		 */
	private _tokenInBuild:Token|undefined;
	Tokenize():Token[]{
		/* 初始化 */
		this._result= [];
		try{
			/**
			 * build token 从<d-开始
			 */
			while(this._cursor.getoffset()!=-1){
				//解决string和lspoffset不同的问题
				this._cursor.forceAdvance();			
				this.buildElementStartAndNameToken();
				/*开始属性ATTR */
				while(this._cursor.peek()!==chars.$GT){
					this.tryAdvanceThrogh(chars.WhiteChars);
					/**
					 * #开头类型(内属性)
					 */
					if(this._cursor.peek() === chars.$HASH){
						this.buildInnerAttrToken();
					/**
					 * 普通属性
					 */
					}else if(this._cursor.peek() !== chars.$GT){
						this.buildATTRToken();		
					}
				}
				/**
				 * element end
				 */
				if(this._cursor.peek() === chars.$GT){
				this.buildElementEndToken();
				logger.debug(`we are at ${this._cursor.getoffset()}`)
				this._cursor = new Cursor(this._text,this._text.indexOf(this._tokenizeOption.startLabel,this._cursor.getoffset()));
				}
			}
		}catch{
			this.buildToken();
		}
		this._result.forEach(token=>{
			logger.debug(this._text.substring(token.getSpan()!.start,token.getSpan()!.end+1));
			logger.debug(token.getType().toString());
		})
		return this._result;
	}

	tryAdvanceThrogh(chars:number[]){
		while(chars.includes(this._cursor.peek())){
			this._cursor.advance();
		}
		return;
	}

	tryStopAt(chars:number[]){

		while(!chars.includes(this._cursor.peek())){
			const num = this._cursor.peek();
			this._cursor.advance();
		}
		return;
	}
	
	tryStopbyFilter(favor:number[],disgust:number[]):boolean{
		while(!disgust.includes(this._cursor.peek())&&!favor.includes(this._cursor.peek())){
			this._cursor.advance();
		}
		//如果是被喜欢的字符截断
		if(favor.includes(this._cursor.peek())){
			return true;
		}
		//如果是被不应该出现的字符截断
		if(disgust.includes(this._cursor.peek())){
			return false;
		}

		//如果是因为找不到想要的字符 return true
		return true;
	}
	startToken(tokenType:TokenType){
		if(tokenType === TokenType.ELEMENT_START){
			this._tokenInBuild= new Token(tokenType,this._cursor.getoffset()-1);
			return ;

		}
		this._tokenInBuild= new Token(tokenType,this._cursor.getoffset());
	}
	buildToken(){
		if(this._tokenInBuild){
			this._tokenInBuild.build(this._cursor.getoffset()-1);
			this._result.push(this._tokenInBuild);
			this._tokenInBuild=undefined;
		}
	}
	changeWordPositionToOffset(position:number ){
		return position-1;
	}
	moveToElement_VALUE(){
		let len = this._tokenizeOption.startLabel.length-1;
		while(len>0){
			this._cursor.advance();
			len--;
		}
	}
	buildElementStartAndNameToken(){
		this.startToken(TokenType.ELEMENT_START);
		this.moveToElement_VALUE();
		this.buildToken();
		this.startToken(TokenType.ELEMENT_VALUE);			
		this.tryStopAt([chars.$GT,...chars.WhiteChars]);
		this.buildToken();
	}
 
	buildInnerAttrToken(){
		this.startToken(TokenType.INNER_ATTR);
		this.tryStopAt([chars.$GT,...chars.WhiteChars]);
		this.buildToken();
	}
	buildATTRToken(){	

		this.startToken(TokenType.ATTR_NAME);
		if(this.tryStopbyFilter([chars.$EQ],chars.WhiteChars)){
			this.buildToken();
		}else{
			this.buildToken();return;
		}
		
		this.startToken(TokenType.ATTR_VALUE_START);
		this._cursor.advance();
		this.tryStopAt([chars.$DQ]);
		this._cursor.advance();
		this.buildToken();

		this.startToken(TokenType.ATTR_VALUE);
		this.tryStopAt([chars.$DQ]);
		this.buildToken();

		this.startToken(TokenType.ATTR_VALE_END);
		this._cursor.advance();
		this.buildToken();
	}
	buildElementEndToken(){
		this.startToken(TokenType.ELEMENT_END);
		this._cursor.advance();
		this.buildToken();
	}
} 
export class Cursor{
	private peekvalue = -1;
	constructor(
		private text:string,
		private offset:number,
	){}
	getoffset(){return this.offset}
	advance(){
		let peek = this.peek();
		if(peek===chars.$BACKSLASH){
			this.offset++;
		}
		this.offset++;
		if(this.offset === this.text.length||peek===chars.$EOF||peek===chars.$LT){
			this.offset--;
			throw Error(`Char At EOF Or a '<' in element!!!!!`);
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
		return new Cursor(this.text,this.offset)
	}
	forceAdvance(){
		this.offset++;
	}
}