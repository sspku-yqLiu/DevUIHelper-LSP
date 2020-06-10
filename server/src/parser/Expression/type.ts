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
		public subNodes:ExpressionTreeNode[]=[],
		public times:number=1,
		public id?:string|undefined
	){}
	addSubNode(info:ExpressionTreeNode){
		this.subNodes.push(info);
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