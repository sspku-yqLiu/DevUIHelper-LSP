import { ExpressionTreeNode, ExpressionNodeType } from './type';
import { $$, $PERIOD, $STAR, $LBRACKET, $RBRACKET, $LBRACE, $RBRACE, $HASH } from '../chars';
import { RootNode, Component, TagComponent, Directive, Attribute } from '../WareHouse/Storage';
import { host } from '../../server';
import { SupportComponentName } from '../type';
import { getcomNameFromPrefix, getTagPrefixFromComName } from '../WareHouse/util';

export class ExpresssionLexer{
	private operaters = [$STAR,$PERIOD,$LBRACKET,$HASH];
	private rootNode:ExpressionTreeNode|undefined;
	private ErrorFlag = false;
	private comName:SupportComponentName|undefined;
	constructor(){
		this.rootNode=undefined;
	}
	parse(expression:string,prefixSet?:string[]):string|undefined{
		if(!expression.match(/\.|\[|\#|\*/)){
			return undefined;
		}
		let startIndex = expression.indexOf('.')+1;
		const prefixName = expression.substring(0,startIndex-1);
		this.comName = getcomNameFromPrefix(prefixName);
		const RealExpression = this.comName?expression.substring(startIndex):expression;
		let subExp:string[] = RealExpression.split('>');
		const NodesQueue:ExpressionTreeNode[] = subExp.map(e=>this.divider(e));
	}
	//这是一个可以被递归调用的分割器，返回一个基于表达式的节点
	divider(expression:string,fatherTag?:ExpressionNodeType):ExpressionTreeNode|undefined{
		this.rootNode = undefined;
		if(this.ErrorFlag){
			return;
		}
		if(expression.indexOf('.')===-1){
			return this.rootNode;
		}
		let end =0, start=0;
		let comFlag = false;
		let operater:number = -1,peek =-1;
		for(let i =0;i<expression.length;i++){
			peek =expression.charCodeAt(i);
			if( expression.charCodeAt(start)===$LBRACKET){
				end = i = expression.indexOf(']');
			}
			if(this.operaters.includes(peek)){
				const fragment =  expression.substring(start,end);
				if(!comFlag){
					//TODO:getTagNode function
					this.rootNode = this.getTagNode(fragment);
					operater = expression.charCodeAt(i);
					start = end = ++i;
					continue;
				}
				this.operate(operater,fragment);
				operater = expression.charCodeAt(i);
				start = end = i++;
			}
			end++;
		}
		this.operate(operater,expression.substring(start,expression.length));
		return this.rootNode;
	}
	//匹配规则：nameSelf ->sorDescription -> fatherCom+Prefix -> fatherDir+Prefix -> namePrefix -> htmlTag
	getTagNode(tagName:string,fatherTag?:ExpressionTreeNode):ExpressionTreeNode{
		let tagsource =  host.HTMLComoponentSource;
		if(this.comName){
			let tagNode:Component|undefined = tagsource.prefixCut[this.comName][tagName];
			if(!tagNode && fatherTag){
				let tagNameWithFater = fatherTag.infoNode.getName+'-'+tagName;
				tagNode = tagsource.getSubNodes().find(e=>(e.getName().startsWith(tagNameWithFater)));
				if(!tagNode){
					fatherTag.subNodes.forEach(e=>{
						if (e.type===ExpressionNodeType.DIRECTIVE||!tagNode){
							tagNameWithFater = getTagPrefixFromComName(this.comName)+e.infoNode.getName().toLowerCase()+'-'+tagName;
							tagNode = tagsource.getSubNodes().find(e=>(e.getName().startsWith(tagNameWithFater)));
						}
					});
				}
			}
			if(!tagNode){
				let nodes = host.HTMLComoponentSource.prefixSchema[this.comName];
				tagNode =nodes.find(e=>{return e.prefixName.startsWith(tagName);});
			}
			if(!tagNode){
				tagNode = new TagComponent(tagName);
			}
			return new ExpressionTreeNode(tagNode,ExpressionNodeType.TAG);
		}else{
			return new ExpressionTreeNode(new TagComponent(tagName),ExpressionNodeType.TAG);
		} 
	}
	//分为两种：
	//.[directive.value] 指令及其属性 指令/属性全名->属性简写->属性prefix/
	//.属性值 -> 指令 -> 属性值 -> class 
	getPeriod(attrName:string):ExpressionTreeNode{
		let {type,infoNode } = this.rootNode;
		if(type!==ExpressionNodeType.TAG){
			return;
		}
		//检测是否满足[...]样式：
		if(attrName.match(/\[(\S*)\]/)){
			attrName = attrName.replace(/\[|\]/g,"");
			let fragments = attrName.split('.');
			let directiveOrATTRNode:ExpressionTreeNode = this.getDirective(fragments[0]);
			if(directiveOrATTRNode&&fragments.length>1){
				fragments.forEach((e,index)=>{
					if(index>1){
						directiveOrATTRNode.addSubNode(this.getATTR(directiveOrATTRNode,fragments[index]));
					}
				});
			}
			if(!directiveOrATTRNode){
				directiveOrATTRNode = directiveOrATTRNode?directiveOrATTRNode:this.getATTR(this.rootNode,fragments[0]);
			}
			return directiveOrATTRNode;
		}
		//如果不是，我们认为它应该是属性的值，进入属性值匹配
		return this.getATTR(this.rootNode,attrName);
	}
	getBracket(attrName:string){
		this.rootNode.addSubNode(this.getATTR(this.rootNode,attrName));
	}
	getStar(time:string){
		let timenum:number = parseInt(time);
		this.rootNode.times = timenum;
	}
	getHash(id:string){
		this.rootNode.id = id;
	}
	//功能函数

	//匹配规则: sortDescription -> prefix -> name
	getDirective(directiveNameOrPrefix:string):ExpressionTreeNode|undefined{
		let result:Component;
		if(this.comName){
			result= host.HTMLDirectiveSource.prefixCut[this.comName][directiveNameOrPrefix];
		}
		if(!result){
			let results:Component[] = Object.values(host.HTMLDirectiveSource.getSchema()).filter(e=>{
				return e.getName().startsWith(directiveNameOrPrefix)||e.prefixName.startsWith(directiveNameOrPrefix);
			});
			if(!results){
				return undefined;
			}
			result = results.find(e=>{return e.getName().startsWith(directiveNameOrPrefix);});
			if(!result){
				result = results.find(e=>{return e.prefixName.startsWith(directiveNameOrPrefix);});
			}
		}
		return new ExpressionTreeNode(result,ExpressionNodeType.DIRECTIVE);
	}

	//优先级 sortDescription -> prefix -> suffix -> name
	//如果写的正好满足name,则name优先
	getATTR(node:ExpressionTreeNode,nameOrPrefix:string):ExpressionTreeNode|undefined{
		let {infoNode} = node;
		let attrNode:ExpressionTreeNode|undefined;
		if(!(infoNode instanceof Component)){
			this.ErrorFlag =true;
			throw Error(`get attribute from ${node.infoNode.getName()}`);
		}else{
			attrNode = this.getAttrFromValue(infoNode,nameOrPrefix);
			if(!attrNode){
				attrNode = this.getAttrFromName(infoNode,nameOrPrefix);
			}
		}
		return attrNode;

	}
	getAttrFromValue(infoNode:Component,nameOrPrefix:string):ExpressionTreeNode|undefined{
		let prefixToValue = infoNode.getPrefixToValue();
		let attrNode = prefixToValue[nameOrPrefix];
		if(!attrNode){
			let valueName = Object.keys(prefixToValue).find(e=>e.startsWith(nameOrPrefix));
			valueName = valueName?valueName:Object.keys(prefixToValue).find(e=>e.endsWith(nameOrPrefix));
			attrNode = valueName?prefixToValue[valueName]:undefined;
		}
		return attrNode?new ExpressionTreeNode(attrNode,ExpressionNodeType.Attribute):undefined;
	}
	getAttrFromName(infoNode:Component , nameOrPrefix:string):ExpressionTreeNode|undefined{
		let attrs = <{[rank:number]:Attribute[]}>{};
		infoNode.getSubNodes().forEach(e=>{
			let attrName = e.getName();
			if(attrName==nameOrPrefix){
				attrs[0].push(e);
			}
			else if(attrName.startsWith(nameOrPrefix)){
				attrs[1].push(e);
			}else if(attrName.endsWith(nameOrPrefix)){
				attrs[2].push(e);
			}
		});
		let attrNode = attrs[0]!==[]?attrs[0][0]:attrs[1]!==[]?attrs[1][0]:attrs[2]!==[]?attrs[2][0]:undefined;
		return attrNode?new ExpressionTreeNode(attrNode,ExpressionNodeType.Attribute):undefined;
	}
	operate(operater:number,fragment:string){
		switch(operater){
			case $PERIOD:{
				this.getPeriod(fragment);
			}
			case $STAR:{
				this.getPeriod(fragment);
			}
			case $HASH:{
				this.getHash(fragment);
			}
			case $LBRACKET:{
				this.getBracket(fragment);
			}
		}
	}
}