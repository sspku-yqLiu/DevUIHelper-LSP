import { CompletionItemKind,CompletionItem } from "vscode-languageserver";
import{HTML_SCHEMA as SCHEMA} from './html_source';
import{logger} from '../server';
import{MarkUpBuilder} from'../util';

const EVENT = "event";
const BOOLEAN = "boolean";
const NUMBER = "number";
const STRING = "string";
const OBJECT = "object";
const FUNCTION= "function";
const TEMPLATE="templateref"

export interface HTMLInfoNode {
    // /**
    //  *  节点名称
    //  */
    // getName():string;
    // /**
    //  * 节点描述
    //  */
    // getDescription():string;
    // /**
    //  * 节点补全类型
    //  */
    // getcompletionKind():CompletionItemKind;
    getparent():HTMLInfoNode|undefined;
    getCompltionItems(name?:string):CompletionItem[];
    getsubNode(name:string):HTMLInfoNode|undefined;

}
export class RootNode implements HTMLInfoNode{
    schema = <{[elementName:string]:Element}>{};
    constructor(){}
    getCompltionItems():CompletionItem[]{
        return Object.keys(this.schema).map(element=>{
            let completionItem = CompletionItem.create("d-"+element);
            completionItem.kind= CompletionItemKind.Class;
            // completionItem.insertText="d-"+element+"${1:!!!}"
            return completionItem;
        });
    }
    getsubNode(name:string):HTMLInfoNode|undefined{
        return this.schema[name];
    }
    getparent():undefined{
        return;
    }
}
export class Attribute implements HTMLInfoNode{

        constructor( 
        private readonly name:string,
        private readonly type:string,
        private readonly defaultValue:string,
        private readonly sortDescription:string,
        private readonly description:string,
        private readonly isNecessary:boolean,
        private readonly isEvent:boolean,
        private readonly valueSet: string[] = [],
        private readonly completionKind:CompletionItemKind,
        private readonly parent:HTMLInfoNode){}
    
    public getName(){
        return this.name;
    }
    
    public getSortDescription() : string {
        return this.sortDescription;
    }
    
    getDescription(){return this.description;}
    getcompletionKind(){return this.completionKind;}
    getValueType(){return this.type;}
    getDefaultValue(){return this.defaultValue;}
    getValueSet(){return this.valueSet;}
    getCompltionItems(attrname:string){
        let result:CompletionItem[] = [];
        return this.valueSet.map(value=>{
            let completionItem =  CompletionItem.create(value);
            completionItem.kind = CompletionItemKind.Enum;
            completionItem.detail= `这是${value}类型`;
            completionItem.documentation = new MarkUpBuilder().addContent("![demo](https://s2.ax1x.com/2020/03/08/3z184H.gif)").getMarkUpContent();													
        completionItem.preselect = true;
        return completionItem;
        });
    }
    getsubNode(name:string):undefined{
        return;
    }
    getparent():HTMLInfoNode{
        return this.parent;
    }
}
export class Element implements HTMLInfoNode {
    private attributeMap = <{[attrName:string]:Attribute}>{}
    constructor(private name:string,
        private description:string = "",
        private attritubes:Attribute[]=[],
        ){};
    getElement(s:string):Element|undefined{
        if(s=== this.name){
            return this;
        }
    }
    addAttritube(attribute:Attribute){
        this.attritubes.push(attribute);
        this.attributeMap[attribute.getName()]=attribute;
    }
    setDescription(description:string){
        this.description = description;
    }
    getName(){
        return this.name;
    }
    getAttributes(){
        return this.attritubes;
    }
    getDescription(){
        return this.description;
    }
    getAttribute(attrname:string):Attribute{  
        return this.attributeMap[attrname];
    }
    getcompletionKind(){ return CompletionItemKind.Class;}
    getCompltionItems(){
        return this.attritubes.map(attr=>{
            let completionItem =  CompletionItem.create(attr.getName());
            completionItem.detail= attr.getSortDescription();
            completionItem.documentation = new MarkUpBuilder().addSpecialContent('typescript',[
                                                                "Type:"+attr.getValueType(),
                                                                "DefaultValue:"+attr.getDefaultValue(),
                                                                "Description:"+ attr.getDescription()]).getMarkUpContent();
            completionItem.kind = attr.getcompletionKind();                                                    
                                                                
            if(attr.getcompletionKind()!==CompletionItemKind.Event){
                completionItem.insertText ="["+attr.getName()+"]=\"\"";
            }else{
                completionItem.insertText ="("+attr.getName()+")=\"\"";
            }
            completionItem.preselect = true;
            return completionItem;
        });
    }
    getsubNode(attrname:string):HTMLInfoNode|undefined{
        return this.attributeMap[attrname];
    }
    getparent(){
        return new RootNode()
    }
    
}


export class DevUIParamsConstructor{
    private readonly rootNode = new RootNode();
    private schema = this.rootNode.schema;
    constructor(){}
    build():HTMLInfoNode{
        let _elementName:string;
        SCHEMA.forEach(elementInfo => {
            const parts = elementInfo.split("||");
            if(parts.length===2){
               _elementName = parts[0].toLocaleLowerCase(); 
                this.schema[_elementName.toLowerCase()] = new Element(_elementName,parts[1]);
                // console.log(_elementName);
            }else{
                // console.log(_elementName);
                const _element = this.schema[_elementName];
                if(_element.getAttribute(parts[0])){
                    // console.log(_element.getName()); 
                }
                if(_element){
                    _element.addAttritube(new Attribute(
                        parts[0],
                        parts[1],
                        parts[2],
                        parts[3],
                        parts[4],
                        parts[5]==="true"?true:false,
                        parts[6]==="true"?true:false,
                        parts[7].substring(1,parts[7].length-1).replace(" ","").split(","),
                        this.changeToCompletionKind(parts[1],parts[6]),
                        _element
                    ));
                    // console.log(_element.getAttributes()); 
                }else{
                    throw Error(`Something wrong with ${_elementName}`);
                }
            }
        });
        return this.rootNode;
    }
    getSubNode(elemenetName:string):Element|undefined{
        return this.schema[elemenetName.toLowerCase()];
    }
    changeToCompletionKind(type:string,isEvent:string):CompletionItemKind{
        type= type.toLowerCase();
        if(isEvent==="true"){
            return CompletionItemKind.Event;
        }
        if(type.includes("arrray")||type.includes("[]")) {
            return CompletionItemKind.Enum;
        }
        switch(type){
            case STRING:
                return CompletionItemKind.Text;
            case TEMPLATE:
                return CompletionItemKind.Module;
            case FUNCTION:
                return CompletionItemKind.Function;
            default: 
                return  CompletionItemKind.Variable;
        }
    }
    getRoot():HTMLInfoNode{
        return this.rootNode;
    }
}
export const htmlInfo = new DevUIParamsConstructor();