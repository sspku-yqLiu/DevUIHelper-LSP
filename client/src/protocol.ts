/*
 * @Author: your name
 * @Date: 2020-03-07 15:48:43
 * @LastEditTime: 2020-03-07 15:48:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \lsp-sample\client\src\protocol.ts
 */
import{NotificationType0} from 'vscode-languageclient';
export const projectLoadingNotification={
	start: new NotificationType0<String>('DevUI-language-service/projectLoadingStart'),
	finish: new NotificationType0<String>('DevUI-language-service/projectLoadingFinish')
};