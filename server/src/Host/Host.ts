/*
 * @Author: your name
 * @Date: 2020-05-12 14:52:22
 * @LastEditTime: 2020-06-05 21:00:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP V4.0\server\src\GlobalData\GlobalData.ts
 */
import { SearchResult, ParseOption, TreeError, SearchResultType, SupportFrameName, SupportComponentNames } from '../parser/type';
import { HTMLAST, HTMLTagAST } from '../parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { host, logger } from '../server';
import { HTMLInfoNode, Attribute, RootNode } from '../source/html_info';
import { YQ_Parser, SearchParser } from '../parser/parser';
import { HoverProvider } from '../HoverProvider';
import { TextDocuments, Logger } from 'vscode-languageserver';
import { convertStringToName, adjustSpanToAbosulutOffset } from '../util';
import { CompletionProvider } from '../CompletionProvider';
import * as fs from 'fs';
import { Architect } from '../source/Architect';
import { Hunter } from './Hunter';
import { Igniter } from './Igniter';

export class Host {
	public parser = new YQ_Parser();
	public hunter = new Hunter();
	public igniter = new Igniter();
	public snapshotMap = new Map<string, SnapShot>();
	public hoverProvider = new HoverProvider();
	public completionProvider = new CompletionProvider();
	public documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

	public architect = new Architect();
	public HTMLComoponentSource = new RootNode();
	public HTMLDirectiveSource = new RootNode();
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
		public root: HTMLAST,
		public errors: TreeError[],
		public textDocument: TextDocument,
	) {
		this.context = this.textDocument.getText();
	}
}