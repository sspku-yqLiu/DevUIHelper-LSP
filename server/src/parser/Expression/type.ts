import { ExpressionWithTypeArguments } from 'typescript/lib/tsserverlibrary';
import { HTMLInfoNode } from '../WareHouse/Storage';

/*
 * @Author: your name
 * @Date: 2020-06-08 15:53:51
 * @LastEditTime: 2020-06-08 22:26:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\parser\Expression\type.ts
 */ 
export class ExpressionTreeNode{
	constructor(
		public infoNode:HTMLInfoNode,
		public type:ExpressionNodeType,
		public insertText?:string,
		public attrs:ExpressionTreeNode[][]=[],
		public subTag:ExpressionTreeNode[]=[],
		public times:number=1,
		public id?:string|undefined
	){}
	addAttr(attr:ExpressionTreeNode|undefined){
		if(attr)
			this.attrs.push([attr]);
	}
	addAttrs(attrs:ExpressionTreeNode[]){
		this.times = this.times>attrs.length?this.times:attrs.length;
		this.attrs.push(attrs);
	}
	addSubTag(subTag:ExpressionTreeNode){
		this.subTag.push(subTag);
	}
	setInsertText(insertText:string):ExpressionTreeNode{
		this.insertText = insertText;
		return this;
	}
	getAttrOfIndex(index:number):ExpressionTreeNode[]{
		let result : ExpressionTreeNode[] = [];
		this.attrs.forEach(e=>{
			if(index>e.length-1){
				result.push(e[e.length-1]);
			}else{
				result.push(e[index]);
			}
		});
		return result;
	}

}
export enum ExpressionNodeType{
	ID,
	CLASS,
	COMPONENTPREFIX,
	DIRECTIVE,
	ELEMENT,
	TAG,
	Attribute
}