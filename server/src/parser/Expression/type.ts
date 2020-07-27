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
	private base = 0;
	private incrementalFlag = false;
	public content:string[] = [];
	public times:number=1;
	constructor(
		public infoNode:HTMLInfoNode,
		public type:ExpressionNodeType,
		public insertText?:string,
		public attrs:ExpressionTreeNode[][]=[],
		public subCrossTags:ExpressionTreeNode[]= [],
		public subSeqenceTags:ExpressionTreeNode[][]=[],
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
	// if(this.HTMLTags.includes(expression) ){
	// 	let res = new TagComponent(expression)
	// 	return new ExpressionTreeNode(res,ExpressionNodeType.TAG,'<'+res.getCompletionItem().insertText);
	// }
	//添加笛卡尔积式的SubTag
	addCrossSubTag(subTags:ExpressionTreeNode[]){
		this.subCrossTags = subTags;
	}
	addSyncSubTag(subTags:ExpressionTreeNode[]){
		this.times = this.times>subTags.length?this.times:subTags.length;
		subTags.forEach((e,index)=>{
			this.subSeqenceTags[index].push(e);
		});
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
	addContent(content:string[]){
		this.times = this.times>content.length?this.times:content.length;
		this.content = content;
	}
	getContent(index:number){
		if(!this.incrementalFlag){
			if(index>=this.content.length){
				return this.content[this.content.length-1];
			}
			return this.content[index];
		}else{
			return this.content[0].replace('**Inc%%',`${index+this.base}`);
		}
	}
	setIncrementalContent(content:string){
		this.incrementalFlag =true;
		content.match(/\(.*?\)/);
		var result = content.match(/\(([^)]*)\)/);
		this.base = parseInt(result[1]);
		this.content[0] = content.replace(/\(.*?\)/,'**Inc%%');
	}

}
export enum ExpressionNodeType{
	ID,
	CLASS,
	COMPONENTPREFIX,
	DIRECTIVE,
	ELEMENT,
	TAG,
	Attribute,
	TEXT
}
export const testCode = `<div class="card-header">可拖拽项</div>
<div class="card-block">
  <ul class="list-group">
	<li
	  dDraggable
	  *ngFor="let item of list1"
	  [dragScope]="'default-css'"
	  [dragData]="{ item: item, parent: list1 }"
	  class="list-group-item over-flow-ellipsis"
	>
	  {{ item.name }}
	</li>
  </ul>
</div>`;