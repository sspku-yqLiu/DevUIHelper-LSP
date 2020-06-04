/*
 * @Author: your name
 * @Date: 2020-06-04 19:26:34
 * @LastEditTime: 2020-06-04 22:24:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\source\Architect.ts
 */
import { RootNode, Component, Directive, Attribute,HTMLInfoNode } from './html_info';
const info = require('D:\\MyProgram\\Extension_Universe\\WCH-Creater\\info.js');
export class Architect {
	private readonly rootNode = new RootNode();
	private schema = this.rootNode.schema;
	private prefix = "";
	constructor() { }
	build(info: Array<any>): RootNode {
		for (let component of info) {
			let comName = component['name'];
			let description = component['description'];
			let tmw = component['tmw'];
			let cnName = component['cnName'];
			let _attrList = component['attrList'];
			let directiveFlag= component['directiveFlag'];
			let attrList = [];
			if(!directiveFlag){
				this.schema[comName] = new Component(comName, description, tmw, cnName, _attrList);
			}else{
				this.schema[comName] = new Directive(comName, description, tmw, cnName, _attrList);
			}
			let _com = this.schema[comName];
			_attrList.forEach(ele => {
				_com.addAttritube(new Attribute(ele['name'],
					ele['type'], 
					ele['default'], 
					ele['description'], 
					ele['isNecessary'], 
					ele['isEvent'], 
					ele['valueSet']));
			});

		}
		this.buildCompletionItems();
		return this.rootNode;
	}
	buildCompletionItems() {
		this.rootNode.buildCompletionItems();
		this._buildCompletionItems(this.rootNode);
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
		return this.rootNode;
	}
}