/*
 * @Author: your name
 * @Date: 2020-03-07 19:30:51
 * @LastEditTime: 2020-03-07 19:30:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \lsp-sample\server\src\cmdline_utils.ts
 */
function findArgument(argv:string[],argName:string):string|undefined {
	const index = argv.indexOf(argName);
	if (index < 0 || index === argv.length - 1) {
		return;
	}
	return argv[index + 1];
}
function parseStringArray(argv:string[],argName:string): string[]{
	const arg = findArgument(argv,argName);
	if(!arg){
		return [];
	}
	return arg.split(',');
}
interface CommandLineOptions{
	help: boolean;
	logFile?: string;
	logVerbosity?: string;
	ngProbeLocations: string[];
	tsProbeLocations: string[];
}
/* 待施工 */ 
export function parseCommandLine(argv: string[]): CommandLineOptions{
	return {
		help: false,
		logFile: 'logfile',
		logVerbosity: 'logVerbosity',
		ngProbeLocations: parseStringArray(argv, '--ngProbeLocations'),
		tsProbeLocations:parseStringArray(argv, '--tsProbeLocations'),
	};
}	