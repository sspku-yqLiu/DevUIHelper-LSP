/*
 * @Author: your name
 * @Date: 2020-05-10 11:47:06
 * @LastEditTime: 2020-05-12 16:34:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \UI_Components_Helper\server\src\DataStructor\tytpe.ts
 */
export class Span{
	/**
	 * 开始的和结束范围,使用offset进行标注
	 */
	constructor(
		public start:number,
		public end:number
	){}
	build(end:number){
		this.end = end;
	}
	inSpan(offset:number):boolean {
		if(!this.end){
			return false;
		}
		if(offset>=this.start&&offset<=this.end){return true;}
		return false;
	}
	inCompletionSpan(offset:number):boolean{
		if(!this.end){
			return false;
		}
		if(offset>=this.start&&offset<=this.end+1){return true;}
		return false;
	}
	shift(offset:number,directive:boolean):Span{
		if(directive){
			this.start+=offset;
			this.end+=offset;
		}else{
			this.start-=offset;
			this.end-=offset;
		}
		return this;
	}
	toJSON = ()=>{
		return `[start:${this.start} end:${this.end}]`;
	}
	clone():Span{
		return new Span(this.start,this.end);
	}
}