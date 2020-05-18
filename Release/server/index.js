define(['exports', 'log4js', 'vscode-languageserver', 'vscode-languageserver-textdocument'], function (exports, log4js, vscodeLanguageserver, vscodeLanguageserverTextdocument) { 'use strict';

    /*
     * @Author: your name
     * @Date: 2020-05-10 11:47:06
     * @LastEditTime: 2020-05-13 22:58:15
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \UI_Components_Helper\server\src\DataStructor\tytpe.ts
     */
    class Span {
        /**
         * 开始的和结束范围,使用offset进行标注
         */
        constructor(start, end) {
            this.start = start;
            this.end = end;
            this.toJSON = () => {
                return `[start:${this.start} end:${this.end}]`;
            };
        }
        build(end) {
            this.end = end;
        }
        inSpan(offset) {
            if (!this.end) {
                return false;
            }
            if (offset >= this.start && offset <= this.end) {
                return true;
            }
            return false;
        }
        inCompletionSpan(offset) {
            if (!this.end) {
                return false;
            }
            if (offset >= this.start && offset <= this.end + 1) {
                return true;
            }
            return false;
        }
        selfShift(offset, directive) {
            if (directive) {
                this.start += offset;
                this.end += offset;
            }
            else {
                this.start -= offset;
                this.end -= offset;
            }
        }
        shift(offset, directive) {
            let _span = this.clone();
            _span.selfShift(offset, directive);
            return _span;
        }
        clone() {
            return new Span(this.start, this.end);
        }
    }

    var SupportFrameName;
    (function (SupportFrameName) {
        SupportFrameName[SupportFrameName["Angular"] = 0] = "Angular";
        SupportFrameName[SupportFrameName["Vue"] = 1] = "Vue";
        SupportFrameName[SupportFrameName["React"] = 2] = "React";
    })(SupportFrameName || (SupportFrameName = {}));
    var TokenType;
    (function (TokenType) {
        TokenType[TokenType["TAG_START"] = 0] = "TAG_START";
        TokenType[TokenType["CLOSED_TAG"] = 1] = "CLOSED_TAG";
        TokenType[TokenType["TAG_NAME"] = 2] = "TAG_NAME";
        TokenType[TokenType["TAG_END_NAME"] = 3] = "TAG_END_NAME";
        TokenType[TokenType["TAG_END"] = 4] = "TAG_END";
        TokenType[TokenType["TAG_SELF_END"] = 5] = "TAG_SELF_END";
        //TODO: 如果未来有更多使用我们插件的人，
        //那么这里应该对每一个支持的插件都有对应的MARK Type
        TokenType[TokenType["TEMPLATE"] = 6] = "TEMPLATE";
        TokenType[TokenType["DIRECTIVE"] = 7] = "DIRECTIVE";
        TokenType[TokenType["ATTR_NAME"] = 8] = "ATTR_NAME";
        TokenType[TokenType["ATTR_VALUE_START"] = 9] = "ATTR_VALUE_START";
        TokenType[TokenType["ATTR_VALUE"] = 10] = "ATTR_VALUE";
        TokenType[TokenType["ATTR_VALE_END"] = 11] = "ATTR_VALE_END";
        TokenType[TokenType["COMMENT"] = 12] = "COMMENT";
        TokenType[TokenType["DOCUMENT"] = 13] = "DOCUMENT";
        TokenType[TokenType["EOF"] = 14] = "EOF";
    })(TokenType || (TokenType = {}));
    var NodeStatus;
    (function (NodeStatus) {
        NodeStatus[NodeStatus["DEFAULT"] = 0] = "DEFAULT";
        NodeStatus[NodeStatus["NEW"] = 1] = "NEW";
        NodeStatus[NodeStatus["MODIFIED"] = 2] = "MODIFIED";
        NodeStatus[NodeStatus["DELETE"] = 3] = "DELETE";
    })(NodeStatus || (NodeStatus = {}));
    var TagHeadNodeType;
    (function (TagHeadNodeType) {
        TagHeadNodeType[TagHeadNodeType["DIRECTIVE"] = 0] = "DIRECTIVE";
        TagHeadNodeType[TagHeadNodeType["TEMPLATE"] = 1] = "TEMPLATE";
        TagHeadNodeType[TagHeadNodeType["ATTR"] = 2] = "ATTR";
        TagHeadNodeType[TagHeadNodeType["CONTENT"] = 3] = "CONTENT";
    })(TagHeadNodeType || (TagHeadNodeType = {}));
    /**
     * AST相关
     */
    var HTMLASTNodeType;
    (function (HTMLASTNodeType) {
        HTMLASTNodeType[HTMLASTNodeType["TAG"] = 0] = "TAG";
        HTMLASTNodeType[HTMLASTNodeType["ATTR"] = 1] = "ATTR";
        HTMLASTNodeType[HTMLASTNodeType["ATTR_VALUE"] = 2] = "ATTR_VALUE";
        HTMLASTNodeType[HTMLASTNodeType["DIRECTIVE"] = 3] = "DIRECTIVE";
        HTMLASTNodeType[HTMLASTNodeType["TEMPLATE"] = 4] = "TEMPLATE";
        HTMLASTNodeType[HTMLASTNodeType["COMMENT"] = 5] = "COMMENT";
    })(HTMLASTNodeType || (HTMLASTNodeType = {}));
    var ParseErrorLevel;
    (function (ParseErrorLevel) {
        ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
        ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
    })(ParseErrorLevel || (ParseErrorLevel = {}));
    class TreeError {
        constructor(span, msg, ast, level = ParseErrorLevel.ERROR) {
            this.span = span;
            this.msg = msg;
            this.ast = ast;
            this.level = level;
        }
    }
    var SearchResultType;
    (function (SearchResultType) {
        SearchResultType[SearchResultType["Null"] = 0] = "Null";
        SearchResultType[SearchResultType["Name"] = 1] = "Name";
        SearchResultType[SearchResultType["Value"] = 2] = "Value";
        SearchResultType[SearchResultType["Content"] = 3] = "Content";
    })(SearchResultType || (SearchResultType = {}));

    /*
     * @Author: your name
     * @Date: 2020-04-07 15:11:35
     * @LastEditTime: 2020-05-15 11:44:27
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper-LSP\server\src\parser\chars.ts
     */
    const $BANG = 33;
    const $DQ = 34;
    const $HASH = 35;
    const $SQ = 39;
    const $MINUS = 45;
    const $SLASH = 47;
    const $LT = 60;
    const $EQ = 61;
    const $GT = 62;
    const $BACKSLASH = 92;
    const WhiteChars = [9, 10, 11, 12, 13, 32, 160];
    const WhiteCharsAndGTAndSPLASH = [9, 10, 11, 12, 13, 32, 47, 62, 160];
    const WhiteCharsAndLT = [9, 10, 11, 12, 13, 32, 60, 160];
    const WhiteCharsAndLTAndLTANDSPLASH = [9, 10, 11, 12, 13, 32, 47, 60, 62, 160];
    const Space = [32, 160];
    const newLine = [10, 11, 13];

    /**
     * @license
     * Some of this lexerCode is from Angular/complier.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    class Token {
        constructor(type, start) {
            this.type = type;
            this.start = start;
            this.end = -1;
            this.span = new Span(start, -1);
        }
        build(end) {
            this.end = end;
            this.span = new Span(this.start, end);
        }
        setSpan(start, end) {
            this.span = new Span(start, end);
        }
        getSpan() {
            return this.span;
        }
        getType() {
            return this.type;
        }
        setType(type) {
            this.type = type;
        }
        getValue() {
            return this.value;
        }
    }
    class Tokenizer {
        constructor(textDocument, start = 0, end = textDocument.getText().length) {
            this.textDocument = textDocument;
            this.start = start;
            this.end = end;
            this.result = [];
            this.content = textDocument.getText();
            this.cursor = new Cursor(this.content, start, end);
        }
        Tokenize() {
            /* 初始化 */
            this.result = [];
            try {
                /**
                 * 直到指定的位置或者是文件末尾停下
                 */
                while (this.cursor.offset < this.end) {
                    if (this.tryGet($LT)) {
                        this._tokenInBuild = new Token(TokenType.TAG_START, this.cursor.offset - 1);
                        if (this.tryGet($BANG)) {
                            if (this.tryGet($MINUS)) {
                                this.buildComment();
                            }
                            else {
                                this.buildDocumentTag();
                            }
                        }
                        else if (this.tryGet($SLASH)) {
                            this.buildClosedTag();
                        }
                        else {
                            this.buildOpenTag();
                        }
                    }
                    else {
                        this.cursor.advance();
                    }
                }
            }
            catch (e) {
                this.buildToken();
            }
            this.startToken(TokenType.EOF);
            this.buildToken();
            // ALERT:这仅用于测试！，发行版请去掉以下内容，否则将严重影响性能！
            // this.result.forEach(token=>{
            // 	// logger.debug(this.content.substring(token.getSpan()!.start,token.getSpan()!.end+1));
            // 	if(token.value){
            // 		logger.debug(token.value);
            // 		logger.debug(token.getType().toString());
            // 	}
            // });
            return this.result;
        }
        /**
         * Try家族
         */
        //注意这里有指针移动
        tryGet(char) {
            if (this.cursor.peek() === char) {
                this.cursor.advance();
                return true;
            }
            return false;
        }
        tryAdvanceThrogh(chars) {
            while (chars.includes(this.cursor.peek())) {
                this.cursor.advance();
            }
            return;
        }
        tryStopAt(chars) {
            // if(this._tokenInBuild){
            // 	if([TokenType.ATTR_NAME,TokenType.ATTR_VALUE])
            // }
            while (!chars.includes(this.cursor.peek())) {
                const num = this.cursor.peek();
                this.cursor.advance();
            }
            return;
        }
        tryStopbyFilter(favor, disgust) {
            while (!disgust.includes(this.cursor.peek()) && !favor.includes(this.cursor.peek())) {
                this.cursor.advance();
            }
            //如果是被喜欢的字符截断
            if (favor.includes(this.cursor.peek())) {
                return true;
            }
            //如果是被不应该出现的字符截断
            if (disgust.includes(this.cursor.peek())) {
                return false;
            }
            //如果是因为找不到想要的字符 return true
            return true;
        }
        /**
         * Token工厂家族
         */
        startToken(tokenType) {
            this._tokenInBuild = new Token(tokenType, this.cursor.getoffset());
        }
        //注意我们build的时候取的是offset的前一位
        buildToken() {
            if (this._tokenInBuild) {
                this._tokenInBuild.build(this.cursor.getoffset() - 1);
                //我们仅对应该记录value的token生成value:
                if ([2, 3, 6, 7, 8, 10].indexOf(this._tokenInBuild.getType()) !== -1) {
                    this._tokenInBuild.value = this.content.substring(this._tokenInBuild.getSpan().start, this._tokenInBuild.getSpan().end + 1);
                }
                // else if(this._tokenInBuild.getType()===TokenType.CLOSED_TAG){
                // 	this._tokenInBuild.value = this.content.substring(this._tokenInBuild.getSpan().start+2,this._tokenInBuild.getSpan().end).replace(" ","");
                // }
                this.result.push(this._tokenInBuild);
                if (this._tokenInBuild.getType() === TokenType.TAG_NAME) {
                    if (this._tokenInBuild.value == "script") {
                        const _relocation = this.content.indexOf("</script", this.cursor.offset) ? this.content.indexOf("</script", this.cursor.offset) : this.end;
                        this.cursor.relocate(_relocation);
                    }
                    else if (this._tokenInBuild.value == "style") {
                        const _relocation = this.content.indexOf("</style", this.cursor.offset) ? this.content.indexOf("</style", this.cursor.offset) : this.end;
                        this.cursor.relocate(_relocation);
                    }
                }
                //AlERT:DEbug用，发行版应删除
                // if(this._tokenInBuild.getType()===TokenType.TAG_NAME){
                // 	logger.debug(`Start at ${rangeStartToString(this.textDocument.positionAt( this._tokenInBuild.getSpan().start))  } 
                // 	offset：${this._tokenInBuild.getSpan().start} TokenValue: ${this._tokenInBuild.value} Token Type:${this._tokenInBuild.getType()}`);
                // }
                // if(this._tokenInBuild.getType()===TokenType.TAG_END_NAME){
                // 	logger.debug(`BuildTOken at ${rangeStartToString(this.textDocument.positionAt( this._tokenInBuild.getSpan().start))  } 
                // 	offset：${this._tokenInBuild.getSpan().start} TokenValue: ${this._tokenInBuild.value} Token Type:${this._tokenInBuild.getType()}`);
                // }
                this._tokenInBuild = undefined;
            }
        }
        /**
         * Token装配车间
         */
        buildOpenTag() {
            // this.cursor.advance();
            this.buildToken();
            if (this.cursor.peek() === $GT || this.cursor.peek() === $SLASH) {
                this.buildATTROrEndToken();
                return;
            }
            else {
                this.startToken(TokenType.TAG_NAME);
                //如果关闭的情况下 closeTag
                if (!this.tryStopbyFilter([$GT, $SLASH, $LT], WhiteChars)) {
                    this.buildToken();
                }
                if (this.cursor.peek() === $LT)
                    return;
                while (!this.buildATTROrEndToken()) { }
            }
        }
        buildClosedTag() {
            var _a;
            (_a = this._tokenInBuild) === null || _a === void 0 ? void 0 : _a.setType(TokenType.CLOSED_TAG);
            this.buildToken();
            this.startToken(TokenType.TAG_END_NAME);
            if (this.tryStopbyFilter([$GT], WhiteCharsAndLT)) {
                this.buildToken();
                this.startToken(TokenType.TAG_END);
            }
            else {
                this.buildToken();
                return;
            }
            this.cursor.advance();
            this.buildToken();
            this.buildToken();
        }
        buildATTROrEndToken() {
            if (this.cursor.peek() === $LT) {
                return true;
            }
            if ([$GT, $SLASH].indexOf(this.cursor.peek()) !== -1) {
                this.buildTagSelfClosedToken();
                return true;
            }
            else if (WhiteChars.indexOf(this.cursor.peek()) !== -1) {
                this.cursor.advance();
            }
            else {
                this.buildATTRToken();
            }
            return false;
        }
        buildTagSelfClosedToken() {
            this.buildToken();
            if (this.cursor.peek() === $GT) {
                this.startToken(TokenType.TAG_END);
                this.cursor.advance();
            }
            else if (this.cursor.peek() === $LT) {
                return;
            }
            else if (this.cursor.peek() === $SLASH) {
                this.startToken(TokenType.TAG_SELF_END);
                this.cursor.advance();
                if (!this.tryGet($GT)) {
                    throw Error(`this / does not have a > follw!`);
                }
            }
            this.buildToken();
        }
        buildATTRToken() {
            if (WhiteCharsAndGTAndSPLASH.indexOf(this.cursor.peek()) !== -1) {
                return;
            }
            if (this.cursor.peek() === $HASH) {
                this.startToken(TokenType.TEMPLATE);
            }
            else {
                this.startToken(TokenType.ATTR_NAME);
            }
            if (this.tryStopbyFilter([$EQ], [$GT, $SLASH, $LT, ...WhiteChars])) {
                this.buildToken();
            }
            else {
                this.buildToken();
                return;
            }
            this.startToken(TokenType.ATTR_VALUE_START);
            this.cursor.advance();
            let _QtToken = 34 | 39;
            if (this.tryStopbyFilter([$DQ, $SQ], [$GT, $SLASH, $LT])) {
                _QtToken = this.cursor.peek();
                this.cursor.advance();
                this.buildToken();
            }
            else {
                this.buildToken();
                return;
            }
            this.startToken(TokenType.ATTR_VALUE);
            this.tryStopAt([_QtToken]);
            this.buildToken();
            this.startToken(TokenType.ATTR_VALE_END);
            this.cursor.advance();
            this.buildToken();
        }
        buildElementEndToken() {
            this.startToken(TokenType.TAG_END);
            this.cursor.advance();
            this.buildToken();
        }
        buildComment() {
            this._tokenInBuild = new Token(TokenType.COMMENT, this.cursor.offset - 3);
            let _end = this.content.indexOf("-->", this.cursor.offset);
            this.cursor = new Cursor(this.content, _end + 3, this.cursor.getEOF());
            this.buildToken();
        }
        buildDocumentTag() {
            this._tokenInBuild = new Token(TokenType.DOCUMENT, this.cursor.offset - 2);
            this.tryStopAt([$GT]);
            this.cursor.advance();
            this.buildToken();
        }
    }
    class Cursor {
        constructor(text, offset, EOF) {
            this.text = text;
            this.offset = offset;
            this.EOF = EOF;
            this.peekvalue = -1;
        }
        getoffset() { return this.offset; }
        advance() {
            let peek = this.peek();
            if (peek === $BACKSLASH) {
                this.offset++;
            }
            this.offset++;
            if (this.offset >= this.EOF) {
                throw Error(`Char At EOF At ${this.offset}`);
            }
            this.peekvalue = this.text.charCodeAt(this.offset);
        }
        relocate(offset) {
            this.offset = offset;
            this.peekvalue = this.text.charCodeAt(offset);
        }
        peek() {
            this.peekvalue = this.text.charCodeAt(this.offset);
            return this.text.charCodeAt(this.offset);
        }
        createSpanRight(cursor) {
            return new Span(this.offset, cursor.offset);
        }
        copy() {
            return new Cursor(this.text, this.offset, this.EOF);
        }
        forceAdvance() {
            this.offset++;
        }
        getEOF() {
            return this.EOF;
        }
    }

    class HeadNode {
        constructor(headInfo) {
            this.data = headInfo;
        }
    }
    class LinkNode {
        constructor(element) { this.data = element; }
    }
    /**
     * 这是一个带头结点的链表
     */
    class LinkedList {
        constructor(headInfo) {
            this.toJSON = () => {
                return { info: this.headInfo, array: this.toArray() };
            };
            this.head = new HeadNode(headInfo);
            this.headInfo = this.head.data;
            this.length = 0;
        }
        /**
         * 请使用回调函数改变头节点内容。
         * @param cb 回调函数
         */
        changeHeadValue(cb) {
            cb.call(this.head);
        }
        getHeadData() {
            return this.head.data;
        }
        getEnd() {
            if (this.end) {
                return this.end.data;
            }
            return;
        }
        insertNode(newElement, node) {
            let _newnode = new LinkNode(newElement);
            if (node) {
                let p = node.next;
                node.next = _newnode;
                _newnode.pre = node;
                _newnode.next = p;
                if (p) {
                    p.pre = _newnode;
                }
            }
            else {
                if (this.end) {
                    this.end.next = _newnode;
                    _newnode.pre = this.end;
                }
                else {
                    this.head.next = _newnode;
                    _newnode.pre = this.head;
                }
                this.end = _newnode;
            }
            //调整控制域
            this.head.data.span;
            this.length++;
            //Question 为什么不可以添加属性？
            // newElement['linkListNode'] = _newnode;
            return _newnode;
        }
        insetLinkList(list, node) {
            if (!list.end) {
                return;
            }
            if (this.end) {
                if (node) {
                    let p = node.next;
                    node.next = list.head.next;
                    list.head.next.pre = node;
                    if (p)
                        p.pre = list.end;
                }
                else {
                    if (this.end) {
                        this.end.next = list.head.next;
                        list.head.next.pre = this.end;
                    }
                    else {
                        this.head.next = list.head.next;
                        list.head.pre = this.head;
                    }
                }
                this.end = list.end;
                this.length += list.length;
            }
        }
        getElement(cb, param) {
            let _node = this.head.next;
            if (this.length <= 0 || (!cb && !param)) {
                return;
            }
            if (!param && cb) {
                while (_node) {
                    if (cb(_node.data)) {
                        return _node.data;
                    }
                    _node = _node.next;
                }
            }
            else if (!cb && param) {
                while (_node) {
                    if (this.objectDeepEqual(param, _node.data)) {
                        return _node.data;
                    }
                    _node = _node.next;
                }
            }
            else {
                while (_node) {
                    if (cb(_node.data) && this.objectDeepEqual(param, _node.data))
                        return _node.data;
                    _node = _node.next;
                }
            }
            return;
        }
        //TODO: 完成function函数
        filter(fun) {
        }
        get(param) {
            let _node = this.head.next;
            while (_node != null && param > 0) {
                _node = _node.next;
            }
            if (_node === null) {
                throw Error(`IndecOutOfArrayException!!!!`);
            }
            return _node;
        }
        toArray() {
            let res = [];
            let _node = this.head.next;
            while (_node != null) {
                res.push(_node.data);
                _node = _node.next;
            }
            return res;
        }
        getEach(cb) {
            if (!cb) {
                return [];
            }
            let _result = [];
            let _node = this.head.next;
            while (_node) {
                _result.push(cb(_node.data));
                _node = _node.next;
            }
            return _result;
        }
        /**
         * 整个链表都会遵从action进行改变，
         * 注意这里面传的是对于节点中元素(element的操作)，
         * 这个操作不会改变链表结构
         * @param action
         */
        changeNodeWithAction(action, node) {
            let _node = this.head.next;
            if (node) {
                _node = node;
            }
            while (_node != null) {
                action(_node.data);
                _node = _node.next;
            }
        }
        /**
         * 从某一位开始 将此后的元素做一些操作后
         * 插入到队首，之后返回操作是否有成功进行。
         * 这是为了实现git式版本管理的delete类型操作。
         * @param node 从这个节点开始。
         * @param action 操作的回调函数
         */
        popAndShiftWithAction(node, action) {
            let _node = node;
            while (_node === null || _node === void 0 ? void 0 : _node.next) {
                if (action) {
                    if (!action(_node.data)) {
                        return false;
                    }
                }
                _node = _node.next;
            }
            if (action) {
                if (!action(_node.data)) {
                    return false;
                }
            }
            node.pre.next = undefined;
            _node.pre = this.head;
            let p = this.head.next;
            this.head.next = node;
            _node.next = p;
            p.pre = _node;
            return true;
        }
        objectDeepEqual(obj1, obj2) {
            if (obj1 && typeof obj1 === "object" && obj2 && typeof obj2 === 'object') {
                if (Array.isArray(obj1) && !Array.isArray(obj2)) {
                    return false;
                }
                if (!Array.isArray(obj1) && Array.isArray(obj2)) {
                    return false;
                }
                for (let key in obj1) {
                    if (obj1.hasOwnProperty(key)) {
                        if (!obj2.hasOwnProperty(key)) {
                            return false;
                        }
                    }
                }
                for (let key in obj2) {
                    if (obj2.hasOwnProperty(key)) {
                        if (!obj1.hasOwnProperty(key)) {
                            return false;
                        }
                    }
                }
                for (let key in obj1) {
                    if (obj1.hasOwnProperty(key)) {
                        if (this.objectDeepEqual(obj1[key], obj2[key])) {
                            return false;
                        }
                    }
                }
                return true;
            }
            else {
                return obj1 == obj2;
            }
        }
        unshift() {
            var _a;
            if (this.length > 0) {
                let _nodedata = (_a = this.head.next) === null || _a === void 0 ? void 0 : _a.data;
                this.head.next = this.head.next.next;
                if (this.head.next) {
                    this.head.next.pre = this.head;
                }
                this.length--;
                return _nodedata;
            }
        }
    }

    const tagTokenTypesSet = new Set([
        TokenType.ATTR_NAME,
        TokenType.ATTR_VALE_END,
        TokenType.ATTR_VALUE,
        TokenType.ATTR_VALUE_START,
        TokenType.DIRECTIVE,
        TokenType.TEMPLATE,
        TokenType.COMMENT,
    ]);
    const attrTypesSet = new Set([
        TokenType.ATTR_NAME,
        TokenType.DIRECTIVE,
        TokenType.TEMPLATE,
    ]);
    class TreeBuilder {
        // currentSpan: Span | undefined;
        constructor(tokens) {
            this.tokens = tokens;
            this.index = 0;
            this.buildStack = [];
            this.currentSpan = new Span(-1, -1);
            this.currentToken = new Token(TokenType.DOCUMENT, -1);
            this.roots = [];
            this.errors = [];
            this.root = new HTMLTagAST(new Span(0, 0), "$$ROOT$$");
        }
        build() {
            if (this.tokens.length < 1) {
                return { root: this.root, errors: [] };
            }
            this.init();
            this.buildStack.push(this.root);
            try {
                while (this.currentToken.getType() !== TokenType.EOF) {
                    /* build element */
                    if (this.currentToken.getType() === TokenType.TAG_START) {
                        this.buildNewTag();
                    }
                    else if (this.currentToken.getType() === TokenType.CLOSED_TAG) {
                        this.closeTagContent();
                    }
                    else if (this.currentToken.getType() === TokenType.COMMENT) {
                        this.buildComment();
                    }
                    else {
                        this.advance();
                    }
                }
            }
            catch (e) {
                logger.debug(e);
            }
            this.buildRoot();
            return { root: this.root, errors: this.errors };
        }
        /**
         * TAG相关
         */
        buildNewTag() {
            if (this.tagInBuld) {
                //TODO: 这里面要加上一个属性关闭的函数。
                this.closeTagInBuild();
                // this.tagInBuld.linkListPointer = this.getStackpeek().getTagLists()?.content.insertNode(this.tagInBuld);
                // this.tagInBuld = undefined;
            }
            this.tagInBuld = new HTMLTagAST(this.currentSpan);
            this.tagInBuld.buildLinkedLists();
            this.advance();
            if (this.currentToken.getType() === TokenType.TAG_NAME) {
                this.setNodeName(this.currentSpan, this.currentToken.value);
                if (this.currentToken.value == "script" || this.currentToken.value == "style") {
                    this.buildStack.push(this.tagInBuld);
                    this.tagInBuld = undefined;
                    return;
                }
                this.advance();
            }
            while (tagTokenTypesSet.has(this.currentToken.getType())) {
                //build inner ATTR 
                if (attrTypesSet.has(this.currentToken.getType())) {
                    this.startNewATTR();
                }
                else {
                    if (this.attrInBuild) {
                        if (this.currentToken.getType() === TokenType.ATTR_VALUE) {
                            this.addValueNode();
                        }
                    }
                    else {
                        throw Error(`we need to add something into attr ,but we cannot find at ${this.currentSpan.start}`);
                    }
                }
                this.advance();
            }
            if (this.currentToken.getType() === TokenType.TAG_END || this.currentToken.getType() === TokenType.TAG_SELF_END) {
                this.closeTagInBuild(this.currentSpan.end);
                this.advance();
            }
            else {
                return;
            }
        }
        closeTagContent() {
            if (this.tagInBuld) {
                this.closeTagInBuild();
            }
            let _contentEnd = this.currentSpan.start - 1;
            this.advance();
            if (this.currentToken.getType() !== TokenType.TAG_END_NAME) {
                return;
            }
            let _closeTagName = this.currentToken.value;
            if (!_closeTagName) {
                this.errors.push(new TreeError(this.currentSpan, `this closed tag cannot find its content!!`, this.getStackpeek(), ParseErrorLevel.ERROR));
                return;
            }
            let _cursor = -1;
            for (let i = this.buildStack.length - 1; i > 0; i--) {
                if (_closeTagName == this.buildStack[i].getName()) {
                    _cursor = i;
                    break;
                }
            }
            if (_cursor !== -1) {
                this.advance();
                while (this.buildStack.length > _cursor) {
                    _contentEnd = this.buildStack.pop().closeContent(_contentEnd, _contentEnd + _closeTagName.length + 1);
                }
            }
            else {
                this.errors.push(new TreeError(this.currentSpan, `this closed tag cannot find its Open tag!!`, this.getStackpeek(), ParseErrorLevel.ERROR));
            }
            this.advance();
        }
        setNodeName(span, name) {
            var _a;
            name = name ? name : "";
            (_a = this.tagInBuld) === null || _a === void 0 ? void 0 : _a.setName(name, span);
            this.tagInBuld.getSpan().end = span.end;
        }
        /**
         * 关闭标签 start content.
         * @param end
         */
        closeTagInBuild(end) {
            this.buildAttr();
            if (!this.tagInBuld) {
                throw Error(`this tag does not have lists, please check parser!!!`);
            }
            else {
                this.tagInBuld.closeTag(end);
                // this.tagInBuld!.parentPointer = this.getStackpeek();
                this.addToList(this.getStackpeek().content, this.tagInBuld);
                let _content = this.tagInBuld.content;
                if (this.currentToken.getType() === TokenType.TAG_END) {
                    this.tagInBuld.domain.end = this.currentSpan.end;
                    _content.headInfo.span.start = this.currentSpan.end + 1;
                    this.buildStack.push(this.tagInBuld);
                }
                else {
                    _content.headInfo.span = new Span(-1, -1);
                }
                this.currentSpan.selfShift(this.tagInBuld.tagOffset, true);
                this.tagInBuld = undefined;
            }
        }
        /**
         * 将tag正常关闭 之后插入栈中。
         * @param end
         */
        buildTag(end) {
        }
        buildRoot() {
            let _endOfTokens = this.currentSpan.end;
            if (this.attrInBuild) {
                this.buildAttr();
            }
            if (this.tagInBuld) {
                _endOfTokens += this.tagInBuld.tagOffset;
                this.closeTagInBuild();
            }
            while (this.buildStack.length > 0) {
                _endOfTokens = this.buildStack.pop().closeContent(_endOfTokens, _endOfTokens);
            }
        }
        /**
         * 注释
         */
        buildComment() {
            let _commentAST = new HTMLAST(HTMLASTNodeType.COMMENT, this.currentSpan);
            if (this.tagInBuld) {
                this.addToList(this.tagInBuld.attrList.comment, _commentAST);
            }
            this.addToList(this.getStackpeek().content, _commentAST);
            this.advance();
        }
        /**
         * 属性相关
         */
        //开始的时候我们并没有把它插入到链表之中
        startNewATTR() {
            this.buildLastAttr();
            if (this.currentToken.getType() === TokenType.TEMPLATE) {
                this.attrInBuild = new HTMLATTRAST(HTMLASTNodeType.TEMPLATE, this.currentSpan, this.currentToken.value);
            }
            else {
                this.attrInBuild = new HTMLATTRAST(HTMLASTNodeType.ATTR, this.currentSpan, this.currentToken.value);
            }
        }
        addValueNode() {
            var _a;
            let _valueNode = new HTMLAST(HTMLASTNodeType.ATTR_VALUE, this.currentSpan, this.currentToken.value);
            (_a = this.attrInBuild) === null || _a === void 0 ? void 0 : _a.addValueNode(_valueNode);
        }
        buildAttr() {
            var _a, _b, _c, _d, _e;
            if (!this.attrInBuild) {
                return;
            }
            if (this.attrInBuild.getType() === HTMLASTNodeType.TEMPLATE) {
                this.addToList(((_a = this.tagInBuld) === null || _a === void 0 ? void 0 : _a.getTagLists()).template, this.attrInBuild);
            }
            else if ((_b = this.attrInBuild) === null || _b === void 0 ? void 0 : _b.valueNode) {
                this.addToList(((_c = this.tagInBuld) === null || _c === void 0 ? void 0 : _c.getTagLists()).attr, this.attrInBuild);
            }
            else {
                (_d = this.attrInBuild) === null || _d === void 0 ? void 0 : _d.setType(HTMLASTNodeType.DIRECTIVE);
                this.addToList(((_e = this.tagInBuld) === null || _e === void 0 ? void 0 : _e.getTagLists()).directive, this.attrInBuild);
            }
            this.attrInBuild = undefined;
        }
        /**
         * 返回栈顶元素。
         */
        getStackpeek() {
            return this.buildStack[this.buildStack.length - 1];
        }
        adjustSpan() {
            for (let ast of this.buildStack) {
                this.currentSpan.selfShift(ast.tagOffset, false);
            }
            if (this.tagInBuld) {
                this.currentSpan.selfShift(this.tagInBuld.tagOffset, false);
            }
        }
        /**
         * 工具函数
         */
        addToList(list, node) {
            if (!node) {
                throw Error(`the Node is undefined at list${list.toString()}`);
            }
            if (list.length === 0 && !(node instanceof HTMLTagAST)) {
                list.headInfo.span.start = node.getSpan().start;
            }
            node.linkListPointer = list.insertNode(node);
            if (!(node instanceof HTMLTagAST)) {
                node.parentPointer = this.tagInBuld;
                list.headInfo.span.end = node.getSpan().end;
            }
            else {
                node.parentPointer = this.getStackpeek();
                list.headInfo.span.end = node.getSpan().end + node.tagOffset;
            }
        }
        buildLastAttr() {
            if (this.attrInBuild) {
                this.buildAttr();
                this.attrInBuild = undefined;
            }
        }
        init() {
            this.currentSpan = this.currentToken.getSpan();
            let _tokentype = this.currentToken.getType();
            this.currentToken = this.tokens[0];
        }
        advance() {
            if (this.index < this.tokens.length)
                this.currentToken = this.tokens[++this.index];
            else {
                throw Error(`this is the last!!!`);
            }
            this.currentSpan = this.currentToken.getSpan();
            this.adjustSpan();
            if (this.currentToken.getType() === TokenType.COMMENT) {
                let _commentAst = new HTMLAST(HTMLASTNodeType.COMMENT, this.currentSpan);
                this.getStackpeek().attrList.comment.insertNode(_commentAst);
                this.advance();
            }
        }
    }
    class HTMLAST {
        //2020/5/11 应该把tag和普通的HTMLAST区分开来
        constructor(type, nodeSpan, name, parentPointer) {
            this.type = type;
            this.nodeSpan = nodeSpan;
            this.name = name;
            this.parentPointer = parentPointer;
            this.status = NodeStatus.DEFAULT;
            // parentPointer:HTMLAST|undefined;
            this.nameSpan = new Span(-1, -1);
            this.toJSON = () => {
                return {
                    nameSpan: `name:${this.name} namespan:${this.nameSpan.toJSON()}`,
                };
            };
            this.parentPointer = parentPointer;
        }
        getSpan() { return this.nodeSpan; }
        getName() {
            return this.name;
        }
        setName(name, nameSpan) {
            this.name = name;
            this.nameSpan = nameSpan;
        }
        getType() {
            return this.type;
        }
        setType(type) {
            this.type = type;
        }
        //普通的节点只需要检查span
        search(offset) {
            return { ast: undefined, type: this.type === HTMLASTNodeType.COMMENT ? SearchResultType.Null : SearchResultType.Name };
        }
        getSearchResultKind() {
            // switch(this.type){
            // 	case(HTMLASTNodeType.)
            // }
        }
    }
    class HTMLTagAST extends HTMLAST {
        // attrLists :LinkNode<HTMLAST>|undefined;
        constructor(domain, name, parentPointer) {
            super(HTMLASTNodeType.TAG, domain, name, parentPointer);
            this.toJSON = () => {
                return {
                    nodeSpan: this.nodeSpan,
                    domain: this.domain,
                    nameSpan: `name:${this.name} namespan:${this.nameSpan.toJSON()}`,
                    content: this.content,
                    lists: this.attrList,
                    tagOffset: this.tagOffset
                };
            };
            this.content = new LinkedList({ name: "content", span: new Span(-1, -1) });
            this.buildLinkedLists();
            this.tagOffset = domain.start;
            this.nodeSpan.selfShift(this.tagOffset, false);
            this.domain = this.nodeSpan.clone();
        }
        buildLinkedLists() {
            let _directive = new LinkedList({ name: "directive", span: new Span(-1, -1) });
            let _template = new LinkedList({ name: "template", span: new Span(-1, -1) });
            let _attr = new LinkedList({ name: "attribute", span: new Span(-1, -1) });
            let _comment = new LinkedList({ name: "comment", span: new Span(-1, -1) });
            this.attrList = {
                directive: _directive,
                template: _template,
                attr: _attr,
                comment: _comment
            };
        }
        findATTREnd() {
            if (this.type !== HTMLASTNodeType.TAG) {
                return -1;
            }
            return Math.max(this.attrList.attr.headInfo.span.end, this.attrList.template.headInfo.span.end, this.attrList.directive.headInfo.span.end, this.content.headInfo.span.end, this.nameSpan.end);
        }
        closeContent(contentEnd, end) {
            this.content.headInfo.span.end = contentEnd;
            this.domain.end = end;
            return end + this.tagOffset;
        }
        closeTag(end) {
            let _end = this.findATTREnd();
            this.nodeSpan.end = end ? end : _end;
            this.domain.end = end ? end : _end;
        }
        getTagLists() {
            return this.attrList;
        }
        getDomain() {
            return this.domain;
        }
        search(offset) {
            // offset -= this.tagOffset;
            // if(!this.domain.inSpan(offset)){
            // 	return{ast:undefined,type:SearchResultType.Null};
            // }
            if (!this.name || this.nameSpan.inSpan(offset)) {
                return { ast: undefined, type: SearchResultType.Name };
            }
            if (this.nodeSpan.inSpan(offset)) {
                for (let listName in this.attrList) {
                    let _list = this.attrList[listName];
                    if (!_list.headInfo.span.inSpan(offset)) {
                        continue;
                    }
                    else {
                        let _result = _list.getElement((param) => {
                            return param.getSpan().inSpan(offset);
                        });
                        if (_result) {
                            return { ast: _result, type: SearchResultType.Null };
                        }
                    }
                }
                return { ast: undefined, type: SearchResultType.Value };
            }
            if (this.content.headInfo.span.inSpan(offset)) {
                let _result = this.content.getElement((param) => {
                    if (param instanceof HTMLTagAST) {
                        return param.getDomain().inSpan(offset - param.tagOffset);
                    }
                });
                return _result ? { ast: _result, type: SearchResultType.Null } : { ast: undefined, type: SearchResultType.Content };
            }
            return { ast: undefined, type: SearchResultType.Null };
        }
    }
    class HTMLATTRAST extends HTMLAST {
        constructor(type, span = new Span(-1, -1), name, parentPointer) {
            super(type, span, name, parentPointer);
            this.toJSON = () => {
                return {
                    nameSpan: `name:${this.name} namespan:${this.nameSpan.toJSON()}`,
                    valueNode: this.valueNode,
                    span: this.nodeSpan,
                };
            };
            this.nameSpan = span.clone();
        }
        addValueNode(node) {
            this.nodeSpan.end = node.getSpan().end;
            this.valueNode = node;
            node.parentPointer = this;
            this.valueNode.nameSpan = this.valueNode.getSpan();
        }
        search(offset) {
            var _a;
            if (this.nameSpan.inSpan(offset)) {
                return { ast: undefined, type: SearchResultType.Name };
            }
            if ((_a = this.valueNode) === null || _a === void 0 ? void 0 : _a.getSpan().inSpan(offset)) {
                return { ast: this.valueNode, type: SearchResultType.Null };
            }
            return { ast: undefined, type: SearchResultType.Null };
        }
    }
    class HTMLCommentAST extends HTMLAST {
        constructor(span) {
            super(HTMLASTNodeType.COMMENT, span ? span : new Span(-1, -1));
        }
    }

    /*
     * @Author: your name
     * @Date: 2020-04-15 14:26:49
     * @LastEditTime: 2020-05-15 16:44:35
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper-LSP\server\src\type.ts
     */
    var CompletionRangeKind;
    (function (CompletionRangeKind) {
        CompletionRangeKind[CompletionRangeKind["NONE"] = 0] = "NONE";
        CompletionRangeKind[CompletionRangeKind["ADD"] = 1] = "ADD";
        CompletionRangeKind[CompletionRangeKind["INOUTPUT"] = 2] = "INOUTPUT";
        CompletionRangeKind[CompletionRangeKind["INPUT"] = 3] = "INPUT";
        CompletionRangeKind[CompletionRangeKind["OUTPUT"] = 4] = "OUTPUT";
        CompletionRangeKind[CompletionRangeKind["TAG"] = 5] = "TAG";
    })(CompletionRangeKind || (CompletionRangeKind = {}));
    var CompletionType;
    (function (CompletionType) {
        CompletionType[CompletionType["Name"] = 0] = "Name";
        CompletionType[CompletionType["FUll"] = 1] = "FUll";
        CompletionType[CompletionType["NONE"] = 2] = "NONE";
    })(CompletionType || (CompletionType = {}));
    var FileType;
    (function (FileType) {
        FileType[FileType["HTML"] = 0] = "HTML";
        FileType[FileType["TypeScript"] = 1] = "TypeScript";
    })(FileType || (FileType = {}));
    // export const ATTRREGX = /^(?:\[\(([^\)]*)\)\]|\[([^\]]*)\]|\(([^\)]*)\))$/;
    // const INPUTREG = /\[([^\)]*)\]/
    // const OUTPUT =/\(([^\)]*)\)/
    // const INOUTPUTREG = /\[\(([^\)]*)\)\]/
    // const ADD = /\+[a-zA-z]/

    /*
     * @Author: your name
     * @Date: 2020-03-29 11:52:31
     * @LastEditTime: 2020-05-15 16:48:11
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper\src\util.ts
     */
    function convertStringToName(name) {
        let bananaset = ['[', ']', '(', ')'];
        for (let banana of bananaset) {
            name = name.replace(banana, "");
        }
        return name;
    }
    /**
     * c1=>c2
     * @param c1
     * @param c2
     */
    function copyCompletionItem(c1, c2) {
        c2.insertText = c1.insertText;
        c2.kind = c1.kind;
        c2.detail = c1.detail;
        c2.documentation = c1.documentation;
        c2.insertTextFormat = c1.insertTextFormat;
    }
    function converValueSetToValueString(valueSet) {
        if (valueSet === [])
            return "";
        let res = "";
        for (let value of valueSet) {
            let _value = value.replace(" ", "");
            if (_value !== "")
                res += `\'${_value}\',`;
        }
        return res == "" ? "" : `|${res.substring(0, res.length - 1)}|`;
    }
    class MarkUpBuilder {
        constructor(content) {
            this.markUpContent = { kind: vscodeLanguageserver.MarkupKind.Markdown, value: content ? content : "" };
        }
        getMarkUpContent() {
            return this.markUpContent;
        }
        addContent(content) {
            this.markUpContent.value += content;
            return this;
        }
        addSpecialContent(type, content) {
            this.markUpContent.value +=
                [
                    '```' + type,
                    ...content,
                    '```'
                ].join('\n');
            return this;
        }
    }
    function convertSpanToRange(textDocument, span) {
        if (!span) {
            return;
        }
        let _start = textDocument.positionAt(span.start);
        let _end = textDocument.positionAt(span.end);
        return { start: _start, end: _end };
    }
    function adjustSpanToAbosulutOffset(node, span) {
        _adjustSpanToAbosultOffset(node, span);
        span.end++;
    }
    function _adjustSpanToAbosultOffset(node, span) {
        if (node.getName() != "$$ROOT$$") {
            if (node instanceof HTMLTagAST) {
                span.selfShift(node.tagOffset, true);
            }
            _adjustSpanToAbosultOffset(node.parentPointer, span);
        }
    }

    /*
     * @Author: your name
     * @Date: 2020-04-06 16:17:11
     * @LastEditTime: 2020-05-16 15:26:32
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper-LSP\server\src\source\html_source.ts
     */
    /*
     * @Author: your name
     * @Date: 2020-04-03 16:00:53
     * @LastEditTime: 2020-04-06 16:17:41
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper\src\html_source.ts
     */
    const HTML_SCHEMA = [
        "DevUI组件库||d-||NoPicture",
        "accordion||这是一个accordion组件",
        "data||Array<any>或AccordionMenuType||null||数据源||必选，数据源，可以自定义数组或者使用预设的AccordionMenuType||true||false||[]",
        "titleKey||string||title||标题的属性名||可选，标题的属性名，item[titleKey]类型为string，为标题显示内容||false||false||[]",
        "loadingKey||string||loading||子菜单是否加载中的判断属性名||可选，子菜单是否加载中的判断属性名，item[loadingKey]类型为boolean||false||false||[]",
        "childrenKey||string||children||子菜单的属性名||可选，子菜单的属性名，item[childrenKey]类型为Array<any>||false||false||[]",
        "disabledKey||string||disabled||是否禁用的属性名||可选，是否禁用的属性名，item[disabledKey]类型为boolean||false||false||[]",
        "activeKey||string||active||子菜单是否激活的属性名||可选，子菜单是否激活的属性名，item[activeKey]类型为boolean||false||false||[]",
        "openKey||string||open||菜单是否展开的属性名||可选，菜单是否展开的属性名，item[openKey]类型为boolean||false||false||[]",
        "restrictOneOpen||boolean||false||限制一级菜单同时只能打开一个||可选，限制一级菜单同时只能打开一个，默认不限制||false||false||[]",
        "menuItemTemplate||TemplateRef<any>||内置||可展开菜单内容条模板||可选，可展开菜单内容条模板，可用变量值见下||false||false||[]",
        "itemTemplate||TemplateRef<any>||内置||可点击菜单内容条模板||可选，可点击菜单内容条模板，可用变量值见下||false||false||[]",
        "noContentTemplate||TemplateRef<any>||内置||没有内容的时候使用自定义模板||可选，没有内容的时候使用自定义模板，可用变量值见下||false||false||[]",
        "loadingTemplate||TemplateRef<any>||内置||加载中使用自定义模板||可选，加载中使用自定义模板，可用变量值见下||false||false||[]",
        "innerListTemplate||TemplateRef<any>||内置||子列表内容完全自定义||可选，子列表内容完全自定义，用做折叠面板，可用变量值见下||false||false||[]",
        "linkType||string||||routerLink为路由场景；hrefLink为外部链接场景；dependOnLinkTypeKey为动态路由或外部链接场景；为默认非链接类型（无法右键打开新标签页）||可选，routerLink为路由场景；hrefLink为外部链接场景；dependOnLinkTypeKey为动态路由或外部链接场景；为默认非链接类型（无法右键打开新标签页）||false||false||[routerLink, hrefLink, dependOnLinkTypeKey]",
        "linkKey||string||link||链接内容的key||可选，链接内容的key，用于linkType为连接类型记非时，链接的取值的属性值，item[linkKey]为路由地址或者超链接地址||false||false||[]",
        "linkTargetKey||string||target||链接目标窗口的key||可选，链接目标窗口的key，用于链接类型，item[linkTargetKey]为单个链接的目标窗口||false||false||[]",
        "linkDefaultTarget||string||_self||不设置target的时候target默认值||可选，不设置target的时候target默认值，用于链接类型||false||false||[]",
        "autoOpenActiveMenu||boolean||false||是否自动展开带有活跃子项的菜||可选，是否自动展开带有活跃子项的菜||false||false||[]",
        "menuToggle||EventEmitter<AccordionMenuToggleEvent>||null||可展开菜单展开事件||可选，可展开菜单展开事件，返回对象里属性item为点击的对象数据，open为true则将要展开false则将要关闭，parent为父对象数据，event为点击事件的原生事件||false||true||[]",
        "itemClick||EventEmitter<AccordionItemClickEvent>||null||可点击菜单点击事件||可选，可点击菜单点击事件，返回对象里属性item为点击的对象数据，preActive对象为上一次展开的对象，parent为父对象数据，event为点击事件的原生事件||false||true||[]",
        "activeItemChange||EventEmitter<any>||null||子项切换的时候会发出新激活的子项的数据||可选，子项切换的时候会发出新激活的子项的数据||false||true||[]",
        "alert||这是一个alert组件",
        "type||string||info||指定警告提示的样||必选，指定警告提示的样||true||false||[success, danger, warning, info]",
        "cssClass||string||null||自定义class名||可选，自定义class名||false||false||[]",
        "closeable||boolean||true||默认显示关闭按钮||可选，默认显示关闭按钮||false||false||[]",
        "dismissTime||number||null||自动关闭alert的延迟时间单位：ms||可选，自动关闭alert的延迟时间单位：ms||false||false||[]",
        "showIcon||boolean||true||是否使用默认的类型图标||可选，是否使用默认的类型图标||false||false||[]",
        "closeEvent||EventEmitter<any>||null||关闭时触发的回调函数||可选，关闭时触发的回调函数||false||true||[]",
        "avatar||这是一个avatar组件",
        "name||string||null||传入字符串用于制作头像||必选，传入字符串用于制作头像||true||false||[]",
        "gender||string||null||传入string可以是female or male的任意大小写形式||可选，根据性别区分头像颜色,传入string可以是female or male的任意大小写形式||false||false||[male, female]",
        "width||number||40||单位为px||可选，设定头像的宽度,单位为px||false||false||[]",
        "height||number||40||单位为px||可选，设定头像的高度,单位为px||false||false||[]",
        "isRound||boolean||true||是否显示为圆形头像||可选，是否显示为圆形头像||false||false||[]",
        "imgSrc||string||null||传入自定义图片作为头像||可选，传入自定义图片作为头像||false||false||[]",
        "customText||string||null||传入自定义显示文字||可选，传入自定义显示文字||false||false||[]",
        "breadcrumb||这是一个breadcrumb组件",
        "showMenu||boolean||false||是否需要显示下拉箭头及下拉列表内容||可选，是否需要显示下拉箭头及下拉列表内容||false||false||[]",
        "menuList||Array<MenuConfig>||null||showMenu为true时传入||可选，showMenu为true时传入，下拉列表的显示内容||false||false||[]",
        "isSearch||boolean||false||showMenu为true时传入||可选，showMenu为true时传入，下拉列表是否需要搜索功能||false||false||[]",
        "customMenuTemplate||TemplateRef<any>||null||showMenu为true时传入||可选，showMenu为true时传入，自定义下拉列表||false||false||[]",
        "toggleEvent||EventEmitter<any>||null||返回值为当前菜单是否打开||dropdown菜单展开和收起的事件，返回值为当前菜单是否打开||false||true||[]",
        "separatorIcon||TemplateRef<any>||/||自定义分隔符样式||可选，自定义分隔符样式||false||false||[]",
        "source||Array<SourceConfig>||[]||面包屑根据配置的source按照默认渲染方式显示||可选，面包屑根据配置的source按照默认渲染方式显示||false||false||[]",
        "button||这是一个button组件",
        "id||string||null||buttonid||可选，buttonid||false||false||[]",
        "type||IButtonType||button||类型button or submit or reset||可选，类型button or submit or reset||false||false||[]",
        "bsStyle||IButtonStyle||primary||风格primary or common or text or text-dark||可选，风格primary or common or text or text-dark||false||false||[]",
        "bsSize||IButtonSize||md||大小lg or md or sm or xs||可选，大小lg or md or sm or xs||false||false||[]",
        "bordered||boolean||false||是否有边框||可选，是否有边框||false||false||[]",
        "icon||string||null||自定义按钮图标||可选，自定义按钮图标||false||false||[]",
        "showLoading||boolean||false||是否显示加载提示||可选，是否显示加载提示||false||false||[]",
        "width||number||null||button宽度||可选，button宽度||false||false||[]",
        "disabled||boolean||false||是否禁用button||可选，是否禁用button||false||false||[]",
        "autofocus||boolean||false||按钮加载时是否自动获得焦点||可选，按钮加载时是否自动获得焦点||false||false||[]",
        "btnClick||EventEmitter<any>||null||返回点击下后鼠标事件对象||可选，button点击事件，解决IE浏览器disabled还会触发click,返回点击下后鼠标事件对象||false||true||[]",
        "checkbox||这是一个checkbox组件",
        "name||string||null||表单域名||可选，表单域名，input原生name属性||false||false||[]",
        "label||string||null||显示标签||可选，显示标签||false||false||[]",
        "isShowTitle||boolean||true||是否显示title提示||可选，是否显示title提示||false||false||[]",
        "disabled||boolean||false||是否禁用||可选，是否禁用||false||false||[]",
        "labelTemplate||TemplateRef||null||标签的自定义模板||可选，标签的自定义模板||false||false||[]",
        "halfchecked||boolean||false||半选状态||可选，半选状态||false||false||[]",
        "color||string||null||复选框颜色||可选，复选框颜色||false||false||[]",
        "showAnimation||boolean||true||控制是否显示动画||可选，控制是否显示动画||false||false||[]",
        "change||EventEmitter<boolean>||null||值是当前状态||复选框的值改变时发出的事件，值是当前状态||false||true||[]",
        "name||string||null||表单域名||可选，表单域名，input原生name属性||false||false||[]",
        "direction||string||column||显示方向||可选，显示方向||false||false||[row, column]",
        "isShowTitle||boolean||true||是否显示title提示||可选，是否显示title提示||false||false||[]",
        "options||Array<any>||[]||复选框选项数组||可选，复选框选项数组||false||false||[]",
        "filterKey||string||null||options为对象数组时||可选，options为对象数组时，标识选项唯一id的键值||false||false||[]",
        "labelTemplate||TemplateRef||null||标签的自定义模板||可选，标签的自定义模板||false||false||[]",
        "halfchecked||boolean||false||半选状态||可选，半选状态||false||false||[]",
        "color||string||null||复选框颜色||可选，复选框颜色||false||false||[]",
        "showAnimation||boolean||true||控制是否显示动画||可选，控制是否显示动画||false||false||[]",
        "change||EventEmitter<boolean>||null||checkbox值改变事件||checkbox值改变事件||false||true||[]",
        "data-table||这是一个data-table组件",
        "checkable||boolean||null||Datatable是否提供勾选行的功能||可选，Datatable是否提供勾选行的功能||false||false||[]",
        "showExpandToggle||boolean||null||是否提供显示行详情的功能||可选，是否提供显示行详情的功能||false||false||[]",
        "fixHeader||boolean||null||是否固定表头（在表格超过容器最大高度时||可选，是否固定表头（在表格超过容器最大高度时，表格可滚动时生效）||false||false||[]",
        "showSortIcon||boolean||true||是否显示排序未激活图标||可选，是否显示排序未激活图标，默认显示||false||false||[]",
        "dataSource||any[]||null||用于渲染表格数据||数据源，用于渲染表格数据||false||false||[]",
        "hideColumn||string[]||null||用于隐藏列||可选，用于隐藏列||false||false||[]",
        "lazy||boolean||false||是否懒加载数据||可选，是否懒加载数据||false||false||[]",
        "pageAllChecked||boolean||null||选中当前页所有row||可选，选中当前页所有row||false||false||[]",
        "scrollable||boolean||null||表格在超出容器时||可选，表格在超出容器时，是否可以通过滚动查看表格内容||false||false||[]",
        "maxWidth||stringpx||null||限制表格最大宽度||可选，限制表格最大宽度，默认撑满父容器||false||false||[]",
        "maxHeight||stringpx||null||限制最大高度||可选，限制最大高度，默认||false||false||[]",
        "type||string||||表格类型||可选，表格类型，striped表示斑马纹类型，默认普通表格||false||false||[striped]",
        "hover||boolean||true||表格是否开启鼠标hover行高亮效果||可选，表格是否开启鼠标hover行高亮效果||false||false||[]",
        "cssClass||string||null||表格自定义样式||可选，表格自定义样式||false||false||[]",
        "tableWidth||string||100%||表格宽度||可选，表格宽度||false||false||[]",
        "onlyOneColumnSort||boolean||null||是否限制多列排序的输出限制为一项||可选，是否限制多列排序的输出限制为一项||false||false||[]",
        "multiSort||SortEventArg[]||[]||多列选择数组||可选，多列选择数组，用来指导那几列会被排序||false||false||[]",
        "resizeable||boolean||null||是否可以拖拽调整列宽||可选，是否可以拖拽调整列宽||false||false||[]",
        "detailTemplateRef||TemplateRef||null||用来自定义详情页的模板||可选，用来自定义详情页的模板||false||false||[]",
        "timeout||number||300||默认300ms，两个事件不同时使用可以指定为0||可选，同时绑定单击、双击事件时，用于区分点击的时间间隔,默认300ms，两个事件不同时使用可以指定为0||false||false||[]",
        "headerExpandConfig||TableExpandConfig||null||配置header下的额外内容||可选，配置header下的额外内容||false||false||[]",
        "checkableRelation||CheckableRelation||null||配置树形表格的父子选中是否互相关联upward：选中子关联父downward：选中父关联子||可选，配置树形表格的父子选中是否互相关联upward：选中子关联父downward：选中父关联子||false||false||[]",
        "loadChildrenTable||Promise||null||展开子表格的回调||可选，展开子表格的回调，用于异步加载子表格||false||false||[]",
        "loadAllChildrenTable||Promise||null||表头展开所有子表格的回调||可选，表头展开所有子表格的回调，用于异步加载所有子表格||false||false||[]",
        "virtualScroll||boolean||false||是否开启虚拟滚动||可选，是否开启虚拟滚动||false||false||[]",
        "beforeCellEdit||Promise||null||<br>resolveextraOptions将更新该列的extraOptions||可选，单元格编辑前的拦截方法,<br>resolveextraOptions将更新该列的extraOptions||false||false||[]",
        "colDraggable||boolean||false||表格列是否可拖动排序||可选，表格列是否可拖动排序||false||false||[]",
        "colDropFreezeTo||number||0||表格列可拖动排序时配置前n列不可拖动||可选，表格列可拖动排序时配置前n列不可拖动||false||false||[]",
        "multiSortChange||EventEmitter<SortEventArg[]>||null||用来更新多列选择数组||多列选择Change事件，用来更新多列选择数组，返回单元格信息||false||true||[]",
        "cellClick||EventEmitter<CellSelectedEventArg>||null||返回单元格信息||表格单元格点击事件，返回单元格信息||false||true||[]",
        "cellDBClick||EventEmitter<CellSelectedEventArg>||null||返回单元格信息||表格单元格双击事件，返回单元格信息||false||true||[]",
        "rowClick||EventEmitter<RowSelectedEventArg>||null||返回行信息||表格行点击事件，返回行信息||false||true||[]",
        "rowDBClick||EventEmitter<RowSelectedEventArg>||null||返回行信息||表格行双击事件，返回行信息||false||true||[]",
        "detialToggle||EventEmitter<any>||null||返回行状态信息||扩展行展开收起事件，返回行状态信息||false||true||[]",
        "cellEditStart||EventEmitter<CellSelectedEventArg>||null||返回单元格信息||表格单元格开始编辑事件，返回单元格信息||false||true||[]",
        "cellEditEnd||EventEmitter<CellSelectedEventArg>||null||返回单元格信息||表格单元格结束编辑事件，返回单元格信息||false||true||[]",
        "rowCheckChange||EventEmitter<RowCheckChangeEventArg>||null||返回单元格信息||某行的勾选状态变化事件，返回单元格信息||false||true||[]",
        "checkAllChange||EventEmitter<boolean>||null||返回true或false||当前页码全勾选状态变化事件，返回true或false||false||true||[]",
        "resize||EventEmitter<ColumnResizeEventArg>||null||返回单元格信息||列宽变化事件，返回单元格信息||false||true||[]",
        "childrenTableClose||EventEmitter<any>||null||返回列表行信息||子列表关闭事件，返回列表行信息||false||true||[]",
        "allChildrenTableClose||EventEmitter<any>||null||全部子列表关闭事件||全部子列表关闭事件||false||true||[]",
        "cancelEditingStatus||--||null||取消正在编辑单元格的编辑状态||取消正在编辑单元格的编辑状态||false||false||[]",
        "getCheckedRows||--||null||获取当前选中的行数据||获取当前选中的行数据||false||false||[]",
        "editable||boolean||false||在d-column上指定该列是否可编辑||可选，在d-column上指定该列是否可编辑||false||false||[]",
        "tableLevel||number||0||在树形表格场景下自增长||可选，当前表格层级,在树形表格场景下自增长||false||false||[]",
        "fieldType||string||text||将废弃||可选，将废弃，单元格类型，支持text、select、treeSelect、input-number、datapicker、customized||false||false||[]",
        "maxWidth||stringpx||null||最大宽度||可选，最大宽度||false||false||[]",
        "minWidth||stringpx||null||最小宽度||可选，最小宽度||false||false||[]",
        "field||string||null||该列字段||该列字段||false||false||[]",
        "header||string||null||该列表头文字||该列表头文字||false||false||[]",
        "sortable||boolean||null||是否可排序||可选，是否可排序||false||false||[]",
        "editable||boolean||null||是否可编辑||可选，是否可编辑||false||false||[]",
        "width||string||null||宽度||宽度||false||false||[stringpx, %]",
        "nestedColumn||Boolean||false||指定该列作为树形表格的操作列||可选，指定该列作为树形表格的操作列，即有展开折叠按钮和内容缩进表明层级关系||false||false||[]",
        "extraOptions.inputs||any{}||null||支持select、treeSelect、input-number、datapicker组件||可选，将废弃，主要配置单元格编辑时编辑组件的inputs,支持select、treeSelect、input-number、datapicker组件,如：extraOptions.treeData配置fieldType为treeSelect时的数据源||false||false||[]",
        "extraOptions.editableTip||string||null||可编辑提示||可选，可编辑提示，btn表示鼠标悬浮单元格出现编辑按钮，未配置时鼠标悬浮单元格背景色变化||false||false||[btn]",
        "extraOptions.iconFoldTable||Template||null||自动定义树形表格的折叠图标||可选，自动定义树形表格的折叠图标||false||false||[]",
        "extraOptions.iconUnFoldTable||Template||null||自动定义树形表格的展开图标||可选，自动定义树形表格的展开图标||false||false||[]",
        "extraOptions.showHeadTableToggler||boolean||false||树形表格是否在header出现展开折叠图标||可选，树形表格是否在header出现展开折叠图标||false||false||[]",
        "order||number||Number.MAX_VALUE||列序号||可选，列序号||false||false||[]",
        "filterable||boolean||null||是否可筛选||可选，是否可筛选||false||false||[]",
        "filterList||array||null||当filterable为true时必选||传入需要操作的筛选列表，当filterable为true时必选||false||false||[]",
        "filterMultiple||boolean||true||true为多选，false为单选||可选，选择筛选列表为多选或单选,true为多选，false为单选||false||false||[]",
        "customFilterTemplate||TemplateRef||null||表格过滤弹出框的自定义模板||可选，表格过滤弹出框的自定义模板，参考DOC下‘自定义过滤弹出框’使用||false||false||[]",
        "beforeFilter||string||null||表格过滤弹出框弹出前的回调函数||可选，表格过滤弹出框弹出前的回调函数，返回false可阻止弹框弹出||false||false||[function, Promise, Observable]",
        "cellClass||string||null||该列单元格自定义class||该列单元格自定义class||false||false||[]",
        "fixedLeft||string||null||如：‘100px’||该列固定到左侧的距离，如：‘100px’||false||false||[]",
        "fixedRight||string||null||如：‘100px’||该列固定到右侧的距离，如：‘100px’||false||false||[]",
        "filterBoxWidth||any||null||如：‘300px’||过滤弹出框的宽度，如：‘300px’||false||false||[]",
        "filterBoxHeight||any||null||如：‘400px’||过滤弹出框的高度，如：‘400px’||false||false||[]",
        "filterChange||FilterConfig[]||null||返回选中的筛选数组||确认筛选回调事件，返回选中的筛选数组||false||true||[]",
        "isChildTableOpen||boolean||false||该行下的子表格是否默认展开||可选，该行下的子表格是否默认展开||false||false||[]",
        "checked||boolean||false||该行是否选中||可选，该行是否选中||false||false||[]",
        "halfChecked||boolean||false||该行是否半选||可选，该行是否半选||false||false||[]",
        "disabled||boolean||false||该行是否禁止选中||可选，该行是否禁止选中||false||false||[]",
        "checkBoxTips||string||null||配置该行checkbox的提示||可选，配置该行checkbox的提示||false||false||[]",
        "editDeniedConfig||array||null||<br>例如:配置为[age]，表示field为age的单元格不可编辑||可选，与column配合配置该行的某些单元格的编辑权限,<br>例如:配置为[age]，表示field为age的单元格不可编辑||false||false||[]",
        "expandConfig||TableExpandConfig||null||配置该行下的额外内容||可选，配置该行下的额外内容||false||false||[]",
        "rowClass||string||null||配置该行的自定义class||可选，配置该行的自定义class||false||false||[]",
        "hovered||boolean||false||<br>离开该行时该值为false||鼠标悬浮该行元素时该值为true,<br>离开该行时该值为false||false||false||[]",
        "draggable||object||null||dragOverClass:拖动时元素class}。dragData为rowItem||可选，可拖拽配置，{scope:设置作用范围,dragOverClass:拖动时元素class}。dragData为rowItem||false||false||[]",
        "children||array||null||配置该行的子table数据||配置该行的子table数据||false||false||[]",
        "form-item||这是一个form组件",
        "required||boolean||false||表单选项是否必填||可选，表单选项是否必填||false||false||[]",
        "hasHelp||boolean||false||表单项是否需要帮助指引||可选，表单项是否需要帮助指引||false||false||[]",
        "helpTips||string||||表单项帮助指引提示内容||可选，表单项帮助指引提示内容，需配合hasHelp使用||false||false||[]",
        "fullscreen||这是一个fullscreen组件",
        "fullscreen-target||HTMLElement||null||内容投影||必选，内容投影，设置需要全屏的元素||true||false||[]",
        "fullscreen-launch||HTMLElement||null||内容投影||必选，内容投影，设置触发进入全屏的按钮||true||false||[]",
        "mode||string||immersive||设置全屏模式||可选，设置全屏模式||false||false||[immersive, normal]",
        "zIndex||number||10||设置全屏层级||可选，设置全屏层级||false||false||[]",
        "fullscreenLaunch||EventEmitter<boolean>||null||全屏之后的回调||可选，全屏之后的回调||false||true||[]",
        "input-number||这是一个input-number组件",
        "max||number||100||最大值||可选，最大值||false||false||[]",
        "min||number||0||最小值||可选，最小值||false||false||[]",
        "step||number||1||步进值||可选，步进值||false||false||[]",
        "disabled||boolean||false||禁止输入态开关||可选，禁止输入态开关||false||false||[]",
        "size||string||||组件大小||可选，组件大小||false||false||[, sm, lg]",
        "ngModel||number||null||组件的值||可选，组件的值||false||false||[]",
        "decimalLimit||number||null||限制小数点后的位数||可选，限制小数点后的位数||false||false||[]",
        "autoFocus||boolean||false||自动获取焦点||可选，自动获取焦点||false||false||[]",
        "allowEmpty||boolean||false||是否允许值为空||可选，是否允许值为空||false||false||[]",
        "placeholder||string||null||要显示的placeholder||可选，要显示的placeholder||false||false||[]",
        "maxLength||number||0||限制最大输入的长度||可选，限制最大输入的长度，0为不限制||false||false||[]",
        "reg||string||null||用于限制输入的正则或正则字符串||用于限制输入的正则或正则字符串||false||false||[RegExp]",
        "whileValueChanging||EventEmitter<number>||null||用户使用键盘输入时发出的事件||用户使用键盘输入时发出的事件||false||true||[]",
        "afterValueChanged||EventEmitter<number>||null||使用ngModelChange来监听值的变化||组件值变化时发出的事件，使用ngModelChange来监听值的变化||false||true||[]",
        "multi-auto-complete||这是一个multi-auto-complete组件",
        "cssClass||string||null||自定义class||可选，自定义class||false||false||[]",
        "disabled||boolean||null||是否禁用||可选，是否禁用||false||false||[]",
        "source||Array<any>||null||数据列表||可选，数据列表||false||false||[]",
        "isOpen||boolean||null||未使用||可选，未使用||false||false||[]",
        "term||string||null||未使用||可选，未使用||false||false||[]",
        "itemTemplate||TemplateRef||null||未使用||可选，未使用||false||false||[]",
        "noResultItemTemplate||TemplateRef||null||结果不存在时的显示模板||可选,结果不存在时的显示模板||false||false||[]",
        "dropdown||boolean||null||未使用||可选，未使用||false||false||[]",
        "minLength||number||null||未使用||可选，未使用||false||false||[]",
        "delay||number||300||输入结束dalay毫秒后启动查询||可选，输入结束dalay毫秒后启动查询||false||false||[]",
        "searchFn||Function||term:string=>Observable<any[]>||自定义搜索过滤||可选，自定义搜索过滤||false||false||[]",
        "formatter||Function||item:any=>string||对item的数据进行自定义显示内容||可选，对item的数据进行自定义显示内容，默认显示item.label或item.toString||false||false||[]",
        "valueParser||Function||item:any=>any||对item的数据进行转换||可选，对item的数据进行转换，结果用于判断两个item是否一样，默认显示原值||false||false||[]",
        "overview||string||border||可选||可选||false||false||[border, none, multiline, single]",
        "tipsText||string||null||提示文字||可选，提示文字||false||false||[]",
        "placeholder||string||请输入关键字||placeholder||可选，placeholder||false||false||[]",
        "latestSource||Array<any>||null||最近输入||可选，最近输入，最多支持5个，超过5个，截取最后5个||false||false||[]",
        "autoSubmit||Function||null||自动保存||可选，自动保存||false||false||[]",
        "pagination||这是一个pagination组件",
        "pageSize||number||10||每页显示最大条目数量||可选，每页显示最大条目数量||false||false||[]",
        "total||number||0||显示的总条目数||可选，显示的总条目数||false||false||[]",
        "pageSizeOptions||number[]||10||10||可选，分页每页最大条目数量的下拉框的数据源，默认有四种选择5,10,20,50||false||false||[]",
        "pageIndex||number||1||初始化页码||可选，初始化页码||false||false||[]",
        "maxItems||number||10||分页最多显示几个按钮||可选，分页最多显示几个按钮||false||false||[]",
        "preLink||string||null||默认设置为左箭头图标||可选，pre按钮文字,默认设置为左箭头图标||false||false||[]",
        "nextLink||string||null||默认设置为右箭头图标||可选，next按钮文字,默认设置为右箭头图标||false||false||[]",
        "size||number||||||可选，分页组件尺寸，有三种选择lg,,sm,分别代表大，中，小||false||false||[]",
        "canJumpPage||boolean||true||是否显示分页输入跳转||可选，是否显示分页输入跳转||false||false||[]",
        "canChangePageSize||boolean||false||是否显示用于选择更改分页每页最大条目数量的下拉框||可选，是否显示用于选择更改分页每页最大条目数量的下拉框||false||false||[]",
        "canViewTotal||boolean||true||是否显示总条目||可选，是否显示总条目||false||false||[]",
        "totalItemText||string||所有条目||总条目文本||可选，总条目文本||false||false||[]",
        "goToText||string||跳至||跳转文本||可选，跳转文本||false||false||[]",
        "showJumpButton||boolean||false||是否显示跳转按钮||可选，是否显示跳转按钮||false||false||[]",
        "showTruePageIndex||boolean||false||页码超出分页范围时候也显示当前页码的开关||可选，页码超出分页范围时候也显示当前页码的开关||false||false||[]",
        "selectDirection||string||auto||有三种选择auto||可选，下拉菜单默认方向,有三种选择auto,up,down||false||false||[]",
        "lite||boolean||false||是否切换为极简模式||可选，是否切换为极简模式||false||false||[]",
        "showPageSelector||boolean||true||极简模式下是否显示页码下拉||可选，极简模式下是否显示页码下拉||false||false||[]",
        "haveConfigMenu||boolean||false||极简模式下是否显示配置||可选，极简模式下是否显示配置||false||false||[]",
        "pageIndexChange||EventEmitter<number>||null||返回当前页码值||可选，页码变化的回调,返回当前页码值||false||true||[]",
        "pageSizeChange||EventEmitter<number>||null||每页最大条目数量变更时的回调||可选，每页最大条目数量变更时的回调，返回当前每页显示条目数||false||true||[]",
        "panel||这是一个panel组件",
        "type||string||default||面板的类型||可选，面板的类型||false||false||[]",
        "heading||string||null||面板的头部标题||可选，面板的头部标题||false||false||[]",
        "cssClass||string||null||自定义class名||可选，自定义class名||false||false||[]",
        "isCollapsed||boolean||false||是否展开||可选，是否展开||false||false||[]",
        "toggle||EventEmitter<boolean>||null||点击面板时的回调||可选，点击面板时的回调，返回当前面板的展开状态||false||true||[]",
        "popover||这是一个popover组件",
        "content||string||null||弹出框的显示内容||必选，弹出框的显示内容||true||false||[]",
        "visible||boolean||false||弹框的初始化弹出状态||可选，弹框的初始化弹出状态||false||false||[]",
        "trigger||string||click||弹框触发方式||弹框触发方式||false||false||[hover, click]",
        "controlled||boolean||false||是否通过trigger方式触发弹框||可选，是否通过trigger方式触发弹框||false||false||[]",
        "position||string||top||内容弹出方向||可选，内容弹出方向||false||false||[top, right, bottom, left]",
        "popType||string||default||弹出框类型||可选，弹出框类型，样式不同||false||false||[success, error, warning, info, default]",
        "showAnimate||boolean||false||是否显示动画||可选，是否显示动画||false||false||[]",
        "appendToBody||boolean||true||默认为true||可选，默认为true，仅当popover绑定元素外层宽高不够时，overflow为hidden，popover的弹出框不会被一并隐藏掉。||false||false||[]",
        "zIndex||number||1060||z-index值||可选，z-index值，用于手动控制层高||false||false||[]",
        "scrollElement||Element||window||只有当页面的滚动不在window上且appendToBody的属性为true时候才需要传值||可选，在这里默认是window,只有当页面的滚动不在window上且appendToBody的属性为true时候才需要传值||false||false||[]",
        "hoverToContent||boolean||false||是否允许鼠标从宿主移动到内容上||可选，是否允许鼠标从宿主移动到内容上，仅需要在trigger为hover的时候设置||false||false||[]",
        "progress||这是一个progress组件",
        "percentage||number||0||进度条的值最大为100||可选，进度条的值最大为100||false||false||[]",
        "percentageText||string||null||进度条当前值的文字说明比如：30% or 4/5||可选，进度条当前值的文字说明比如：30% or 4/5||false||false||[]",
        "barbgcolor||string||#5170ff||进度条的颜色显示||可选，进度条的颜色显示，默认为天蓝色||false||false||[]",
        "height||string||20px||进度条的高度值||可选，进度条的高度值，默认值为20px||false||false||[]",
        "isCircle||boolean||false||显示进度条是否为圈形||可选，显示进度条是否为圈形||false||false||[]",
        "strokeWidth||number||6||设置圈形进度条宽度||可选，设置圈形进度条宽度，单位是进度条与画布宽度的百分比||false||false||[]",
        "radio||这是一个radio组件",
        "name||string||null||单选项名称||必选，单选项名称||true||false||[]",
        "values||array||null||单选数据组||必选，单选数据组||true||false||[]",
        "disabled||boolean||false||是否禁用该单选项组||可选，是否禁用该单选项组||false||false||[]",
        "change||EventEmitter<any>||null||返回选中的值||单选项值改变时触发，返回选中的值||false||true||[]",
        "name||string||null||单选项名称||必选，单选项名称||true||false||[]",
        "value||string||null||单选项值||必选，单选项值||true||false||[]",
        "disabled||boolean||false||是否禁用该单选项||可选，是否禁用该单选项||false||false||[]",
        "ngModelChange||EventEmitter<any>||null||单选项值改变时触发||Form事件，单选项值改变时触发，返回选中的值||false||true||[]",
        "rate||这是一个rate组件",
        "read||boolean||false||设置是否为只读模式||可选，设置是否为只读模式，只读模式无法交互||false||false||[]",
        "count||number||5||设置总等级数||可选，设置总等级数||false||false||[]",
        "type||string||null||设置当前评分的类型||可选，设置当前评分的类型，不同类型对应不同颜色||false||false||[success, warning, error]",
        "color||string||null||星星颜色||可选，星星颜色||false||false||[]",
        "icon||string||null||评分图标的样式||可选，评分图标的样式，只支持devUI图标库中所有图标||false||false||[]",
        "character||string||null||评分图标的样式||可选，评分图标的样式，icon与character只能设置其中一个||false||false||[]",
        "search||这是一个search组件",
        "size||string||||搜索框尺寸||可选，搜索框尺寸，有三种选择lg、、sm||false||false||[]",
        "placeholder||string||PleaseInputkeywords||输入框的placeholder||可选，输入框的placeholder||false||false||[]",
        "maxLength||number||Number.MAX_SAFE_INTEGER||输入框的max-length||可选，输入框的max-length||false||false||[]",
        "delay||number||300||debounceTime的延迟||可选，debounceTime的延迟||false||false||[]",
        "isKeyupSearch||boolean||false||是否支持输入值立即出发searchFn||可选，是否支持输入值立即出发searchFn||false||false||[]",
        "searchFn||string||null||返回文本框输入的值||回车或点击搜索按钮触发的回��函数，返回文本框输入的值||false||true||[]",
        "select||这是一个select组件",
        "options||array||[]||和searchFn互斥，两者必须有且只有一个。下拉选项资源stringobject||可选,和searchFn互斥，两者必须有且只有一个。下拉选项资源stringobject||false||false||[]",
        "isSearch||boolean||false||是否支持过滤搜索||可选,是否支持过滤搜索||false||false||[]",
        "scrollHight||string||300px||下拉菜单高度||可选,下拉菜单高度,建议使用px作为高度单位||false||false||[]",
        "hightLightItemClass||string||bg-grey||下拉高亮css||可选,下拉高亮css||false||false||[]",
        "filterKey||string||null||必选||当传入资源options类型为object时,必选,针对传入资源options的每项对应字段做过滤操作||false||false||[]",
        "multiple||boolean||false||是否支持多选||可选,是否支持多选||false||false||[]",
        "isSelectAll||boolean||false||是否显示全选||可选,是否显示全选||false||false||[]",
        "readonly||boolean||true||是否可以输入||可选,是否可以输入||false||false||[]",
        "size||string||||下拉选框尺寸||可选,下拉选框尺寸,有三种选择lg,,sm||false||false||[]",
        "disabled||boolean||false||是否禁用下拉框||可选,是否禁用下拉框||false||false||[]",
        "placeholder||string||PleaseInputkeywords||输入框的placeholder||可选,输入框的placeholder||false||false||[]",
        "searchFn||function||null||搜索函数||可选,搜索函数,当需要自定义下拉选择过滤规则时可以使用||false||false||[]",
        "valueParser||function||null||决定选择框文字如何显示||可选,决定选择框文字如何显示,默认显示filterKey字段或者本身的值||false||false||[]",
        "formatter||function||null||决定下拉框每项文字如何显示||可选,决定下拉框每项文字如何显示,默认显示filterKey字段或者本身的值||false||false||[]",
        "direction||string||||下拉选框尺寸||可选,下拉选框尺寸,有三种选择up,down,auto||false||false||[]",
        "overview||string||border||决定选择框样式显示||可选,决定选择框样式显示,默认有边框border,underlined||false||false||[]",
        "enableLazyLoad||boolean||false||是否支持数据懒加载，用于滚动到底部时动态请求数据||可选,是否支持数据懒加载，用于滚动到底部时动态请求数据||false||false||[]",
        "extraConfig||object||N/A||可输入配置项参考示例||可选,可输入配置项参考示例||false||false||[]",
        "extraConfig.labelization||object||N/A||标签化多选结果的配置项||可选,标签化多选结果的配置项,参考示例||false||false||[]",
        "extraConfig.labelization.enable||boolean||false||是否启用标签化||可选下的必填参数,是否启用标签化,使用必须置为true,参考示例||false||false||[]",
        "extraConfig.labelization.overflow||string||||多个标签超出容器时候的预处理行为||可选,多个标签超出容器时候的预处理行为,值为normal or scroll-y or multiple-line or string对应默认隐藏,纵向滚动、自动变多行和自定义类||false||false||[]",
        "extraConfig.labelization.containnerMaxHeight||string||1.8em||限制容器最高高度。多行模式下默认不限制高度||可选,限制容器最高高度。多行模式下默认不限制高度,单行模式下默认为1.8em||false||false||[]",
        "extraConfig.labelization.labelMaxWidth||string||100%||限制标签宽度||可选下,限制标签宽度,默认值为行宽的100%||false||false||[]",
        "extraConfig.selectedItemWithTemplate||object||N/A||在单选情况下||可选,在单选情况下,显示选项使用了template的情况下,顶部选中的内容是否也以template展示,参考示例||false||false||[]",
        "extraConfig.selectedItemWithTemplate.enable||boolean||null||是否启用选中项使用模板||可选下的必填参数,是否启用选中项使用模板,使用必须置为true,参考示例||false||false||[]",
        "optionDisabledKey||string||||禁用单个选项;当传入资源options类型为objectObj||可选,禁用单个选项;当传入资源options类型为objectObj,比如设置为disabled,则当对象的disable属性为true时,该选项将禁用;当设置为时不禁用单个选项||false||false||[]",
        "optionImmutableKey||string||||禁用单个选项;当传入资源options类型为objectObj||可选,禁用单个选项;当传入资源options类型为objectObj,比如设置为immutable,则当对象的immutable属性为true时,该选项将禁被禁止变更;当设置为时不生效||false||false||[]",
        "noResultItemTemplate||TemplateRef||null||没有匹配项的展示结果||可选,没有匹配项的展示结果||false||false||[]",
        "keepMultipleOrder||string||user-select||user-select or origin||可选,user-select or origin,配置多选的时候是否维持原数组排序还是用户选择的顺序排序,默认是用户顺序||false||false||[]",
        "customViewTemplate||TemplateRef||null||支持自定义区域显示内容定制||可选,支持自定义区域显示内容定制,可以使用choose来选择某项,choose需要传两个必填参数,第一个为选择的选项,第二个为选项在列表的index值,event参数选填,若不填请自行处理冒泡,详见demo||false||false||[]",
        "customViewDirection||string||bottom||customViewTemplate所处的相对下拉列表的位置||customViewTemplate所处的相对下拉列表的位置||false||false||[bottom, right]",
        "appendToBody||boolean||false||true会被附加到body||可选,true会被附加到body||false||false||[]",
        "width||number||null||搭配appendToBody使用，设置下拉宽||可选,搭配appendToBody使用，设置下拉宽||false||false||[]",
        "virtualScroll||boolean||false||是否虚拟滚动，大数据量场景试用||可选,是否虚拟滚动，大数据量场景试用||false||false||[]",
        "allowClear||boolean||false||配置是否允许清空选值，仅单选场景适用||可选,配置是否允许清空选值，仅单选场景适用||false||false||[]",
        "inputItemTemplate||TemplateRef||null||自定义模板，若传入，会忽略ContentChild||可选参数,自定义模板，若传入，会忽略ContentChild||false||false||[]",
        "valueChange||EventEmitter<Array<any>||any>||输出函数||可选,输出函数,当选中某个选项项后,将会调用此函数,参数为当前选择项的值||false||false||[]",
        "toggleChange||EventEmitter<boolean>||null||输出函数||可选,输出函数,下拉打开关闭toggle事件||false||true||[]",
        "loadMore||EventEmitter<{instance:Selectcomponent,event:ScrollEvent}>||null||event为懒加载监听的滚动事件，参考dLazyLoad||懒加载触发事件，配合enableLazyLoad使用，使用$event.instance.loadFinish结束本次加载,event为懒加载监听的滚动事件，参考dLazyLoad||false||true||[]",
        "slider||这是一个slider组件",
        "min||number||0||滑动输入条的最小值||可选，滑动输入条的最小值||false||false||[]",
        "max||number||100||滑动输入条的最大值||可选，滑动输入条的最大值||false||false||[]",
        "step||number||1||滑动输入条的步长||可选，滑动输入条的步长，取值必须大于等于0，且必须可被max-min整除||false||false||[]",
        "disabled||boolean||false||值为true时禁止用户输入||可选，值为true时禁止用户输入||false||false||[]",
        "tipsRenderer||string||value=>Stringvalue||渲染Popover内容的函数||可选，渲染Popover内容的函数，传入null时不显示Popover||false||false||[function, null]",
        "splitter||这是一个splitter组件",
        "orientation||string||horizontal||可选值vertical or horizontal||可选，指定Splitter分割方向,可选值vertical or horizontal||false||false||[vertical, horizontal]",
        "splitBarSize||string||2px||分隔条大小||可选，分隔条大小，默认2px||false||false||[]",
        "disabledBarSize||string||1px||pane设置不可调整宽度时生效||可选，pane设置不可调整宽度时生效||false||false||[]",
        "size||string||null||指定pane宽度||可选，指定pane宽度，设置像素值或者百分比||false||false||[]",
        "minSize||string||null||指定pane最小宽度||可选，指定pane最小宽度，设置像素值或者百分比||false||false||[]",
        "maxSize||string||null||指定pane最大宽度||可选，指定pane最大宽度，设置像素值或者百分比||false||false||[]",
        "resizable||boolean||true||指定pane是否可调整大小||可选，指定pane是否可调整大小，会影响相邻pane||false||false||[]",
        "collapsible||boolean||false||指定pane是否可折叠收起||可选，指定pane是否可折叠收起||false||false||[]",
        "collapseDirection||string||both||指定非边缘pane收起方向||可选，指定非边缘pane收起方向，配合collapsible使用||false||false||[before, after, both]",
        "sizeChange||EventEmitter<string>||null||像素值或者百分比||大小变动时，返回改变后的值,像素值或者百分比||false||true||[]",
        "collapsedChange||EventEmitter<boolean>||null||返回当前pane是否折叠||折叠和展开时，返回当前pane是否折叠||false||true||[]",
        "status||这是一个status组件",
        "type||string||invalid||类型||必选，类型，值有invalid、running、waiting、important、less-important、error||true||false||[]",
        "sticky||这是一个sticky组件",
        "zIndex||number||null||指定包裹层的z-index||可选，指定包裹层的z-index，用于浮动的时候控制z轴的叠放||false||false||[]",
        "container||HTMLElement||父容器||触发的容器||可选，触发的容器，可不同于父容器||false||false||[]",
        "view||{top?:number,bottom?:number}||{top:0,bottom:0}||用于可视区域的调整||可选，用于可视区域的调整，比如顶部有固定位置的头部等，数值对应被遮挡的顶部或底部的高度||false||false||[]",
        "scrollTarget||HTMLElement||document.documentElement||设置要发生滚动的容器||可选，设置要发生滚动的容器，一般为滚动条所在容器，为主页面的滚动条时候可以不设置||false||false||[]",
        "statusChange||EventEmitter<StickyStatus>||null||remain表示被容器托起处于容器底部跟着容器走的状态||可选，状态变化的时候触发，值为变化后的状态值，normal表示处于正常状态，follow表示处于跟着页面滚动固定位置状态，stay表示横向滚动时候的跟随固定状态,remain表示被容器托起处于容器底部跟着容器走的状态||false||true||[]",
        "tabs||这是一个tabs组件",
        "type||string||tabs||选项卡组的类型||可选，选项卡组的类型||false||false||[tabs, pills, options]",
        "showContent||boolean||true||是否显示选项卡对应的内容||可选，是否显示选项卡对应的内容||false||false||[]",
        "activeTab||string||null||当前激活的选项卡||可选，当前激活的选项卡，值为选项卡的id||false||false||[]",
        "cssClass||string||null||自定义选项卡组的css类||可选，自定义选项卡组的css类||false||false||[]",
        "customWidth||string||null||自定义选项卡的宽度||可选，自定义选项卡的宽度||false||false||[]",
        "vertical||boolean||false||是否垂直显示||可选，是否垂直显示||false||false||[]",
        "beforeChange||string||null||返回boolean类型，返回false可以阻止tab的切换||tab切换前的回调函数,返回boolean类型，返回false可以阻止tab的切换||false||false||[function, Promise, Observable]",
        "activeTabChange||EventEmitter<number\||string>||选项卡切换的回调函数||可选，选项卡切换的回调函数，返回当前激活选项卡的id||false||false||[]",
        "tabId||string||null||需要设置为唯一值||可选，选项卡的id值,需要设置为唯一值||false||false||[]",
        "id||string||null||一般和tabId一致||可选，一般和tabId一致||false||false||[number]",
        "title||string||null||选项卡的标题||可选，选项卡的标题||false||false||[]",
        "disabled||boolean||false||选项卡是否不可用||可选，选项卡是否不可用||false||false||[]",
        "tags||这是一个tags组件",
        "tag||string||null||记录输入的标签和选择的标签||必选，记录输入的标签和选择的标签||true||false||[]",
        "titleContent||string||null||设置鼠标悬浮时title的显示内容||可选，设置鼠标悬浮时title的显示内容||false||false||[]",
        "labelStyle||string||||olivine-w98||可选，标签的样式可使用blue-w98、green-w98、yellow-w98、orange-w98、pink-w98、purple-w98、turquoise-w98,olivine-w98,或可传入自定义class||false||false||[]",
        "deletable||boolean||false||设置标签是否可删除||可选，设置标签是否可删除||false||false||[]",
        "customViewTemplate||TemplateRef||null||自定义标签模板||可选，自定义标签模板||false||false||[]",
        "tagDelete||EventEmitter<{tag:tag}>||null||删除tag的时候触发的事件||删除tag的时候触发的事件||false||true||[]",
        "tags||Array||[]||记录输入的标签和选择的标签||必选，记录输入的标签和选择的标签||true||false||[]",
        "displayProperty||string||||设置属性名||可选，设置属性名，使得标签名为该属性对应的值||false||false||[]",
        "deletable||boolean||false||设置标签是否可删除||可选，设置标签是否可删除||false||false||[]",
        "titleProperty||string||||设置属性名||可选，设置属性名，鼠标悬浮时title显示的值||false||false||[]",
        "tagDelete||EventEmitter<{tag:tag,index:index}>||null||删除某个tag的时候触发的事件||删除某个tag的时候触发的事件||false||true||[]",
        "tags-input||这是一个tags-input组件",
        "tags||Array||[]||记录输入的标签和选择的标签列表||必选，记录输入的标签和选择的标签列表||true||false||[]",
        "displayProperty||string||name||列表项使用的属性名||可数，列表项使用的属性名||false||false||[]",
        "placeholder||boolean||||输入框的placeholder||可选，输入框的placeholder||false||false||[]",
        "minLength||number||3||输入标签内容的最小长度||可选，输入标签内容的最小长度||false||false||[]",
        "maxLength||number||Number.MAX_SAFE_INTEGER||输入标签内容的最大长度||可选，输入标签内容的最大长度||false||false||[]",
        "maxTags||number||Number.MAX_SAFE_INTEGER||可输入标签的最大个数||可选，可输入标签的最大个数||false||false||[]",
        "caseSensitivity||boolean||false||大小写敏感||可选，大小写敏感，默认忽略大小写||false||false||[]",
        "spellcheck||boolean||true||input输入框的spellcheck||可选，input输入框的spellcheck||false||false||[]",
        "isAddBySpace||boolean||true||是否支持空格键输入标签||可选，是否支持空格键输入标签||false||false||[]",
        "suggestionList||Array||[]||下拉选项||可选，下拉选项，默认可选择的标签列表||false||false||[]",
        "checkBeforeAdd||string||无||自定义校验函数||可选，自定义校验函数，类型为newTag:string=>boolean或者Promise<boolean>或者Observable<boolean>||false||false||[Function, Promise, Observable]",
        "valueChange||EventEmitter<any>||null||将会调用此函数||当选中某个选项项后，将会调用此函数，参数为当前选择项的值。如果需要获取所有选择状态的值，请使用ngModelChange||false||true||[]",
        "text-input||这是一个text-input组件",
        "id||string||null||文本框id||可选，文本框id||false||false||[]",
        "placeholder||string||null||文本框placeholder||可选，文本框placeholder||false||false||[]",
        "disabled||boolean||false||文本框是否被禁用||可选，文本框是否被禁用||false||false||[]",
        "error||boolean||false||文本框是否出现输入错误||可选，文本框是否出现输入错误||false||false||[]",
        "toast||这是一个toast组件",
        "value||Array<Message>||null||消息内容数组||必选，消息内容数组，Message对象定义见下文||true||false||[]",
        "life||number||5000/10000||超时时间||可选，超时时间，超时后自动消失，鼠标悬停可以阻止消失，单位毫秒，成功、提示类默认为5000毫秒，错误、警告类默认为10000毫秒||false||false||[]",
        "sticky||boolean||false||是否常驻||可选，是否常驻，默认自动关闭||false||false||[]",
        "style||string||null||样式||可选，样式||false||false||[]",
        "styleClass||string||null||类名||可选，类名||false||false||[]",
        "closeEvent||EventEmitter<any>||null||返回被手动关闭或自动消失的单条消息内容||可选，返回被手动关闭或自动消失的单条消息内容||false||false||[]",
        "valueChange||EventEmitter<Message[]>||null||返回变化（手动关闭或自动消失）后剩余消息内容数组||可选，返回变化（手动关闭或自动消失）后剩余消息内容数组，Message对象定义见下文||false||false||[]",
        "toggle||这是一个toggle组件",
        "size||string||small||开关尺寸大小||可选，开关尺寸大小||false||false||[small, medium, large]",
        "color||string||null||开关打开时的自定义颜色||可选，开关打开时的自定义颜色||false||false||[]",
        "checked||boolean||false||开关是否打开||可选，开关是否打开，默认关闭||false||false||[]",
        "disabled||boolean||false||是否禁用开关||可选，是否禁用开关||false||false||[]",
        "beforeChange||string||null||返回boolean类型，返回false可以阻止开关的变化||可选，开关变化前的回调函数,返回boolean类型，返回false可以阻止开关的变化||false||false||[Function, Promise, Observable]",
        "change||EventEmitter<boolean>||null||开关打开返回true||可选,开关打开返回true,关闭返回false||false||true||[]",
        "transfer||这是一个transfer组件",
        "sourceOption||array||[]||穿梭框源数据||可选参数，穿梭框源数据||false||false||[]",
        "targetOption||array||[]||穿梭框目标数据||可选参数，穿梭框目标数据||false||false||[]",
        "titles||array||[]||穿梭框标题||可选参数，穿梭框标题||false||false||[]",
        "height||string||320px||穿梭框高度||可选参数，穿梭框高度||false||false||[]",
        "isSearch||number||false||是否可以搜索||可选参数，是否可以搜索||false||false||[]",
        "isSourceDroppable||boolean||false||源是否可以拖拽||可选参数，源是否可以拖拽||false||false||[]",
        "isTargetDroppable||boolean||false||目标是否可以拖拽||可选参数，目标是否可以拖拽||false||false||[]",
        "disabled||boolean||false||可选参数穿梭框禁止使用||可选参数穿梭框禁止使用||false||false||[]",
        "transferToSource||返回穿梭框源和目标数据||null||返回源和目标数据；||当点击右穿梭时，返回源和目标数据；||false||true||[]",
        "transferToTarget||返回穿梭框源和目标数据||null||返回源和目标数据；||当点击左穿梭时，返回源和目标数据；||false||true||[]",
        "tree||这是一个tree组件",
        "tree||Array<ITreeItem>||null||根据传入的数据进行树的渲染||必选，根据传入的数据进行树的渲染||true||false||[]",
        "treeNodeIdKey||string||id||id键值名||可选，id键值名，用来标识节点的唯一性||false||false||[]",
        "treeNodeChildrenKey||string||items||子节点数组的键值名||可选，子节点数组的键值名||false||false||[]",
        "treeNodeTitleKey||string||title||节点显示数据的键值名||可选，节点显示数据的键值名||false||false||[]",
        "checkboxDisabledKey||string||disabled||节点禁止点选的键值名||可选，节点禁止点选的键值名||false||false||[]",
        "iconParentOpen||string||null||自定义父节点展开时的图标||可选，自定义父节点展开时的图标||false||false||[]",
        "iconParentClose||string||null||自定义父节点收起时的图标||可选，自定义父节点收起时的图标||false||false||[]",
        "iconLeaf||string||null||自定义叶子节点图标||可选，自定义叶子节点图标||false||false||[]",
        "treeNodesRef||TemplateRef<any>||null||自定义节点的显示模板||可选，自定义节点的显示模板||false||false||[]",
        "nodeSelected||EventEmitter<any>||null||节点选中的回调函数||可选，节点选中的回调函数，返回当前选中节点的数据||false||true||[]",
        "nodeDblClicked||EventEmitter<any>||null||节点双击时的回调函数||可选，节点双击时的回调函数，返回当前操作的节点的数据||false||true||[]",
        "nodeToggled||EventEmitter<any>||null||节点展开收起的回调函数||可选，节点展开收起的回调函数，返回当前操作的节点的数据||false||true||[]",
        "tree||Array<ITreeItem>||null||根据传入的数据进行树的渲染||必选，根据传入的数据进行树的渲染||true||false||[]",
        "treeNodeIdKey||string||id||id键值名||可选，id键值名，用来标识节点的唯一性||false||false||[]",
        "treeNodeChildrenKey||string||items||子节点数组的键值名||可选，子节点数组的键值名||false||false||[]",
        "treeNodeTitleKey||string||title||节点显示数据的键值名||可选，节点显示数据的键值名||false||false||[]",
        "checkboxDisabledKey||string||disabled||节点禁止点选的键值名||可选，节点禁止点选的键值名||false||false||[]",
        "iconParentOpen||string||null||自定义父节点展开时的图标||可选，自定义父节点展开时的图标||false||false||[]",
        "iconParentClose||string||null||自定义父节点收起时的图标||可选，自定义父节点收起时的图标||false||false||[]",
        "iconLeaf||string||null||自定义叶子节点图标||可选，自定义叶子节点图标||false||false||[]",
        "checkable||boolean||true||是否显示checkbox||可选，是否显示checkbox，即是否为多选模式||false||false||[]",
        "addable||boolean||false||是否显示新增子节点按钮||可选，是否显示新增子节点按钮||false||false||[]",
        "editable||boolean||false||是否显示编辑子节点按钮||可选，是否显示编辑子节点按钮||false||false||[]",
        "deletable||boolean||false||是否显示删除子节点按钮||可选，是否显示删除子节点按钮||false||false||[]",
        "draggable||boolean||false||树节点是否支持drag、drop操作||可选，树节点是否支持drag、drop操作||false||false||[]",
        "checkboxInput||ICheckboxInput||{}||设置checkbox的相关属性||可选，设置checkbox的相关属性||false||false||[]",
        "canActivateNode||boolean||true||是否可以选中节点||可选，是否可以选中节点||false||false||[]",
        "canActivateParentNode||boolean||true||父节点是否可选中||可选，父节点是否可选中，false时触发toggle操作||false||false||[]",
        "iconTemplatePosition||string||null||设置图标的位置||可选，设置图标的位置，可选before-checkbox或after-checkbox||false||false||[]",
        "beforeAddNode||Promise<any>||null||新增子节点前回调参数为当前节点||可选，新增子节点前回调参数为当前节点||false||true||[]",
        "beforeDeleteNode||Promise<any>||null||删除节点前回调参数为当前节点||可选，删除节点前回调参数为当前节点||false||true||[]",
        "beforeNodeDrop||Promise<any>||null||子节点内部拖动drop前回调参数为当前拖动的节点与释放位置的节点||可选，子节点内部拖动drop前回调参数为当前拖动的节点与释放位置的节点||false||true||[]",
        "beforeEditNode||Promise<any>||null||子节点编辑前回调参数为当前编辑的节点||可选，子节点编辑前回调参数为当前编辑的节点||false||true||[]",
        "postAddNode||Promise<any>||null||新增节点后回调参数为新增节点||可选，新增节点后回调参数为新增节点||false||true||[]",
        "nodeSelected||EventEmitter<any>||null||返回当前选中节点的数据||可选，节点点击事件回调,返回当前选中节点的数据||false||true||[]",
        "nodeDblClicked||EventEmitter<any>||null||节点双击时的回调函数||可选，节点双击时的回调函数，返回当前操作的节点的数据||false||true||[]",
        "nodeDeleted||EventEmitter<any>||null||返回当前删除节点的数据||可选，节点删除事件回调,返回当前删除节点的数据||false||true||[]",
        "nodeToggled||EventEmitter<any>||null||返回当前操作的节点的数据||可选，节点展开收起事件回调,返回当前操作的节点的数据||false||true||[]",
        "nodeChecked||EventEmitter<any>||null||节点选中事件回调||可选，节点选中事件回调，返回选中的节点数据||false||true||[]",
        "nodeEdited||EventEmitter<any>||null||节点title编辑事件回调||可选，节点title编辑事件回调，返回当前编辑的节点数据||false||true||[]",
        "editValueChange||EventEmitter<any>||null||节点编辑中数据变化的回调函数||可选，节点编辑中数据变化的回调函数，返回校验后的值||false||true||[]",
        "nodeOnDrop||EventEmitter<any>||null||节点onDrop事件回调任意可拖动元素drop||可选，节点onDrop事件回调任意可拖动元素drop，返回拖拽事件与释放位置的节点数据||false||true||[]",
        "iconTemplatePosition||string||after-checkbox||after-checkbox]]||可选，支持[[before-checkbox,after-checkbox]]||false||false||[]",
        "iconTemplate||内嵌的模板||null||支持自定义html||可选，支持自定义html||false||false||[]",
        "nodeTemplate||内嵌的模板||null||用于自定义树节点的显示||可选，支持自定义html,用于自定义树节点的显示||false||false||[]",
        "operatorTemplate||内嵌的模板||null||支持自定义html||可选，支持自定义html||false||false||[]",
        "statusTemplate||内嵌的模板||null||用于自定义状态等信息||可选，支持自定义html,用于自定义状态等信息||false||false||[]",
        "upload||这是一个upload组件",
        "fileOptions||IFileOptions，参考下方options||null||待上传文件配置||必选，待上传文件配置||true||false||[]",
        "filePath||string||null||文件路径||必选，文件路径||true||false||[]",
        "uploadOptions||IUploadOptions，参考下方options||null||上传配置||必选，上传配置||true||false||[]",
        "autoUpload||boolean||false||是否自动上传||可选，是否自动上传||false||false||[]",
        "placeholderText||string||选择文件||上传输入框中的Placeholder文字||可选，上传输入框中的Placeholder文字||false||false||[]",
        "confirmText||string||确定||错误信息弹出框中确认按钮文字||可选，错误信息弹出框中确认按钮文字||false||false||[]",
        "preloadFilesRef||TemplateRef<any>||null||用于创建自定义已选择文件列表模板||可选，用于创建自定义已选择文件列表模板||false||false||[]",
        "uploadText||string||上传||上传按钮文字||可选，上传按钮文字||false||false||[]",
        "uploadedFiles||Array<Object>||[]||获取已上传的文件列表||可选，获取已上传的文件列表||false||false||[]",
        "uploadedFilesRef||TemplateRef<any>||null||用于创建自定义已上传文件列表模板||可选，用于创建自定义已上传文件列表模板||false||false||[]",
        "withoutBtn||boolean||false||是否舍弃按钮||可选，是否舍弃按钮||false||false||[]",
        "enableDrop||boolean||false||是否支持拖拽||可选，是否支持拖拽||false||false||[]",
        "beforeUpload||string||null||控制文件是否上传||上传前的回调，通过返回trueorfalse,控制文件是否上传||false||true||[boolean, Promise<boolean>, Observable<boolean>]",
        "fileOver||EventEmitter<any>||null||可拖动的元素移出放置目标时返回false，元素正在拖动到放置目标时返回true||支持拖拽上传时，文件移动到可拖放区域触发事件,可拖动的元素移出放置目标时返回false，元素正在拖动到放置目标时返回true||false||true||[]",
        "fileDrop||EventEmitter<any>||null||当前拖拽的文件列表回调||支持拖拽上传时，当前拖拽的文件列表回调，单文件上传默认返回第一个文件||false||true||[]",
        "successEvent||EventEmitter<any>||null||返回文件及xhr的响应信息||上传成功时的回调函数,返回文件及xhr的响应信息||false||true||[]",
        "errorEvent||EventEmitter<any>||null||返回上传失败的错误信息||上传错误时的回调函数，返回上传失败的错误信息||false||true||[]",
        "deleteUploadedFileEvent||EventEmitter<any>||null||返回删除文件的路径信息||删除上传文件的回调函数，返回删除文件的路径信息||false||true||[]",
        "fileOptions||IFileOptions，参考下方options||null||待上传文件配置||必选，待上传文件配置||true||false||[]",
        "filePath||string||null||文件路径||必选，文件路径||true||false||[]",
        "uploadOptions||IUploadOptions，参考下方options||null||上传配置||必选，上传配置||true||false||[]",
        "autoUpload||boolean||false||是否自动上传||可选，是否自动上传||false||false||[]",
        "placeholderText||string||选择多个文件||上传输入框中的Placeholder文字||可选，上传输入框中的Placeholder文字||false||false||[]",
        "confirmText||string||确定||错误信息弹出框中确认按钮文字||可选，错误信息弹出框中确认按钮文字||false||false||[]",
        "preloadFilesRef||TemplateRef<any>||null||用于创建自定义已选择文件列表模板||可选，用于创建自定义已选择文件列表模板||false||false||[]",
        "uploadText||string||上传||上传按钮文字||可选，上传按钮文字||false||false||[]",
        "uploadedFiles||Array<Object>||[]||获取已上传的文件列表||可选，获取已上传的文件列表||false||false||[]",
        "uploadedFilesRef||TemplateRef<any>||null||用于创建自定义已上传文件列表模版||可选，用于创建自定义已上传文件列表模版||false||false||[]",
        "withoutBtn||boolean||false||是否舍弃按钮||可选，是否舍弃按钮||false||false||[]",
        "enableDrop||boolean||false||是否支持拖拽||可选，是否支持拖拽||false||false||[]",
        "beforeUpload||string||null||控制文件是否上传||上传前的回调，通过返回trueorfalse,控制文件是否上传||false||true||[boolean, Promise<boolean>, Observable<boolean>]",
        "fileOver||EventEmitter<any>||null||可拖动的元素移出放置目标时返回false，元素正在拖动到放置目标时返回true||支持拖拽上传时，文件移动到可拖放区域触发事件,可拖动的元素移出放置目标时返回false，元素正在拖动到放置目标时返回true||false||true||[]",
        "fileDrop||EventEmitter<any>||null||当前拖拽的文件列表回调||支持拖拽上传时，当前拖拽的文件列表回调，单文件上传默认返回第一个文件||false||true||[]",
        "successEvent||EventEmitter<any>||null||返回文件及xhr的响应信息||上传成功时的回调函数,返回文件及xhr的响应信息||false||true||[]",
        "errorEvent||EventEmitter<any>||null||返回上传失败的错误信息||上传错误时的回调函数，返回上传失败的错误信息||false||true||[]",
        "deleteUploadedFileEvent||EventEmitter<any>||null||返回删除文件的路径信息||删除上传文件的回调函数，返回删除文件的路径信息||false||true||[]",
    ];

    const BOOLEAN = "boolean";
    const STRING = "string";
    class RootNode {
        constructor() {
            this.schema = {};
            this.completionItems = [];
            this.nameCompletionItems = [];
        }
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
        getNameCompltionItems(range) {
            return this.completionItems;
        }
        getFullCompltionItems(range, kind) {
            if (kind) {
                this.completionItems.forEach(e => e.insertText);
            }
            if (range) {
                return this.completionItems.map(_completionItem => {
                    _completionItem.textEdit = {
                        range: range,
                        newText: kind ? _completionItem.insertText.substring(0, _completionItem.insertText.length - 1) : _completionItem.insertText
                    };
                    return _completionItem;
                });
            }
            return this.completionItems;
        }
        getSubNode(name) {
            return this.schema[name];
        }
        getSubNodes() {
            return Object.values(this.schema);
        }
        getParent() {
            return;
        }
        getHoverInfo() { return undefined; }
        getDirectives(name) {
            const _result = this.getSubNode(name);
            if (_result instanceof Directive) {
                return _result;
            }
            return;
        }
    }
    class Component {
        constructor(name, description = "", attritubes = []) {
            this.name = name;
            this.description = description;
            this.attritubes = attritubes;
            this.attributeMap = {};
            this.nameCompletionItems = [];
            this.completionItems = [];
            this.completionItemKind = vscodeLanguageserver.CompletionItemKind.Class;
        }
        ;
        getElement(s) {
            if (s === this.name) {
                return this;
            }
        }
        addAttritube(attribute) {
            this.attritubes.push(attribute);
            this.attributeMap[attribute.getName()] = attribute;
        }
        setDescription(description) {
            this.description = description;
        }
        getName() { return this.name; }
        getAttributes() { return this.attritubes; }
        getDescription() { return this.description; }
        getAttribute(attrname) { return this.attributeMap[attrname]; }
        getcompletionKind() { return this.completionItemKind; }
        buildCompletionItems() {
            this.attritubes.forEach(attr => {
                this.completionItems.push(...attr.buildCompletionItem());
            });
            this.nameCompletionItems = this.attritubes.map(attr => {
                return attr.buildNameCompletionItem();
            });
        }
        buildCompletionItem() {
            var _a;
            this.buildCompletionItems();
            let completionItem = vscodeLanguageserver.CompletionItem.create(this.name);
            completionItem.kind = vscodeLanguageserver.CompletionItemKind.Class;
            let _insertText = this.name;
            let _snippetNum = 1;
            for (let attr of Object.values(this.attributeMap)) {
                if (attr.isNecessary) {
                    _insertText += `\n\t${(_a = attr.getCompletionItem()) === null || _a === void 0 ? void 0 : _a.insertText}`.replace("$1", "$" + _snippetNum + "");
                    _snippetNum++;
                }
            }
            if (_snippetNum === 1) {
                _insertText += ">${1:}" + `</${this.name}>`;
            }
            else {
                _insertText += `\n>$${_snippetNum}</${this.name}>`;
            }
            completionItem.insertText = _insertText;
            completionItem.detail = `这是一个${this.name}组件`;
            completionItem.insertTextFormat = vscodeLanguageserver.InsertTextFormat.Snippet;
            return completionItem;
        }
        buildNameCompletionItem() {
            let _result = vscodeLanguageserver.CompletionItem.create(this.name);
            _result.detail = `这是一个${this.name}组件`;
            return _result;
        }
        getNameCompltionItems() {
            return this.completionItems;
        }
        getFullCompltionItems(currentRange) {
            if (!currentRange) {
                return this.completionItems;
            }
            return this.completionItems.map(_completionItem => {
                _completionItem.textEdit = {
                    range: currentRange,
                    newText: _completionItem.insertText ? _completionItem.insertText : "",
                };
                return _completionItem;
            });
        }
        getSubNode(attrname) {
            return this.attributeMap[attrname];
        }
        getSubNodes() {
            return Object.values(this.attributeMap);
        }
        getParent() {
            return new RootNode();
        }
        getHoverInfo() {
            let _markUpBuilder = new MarkUpBuilder(this.description + "\n");
            const properties = this.attritubes;
            _markUpBuilder.addSpecialContent('typescript', this.attritubes.map(attr => {
                return attr.getName() + ' :' + attr.getSortDescription();
            }));
            return { contents: _markUpBuilder.getMarkUpContent() };
        }
    }
    class Directive extends Component {
        constructor(name, description = "", attritubes = []) {
            super(name, description, attritubes);
        }
        //Question:为什么返回值不同会报错
        getcompletionKind() { return vscodeLanguageserver.CompletionItemKind.Module; }
        buildAddCompletionItems() {
            let completionItem = vscodeLanguageserver.CompletionItem.create(this.name);
            completionItem.kind = vscodeLanguageserver.CompletionItemKind.Class;
            let _insertText = this.name;
            completionItem.insertText = this.name;
            completionItem.detail = `这是一个${this.name}指令`;
            completionItem.insertTextFormat = vscodeLanguageserver.InsertTextFormat.PlainText;
            return completionItem;
        }
        buildNameCompletionItem() {
            let _result = vscodeLanguageserver.CompletionItem.create(this.name);
            _result.detail = `这是一个${name}指令`;
            return _result;
        }
    }
    class Attribute {
        constructor(name, type, defaultValue, sortDescription, description, isNecessary, isEvent, valueSet = [], completionKind, parent) {
            this.name = name;
            this.type = type;
            this.defaultValue = defaultValue;
            this.sortDescription = sortDescription;
            this.description = description;
            this.isNecessary = isNecessary;
            this.isEvent = isEvent;
            this.valueSet = valueSet;
            this.completionKind = completionKind;
            this.parent = parent;
            this.nameCompletionItems = [];
            this.completionItems = [];
        }
        buildCompletionItems() {
            this.valueSet.forEach(value => {
                let completionItem = vscodeLanguageserver.CompletionItem.create(value);
                completionItem.kind = vscodeLanguageserver.CompletionItemKind.EnumMember;
                completionItem.insertText = value;
                completionItem.detail = `这是${value}类型`;
                completionItem.documentation = new MarkUpBuilder().addContent("![demo](https://s2.ax1x.com/2020/03/08/3z184H.gif)").getMarkUpContent();
                completionItem.preselect = true;
                this.completionItems.push(completionItem);
            });
            this.nameCompletionItems = this.completionItems;
        }
        buildCompletionItem() {
            this.buildCompletionItems();
            let _result = [];
            // let _completionItem:CompletionItem; 
            if (this.isEvent) {
                _result.push(vscodeLanguageserver.CompletionItem.create(`(${this.name})`));
            }
            else if (this.type == STRING) {
                _result.push(vscodeLanguageserver.CompletionItem.create(`${this.name}`), vscodeLanguageserver.CompletionItem.create(`[${this.name}]`));
            }
            else {
                _result.push(vscodeLanguageserver.CompletionItem.create(`[${this.name}]`));
            }
            _result.forEach((_completionItem) => {
                _completionItem.detail = this.sortDescription;
                _completionItem.documentation = new MarkUpBuilder().addSpecialContent('typescript', [
                    `type:${this.type}`,
                    "DefaultValue:" + this.getDefaultValue(),
                    "Description:" + this.getDescription()
                ]).getMarkUpContent();
                //Question: 是否要统一样式?
                // _completionItem.kind = this.getcompletionKind();
                _completionItem.kind = this.completionKind;
                let _valueString = converValueSetToValueString(this.valueSet);
                if (_result.length === 1) {
                    if (this.getcompletionKind() === vscodeLanguageserver.CompletionItemKind.Event) {
                        _completionItem.insertText = "(" + this.name + ")=\"$1\"";
                    }
                    else if (this.type === BOOLEAN) {
                        _completionItem.insertText = "[" + this.name + "]=\"${1|true,false|}\"";
                    }
                    else {
                        _completionItem.insertText = `[${this.name}]=\"\${1${_valueString}}\"`;
                    }
                }
                else {
                    if (_completionItem.label.charCodeAt(0) === 91)
                        _completionItem.insertText = `[${this.name}]=\"\${1${_valueString}}\"`;
                    else
                        _completionItem.insertText = _valueString == "" ? `${this.name}=\"$1"` : `${this.name}=\${1${_valueString}}`;
                }
                _completionItem.insertTextFormat = vscodeLanguageserver.InsertTextFormat.Snippet;
                _completionItem.preselect = true;
            });
            this.completionItem = _result[0];
            // logger.debug(_result[0]);
            return _result;
        }
        buildNameCompletionItem() {
            let _result = vscodeLanguageserver.CompletionItem.create(this.name);
            _result.detail = this.sortDescription;
            _result.documentation = new MarkUpBuilder().addSpecialContent('typescript', [
                `type:${this.type}`,
                "DefaultValue:" + this.getDefaultValue(),
                "Description:" + this.getDescription()
            ]).getMarkUpContent();
            return _result;
        }
        getNameCompltionItems() {
            return this.completionItems;
        }
        getFullCompltionItems(range) {
            if (!range) {
                return this.completionItems;
            }
            return this.completionItems.map(_completionItem => {
                let _completionAddItem = _completionItem;
                copyCompletionItem(_completionItem, _completionAddItem);
                _completionAddItem.textEdit = {
                    range: range,
                    newText: _completionItem.insertText ? _completionItem.insertText : ""
                };
                return _completionAddItem;
            });
        }
        getHoverInfo() {
            let _markUpBuilder = new MarkUpBuilder(this.getName() + "\n");
            _markUpBuilder.addSpecialContent('typescript', ["Description:" + this.description,
                "Type:" + this.getValueType(),
                "DefaultValue:" + this.getDefaultValue(),
                "ValueSet:" + this.valueSet]);
            return { contents: _markUpBuilder.getMarkUpContent() };
        }
        getName() { return this.name; }
        getSortDescription() { return this.sortDescription; }
        getDescription() { return this.description; }
        getcompletionKind() { return this.completionKind; }
        getValueType() { return this.type; }
        getDefaultValue() { return this.defaultValue; }
        getValueSet() { return this.valueSet; }
        getSubNode(name) { return; }
        getSubNodes() { return; }
        getParent() { return this.parent; }
        getCompletionItem() { return this.completionItem; }
    }
    class DevUIParamsConstructor {
        constructor() {
            this.rootNode = new RootNode();
            this.schema = this.rootNode.schema;
            this.prefix = "";
        }
        build() {
            let _elementName;
            HTML_SCHEMA.forEach(elementInfo => {
                const parts = elementInfo.split("||");
                if (parts.length === 2) {
                    _elementName = this.prefix + parts[0].toLocaleLowerCase();
                    this.schema[_elementName] = new Component(_elementName, parts[1]);
                }
                else if (parts.length === 3) {
                    this.prefix = parts[1];
                    // console.log(_elementName);
                }
                else {
                    // console.log(_elementName);
                    const _element = this.schema[_elementName];
                    if (_element.getAttribute(parts[0])) ;
                    if (_element) {
                        _element.addAttritube(new Attribute(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5] === "true" ? true : false, parts[6] === "true" ? true : false, parts[7] === "[]" ? [] : parts[7].substring(1, parts[7].length - 1).replace(" ", "").split(","), 
                        // JSON.parse(parts[7]),
                        this.changeToCompletionKind(parts[1], parts[6]), _element));
                        // console.log(_element.getAttributes()); 
                    }
                    else {
                        throw Error(`Something wrong with ${_elementName}`);
                    }
                }
            });
            this.buildCompletionItems();
            return this.rootNode;
        }
        buildCompletionItems() {
            this.rootNode.buildCompletionItems();
            this._buildCompletionItems(this.rootNode);
        }
        _buildCompletionItems(node) {
            node.buildNameCompletionItem();
            let subnodes = node.getSubNodes();
            if (subnodes) {
                for (let subnode of subnodes) {
                    this._buildCompletionItems(subnode);
                }
            }
            return;
        }
        changeToCompletionKind(type, isEvent) {
            type = type.toLowerCase();
            if (isEvent === "true") {
                return vscodeLanguageserver.CompletionItemKind.Event;
            }
            if (type.includes("arrray") || type.includes("[]")) {
                return vscodeLanguageserver.CompletionItemKind.Enum;
            }
            return vscodeLanguageserver.CompletionItemKind.Variable;
        }
        getRoot() {
            return this.rootNode;
        }
    }
    const htmlInfo = new DevUIParamsConstructor();

    /*
     * @Author: your name
     * @Date: 2020-04-08 20:38:08
     * @LastEditTime: 2020-05-18 12:31:13
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper-LSP\server\src\completion.ts
     */
    class CompletionProvider {
        constructor() {
            this.tabCompletionFlag = true;
        }
        provideCompletionItes(_params, type) {
            let { textDocument, position } = _params;
            let _textDocument = host.getDocumentFromURI(textDocument.uri);
            let _offset = _textDocument.offsetAt(position);
            host.igniter.parseTextDocument(_textDocument, { frameName: SupportFrameName.Angular, tagMarkedPrefixs: [] });
            if (type === FileType.HTML) {
                return this.provideCompletionItemsForHTML(_offset, _textDocument);
            }
            else {
                return [];
            }
        }
        provideCompletionItemsForHTML(_offset, _textDocument) {
            let { node, span, ast, type } = this.searchTerminalASTForCompletion(_offset, _textDocument);
            if (!node || type === CompletionType.NONE) {
                return [];
            }
            let _range = convertSpanToRange(_textDocument, span);
            if (node instanceof Component && ast instanceof HTMLTagAST) {
                return this.CompletionItemsFactory(node, ast, type, _range);
            }
            if (!_range) {
                return node.getFullCompltionItems();
            }
            //TODO : 会不会出现没有name的情况呢？
            if (type === CompletionType.FUll) {
                if (node === host.htmlSourceTreeRoot) {
                    let _endflag = ast.getSpan() === ast.nameSpan;
                    if (_endflag) {
                        return node.getFullCompltionItems(_range, _endflag);
                    }
                }
                return node.getFullCompltionItems(_range);
            }
            else {
                return node.getNameCompltionItems(_range);
            }
        }
        searchTerminalASTForCompletion(offset, textDocument) {
            let { ast, type } = host.hunter.searchTerminalAST(offset - 1, textDocument.uri);
            if (!ast) {
                throw Error(`this offset does not in any Node :${offset}`);
            }
            switch (type) {
                case (SearchResultType.Content):
                    if (ast instanceof HTMLTagAST) {
                        return ({ node: host.htmlSourceTreeRoot, span: undefined, ast: ast, type: CompletionType.NONE });
                    }
                case (SearchResultType.Name): {
                    this.tabCompletionFlag = true;
                    let _autoSwitchFlag = (ast.getSpan().end - ast.nameSpan.end) > 3;
                    let _span = _autoSwitchFlag ? ast.nameSpan : ast.getSpan();
                    if (ast instanceof HTMLTagAST && !_autoSwitchFlag) {
                        _span.start++;
                    }
                    let _type = _autoSwitchFlag ? CompletionType.Name : CompletionType.FUll;
                    adjustSpanToAbosulutOffset(ast, _span);
                    if (ast instanceof HTMLTagAST) {
                        return ({ node: host.htmlSourceTreeRoot, span: _span, ast: ast, type: _type });
                    }
                    return { node: host.hunter.findHTMLInfoNode(ast.parentPointer, textDocument.uri), span: _span, ast: ast.parentPointer, type: _type };
                }
                case (SearchResultType.Value): {
                    if (this.getCompletionFlag(textDocument.getText(), offset)) {
                        return { node: host.hunter.findHTMLInfoNode(ast, textDocument.uri), span: undefined, ast: ast, type: CompletionType.FUll };
                    }
                }
                case (SearchResultType.Null): return { node: undefined, span: undefined, ast: new HTMLCommentAST(), type: CompletionType.FUll };
            }
        }
        getCompletionFlag(text, offset) {
            if (offset <= 2) {
                return true;
            }
            if (WhiteChars.indexOf(text.charCodeAt(offset - 1)) !== -1) {
                let _number = text.charCodeAt(offset - 2);
                if (Space.indexOf(text.charCodeAt(offset - 2)) !== -1) {
                    let _offset = offset - 2;
                    while (Space.indexOf(text.charCodeAt(_offset)) !== -1) {
                        _offset--;
                    }
                    if (newLine.indexOf(text.charCodeAt(_offset)) !== -1) {
                        if (this.tabCompletionFlag) {
                            this.tabCompletionFlag = false;
                            return true;
                        }
                    }
                    return false;
                }
                else if (offset === text.length || WhiteCharsAndLTAndLTANDSPLASH.indexOf(text.charCodeAt(offset + 1)) !== -1) {
                    return true;
                }
            }
            return false;
        }
        CompletionItemsFactory(node, ast, type, range) {
            let _directives = ast.attrList.directive.getEach(e => e.getName());
            let _attrs = ast.attrList.attr.getEach(e => e.getName());
            let _directivesNodes = _directives === null || _directives === void 0 ? void 0 : _directives.map(name => {
                return host.htmlSourceTreeRoot.getDirectives(name);
            });
            let _result = [];
            if (type === CompletionType.FUll && range) {
                _result.push(...node.getFullCompltionItems(range));
                _directivesNodes === null || _directivesNodes === void 0 ? void 0 : _directivesNodes.forEach(node => {
                    if (node)
                        _result.push(...node.getFullCompltionItems(range));
                });
                _result = _result.filter((e) => {
                    for (let name of _attrs) {
                        if (name.includes(e.label))
                            return false;
                    }
                    return true;
                });
                return _result;
            }
            else {
                _result.push(...node.getNameCompltionItems());
                _directivesNodes === null || _directivesNodes === void 0 ? void 0 : _directivesNodes.forEach(node => {
                    if (node)
                        _result.push(...node.getNameCompltionItems());
                });
                _result = _result.filter((e) => {
                    for (let name of _attrs) {
                        if (e.label.includes(name))
                            return false;
                    }
                    return true;
                });
                return _result;
            }
        }
    }

    /*
     * @Author: your name
     * @Date: 2020-05-03 09:30:22
     * @LastEditTime: 2020-05-15 12:18:51
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \UI_Components_Helper\server\src\HoverProvider.ts
     */
    class HoverProvider {
        constructor() { }
        provideHoverInfoForHTML(params) {
            let _document = host.documents.get(params.textDocument.uri);
            if (!_document) {
                return { contents: "Error!!!" };
            }
            let _offset = _document.offsetAt(params.position);
            host.igniter.parseTextDocument(_document, { frameName: SupportFrameName.Angular, tagMarkedPrefixs: [] });
            let _result = this.searchTerminalASTForHover(_offset, params.textDocument.uri);
            let { node, span } = _result;
            if (!span) {
                return;
            }
            else if (!node || !(node.getHoverInfo())) {
                return { contents: "Error!!!", range: convertSpanToRange(_document, span) };
            }
            return { contents: node.getHoverInfo().contents, range: convertSpanToRange(_document, span) };
        }
        searchTerminalASTForHover(offset, uri) {
            let { ast, type } = host.hunter.searchTerminalAST(offset, uri);
            if (!ast) {
                throw Error(`this offset does not in any Node :${offset}`);
            }
            let _span = ast.nameSpan.clone();
            adjustSpanToAbosulutOffset(ast, _span);
            if (!_span) {
                return { node: undefined, span: undefined };
            }
            if (type === SearchResultType.Null || !ast) {
                return { node: undefined, span: _span };
            }
            else {
                let _htmlInfoNode = host.hunter.findHTMLInfoNode(ast, uri);
                return { node: _htmlInfoNode, span: _span };
            }
        }
    }

    /*
     * @Author: your name
     * @Date: 2020-04-09 18:58:10
     * @LastEditTime: 2020-05-16 17:50:25
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper-LSP\server\src\parser\parser.ts
     */
    class YQ_Parser {
        constructor() {
        }
        parseTextDocument(textDocument, parseOption) {
            const uri = textDocument.uri;
            const tokenizer = new Tokenizer(textDocument);
            const tokens = tokenizer.Tokenize();
            const treebuilder = new TreeBuilder(tokens);
            return treebuilder.build();
        }
    }
    class SearchParser {
        constructor() { }
        DFS(offset, root) {
            if (root instanceof HTMLTagAST) {
                offset -= root.tagOffset;
            }
            let _searchresult = root.search(offset);
            let { ast, type } = _searchresult;
            if (!_searchresult || (!ast && type === SearchResultType.Null)) {
                return;
            }
            else if (!ast && type !== SearchResultType.Null) {
                return { ast: root, type: type };
            }
            else if (ast) {
                let _result = this.DFS(offset, ast);
                return _result;
            }
        }
    }

    /*
     * @Author: your name
     * @Date: 2020-05-12 14:52:22
     * @LastEditTime: 2020-05-18 14:12:15
     * @LastEditors: Please set LastEditors
     * @Description: In User Settings Edit
     * @FilePath: \DevUIHelper-LSP V4.0\server\src\GlobalData\GlobalData.ts
     */
    class Host {
        constructor() {
            this.parser = new YQ_Parser();
            this.hunter = new Hunter();
            this.igniter = new Igniter();
            this.snapshotMap = new Map();
            this.hoverProvider = new HoverProvider();
            this.completionProvider = new CompletionProvider();
            this.documents = new vscodeLanguageserver.TextDocuments(vscodeLanguageserverTextdocument.TextDocument);
            this.htmlSourceTreeRoot = new DevUIParamsConstructor().build();
        }
        getDocumentFromURI(uri) {
            let _result = this.documents.get(uri);
            if (!_result) {
                throw Error(`Cannot get file from uri ${uri}`);
            }
            return _result;
        }
        getSnapShotFromURI(uri) {
            let _result = this.snapshotMap.get(uri);
            if (!_result) {
                throw Error(`Cannot get snapShot from uri ${uri}`);
            }
            return _result;
        }
    }
    class Hunter {
        constructor() {
            this.searchParser = new SearchParser();
        }
        searchTerminalAST(offset, uri) {
            let _snapShot = host.snapshotMap.get(uri);
            if (!_snapShot) {
                throw Error(`this uri does not have a snapShot: ${uri}`);
            }
            const { root, textDocument, HTMLAstToHTMLInfoNode } = _snapShot;
            if (!root) {
                throw Error(`Snap shot does not have this file : ${uri}, please parse it befor use it!`);
            }
            let _result = this.searchParser.DFS(offset, root);
            //调整Node位置
            return _result ? _result : { ast: undefined, type: SearchResultType.Null };
        }
        findHTMLInfoNode(ast, uri, map) {
            if (!ast) {
                throw Error(`ast Does not Exits in file: ${uri}`);
            }
            if (!map) {
                map = host.getSnapShotFromURI(uri).HTMLAstToHTMLInfoNode;
            }
            //表内存在则直接返回
            let res = map.get(ast);
            if (res) {
                return res;
            }
            if (ast.getName() == "$$ROOT$$") {
                let _htmlroot = host.htmlSourceTreeRoot;
                map.set(ast, _htmlroot);
                return _htmlroot;
            }
            let _name = ast.getName();
            let _parentast = ast.parentPointer;
            //没有指针报错
            if (!_parentast || !_name) {
                throw Error(`None parent cursor or name of node ${_name}`);
            }
            if (ast instanceof HTMLTagAST) {
                return host.htmlSourceTreeRoot.getSubNode(_name);
            }
            else {
                //表内没有则向上递归
                _name = convertStringToName(_name);
                let _parentInfoNode = map.get(_parentast);
                if (!_parentInfoNode) {
                    _parentInfoNode = this.findHTMLInfoNode(_parentast, uri);
                }
                if (_parentInfoNode) {
                    let _currentInfoNode = _parentInfoNode === null || _parentInfoNode === void 0 ? void 0 : _parentInfoNode.getSubNode(_name);
                    if (_currentInfoNode) {
                        map.set(ast, _currentInfoNode);
                    }
                    return _currentInfoNode;
                }
            }
        }
    }
    class Igniter {
        constructor() { }
        init() {
        }
        parseTextDocument(textDocument, parseOption) {
            let { root, errors } = host.parser.parseTextDocument(textDocument, parseOption);
            host.snapshotMap.set(textDocument.uri, new SnapShot(root, errors, textDocument));
            //ROOTLogger
            // logger.debug(JSON.stringify(root));
            //ALERT:DEBUG用,发行版应该删除
            // fs.writeFile(__dirname+'\\result.json',JSON.stringify(root),(err)=>{
            // 	if(err){
            // 		logger.debug("SometionWronbg Happen!! ______________")
            // 		logger.debug(err.message);
            // 		throw err;
            // 	}
            // 	logger.debug("Data Wirte Done !!! ______________")
            // });
            // logger.debug(process.execPath);
            // logger.debug(__dirname);
            // logger.debug(process.cwd());
        }
    }
    class SnapShot {
        constructor(root, errors, textDocument) {
            this.root = root;
            this.errors = errors;
            this.textDocument = textDocument;
            this.HTMLAstToHTMLInfoNode = new Map();
            this.context = "";
            this.context = this.textDocument.getText();
        }
    }

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    log4js.configure({
        appenders: {
            lsp_demo: {
                type: "console",
            },
        },
        categories: { default: { appenders: ["lsp_demo"], level: "debug" } }
    });
    const logger = log4js.getLogger("lsp_demo");
    const host = new Host();
    // Create a connection for the server. The connection uses Node's IPC as a transport.
    // Also include all preview / proposed LSP features.
    let connection = vscodeLanguageserver.createConnection(vscodeLanguageserver.ProposedFeatures.all);
    let documents = host.documents;
    //初始化htmlInfo
    const completionProvider = new CompletionProvider();
    const hoverProvider = new HoverProvider();
    // logger.debug(JSON.stringify(htmlSourceTreeRoot));
    // JSON.pa
    connection.onInitialize((params) => {
        let capabilities = params.capabilities;
        logger.debug(params.rootPath);
        return {
            capabilities: {
                textDocumentSync: vscodeLanguageserver.TextDocumentSyncKind.Full,
                // Tell the client that the server supports code completion
                completionProvider: {
                    resolveProvider: false,
                    triggerCharacters: ['<', '-', '+', '[', '(', '\"', ' ', '\n']
                },
                hoverProvider: true,
            }
        };
    });
    connection.onInitialized(() => {
        logger.debug(`Welcome to DevUI Helper!`);
    });
    // The global settings, used when the `workspace/configuration` request is not supported by the client.
    // Please note that this is not the case when using this server with the client provided in this example
    // but could happen with other clients.
    const defaultSettings = { maxNumberOfProblems: 1 };
    let globalSettings = defaultSettings;
    // Cache the settings of all open documents
    let documentSettings = new Map();
    connection.onDidChangeConfiguration(change => {
        {
            globalSettings = ((change.settings.languageServerExample || defaultSettings));
        }
        // Revalidate all open text documents
        // documents.all().forEach(validateTextDocument);
    });
    function getDocumentSettings(resource) {
        {
            return Promise.resolve(globalSettings);
        }
    }
    // Only keep settings for open documents
    documents.onDidClose(e => {
        documentSettings.delete(e.document.uri);
    });
    connection.onDidChangeWatchedFiles(_change => {
        // Monitored files have change in VSCode
        connection.console.log('We received an file change event');
    });
    //分析器
    const hunter = new Hunter();
    // This handler provides the initial list of the completion items.
    connection.onCompletion((_textDocumentPosition) => {
        var _a;
        logger.debug(`Completion work`);
        logger.debug(`cursorOffset at : ${(_a = documents.get(_textDocumentPosition.textDocument.uri)) === null || _a === void 0 ? void 0 : _a.offsetAt(_textDocumentPosition.position)}`);
        const _textDocument = documents.get(_textDocumentPosition.textDocument.uri);
        return host.completionProvider.provideCompletionItes(_textDocumentPosition, FileType.HTML);
        // if(_textDocument){
        //TODO : 将分析放到外层。
        // host.hunter.parseTextDocument(_textDocument,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]});
        // }
        // let source = htmlSourceTreeRoot;
        // 	const _offset = _textDocument!.offsetAt(_textDocumentPosition.position);
        // 	if(_textDocument){
        // 		return completionProvider.provideCompletionItemsForHTML(_offset,_textDocument);
        // 	}
        // }
        // return [];
    });
    connection.onHover((_textDocumentPosition) => {
        var _a;
        logger.debug(`HoverProvider works!`);
        logger.debug(`cursorOffset at : ${(_a = documents.get(_textDocumentPosition.textDocument.uri)) === null || _a === void 0 ? void 0 : _a.offsetAt(_textDocumentPosition.position)}`);
        return host.hoverProvider.provideHoverInfoForHTML(_textDocumentPosition);
    });
    documents.onDidChangeContent(change => {
        validateTextDocument(change.document);
        logger.debug(`changeHappened!`);
        logger.debug(change.document.uri);
    });
    function validateTextDocument(textDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            // In this simple example we get the settings for every validate run.
            let settings = yield getDocumentSettings(textDocument.uri);
            // The validator creates diagnostics for all uppercase words length 2 and more
            let text = textDocument.getText();
            let pattern = /\b[A-Z]{2,}\b/g;
            let m;
            let problems = 0;
            let diagnostics = [];
            while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
                problems++;
                let diagnostic = {
                    severity: vscodeLanguageserver.DiagnosticSeverity.Warning,
                    range: {
                        start: textDocument.positionAt(m.index),
                        end: textDocument.positionAt(m.index + m[0].length)
                    },
                    message: `${m[0]} is all uppercase.`,
                    source: 'ex'
                };
                diagnostics.push(diagnostic);
            }
            // Send the computed diagnostics to VSCode.
            connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
        });
    }
    // This handler resolves additional information for the item selected in
    // the completion list.
    // connection.onCompletionResolve(
    // 	(item: CompletionItem): CompletionItem => {
    // 		return item;
    // 	}
    // );
    documents.onDidOpen((event) => {
        // logger.debug(`on open:${event.document.uri}`);
        // logger.debug(`file version:${event.document.version}`);
        // logger.debug(`file content:${event.document.getText()}`);
        // logger.debug(`language id:${event.document.languageId}`);
        // logger.debug(`line count:${event.document.lineCount}`);
        // host.parseTextDocument(event.document,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]});
    });
    documents.onDidChangeContent((e) => {
        // logger.debug('document change received.');
        // logger.debug(`document version:${e.document.version}`);
        // logger.debug(`language id:${e.document.languageId}`);
        // // logger.debug(`text:${e.document.getText()}`);
        // host.parseTextDocument(e.document,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]});
        // logger.debug(`line count:${e.document.lineCount}`);
        // let tokenizer = new Tokenizer(e.document,new TokenizeOption("<d-"));
        // tokenizer.Tokenize();
    });
    connection.onDidOpenTextDocument((params) => {
        // A text document got opened in VSCode.
        // params.textDocument.uri uniquely identifies the document. For documents store on disk this is a file URI.
        // params.textDocument.text the initial full content of the document.
        logger.debug(`${params.textDocument.uri} opened.`);
    });
    connection.onDidChangeTextDocument((params) => {
        // The content of a text document did change in VSCode.
        // params.textDocument.uri uniquely identifies the document.
        // params.contentChanges describe the content changes to the document.
        logger.debug(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
    });
    connection.onDidCloseTextDocument((params) => {
        // A text document got closed in VSCode.
        // params.textDocument.uri uniquely identifies the document.
        connection.console.log(`${params.textDocument.uri} closed.`);
    });
    // Make the text document manager listen on the connection
    // for open, change and close text document events
    documents.listen(connection);
    // Listen on the connection
    connection.listen();

    exports.completionProvider = completionProvider;
    exports.host = host;
    exports.hoverProvider = hoverProvider;
    exports.hunter = hunter;
    exports.logger = logger;

    Object.defineProperty(exports, '__esModule', { value: true });

});
