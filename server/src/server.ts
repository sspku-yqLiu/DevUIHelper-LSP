/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import{configure,getLogger} from 'log4js'
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentChangeEvent,
	Proposed,
	TextDocumentSyncKind,
} from 'vscode-languageserver';
import {
	TextDocument
} from 'vscode-languageserver-textdocument';
import { CompletionProvider} from './completion';
import {Parser} from './parser/parser';
import { DevUIParamsConstructor, htmlInfo } from './source/html_info';
import * as fs from 'fs';
configure({
    appenders: {
        lsp_demo: {
            type: "console",
        },
    },
    categories: { default: { appenders: ["lsp_demo"], level: "debug" } }
});
export const logger = getLogger("lsp_demo");
// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
export let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

//初始化htmlInfo
export const htmlSourceTreeRoot = new DevUIParamsConstructor().build();
export const completionProvider= new CompletionProvider();
// logger.debug(JSON.stringify(htmlSourceTreeRoot));
// JSON.pa
connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;
	logger.debug(params.rootPath);

	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: false,
				triggerCharacters: ['<', '-', '+', '[', '(']
			},
			hoverProvider:true,
		}
	};
});

connection.onInitialized(() => {
	
	connection.window.showInformationMessage("Welcome to DevUI Helper")
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

// The example settings
interface ExampleSettings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ExampleSettings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	// documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServerExample'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});


connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

//分析器
export const parser = new Parser();
// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		let source = htmlSourceTreeRoot;
		logger.debug(`Completion work`);
		logger.debug(`cursorOffset at : ${documents.get(_textDocumentPosition.textDocument.uri)?.offsetAt(_textDocumentPosition.position) }`)
		const _textDocument = documents.get(_textDocumentPosition.textDocument.uri);
		if(_textDocument){
			//TODO : 将分析放到外层。
			parser.parseTextDocument(_textDocument);
			const _offset = _textDocument!.offsetAt(_textDocumentPosition.position);
			if(_textDocument){
				return completionProvider.provideCompletionItemsForHTML(_offset,_textDocument);
			}
		}
		return [];
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		return item;
	}
);

documents.onDidOpen(
    (event: TextDocumentChangeEvent<TextDocument>) => {
        logger.debug(`on open:${event.document.uri}`);
        logger.debug(`file version:${event.document.version}`);
        logger.debug(`file content:${event.document.getText()}`);
        logger.debug(`language id:${event.document.languageId}`);
		logger.debug(`line count:${event.document.lineCount}`);
		parser.parseTextDocument(event.document);
    }
);
documents.onDidChangeContent(
    (e: TextDocumentChangeEvent<TextDocument>) => {
        // logger.debug('document change received.');
		// logger.debug(`document version:${e.document.version}`);
		logger.debug(`language id:${e.document.languageId}`);
		logger.debug(`text:${e.document.getText()}`);
		parser.parseTextDocument(e.document);
		// logger.debug(`line count:${e.document.lineCount}`);
		// let tokenizer = new Tokenizer(e.document,new TokenizeOption("<d-"));
		// tokenizer.Tokenize();
    }
);
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.textDocument.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.textDocument.text the initial full content of the document.
	
	logger.debug(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.textDocument.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	logger.debug(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.textDocument.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
connection.onHover((params)=>{
	logger.debug(params.position);
	let document = documents.get(params.textDocument.uri);
	let offset:number=0;
	if(document)
		offset = document!.offsetAt(params.position);
		logger.debug(`We Are At:+${offset}`);
		logger.debug(`We Are At:+${document!.getText().toString().charCodeAt(offset)}`);
	return null;
});



// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
