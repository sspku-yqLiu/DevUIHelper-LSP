import { CompletionItemKind } from "vscode-languageserver";
import{HTML_SCHEMA as SCHEMA} from './html_source';
import{logger} from '../server';
export interface Node {
    /**
     *  节点名称
     */
    getName():string;
    /**
     * 节点描述
     */
    getDescription():string;
    /**
     * 节点补全类型
     */
    getcompletionKind():CompletionItemKind;

}
export class Attribute implements Node{

        constructor( 
        private readonly name:string,
        private readonly type:string,
        private readonly defaultValue:string,
        private readonly sortDescription:string,
        private readonly description:string,
        private readonly isNecessary:boolean,
        private readonly isEvent:boolean,
        private readonly valueSet: string[] = [],
        private readonly completionKind:CompletionItemKind){}
    
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
}
export class Element implements Node {
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
    
}
const EVENT = "event";
const BOOLEAN = "boolean";
const NUMBER = "number";
const STRING = "string";
const OBJECT = "object";
const FUNCTION= "function";
const TEMPLATE="templateref"

export class CParams{
    schema = <{[elementName:string]:Element}>{};
    // result:Element[]=[];
    // elementSet:string[]=[];

    constructor(){
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
                        parts[0].toLocaleLowerCase(),
                        parts[1],
                        parts[2],
                        parts[3],
                        parts[4],
                        parts[5]==="true"?true:false,
                        parts[6]==="true"?true:false,
                        parts[7].substring(1,parts[7].length-1).replace(" ","").split(","),
                        this.changeToCompletionKind(parts[1],parts[6])
                    ));
                    // console.log(_element.getAttributes()); 
                }else{
                    throw Error(`Something wrong with ${_elementName}`);
                }
            }
        });
    }
    findElement(elemenetName:string):Element|undefined{
        return this.schema[elemenetName.toLowerCase()];
    }
    changeToCompletionKind(type:string,isEvent:string):CompletionItemKind{
        type= type.toLowerCase();
        if(isEvent==="true"){
            return CompletionItemKind.Function;
        }
        if(type.includes("arrray")||type.includes("[]")) {
            return CompletionItemKind.Enum;
        }
        switch(type){
            case STRING:
                return CompletionItemKind.Text;
            case TEMPLATE:
                return CompletionItemKind.Module;
            // case BOOLEAN:
            //     return CompletionItemKind.
            default: 
                return  CompletionItemKind.Variable;
        }
    }
}
export const htmlSource = new CParams();