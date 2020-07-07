/*
 * @Author: your name
 * @Date: 2020-05-15 12:53:58
 * @LastEditTime: 2020-06-06 08:19:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\DConnection.ts
 */ 
import {
	createConnection,
	ProposedFeatures,
	InitializeParams,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	DidChangeConfigurationParams,
	HoverParams,
	Logger,
	DidChangeConfigurationNotification,
	DiagnosticSeverity,
	Diagnostic
} from 'vscode-languageserver';
import { logger } from './server';
import { Host } from './Host/Host';
import { FileType } from './type';
import { SupportFrameName, ParseOption } from './parser/type';
import { resolve } from 'dns';
import { TextDocument } from 'vscode-languageserver-textdocument';
export class DConnection{
	private connection = createConnection(ProposedFeatures.all);
	private host:Host;
	private logger:Logger;
	private igniteResult:ParseOption|undefined;
	constructor(host:Host,logger:Logger){
		this.host = host;
		this.logger = logger;
		this.addProtocalHandlers();
	}
	addProtocalHandlers(){
		this.connection.onInitialize(e=>this.onInitialze(e));
		this.connection.onInitialized(()=>this.onInitialized());
		this.connection.onDidChangeConfiguration(e=>this.onDidChangeConfiguration(e));
		this.connection.onHover(e=>this.onHover(e));
		this.connection.onCompletion(e=>this.onCompletion(e));
		this.host.documents.onDidChangeContent(change=>this.validateTextDocument(change.document));
	}
	onInitialze(params:InitializeParams):InitializeResult{
		let capabilities = params.capabilities;
		if(params.rootPath){
			logger.debug(`Find Project At ${params.rootPath}`);
			this.igniteResult = this.host.igniter.ignite(params.rootPath);
			this.host.setParseOption(this.igniteResult);
		}

		return {
			capabilities: {
				textDocumentSync: TextDocumentSyncKind.Full,
				// Tell the client that the server supports code completion
				completionProvider: {
					resolveProvider: false,
					triggerCharacters: ['<','.', '-', '+', '[', ']','(','\"',' ',,'*','\@',',','a',
				'b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t',
			'u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0']
				},
				hoverProvider:true,
			}
		};
	}
	getSetting():Thenable<any>{
		return  this.connection.workspace.getConfiguration({
			section: 'DevUIHelper'
		});
	}
	async onInitialized(){	
		let setting = await this.getSetting();
		this.host.configuration.provideHover=setting.provideHover;
		logger.debug(`providerSetting: ${setting.provideHover}`);
	}
	onDidChangeConfiguration(change:DidChangeConfigurationParams){
		logger.debug('hi it changed');
	}
	onCompletion(_textDocumentPosition: TextDocumentPositionParams){
		// logger.debug(`Completion work`);		
		// logger.debug(`cursorOffset at : ${this.host.documents.get(_textDocumentPosition.textDocument.uri)?.offsetAt(_textDocumentPosition.position) }`);
		// this.host.igniter.checkProjectFrameworkAndComponentName('c:\\MyProgram\\angular\\demo1');
		if(!this.igniteResult||this.igniteResult.frame===SupportFrameName.Null||this.igniteResult.components.length===0){
			return [];
		}
		return this.host.completionProvider.provideCompletionItes(_textDocumentPosition,FileType.HTML);
	}
	async onHover(_textDocumentPosition:HoverParams){
		let setting = await this.getSetting();
		this.host.configuration.provideHover=setting.provideHover;
		if(!this.igniteResult||this.igniteResult.frame===SupportFrameName.Null||this.igniteResult.components.length===0){
			return ;
		}
		return this.host.hoverProvider.provideHoverInfoForHTML(_textDocumentPosition);
	}
	async validateTextDocument(textDocument: TextDocument) {
		// In this simple example we get the settings for every validate run.
	
		// The validator creates diagnostics for all uppercase words length 2 and more
		let text = textDocument.getText();
		let pattern = /\b[A-Z]{2,}\b/g;
		let m: RegExpExecArray | null;
	
		let problems = 0;
		let diagnostics: Diagnostic[] = this.host.diagnoser.diagnose(textDocument);  
		// Send the computed diagnostics to VSCode.
		this.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
	}
	
	
	listen(){
		this.connection.listen();
		this.host.documents.listen(this.connection);
	}
	info(msg:string){
		this.logger.info(msg);
	}
	// debug(msg:string){
	// 	logger.debug(msg);
	// }
	
}
