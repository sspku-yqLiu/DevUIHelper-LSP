import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit, Range, Hover, MarkupContent } from "vscode-languageserver";
import { HTML_SCHEMA as SCHEMA } from './html_source';
import { logger, host } from '../server';
import { MarkUpBuilder, copyCompletionItem, converValueSetToValueString, changeDueToCompletionRangeKind, changeInsertDueToCompletionRangeKind } from '../util';
import { CompletionRangeKind } from '../type';

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
    buildCompletionItem(): void;

    /**
     * 生成只含有名字的CompletionItem。
     */
    buildNameCompletionItem(): void;

    /**
     * 生成当前节点的CompletionItem
     */
    buildCompletionItems(): void;

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

}
export class RootNode implements HTMLInfoNode {
    schema = <{ [elementName: string]: Component }>{};
    private completionItems: CompletionItem[] = [];
    private nameCompletionItems: CompletionItem[] = [];
    private directWithNameSet={};
    constructor() { }
    buildCompletionItem() { }
    buildNameCompletionItem() { }
    buildCompletionItems() {
        this.completionItems = Object.values(this.schema).map(element => {
            return element.buildCompletionItem();
        });
        this.nameCompletionItems = Object.values(this.schema).map(element => {
            return element.buildNameCompletionItem();
        });
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
}

export class Component implements HTMLInfoNode {
    protected attributeMap = <{[attrName: string]: Attribute }>{};
    protected nameCompletionItems: CompletionItem[] = [];
    protected completionItems: CompletionItem[] = [];
    protected completionItemKind: CompletionItemKind = CompletionItemKind.Class;
    protected tmwString:MarkupContent|string;
    constructor(protected name: string,
        protected description: string = "",
        protected tmw: string | undefined,
        protected cnName: string | undefined,
        protected attritubes: Attribute[] = [],
    ) { 
        this.tmwString =this.tmw?new MarkUpBuilder().addSpecialContent('typescript',[
            `何时使用：${this.tmw}`,
        ]).getMarkUpContent():"";
        this.completionItemKind = CompletionItemKind.Class;
    }
    getElement(s: string): Component | undefined {
        if (s === this.name) {
            return this;
        }
    }
    addAttritube(attribute: Attribute) {
        this.attritubes.push(attribute);
        this.attributeMap[attribute.getName()] = attribute;
    }
    setDescription(description: string) {
        this.description = description;
    }
    getName() { return this.name; }
    getAttributes() { return this.attritubes; }
    getDescription() { return this.description; }
    getAttribute(attrname: string): Attribute { return this.attributeMap[attrname]; }
    getcompletionKind() { return this.completionItemKind; }

