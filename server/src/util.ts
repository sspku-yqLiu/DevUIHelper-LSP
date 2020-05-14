/*
 * @Author: your name
 * @Date: 2020-03-29 11:52:31
 * @LastEditTime: 2020-05-13 23:35:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper\src\util.ts
 */
import{MarkupKind,CompletionItemKind, MarkupContent, CompletionItem,Range} from 'vscode-languageserver';
import { Span } from './DataStructor/type';
import { logger } from './server';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { HTMLAST, HTMLTagAST } from './parser/ast';
import {CompletionRangeKind} from './type';
export function getName(text: string,componentRegex: RegExp){
    text.match(componentRegex);
    const n = RegExp.$1.substring(2);
    // const nam = n.replace(n[0],n[0].toUpperCase());//匹配之后对字符串处理然后匹配导出的模块
    const nam = n;//匹配之后对字符串处理然后匹配导出的模块
    let name: string;
    if (nam.indexOf("-") !== -1){
        name = capitalize(nam);
    }else{
        name = nam;
    }
    // console.log("name: " + name);
    return name;

}
export function word2Name(word: string){
    const n  = word.substring(2);
    const nam = n.replace(n[0],n[0].toUpperCase());//匹配之后对字符串处理然后匹配导出的模块
    let name: string;
    if (nam.indexOf("-") !== -1){
        name = capitalize(nam);
    }else{
        name = nam;
    }
    return name;
}
function capitalize(string: string){
    // split() 方法用于把一个字符串分割成字符串数组。
    var words =string.split("-");
    for(var i=0;i<words.length;i++)
    {
        // charAt() 方法可返回指定位置的字符。
        // slice() 方法可从已有的数组中返回选定的元素。
        words[i]=words[i].charAt(0).toUpperCase() + words[i].slice(1);
        // 第一个单词的第一个字母转化为大写，然后再将该单词的后面字母使用slice()接上即可。
    }
    // join() 方法用于把数组中的所有元素放入一个字符串
    return words.join("");
}
export function autoIcon(type:CompletionItemKind):string{
    switch(type){
        default:
            return "$(array)";
    }
}
export function convertStringToName(name:string):string{
    let bananaset = ['[',']','(',')']
    for(let banana of bananaset){
        name = name.replace(banana,"");
    }
    return name;
}
/**
 * c1=>c2
 * @param c1 
 * @param c2 
 */
export function copyCompletionItem(c1:CompletionItem,c2:CompletionItem){
    c2.insertText=c1.insertText;
    c2.kind=c1.kind;
    c2.detail=c1.detail;
    c2.documentation = c1.documentation;
    c2.insertTextFormat = c1.insertTextFormat;
                
}
export function converValueSetToValueString(valueSet:string[]){
    if(valueSet===[])
        return "";
    let res:string = "";
    for(let value of valueSet){
        if(value !== "")
            res+=`\'${value.replace(" ","")}\',`
    }
    res+="+";
    return res;

}
export function getRangeFromDocument(terminalNode:HTMLAST|undefined,textDocument:TextDocument):Range{
    if(!terminalNode){
        return Range.create(-1,-1,-1,-1);
    }
    let _range = terminalNode.getSpan();
    let _start = textDocument.positionAt (_range.start);
    let _end = textDocument.positionAt (_range.end);
    _end.character++;
    return Range.create(_start,_end);
}

export function getRangefromSpan(span:Span|undefined,textDocument:TextDocument){
    if(!span){
        return Range.create(-1,-1,-1,-1);
    }
    let _start = textDocument.positionAt (span.start);
    let _end = textDocument.positionAt (span.end);
    _end.character++;
    return Range.create(_start,_end);
}

export function autoSelectCompletionRangeKind(word:string):CompletionRangeKind{
    logger.debug("word:"+word);
    let reg0 = /^\+.*$/; //匹配+...
    let reg1 = /^\[.*$/; // 匹配[....]
    let reg2 = /^\(.*$/; // 匹配(....)
    let reg3 = /^\[\(.*$/; // 匹配[(.....)]
    if(reg0.test(word)){
        return CompletionRangeKind.ADD;
    }
    else if (reg3.test(word)) {
        return CompletionRangeKind.INOUTPUT;
    }
    else if (reg1.test(word)) {
        return CompletionRangeKind.INPUT;
    }
    else if (reg2.test(word)) {
        return CompletionRangeKind.OUTPUT;
    }else{
        return CompletionRangeKind.NONE;
    }
    // const bindParts = word.match(ATTRREGX);
	// if(!bindParts)
	// 	return CompletionRangeKind.NONE;
	// if(bindParts[CompletionRangeKind.INOUTPUT]!==undefined){
	// 	return CompletionRangeKind.INOUTPUT;
	// }
	// if(bindParts[CompletionRangeKind.INPUT]!==undefined){
	// 	return CompletionRangeKind.INPUT;
	// }
	// if(bindParts[CompletionRangeKind.OUTPUT]!==undefined){
	// 	return CompletionRangeKind.OUTPUT;
	// }
	// if(bindParts[CompletionRangeKind.ADD]!==undefined){
	// 	return CompletionRangeKind.ADD;
    // }

}
export function changeDueToCompletionRangeKind(kind:CompletionRangeKind,label:string):string{
    switch(kind){
        case CompletionRangeKind.NONE:
            return label;
        case CompletionRangeKind.INOUTPUT:
            return "[("+label+")]";
        case CompletionRangeKind.INPUT:
            return "["+label+"]";
        case CompletionRangeKind.OUTPUT:
            return "("+label+")";
        case CompletionRangeKind.ADD:
            return "+"+label;
    }
}

export function getsubstringForSpan(span:Span,text:string){
    let {start,end} =span;
    return text.substring(start,end+1);   
}
export function changeInsertDueToCompletionRangeKind(kind:CompletionRangeKind,text:string){
    if(kind === CompletionRangeKind.INOUTPUT){
        text = text.replace("[","[(").replace("]",")]");
    }
    return text;
}

export class MarkUpBuilder{
    private markUpContent:MarkupContent;
    constructor(content?:string){
        this.markUpContent=  {kind:MarkupKind.Markdown,value:content?content:""}
    }
    
    getMarkUpContent():MarkupContent{
        return this.markUpContent;
    }
    addContent(content:string){
        this.markUpContent.value+=content;
        return this;
    }
    addSpecialContent(type:string,content:string[]){
        this.markUpContent.value+= 
             [
                '```'+type,
                 ...content,
                '```'
            ].join('\n');
        return this;
    }
}
export function convertSpanToRange(span:Span,textDocument:TextDocument):Range{
    let _start = textDocument.positionAt(span.start)
    let _end = textDocument.positionAt(span.end)
    return {start:_start,end:_end};
}
export function adjustSpanToAbosultOffset(node:HTMLAST,span:Span):void{
    _adjustSpanToAbosultOffset(node,span);
    span.end++;
}
export function _adjustSpanToAbosultOffset(node:HTMLAST,span:Span):void{
    if(node.getName()!="$$ROOT$$"){
        if(node instanceof HTMLTagAST){
            span.selfShift(node.tagOffset,true);
        }
        _adjustSpanToAbosultOffset(node.parentPointer!,span);
    }
}