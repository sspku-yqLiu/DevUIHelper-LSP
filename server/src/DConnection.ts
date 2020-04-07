// import * as lsp from 'vscode-languageserver';
// import { DevUIhtmlSyntaxes } from './DevUIhtmlSyntaxes';
// import { Hover } from 'vscode-languageserver';
// import { uriToFilePath } from 'vscode-languageserver/lib/files';
// import * as ts from 'typescript/lib/tsserverlibrary';
// import { ServerHost } from './server_host';


// // export interface DConnectionOptions {
// // 	host: ServerHost;
// // 	logger: Logger;
// // 	devProbeLocation: string;
// // }

// // let documents: lsp.TextDocuments = new lsp.TextDocuments();
// let hasConfigurationCapability: boolean = false;
// let hasWorkspaceFolderCapability: boolean = false;
// let hasDiagnosticRelatedInformationCapability: boolean = false;
// let IsDevUIProject = false;
// const DevUIwords = DevUIhtmlSyntaxes;

// enum LanguageId {
// 	ts = 'typescript',
// 	HTML = 'html',
// }

// interface ExampleSettings {
// 	maxNumberOfProblems: number;
// }
// const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1 };
// let globalSettings: ExampleSettings = defaultSettings;
// let documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();
// export class DConnection {
// 	private connection: lsp.Connection;
// 	private projectSvc: ProjectService;
// 	/*是否开始读取文件了？*/
// 	private isProjectLoading = false;
// 	constructor(options: DConnectionOptions) {
// 		this.connection = lsp.createConnection(lsp.ProposedFeatures.all);
// 		this.addProtocolHandlers(this.connection);
// 		this.projectSvc = new ProjectService({
// 			host: options.host,
// 			logger: options.logger,
// 			cancellationToken: ts.server.nullCancellationToken,
// 			useSingleInferredProject: true,
// 			useInferredProjectPerProjectRoot: true,
// 			typingsInstaller: ts.server.nullTypingsInstaller,
// 			suppressDiagnosticEvents: false,
// 			eventHandler: (e) => this.handleProjectServiceEvent(e),
// 		});
// 	}
// 	/**
//    * An event handler that gets invoked whenever the program changes and
//    * TS ProjectService sends `ProjectUpdatedInBackgroundEvent`. This particular
//    * event is used to trigger diagnostic checks.
//    * @param event
//    */
// 	private handleProjectServiceEvent(event: ts.server.ProjectServiceEvent) {
// 		switch (event.eventName) {
// 			case ts.server.ProjectLoadingStartEvent:
// 				this.isProjectLoading = true;
// 				this.connection.sendNotification(projectLoadingNotification.start);
// 				break;
// 			case ts.server.ProjectLoadingFinishEvent: {
// 				const { project } = event.data;
// 				// Disable language service if project is not Angular
// 				this.checkIsAngularProject(project);
// 				if (this.isProjectLoading) {
// 					this.isProjectLoading = false;
// 					this.connection.sendNotification(projectLoadingNotification.finish);
// 				}
// 				break;
// 			}
// 			case ts.server.ProjectsUpdatedInBackgroundEvent:
// 				// ProjectsUpdatedInBackgroundEvent is sent whenever diagnostics are
// 				// requested via project.refreshDiagnostics()
// 				// this.triggerDiagnostics(event.data.openFiles);
// 				break;
// 		}
// 	}
// 	private addProtocolHandlers(c: lsp.Connection) {
// 		c.onInitialize(p => this.onInitalize(p));
// 		c.onInitialized(() => this.onInitalized());
// 		c.onDidOpenTextDocument(p => this.onDidOpenTextDocument(p));
// 		// c.onDidChangeConfiguration(p => this.onDidChangeConfiguration(p));
// 		c.onDidChangeWatchedFiles(p => this.onDidChangeWatchedFiles(p));
// 		c.onCompletion(p => this.onCompletion(p));
// 		c.onCompletionResolve(p => this.onCompletionResolve(p));

// 	}
// 	private onInitalize(params: lsp.InitializeParams): lsp.InitializeResult {
// 		let capabilities = params.capabilities;

