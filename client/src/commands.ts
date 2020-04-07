
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient';
/**
 * Represent a vscode command with an ID and an impl function `execute`.
 */
interface Command{
	id:string;
	/*通过某种承诺达成（vscode 执行disposable之后，*/ 
	execute(): Promise<vscode.Disposable>;
}
/**
 * 重启DeuUIServer
 * @param client language client
 */

function restartDevUIServer(client :lsp.LanguageClient):Command{
	return {
		id:'angular.restartDevUIServer',
		async execute(){
			await client.stop();
			return client.start();
		},
	};
}

export function registerCommands(client: lsp.LanguageClient):vscode.Disposable[]{
	const commands:Command[] = [
		restartDevUIServer(client),
	];
	const disposables = commands.map((command)=>{
		return vscode.commands.registerCommand(command.id,command.execute);
	});
	return disposables;
}