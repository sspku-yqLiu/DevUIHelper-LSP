/*
 * @Author: your name
 * @Date: 2020-05-12 14:52:22
 * @LastEditTime: 2020-06-08 15:51:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP V4.0\server\src\GlobalData\GlobalData.ts
 */
import { ParseOption, TreeError } from '../yq-Parser/type';
import { HTMLAST, HTMLTagAST } from '../yq-Parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { HTMLInfoNode, RootNode } from '../WareHouse/Storage';
import { YQ_Parser } from '../yq-Parser/parser';
import { HoverProvider } from '../../HoverProvider';
import { TextDocuments } from 'vscode-languageserver';
import { CompletionProvider } from '../../CompletionProvider';
import { Architect } from '../WareHouse/Architect';
import { Hunter } from './Hunter';
import { Igniter } from './Igniter';
import { ExpressionAdm } from '../Expression/ExpressionAdm';
import { Diagnosiser } from '../../Diagnosis';
import { Span } from '../DataStructure/type';

export class Host {
	public parser = new YQ_Parser();
	public hunter = new Hunter();
	public igniter = new Igniter();
	public snapshotMap = new Map<string, SnapShot>();
	public hoverProvider = new HoverProvider();
	public completionProvider = new CompletionProvider();
	public documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
	public expressionAdm:ExpressionAdm = new ExpressionAdm(['d']);
	public architect = new Architect();
	public HTMLComoponentSource = new RootNode();
	public HTMLDirectiveSource = new RootNode();
	public diagnoser = new Diagnosiser();
	public configuration={provideHover:true};
	public errorZone:Span[] = [];
	private parseOption: ParseOption | undefined;
	constructor() {
		this.documents.onDidChangeContent(change => {
			if (this.parseOption)
				this.igniter.parseTextDocument(change.document, this.parseOption);
		});
	}

	getDocumentFromURI(uri: string): TextDocument {
		let _result = this.documents.get(uri);
		if (!_result) {
			throw Error(`Cannot get file from uri ${uri}`);
		}
		return _result;
	}
	getSnapShotFromURI(uri: string): SnapShot {
		let _result = this.snapshotMap.get(uri);
		if (!_result) {
			throw Error(`Cannot get snapShot from uri ${uri}`);
		}
		return _result;
	}
	setParseOption(parseOption: ParseOption) {
		this.parseOption = parseOption;
	}

}

export class Agent {

}

export class SnapShot {
	public HTMLAstToHTMLInfoNode = new Map<HTMLAST, HTMLInfoNode>();
	public context: string = "";
	constructor(
		public root: HTMLTagAST,
		public errors: TreeError[],
		public textDocument: TextDocument,
	) {
		this.context = this.textDocument.getText();
	}
}