import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit, Range, Hover, MarkupContent } from "vscode-languageserver";
import { logger, host } from '../../server';
import { MarkUpBuilder, copyCompletionItem, converValueSetToValueString, changeDueToCompletionRangeKind, changeInsertDueToCompletionRangeKind } from '../../util';
import { CompletionRangeKind } from '../../type';
import { SupportComponentName } from '../type';
import { getComponentMarkDownString, getComponentHoverInfo, getAttributeMarkDownString, getAttributeHoverInfo } from './util';

const EVENT = "event";
const BOOLEAN = "boolean";
const NUMBER = "number";
const STRING = "string";
const OBJECT = "object";
const FUNCTION = "function";
const TEMPLATE = "templateref";

export interface HTMLInfoNode {
    // /**
    //  * 获得当前节点的父节点
    //  */
    // getParent():HTMLInfoNode|undefined;
    /**
     * 获取名称
     */
    getName():string;
    /**
     * 获取资源树下方节点
     * @param name 下方节点的string类型的名称
     */
    getSubNode(name: string): HTMLInfoNode | undefined;

    /**
     * 获得它的全部子节点
     */
    getSubNodes(): HTMLInfoNode[] | undefined;

    /**
     * 生成本元素的CompletionItem.这样可以响应父节点的调用。
     */
    buildFullCompletionItem(): void;

    /**
     * 生成只含有名字的CompletionItem。
     */
    buildNameCompletionItem(): void;

    /**
     * 生成当前节点的CompletionItem
     */
    buildCompletionItemsAndHoverInfo(): void;

    /**
     * 获取补全代码(仅名字)
     * @param name 
     */
    getNameCompltionItems(range?: Range): CompletionItem[];

    /**
     * 获取Snippet式补全代码
     * @param name 
     */
    getFullCompltionItems(range?: Range, kind?: boolean): CompletionItem[];

    /**
     *  提供悬浮提示内容
     * 
     */
    getHoverInfo(): Hover | undefined;
    /**
     *  获得自身的补全代码
     */
    getCompletionItem():CompletionItem|undefined;

}
export class RootNode implements HTMLInfoNode {
    private schema = <{ [elementName: string]: Component }>{};
    public prefixSchema= <{[comName:number]:Component[]}>{};
    private completionItems: CompletionItem[] = [];
    private nameCompletionItems: CompletionItem[] = [];
    private directWithNameSet={};
    public prefixCut = <{[comName:number]:{[prefix:string]:Component}}>{};
    public directivePrefixCut = <{[directivePrefix: string]: Component }>{};
    constructor() { }
    getSchema(){
		return this.schema;
	}
    buildFullCompletionItem() { }
    buildNameCompletionItem() { }
    buildCompletionItemsAndHoverInfo() {
        this.completionItems = Object.values(this.schema).map(element => {
            return element.buildFullCompletionItem();
        });
        this.nameCompletionItems = Object.values(this.schema).map(element => {
            return element.buildNameCompletionItem();
        });
    }
    addComponentOrDirectives(node:Component,prefix:string,comName:SupportComponentName){
        //schema
        this.schema[node.getName()]=node;
        //prefixSchema
        let nodes:Component[] = this.prefixSchema[comName];
        if(!nodes){
            this.prefixSchema[comName]=[];
            nodes = this.prefixSchema[comName];
        }
        nodes.push(node);
        //prefixCut
        if(node instanceof TagComponent){
            this.prefixCut[comName] = this.prefixCut[comName]?this.prefixCut[comName]:{};
            this.prefixCut[comName][prefix] = node;
        }
        if(node instanceof Directive){
            this.directivePrefixCut[prefix] = node;
        }

    }
    getNameCompltionItems(): CompletionItem[] {
        return this.nameCompletionItems;
    }
    getFullCompltionItems(range?: Range, kind?: boolean) {
        // if (kind) {
        //     this.completionItems.forEach(e => e.insertText);
        // }
        if (range) {
            return this.completionItems.map(_completionItem => {
                _completionItem.textEdit = {
                    range: range,
                    newText: kind ? _completionItem.insertText!.substring(0, _completionItem.insertText!.length) : _completionItem.insertText!
                };
                return _completionItem;
            });
        }
        return this.completionItems;
    }
    getSubNode(name: string): HTMLInfoNode | undefined {
        return this.schema[name];
    }
    getSubNodes() {
        return Object.values(this.schema);
    }
    getParent(): undefined {
        return;
    }
    getHoverInfo(): undefined { return undefined; }
    insertDirectiveWithArray(directive:Directive){
        this.directWithNameSet[directive.getName()]=directive;
    }
    getDirectiveWithNameSet(){
        return this.directWithNameSet;
    }
    getName(){
        return "$$INFOROOT$$";
    }
    getCompletionItem(){
        return undefined;
    }
}

