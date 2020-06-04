import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit, Range, Hover } from "vscode-languageserver";
import { HTML_SCHEMA as SCHEMA } from './html_source';
import { logger } from '../server';
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
    getNameCompltionItems(range: Range): CompletionItem[];

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

    getNameCompltionItems(range: Range): CompletionItem[] {
        return this.completionItems;
    }
    getFullCompltionItems(range?: Range, kind?: boolean) {
        if (kind) {
            this.completionItems.forEach(e => e.insertText)
        }
        if (range) {
            return this.completionItems.map(_completionItem => {
                _completionItem.textEdit = {
                    range: range,
                    newText: kind ? _completionItem.insertText!.substring(0, _completionItem.insertText!.length - 1) : _completionItem.insertText!
                }
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
    getDirectives(name: string): Directive | undefined {
        const _result = this.getSubNode(name);
        if (_result instanceof Directive) {
            return _result;
        }
        return;
    }
}

export class Component implements HTMLInfoNode {
    protected attributeMap = <{ [attrName: string]: Attribute }>{}
    protected nameCompletionItems: CompletionItem[] = [];
    protected completionItems: CompletionItem[] = [];
    protected completionItemKind: CompletionItemKind = CompletionItemKind.Class;

    constructor(protected name: string,
        protected description: string = "",
        protected tmw: string | undefined,
        protected cnName: string | undefined,
        protected attritubes: Attribute[] = [],
    ) { };
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
            this.completionItems.push(...attr.buildCompletionItem());
        });
        this.nameCompletionItems = this.attritubes.map(attr => {
            return attr.buildNameCompletionItem();
        });
    }


    buildCompletionItem(): CompletionItem {
        this.buildCompletionItems();
        let completionItem = CompletionItem.create(this.name);
        completionItem.kind = CompletionItemKind.Class;
        let _insertText: string = this.name;
        let _snippetNum = 1;
        for (let attr of Object.values(this.attributeMap)) {
            if (attr.isNecessary) {
                _insertText += `\n\t${attr.getCompletionItem()?.insertText}`.replace("$1", "$" + _snippetNum + "");
                _snippetNum++;
            }
        }
        if (_snippetNum === 1) {
            _insertText += ">${1:}" + `</${this.name}>`
        }
        else {
            _insertText += `\n>$${_snippetNum}</${this.name}>`
        }
        completionItem.insertText = _insertText;
        completionItem.detail = `这是一个${this.name}组件`;
        completionItem.insertTextFormat = InsertTextFormat.Snippet;
        return completionItem;
    }
    buildNameCompletionItem(): CompletionItem {
        let _result = CompletionItem.create(this.name);
        _result.detail = `这是一个${this.name}组件`
        return _result;
    }
    getNameCompltionItems() {
        return this.completionItems;
    }
    getFullCompltionItems(currentRange: Range) {
        if (!currentRange) {
            return this.completionItems;
        }
        return this.completionItems.map(_completionItem => {
            _completionItem.textEdit = {
                range: currentRange,
                newText: _completionItem.insertText ? _completionItem.insertText : "",
                // newText :changeInsertDueToCompletionRangeKind(kind,_newText),
            }
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
        _markUpBuilder.addSpecialContent('typescript', this.attritubes.map(attr => {
            return attr.getName() + ' :' + attr.getSortDescription();
        }));
        return { contents: _markUpBuilder.getMarkUpContent() };
    }

}
export class Directive extends Component {
    constructor(name: string,
        description: string = "",
        tmw: string | undefined,
        cnName: string | undefined,
        attritubes: Attribute[] = [],
    ) {
        super(name, description, tmw, cnName, attritubes);
    }
    //Question:为什么返回值不同会报错
    getcompletionKind() { return CompletionItemKind.Module; }
    buildAddCompletionItems() {
        let completionItem = CompletionItem.create(this.name);
        completionItem.kind = CompletionItemKind.Class;
        let _insertText: string = this.name;
        completionItem.insertText = this.name;
        completionItem.detail = `这是一个${this.name}指令`;
        completionItem.insertTextFormat = InsertTextFormat.PlainText;
        return completionItem;
    }
    buildNameCompletionItem(): CompletionItem {
        let _result = CompletionItem.create(this.name);
        _result.detail = `这是一个${name}指令`
        return _result;
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
        this.completionKind = isEvent ? CompletionItemKind.Event : CompletionItemKind.Variable
    }


    buildCompletionItems() {
        this.valueSet.forEach(value => {
            let completionItem = CompletionItem.create(value);
            completionItem.kind = CompletionItemKind.EnumMember;
            completionItem.insertText = value;
            completionItem.detail = `这是${value}类型`;
            completionItem.documentation = new MarkUpBuilder().addContent("![demo](https://s2.ax1x.com/2020/03/08/3z184H.gif)").getMarkUpContent();
            completionItem.preselect = true;
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
        let _result = CompletionItem.create(this.name);
        _result.detail = this.sortDescription;
        _result.documentation = new MarkUpBuilder().addSpecialContent('typescript', [
            `type:${this.type}`,
            "DefaultValue:" + this.getDefaultValue(),
            "Description:" + this.getDescription()]).getMarkUpContent();
        return _result;
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
            _completionAddItem.textEdit = {
                range: range,
                newText: _completionItem.insertText ? _completionItem.insertText : ""
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
        return { contents: _markUpBuilder.getMarkUpContent() }

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
// export class valueNode implements HTMLInfoNode{
//     constructor(){

//     }
//     getSubNodes(){
//         return [];
//     }
//     getHoverInfo(){

//     }
//     getSubNode():undefined{
//         return undefined;
//     }
//     getFullCompltionItems():{

//     }
// }

// export class DevUIParamsConstructor {
//     private readonly rootNode = new RootNode();
//     private schema = this.rootNode.schema;
//     private prefix = "";
//     constructor() { }
//     build(): RootNode {
//         let _elementName: string;
//         SCHEMA.forEach(elementInfo => {
//             const parts = elementInfo.split("||");
//             if (parts.length === 2) {
//                 _elementName = this.prefix + parts[0].toLocaleLowerCase();
//                 this.schema[_elementName] = new Component(_elementName, parts[1]);
//             }
//             else if (parts.length === 3) {
//                 this.prefix = parts[1];
//                 // console.log(_elementName);
//             }
//             else {
//                 // console.log(_elementName);
//                 const _element = this.schema[_elementName];
//                 if (_element.getAttribute(parts[0])) {
//                     // console.log(_element.getName()); 
//                 }
//                 if (_element) {
//                     _element.addAttritube(new Attribute(
//                         parts[0],
//                         parts[1],
//                         parts[2],
//                         parts[3],
//                         parts[4],
//                         parts[5] === "true" ? true : false,
//                         parts[6] === "true" ? true : false,
//                         parts[7] === "[]" ? [] : parts[7].substring(1, parts[7].length - 1).replace(" ", "").split(","),
//                         // JSON.parse(parts[7]),
//                         this.changeToCompletionKind(parts[1], parts[6]),
//                         _element
//                     ));
//                     // console.log(_element.getAttributes()); 
//                 } else {
//                     throw Error(`Something wrong with ${_elementName}`);
//                 }
//             }
//         });
//         this.buildCompletionItems();
//         return this.rootNode;
//     }
//     buildCompletionItems() {
//         this.rootNode.buildCompletionItems();
//         this._buildCompletionItems(this.rootNode);
//     }
//     _buildCompletionItems(node: HTMLInfoNode) {
//         node.buildNameCompletionItem();
//         let subnodes = node.getSubNodes();
//         if (subnodes) {
//             for (let subnode of subnodes) {
//                 this._buildCompletionItems(subnode);
//             }
//         }
//         return;

//     }

//     changeToCompletionKind(type: string, isEvent: string): CompletionItemKind {
//         type = type.toLowerCase();
//         if (isEvent === "true") {
//             return CompletionItemKind.Event;
//         }
//         if (type.includes("arrray") || type.includes("[]")) {
//             return CompletionItemKind.Enum;
//         }
//         return CompletionItemKind.Variable;

//     }
//     getRoot(): HTMLInfoNode {
//         return this.rootNode;
//     }
// }
// export const htmlInfo = new DevUIParamsConstructor();