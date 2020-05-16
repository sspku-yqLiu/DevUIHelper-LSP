/*
 * @Author: your name
 * @Date: 2020-05-08 15:45:05
 * @LastEditTime: 2020-05-16 18:37:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \UI_Components_Helper\server\src\parser\utils.ts
 */

import { tagSubNodes } from './type';
import {Range,Position } from 'vscode-languageserver'
// 属于接口A
export const isTagProps = (props: any): props is tagSubNodes =>
  typeof (props as tagSubNodes) !== 'undefined'
export function rangeStartToString(position:Position):String{
    return `{Line :${position.line}, Character:${position.character}}`;
}