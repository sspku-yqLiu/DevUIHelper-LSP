import {Span,TokenType} from './type';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as chars from './chars';
import {logger} from '../server';
export class Token{
	private end:number=-1;
	private span:Span|undefined;
	constructor(
		private type:TokenType,
		private start:number,
	){}
	build(end:number){
		this.end = end;
		this.span = new Span(this.start,end);
	}
	setSpan(start:number,end:number){
		this.span = new Span(start,end);
	}
	getSpan(){
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

export class Tokenizer{
	private text:string;
	protected _cursor:Cursor;
	private result:Token[] = [];
	constructor(
		private textdocument:TextDocument,
		private tokenizeOption:TokenizeOption){
			this.text = textdocument.getText();
			/* -1 为了*/ 
			this._cursor = new Cursor(this.text,this.text.indexOf(tokenizeOption.startLabel,0));
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
			 * build token 从<d-开始
			 */
			while(this._cursor.getoffset()!=-1){
				
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
				 * element nd
				 */
				if(this._cursor.peek() === chars.$GT){
					this.buildElementEndToken();
				}
				logger.debug(`we are at ${this._cursor.getoffset()}`)
				this._cursor = new Cursor(this.text,this.text.indexOf(this.tokenizeOption.startLabel,this._cursor.getoffset()));
			}
		}catch{
			this.buildToken();
		}
		this.result.forEach(token=>{
			logger.debug(this.text.substring(token.getSpan()!.start,token.getSpan()!.end+1));
			logger.debug(token.getType().toString());
		})
		return this.result;
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
	startToken(tokenType:TokenType){
		this._tokenInBuild= new Token(tokenType,this._cursor.getoffset());
	}
	buildToken(){
		if(this._tokenInBuild){
			this._tokenInBuild.build(this._cursor.getoffset()-1);
			this.result.push(this._tokenInBuild);
			this._tokenInBuild=undefined;
		}
	}
	changeWordPositionToOffset(position:number ){
		return position-1;
	}
	moveToElement_VALUE(){
		let len = this.tokenizeOption.startLabel.length;
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
		this.tryStopAt([chars.$EQ]);
		this.buildToken();

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
	constructor(
		private text:string,
		private offset:number,
	){}
	getoffset(){return this.offset}
	advance(){
		if(this.peek()===chars.$BACKSLASH)
			this.offset++;
		if(this.offset === this.text.length||this.peek()===chars.$EOF)
			throw Error(`Char At EOF!!!!!`);
		this.offset++;

	}

	peek():number{
		return this.text.charCodeAt(this.offset);
	}
	createSpanRight(cursor:Cursor){
		return new Span(this.offset,cursor.offset);
	}
	copy(){
		return new Cursor(this.text,this.offset)
	}
}