export class Component implements HTMLInfoNode {
    protected attributeMap = <{[attrName: string]: Attribute }>{};
    protected subNodes: Attribute[] = [];
    protected nameCompletionItems: CompletionItem[] = [];
    protected completionItem:CompletionItem;
    protected completionItems: CompletionItem[] = [];
    protected completionItemKind: CompletionItemKind = CompletionItemKind.Class;
    protected completionContent:MarkupContent|string;
    protected prefixToValue=<{[prefix:string]:Attribute}>{};
    protected hoverInfo: Hover = {contents:''};
    constructor(protected name: string,
        public comName?:SupportComponentName|undefined,
        protected description: string ="",
        protected tmw?: string | undefined,
        protected cnName?: string | undefined,
        public prefixName:string=""
    ) { 
        this.completionItemKind = CompletionItemKind.Class;
    }

    addAttritube(attribute: Attribute) {
        this.subNodes.push(attribute);
        this.attributeMap[attribute.getName()] = attribute;
        if(attribute.getValueSet()!==[]){
            attribute.getValueSet().forEach(element => {
                this.prefixToValue[element]=attribute;
            });
        }
    }
    getPrefixToValue(){
        return this.prefixToValue;
    }
    getName() { return this.name; }
    getDescription() { return this.description; }
    getcompletionKind() { return this.completionItemKind; }

    buildCompletionItemsAndHoverInfo() {
        this.subNodes.forEach(attr => {
            let temp = attr.buildFullCompletionItem();
            this.completionItems.push(...attr.buildFullCompletionItem());
        });
        this.nameCompletionItems = this.subNodes.map(attr => {
            return attr.buildNameCompletionItem();
        });
        this.completionContent = getComponentMarkDownString.call(this).getMarkUpContent();
        this.hoverInfo.contents=getComponentHoverInfo.call(this).getMarkUpContent(); 
    }
    
