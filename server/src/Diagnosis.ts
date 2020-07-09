import { SupportComponentName } from './parser/type';
import { Directive, TagComponent, Component } from './parser/WareHouse/Storage';
import { host } from './server';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { HTMLAST, HTMLTagAST } from './parser/ast';
import { Diagnostic, DiagnosticSeverity } from 'vscode-languageserver';
import { convertSpanToRange, adjustSpanToAbosulutOffset } from './util';
import { Host } from './Host/Host';

export class Diagnosiser{
	private tagsToComponent= <{[tag:string]:SupportComponentName}>{};
	private directiveToComponent= <{[directive:string]:SupportComponentName}>{};
	private result:Diagnostic[] = [];
	private textDocument:TextDocument;
	constructor(){
	}

	diagnose(textDocument:TextDocument):Diagnostic[]{
		//init
		if(Object.keys(this.tagsToComponent).length===0){
			host.HTMLComoponentSource.getSubNodes().forEach(e=>{
				this.tagsToComponent[e.getName()] = SupportComponentName.DevUI;
			});
			host.HTMLDirectiveSource.getSubNodes().forEach(e=>{
				this.directiveToComponent[e.getName()] = SupportComponentName.DevUI;
			});
		}
		host.errorZone=[];
		this.textDocument = textDocument;	
		this.result= []; 

		//analysis
		this.DFS(host.snapshotMap.get(textDocument.uri).root);
		return this.result;
	}
	DFS(root:HTMLTagAST){
		let _rootSpan = root.nameSpan.clone();
			adjustSpanToAbosulutOffset(root,_rootSpan);
		
		//tag检测
		if(this.tagsToComponent[root.getName()]
			&&!host.igniter.parseOption.components.includes(this.tagsToComponent[root.getName()])){
			this.result.push({
				severity:DiagnosticSeverity.Error,
				range:convertSpanToRange(this.textDocument,_rootSpan),
				message:`似乎您并没有安装DevUI,所以您不能使用：${root.getName()} 标签，请尝试 npm i install ng-devui`,
				source:`DevUIHelper` 
			});
		}
		//指令检测
		let _directives = root.attrList.directive.filter(e=>this.directiveToComponent[e.getName()]
			&&!host.igniter.parseOption.components.includes(this.directiveToComponent[e.getName()]));
		_directives.forEach(e=>{
			let _span = e.getSpan().clone();
			adjustSpanToAbosulutOffset(root,_span);
			this.result.push({
				severity:DiagnosticSeverity.Error,
				range:convertSpanToRange(this.textDocument,_span),
				message:`似乎您并没有安装DevUI,所以您不能使用：${e.getName()} 指令，请尝试 npm i install ng-devui`,
				source:`DevUIHelper` 
			});
		});
		//属性检测
		//TODO: 支持指令的必要属性
		const _info = host.hunter.findHTMLInfoNode(root,this.textDocument.uri);
		let _necessarySet = _info instanceof Component? [..._info.getNecessarySet()]:[];
		root.attrList.attr.forEach(attr=>{
			_necessarySet =  _necessarySet.filter(e=>e!=attr.getName().replace(/\[|\]/g,""));
		});
		if(_necessarySet.length!==0){
			this.result.push({
				severity:DiagnosticSeverity.Error,
				range:convertSpanToRange(this.textDocument,_rootSpan),
				message:`您的标签${root.getName()}缺少[${_necessarySet}]必要属性,请添加后重试`,
				source:`DevUIHelper` 
			});
			host.errorZone.push(_rootSpan);
		}

		let subNodes = root.content.toArray();
		subNodes.forEach(e=>{
			if(e instanceof HTMLTagAST){
				this.DFS(e);
			}
		});
	}
}