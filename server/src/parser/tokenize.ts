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
				const start = this._cursor.copy();
				this.startToken(TokenType.ELEMENT_START)

				this.tryStopAt([chars.$GT,...chars.WhiteChars]);

				/*结束ELEMENT_START */

				this.buildToken();
				/*开始属性ATTR */
				while(this._cursor.peek()!==chars.$GT){
					if(this._cursor.peek() in chars.WhiteChars){
						this.tryAdvanceThrogh(chars.WhiteChars);
						/**
						 * #开头类型(内属性)
						 */
						if(this._cursor.peek() === chars.$HASH){
							this.startToken(TokenType.INNER_ATTR);
							this.tryStopAt([chars.$GT,...chars.WhiteChars]);
							this.buildToken();
							// this._tokenInBuild.build(this._cursor.getoffset()-1);
						/**
						 * 普通属性
						 */
						}else if(this._cursor.peek() !== chars.$GT){

							this.startToken(TokenType.ATTR_NAME);
							this.tryStopAt([chars.$EQ]);
							this.buildToken();
							/* 找到两个引号之间的东西 */
							this.tryStopAt([chars.$EQ]);
							this.startToken(TokenType.ATTR_VALUE);
							this._cursor.advance();
							this.tryStopAt([chars.$EQ]);
							this._cursor.advance();
							this.buildToken();
						}
					}
				}

				/*加入ELEMENT_END */
				if(this._cursor.peek() === chars.$GT){
					this.startToken(TokenType.ELEMENT_END);
					this.buildToken();
				}
				logger.debug(`we are at ${this._cursor.getoffset()}`)
				this._cursor = new Cursor(this.text,this.text.indexOf(this.tokenizeOption.startLabel,this._cursor.getoffset()));
			}
		}catch{
			this.buildToken();
		}
		this.result.forEach(token=>{
			logger.debug(this.text.substring(token.getSpan()!.start,token.getSpan()!.end));
			const textString = this.text.substring(token.getSpan()!.start,token.getSpan()!.end);
			logger.debug(token.getType().toString());
		})
		return this.result;
	}

	tryAdvanceThrogh(chars:number[]){
		if( this._cursor.peek() in chars){
			this._cursor.advance();
		}
		return;
	}

	tryStopAt(chars:number[]){
		while(! (this._cursor.peek() in chars)){
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