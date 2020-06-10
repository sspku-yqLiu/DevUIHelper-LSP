/*
 * @Author: your name
 * @Date: 2020-05-08 15:45:05
 * @LastEditTime: 2020-06-08 21:56:37
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

export function deepClone(ele){
  if(ele instanceof Array){
    return deepCloneArray(ele);
  }
  else if(ele instanceof Object){
    return deepCloneObject(ele);
  }
  return ele;
}
export function deepCloneArray(ele){
  let newEle = [];
  for (const e of ele){
    newEle.push(deepClone(e));
  }
  return newEle;
}

export function deepCloneObject<T>(ele:T):T{
    let newEle :T;
    for (const key in ele) {
      if (ele.hasOwnProperty(key)) {
        const element = ele[key];
        newEle[key] = deepClone(element);
      }
    }
    return newEle;
}