    buildFullCompletionItem(): CompletionItem {
        this.buildCompletionItemsAndHoverInfo();
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.kind = this.completionItemKind;
        let _insertText: string = this.name;
        let _snippetNum = 1;
        for (let attr of Object.values(this.attributeMap)) {
            if (attr.isNecessary || attr.getName() === this.name) {
                if(attr.getName() === this.name){
                    _insertText.replace(this.name,"");
                }
                _insertText += `\n\t${attr.getCompletionItem()?.insertText}`.replace("$1", "$" + _snippetNum + "");
                _snippetNum++;
            }
        }
        _completionItem.insertText = _insertText;
        // _completionItem.documentation=this.tmwString;
        _completionItem.documentation = this.completionContent;
        _completionItem.detail = this.description.split(',')[0];
        _completionItem.insertTextFormat = InsertTextFormat.Snippet;
        _completionItem.preselect = false;
        this.completionItem = _completionItem;
        return _completionItem;
    }
    buildNameCompletionItem(): CompletionItem {
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.detail = this.description;
        _completionItem.documentation=this.completionContent;
        _completionItem.kind= this.completionItemKind;
        _completionItem.preselect = false;
        return _completionItem;
    }
    getNameCompltionItems() {
        return this.nameCompletionItems;
    }
    getFullCompltionItems(currentRange?: Range) {
        if (!currentRange) {
            return this.completionItems;
        }
        return this.completionItems.map(_completionItem => {
            _completionItem.textEdit = {
                range: currentRange,
                newText: _completionItem.insertText ? _completionItem.insertText : "",
                // newText :changeInsertDueToCompletionRangeKind(kind,_newText),
            };
            return _completionItem;
        });
    }
    getSubNode(attrname: string): HTMLInfoNode | undefined {
        return this.attributeMap[attrname];
    }
    getSubNodes() {
        return Object.values(this.attributeMap);
    }
    getParent(): HTMLInfoNode {
        return new RootNode();
    }
    getHoverInfo(): Hover {
        return this.hoverInfo;
    }
    getCompletionItem(){
        return this.completionItem;
    }
}
export class TagComponent extends Component{
    constructor(name: string,
        comName?:SupportComponentName|undefined,
        description: string = "",
        tmw?: string | undefined,
        cnName?: string | undefined,
        prefixName:string=""
    ) {
        super(name, comName, description, tmw, cnName,prefixName);
        this.completionItemKind = CompletionItemKind.Class;
        this.subNodes = [];
        let temp = CompletionItem.create(this.name);
        temp.insertText = `${name}>$0</${name}>`;
        this.completionItem = temp;
    }

    buildFullCompletionItem(): CompletionItem {
        let _completionItem = super.buildFullCompletionItem();
        if (_completionItem.insertText.indexOf('${1')===-1) {
            _completionItem.insertText +=">$0" + `</${this.name}>`;
        }
        else{
            _completionItem.insertText += `\n>$0</${this.name}>`;
        }
        this.completionItem = _completionItem;
        return _completionItem;
    }
}

export class Directive extends Component {
    private hasValueFlag = false;
    constructor(name: string,
        comName:SupportComponentName|undefined,
        description: string = "",
        tmw: string | undefined,
        cnName: string | undefined,
        prefixName:string=""
    ) {
        super(name, comName, description, tmw, cnName,prefixName);
        this.completionItemKind = CompletionItemKind.Unit;
    }
    //Question:为什么返回值不同会报错
    getcompletionKind() { return this.completionItemKind; }
    buildNameCompletionItem(): CompletionItem {
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.kind = this.completionItemKind;
        _completionItem.detail = this.description;
        _completionItem.documentation = this.completionContent;
        _completionItem.preselect = false;
        if(this.hasValueFlag){
            _completionItem.insertText = `[${this.name}]="$1"`;
            _completionItem.insertTextFormat=InsertTextFormat.Snippet;
            host.HTMLDirectiveSource.insertDirectiveWithArray(this);
        }
        return _completionItem;
    }
        
    buildFullCompletionItem(): CompletionItem {
        // this.buildCompletionItems();
        let _completionItem = super.buildFullCompletionItem();
        this.completionItem = _completionItem;
        return _completionItem;
    }
    setHasValueFlag(){
        this.hasValueFlag = true;
    }
}
export class Attribute implements HTMLInfoNode {
    private nameCompletionItems: CompletionItem[] = [];
    private completionItems: CompletionItem[] = [];
    private completionItem: CompletionItem | undefined;
    private readonly completionKind: CompletionItemKind;
    private hoverInfo:Hover = {contents:''};
    private completionDocument = '';
    constructor(
        private readonly name: string,
        private readonly type: string='string',
        private readonly defaultValue: string='null',
        private readonly description: string='',
        public readonly isNecessary: boolean=false,
        private readonly isEvent: boolean=false,
        private readonly valueSet: string[] = [],
        private readonly sortDescription?: string) {
        this.completionKind = isEvent ? CompletionItemKind.Event : CompletionItemKind.Variable;
    }