// 		return {
// 			capabilities: {
// 				textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
// 				// Tell the client that the server supports code completion
// 				completionProvider: {
// 					resolveProvider: true,
// 					triggerCharacters: ['<', '.', '*', '[', '(', '$', '|']
// 				},
// 				/* 允许悬浮提示和跳转 */
// 				definitionProvider: true,
// 				hoverProvider: true,
// 			}
// 		};
// 	}
// 	private onInitalized() {
// 		if (hasConfigurationCapability) {
// 			// Register for all configuration changes.
// 			this.connection.client.register(lsp.DidChangeConfigurationNotification.type, undefined);
// 		}
// 		if (hasWorkspaceFolderCapability) {
// 			this.connection.workspace.onDidChangeWorkspaceFolders(_event => {
// 				this.connection.console.log('Workspace folder change event received.');
// 			});
// 		}
// 		this.connection.window.showInformationMessage(`欢迎使用DevUIHelper`);
// 	}

// 	private onDidOpenTextDocument(params: lsp.DidOpenTextDocumentParams) {
// 		const { uri, languageId, text } = params.textDocument;
// 		const filePath = uriToFilePath(uri);
// 		if (!filePath) {
// 			return;
// 		}
// 		const scriptKind = languageId === LanguageId.ts ? ts.ScriptKind.TS : ts.ScriptKind.External;
// 		try {
// 			const result = this.projectSvc.openClientFile(filePath, text, scriptKind);
// 			const { configFileName, configFileErrors } = result;
// 			if (configFileErrors && configFileErrors.length) {
// 				this.connection.console.error(configFileErrors.map(e => e.messageText).join('\n'));
// 			}
// 			if (!configFileName) {
// 				this.connection.console.error(`No config file for ${filePath}`);
// 				return;
// 			}
// 			const project = this.projectSvc.findProject(configFileName);
// 			if (!project) {
// 				this.connection.console.error(`Failed to find project for ${filePath}`);
// 				return;
// 			}
// 			if (project.languageServiceEnabled) {
// 				project.refreshDiagnostics();  // Show initial diagnostics
// 			}
// 		} catch (error) {
// 			if (this.isProjectLoading) {
// 				this.isProjectLoading = false;
// 				this.connection.sendNotification(projectLoadingNotification.finish);
// 			}
// 			if (error.stack) {
// 				this.error(error.stack);
// 			}
// 			throw error;
// 		}
// 	}

// 	// private onDidChangeConfiguration(change: lsp.DidChangeConfigurationParams) {
// 	// 	if (hasConfigurationCapability) {
// 	// 		// Reset all cached document settings
// 	// 		documentSettings.clear();
// 	// 	} else {
// 	// 		globalSettings = <ExampleSettings>(
// 	// 			(change.settings.languageServerExample || defaultSettings)
// 	// 		);
// 	// 	}

// 	// 	// Revalidate all open text documents
// 	// 	documents.all().forEach(this.validateTextDocument);
// 	// }

// 	private async  validateTextDocument(textDocument: lsp.TextDocument): Promise<void> {
// 		// In this simple example we get the settings for every validate run.
// 		let settings = await this.getDocumentSettings(textDocument.uri);

// 		// The validator creates diagnostics for all uppercase words length 2 and more
// 		let text = textDocument.getText();
// 		let pattern = /\b[A-Z]{2,}\b/g;
// 		let m: RegExpExecArray | null;

// 		let problems = 0;
// 		let diagnostics: lsp.Diagnostic[] = [];
// 		while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
// 			problems++;
// 			console.log(problems);
// 			let diagnostic: lsp.Diagnostic = {
// 				severity: lsp.DiagnosticSeverity.Warning,
// 				range: {
// 					start: textDocument.positionAt(m.index),
// 					end: textDocument.positionAt(m.index + m[0].length)
// 				},
// 				message: `${m[0]} is all uppercase.`,
// 				source: 'ex'
// 			};
// 			if (hasDiagnosticRelatedInformationCapability) {
// 				diagnostic.relatedInformation = [
// 					{
// 						location: {
// 							uri: textDocument.uri,
// 							range: Object.assign({}, diagnostic.range)
// 						},
// 						message: 'Spelling matters'
// 					},
// 					{
// 						location: {
// 							uri: textDocument.uri,
// 							range: Object.assign({}, diagnostic.range)
// 						},
// 						message: 'Particularly for names'
// 					}
// 				];
// 			}
// 			diagnostics.push(diagnostic);
// 		}

