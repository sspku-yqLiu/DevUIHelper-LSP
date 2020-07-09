/*
 * @Author: your name
 * @Date: 2020-06-04 19:26:34
 * @LastEditTime: 2020-06-08 22:34:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\source\Architect.ts
 */
import { RootNode, Component, Directive, Attribute,HTMLInfoNode, TagComponent } from './Storage';
import { SupportComponentName } from '../yq-Parser/type';
import { getPrefix } from './util';
// const info = require('D:\\MyProgram\\Extension_Universe\\WCH-Creater\\info.js');
export class Architect {
	private readonly componentRootNode = new RootNode();
	private readonly directiveRootNode = new RootNode();
	// private componentSchema = this.componentRootNode.schema;
	// private directiveSchema = this.directiveRootNode.schema;
	private nodeInbuild:Component|undefined;
	constructor() { }
	 build(info: Array<any>,comName:SupportComponentName): RootNode[] {
		for (let component of info) {
			this.nodeInbuild = undefined;
			let{name,description,tmw,cnName,attrList,directiveFlag} = component;
			name = name.toString();
			let tempPrefix = getPrefix(name,comName);
			if(directiveFlag){
				this.nodeInbuild  = new Directive(name,comName, description, tmw, cnName,name.substring(1).toLowerCase());
				this.directiveRootNode.addComponentOrDirectives(this.nodeInbuild,tempPrefix,comName);
			}else{
				this.nodeInbuild = new TagComponent(name, comName,description, tmw, cnName,name.substring(2).toLowerCase());
				this.componentRootNode.addComponentOrDirectives(this.nodeInbuild,tempPrefix,comName);
			}
			attrList.forEach(ele => {
				if (ele['name']==this.nodeInbuild.getName()&&this.nodeInbuild instanceof Directive){
					this.nodeInbuild.setHasValueFlag();
				}
				else if(!this.nodeInbuild.getSubNode(ele['name'])){
					this.nodeInbuild.addAttritube(new Attribute(
						ele['name'],
						ele['type'], 
						ele['default'], 
						ele['description'], 
						ele['isNecessary'], 
						ele['isEvent'], 
						ele['valueSet'],
						this.nodeInbuild
					));
				}
			});	
		}
		this.buildCompletionItems();
		return [this.componentRootNode,this.directiveRootNode];
	}
	buildCompletionItems() {
		this.componentRootNode.buildCompletionItemsAndHoverInfo();
		this.directiveRootNode.buildCompletionItemsAndHoverInfo();
	}
	// _buildCompletionItems(node: HTMLInfoNode) {
	// 	node.buildNameCompletionItem();
	// 	let subnodes = node.getSubNodes();
	// 	if (subnodes) {
	// 		for (let subnode of subnodes) {
	// 			this._buildCompletionItems(subnode);
	// 		}
	// 	}
	// 	return;

	// }
	getRoot(): HTMLInfoNode {
		return this.componentRootNode;
	}
}