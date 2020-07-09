/**
 * @license
 * Some of this lexerCode is from Angular/complier. 
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Span} from '../DataStructure/type';
import {TokenType} from './type';
import { TextDocument } from 'vscode-languageserver-textdocument';
import * as chars from './chars';
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
	public getstartLabel() : string {
		return this._startLabel;
	}
	public setstartLabel(v : string) {
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
	private content:string;
	constructor(
		private textDocument:TextDocument,
		private start:number=0,
		private end:number = textDocument.getText().length
	){
		this.content = textDocument.getText();
		this.cursor = new Cursor(this.content,start,end);		
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
						this.buildClosedTag();
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
		this.startToken(TokenType.EOF);
		this.buildToken();
		// ALERT:这仅用于测试！，发行版请去掉以下内容，否则将严重影响性能！
		// this.result.forEach(token=>{
		// 	// logger.debug(this.content.substring(token.getSpan()!.start,token.getSpan()!.end+1));
		// 	if(token.value){
		// 		logger.debug(token.value);
		// 		logger.debug(token.getType().toString());
		// 	}
		// });
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
		return false;
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
			if([2,3,6,7,8,10].indexOf(this._tokenInBuild.getType())!==-1){
				this._tokenInBuild.value = this.content.substring(this._tokenInBuild.getSpan().start,this._tokenInBuild.getSpan().end+1);
			}
			// else if(this._tokenInBuild.getType()===TokenType.CLOSED_TAG){
			// 	this._tokenInBuild.value = this.content.substring(this._tokenInBuild.getSpan().start+2,this._tokenInBuild.getSpan().end).replace(" ","");
			// }
			this.result.push(this._tokenInBuild);
			if(this._tokenInBuild.getType()===TokenType.TAG_NAME){
				if(this._tokenInBuild.value=="script"){
					const _relocation = this.content.indexOf("</script",this.cursor.offset)?this.content.indexOf("</script",this.cursor.offset):this.end;
					this.cursor.relocate(_relocation);
				}else if(this._tokenInBuild.value=="style"){
					const _relocation = this.content.indexOf("</style",this.cursor.offset)?this.content.indexOf("</style",this.cursor.offset):this.end;
					this.cursor.relocate(_relocation);
				}
			}
			//AlERT:DEbug用，发行版应删除
			// if(this._tokenInBuild.getType()===TokenType.TAG_NAME){
			// 	logger.debug(`Start at ${rangeStartToString(this.textDocument.positionAt( this._tokenInBuild.getSpan().start))  } 
			// 	offset：${this._tokenInBuild.getSpan().start} TokenValue: ${this._tokenInBuild.value} Token Type:${this._tokenInBuild.getType()}`);
			// }
			// if(this._tokenInBuild.getType()===TokenType.TAG_END_NAME){
			// 	logger.debug(`BuildTOken at ${rangeStartToString(this.textDocument.positionAt( this._tokenInBuild.getSpan().start))  } 
			// 	offset：${this._tokenInBuild.getSpan().start} TokenValue: ${this._tokenInBuild.value} Token Type:${this._tokenInBuild.getType()}`);
			// }
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
			this.buildATTROrEndToken();
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
			while(!this.buildATTROrEndToken()){}
		}

	}

	buildClosedTag(){
		this._tokenInBuild?.setType(TokenType.CLOSED_TAG);
		this.buildToken();
		this.startToken(TokenType.TAG_END_NAME);
		if(this.tryStopbyFilter([chars.$GT],chars.WhiteCharsAndLT)){
			this.buildToken();
			this.startToken(TokenType.TAG_END);
		}
		else{
			this.buildToken();
			return;
		}

		this.cursor.advance();
		this.buildToken();
		this.buildToken();
	}

	buildATTROrEndToken(){
		if(this.cursor.peek() === chars.$LT){
			return true;
		}
		if([chars.$GT,chars.$SLASH].indexOf(this.cursor.peek())!==-1){
			this.buildTagSelfClosedToken();
			return true;
		}else if(chars.WhiteChars.indexOf(this.cursor.peek())!==-1){
			this.cursor.advance();
		}else{
			this.buildATTRToken();
		}
		return false;
	}

	buildTagSelfClosedToken(){
		this.buildToken();
		if(this.cursor.peek()===chars.$GT){
			this.startToken(TokenType.TAG_END);
			this.cursor.advance();
		}else if(this.cursor.peek() === chars.$LT){
			return;
		}
		else if(this.cursor.peek() === chars.$SLASH ){
			this.startToken(TokenType.TAG_SELF_END);
			this.cursor.advance();
			if(!this.tryGet(chars.$GT)){
				throw Error(`this / does not have a > follw!`);
			}
		}
		this.buildToken();
	}
	buildATTRToken(){
		if(chars.WhiteCharsAndGTAndSPLASH.indexOf(this.cursor.peek())!==-1){
			return;
		}	
		if(this.cursor.peek()===chars.$HASH){
			this.startToken(TokenType.TEMPLATE);
		}else{
			this.startToken(TokenType.ATTR_NAME);
		}
		if(this.tryStopbyFilter([chars.$EQ],[chars.$GT,chars.$SLASH,chars.$LT,...chars.WhiteChars])){
			this.buildToken();
		}else{
			this.buildToken();
			return;
		}
		 
		this.startToken(TokenType.ATTR_VALUE_START);
		this.cursor.advance();
		let _QtToken =34|39;
		if(this.tryStopbyFilter([chars.$DQ,chars.$SQ],[chars.$GT,chars.$SLASH,chars.$LT])){
			_QtToken = this.cursor.peek();
			this.cursor.advance();
			this.buildToken();
		}else{
			this.buildToken();
			return;
		}
		this.startToken(TokenType.ATTR_VALUE);
		this.tryStopAt([_QtToken]);
		this.buildToken();

		this.startToken(TokenType.ATTR_VALE_END);
		this.cursor.advance();			
		this.buildToken();
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
	private peekvalue = -1;
	constructor(
		private text:string,
		public offset:number=0,
		private EOF:number=text.length
	){
		this.peekvalue = text.charCodeAt(offset);
	}
	getoffset(){return this.offset;}
	advance():void{
		let peek = this.peek();
		if(peek===chars.$BACKSLASH){
			this.offset++;
		}
		this.offset++;
		if(this.offset >=this.EOF){
			throw Error(`Char At EOF At ${this.offset}`);
		}
		this.peekvalue = this.text.charCodeAt(this.offset);
	}  
	relocate(offset:number){
		this.offset = offset;
		this.peekvalue = this.text.charCodeAt(offset);
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
	getText(){
		return this.text;
	}


	/**
	 * TODO:Try家族 将会被移动到指针类中
	 * 这样可以方便表达式与解析器复用，并且为react进行进一步的帮助
	 */
	 //注意这里有指针移动
	tryGet(char:number){
		if(this.peek() === char){
			this.advance();
			return true;
		}
		return false;
	}
	tryAdvanceThrogh(chars:number[]):number{
		while(chars.includes(this.peek())){
			this.advance();
		}
		return this.peekvalue;
	}

	tryStopAt(chars:number[]):number{

		// if(this._tokenInBuild){
		// 	if([TokenType.ATTR_NAME,TokenType.ATTR_VALUE])
		// }
		while(!chars.includes(this.peek())){
			this.advance();
		}
		return this.peekvalue;
	}

	//将返回一个数值，数值是被截断处的peekvalue
	//如果是favor，将返回peekvalue，如果是disgust，将返回peekvalue*-1
	tryStopbyFilter(favor:number[],disgust:number[]):number{
		while(!disgust.includes(this.peek())&&!favor.includes(this.peek())){
			this.advance();
		}
		//如果是被喜欢的字符截断
		if(favor.includes(this.peek())){
			return this.peekvalue;
		}
		//如果是被不应该出现的字符截断
		else if(disgust.includes(this.peek())){
			return this.peekvalue*-1;
		}
	}

	//这个地方可能有点绕
	//返回的是是否有截断代码，如果是0的话就是没有截断代码
	//注意传入的点必须是left,否则会陷入死循环。
	tryStopByPairs(left:number,right:number,breakOperators:number[] = []):number{
		let stackLength = 0;
		while(!breakOperators.includes(this.peekvalue)||this.offset<this.EOF){
			if(this.peekvalue===left){
				stackLength++;
			}else if(this.peekvalue === right){
				stackLength--;
			}
			if(stackLength ===0){
				return 0;
			}
			this.advance();
		}
		return stackLength===0?0:this.peekvalue;
	}
	tryAdvanceThroughBrackets(){
		let brackets = {};
	}
	/**
	 * 双指针协同
	 */
	getContentEndOf(endCursor:Cursor){
		return this.text.substring(this.offset,endCursor.offset);
	}
}