// 		// Send the computed diagnostics to VSCode.
// 		this.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
// 	}
// 	private getDocumentSettings(resource: string): Thenable<ExampleSettings> {
// 		if (!hasConfigurationCapability) {
// 			return Promise.resolve(globalSettings);
// 		}
// 		let result = documentSettings.get(resource);
// 		if (!result) {
// 			result = this.connection.workspace.getConfiguration({
// 				scopeUri: resource,
// 				section: 'languageServerExample'
// 			});
// 			documentSettings.set(resource, result);
// 		}
// 		return result;
// 	}
// 	private onDidChangeWatchedFiles(_change: lsp.DidChangeWatchedFilesParams) {
// 		this.connection.console.log('We received an file change event');
// 	}
// 	/* 自动补全代码 */
// 	private onCompletion(_textDocumentPosition: lsp.TextDocumentPositionParams): lsp.CompletionItem[] {
// 		if(IsDevUIProject){
// 			return DevUIwords;}
// 		return [];
// 	}
// 	private onCompletionResolve(item: lsp.CompletionItem): lsp.CompletionItem {
// 		if (item.data === 1) {
// 			item.detail = 'TypeScript details';
// 			item.documentation = 'TypeScript documentation';
// 		} else if (item.data === 2) {
// 			item.detail = 'JavaScript details';
// 			item.documentation = 'JavaScript documentation';
// 		}
// 		return item;
// 	}
// 	listen() {
// 		this.connection.listen();
// 	}
// 	/* 检测是否是DevUI */
// 	private checkIsAngularProject(project: ts.server.Project) {

// 		// throw new Error(
// 		// 	`This is not angular project  `);
// 		const DevUI_CORE = 'ng-devui/index.d.ts';
// 		IsDevUIProject = isDevUIProject(project,DevUI_CORE);
// 		const { projectName } = project;
// 		if (!project.languageServiceEnabled) {
// 			const msg = `Language service is already disabled for ${projectName}. ` +
// 				`This could be due to non-TS files that exceeded the size limit (${
// 				ts.server.maxProgramSizeForNonTsFiles} bytes).` +
// 				`Please check log file for details.`;
// 			this.connection.console.info(msg);  // log to remote console to inform users
// 			project.log(msg);  // log to file, so that it's easier to correlate with ts entries
// 			return;
// 		}
// 		if (!isDevUIProject(project, DevUI_CORE)) {
// 			project.disableLanguageService();
// 			const msg =
// 				`Disabling language service for ${projectName} because it is not an Angular project ` +
// 				`('${DevUI_CORE}' could not be found). ` +
// 				`If you believe you are seeing this message in error, please reinstall the packages in your package.json.`;
// 			this.connection.console.info(msg);

// 			project.log(msg);
// 			if (project.getExcludedFiles().some(f => f.endsWith(DevUI_CORE))) {
// 				const msg =
// 					`Please check your tsconfig.json to make sure 'node_modules' directory is not excluded.`;
// 				this.connection.console.info(msg);
// 				project.log(msg);
// 			}
// 		}
// 	}
// 	info(message: string): void {
// 		this.connection.console.info(message);
// 	}
// 	error(message: string): void {
// 		this.connection.console.error(message);
// 	}

// 	/**
// 	 * Show a warning message.
// 	 *
// 	 * @param message The message to show.
// 	 */
// 	warn(message: string): void {
// 		this.connection.console.warn(message);
// 	}
// }
// /* 实现检测是否有装devUI插件 */
// function isDevUIProject(project: ts.server.Project, DevCore: string): boolean {
// 	project.markAsDirty();  // Must mark project as dirty to rebuild the program.
// 	if (project.isNonTsProject()) {
// 		return false;
// 	}
// 	for (const fileName of project.getFileNames()) {
// 		if (fileName.endsWith(DevCore)) {
// 			return true;
// 		}
// 	}
// 	return false;
// }


