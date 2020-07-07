import { SupportComponentName } from './parser/type';
import { Directive } from './parser/WareHouse/Storage';
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
		this.textDocument = textDocument;	
		this.result= []; 

		//analysis
		this.DFS(host.snapshotMap.get(textDocument.uri).root);
		return this.result;
	}
	DFS(root:HTMLTagAST){
		if(this.tagsToComponent[root.getName()]
			&&!host.igniter.parseOption.components.includes(this.tagsToComponent[root.getName()])){
			let _span = root.nameSpan.clone();
			adjustSpanToAbosulutOffset(root,_span);
			this.result.push({
				severity:DiagnosticSeverity.Error,
				range:convertSpanToRange(this.textDocument,_span),
				message:`似乎您并没有安装DevUI,所以您不能使用：${root.getName()} 标签，请尝试 npm i install ng-devui`,
				source:`DevUIHelper` 
			});
		}
		let _directives = root.attrList.directive.filter(e=>this.directiveToComponent[e.getName()]
			&&!host.igniter.parseOption.components.includes(this.directiveToComponent[e.getName()]));
		_directives.forEach(e=>{
			let _span = root.getSpan().clone();
			adjustSpanToAbosulutOffset(root,_span);
			this.result.push({
				severity:DiagnosticSeverity.Error,
				range:convertSpanToRange(this.textDocument,_span),
				message:`似乎您并没有安装DevUI,所以您不能使用：${e.getName()} 指令，请尝试 npm i install ng-devui`,
				source:`DevUIHelper` 
			});
		});
		let subNodes = root.content.toArray();
		subNodes.forEach(e=>{
			if(e instanceof HTMLTagAST){
				this.DFS(e);
			}
		});
	}
}