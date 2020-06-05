/*
 * @Author: your name
 * @Date: 2020-06-04 19:26:34
 * @LastEditTime: 2020-06-05 22:04:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\source\Architect.ts
 */
import { RootNode, Component, Directive, Attribute,HTMLInfoNode } from './html_info';
// const info = require('D:\\MyProgram\\Extension_Universe\\WCH-Creater\\info.js');
export class Architect {
	private readonly componentRootNode = new RootNode();
	private readonly directiveRootNode = new RootNode();
	private componentSchema = this.componentRootNode.schema;
	private directiveSchema = this.directiveRootNode.schema;
	private nodeInbuild:Component|Directive|undefined;
	constructor() { }
	build(info: Array<any>): RootNode[] {
		for (let component of info) {
			this.nodeInbuild = undefined;
			let{name,description,tmw,cnName,attrList,directiveFlag} = component;
			if(directiveFlag){
				this.directiveSchema[name] = new Directive(name, description, tmw, cnName);
				this.nodeInbuild = this.directiveSchema[name];
			}else{
				this.componentSchema[name] = new Component(name, description, tmw, cnName);
				this.nodeInbuild = this.componentSchema[name];
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
						ele['valueSet']
					));
				}
			});	
		}
		this.buildCompletionItems();
		return [this.componentRootNode,this.directiveRootNode];
	}
	buildCompletionItems() {
		this.componentRootNode.buildCompletionItems();
		this.directiveRootNode.buildCompletionItems();
	}
	_buildCompletionItems(node: HTMLInfoNode) {
		node.buildNameCompletionItem();
		let subnodes = node.getSubNodes();
		if (subnodes) {
			for (let subnode of subnodes) {
				this._buildCompletionItems(subnode);
			}
		}
		return;

	}
	getRoot(): HTMLInfoNode {
		return this.componentRootNode;
	}
}