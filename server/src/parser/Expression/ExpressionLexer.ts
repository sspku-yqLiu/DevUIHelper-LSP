import { ExpressionTreeNode, ExpressionNodeType } from './type';
import { $$, $PERIOD, $STAR, $LBRACKET, $RBRACKET, $LBRACE, $RBRACE, $HASH } from '../chars';
import { RootNode, Component, TagComponent, Directive, Attribute, HTMLInfoNode } from '../WareHouse/Storage';
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
		if(!expression.match(/\.|\[|\#|\*|\>|\{/)){
			return undefined;
		}
		// if(expression.indexOf('.')===-1){
		// 	return undefined;
		// }
		let startIndex = expression.indexOf('.')+1;
		const prefixName = expression.substring(0,startIndex-1);
		if(this.checkMails(prefixName)){
			return undefined;
		}
		this.comName = getcomNameFromPrefix(prefixName);
		const RealExpression = this.comName?expression.substring(startIndex):expression;
		let subExp:string[] = RealExpression.split('>');
		const NodesQueue:ExpressionTreeNode[] = [];
		subExp.forEach((e,index)=>{
			if(index>0){
				NodesQueue.push(this.divider(e,NodesQueue[index-1]));
			}else{
				return NodesQueue.push(this.divider(e));
			}
		});
		if(NodesQueue.length<1){
			return;
		}else{
			return this.interperate(NodesQueue);
		}
	}
	//这是一个可以被递归调用的分割器，返回一个基于表达式的节点
	divider(expression:string,fatherTag?:ExpressionTreeNode):ExpressionTreeNode|undefined{
		this.rootNode = undefined;this.ErrorFlag = false;
		if(this.ErrorFlag){
			return;
		}
		let start=0;
		let comFlag = false;
		let operater:number = -1,peek =-1;
		for(let i =0;i<expression.length;i++){
			peek =expression.charCodeAt(i);
			if(this.operaters.includes(peek)){
				const fragment =  expression.substring(start,i);
				if(!comFlag){
					//TODO:getTagNode function
					this.rootNode = this.getTagNode(fragment,fatherTag);
					operater = expression.charCodeAt(i);
					if(operater ===$LBRACKET){
						start = i;
						i = expression.indexOf(']')+1;
					}else{
						start = i+1;
					}
					comFlag = true;
					continue;
				}
				if(fragment.length>0){
					this.operate(operater,fragment);
					operater = expression.charCodeAt(i);
				}
				if(expression.charCodeAt(i) ===$LBRACKET){
					start = i;
					i = expression.indexOf(']',start)===-1?expression.length:expression.indexOf(']',start);
				}else{
					start = i+1;
				}
				
			}
		}
		this.operate(operater,expression.substring(start,expression.length));
		this.rootNode = this.rootNode?this.rootNode:this.getTagNode(expression);
		return this.rootNode;
	}
	//匹配规则：nameSelf ->sorDescription -> fatherCom+Prefix -> fatherDir+Prefix -> namePrefix -> htmlTag
	getTagNode(tagName:string,fatherTag?:ExpressionTreeNode):ExpressionTreeNode{
		let tagsource =  host.HTMLComoponentSource;
		let tagNode:Component|undefined;
		if(this.comName){
			 tagNode = tagsource.prefixCut[this.comName][tagName];
			if(!tagNode && fatherTag){
				let tagNameWithFater = fatherTag.infoNode.getName+'-'+tagName;
				tagNode = tagsource.getSubNodes().find(e=>(e.getName().startsWith(tagNameWithFater)));
				if(!tagNode){
					fatherTag.attrs.forEach(e=>{
						if (e[0].type===ExpressionNodeType.DIRECTIVE||!tagNode){
							tagNameWithFater = getTagPrefixFromComName(this.comName)+e[0].infoNode.getName().toLowerCase()+'-'+tagName;
							tagNode = tagsource.getSubNodes().find(e=>(e.getName().startsWith(tagNameWithFater)));
						}
					});
				}
			}
			if(!tagNode){
				let nodes = host.HTMLComoponentSource.prefixSchema[this.comName];
				if(tagName.length>1)
				tagNode =nodes.find(e=>{return e.prefixName.startsWith(tagName);});
			}
		}
		let insertText = tagNode?'<'+tagNode.getCompletionItem().insertText:`<${tagName}>$0</${tagName}>`;
		if(!tagNode){
			tagNode = new TagComponent(tagName);
		}
		return new ExpressionTreeNode(tagNode,ExpressionNodeType.TAG).setInsertText(insertText);
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
			this.getBracket(attrName,true);
			return;
		}
		let result = this.getDirective(attrName);
		return result = result?result:this.getATTR(this.rootNode,attrName);
	}
	getBracket(attrName:string,directiveFlag:boolean){
		attrName = attrName.replace(/\[|\]/g,"");
		let names:string[] = attrName.split(',');
		let nodes:ExpressionTreeNode[] = [];
		names.forEach(e=>{
			let fragments = e.split('.');
			let directiveOrATTRNode:ExpressionTreeNode|undefined;
			if(directiveFlag){
				directiveOrATTRNode = this.getDirective(fragments[0]);
			}
			if(!directiveOrATTRNode||!directiveFlag){
				directiveOrATTRNode = this.getATTR(this.rootNode,fragments[0]);
			}
			if(directiveOrATTRNode&&fragments.length>1){
				fragments.forEach((e,index)=>{
					if(index>0){
						if(directiveOrATTRNode.type === ExpressionNodeType.DIRECTIVE)
							directiveOrATTRNode.addAttr(this.getATTR(directiveOrATTRNode,fragments[index]));
						else if(directiveOrATTRNode.type === ExpressionNodeType.Attribute){
							this.setATTRValue(directiveOrATTRNode,fragments[index]);
						}
					}
				});
			}
			if(directiveOrATTRNode){
				nodes.push(directiveOrATTRNode);
			}
		});
		this.rootNode.addAttrs(nodes);
	}
	getStar(time:string){
		let timenum:number = parseInt(time);
		this.rootNode.times = timenum;
	}
	getHash(id:string){
		this.rootNode.id = id;
	}
	//功能函数

	//匹配规则: sortDescription -> name -> prefix -> suffix
	getDirective(directiveNameOrPrefix:string):ExpressionTreeNode|undefined{
		let result:Component;
		if(directiveNameOrPrefix.length<2){
			return;
		}
		if(this.comName){
			result= host.HTMLDirectiveSource.prefixCut[getTagPrefixFromComName(this.comName,true)+directiveNameOrPrefix];
		}
		result= result?result:host.HTMLDirectiveSource.directivePrefixCut[directiveNameOrPrefix];
		result = result?result: this.getBestChoice<Component>(Object.values(host.HTMLDirectiveSource.getSchema()),
		[
			(e,outcome)=>(outcome==directiveNameOrPrefix),
			(e,outcome)=>(e.prefixName===directiveNameOrPrefix),
			(e,outcome)=>(outcome.startsWith(directiveNameOrPrefix)),
			(e,outcome)=>(e.prefixName.startsWith(directiveNameOrPrefix)),
			(e,outcome)=>(outcome.endsWith(directiveNameOrPrefix)),
			(e,outcome)=>(e.prefixName.endsWith(directiveNameOrPrefix)),
		],ExpressionNodeType.DIRECTIVE,
		(e:HTMLInfoNode)=>(e.getName().toLowerCase()));
		return result?new ExpressionTreeNode(result,ExpressionNodeType.DIRECTIVE).setInsertText(result.getCompletionItem().insertText):undefined;
	}

	//优先级 sortDescription -> prefix -> suffix -> name
	//如果写的正好满足name,则name优先
	getATTR(node:ExpressionTreeNode,nameOrPrefix:string):ExpressionTreeNode|undefined{
		let {infoNode} = node;
		let attrNode:ExpressionTreeNode|undefined=undefined;

		if(!(infoNode instanceof Component)){
			this.ErrorFlag =true;
			throw Error(`get attribute from ${node.infoNode.getName()}`);
		}else if(nameOrPrefix.length>1){
			attrNode = this.getAttrFromValue(infoNode,nameOrPrefix);
			if(!attrNode){
				attrNode = this.getAttrFromName(infoNode,nameOrPrefix);
			}
		}
		if(!attrNode){
			attrNode = new ExpressionTreeNode(new Attribute(nameOrPrefix),ExpressionNodeType.Attribute,`class="${nameOrPrefix}"`);
		}
		return attrNode;
	}
	setATTRValue(node:ExpressionTreeNode,value:string):ExpressionTreeNode{
		if(node.infoNode instanceof Attribute){
			let result = new ExpressionTreeNode(node.infoNode,ExpressionNodeType.Attribute);
			let _insertText = node.infoNode.getCompletionItem().insertText.replace('$1',value);
			return result.setInsertText(_insertText);
		}

	}
	getAttrFromValue(infoNode:Component,nameOrPrefix:string):ExpressionTreeNode|undefined{
		let prefixToValue = infoNode.getPrefixToValue();
		let attrNode = prefixToValue[nameOrPrefix];
		let valueName=nameOrPrefix;
		if(!attrNode){
			valueName = Object.keys(prefixToValue).find(e=>e.startsWith(nameOrPrefix));
			valueName = valueName?valueName:Object.keys(prefixToValue).find(e=>e.endsWith(nameOrPrefix));
			attrNode = valueName?prefixToValue[valueName]:undefined;
		}
		let insertText = attrNode?attrNode.getCompletionItem().insertText.replace(/\$\{(\s|\S)*\}/g,`'${valueName}'`):"";
		return attrNode?new ExpressionTreeNode(attrNode,ExpressionNodeType.Attribute).setInsertText(insertText):undefined;
	}
	getAttrFromName(infoNode:Component , nameOrPrefix:string):ExpressionTreeNode|undefined{
		let attrs = <{[rank:number]:Attribute[]}>{};
		attrs[1]=[];attrs[2]=[];attrs[3]=[];
		infoNode.getSubNodes().forEach(e=>{
			let attrName = e.getName().toLowerCase();
			if(attrName==nameOrPrefix){
				attrs[1].push(e);
			}
			else if(attrName.startsWith(nameOrPrefix)){
				attrs[2].push(e);
			}else if(attrName.endsWith(nameOrPrefix)){
				attrs[3].push(e);
			}
		});
		let attrNode = attrs[1].length===0?(attrs[2].length===0?(attrs[3].length===0?undefined:attrs[3][0]):attrs[2][0]):attrs[1][0];
		return attrNode?new ExpressionTreeNode(attrNode,ExpressionNodeType.Attribute).setInsertText(attrNode.getCompletionItem().insertText):undefined;
	}
	operate(operater:number,fragment:string){
		switch(operater){
			case $PERIOD:{
				this.rootNode.addAttr(this.getPeriod(fragment));break;
			}
			case $STAR:{
				this.getStar(fragment);break;
			}
			case $HASH:{
				this.getHash(fragment);break;
			}
			case $LBRACKET:{
				this.getBracket(fragment,false);break;
			}
		}
	}
	interperate(nodes:ExpressionTreeNode[]):string{
		let _insertText = "$0";
		nodes.forEach((e,index)=>{
			let endFlag = index === nodes.length-1;
			let retract = '';
			while(index>0){
				retract+='\t';
				index--;
			}
			_insertText = _insertText.replace(/\$0/g,this._interperate(e,retract,endFlag));
		});
		return _insertText;
	}
	_interperate(node:ExpressionTreeNode,retract:string,endFlag:boolean):string{
		let _insertText:string = node.insertText;
		let startStr = _insertText.slice(0,_insertText.indexOf('$0')-1).replace(/\n|\r|\n\r/g,' ');
		let endStr = _insertText.slice(_insertText.indexOf('$0')-1).replace(/\n|\r|\n\r/g,' ');
		if(!endFlag){
			endStr ='>\n$0\n'+retract+endStr.slice(3);
		}
		let attrString:string[] = [];
		if(node.id){
			attrString.push(`id="${node.id}"`);
		}
		let result:string[] = [];
		for (let i = 0; i < node.times; i++) {
			const attrs = node.getAttrOfIndex(i);
			attrString = [];
			attrs.forEach(e=>{
				attrString.push(e.insertText);
				if(e.type === ExpressionNodeType.DIRECTIVE){
					e.attrs.forEach(ele=>{
						let dirAttrs = e.getAttrOfIndex(i);
						attrString.push(dirAttrs[0].insertText);
					});
				}
	
			});
			result.push(retract+startStr+' '+attrString.join(' ')+endStr);
		}
		return result.join('\n');
	}
	getBestChoice<T>(source:T[],fun:((e:T,outcome?:string)=>boolean)[],type:ExpressionNodeType,prefun?:(e:T)=>string):T|undefined{
		let res = <{[rank:number]:T[]}>{};
		for (let i = 1; i <=fun.length; i++) {
			res[i]=[];
		}
		try{
			source.forEach(e=>{
				if(res[1].length<1){
					fun.forEach((f,index)=>{
						let outcome = prefun(e);
						if(f(e,outcome)){
							res[index].push(e);
						}
					});
				}else{
					throw new Error();
				}
	
			});
		}catch{}
		let _result:T|undefined = undefined;
		for (let i = 1; i <= fun.length; i++) {
			if(!_result){
				_result = res[i][0]?res[i][0]:undefined;
			}
		}
		return _result;
	}
	isHTMLInfoNode(node:any):node is HTMLInfoNode{
		if(node.getCompletionItem()!==undefined){
			return true;
		}
		return false;
	}
	checkMails(s:string){
		let Mails= ['qq','163','foxmail','outlook','126',''];
		if(Mails.includes(s)){
			return true;
		}
		return false;
	}
}