    buildCompletionItemsAndHoverInfo() {
        this.completionItems = this.valueSet.map(value => {
            let _completionItem = CompletionItem.create(value);
            _completionItem.kind = CompletionItemKind.EnumMember;
            _completionItem.insertText = value;
            _completionItem.detail = `这是${value}类型`;
            // _completionItem.documentation = new MarkUpBuilder().addContent("![demo](https://s2.ax1x.com/2020/03/08/3z184H.gif)").getMarkUpContent();
            _completionItem.preselect = false;
            return _completionItem;
        });
        this.nameCompletionItems = this.completionItems;
        this.completionDocument = getAttributeHoverInfo.call(this).getMarkUpContent();
        this.hoverInfo.contents = this.completionDocument;
    }

    buildFullCompletionItem(): CompletionItem[] {
        this.buildCompletionItemsAndHoverInfo();
        let _result:CompletionItem[] = [];
        // let _completionItem:CompletionItem; 
        if (this.isEvent) {
            _result.push(CompletionItem.create(`(${this.name})`));
        } else if (this.type == STRING) {
            _result.push(CompletionItem.create(`${this.name}`), CompletionItem.create(`[${this.name}]`));
        } else {
            _result.push(CompletionItem.create(`[${this.name}]`));
        }
        _result.forEach((_completionItem) => {

            _completionItem.detail = `${this.type}`;
            _completionItem.documentation = this.completionDocument;
            _completionItem.kind = this.completionKind;

            let _valueString = converValueSetToValueString(this.valueSet);
            if (_result.length === 1) {
                if (this.getcompletionKind() === CompletionItemKind.Event) {
                    _completionItem.insertText = "(" + this.name + ")=\"$1\"";
                } else if (this.type === BOOLEAN) {
                    _completionItem.insertText = "[" + this.name + "]=\"${1|true,false|}\"";
                } else {
                    _completionItem.insertText = `[${this.name}]=\"\${1${_valueString}}\"`;
                }
            } else {
                if (_completionItem.label.charCodeAt(0) === 91)
                    _completionItem.insertText = `[${this.name}]=\"\${1${_valueString}}\"`;
                else
                    _completionItem.insertText = _valueString == "" ? `${this.name}=\"$1"` : `${this.name}=\${1${_valueString}}`;
            }
            _completionItem.insertTextFormat = InsertTextFormat.Snippet;
            _completionItem.preselect = true;
        });
        this.completionItem = _result[0];
        
        return _result;
    }
    buildNameCompletionItem(): CompletionItem {
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.kind= this.completionKind;
        _completionItem.documentation = this.completionDocument;
        return _completionItem;
    }

    getNameCompltionItems(): CompletionItem[] {
        return this.completionItems;
    }

    getFullCompltionItems(range?: Range): CompletionItem[] {
        if (!range) {
            return this.completionItems;
        }
        return this.completionItems.map(_completionItem => {
            let _completionAddItem = _completionItem;
            copyCompletionItem(_completionItem, _completionAddItem);
            if(range){
                _completionAddItem.textEdit = {
                    range: range,
                    newText: _completionItem.insertText ? _completionItem.insertText : ""
                };
            }
            return _completionAddItem;
        });
    }

    getHoverInfo(): Hover {
        return this.hoverInfo ;
    }

    getName() { return this.name; }
    getSortDescription(): string { return this.description; }
    getDescription() { return this.description; }
    getcompletionKind() { return this.completionKind; }
    getValueType() { return this.type; }
    getDefaultValue() { return this.defaultValue; }
    getValueSet() { return this.valueSet; }
    getSubNode(name: string): undefined { return; }
    getSubNodes(): undefined { return; }
    // getParent():HTMLInfoNode{return this.parent;}
    getCompletionItem() { return this.completionItem; }
}