    buildCompletionItems() {
        this.attritubes.forEach(attr => {
            let temp = attr.buildCompletionItem();
            this.completionItems.push(...attr.buildCompletionItem());
        });
        this.nameCompletionItems = this.attritubes.map(attr => {
            return attr.buildNameCompletionItem();
        });
    }
    buildCompletionItem(): CompletionItem {
        this.buildCompletionItems();
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.kind = this.completionItemKind;
        let _insertText: string = this.name;
        let _snippetNum = 1;
        for (let attr of Object.values(this.attributeMap)) {
            if (attr.isNecessary) {
                _insertText += `\n\t${attr.getCompletionItem()?.insertText}`.replace("$1", "$" + _snippetNum + "");
                _snippetNum++;
            }
        }
        if (_snippetNum === 1) {
            _insertText +=">${1}" + `</${this.name}>`;
        }
        else {
            _insertText += `\n>$${_snippetNum}</${this.name}>`;
        }
        _completionItem.insertText = _insertText;
        _completionItem.documentation=this.tmwString,
        _completionItem.detail = this.description;
        _completionItem.insertTextFormat = InsertTextFormat.Snippet;
        _completionItem.preselect = false;
        return _completionItem;
    }
    buildNameCompletionItem(): CompletionItem {
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.detail = this.description;
        _completionItem.documentation=this.tmwString;
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
        let _markUpBuilder = new MarkUpBuilder(this.description + "\n");
        const properties = this.attritubes;
        _markUpBuilder.addSpecialContent('typescript', [
            this.tmw?`何时使用：${this.tmw}`:"",
            ...this.attritubes.map(attr => {
            return attr.getName() + ' :' + attr.getSortDescription();
        })]);
        return { contents: _markUpBuilder.getMarkUpContent() };
    }
}
export class Directive extends Component {
    private hasValueFlag = false;
    constructor(name: string,
        description: string = "",
        tmw: string | undefined,
        cnName: string | undefined,
        attritubes: Attribute[] = [],
    ) {
        super(name, description, tmw, cnName, attritubes);
        this.completionItemKind = CompletionItemKind.Unit;
    }
    //Question:为什么返回值不同会报错
    getcompletionKind() { return this.completionItemKind; }
    buildNameCompletionItem(): CompletionItem {
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.kind = this.completionItemKind;
        _completionItem.detail = this.description;
        _completionItem.documentation = this.tmwString;
        _completionItem.preselect = false;
        if(this.hasValueFlag){
            _completionItem.insertText = `[${this.name}]="$1"`;
            _completionItem.insertTextFormat=InsertTextFormat.Snippet;
            host.HTMLDirectiveSource.insertDirectiveWithArray(this);
        }
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
    constructor(
        private readonly name: string,
        private readonly type: string,
        private readonly defaultValue: string,
        private readonly description: string,
        public readonly isNecessary: boolean,
        private readonly isEvent: boolean,
        private readonly valueSet: string[] = [],
        private readonly sortDescription?: string) {
        this.completionKind = isEvent ? CompletionItemKind.Event : CompletionItemKind.Variable;
    }

    buildCompletionItems() {
        this.valueSet.forEach(value => {
            let completionItem = CompletionItem.create(value);
            completionItem.kind = CompletionItemKind.EnumMember;
            completionItem.insertText = value;
            completionItem.detail = `这是${value}类型`;
            completionItem.documentation = new MarkUpBuilder().addContent("![demo](https://s2.ax1x.com/2020/03/08/3z184H.gif)").getMarkUpContent();
            completionItem.preselect = false;
            this.completionItems.push(completionItem);
        });
        this.nameCompletionItems = this.completionItems;
    }

    buildCompletionItem(): CompletionItem[] {
        this.buildCompletionItems();
        let _result = [];
        // let _completionItem:CompletionItem; 
        if (this.isEvent) {
            _result.push(CompletionItem.create(`(${this.name})`));
        } else if (this.type == STRING) {
            _result.push(CompletionItem.create(`${this.name}`), CompletionItem.create(`[${this.name}]`));
        } else {
            _result.push(CompletionItem.create(`[${this.name}]`));
        }
        _result.forEach((_completionItem) => {
            _completionItem.detail = this.sortDescription;
            _completionItem.documentation = new MarkUpBuilder().addSpecialContent('typescript', [
                `type:${this.type}`,
                "DefaultValue:" + this.getDefaultValue(),
                "Description:" + this.getDescription()]).getMarkUpContent();
            //Question: 是否要统一样式?
            // _completionItem.kind = this.getcompletionKind();
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
        // logger.debug(_result[0]);
        return _result;
    }
    buildNameCompletionItem(): CompletionItem {
        let _completionItem = CompletionItem.create(this.name);
        _completionItem.detail = this.sortDescription;
        _completionItem.kind= this.completionKind;
        _completionItem.documentation = new MarkUpBuilder().addSpecialContent('typescript', [
            `type:${this.type}`,
            "DefaultValue:" + this.getDefaultValue(),
            "Description:" + this.getDescription()]).getMarkUpContent();
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
        let _markUpBuilder = new MarkUpBuilder(this.getName() + "\n");
        _markUpBuilder.addSpecialContent('typescript', ["Description:" + this.description,
        "Type:" + this.getValueType(),
        "DefaultValue:" + this.getDefaultValue(),
        "ValueSet:" + this.valueSet]);
        return { contents: _markUpBuilder.getMarkUpContent() };

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
