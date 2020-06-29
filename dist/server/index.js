define(['log4js', 'vscode-languageserver-textdocument', 'vscode-languageserver', 'fs'], function (log4js, vscodeLanguageserverTextdocument, vscodeLanguageserver, fs) { 'use strict';

	log4js = log4js && Object.prototype.hasOwnProperty.call(log4js, 'default') ? log4js['default'] : log4js;
	vscodeLanguageserverTextdocument = vscodeLanguageserverTextdocument && Object.prototype.hasOwnProperty.call(vscodeLanguageserverTextdocument, 'default') ? vscodeLanguageserverTextdocument['default'] : vscodeLanguageserverTextdocument;
	vscodeLanguageserver = vscodeLanguageserver && Object.prototype.hasOwnProperty.call(vscodeLanguageserver, 'default') ? vscodeLanguageserver['default'] : vscodeLanguageserver;
	fs = fs && Object.prototype.hasOwnProperty.call(fs, 'default') ? fs['default'] : fs;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var type = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-05-10 11:47:06
	 * @LastEditTime: 2020-05-13 22:58:15
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \UI_Components_Helper\server\src\DataStructor\tytpe.ts
	 */
	var Span = /** @class */ (function () {
	    /**
	     * 开始的和结束范围,使用offset进行标注
	     */
	    function Span(start, end) {
	        var _this = this;
	        this.start = start;
	        this.end = end;
	        this.toJSON = function () {
	            return "[start:" + _this.start + " end:" + _this.end + "]";
	        };
	    }
	    Span.prototype.build = function (end) {
	        this.end = end;
	    };
	    Span.prototype.inSpan = function (offset) {
	        if (!this.end) {
	            return false;
	        }
	        if (offset >= this.start && offset <= this.end) {
	            return true;
	        }
	        return false;
	    };
	    Span.prototype.inCompletionSpan = function (offset) {
	        if (!this.end) {
	            return false;
	        }
	        if (offset >= this.start && offset <= this.end + 1) {
	            return true;
	        }
	        return false;
	    };
	    Span.prototype.selfShift = function (offset, directive) {
	        if (directive) {
	            this.start += offset;
	            this.end += offset;
	        }
	        else {
	            this.start -= offset;
	            this.end -= offset;
	        }
	    };
	    Span.prototype.shift = function (offset, directive) {
	        var _span = this.clone();
	        _span.selfShift(offset, directive);
	        return _span;
	    };
	    Span.prototype.clone = function () {
	        return new Span(this.start, this.end);
	    };
	    return Span;
	}());
	exports.Span = Span;
	});

	var type$1 = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;

	var SupportFrameName;
	(function (SupportFrameName) {
	    SupportFrameName[SupportFrameName["Angular"] = 0] = "Angular";
	    SupportFrameName[SupportFrameName["Vue"] = 1] = "Vue";
	    SupportFrameName[SupportFrameName["React"] = 2] = "React";
	    SupportFrameName[SupportFrameName["Null"] = 3] = "Null";
	})(SupportFrameName = exports.SupportFrameName || (exports.SupportFrameName = {}));
	var SupportComponentName;
	(function (SupportComponentName) {
	    SupportComponentName[SupportComponentName["DevUI"] = 1] = "DevUI";
	    SupportComponentName[SupportComponentName["Zorro"] = 2] = "Zorro";
	})(SupportComponentName = exports.SupportComponentName || (exports.SupportComponentName = {}));
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
	    TokenType[TokenType["EOF"] = 14] = "EOF"; //
	})(TokenType = exports.TokenType || (exports.TokenType = {}));
	var NodeStatus;
	(function (NodeStatus) {
	    NodeStatus[NodeStatus["DEFAULT"] = 0] = "DEFAULT";
	    NodeStatus[NodeStatus["NEW"] = 1] = "NEW";
	    NodeStatus[NodeStatus["MODIFIED"] = 2] = "MODIFIED";
	    NodeStatus[NodeStatus["DELETE"] = 3] = "DELETE";
	})(NodeStatus = exports.NodeStatus || (exports.NodeStatus = {}));
	var TagHeadNodeType;
	(function (TagHeadNodeType) {
	    TagHeadNodeType[TagHeadNodeType["DIRECTIVE"] = 0] = "DIRECTIVE";
	    TagHeadNodeType[TagHeadNodeType["TEMPLATE"] = 1] = "TEMPLATE";
	    TagHeadNodeType[TagHeadNodeType["ATTR"] = 2] = "ATTR";
	    TagHeadNodeType[TagHeadNodeType["CONTENT"] = 3] = "CONTENT";
	})(TagHeadNodeType = exports.TagHeadNodeType || (exports.TagHeadNodeType = {}));
	var TagLinkedListHead = /** @class */ (function () {
	    function TagLinkedListHead(type$1) {
	        this.linkType = type$1;
	        this.span = new type.Span(-1, -1);
	        this.status = NodeStatus.DEFAULT;
	    }
	    TagLinkedListHead.prototype.setSpanStart = function (offset) {
	        this.span.start = offset;
	    };
	    TagLinkedListHead.prototype.setSpanEnd = function (offset) {
	        this.span.end = offset;
	    };
	    TagLinkedListHead.prototype.setStatus = function (status) {
	        this.status = status;
	    };
	    return TagLinkedListHead;
	}());
	exports.TagLinkedListHead = TagLinkedListHead;
	var Token = /** @class */ (function () {
	    function Token(type, span) {
	        this.type = type;
	        this.span = span;
	    }
	    Token.prototype.setSpan = function (start, end) {
	        this.span = new type.Span(start, end);
	    };
	    return Token;
	}());
	exports.Token = Token;
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
	})(HTMLASTNodeType = exports.HTMLASTNodeType || (exports.HTMLASTNodeType = {}));
	var ParseErrorLevel;
	(function (ParseErrorLevel) {
	    ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
	    ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
	})(ParseErrorLevel = exports.ParseErrorLevel || (exports.ParseErrorLevel = {}));
	var TreeError = /** @class */ (function () {
	    function TreeError(span, msg, ast, level) {
	        if (level === void 0) { level = ParseErrorLevel.ERROR; }
	        this.span = span;
	        this.msg = msg;
	        this.ast = ast;
	        this.level = level;
	    }
	    return TreeError;
	}());
	exports.TreeError = TreeError;
	var SearchResultType;
	(function (SearchResultType) {
	    SearchResultType[SearchResultType["Null"] = 0] = "Null";
	    SearchResultType[SearchResultType["Name"] = 1] = "Name";
	    SearchResultType[SearchResultType["Value"] = 2] = "Value";
	    SearchResultType[SearchResultType["Content"] = 3] = "Content";
	})(SearchResultType = exports.SearchResultType || (exports.SearchResultType = {}));
	// =<[prefix:string]:Component>{}
	});

	var chars = createCommonjsModule(function (module, exports) {
	/*
	 * @Author: your name
	 * @Date: 2020-04-07 15:11:35
	 * @LastEditTime: 2020-05-15 11:44:27
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\parser\chars.ts
	 */
	/**
	 * @license
	 * Copyright Google Inc. All Rights Reserved.
	 *
	 * Use of this source code is governed by an MIT-style license that can be
	 * found in the LICENSE file at https://angular.io/license
	 */
	exports.__esModule = true;
	exports.$EOF = 0;
	exports.$BSPACE = 8;
	exports.$TAB = 9;
	exports.$LF = 10;
	exports.$VTAB = 11;
	exports.$FF = 12;
	exports.$CR = 13;
	exports.$SPACE = 32;
	exports.$BANG = 33;
	exports.$DQ = 34;
	exports.$HASH = 35;
	exports.$$ = 36;
	exports.$PERCENT = 37;
	exports.$AMPERSAND = 38;
	exports.$SQ = 39;
	exports.$LPAREN = 40;
	exports.$RPAREN = 41;
	exports.$STAR = 42;
	exports.$PLUS = 43;
	exports.$COMMA = 44;
	exports.$MINUS = 45;
	exports.$PERIOD = 46;
	exports.$SLASH = 47;
	exports.$COLON = 58;
	exports.$SEMICOLON = 59;
	exports.$LT = 60;
	exports.$EQ = 61;
	exports.$GT = 62;
	exports.$QUESTION = 63;
	exports.$0 = 48;
	exports.$7 = 55;
	exports.$9 = 57;
	exports.$A = 65;
	exports.$E = 69;
	exports.$F = 70;
	exports.$X = 88;
	exports.$Z = 90;
	exports.$LBRACKET = 91;
	exports.$BACKSLASH = 92;
	exports.$RBRACKET = 93;
	exports.$CARET = 94;
	exports.$_ = 95;
	exports.$a = 97;
	exports.$b = 98;
	exports.$e = 101;
	exports.$f = 102;
	exports.$n = 110;
	exports.$r = 114;
	exports.$t = 116;
	exports.$u = 117;
	exports.$v = 118;
	exports.$x = 120;
	exports.$z = 122;
	exports.$LBRACE = 123;
	exports.$BAR = 124;
	exports.$RBRACE = 125;
	exports.$NBSP = 160;
	exports.$PIPE = 124;
	exports.$TILDA = 126;
	exports.$AT = 64;
	exports.$BT = 96;
	function isWhitespace(code) {
	    return (code >= exports.$TAB && code <= exports.$SPACE) || (code == exports.$NBSP);
	}
	exports.isWhitespace = isWhitespace;
	function isDigit(code) {
	    return exports.$0 <= code && code <= exports.$9;
	}
	exports.isDigit = isDigit;
	function isAsciiLetter(code) {
	    return code >= exports.$a && code <= exports.$z || code >= exports.$A && code <= exports.$Z;
	}
	exports.isAsciiLetter = isAsciiLetter;
	function isAsciiHexDigit(code) {
	    return code >= exports.$a && code <= exports.$f || code >= exports.$A && code <= exports.$F || isDigit(code);
	}
	exports.isAsciiHexDigit = isAsciiHexDigit;
	function isNewLine(code) {
	    return code === exports.$LF || code === exports.$CR;
	}
	exports.isNewLine = isNewLine;
	function isOctalDigit(code) {
	    return exports.$0 <= code && code <= exports.$7;
	}
	exports.isOctalDigit = isOctalDigit;
	exports.WhiteChars = [9, 10, 11, 12, 13, 32, 160];
	exports.WhiteCharsAndGTAndSPLASH = [9, 10, 11, 12, 13, 32, 47, 62, 160];
	exports.WhiteCharsAndLT = [9, 10, 11, 12, 13, 32, 60, 160];
	exports.WhiteCharsAndLTAndSLASH = [9, 10, 11, 12, 13, 32, 60, 47, 160];
	exports.WhiteCharsAndLTAndGTANDSPLASH = [9, 10, 11, 12, 13, 32, 47, 60, 62, 160];
	exports.Space = [32, 160];
	exports.newLine = [10, 11, 13];
	});

	var lexer = createCommonjsModule(function (module, exports) {
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spread = (commonjsGlobal && commonjsGlobal.__spread) || function () {
	    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	    return ar;
	};
	exports.__esModule = true;
	/**
	 * @license
	 * Some of this lexerCode is from Angular/complier.
	 *
	 * Use of this source code is governed by an MIT-style license that can be
	 * found in the LICENSE file at https://angular.io/license
	 */



	var Token = /** @class */ (function () {
	    function Token(type$1, start) {
	        this.type = type$1;
	        this.start = start;
	        this.end = -1;
	        this.span = new type.Span(start, -1);
	    }
	    Token.prototype.build = function (end) {
	        this.end = end;
	        this.span = new type.Span(this.start, end);
	    };
	    Token.prototype.setSpan = function (start, end) {
	        this.span = new type.Span(start, end);
	    };
	    Token.prototype.getSpan = function () {
	        return this.span;
	    };
	    Token.prototype.getType = function () {
	        return this.type;
	    };
	    Token.prototype.setType = function (type) {
	        this.type = type;
	    };
	    Token.prototype.getValue = function () {
	        return this.value;
	    };
	    return Token;
	}());
	exports.Token = Token;
	var TokenizeOption = /** @class */ (function () {
	    function TokenizeOption(_startLabel) {
	        this._startLabel = _startLabel;
	    }
	    TokenizeOption.prototype.getstartLabel = function () {
	        return this._startLabel;
	    };
	    TokenizeOption.prototype.setstartLabel = function (v) {
	        this._startLabel = v;
	    };
	    return TokenizeOption;
	}());
	exports.TokenizeOption = TokenizeOption;
	var TokenizeOptions = /** @class */ (function () {
	    function TokenizeOptions() {
	        this.SCHEMA = {};
	        var tokenizeOptionForDevUI = new TokenizeOption("<d-");
	        this.SCHEMA['DevUI'] = tokenizeOptionForDevUI;
	    }
	    TokenizeOptions.prototype.getTokenizeOption = function (name) {
	        if (this.SCHEMA[name]) {
	            return this.SCHEMA[name];
	        }
	        throw Error("Cannot find TokenizeOption : " + name);
	    };
	    return TokenizeOptions;
	}());
	exports.TokenizeOptions = TokenizeOptions;
	var Tokenizer = /** @class */ (function () {
	    function Tokenizer(textDocument, start, end) {
	        if (start === void 0) { start = 0; }
	        if (end === void 0) { end = textDocument.getText().length; }
	        this.textDocument = textDocument;
	        this.start = start;
	        this.end = end;
	        this.result = [];
	        this.content = textDocument.getText();
	        this.cursor = new Cursor(this.content, start, end);
	    }
	    Tokenizer.prototype.Tokenize = function () {
	        /* 初始化 */
	        this.result = [];
	        try {
	            /**
	             * 直到指定的位置或者是文件末尾停下
	             */
	            while (this.cursor.offset < this.end) {
	                if (this.tryGet(chars.$LT)) {
	                    this._tokenInBuild = new Token(type$1.TokenType.TAG_START, this.cursor.offset - 1);
	                    if (this.tryGet(chars.$BANG)) {
	                        if (this.tryGet(chars.$MINUS)) {
	                            this.buildComment();
	                        }
	                        else {
	                            this.buildDocumentTag();
	                        }
	                    }
	                    else if (this.tryGet(chars.$SLASH)) {
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
	        this.startToken(type$1.TokenType.EOF);
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
	    };
	    /**
	     * Try家族
	     */
	    //注意这里有指针移动
	    Tokenizer.prototype.tryGet = function (char) {
	        if (this.cursor.peek() === char) {
	            this.cursor.advance();
	            return true;
	        }
	        return false;
	    };
	    Tokenizer.prototype.tryAdvanceThrogh = function (chars) {
	        while (chars.includes(this.cursor.peek())) {
	            this.cursor.advance();
	        }
	        return;
	    };
	    Tokenizer.prototype.tryStopAt = function (chars) {
	        // if(this._tokenInBuild){
	        // 	if([TokenType.ATTR_NAME,TokenType.ATTR_VALUE])
	        // }
	        while (!chars.includes(this.cursor.peek())) {
	            var num = this.cursor.peek();
	            this.cursor.advance();
	        }
	        return;
	    };
	    Tokenizer.prototype.tryStopbyFilter = function (favor, disgust) {
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
	    };
	    /**
	     * Token工厂家族
	     */
	    Tokenizer.prototype.startToken = function (tokenType) {
	        this._tokenInBuild = new Token(tokenType, this.cursor.getoffset());
	    };
	    //注意我们build的时候取的是offset的前一位
	    Tokenizer.prototype.buildToken = function () {
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
	            if (this._tokenInBuild.getType() === type$1.TokenType.TAG_NAME) {
	                if (this._tokenInBuild.value == "script") {
	                    var _relocation = this.content.indexOf("</script", this.cursor.offset) ? this.content.indexOf("</script", this.cursor.offset) : this.end;
	                    this.cursor.relocate(_relocation);
	                }
	                else if (this._tokenInBuild.value == "style") {
	                    var _relocation = this.content.indexOf("</style", this.cursor.offset) ? this.content.indexOf("</style", this.cursor.offset) : this.end;
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
	    };
	    /**
	     * Token装配车间
	     */
	    Tokenizer.prototype.buildOpenTag = function () {
	        // this.cursor.advance();
	        this.buildToken();
	        if (this.cursor.peek() === chars.$GT || this.cursor.peek() === chars.$SLASH) {
	            this.buildATTROrEndToken();
	            return;
	        }
	        else {
	            this.startToken(type$1.TokenType.TAG_NAME);
	            //如果关闭的情况下 closeTag
	            if (!this.tryStopbyFilter([chars.$GT, chars.$SLASH, chars.$LT], chars.WhiteChars)) {
	                this.buildToken();
	            }
	            if (this.cursor.peek() === chars.$LT)
	                return;
	            while (!this.buildATTROrEndToken()) { }
	        }
	    };
	    Tokenizer.prototype.buildClosedTag = function () {
	        var _a;
	        (_a = this._tokenInBuild) === null || _a === void 0 ? void 0 : _a.setType(type$1.TokenType.CLOSED_TAG);
	        this.buildToken();
	        this.startToken(type$1.TokenType.TAG_END_NAME);
	        if (this.tryStopbyFilter([chars.$GT], chars.WhiteCharsAndLT)) {
	            this.buildToken();
	            this.startToken(type$1.TokenType.TAG_END);
	        }
	        else {
	            this.buildToken();
	            return;
	        }
	        this.cursor.advance();
	        this.buildToken();
	        this.buildToken();
	    };
	    Tokenizer.prototype.buildATTROrEndToken = function () {
	        if (this.cursor.peek() === chars.$LT) {
	            return true;
	        }
	        if ([chars.$GT, chars.$SLASH].indexOf(this.cursor.peek()) !== -1) {
	            this.buildTagSelfClosedToken();
	            return true;
	        }
	        else if (chars.WhiteChars.indexOf(this.cursor.peek()) !== -1) {
	            this.cursor.advance();
	        }
	        else {
	            this.buildATTRToken();
	        }
	        return false;
	    };
	    Tokenizer.prototype.buildTagSelfClosedToken = function () {
	        this.buildToken();
	        if (this.cursor.peek() === chars.$GT) {
	            this.startToken(type$1.TokenType.TAG_END);
	            this.cursor.advance();
	        }
	        else if (this.cursor.peek() === chars.$LT) {
	            return;
	        }
	        else if (this.cursor.peek() === chars.$SLASH) {
	            this.startToken(type$1.TokenType.TAG_SELF_END);
	            this.cursor.advance();
	            if (!this.tryGet(chars.$GT)) {
	                throw Error("this / does not have a > follw!");
	            }
	        }
	        this.buildToken();
	    };
	    Tokenizer.prototype.buildATTRToken = function () {
	        if (chars.WhiteCharsAndGTAndSPLASH.indexOf(this.cursor.peek()) !== -1) {
	            return;
	        }
	        if (this.cursor.peek() === chars.$HASH) {
	            this.startToken(type$1.TokenType.TEMPLATE);
	        }
	        else {
	            this.startToken(type$1.TokenType.ATTR_NAME);
	        }
	        if (this.tryStopbyFilter([chars.$EQ], __spread([chars.$GT, chars.$SLASH, chars.$LT], chars.WhiteChars))) {
	            this.buildToken();
	        }
	        else {
	            this.buildToken();
	            return;
	        }
	        this.startToken(type$1.TokenType.ATTR_VALUE_START);
	        this.cursor.advance();
	        var _QtToken = 34 | 39;
	        if (this.tryStopbyFilter([chars.$DQ, chars.$SQ], [chars.$GT, chars.$SLASH, chars.$LT])) {
	            _QtToken = this.cursor.peek();
	            this.cursor.advance();
	            this.buildToken();
	        }
	        else {
	            this.buildToken();
	            return;
	        }
	        this.startToken(type$1.TokenType.ATTR_VALUE);
	        this.tryStopAt([_QtToken]);
	        this.buildToken();
	        this.startToken(type$1.TokenType.ATTR_VALE_END);
	        this.cursor.advance();
	        this.buildToken();
	    };
	    Tokenizer.prototype.buildElementEndToken = function () {
	        this.startToken(type$1.TokenType.TAG_END);
	        this.cursor.advance();
	        this.buildToken();
	    };
	    Tokenizer.prototype.buildComment = function () {
	        this._tokenInBuild = new Token(type$1.TokenType.COMMENT, this.cursor.offset - 3);
	        var _end = this.content.indexOf("-->", this.cursor.offset);
	        this.cursor = new Cursor(this.content, _end + 3, this.cursor.getEOF());
	        this.buildToken();
	    };
	    Tokenizer.prototype.buildDocumentTag = function () {
	        this._tokenInBuild = new Token(type$1.TokenType.DOCUMENT, this.cursor.offset - 2);
	        this.tryStopAt([chars.$GT]);
	        this.cursor.advance();
	        this.buildToken();
	    };
	    return Tokenizer;
	}());
	exports.Tokenizer = Tokenizer;
	var Cursor = /** @class */ (function () {
	    function Cursor(text, offset, EOF) {
	        if (offset === void 0) { offset = 0; }
	        if (EOF === void 0) { EOF = text.length; }
	        this.text = text;
	        this.offset = offset;
	        this.EOF = EOF;
	        this.peekvalue = -1;
	        this.peekvalue = text.charCodeAt(offset);
	    }
	    Cursor.prototype.getoffset = function () { return this.offset; };
	    Cursor.prototype.advance = function () {
	        var peek = this.peek();
	        if (peek === chars.$BACKSLASH) {
	            this.offset++;
	        }
	        this.offset++;
	        if (this.offset >= this.EOF) {
	            throw Error("Char At EOF At " + this.offset);
	        }
	        this.peekvalue = this.text.charCodeAt(this.offset);
	    };
	    Cursor.prototype.relocate = function (offset) {
	        this.offset = offset;
	        this.peekvalue = this.text.charCodeAt(offset);
	    };
	    Cursor.prototype.peek = function () {
	        this.peekvalue = this.text.charCodeAt(this.offset);
	        return this.text.charCodeAt(this.offset);
	    };
	    Cursor.prototype.createSpanRight = function (cursor) {
	        return new type.Span(this.offset, cursor.offset);
	    };
	    Cursor.prototype.copy = function () {
	        return new Cursor(this.text, this.offset, this.EOF);
	    };
	    Cursor.prototype.forceAdvance = function () {
	        this.offset++;
	    };
	    Cursor.prototype.getEOF = function () {
	        return this.EOF;
	    };
	    Cursor.prototype.getText = function () {
	        return this.text;
	    };
	    /**
	     * TODO:Try家族 将会被移动到指针类中
	     * 这样可以方便表达式与解析器复用，并且为react进行进一步的帮助
	     */
	    //注意这里有指针移动
	    Cursor.prototype.tryGet = function (char) {
	        if (this.peek() === char) {
	            this.advance();
	            return true;
	        }
	        return false;
	    };
	    Cursor.prototype.tryAdvanceThrogh = function (chars) {
	        while (chars.includes(this.peek())) {
	            this.advance();
	        }
	        return this.peekvalue;
	    };
	    Cursor.prototype.tryStopAt = function (chars) {
	        // if(this._tokenInBuild){
	        // 	if([TokenType.ATTR_NAME,TokenType.ATTR_VALUE])
	        // }
	        while (!chars.includes(this.peek())) {
	            this.advance();
	        }
	        return this.peekvalue;
	    };
	    //将返回一个数值，数值是被截断处的peekvalue
	    //如果是favor，将返回peekvalue，如果是disgust，将返回peekvalue*-1
	    Cursor.prototype.tryStopbyFilter = function (favor, disgust) {
	        while (!disgust.includes(this.peek()) && !favor.includes(this.peek())) {
	            this.advance();
	        }
	        //如果是被喜欢的字符截断
	        if (favor.includes(this.peek())) {
	            return this.peekvalue;
	        }
	        //如果是被不应该出现的字符截断
	        else if (disgust.includes(this.peek())) {
	            return this.peekvalue * -1;
	        }
	    };
	    //这个地方可能有点绕
	    //返回的是是否有截断代码，如果是0的话就是没有截断代码
	    //注意传入的点必须是left,否则会陷入死循环。
	    Cursor.prototype.tryStopByPairs = function (left, right, breakOperators) {
	        if (breakOperators === void 0) { breakOperators = []; }
	        var stackLength = 0;
	        while (!breakOperators.includes(this.peekvalue) || this.offset < this.EOF) {
	            if (this.peekvalue === left) {
	                stackLength++;
	            }
	            else if (this.peekvalue === right) {
	                stackLength--;
	            }
	            if (stackLength === 0) {
	                return 0;
	            }
	            this.advance();
	        }
	        return stackLength === 0 ? 0 : this.peekvalue;
	    };
	    Cursor.prototype.tryAdvanceThroughBrackets = function () {
	    };
	    /**
	     * 双指针协同
	     */
	    Cursor.prototype.getContentEndOf = function (endCursor) {
	        return this.text.substring(this.offset, endCursor.offset);
	    };
	    return Cursor;
	}());
	exports.Cursor = Cursor;
	});

	var LinkList = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;
	var HeadNode = /** @class */ (function () {
	    function HeadNode(headInfo) {
	        this.data = headInfo;
	    }
	    return HeadNode;
	}());
	exports.HeadNode = HeadNode;
	var LinkNode = /** @class */ (function () {
	    function LinkNode(element) {
	        this.data = element;
	    }
	    return LinkNode;
	}());
	exports.LinkNode = LinkNode;
	/**
	 * 这是一个带头结点的链表
	 */
	var LinkedList = /** @class */ (function () {
	    function LinkedList(headInfo) {
	        var _this = this;
	        this.toJSON = function () {
	            return { info: _this.headInfo, array: _this.toArray() };
	        };
	        this.head = new HeadNode(headInfo);
	        this.headInfo = this.head.data;
	        this.length = 0;
	    }
	    /**
	     * 请使用回调函数改变头节点内容。
	     * @param cb 回调函数
	     */
	    LinkedList.prototype.changeHeadValue = function (cb) {
	        cb.call(this.head);
	    };
	    LinkedList.prototype.getHeadData = function () {
	        return this.head.data;
	    };
	    LinkedList.prototype.getEnd = function () {
	        if (this.end) {
	            return this.end.data;
	        }
	        return;
	    };
	    LinkedList.prototype.insertNode = function (newElement, node) {
	        var _newnode = new LinkNode(newElement);
	        if (node) {
	            var p = node.next;
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
	    };
	    LinkedList.prototype.insetLinkList = function (list, node) {
	        if (!list.end) {
	            return;
	        }
	        if (this.end) {
	            if (node) {
	                var p = node.next;
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
	    };
	    LinkedList.prototype.getElement = function (cb, param) {
	        var _node = this.head.next;
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
	    };
	    //TODO: 完成function函数
	    LinkedList.prototype.filter = function (fun) {
	    };
	    LinkedList.prototype.get = function (param) {
	        var _node = this.head.next;
	        while (_node != null && param > 0) {
	            _node = _node.next;
	        }
	        if (_node === null) {
	            throw Error("IndecOutOfArrayException!!!!");
	        }
	        return _node;
	    };
	    LinkedList.prototype.toArray = function () {
	        var res = [];
	        var _node = this.head.next;
	        while (_node != null) {
	            res.push(_node.data);
	            _node = _node.next;
	        }
	        return res;
	    };
	    LinkedList.prototype.getEach = function (cb) {
	        if (!cb) {
	            return [];
	        }
	        var _result = [];
	        var _node = this.head.next;
	        while (_node) {
	            _result.push(cb(_node.data));
	            _node = _node.next;
	        }
	        return _result;
	    };
	    /**
	     * 整个链表都会遵从action进行改变，
	     * 注意这里面传的是对于节点中元素(element的操作)，
	     * 这个操作不会改变链表结构
	     * @param action
	     */
	    LinkedList.prototype.changeNodeWithAction = function (action, node) {
	        var _node = this.head.next;
	        if (node)
	            _node = node;
	        while (_node != null) {
	            action(_node.data);
	            _node = _node.next;
	        }
	    };
	    /**
	     * 从某一位开始 将此后的元素做一些操作后
	     * 插入到队首，之后返回操作是否有成功进行。
	     * 这是为了实现git式版本管理的delete类型操作。
	     * @param node 从这个节点开始。
	     * @param action 操作的回调函数
	     */
	    LinkedList.prototype.popAndShiftWithAction = function (node, action) {
	        var _node = node;
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
	        var p = this.head.next;
	        this.head.next = node;
	        _node.next = p;
	        p.pre = _node;
	        return true;
	    };
	    LinkedList.prototype.objectDeepEqual = function (obj1, obj2) {
	        if (obj1 && typeof obj1 === "object" && obj2 && typeof obj2 === 'object') {
	            if (Array.isArray(obj1) && !Array.isArray(obj2)) {
	                return false;
	            }
	            if (!Array.isArray(obj1) && Array.isArray(obj2)) {
	                return false;
	            }
	            for (var key in obj1) {
	                if (obj1.hasOwnProperty(key)) {
	                    if (!obj2.hasOwnProperty(key)) {
	                        return false;
	                    }
	                }
	            }
	            for (var key in obj2) {
	                if (obj2.hasOwnProperty(key)) {
	                    if (!obj1.hasOwnProperty(key)) {
	                        return false;
	                    }
	                }
	            }
	            for (var key in obj1) {
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
	    };
	    LinkedList.prototype.unshift = function () {
	        var _a;
	        if (this.length > 0) {
	            var _nodedata = (_a = this.head.next) === null || _a === void 0 ? void 0 : _a.data;
	            this.head.next = this.head.next.next;
	            if (this.head.next) {
	                this.head.next.pre = this.head;
	            }
	            this.length--;
	            return _nodedata;
	        }
	    };
	    return LinkedList;
	}());
	exports.LinkedList = LinkedList;
	});

	var ast = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-04-07 18:42:40
	 * @LastEditTime: 2020-06-08 14:57:29
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\parser\ast.ts
	 */





	exports.tagTokenTypesSet = new Set([
	    type$1.TokenType.ATTR_NAME,
	    type$1.TokenType.ATTR_VALE_END,
	    type$1.TokenType.ATTR_VALUE,
	    type$1.TokenType.ATTR_VALUE_START,
	    type$1.TokenType.DIRECTIVE,
	    type$1.TokenType.TEMPLATE,
	    type$1.TokenType.COMMENT,
	]);
	exports.attrTypesSet = new Set([
	    type$1.TokenType.ATTR_NAME,
	    type$1.TokenType.DIRECTIVE,
	    type$1.TokenType.TEMPLATE,
	]);
	var TreeBuilder = /** @class */ (function () {
	    // currentSpan: Span | undefined;
	    function TreeBuilder(tokens) {
	        this.tokens = tokens;
	        this.index = 0;
	        this.buildStack = [];
	        this.currentSpan = new type.Span(-1, -1);
	        this.currentToken = new lexer.Token(type$1.TokenType.DOCUMENT, -1);
	        this.roots = [];
	        this.errors = [];
	        this.root = new HTMLTagAST(new type.Span(0, 0), "$$ROOT$$");
	    }
	    TreeBuilder.prototype.build = function () {
	        if (this.tokens.length < 1) {
	            return { root: this.root, errors: [] };
	        }
	        this.init();
	        this.buildStack.push(this.root);
	        try {
	            while (this.currentToken.getType() !== type$1.TokenType.EOF) {
	                /* build element */
	                if (this.currentToken.getType() === type$1.TokenType.TAG_START) {
	                    this.buildNewTag();
	                }
	                else if (this.currentToken.getType() === type$1.TokenType.CLOSED_TAG) {
	                    this.closeTagContent();
	                }
	                else if (this.currentToken.getType() === type$1.TokenType.COMMENT) {
	                    this.buildComment();
	                }
	                else {
	                    this.advance();
	                }
	            }
	        }
	        catch (e) {
	            server$1.__moduleExports.logger.debug(e);
	        }
	        this.buildRoot();
	        return { root: this.root, errors: this.errors };
	    };
	    /**
	     * TAG相关
	     */
	    TreeBuilder.prototype.buildNewTag = function () {
	        if (this.tagInBuld) {
	            //TODO: 这里面要加上一个属性关闭的函数。
	            this.closeTagInBuild();
	            // this.tagInBuld.linkListPointer = this.getStackpeek().getTagLists()?.content.insertNode(this.tagInBuld);
	            // this.tagInBuld = undefined;
	        }
	        this.tagInBuld = new HTMLTagAST(this.currentSpan);
	        // this.tagInBuld.buildLinkedLists();
	        this.advance();
	        if (this.currentToken.getType() === type$1.TokenType.TAG_NAME) {
	            this.setNodeName(this.currentSpan, this.currentToken.value);
	            if (this.currentToken.value == "script" || this.currentToken.value == "style") {
	                this.buildStack.push(this.tagInBuld);
	                this.tagInBuld = undefined;
	                return;
	            }
	            this.advance();
	        }
	        while (exports.tagTokenTypesSet.has(this.currentToken.getType())) {
	            //build inner ATTR 
	            if (exports.attrTypesSet.has(this.currentToken.getType())) {
	                this.startNewATTR();
	            }
	            else {
	                if (this.attrInBuild) {
	                    if (this.currentToken.getType() === type$1.TokenType.ATTR_VALUE) {
	                        this.addValueNode();
	                    }
	                }
	                else {
	                    throw Error("we need to add something into attr ,but we cannot find at " + this.currentSpan.start);
	                }
	            }
	            this.advance();
	        }
	        if (this.currentToken.getType() === type$1.TokenType.TAG_END || this.currentToken.getType() === type$1.TokenType.TAG_SELF_END) {
	            this.closeTagInBuild(this.currentSpan.end);
	            this.advance();
	        }
	        else {
	            return;
	        }
	    };
	    TreeBuilder.prototype.closeTagContent = function () {
	        if (this.tagInBuld) {
	            this.closeTagInBuild();
	        }
	        var _contentEnd = this.currentSpan.start - 1;
	        this.advance();
	        if (this.currentToken.getType() !== type$1.TokenType.TAG_END_NAME) {
	            return;
	        }
	        var _closeTagName = this.currentToken.value;
	        if (!_closeTagName) {
	            this.errors.push(new type$1.TreeError(this.currentSpan, "this closed tag cannot find its content!!", this.getStackpeek(), type$1.ParseErrorLevel.ERROR));
	            return;
	        }
	        var _cursor = -1;
	        for (var i = this.buildStack.length - 1; i > 0; i--) {
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
	            this.errors.push(new type$1.TreeError(this.currentSpan, "this closed tag cannot find its Open tag!!", this.getStackpeek(), type$1.ParseErrorLevel.ERROR));
	        }
	        this.advance();
	    };
	    TreeBuilder.prototype.setNodeName = function (span, name) {
	        var _a;
	        name = name ? name : "";
	        (_a = this.tagInBuld) === null || _a === void 0 ? void 0 : _a.setName(name, span);
	        this.tagInBuld.getSpan().end = span.end;
	    };
	    /**
	     * 关闭标签 start content.
	     * @param end
	     */
	    TreeBuilder.prototype.closeTagInBuild = function (end) {
	        this.buildAttr();
	        if (!this.tagInBuld) {
	            throw Error("this tag does not have lists, please check parser!!!");
	        }
	        else {
	            this.tagInBuld.closeTag(end);
	            // this.tagInBuld!.parentPointer = this.getStackpeek();
	            this.addToList(this.getStackpeek().content, this.tagInBuld);
	            var _content = this.tagInBuld.content;
	            if (this.currentToken.getType() === type$1.TokenType.TAG_END) {
	                this.tagInBuld.domain.end = this.currentSpan.end;
	                _content.headInfo.span.start = this.currentSpan.end + 1;
	                this.buildStack.push(this.tagInBuld);
	            }
	            else {
	                _content.headInfo.span = new type.Span(-1, -1);
	            }
	            this.currentSpan.selfShift(this.tagInBuld.tagOffset, true);
	            this.tagInBuld = undefined;
	        }
	    };
	    /**
	     * 将tag正常关闭 之后插入栈中。
	     * @param end
	     */
	    TreeBuilder.prototype.buildTag = function (end) {
	    };
	    TreeBuilder.prototype.buildRoot = function () {
	        var _endOfTokens = this.currentSpan.end;
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
	    };
	    /**
	     * 注释
	     */
	    TreeBuilder.prototype.buildComment = function () {
	        var _commentAST = new HTMLAST(type$1.HTMLASTNodeType.COMMENT, this.currentSpan);
	        if (this.tagInBuld) {
	            this.addToList(this.tagInBuld.attrList.comment, _commentAST);
	        }
	        this.addToList(this.getStackpeek().content, _commentAST);
	        this.advance();
	    };
	    /**
	     * 属性相关
	     */
	    //开始的时候我们并没有把它插入到链表之中
	    TreeBuilder.prototype.startNewATTR = function () {
	        this.buildLastAttr();
	        if (this.currentToken.getType() === type$1.TokenType.TEMPLATE) {
	            this.attrInBuild = new HTMLATTRAST(type$1.HTMLASTNodeType.TEMPLATE, this.currentSpan, this.currentToken.value);
	        }
	        else {
	            this.attrInBuild = new HTMLATTRAST(type$1.HTMLASTNodeType.ATTR, this.currentSpan, this.currentToken.value);
	        }
	    };
	    TreeBuilder.prototype.addValueNode = function () {
	        var _a;
	        var _valueNode = new HTMLAST(type$1.HTMLASTNodeType.ATTR_VALUE, this.currentSpan, this.currentToken.value);
	        (_a = this.attrInBuild) === null || _a === void 0 ? void 0 : _a.addValueNode(_valueNode);
	    };
	    TreeBuilder.prototype.buildAttr = function () {
	        var _a, _b, _c, _d, _e;
	        if (!this.attrInBuild) {
	            return;
	        }
	        if (this.attrInBuild.getType() === type$1.HTMLASTNodeType.TEMPLATE) {
	            this.addToList(((_a = this.tagInBuld) === null || _a === void 0 ? void 0 : _a.getTagLists()).template, this.attrInBuild);
	        }
	        else if ((_b = this.attrInBuild) === null || _b === void 0 ? void 0 : _b.valueNode) {
	            this.addToList(((_c = this.tagInBuld) === null || _c === void 0 ? void 0 : _c.getTagLists()).attr, this.attrInBuild);
	        }
	        else {
	            (_d = this.attrInBuild) === null || _d === void 0 ? void 0 : _d.setType(type$1.HTMLASTNodeType.DIRECTIVE);
	            this.addToList(((_e = this.tagInBuld) === null || _e === void 0 ? void 0 : _e.getTagLists()).directive, this.attrInBuild);
	        }
	        this.attrInBuild = undefined;
	    };
	    /**
	     * 返回栈顶元素。
	     */
	    TreeBuilder.prototype.getStackpeek = function () {
	        return this.buildStack[this.buildStack.length - 1];
	    };
	    TreeBuilder.prototype.adjustSpan = function () {
	        var e_1, _a;
	        try {
	            for (var _b = __values(this.buildStack), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var ast = _c.value;
	                this.currentSpan.selfShift(ast.tagOffset, false);
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        if (this.tagInBuld) {
	            this.currentSpan.selfShift(this.tagInBuld.tagOffset, false);
	        }
	    };
	    /**
	     * 工具函数
	     */
	    TreeBuilder.prototype.addToList = function (list, node) {
	        if (!node) {
	            throw Error("the Node is undefined at list" + list.toString());
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
	    };
	    TreeBuilder.prototype.buildLastAttr = function () {
	        if (this.attrInBuild) {
	            this.buildAttr();
	            this.attrInBuild = undefined;
	        }
	    };
	    TreeBuilder.prototype.init = function () {
	        this.currentToken = this.tokens[0];
	        this.currentSpan = this.currentToken.getSpan();
	        var _tokentype = this.currentToken.getType();
	    };
	    TreeBuilder.prototype.advance = function () {
	        if (this.index < this.tokens.length)
	            this.currentToken = this.tokens[++this.index];
	        else {
	            throw Error("this is the last!!!");
	        }
	        this.currentSpan = this.currentToken.getSpan();
	        this.adjustSpan();
	        if (this.currentToken.getType() === type$1.TokenType.COMMENT) {
	            var _commentAst = new HTMLAST(type$1.HTMLASTNodeType.COMMENT, this.currentSpan);
	            this.getStackpeek().attrList.comment.insertNode(_commentAst);
	            this.advance();
	        }
	    };
	    return TreeBuilder;
	}());
	exports.TreeBuilder = TreeBuilder;
	var HTMLAST = /** @class */ (function () {
	    //2020/5/11 应该把tag和普通的HTMLAST区分开来
	    function HTMLAST(type$2, nodeSpan, name, parentPointer) {
	        var _this = this;
	        this.type = type$2;
	        this.nodeSpan = nodeSpan;
	        this.name = name;
	        this.parentPointer = parentPointer;
	        this.status = type$1.NodeStatus.DEFAULT;
	        // parentPointer:HTMLAST|undefined;
	        this.nameSpan = new type.Span(-1, -1);
	        this.toJSON = function () {
	            return {
	                nameSpan: "name:" + _this.name + " namespan:" + _this.nameSpan.toJSON()
	            };
	        };
	        this.parentPointer = parentPointer;
	    }
	    HTMLAST.prototype.getSpan = function () { return this.nodeSpan; };
	    HTMLAST.prototype.getName = function () {
	        return this.name;
	    };
	    HTMLAST.prototype.setName = function (name, nameSpan) {
	        this.name = name;
	        this.nameSpan = nameSpan;
	    };
	    HTMLAST.prototype.getType = function () {
	        return this.type;
	    };
	    HTMLAST.prototype.setType = function (type) {
	        this.type = type;
	    };
	    //普通的节点只需要检查span
	    HTMLAST.prototype.search = function (offset) {
	        return { ast: undefined, type: this.type === type$1.HTMLASTNodeType.COMMENT ? type$1.SearchResultType.Null : type$1.SearchResultType.Name };
	    };
	    HTMLAST.prototype.getSearchResultKind = function () {
	        // switch(this.type){
	        // 	case(HTMLASTNodeType.)
	        // }
	    };
	    return HTMLAST;
	}());
	exports.HTMLAST = HTMLAST;
	var HTMLTagAST = /** @class */ (function (_super) {
	    __extends(HTMLTagAST, _super);
	    // attrLists :LinkNode<HTMLAST>|undefined;
	    function HTMLTagAST(domain, name, parentPointer) {
	        var _this = _super.call(this, type$1.HTMLASTNodeType.TAG, domain, name, parentPointer) || this;
	        _this.toJSON = function () {
	            return {
	                nodeSpan: _this.nodeSpan,
	                domain: _this.domain,
	                nameSpan: "name:" + _this.name + " namespan:" + _this.nameSpan.toJSON(),
	                content: _this.content,
	                lists: _this.attrList,
	                tagOffset: _this.tagOffset
	            };
	        };
	        _this.content = new LinkList.LinkedList({ name: "content", span: new type.Span(-1, -1) });
	        _this.buildLinkedLists();
	        _this.tagOffset = domain.start;
	        _this.nodeSpan.selfShift(_this.tagOffset, false);
	        _this.domain = _this.nodeSpan.clone();
	        return _this;
	    }
	    HTMLTagAST.prototype.buildLinkedLists = function () {
	        var _directive = new LinkList.LinkedList({ name: "directive", span: new type.Span(-1, -1) });
	        var _template = new LinkList.LinkedList({ name: "template", span: new type.Span(-1, -1) });
	        var _attr = new LinkList.LinkedList({ name: "attribute", span: new type.Span(-1, -1) });
	        var _comment = new LinkList.LinkedList({ name: "comment", span: new type.Span(-1, -1) });
	        this.attrList = {
	            directive: _directive,
	            template: _template,
	            attr: _attr,
	            comment: _comment
	        };
	    };
	    HTMLTagAST.prototype.findATTREnd = function () {
	        if (this.type !== type$1.HTMLASTNodeType.TAG) {
	            return -1;
	        }
	        return Math.max(this.attrList.attr.headInfo.span.end, this.attrList.template.headInfo.span.end, this.attrList.directive.headInfo.span.end, this.content.headInfo.span.end, this.nameSpan.end);
	    };
	    HTMLTagAST.prototype.closeContent = function (contentEnd, end) {
	        this.content.headInfo.span.end = contentEnd;
	        this.domain.end = end;
	        return end + this.tagOffset;
	    };
	    HTMLTagAST.prototype.closeTag = function (end) {
	        var _end = this.findATTREnd();
	        this.nodeSpan.end = end ? end : _end;
	        this.domain.end = end ? end : _end;
	    };
	    HTMLTagAST.prototype.getTagLists = function () {
	        return this.attrList;
	    };
	    HTMLTagAST.prototype.getDomain = function () {
	        return this.domain;
	    };
	    HTMLTagAST.prototype.search = function (offset) {
	        // offset -= this.tagOffset;
	        // if(!this.domain.inSpan(offset)){
	        // 	return{ast:undefined,type:SearchResultType.Null};
	        // }
	        if (!this.name || this.nameSpan.inSpan(offset)) {
	            return { ast: undefined, type: type$1.SearchResultType.Name };
	        }
	        if (this.nodeSpan.inSpan(offset)) {
	            for (var listName in this.attrList) {
	                var _list = this.attrList[listName];
	                if (!_list.headInfo.span.inSpan(offset)) {
	                    continue;
	                }
	                else {
	                    var _result = _list.getElement(function (param) {
	                        return param.getSpan().inSpan(offset);
	                    });
	                    if (_result) {
	                        return { ast: _result, type: type$1.SearchResultType.Null };
	                    }
	                }
	            }
	            return { ast: undefined, type: type$1.SearchResultType.Value };
	        }
	        if (this.content.headInfo.span.inSpan(offset)) {
	            var _result = this.content.getElement(function (param) {
	                if (param instanceof HTMLTagAST) {
	                    return param.getDomain().inSpan(offset - param.tagOffset);
	                }
	            });
	            return _result ? { ast: _result, type: type$1.SearchResultType.Null } : { ast: undefined, type: type$1.SearchResultType.Content };
	        }
	        return { ast: undefined, type: type$1.SearchResultType.Null };
	    };
	    return HTMLTagAST;
	}(HTMLAST));
	exports.HTMLTagAST = HTMLTagAST;
	var HTMLATTRAST = /** @class */ (function (_super) {
	    __extends(HTMLATTRAST, _super);
	    function HTMLATTRAST(type$1, span, name, parentPointer) {
	        if (span === void 0) { span = new type.Span(-1, -1); }
	        var _this = _super.call(this, type$1, span, name, parentPointer) || this;
	        _this.toJSON = function () {
	            return {
	                nameSpan: "name:" + _this.name + " namespan:" + _this.nameSpan.toJSON(),
	                valueNode: _this.valueNode,
	                span: _this.nodeSpan
	            };
	        };
	        _this.nameSpan = span.clone();
	        return _this;
	    }
	    HTMLATTRAST.prototype.addValueNode = function (node) {
	        this.nodeSpan.end = node.getSpan().end;
	        this.valueNode = node;
	        node.parentPointer = this;
	        this.valueNode.nameSpan = this.valueNode.getSpan();
	    };
	    HTMLATTRAST.prototype.search = function (offset) {
	        var _a;
	        if (this.nameSpan.inSpan(offset)) {
	            return { ast: undefined, type: type$1.SearchResultType.Name };
	        }
	        if ((_a = this.valueNode) === null || _a === void 0 ? void 0 : _a.getSpan().inSpan(offset)) {
	            return { ast: this.valueNode, type: type$1.SearchResultType.Null };
	        }
	        return { ast: undefined, type: type$1.SearchResultType.Null };
	    };
	    return HTMLATTRAST;
	}(HTMLAST));
	exports.HTMLATTRAST = HTMLATTRAST;
	var HTMLCommentAST = /** @class */ (function (_super) {
	    __extends(HTMLCommentAST, _super);
	    function HTMLCommentAST(span) {
	        return _super.call(this, type$1.HTMLASTNodeType.COMMENT, span ? span : new type.Span(-1, -1)) || this;
	    }
	    return HTMLCommentAST;
	}(HTMLAST));
	exports.HTMLCommentAST = HTMLCommentAST;
	});

	var type$2 = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-04-15 14:26:49
	 * @LastEditTime: 2020-06-08 16:51:19
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
	})(CompletionRangeKind = exports.CompletionRangeKind || (exports.CompletionRangeKind = {}));
	var CompletionType;
	(function (CompletionType) {
	    CompletionType[CompletionType["Name"] = 0] = "Name";
	    CompletionType[CompletionType["FUll"] = 1] = "FUll";
	    CompletionType[CompletionType["NONE"] = 2] = "NONE";
	    CompletionType[CompletionType["Expression"] = 3] = "Expression";
	})(CompletionType = exports.CompletionType || (exports.CompletionType = {}));
	var FileType;
	(function (FileType) {
	    FileType[FileType["HTML"] = 0] = "HTML";
	    FileType[FileType["TypeScript"] = 1] = "TypeScript";
	})(FileType = exports.FileType || (exports.FileType = {}));
	// export const ATTRREGX = /^(?:\[\(([^\)]*)\)\]|\[([^\]]*)\]|\(([^\)]*)\))$/;
	// const INPUTREG = /\[([^\)]*)\]/
	// const OUTPUT =/\(([^\)]*)\)/
	// const INOUTPUTREG = /\[\(([^\)]*)\)\]/
	// const ADD = /\+[a-zA-z]/
	});

	var util = createCommonjsModule(function (module, exports) {
	var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spread = (commonjsGlobal && commonjsGlobal.__spread) || function () {
	    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	    return ar;
	};
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-03-29 11:52:31
	 * @LastEditTime: 2020-06-04 22:56:49
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper\src\util.ts
	 */




	function getName(text, componentRegex) {
	    text.match(componentRegex);
	    var n = RegExp.$1.substring(2);
	    // const nam = n.replace(n[0],n[0].toUpperCase());//匹配之后对字符串处理然后匹配导出的模块
	    var nam = n; //匹配之后对字符串处理然后匹配导出的模块
	    var name;
	    if (nam.indexOf("-") !== -1) {
	        name = capitalize(nam);
	    }
	    else {
	        name = nam;
	    }
	    // console.log("name: " + name);
	    return name;
	}
	exports.getName = getName;
	function word2Name(word) {
	    var n = word.substring(2);
	    var nam = n.replace(n[0], n[0].toUpperCase()); //匹配之后对字符串处理然后匹配导出的模块
	    var name;
	    if (nam.indexOf("-") !== -1) {
	        name = capitalize(nam);
	    }
	    else {
	        name = nam;
	    }
	    return name;
	}
	exports.word2Name = word2Name;
	function capitalize(string) {
	    // split() 方法用于把一个字符串分割成字符串数组。
	    var words = string.split("-");
	    for (var i = 0; i < words.length; i++) {
	        // charAt() 方法可返回指定位置的字符。
	        // slice() 方法可从已有的数组中返回选定的元素。
	        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
	        // 第一个单词的第一个字母转化为大写，然后再将该单词的后面字母使用slice()接上即可。
	    }
	    // join() 方法用于把数组中的所有元素放入一个字符串
	    return words.join("");
	}
	function autoIcon(type) {
	    switch (type) {
	        default:
	            return "$(array)";
	    }
	}
	exports.autoIcon = autoIcon;
	function convertStringToName(name) {
	    var e_1, _a;
	    var bananaset = ['[', ']', '(', ')'];
	    try {
	        for (var bananaset_1 = __values(bananaset), bananaset_1_1 = bananaset_1.next(); !bananaset_1_1.done; bananaset_1_1 = bananaset_1.next()) {
	            var banana = bananaset_1_1.value;
	            name = name.replace(banana, "");
	        }
	    }
	    catch (e_1_1) { e_1 = { error: e_1_1 }; }
	    finally {
	        try {
	            if (bananaset_1_1 && !bananaset_1_1.done && (_a = bananaset_1["return"])) _a.call(bananaset_1);
	        }
	        finally { if (e_1) throw e_1.error; }
	    }
	    return name;
	}
	exports.convertStringToName = convertStringToName;
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
	exports.copyCompletionItem = copyCompletionItem;
	function converValueSetToValueString(valueSet) {
	    var e_2, _a;
	    if (valueSet === [])
	        return "";
	    var res = "";
	    try {
	        for (var valueSet_1 = __values(valueSet), valueSet_1_1 = valueSet_1.next(); !valueSet_1_1.done; valueSet_1_1 = valueSet_1.next()) {
	            var value = valueSet_1_1.value;
	            var _value = value.replace(" ", "");
	            if (_value !== "")
	                res += "'" + _value + "',";
	        }
	    }
	    catch (e_2_1) { e_2 = { error: e_2_1 }; }
	    finally {
	        try {
	            if (valueSet_1_1 && !valueSet_1_1.done && (_a = valueSet_1["return"])) _a.call(valueSet_1);
	        }
	        finally { if (e_2) throw e_2.error; }
	    }
	    return res == "" ? "" : "|" + res.substring(0, res.length - 1) + "|";
	}
	exports.converValueSetToValueString = converValueSetToValueString;
	function getRangeFromDocument(terminalNode, textDocument) {
	    if (!terminalNode) {
	        return vscodeLanguageserver.Range.create(-1, -1, -1, -1);
	    }
	    var _range = terminalNode.getSpan();
	    var _start = textDocument.positionAt(_range.start);
	    var _end = textDocument.positionAt(_range.end);
	    _end.character++;
	    return vscodeLanguageserver.Range.create(_start, _end);
	}
	exports.getRangeFromDocument = getRangeFromDocument;
	function getRangefromSpan(span, textDocument) {
	    if (!span) {
	        return vscodeLanguageserver.Range.create(-1, -1, -1, -1);
	    }
	    var _start = textDocument.positionAt(span.start);
	    var _end = textDocument.positionAt(span.end);
	    _end.character++;
	    return vscodeLanguageserver.Range.create(_start, _end);
	}
	exports.getRangefromSpan = getRangefromSpan;
	function autoSelectCompletionRangeKind(word) {
	    server$1.__moduleExports.logger.debug("word:" + word);
	    var reg0 = /^\+.*$/; //匹配+...
	    var reg1 = /^\[.*$/; // 匹配[....]
	    var reg2 = /^\(.*$/; // 匹配(....)
	    var reg3 = /^\[\(.*$/; // 匹配[(.....)]
	    if (reg0.test(word)) {
	        return type$2.CompletionRangeKind.ADD;
	    }
	    else if (reg3.test(word)) {
	        return type$2.CompletionRangeKind.INOUTPUT;
	    }
	    else if (reg1.test(word)) {
	        return type$2.CompletionRangeKind.INPUT;
	    }
	    else if (reg2.test(word)) {
	        return type$2.CompletionRangeKind.OUTPUT;
	    }
	    else if (reg3.test(word)) {
	        return type$2.CompletionRangeKind.NONE;
	    }
	    else {
	        return type$2.CompletionRangeKind.TAG;
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
	exports.autoSelectCompletionRangeKind = autoSelectCompletionRangeKind;
	function changeDueToCompletionRangeKind(kind, label) {
	    switch (kind) {
	        case type$2.CompletionRangeKind.TAG:
	        case type$2.CompletionRangeKind.NONE:
	            return label;
	        case type$2.CompletionRangeKind.INOUTPUT:
	            return "[(" + label + ")]";
	        case type$2.CompletionRangeKind.INPUT:
	            return "[" + label + "]";
	        case type$2.CompletionRangeKind.OUTPUT:
	            return "(" + label + ")";
	        case type$2.CompletionRangeKind.ADD:
	            return "+" + label;
	    }
	}
	exports.changeDueToCompletionRangeKind = changeDueToCompletionRangeKind;
	function getsubstringForSpan(span, text) {
	    var start = span.start, end = span.end;
	    return text.substring(start, end + 1);
	}
	exports.getsubstringForSpan = getsubstringForSpan;
	function changeInsertDueToCompletionRangeKind(kind, text) {
	    if (kind === type$2.CompletionRangeKind.INOUTPUT) {
	        text = text.replace("[", "[(").replace("]", ")]");
	    }
	    return text;
	}
	exports.changeInsertDueToCompletionRangeKind = changeInsertDueToCompletionRangeKind;
	var MarkUpBuilder = /** @class */ (function () {
	    function MarkUpBuilder(content) {
	        this.markUpContent = { kind: vscodeLanguageserver.MarkupKind.Markdown, value: content ? content : "" };
	    }
	    MarkUpBuilder.prototype.getMarkUpContent = function () {
	        return this.markUpContent;
	    };
	    MarkUpBuilder.prototype.addContent = function (content) {
	        this.markUpContent.value += content;
	        return this;
	    };
	    MarkUpBuilder.prototype.addSpecialContent = function (type, content) {
	        this.markUpContent.value +=
	            __spread([
	                '```' + type
	            ], content, [
	                '```'
	            ]).join('\n');
	        return this;
	    };
	    MarkUpBuilder.prototype.setSpecialContent = function (type, content) {
	        this.markUpContent.value = '```' + type + '\n' + content + '\n```';
	        return this;
	    };
	    return MarkUpBuilder;
	}());
	exports.MarkUpBuilder = MarkUpBuilder;
	function convertSpanToRange(textDocument, span) {
	    if (!span) {
	        return;
	    }
	    var _start = textDocument.positionAt(span.start);
	    var _end = textDocument.positionAt(span.end);
	    return { start: _start, end: _end };
	}
	exports.convertSpanToRange = convertSpanToRange;
	function adjustSpanToAbosulutOffset(node, span) {
	    _adjustSpanToAbosultOffset(node, span);
	    span.end++;
	}
	exports.adjustSpanToAbosulutOffset = adjustSpanToAbosulutOffset;
	function getSpanOfAbusoluteOffset(node, span) {
	    var _span = span.clone();
	    _adjustSpanToAbosultOffset(node, _span);
	    span.end++;
	    return _span;
	}
	exports.getSpanOfAbusoluteOffset = getSpanOfAbusoluteOffset;
	function _adjustSpanToAbosultOffset(node, span) {
	    if (node.getName() != "$$ROOT$$") {
	        if (node instanceof ast.HTMLTagAST) {
	            span.selfShift(node.tagOffset, true);
	        }
	        _adjustSpanToAbosultOffset(node.parentPointer, span);
	    }
	}
	exports._adjustSpanToAbosultOffset = _adjustSpanToAbosultOffset;
	});

	var Storage = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spread = (commonjsGlobal && commonjsGlobal.__spread) || function () {
	    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	    return ar;
	};
	var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	exports.__esModule = true;
	var BOOLEAN = "boolean";
	var STRING = "string";
	var RootNode = /** @class */ (function () {
	    function RootNode() {
	        this.schema = {};
	        this.prefixSchema = {};
	        this.completionItems = [];
	        this.nameCompletionItems = [];
	        this.directWithNameSet = {};
	        this.prefixCut = {};
	        this.directivePrefixCut = {};
	    }
	    RootNode.prototype.getSchema = function () {
	        return this.schema;
	    };
	    RootNode.prototype.buildFullCompletionItem = function () { };
	    RootNode.prototype.buildNameCompletionItem = function () { };
	    RootNode.prototype.buildCompletionItems = function () {
	        this.completionItems = Object.values(this.schema).map(function (element) {
	            return element.buildFullCompletionItem();
	        });
	        this.nameCompletionItems = Object.values(this.schema).map(function (element) {
	            return element.buildNameCompletionItem();
	        });
	    };
	    RootNode.prototype.addComponentOrDirectives = function (node, prefix, comName) {
	        //schema
	        this.schema[node.getName()] = node;
	        //prefixSchema
	        var nodes = this.prefixSchema[comName];
	        if (!nodes) {
	            this.prefixSchema[comName] = [];
	            nodes = this.prefixSchema[comName];
	        }
	        nodes.push(node);
	        //prefixCut
	        if (node instanceof TagComponent) {
	            this.prefixCut[comName] = this.prefixCut[comName] ? this.prefixCut[comName] : {};
	            this.prefixCut[comName][prefix] = node;
	        }
	        if (node instanceof Directive) {
	            this.directivePrefixCut[prefix] = node;
	        }
	    };
	    RootNode.prototype.getNameCompltionItems = function () {
	        return this.nameCompletionItems;
	    };
	    RootNode.prototype.getFullCompltionItems = function (range, kind) {
	        // if (kind) {
	        //     this.completionItems.forEach(e => e.insertText);
	        // }
	        if (range) {
	            return this.completionItems.map(function (_completionItem) {
	                _completionItem.textEdit = {
	                    range: range,
	                    newText: kind ? _completionItem.insertText.substring(0, _completionItem.insertText.length) : _completionItem.insertText
	                };
	                return _completionItem;
	            });
	        }
	        return this.completionItems;
	    };
	    RootNode.prototype.getSubNode = function (name) {
	        return this.schema[name];
	    };
	    RootNode.prototype.getSubNodes = function () {
	        return Object.values(this.schema);
	    };
	    RootNode.prototype.getParent = function () {
	        return;
	    };
	    RootNode.prototype.getHoverInfo = function () { return undefined; };
	    RootNode.prototype.insertDirectiveWithArray = function (directive) {
	        this.directWithNameSet[directive.getName()] = directive;
	    };
	    RootNode.prototype.getDirectiveWithNameSet = function () {
	        return this.directWithNameSet;
	    };
	    RootNode.prototype.getName = function () {
	        return "$$INFOROOT$$";
	    };
	    RootNode.prototype.getCompletionItem = function () {
	        return undefined;
	    };
	    return RootNode;
	}());
	exports.RootNode = RootNode;
	var Component = /** @class */ (function () {
	    function Component(name, comName, description, tmw, cnName, prefixName) {
	        if (description === void 0) { description = ""; }
	        if (prefixName === void 0) { prefixName = ""; }
	        this.name = name;
	        this.comName = comName;
	        this.description = description;
	        this.tmw = tmw;
	        this.cnName = cnName;
	        this.prefixName = prefixName;
	        this.attributeMap = {};
	        this.attritubes = [];
	        this.nameCompletionItems = [];
	        this.completionItems = [];
	        this.completionItemKind = vscodeLanguageserver.CompletionItemKind.Class;
	        this.prefixToValue = {};
	        this.tmwString = this.tmw ? new util.MarkUpBuilder().addSpecialContent('typescript', [
	            "\u4F55\u65F6\u4F7F\u7528\uFF1A" + this.tmw,
	        ]).getMarkUpContent() : "";
	        this.completionItemKind = vscodeLanguageserver.CompletionItemKind.Class;
	    }
	    Component.prototype.addAttritube = function (attribute) {
	        var _this = this;
	        this.attritubes.push(attribute);
	        this.attributeMap[attribute.getName()] = attribute;
	        if (attribute.getValueSet() !== []) {
	            attribute.getValueSet().forEach(function (element) {
	                _this.prefixToValue[element] = attribute;
	            });
	        }
	    };
	    Component.prototype.getPrefixToValue = function () {
	        return this.prefixToValue;
	    };
	    Component.prototype.getName = function () { return this.name; };
	    Component.prototype.getDescription = function () { return this.description; };
	    Component.prototype.getcompletionKind = function () { return this.completionItemKind; };
	    Component.prototype.buildCompletionItems = function () {
	        var _this = this;
	        this.attritubes.forEach(function (attr) {
	            var _a;
	            var temp = attr.buildFullCompletionItem();
	            (_a = _this.completionItems).push.apply(_a, __spread(attr.buildFullCompletionItem()));
	        });
	        this.nameCompletionItems = this.attritubes.map(function (attr) {
	            return attr.buildNameCompletionItem();
	        });
	    };
	    Component.prototype.buildFullCompletionItem = function () {
	        var e_1, _a;
	        var _b;
	        this.buildCompletionItems();
	        var _completionItem = vscodeLanguageserver.CompletionItem.create(this.name);
	        _completionItem.kind = this.completionItemKind;
	        var _insertText = this.name;
	        var _snippetNum = 1;
	        try {
	            for (var _c = __values(Object.values(this.attributeMap)), _d = _c.next(); !_d.done; _d = _c.next()) {
	                var attr = _d.value;
	                if (attr.isNecessary || attr.getName() === this.name) {
	                    if (attr.getName() === this.name) {
	                        _insertText.replace(this.name, "");
	                    }
	                    _insertText += ("\n\t" + ((_b = attr.getCompletionItem()) === null || _b === void 0 ? void 0 : _b.insertText)).replace("$1", "$" + _snippetNum + "");
	                    _snippetNum++;
	                }
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        _completionItem.insertText = _insertText;
	        _completionItem.documentation = this.tmwString,
	            _completionItem.detail = this.description;
	        _completionItem.insertTextFormat = vscodeLanguageserver.InsertTextFormat.Snippet;
	        _completionItem.preselect = false;
	        this.completionItem = _completionItem;
	        return _completionItem;
	    };
	    Component.prototype.buildNameCompletionItem = function () {
	        var _completionItem = vscodeLanguageserver.CompletionItem.create(this.name);
	        _completionItem.detail = this.description;
	        _completionItem.documentation = this.tmwString;
	        _completionItem.kind = this.completionItemKind;
	        _completionItem.preselect = false;
	        return _completionItem;
	    };
	    Component.prototype.getNameCompltionItems = function () {
	        return this.nameCompletionItems;
	    };
	    Component.prototype.getFullCompltionItems = function (currentRange) {
	        if (!currentRange) {
	            return this.completionItems;
	        }
	        return this.completionItems.map(function (_completionItem) {
	            _completionItem.textEdit = {
	                range: currentRange,
	                newText: _completionItem.insertText ? _completionItem.insertText : ""
	            };
	            return _completionItem;
	        });
	    };
	    Component.prototype.getSubNode = function (attrname) {
	        return this.attributeMap[attrname];
	    };
	    Component.prototype.getSubNodes = function () {
	        return Object.values(this.attributeMap);
	    };
	    Component.prototype.getParent = function () {
	        return new RootNode();
	    };
	    Component.prototype.getHoverInfo = function () {
	        var _markUpBuilder = new util.MarkUpBuilder(this.description + "\n");
	        var properties = this.attritubes;
	        _markUpBuilder.addSpecialContent('typescript', __spread([
	            this.tmw ? "\u4F55\u65F6\u4F7F\u7528\uFF1A" + this.tmw : ""
	        ], this.attritubes.map(function (attr) {
	            return attr.getName() + ' :' + attr.getSortDescription();
	        })));
	        return { contents: _markUpBuilder.getMarkUpContent() };
	    };
	    Component.prototype.getCompletionItem = function () {
	        return this.completionItem;
	    };
	    return Component;
	}());
	exports.Component = Component;
	var TagComponent = /** @class */ (function (_super) {
	    __extends(TagComponent, _super);
	    function TagComponent(name, comName, description, tmw, cnName, prefixName) {
	        if (description === void 0) { description = ""; }
	        if (prefixName === void 0) { prefixName = ""; }
	        var _this = _super.call(this, name, comName, description, tmw, cnName, prefixName) || this;
	        _this.completionItemKind = vscodeLanguageserver.CompletionItemKind.Class;
	        _this.attritubes = [];
	        var temp = vscodeLanguageserver.CompletionItem.create(_this.name);
	        temp.insertText = name + ">$0</" + name + ">";
	        _this.completionItem = temp;
	        return _this;
	    }
	    TagComponent.prototype.buildFullCompletionItem = function () {
	        var _completionItem = _super.prototype.buildFullCompletionItem.call(this);
	        if (_completionItem.insertText.indexOf('${1') === -1) {
	            _completionItem.insertText += ">$0" + ("</" + this.name + ">");
	        }
	        else {
	            _completionItem.insertText += "\n>$0</" + this.name + ">";
	        }
	        this.completionItem = _completionItem;
	        return _completionItem;
	    };
	    return TagComponent;
	}(Component));
	exports.TagComponent = TagComponent;
	var Directive = /** @class */ (function (_super) {
	    __extends(Directive, _super);
	    function Directive(name, comName, description, tmw, cnName, prefixName) {
	        if (description === void 0) { description = ""; }
	        if (prefixName === void 0) { prefixName = ""; }
	        var _this = _super.call(this, name, comName, description, tmw, cnName, prefixName) || this;
	        _this.hasValueFlag = false;
	        _this.completionItemKind = vscodeLanguageserver.CompletionItemKind.Unit;
	        return _this;
	    }
	    //Question:为什么返回值不同会报错
	    Directive.prototype.getcompletionKind = function () { return this.completionItemKind; };
	    Directive.prototype.buildNameCompletionItem = function () {
	        var _completionItem = vscodeLanguageserver.CompletionItem.create(this.name);
	        _completionItem.kind = this.completionItemKind;
	        _completionItem.detail = this.description;
	        _completionItem.documentation = this.tmwString;
	        _completionItem.preselect = false;
	        if (this.hasValueFlag) {
	            _completionItem.insertText = "[" + this.name + "]=\"$1\"";
	            _completionItem.insertTextFormat = vscodeLanguageserver.InsertTextFormat.Snippet;
	            server$1.__moduleExports.host.HTMLDirectiveSource.insertDirectiveWithArray(this);
	        }
	        return _completionItem;
	    };
	    Directive.prototype.buildFullCompletionItem = function () {
	        // this.buildCompletionItems();
	        var _completionItem = _super.prototype.buildFullCompletionItem.call(this);
	        this.completionItem = _completionItem;
	        return _completionItem;
	    };
	    Directive.prototype.setHasValueFlag = function () {
	        this.hasValueFlag = true;
	    };
	    return Directive;
	}(Component));
	exports.Directive = Directive;
	var Attribute = /** @class */ (function () {
	    function Attribute(name, type, defaultValue, description, isNecessary, isEvent, valueSet, sortDescription) {
	        if (type === void 0) { type = 'string'; }
	        if (defaultValue === void 0) { defaultValue = 'null'; }
	        if (description === void 0) { description = ''; }
	        if (isNecessary === void 0) { isNecessary = false; }
	        if (isEvent === void 0) { isEvent = false; }
	        if (valueSet === void 0) { valueSet = []; }
	        this.name = name;
	        this.type = type;
	        this.defaultValue = defaultValue;
	        this.description = description;
	        this.isNecessary = isNecessary;
	        this.isEvent = isEvent;
	        this.valueSet = valueSet;
	        this.sortDescription = sortDescription;
	        this.nameCompletionItems = [];
	        this.completionItems = [];
	        this.completionKind = isEvent ? vscodeLanguageserver.CompletionItemKind.Event : vscodeLanguageserver.CompletionItemKind.Variable;
	    }
	    Attribute.prototype.buildCompletionItems = function () {
	        this.completionItems = this.valueSet.map(function (value) {
	            var _completionItem = vscodeLanguageserver.CompletionItem.create(value);
	            _completionItem.kind = vscodeLanguageserver.CompletionItemKind.EnumMember;
	            _completionItem.insertText = value;
	            _completionItem.detail = "\u8FD9\u662F" + value + "\u7C7B\u578B";
	            _completionItem.documentation = new util.MarkUpBuilder().addContent("![demo](https://s2.ax1x.com/2020/03/08/3z184H.gif)").getMarkUpContent();
	            _completionItem.preselect = false;
	            return _completionItem;
	        });
	        this.nameCompletionItems = this.completionItems;
	    };
	    Attribute.prototype.buildFullCompletionItem = function () {
	        var _this = this;
	        this.buildCompletionItems();
	        var _result = [];
	        // let _completionItem:CompletionItem; 
	        if (this.isEvent) {
	            _result.push(vscodeLanguageserver.CompletionItem.create("(" + this.name + ")"));
	        }
	        else if (this.type == STRING) {
	            _result.push(vscodeLanguageserver.CompletionItem.create("" + this.name), vscodeLanguageserver.CompletionItem.create("[" + this.name + "]"));
	        }
	        else {
	            _result.push(vscodeLanguageserver.CompletionItem.create("[" + this.name + "]"));
	        }
	        _result.forEach(function (_completionItem) {
	            _completionItem.detail = _this.sortDescription;
	            _completionItem.documentation = new util.MarkUpBuilder().addSpecialContent('typescript', [
	                "type:" + _this.type,
	                "DefaultValue:" + _this.getDefaultValue(),
	                "Description:" + _this.getDescription()
	            ]).getMarkUpContent();
	            //Question: 是否要统一样式?
	            // _completionItem.kind = this.getcompletionKind();
	            _completionItem.kind = _this.completionKind;
	            var _valueString = util.converValueSetToValueString(_this.valueSet);
	            if (_result.length === 1) {
	                if (_this.getcompletionKind() === vscodeLanguageserver.CompletionItemKind.Event) {
	                    _completionItem.insertText = "(" + _this.name + ")=\"$1\"";
	                }
	                else if (_this.type === BOOLEAN) {
	                    _completionItem.insertText = "[" + _this.name + "]=\"${1|true,false|}\"";
	                }
	                else {
	                    _completionItem.insertText = "[" + _this.name + "]=\"${1" + _valueString + "}\"";
	                }
	            }
	            else {
	                if (_completionItem.label.charCodeAt(0) === 91)
	                    _completionItem.insertText = "[" + _this.name + "]=\"${1" + _valueString + "}\"";
	                else
	                    _completionItem.insertText = _valueString == "" ? _this.name + "=\"$1\"" : _this.name + "=${1" + _valueString + "}";
	            }
	            _completionItem.insertTextFormat = vscodeLanguageserver.InsertTextFormat.Snippet;
	            _completionItem.preselect = true;
	        });
	        this.completionItem = _result[0];
	        // logger.debug(_result[0]);
	        return _result;
	    };
	    Attribute.prototype.buildNameCompletionItem = function () {
	        var _completionItem = vscodeLanguageserver.CompletionItem.create(this.name);
	        _completionItem.detail = this.sortDescription;
	        _completionItem.kind = this.completionKind;
	        _completionItem.documentation = new util.MarkUpBuilder().addSpecialContent('typescript', [
	            "type:" + this.type,
	            "DefaultValue:" + this.getDefaultValue(),
	            "Description:" + this.getDescription()
	        ]).getMarkUpContent();
	        return _completionItem;
	    };
	    Attribute.prototype.getNameCompltionItems = function () {
	        return this.completionItems;
	    };
	    Attribute.prototype.getFullCompltionItems = function (range) {
	        if (!range) {
	            return this.completionItems;
	        }
	        return this.completionItems.map(function (_completionItem) {
	            var _completionAddItem = _completionItem;
	            util.copyCompletionItem(_completionItem, _completionAddItem);
	            if (range) {
	                _completionAddItem.textEdit = {
	                    range: range,
	                    newText: _completionItem.insertText ? _completionItem.insertText : ""
	                };
	            }
	            return _completionAddItem;
	        });
	    };
	    Attribute.prototype.getHoverInfo = function () {
	        var _markUpBuilder = new util.MarkUpBuilder(this.getName() + "\n");
	        _markUpBuilder.addSpecialContent('typescript', ["Description:" + this.description,
	            "Type:" + this.getValueType(),
	            "DefaultValue:" + this.getDefaultValue(),
	            "ValueSet:" + this.valueSet]);
	        return { contents: _markUpBuilder.getMarkUpContent() };
	    };
	    Attribute.prototype.getName = function () { return this.name; };
	    Attribute.prototype.getSortDescription = function () { return this.description; };
	    Attribute.prototype.getDescription = function () { return this.description; };
	    Attribute.prototype.getcompletionKind = function () { return this.completionKind; };
	    Attribute.prototype.getValueType = function () { return this.type; };
	    Attribute.prototype.getDefaultValue = function () { return this.defaultValue; };
	    Attribute.prototype.getValueSet = function () { return this.valueSet; };
	    Attribute.prototype.getSubNode = function (name) { return; };
	    Attribute.prototype.getSubNodes = function () { return; };
	    // getParent():HTMLInfoNode{return this.parent;}
	    Attribute.prototype.getCompletionItem = function () { return this.completionItem; };
	    return Attribute;
	}());
	exports.Attribute = Attribute;
	});

	var parser = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-04-09 18:58:10
	 * @LastEditTime: 2020-05-16 17:50:25
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\parser\parser.ts
	 */



	var ast_2 = ast;
	var YQ_Parser = /** @class */ (function () {
	    function YQ_Parser() {
	    }
	    YQ_Parser.prototype.parseTextDocument = function (textDocument, parseOption) {
	        var uri = textDocument.uri;
	        var tokenizer = new lexer.Tokenizer(textDocument);
	        var tokens = tokenizer.Tokenize();
	        var treebuilder = new ast_2.TreeBuilder(tokens);
	        return treebuilder.build();
	    };
	    return YQ_Parser;
	}());
	exports.YQ_Parser = YQ_Parser;
	var TextParser = /** @class */ (function () {
	    function TextParser() {
	    }
	    return TextParser;
	}());
	exports.TextParser = TextParser;
	var SearchParser = /** @class */ (function () {
	    function SearchParser() {
	    }
	    SearchParser.prototype.DFS = function (offset, root) {
	        if (root instanceof ast.HTMLTagAST) {
	            offset -= root.tagOffset;
	        }
	        var _searchresult = root.search(offset);
	        var ast$1 = _searchresult.ast, type = _searchresult.type;
	        if (!_searchresult || (!ast$1 && type === type$1.SearchResultType.Null)) {
	            return;
	        }
	        else if (!ast$1 && type !== type$1.SearchResultType.Null) {
	            return { ast: root, type: type };
	        }
	        else if (ast$1) {
	            var _result = this.DFS(offset, ast$1);
	            return _result;
	        }
	    };
	    return SearchParser;
	}());
	exports.SearchParser = SearchParser;
	});

	var HoverProvider_1 = createCommonjsModule(function (module, exports) {
	/*
	 * @Author: your name
	 * @Date: 2020-05-03 09:30:22
	 * @LastEditTime: 2020-06-05 14:59:47
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \UI_Components_Helper\server\src\HoverProvider.ts
	 */
	exports.__esModule = true;



	var HoverProvider = /** @class */ (function () {
	    function HoverProvider() {
	    }
	    HoverProvider.prototype.provideHoverInfoForHTML = function (params) {
	        var _document = server$1.__moduleExports.host.documents.get(params.textDocument.uri);
	        if (!_document) {
	            return { contents: "Error!!!" };
	        }
	        var _offset = _document.offsetAt(params.position);
	        // host.igniter.parseTextDocument(_document,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]});
	        var _result = this.searchTerminalASTForHover(_offset, params.textDocument.uri);
	        var node = _result.node, span = _result.span;
	        if (!span) {
	            return;
	        }
	        else if (!node || !(node.getHoverInfo())) {
	            return;
	        }
	        return { contents: node.getHoverInfo().contents, range: util.convertSpanToRange(_document, span) };
	    };
	    HoverProvider.prototype.searchTerminalASTForHover = function (offset, uri) {
	        var _a = server$1.__moduleExports.host.hunter.searchTerminalAST(offset, uri), ast = _a.ast, type = _a.type;
	        if (!ast) {
	            throw Error("this offset does not in any Node :" + offset);
	        }
	        var _span = ast.nameSpan.clone();
	        util.adjustSpanToAbosulutOffset(ast, _span);
	        if (!_span) {
	            return { node: undefined, span: undefined };
	        }
	        if (type === type$1.SearchResultType.Null || !ast) {
	            return { node: undefined, span: _span };
	        }
	        else {
	            var _htmlInfoNode = server$1.__moduleExports.host.hunter.findHTMLInfoNode(ast, uri);
	            return { node: _htmlInfoNode, span: _span };
	        }
	    };
	    return HoverProvider;
	}());
	exports.HoverProvider = HoverProvider;
	});

	var CompletionProvider_1 = createCommonjsModule(function (module, exports) {
	var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spread = (commonjsGlobal && commonjsGlobal.__spread) || function () {
	    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	    return ar;
	};
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-04-08 20:38:08
	 * @LastEditTime: 2020-06-08 16:51:27
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\completion.ts
	 */







	var CompletionProvider = /** @class */ (function () {
	    function CompletionProvider() {
	        this.tabCompletionFlag = true;
	    }
	    CompletionProvider.prototype.provideCompletionItes = function (_params, type) {
	        //Alert:测试用
	        var temp = server$1.__moduleExports.host;
	        // host.architect.buildCompletionItems();
	        // host.igniter.loadSourceTree();
	        // host.igniter.loadSourceTree();
	        // logger.debug(`completionWorks!`);
	        var textDocument = _params.textDocument, position = _params.position;
	        var _textDocument = server$1.__moduleExports.host.getDocumentFromURI(textDocument.uri);
	        var _offset = _textDocument.offsetAt(position);
	        // host.igniter.parseTextDocument(_textDocument,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]})
	        if (type === type$2.FileType.HTML) {
	            return this.provideCompletionItemsForHTML(_offset, _textDocument);
	        }
	        else {
	            return [];
	        }
	    };
	    CompletionProvider.prototype.provideCompletionItemsForHTML = function (_offset, _textDocument) {
	        var _a = this.searchTerminalASTForCompletion(_offset, _textDocument), node = _a.node, span = _a.span, ast$1 = _a.ast, type = _a.type, expressionParams = _a.expressionParams;
	        if (!node || type === type$2.CompletionType.NONE) {
	            return [];
	        }
	        if (type === type$2.CompletionType.Expression) {
	            return server$1.__moduleExports.host.expressionAdm.createCompletion(expressionParams);
	            // return [];
	        }
	        var _range = util.convertSpanToRange(_textDocument, span);
	        if (node instanceof Storage.Component && ast$1 instanceof ast.HTMLTagAST) {
	            return this.CompletionItemsFactory(node, ast$1, type, _range);
	        }
	        if (!_range) {
	            return node.getFullCompltionItems();
	        }
	        //TODO : 会不会出现没有name的情况呢？
	        if (type === type$2.CompletionType.FUll) {
	            if (node === server$1.__moduleExports.host.HTMLComoponentSource) {
	                return node.getFullCompltionItems(_range);
	            }
	            return node.getFullCompltionItems(_range);
	        }
	        else {
	            return node.getNameCompltionItems(_range);
	        }
	    };
	    CompletionProvider.prototype.searchTerminalASTForCompletion = function (offset, textDocument) {
	        var _a = server$1.__moduleExports.host.hunter.searchTerminalAST(offset - 1, textDocument.uri), ast$1 = _a.ast, type = _a.type;
	        if (!ast$1) {
	            throw Error("this offset does not in any Node :" + offset);
	        }
	        switch (type) {
	            case (type$1.SearchResultType.Content):
	                if (ast$1 instanceof ast.HTMLTagAST) {
	                    var result = server$1.__moduleExports.host.expressionAdm.getExpression(offset - 1, textDocument.getText());
	                    return ({ node: server$1.__moduleExports.host.HTMLComoponentSource,
	                        span: undefined, ast: ast$1, type: type$2.CompletionType.Expression,
	                        expressionParams: { expression: result.res, span: result.span, textDocument: textDocument } });
	                }
	            case (type$1.SearchResultType.Name): {
	                this.tabCompletionFlag = true;
	                var _fullCompletionFlag = (ast$1.getSpan().end - ast$1.nameSpan.end) < 10;
	                var _span = _fullCompletionFlag ? ast$1.getSpan() : ast$1.nameSpan;
	                if (ast$1 instanceof ast.HTMLTagAST && _fullCompletionFlag) {
	                    _span.start++;
	                }
	                var _type = _fullCompletionFlag ? type$2.CompletionType.FUll : type$2.CompletionType.Name;
	                util.adjustSpanToAbosulutOffset(ast$1, _span);
	                if (ast$1 instanceof ast.HTMLTagAST) {
	                    return ({ node: server$1.__moduleExports.host.HTMLComoponentSource, span: _span, ast: ast$1, type: _type });
	                }
	                var _parentNode = ast$1.parentPointer;
	                var _infonode = server$1.__moduleExports.host.hunter.findHTMLInfoNode(ast$1.parentPointer, textDocument.uri);
	                if (_parentNode instanceof ast.HTMLTagAST && !_infonode) {
	                    _infonode = new Storage.TagComponent(_parentNode.getName());
	                }
	                return { node: _infonode, span: _span, ast: ast$1.parentPointer, type: _type };
	            }
	            case (type$1.SearchResultType.Value): {
	                if (this.getCompletionFlag(textDocument.getText(), offset)) {
	                    return { node: server$1.__moduleExports.host.hunter.findHTMLInfoNode(ast$1, textDocument.uri), span: undefined, ast: ast$1, type: type$2.CompletionType.FUll };
	                }
	            }
	            case (type$1.SearchResultType.Null): return { node: undefined, span: undefined, ast: new ast.HTMLCommentAST(), type: type$2.CompletionType.FUll };
	        }
	    };
	    CompletionProvider.prototype.getCompletionFlag = function (text, offset) {
	        if (offset <= 2) {
	            return true;
	        }
	        if (chars.WhiteChars.indexOf(text.charCodeAt(offset - 1)) !== -1) {
	            var _number = text.charCodeAt(offset - 2);
	            if (chars.Space.indexOf(text.charCodeAt(offset - 2)) !== -1) {
	                var _offset = offset - 2;
	                while (chars.Space.indexOf(text.charCodeAt(_offset)) !== -1) {
	                    _offset--;
	                }
	                if (chars.newLine.indexOf(text.charCodeAt(_offset)) !== -1) {
	                    if (this.tabCompletionFlag) {
	                        this.tabCompletionFlag = false;
	                        return true;
	                    }
	                }
	                return false;
	            }
	            else if (offset === text.length || chars.WhiteCharsAndLTAndGTANDSPLASH.indexOf(text.charCodeAt(offset + 1)) !== -1) {
	                return true;
	            }
	        }
	        return false;
	    };
	    CompletionProvider.prototype.CompletionItemsFactory = function (node, ast, type, range) {
	        var _attrsCompletion = [];
	        var _directiveCompletion = [];
	        // let _comAttrs:CompletionItem[]=[];
	        var _directives = ast.attrList.directive.getEach(function (e) { return e.getName(); });
	        var _attrs = ast.attrList.attr.getEach(function (e) { return e.getName(); });
	        //_attrs清洗
	        _attrs = _attrs.map(function (e) { return (e.replace(/\[|\(|\)|\]/g, "")); });
	        //找到指令节点
	        var _directiveNodes = [];
	        _directives === null || _directives === void 0 ? void 0 : _directives.forEach(function (name) {
	            var tempNode = server$1.__moduleExports.host.HTMLDirectiveSource.getSubNode(name);
	            if (tempNode) {
	                _directiveNodes.push(tempNode);
	            }
	        });
	        //加载伪装成attr的directive
	        _attrs === null || _attrs === void 0 ? void 0 : _attrs.forEach(function (attrName) {
	            var _tempdirective = server$1.__moduleExports.host.HTMLDirectiveSource.getDirectiveWithNameSet()[attrName];
	            if (_tempdirective) {
	                _directiveNodes.push(_tempdirective);
	            }
	        });
	        //加载directive自身
	        _directiveCompletion.push.apply(_directiveCompletion, __spread(server$1.__moduleExports.host.HTMLDirectiveSource.getNameCompltionItems().filter(function (e) {
	            var e_1, _a;
	            try {
	                for (var _directiveNodes_1 = __values(_directiveNodes), _directiveNodes_1_1 = _directiveNodes_1.next(); !_directiveNodes_1_1.done; _directiveNodes_1_1 = _directiveNodes_1.next()) {
	                    var directive = _directiveNodes_1_1.value;
	                    if (e.label == directive.getName())
	                        return false;
	                }
	            }
	            catch (e_1_1) { e_1 = { error: e_1_1 }; }
	            finally {
	                try {
	                    if (_directiveNodes_1_1 && !_directiveNodes_1_1.done && (_a = _directiveNodes_1["return"])) _a.call(_directiveNodes_1);
	                }
	                finally { if (e_1) throw e_1.error; }
	            }
	            return true;
	        })));
	        // 属性加载
	        _directiveNodes === null || _directiveNodes === void 0 ? void 0 : _directiveNodes.forEach(function (directiveNode) {
	            if (directiveNode)
	                _attrsCompletion.push.apply(_attrsCompletion, __spread(directiveNode.getFullCompltionItems(range)));
	        });
	        _attrsCompletion.push.apply(_attrsCompletion, __spread(node.getFullCompltionItems(range)));
	        //属性清洗
	        _attrsCompletion = _attrsCompletion.filter(function (e) {
	            var e_2, _a;
	            try {
	                for (var _attrs_1 = __values(_attrs), _attrs_1_1 = _attrs_1.next(); !_attrs_1_1.done; _attrs_1_1 = _attrs_1.next()) {
	                    var name_1 = _attrs_1_1.value;
	                    if (e.label.indexOf(name_1) !== -1)
	                        return false;
	                }
	            }
	            catch (e_2_1) { e_2 = { error: e_2_1 }; }
	            finally {
	                try {
	                    if (_attrs_1_1 && !_attrs_1_1.done && (_a = _attrs_1["return"])) _a.call(_attrs_1);
	                }
	                finally { if (e_2) throw e_2.error; }
	            }
	            return true;
	        });
	        if (!range && _attrsCompletion.length > 30) {
	            return _attrsCompletion;
	        }
	        return __spread(_attrsCompletion, _directiveCompletion);
	    };
	    return CompletionProvider;
	}());
	exports.CompletionProvider = CompletionProvider;
	});

	var util$1 = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;

	function getPrefix(name, comName) {
	    switch (comName) {
	        case type$1.SupportComponentName.DevUI:
	            return getPrefixForDevUI(name);
	    }
	    return "";
	}
	exports.getPrefix = getPrefix;
	function getcomNameFromPrefix(prefix) {
	    switch (prefix) {
	        case 'd': return type$1.SupportComponentName.DevUI;
	    }
	}
	exports.getcomNameFromPrefix = getcomNameFromPrefix;
	function getTagPrefixFromComName(comName, directive) {
	    if (directive === void 0) { directive = false; }
	    switch (comName) {
	        case type$1.SupportComponentName.DevUI: return directive ? 'd' : 'd-';
	    }
	}
	exports.getTagPrefixFromComName = getTagPrefixFromComName;
	function getPrefixForDevUI(name) {
	    var result = "";
	    if (name.indexOf('-') === -1) {
	        result = 'd' + name.replace(/[a-z]/g, "");
	        if (result.length < 2) {
	            result = name.substring(1, 4);
	        }
	    }
	    else {
	        result = name.substring(2).split('-').map(function (e) { return (e.charAt(0)); }).join('');
	        if (result.length < 2) {
	            result = name.substring(2, 5);
	        }
	    }
	    return result.toLowerCase();
	}
	exports.getPrefixForDevUI = getPrefixForDevUI;
	});

	var Architect_1 = createCommonjsModule(function (module, exports) {
	var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-06-04 19:26:34
	 * @LastEditTime: 2020-06-08 22:34:57
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\source\Architect.ts
	 */


	// const info = require('D:\\MyProgram\\Extension_Universe\\WCH-Creater\\info.js');
	var Architect = /** @class */ (function () {
	    function Architect() {
	        this.componentRootNode = new Storage.RootNode();
	        this.directiveRootNode = new Storage.RootNode();
	    }
	    Architect.prototype.build = function (info, comName) {
	        var e_1, _a;
	        var _this = this;
	        try {
	            for (var info_1 = __values(info), info_1_1 = info_1.next(); !info_1_1.done; info_1_1 = info_1.next()) {
	                var component = info_1_1.value;
	                this.nodeInbuild = undefined;
	                var name_1 = component.name, description = component.description, tmw = component.tmw, cnName = component.cnName, attrList = component.attrList, directiveFlag = component.directiveFlag;
	                name_1 = name_1.toString();
	                var tempPrefix = util$1.getPrefix(name_1, comName);
	                if (directiveFlag) {
	                    this.nodeInbuild = new Storage.Directive(name_1, comName, description, tmw, cnName, name_1.substring(1).toLowerCase());
	                    this.directiveRootNode.addComponentOrDirectives(this.nodeInbuild, tempPrefix, comName);
	                }
	                else {
	                    this.nodeInbuild = new Storage.TagComponent(name_1, comName, description, tmw, cnName, name_1.substring(2).toLowerCase());
	                    this.componentRootNode.addComponentOrDirectives(this.nodeInbuild, tempPrefix, comName);
	                }
	                attrList.forEach(function (ele) {
	                    if (ele['name'] == _this.nodeInbuild.getName() && _this.nodeInbuild instanceof Storage.Directive) {
	                        _this.nodeInbuild.setHasValueFlag();
	                    }
	                    else if (!_this.nodeInbuild.getSubNode(ele['name'])) {
	                        _this.nodeInbuild.addAttritube(new Storage.Attribute(ele['name'], ele['type'], ele['default'], ele['description'], ele['isNecessary'], ele['isEvent'], ele['valueSet']));
	                    }
	                });
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (info_1_1 && !info_1_1.done && (_a = info_1["return"])) _a.call(info_1);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        this.buildCompletionItems();
	        return [this.componentRootNode, this.directiveRootNode];
	    };
	    Architect.prototype.buildCompletionItems = function () {
	        this.componentRootNode.buildCompletionItems();
	        this.directiveRootNode.buildCompletionItems();
	    };
	    // _buildCompletionItems(node: HTMLInfoNode) {
	    // 	node.buildNameCompletionItem();
	    // 	let subnodes = node.getSubNodes();
	    // 	if (subnodes) {
	    // 		for (let subnode of subnodes) {
	    // 			this._buildCompletionItems(subnode);
	    // 		}
	    // 	}
	    // 	return;
	    // }
	    Architect.prototype.getRoot = function () {
	        return this.componentRootNode;
	    };
	    return Architect;
	}());
	exports.Architect = Architect;
	});

	var Hunter_1 = createCommonjsModule(function (module, exports) {
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spread = (commonjsGlobal && commonjsGlobal.__spread) || function () {
	    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	    return ar;
	};
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-06-05 20:55:33
	 * @LastEditTime: 2020-06-08 14:37:01
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\Host\Hunter.ts
	 */






	var Hunter = /** @class */ (function () {
	    function Hunter() {
	        this.searchParser = new parser.SearchParser();
	    }
	    Hunter.prototype.searchTerminalAST = function (offset, uri) {
	        var _snapShot = server$1.__moduleExports.host.snapshotMap.get(uri);
	        if (!_snapShot) {
	            throw Error("this uri does not have a snapShot: " + uri);
	        }
	        var root = _snapShot.root, textDocument = _snapShot.textDocument, HTMLAstToHTMLInfoNode = _snapShot.HTMLAstToHTMLInfoNode;
	        if (!root) {
	            throw Error("Snap shot does not have this file : " + uri + ", please parse it befor use it!");
	        }
	        var _result = this.searchParser.DFS(offset, root);
	        //调整Node位置
	        return _result ? _result : { ast: undefined, type: type$1.SearchResultType.Null };
	    };
	    Hunter.prototype.findHTMLInfoNode = function (ast$1, uri, map) {
	        if (!ast$1) {
	            throw Error("ast Does not Exits in file: " + uri);
	        }
	        if (!map) {
	            map = server$1.__moduleExports.host.getSnapShotFromURI(uri).HTMLAstToHTMLInfoNode;
	        }
	        if (ast$1 instanceof ast.HTMLATTRAST) {
	            var attrname = ast$1.getName().replace(/\[|\(|\)|\]/g, "");
	            var hostcopy = server$1.__moduleExports.host;
	            var directive = server$1.__moduleExports.host.HTMLDirectiveSource.getSchema()[attrname];
	            if (directive) {
	                return directive;
	            }
	        }
	        //表内存在则直接返回
	        var res = map.get(ast$1);
	        if (res) {
	            return res;
	        }
	        if (ast$1.getName() == "$$ROOT$$") {
	            var _htmlroot = server$1.__moduleExports.host.HTMLComoponentSource;
	            map.set(ast$1, _htmlroot);
	            return _htmlroot;
	        }
	        var _name = ast$1.getName();
	        var _parentast = ast$1.parentPointer;
	        //没有指针报错
	        if (!_parentast || !_name) {
	            throw Error("None parent cursor or name of node " + _name);
	        }
	        if (ast$1 instanceof ast.HTMLTagAST) {
	            var infoNode = server$1.__moduleExports.host.HTMLComoponentSource.getSubNode(_name);
	            return infoNode ? infoNode : new Storage.TagComponent(ast$1.getName());
	        }
	        else {
	            //表内没有则向上递归
	            _name = util.convertStringToName(_name);
	            var _parentInfoNode = map.get(_parentast);
	            if (!_parentInfoNode) {
	                _parentInfoNode = this.findHTMLInfoNode(_parentast, uri);
	            }
	            if (_parentInfoNode) {
	                var _currentInfoNode_1 = _parentInfoNode === null || _parentInfoNode === void 0 ? void 0 : _parentInfoNode.getSubNode(_name);
	                if (!_currentInfoNode_1 && ast$1.parentPointer instanceof ast.HTMLTagAST) {
	                    //如果tag里面不存在 就去指令里面找
	                    var _directives_1 = [];
	                    __spread(ast$1.parentPointer.attrList.directive.toArray(), ast$1.parentPointer.attrList.attr.toArray()).forEach(function (e) {
	                        var _directive = server$1.__moduleExports.host.HTMLDirectiveSource.getSchema()[e.getName().replace(/\[|\(|\)|\]/g, "")];
	                        if (_directive) {
	                            _directives_1.push(_directive);
	                        }
	                    });
	                    _directives_1.forEach(function (e) {
	                        if (!_currentInfoNode_1) {
	                            _currentInfoNode_1 = e.getSubNode(_name);
	                        }
	                    });
	                    //如果指令里面不存在，就去伪装成属性的指令里面找。
	                }
	                if (_currentInfoNode_1) {
	                    map.set(ast$1, _currentInfoNode_1);
	                }
	                return _currentInfoNode_1;
	            }
	        }
	    };
	    return Hunter;
	}());
	exports.Hunter = Hunter;
	});

	var info = createCommonjsModule(function (module, exports) {
	/*
	 * @Author: your name
	 * @Date: 2020-06-05 20:52:19
	 * @LastEditTime: 2020-06-06 19:35:12
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\info.js
	 */
	exports.__esModule = true;
	exports.devuiInfo = [{ "name": "d-accordion", "attrList": [{ "name": "data", "type": "Array<any>或AccordionMenuType", "default": "--", "description": "必选，数据源，可以自定义数组或者使用预设的AccordionMenuType", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "titleKey", "type": "string", "default": "title", "description": "可选，标题的属性名，item[titleKey]类型为string，为标题显示内容", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "loadingKey", "type": "string", "default": "loading", "description": "可选，子菜单是否加载中的判断属性名，item[loadingKey]类型为boolean", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "childrenKey", "type": "string", "default": "children", "description": "可选，子菜单的属性名，item[childrenKey]类型为Array<any>", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabledKey", "type": "string", "default": "disabled", "description": "可选，是否禁用的属性名，item[disabledKey]类型为boolean", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "activeKey", "type": "string", "default": "active", "description": "可选，子菜单是否激活的属性名，item[activeKey]类型为boolean", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "openKey", "type": "string", "default": "open", "description": "可选，菜单是否展开的属性名，item[openKey]类型为boolean", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "restrictOneOpen", "type": "boolean", "default": "false", "description": "可选，限制一级菜单同时只能打开一个，默认不限制", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "menuItemTemplate", "type": "TemplateRef<any>", "default": "内置", "description": "可选，可展开菜单内容条模板，可用变量值见下", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "itemTemplate", "type": "TemplateRef<any>", "default": "内置", "description": "可选，可点击菜单内容条模板，可用变量值见下", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "noContentTemplate", "type": "TemplateRef<any>", "default": "内置", "description": "可选，没有内容的时候使用自定义模板，可用变量值见下", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "loadingTemplate", "type": "TemplateRef<any>", "default": "内置", "description": "可选，加载中使用自定义模板，可用变量值见下", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "innerListTemplate", "type": "TemplateRef<any>", "default": "内置", "description": "可选，子列表内容完全自定义，用做折叠面板，可用变量值见下", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "linkType", "type": "string", "default": "", "description": "可选，routerLink为路由场景；hrefLink为外部链接场景；dependOnLinkTypeKey为动态路由或外部链接场景；为默认非链接类型（无法右键打开新标签页）", "attrType": "ATTR", "isNecessary": false, "valueSet": ["routerLink", "hrefLink", "dependOnLinkTypeKey", ""], "isEvent": false }, { "name": "linkTypeKey", "type": "string", "default": "linkType", "description": "可选，链接内容的类型的key值，用于linkType为dependOnLinkTypeKey时指定对象链接类型属性名，item[linkTypeKey]类型为routerLink!!!hrefLink!!!string，其中routerLink为路由链接，hrefLink为外部链接，其他为默认非链接类型", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "linkKey", "type": "string", "default": "link", "description": "可选，链接内容的key，用于linkType为连接类型记非时，链接的取值的属性值，item[linkKey]为路由地址或者超链接地址", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "linkTargetKey", "type": "string", "default": "target", "description": "可选，链接目标窗口的key，用于链接类型，item[linkTargetKey]为单个链接的目标窗口", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "linkDefaultTarget", "type": "string", "default": "_self", "description": "可选，不设置target的时候target默认值，用于链接类型", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "autoOpenActiveMenu", "type": "boolean", "default": "false", "description": "可选，是否自动展开带有活跃子项的菜单", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "menuToggle", "type": ["EventEmitter<AccordionMenuToggleEvent>"], "description": "可选，可展开菜单展开事件，返回对象里属性item为点击的对象数据，open为true则将要展开false则将要关闭，parent为父对象数据，event为点击事件的原生事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "itemClick", "type": ["EventEmitter<AccordionItemClickEvent>"], "description": "可选，可点击菜单点击事件，返回对象里属性item为点击的对象数据，preActive对象为上一次展开的对象，parent为父对象数据，event为点击事件的原生事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "activeItemChange", "type": ["EventEmitter<any>"], "description": "可选，子项切换的时候会发出新激活的子项的数据", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "手风琴，用于需要分组的层级菜单", "tmw": "需要通过分组组织菜单的时候使用", "cnName": "手风琴" }, { "name": "d-alert", "attrList": [{ "name": "type", "type": "string", "default": "info", "description": "必选，指定警告提示的样式", "attrType": "ATTR", "isNecessary": true, "valueSet": ["success", "danger", "warning", "info"], "isEvent": false }, { "name": "cssClass", "type": "string", "default": "--", "description": "可选，自定义class名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "closeable", "type": "boolean", "default": "true", "description": "可选，默认显示关闭按钮", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dismissTime", "type": "number", "default": "--", "description": "可选，自动关闭alert的延迟时间(单位：ms)", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showIcon", "type": "boolean", "default": "true", "description": "可选，是否使用默认的类型图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "closeEvent", "type": ["EventEmitter<any>"], "description": "可选，关闭时触发的回调函数", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "用于向用户显示警告的信息。", "tmw": "当页面需要向用户发出警告信息时。", "cnName": "警告" }, { "name": "d-auto-complete", "attrList": [{ "name": "allowEmptyValueSearch", "type": "boolean", "default": "false", "description": "可选，在绑定的输入框value为空时，是否进行搜索提示操作", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "appendToBody", "type": "boolean", "default": "false", "description": "可选，下拉弹出是否appendtobody", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "source", "type": "Array<any>", "default": "--", "description": "必选，有searchFn的情况下可以不必选", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，是否禁止指令", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "cssClass", "type": "string", "default": "--", "description": "可选，自定义class名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "delay", "type": "number", "default": "300", "description": "可选，只有在delay时间经过后并且输入新值，才做搜索查询", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabledKey", "type": "string", "default": "--", "description": "可选，禁用单个选项;当传入资源source选项类型为对象,比如设置为disabled,则当对象的disable属性为true时，比如{label:xxx,disabled:true},该选项将禁用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "itemTemplate", "type": "TemplateRef", "default": "--", "description": "可选，自定义展示模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "noResultItemTemplate", "type": "TemplateRef", "default": "--", "description": "可选，没有匹配项的展示结果", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "formatter", "type": "Function", "default": "--", "description": "可选，格式化函数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isSearching", "type": "boolean", "default": "false", "description": "可选，是否在搜索中，用于控制searchingTemplate是否显示", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "searchFn", "type": "Function", "default": "(term:string,target?:AutoCompleteDirective)=>Observable<any[]>", "description": "可选，自定义搜索过滤", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "searchingTemplate", "type": "TemplateRef", "default": "--", "description": "可选，自定义搜索中显示模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "selectValue", "type": "Function", "default": "--", "description": "可选，选择选项之后的回调函数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "transInputFocusEmit", "type": "Function", "default": "--", "description": "可选，inputfocus和blur标志", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "sceneType", "type": "string", "default": "--", "description": "可选，值为select、suggest", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "tipsText", "type": "string", "default": "--", "description": "可选，提示文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "overview", "type": "string", "default": "--", "description": "可选", "attrType": "ATTR", "isNecessary": false, "valueSet": ["border", "none", "multiline", "single"], "isEvent": false }, { "name": "latestSource", "type": "Array<any>", "default": "--", "description": "可选，最近输入", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "enableLazyLoad", "type": "boolean", "default": "false", "description": "可选，是否允许懒加载", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "loadMore", "type": ["EventEmitter<any>"], "description": "可选，懒加载触发事件，配合enableLazyLoad使用,使用\\$event.loadFinish()\\关闭loading状态,$event为弹窗组件AutoCompletePopupComponent的实例", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "在用户进行输入时联想用户可能需要的输入结果。", "tmw": "可以根据用户输入的部分字符推断出他可能想要输入的内容。", "cnName": "自动补全" }, { "name": "dAnchor", "attrList": [{ "name": "dAnchor", "type": "string", "default": "--", "description": "必选，设置一个锚点的名字", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "anchorActive", "type": "string", "default": "--", "description": "可选，锚点处于激活状态的时候，模块生效对应的css类名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true, "description": "用于跳转到页面指定位置。", "tmw": "需要在页面的各个部分之间实现快速跳转时。", "cnName": "锚点" }, { "name": "dAnchorLink", "attrList": [{ "name": "dAnchorLink", "type": "string", "default": "--", "description": "必选，点击滑动的目标锚点的名字", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "anchorActive", "type": "string", "default": "--", "description": "可选，锚点处于激活状态的时候，链接生效对应的css类名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true, "description": "定义一个锚点的链接，点击链接会滑动到锚点，锚点处于页面顶部的时候也会激活链接的class" }, { "name": "dAnchorBox", "attrList": [], "directiveFlag": true, "description": "定义一个扫描锚点的容器，放在dAnchor与dAnchorLink的公共父节点上，用于锚点和链接之间的通信" }, { "name": "dAnchorHashSupport", "attrList": [], "directiveFlag": true, "description": "（dAnchorBox辅助指令）" }, { "name": "d-avatar", "attrList": [{ "name": "name", "type": "string", "default": "--", "description": "必选，传入字符串用于制作头像", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "gender", "type": "string", "default": "--", "description": "可选，根据性别区分头像颜色,传入string可以是female!!!male的任意大小写形式", "attrType": "ATTR", "isNecessary": false, "valueSet": ["string", "male", "female"], "isEvent": false }, { "name": "width", "type": "number", "default": "40", "description": "可选，设定头像的宽度,单位为px", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "height", "type": "number", "default": "40", "description": "可选，设定头像的高度,单位为px", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isRound", "type": "boolean", "default": "true", "description": "可选，是否显示为圆形头像", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "imgSrc", "type": "string", "default": "--", "description": "可选，传入自定义图片作为头像", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customText", "type": "string", "default": "--", "description": "可选，传入自定义显示文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": false, "description": "设置头像", "tmw": "可以根据用户输入的字符显示头像。", "cnName": "头像" }, { "name": "d-button", "attrList": [{ "name": "id", "type": "string", "default": "--", "description": "可选，buttonid", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "type", "type": "string", "default": "button", "description": "可选，按钮类型", "attrType": "ATTR", "isNecessary": false, "valueSet": ["button", "submit", "reset"], "isEvent": false }, { "name": "bsStyle", "type": "string", "default": "primary", "description": "可选，按钮风格", "attrType": "ATTR", "isNecessary": false, "valueSet": ["primary", "common", "text", "text-dark"], "isEvent": false }, { "name": "bsSize", "type": "string", "default": "md", "description": "可选，按钮大小", "attrType": "ATTR", "isNecessary": false, "valueSet": ["lg", "md", "sm", "xs"], "isEvent": false }, { "name": "bordered", "type": "boolean", "default": "false", "description": "可选，是否有边框", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "icon", "type": "string", "default": "--", "description": "可选，自定义按钮图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showLoading", "type": "boolean", "default": "false", "description": "可选，是否显示加载提示", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "width", "type": "number", "default": "--", "description": "可选，button宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，是否禁用button", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "autofocus", "type": "boolean", "default": "false", "description": "可选，按钮加载时是否自动获得焦点", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "btnClick", "type": ["EventEmitter<any>"], "description": "可选，button点击事件，解决IE浏览器disabled还会触发click,返回点击下后鼠标事件对象", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "按钮用于开始一个即时操作，发起命令并获取结果，在特定场景中使用特定按钮形态", "tmw": "标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。", "cnName": "按钮" }, { "name": "d-breadcrumb-item", "attrList": [{ "name": "showMenu", "type": "boolean", "default": "false", "description": "可选，是否需要显示下拉箭头及下拉列表内容", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "menuList", "type": "Array<MenuConfig>", "default": "--", "description": "可选，showMenu为true时传入，下拉列表的显示内容", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isSearch", "type": "boolean", "default": "false", "description": "可选，showMenu为true时传入，下拉列表是否需要搜索功能", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customMenuTemplate", "type": "TemplateRef<any>", "default": "--", "description": "可选，showMenu为true时传入，自定义下拉列表", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "toggleEvent", "type": ["EventEmitter<any>"], "description": "dropdown菜单展开和收起的事件，返回值为当前菜单是否打开", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false }, { "name": "d-checkbox", "attrList": [{ "name": "name", "type": "string", "default": "--", "description": "可选，表单域名，input原生name属性", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "label", "type": "string", "default": "--", "description": "可选，显示标签", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isShowTitle", "type": "boolean", "default": "true", "description": "可选，是否显示title提示", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，是否禁用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "labelTemplate", "type": "TemplateRef", "default": "--", "description": "可选，标签的自定义模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "halfchecked", "type": "boolean", "default": "false", "description": "可选，半选状态", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "color", "type": "string", "default": "--", "description": "可选，复选框颜色", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showAnimation", "type": "boolean", "default": "true", "description": "可选，控制是否显示动画", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "change", "type": ["EventEmitter<boolean>"], "description": "复选框的值改变时发出的事件，值是当前状态", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "允许用户从一个数据集中选择多个选项。", "tmw": "1、在一组选项中进行多项选择。        2、单独使用可以表示在两个状态之间切换，需要和提交操作结合。", "cnName": "复选框" }, { "name": "d-checkbox-group", "attrList": [{ "name": "name", "type": "string", "default": "--", "description": "可选，表单域名，input原生name属性", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "direction", "type": "string", "default": "column", "description": "可选，显示方向", "attrType": "ATTR", "isNecessary": false, "valueSet": ["row", "column"], "isEvent": false }, { "name": "isShowTitle", "type": "boolean", "default": "true", "description": "可选，是否显示title提示", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "options", "type": "Array<any>", "default": "[]", "description": "可选，复选框选项数组", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterKey", "type": "string", "default": "--", "description": "可选，options为对象数组时，标识选项唯一id的键值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "labelTemplate", "type": "TemplateRef", "default": "--", "description": "可选，标签的自定义模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "halfchecked", "type": "boolean", "default": "false", "description": "可选，半选状态", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "color", "type": "string", "default": "--", "description": "可选，复选框颜色", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showAnimation", "type": "boolean", "default": "true", "description": "可选，控制是否显示动画", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "change", "type": ["EventEmitter<boolean>"], "description": "checkbox值改变事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false }, { "name": "d-data-table", "attrList": [{ "name": "checkable", "type": "boolean", "default": "--", "description": "可选，Datatable是否提供勾选行的功能", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showExpandToggle", "type": "boolean", "default": "--", "description": "可选，是否提供显示扩展行的功能，为true则在配置了扩展行的行前面生成操作按钮", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "fixHeader", "type": "boolean", "default": "--", "description": "可选，是否固定表头（在表格超过容器最大高度时，表格可滚动时生效）", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showSortIcon", "type": "boolean", "default": "true", "description": "可选，是否显示排序未激活图标，默认显示", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dataSource", "type": "any[]", "default": "--", "description": "数据源，用于渲染表格数据", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "hideColumn", "type": "string[]", "default": "--", "description": "可选，用于隐藏列", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "lazy", "type": "boolean", "default": "false", "description": "可选，是否懒加载数据", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "pageAllChecked", "type": "boolean", "default": "--", "description": "可选，选中当前页所有row", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "scrollable", "type": "boolean", "default": "--", "description": "可选，表格在超出容器时，是否可以通过滚动查看表格内容", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxWidth", "type": "stringpx", "default": "--", "description": "可选，限制表格最大宽度，默认撑满父容器", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxHeight", "type": "stringpx", "default": "--", "description": "可选，限制最大高度，默认", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "type", "type": "striped、borderless、", "default": "", "description": "【可选】表格类型，striped表示斑马纹类型，borderless表示表格内容没有分割线、默认普通表格", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "hover", "type": "boolean", "default": "true", "description": "可选，表格是否开启鼠标hover行高亮效果", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "cssClass", "type": "string", "default": "--", "description": "可选，表格自定义样式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "tableWidth", "type": "string", "default": "100%", "description": "可选，表格宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "onlyOneColumnSort", "type": "boolean", "default": "--", "description": "可选，是否限制多列排序的输出限制为一项", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "multiSort", "type": "SortEventArg[]", "default": "[]", "description": "可选，多列选择数组，用来指导那几列会被排序", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "~~resizeable~~", "type": "~~boolean~~", "default": "--", "description": "~~可选，是否可以拖拽调整列~~宽", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "detailTemplateRef", "type": "TemplateRef", "default": "--", "description": "可选，用来自定义详情页的模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "timeout", "type": "number", "default": "300", "description": "可选，同时绑定单击、双击事件时，用于区分点击的时间间隔,默认300ms，两个事件不同时使用可以指定为0", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "headerExpandConfig", "type": "TableExpandConfig", "default": "--", "description": "可选，配置header下的额外内容", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "checkableRelation", "type": "CheckableRelation", "default": "--", "description": "可选，配置树形表格的父子选中是否互相关联upward：选中子关联父downward：选中父关联子", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "loadChildrenTable", "type": "Promise", "default": "--", "description": "可选，展开子表格的回调，用于异步加载子表格", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "loadAllChildrenTable", "type": "Promise", "default": "--", "description": "可选，表头展开所有子表格的回调，用于异步加载所有子表格", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "virtualScroll", "type": "boolean", "default": "false", "description": "可选，是否开启虚拟滚动", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "beforeCellEdit", "type": "Promise", "default": "--", "description": "可选，单元格编辑前的拦截方法,<br>resolve(extraOptions)将更新该列的extraOptions", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "colDraggable", "type": "boolean", "default": "false", "description": "可选，表格列是否可拖动排序", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "colDropFreezeTo", "type": "number", "default": "0", "description": "可选，表格列可拖动排序时配置前n列不可拖动", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "virtualItemSize", "type": "number", "default": "40", "description": "可选，虚拟滚动时每一列的高度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "virtualMinBufferPx", "type": "number", "default": "80", "description": "可选，虚拟滚动时缓冲区最小像素高度，低于该值时将加载新结构", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "virtualMaxBufferPx", "type": "number", "default": "200", "description": "可选，虚拟滚动时缓冲区最大像素高度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "columnAdjustStrategy", "type": "ColumnAdjustStrategy", "default": "ColumnAdjustStrategy.disable", "description": "可选，列宽调整策略，disable:列宽不可调整;mouseup:列宽在鼠标松开时变化;mousemove:列宽随着鼠标移动变化", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "multiSortChange", "type": ["EventEmitter<SortEventArg[]>"], "description": "多列选择Change事件，用来更新多列选择数组，返回单元格信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "cellClick", "type": ["EventEmitter<CellSelectedEventArg>"], "description": "表格单元格点击事件，返回单元格信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "cellDBClick", "type": ["EventEmitter<CellSelectedEventArg>"], "description": "表格单元格双击事件，返回单元格信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "rowClick", "type": ["EventEmitter<RowSelectedEventArg>"], "description": "表格行点击事件，返回行信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "rowDBClick", "type": ["EventEmitter<RowSelectedEventArg>"], "description": "表格行双击事件，返回行信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "detialToggle", "type": ["EventEmitter<any>"], "description": "扩展行展开收起事件，返回行状态信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "cellEditStart", "type": ["EventEmitter<CellSelectedEventArg>"], "description": "表格单元格开始编辑事件，返回单元格信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "cellEditEnd", "type": ["EventEmitter<CellSelectedEventArg>"], "description": "表格单元格结束编辑事件，返回单元格信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "rowCheckChange", "type": ["EventEmitter<RowCheckChangeEventArg>"], "description": "某行的勾选状态变化事件，返回单元格信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "checkAllChange", "type": ["EventEmitter<boolean>"], "description": "当前页码全勾选状态变化事件，返回true或false", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "resize", "type": ["EventEmitter<ColumnResizeEventArg>"], "description": "列宽变化事件，返回单元格信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "childrenTableClose", "type": ["EventEmitter<any>"], "description": "子列表关闭事件，返回列表行信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "allChildrenTableClose", "type": ["EventEmitter<any>"], "description": "全部子列表关闭事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false }, { "name": "d-column", "attrList": [{ "name": "editable", "type": "boolean", "default": "false", "description": "可选，在d-column上指定该列是否可编辑", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "tableLevel", "type": "number", "default": "0", "description": "可选，当前表格层级,在树形表格场景下自增长", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "~~fieldType~~", "type": "~~string~~", "default": "~~text~~", "description": "~~可选，单元格类型，支持text、select、treeSelect、input-number、datapicker、customized~~", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxWidth", "type": "stringpx", "default": "--", "description": "可选，最大宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "minWidth", "type": "stringpx", "default": "--", "description": "可选，最小宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "field", "type": "string", "default": "--", "description": "该列字段", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "header", "type": "string", "default": "--", "description": "该列表头文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "sortable", "type": "boolean", "default": "--", "description": "可选，是否可排序", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "editable", "type": "boolean", "default": "--", "description": "可选，是否可编辑", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "width", "type": "stringpx、%", "default": "--", "description": "宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "nestedColumn", "type": "Boolean", "default": "false", "description": "可选，指定该列作为树形表格的操作列，即有展开\\折叠按钮和内容缩进表明层级关系", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "~~extraOptions.inputs~~", "type": "~~any{}~~", "default": "--", "description": "~~可选，主要配置单元格编辑时编辑组件的inputs,支持select、treeSelect、input-number、datapicker组件,如：extraOptions.treeData配置fieldType为treeSelect时的数据源~~", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraOptions.editableTip", "type": "btn、", "default": "--", "description": "可选，可编辑提示，btn表示鼠标悬浮单元格出现编辑按钮，未配置时鼠标悬浮单元格背景色变化", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraOptions.iconFoldTable", "type": "Template", "default": "--", "description": "可选，自动定义树形表格的折叠图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraOptions.iconUnFoldTable", "type": "Template", "default": "--", "description": "可选，自动定义树形表格的展开图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraOptions.showHeadTableToggler", "type": "boolean", "default": "false", "description": "可选，树形表格是否在header出现展开\\折叠图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "order", "type": "number", "default": "Number.MAX_VALUE", "description": "可选，列序号", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterable", "type": "boolean", "default": "--", "description": "可选，是否可筛选", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterList", "type": "array", "default": "--", "description": "传入需要操作的筛选列表，当filterable为true时必选", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterMultiple", "type": "boolean", "default": "true", "description": "可选，选择筛选列表为多选或单选,true为多选，false为单选", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customFilterTemplate", "type": "TemplateRef", "default": "--", "description": "可选，表格过滤弹出框的自定义模板，参考DOC下‘自定义过滤弹出框’使用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "beforeFilter", "type": "function、Promise、Observable", "default": "--", "description": "可选，表格过滤弹出框弹出前的回调函数，返回false可阻止弹框弹出", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "cellClass", "type": "string", "default": "--", "description": "该列单元格自定义class", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "fixedLeft", "type": "string", "default": "--", "description": "该列固定到左侧的距离，如：‘100px’", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "fixedRight", "type": "string", "default": "--", "description": "该列固定到右侧的距离，如：‘100px’", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterBoxWidth", "type": "any", "default": "--", "description": "过滤弹出框的宽度，如：‘300px’", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterBoxHeight", "type": "any", "default": "--", "description": "过滤弹出框的高度，如：‘400px’", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterChange", "type": ["FilterConfig[]"], "description": "确认筛选回调事件，返回选中的筛选数组", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false }, { "name": "dDatepicker", "attrList": [{ "name": "cssClass", "type": "string", "default": "--", "description": "可选，自定义class", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "locale", "type": "string", "default": "zh-cn", "description": "可选，时区", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showTime", "type": "boolean", "default": "false", "description": "可选，是否显示时分秒", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "yearNumber", "type": "number", "default": "12", "description": "可选，下拉年份显示数量", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，禁用选择", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "direction", "type": "string", "default": "down", "description": "可选，日期弹出方向", "attrType": "ATTR", "isNecessary": false, "valueSet": ["up", "down"], "isEvent": false }, { "name": "dateConverter", "type": "function", "default": "DefaultDateConverter", "description": "可选，日期格式化、解析函数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dateConfig", "type": "any", "default": "见下方介绍", "description": "可选，配置参数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dateFormat", "type": "any", "default": "y/MM/dd!!!y/MM/ddHH:mm", "description": "可选，传入格式化，根据是否showTime区别不同默认值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "minDate", "type": "Date", "default": "newDate(01/01/190000:00:00)", "description": "可选，限制最小可选日期", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxDate", "type": "Date", "default": "newDate(11/31/209923:59:59)", "description": "可选，限制最大可选日期", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "autoOpen", "type": "boolean", "default": "false", "description": "可选，初始化是否直接展开", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customViewTemplate", "type": "template", "default": "--", "description": "可选，自定义快捷设置日期或自定义操作区内容，用法见demo", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "selectedDateChange", "type": ["EventEmitter<object>"], "description": "可选，子项切换的时候会发出新激活的子项的数据", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": true, "description": "输入或选择日期的控件。", "tmw": "当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。", "cnName": "日期选择器" }, { "name": "dDateRangePicker", "attrList": [{ "name": "cssClass", "type": "string", "default": "--", "description": "可选，自定义class", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "locale", "type": "string", "default": "zh-cn", "description": "可选，时区", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showTime", "type": "boolean", "default": "false", "description": "可选，是否显示时分秒", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，禁用选择", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dateConverter", "type": "function", "default": "DefaultDateConverter", "description": "可选，日期格式化、解析函数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dateConfig", "type": "any", "default": "见下方介绍", "description": "可选，配置参数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dateFormat", "type": "any", "default": "y/MM/dd!!!y/MM/ddHH:mm", "description": "可选，传入格式化", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "minDate", "type": "Date", "default": "newDate(01/01/190000:00:00)", "description": "可选，限制最小可选日期", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxDate", "type": "Date", "default": "newDate(11/31/209923:59:59)", "description": "可选，限制最大可选日期", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "splitter", "type": "string", "default": "-", "description": "可选，两日期间的分隔符", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "selectedRange", "type": "[Date,Date]", "default": "[null,null]", "description": "可选，时选择的日期", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customViewTemplate", "type": "template", "default": "--", "description": "可选，自定义快捷设置日期或自定义操作区内容，用法见demo", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "selectedRangeChange", "type": ["EventEmitter<object>"], "description": "日期发生变化回调", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": true }, { "name": "dDraggable", "attrList": [{ "name": "dragData", "type": "any", "default": "--", "description": "可选，转递给DropEvent事件的数据.", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragScope", "type": "string", "default": "default", "description": "可选，限制drop的位置，必须匹配对应的dropScope", "attrType": "ATTR", "isNecessary": false, "valueSet": ["string", "Array<string>"], "isEvent": false }, { "name": "dragOverClass", "type": "string", "default": "--", "description": "可选，拖动时被拖动元素的css", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragHandle", "type": "string", "default": "--", "description": "可选，拖动句柄，css选择器，只有被选中的元素才能响应拖动事件", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，控制当前元素是否可拖动false为可以，true为不可以", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "enableDragFollow", "type": "boolean", "default": "false", "description": "可选，是否启用实体元素跟随（可以添加更多特效，如阴影等）", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragFollowOption", "type": "{appendToBody?:boolean}", "default": "--", "description": "可选，用于控制实体拖拽的一些配置", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragFollowOption.appendToBody", "type": "boolean", "default": "false", "description": "可选，用于控制实体拖拽的克隆元素插入的位置。默认false会插入到源元素父元素所有子的最后，设置为true会附着到。见说明1", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "originPlaceholder", "type": "{show?:boolean;tag?:string;style?:{cssProperties:string]:string};text?:string;removeDelay?:number;}", "default": "--", "description": "可选，设置源占位符号，用于被拖拽元素原始位置占位", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "originPlaceholder.show", "type": "boolean", "default": "true", "description": "可选，是否显示，默认originPlaceholder有Input则显示，特殊情况可以关闭", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "originPlaceholder.tag", "type": "string", "default": "div", "description": "可选，是否显示，默认originPlaceholder有Input则显示，特殊情况可以关闭", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "originPlaceholder.style", "type": "Object", "default": "--", "description": "可选，传style对象，key为样式属性，value为样式值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "originPlaceholder.text", "type": "string", "default": "--", "description": "可选，placeholder内的文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "originPlaceholder.removeDelay", "type": "number", "default": "--", "description": "可选，用于希望源占位符在拖拽之后的延时里再删除，方便做动画，单位为ms毫秒", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragIdentity", "type": "any", "default": "--", "description": "可选，用于虚拟滚动的恢复，虚拟滚动过程中会删除元素（溢出画面）然后又重新生成来恢复元素（回到画面），需要唯一识别值来恢复原始事件拖拽事件监听和源占位符等", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragItemParentName", "type": "string", "default": "--", "description": "可选，选择器名，和dragItemChildrenName搭配用于拖拽截断看不见的列表内元素以提高性能，从dragItemParentName匹配的选择器里边查询匹配dragItemChildrenName的元素，通常是列表里查找条目，把超出可视范围的条目克隆的时候剔除", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragItemChildrenName", "type": "string", "default": "--", "description": "可选，选择器名，和dragItemParentName搭配用于拖拽截断看不见的列表内元素以提高性能，功能见dragItemParentName的描述", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragStartEvent", "type": ["EventEmitter<DragEvent>"], "description": "开始拖动的DragStart事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "dragEndEvent", "type": ["EventEmitter<DragEvent>"], "description": "拖动结束的DragEnd事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "dropEndEvent", "type": ["EventEmitter<DragEvent>"], "description": "放置结束的Drop事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "batchDragActiveEvent", "type": ["EventEmitter<{el:Element,data:any}>"], "description": "通过拖拽把元素加入了批量拖拽组，通知外部选中该元素", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": true, "description": "dDraggable参数" }, { "name": "batchDrag", "attrList": [], "directiveFlag": true, "description": "使用方法dDraggablebatchDrag" }, { "name": "dDroppable", "attrList": [{ "name": "dropScope", "type": "string", "default": "default", "description": "可选，限制drop的区域，对应dragScope", "attrType": "ATTR", "isNecessary": false, "valueSet": ["string", "Array<string>"], "isEvent": false }, { "name": "dragOverClass", "type": "string", "default": "--", "description": "可选，dragover时drop元素上应用的css", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholderStyle", "type": "Object", "default": "{backgroundColor:#6A98E3,opacity:.4}", "description": "可选，允许sort时，用于占位显示", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholderText", "type": "string", "default": "", "description": "可选，允许sort时，用于占位显示内部的文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "allowDropOnItem", "type": "boolean", "default": "false", "description": "可选，允许sort时，用于允许拖动到元素上，方便树形结构的拖动可以成为元素的子节点", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragOverItemClass", "type": "string", "default": "--", "description": "可选，allowDropOnItem为true时，才有效，用于允许拖动到元素上后，被命中的元素增加样式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "nestingTargetRect", "type": "{height?:number,width?:number}", "default": "--", "description": "可选，用于修正有内嵌列表后，父项高度被撑大，此处height，width为父项自己的高度（用于纵向拖动），宽度（用于横向拖动）", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "defaultDropPosition", "type": "string", "default": "closest", "description": "可选，设置拖拽到可放置区域但不在列表区域的放置位置，closest为就近放下，before为加到列表头部，after为加到列表尾部", "attrType": "ATTR", "isNecessary": false, "valueSet": ["closest", "before", "after"], "isEvent": false }, { "name": "dropSortCountSelector", "type": "string", "default": "--", "description": "可选，带有sortable的容器的情况下排序，计数的内容的选择器名称，可以用于过滤掉不应该被计数的元素", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dropSortVirtualScrollOption", "type": "{totalLength?:number;startIndex?:number;}", "default": "--", "description": "可选，用于虚拟滚动列表中返回正确的dropIndex需要接收totalLength为列表的真实总长度，startIndex为当前排序区域显示的第一个dom的在列表内的index值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragEnterEvent", "type": ["EventEmitter<DragEvent>"], "description": "drag元素进入的dragenter事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "dragOverEvent", "type": ["EventEmitter<DragEvent>"], "description": "drag元素在drop区域上的dragover事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "dragLeaveEvent", "type": ["EventEmitter<DragEvent>"], "description": "drag元素离开的dragleave事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "dropEvent", "type": ["EventEmitter<DropEvent>(见下文定义)"], "description": "放置一个元素,接收的事件，其中nativeEvent表示原生的drop事件，其他见定义注释", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": true, "description": "dDroppable参数" }, { "name": "dSortable", "attrList": [{ "name": "dSortDirection", "type": "string", "default": "v", "description": "v垂直排序,h水平排序", "attrType": "ATTR", "isNecessary": false, "valueSet": ["v", "h"], "isEvent": false }, { "name": "dSortableZMode", "type": "boolean", "default": "false", "description": "是否是z模式折回排序，见说明1", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true, "description": "指定需要参与排序的Dom父容器（因为drop只是限定可拖拽区域，具体渲染由使用者控制）" }, { "name": "dDropScrollEnhanced", "attrList": [{ "name": "direction", "type": "string", "default": "v", "description": "滚动方向，垂直滚动v,水平滚动h", "attrType": "ATTR", "isNecessary": false, "valueSet": ["DropScrollSpeed即v", "h"], "isEvent": false }, { "name": "responseEdgeWidth", "type": "string", "default": "100px", "description": "响应自动滚动边缘宽度,函数的情况传入的为列表容器同个方向相对宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": ["string", "((total:number)=>string)"], "isEvent": false }, { "name": "speedFn", "type": "DropScrollSpeedFunction", "default": "内置函数", "description": "速率函数，见备注", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "minSpeed", "type": "DropScrollSpeed即number", "default": "50", "description": "响应最小速度，函数计算小于这个速度的时候，以最小速度为准", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxSpeed", "type": "DropScrollSpeed即number", "default": "1000", "description": "响应最大速度，函数计算大于这个速度的时候，以最大速度为准", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "viewOffset", "type": "{forward?:DropScrollAreaOffset;backward?:DropScrollAreaOffset;}", "default": "--", "description": "设置拖拽区域的偏移，用于某些位置修正", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dropScrollScope", "type": "string", "default": "--", "description": "允许触发滚动scope，不配置为默认接收所有scope，配置情况下，draggable的dragScope和dropScrollScope匹配得上才能触发滚动", "attrType": "ATTR", "isNecessary": false, "valueSet": ["string", "Array<string>"], "isEvent": false }, { "name": "backSpaceDroppable", "type": "boolean", "default": "true", "description": "是否允许在滚动面板上同时触发放置到滚动面板的下边的具体可以放置元素，默认为true，设置为false则不能边滚动边放置", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true }, { "name": "dDropScrollEnhancedSide", "attrList": [], "directiveFlag": true, "description": "如果需要同时两个方向都有滚动条，则需要使用dDropScrollEnhanced的同时使用dDropScrollEnhancedSide，参数列表同dDropScrollEnhanced指令，唯一不同是direction，如果为`'v'`则side附属指令的实际方向为`'h'`。" }, { "name": "dDragSync", "attrList": [{ "name": "dDragSync", "type": "string", "default": "", "description": "必选，拖同步的组名，为空或者空字符串的时候无效，不与其他内容同步", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }], "directiveFlag": true }, { "name": "dDropSortSync", "attrList": [{ "name": "dDropSortSync", "type": "string", "default": "", "description": "必选，放同步的组名，为空或者空字符串的时候无效，不与其他内容同步", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "dDropSyncDirection", "type": "string", "default": "v", "description": "可选，与dSortable的方向正交", "attrType": "ATTR", "isNecessary": false, "valueSet": ["v", "h"], "isEvent": false }], "directiveFlag": true }, { "name": "dDragPreview", "attrList": [{ "name": "dDragPreview", "type": "TemplateRef<any>", "default": "--", "description": "必选，预览的模板引用", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "dragPreviewData", "type": "any", "default": "--", "description": "可选，自定义数据，将由模板变量获得", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragPreviewOptions", "type": "{skipBatchPreview:boolean}", "default": "--", "description": "可选，预览选项", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dragPreviewOptions.skipBatchPreview", "type": "boolean", "default": "false", "description": "可选，预览选项,是否跳过批量预览的样式处理。建议自行处理批量拖拽预览模板的可以跳过", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true }, { "name": "dDropDown", "attrList": [{ "name": "isOpen", "type": "boolean", "default": "false", "description": "可选，可以显示指定dropdown是否打开", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，设置为true禁用dropdown", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "trigger", "type": "string", "default": "click", "description": "可选，dropdown触发方式", "attrType": "ATTR", "isNecessary": false, "valueSet": ["click", "hover"], "isEvent": false }, { "name": "closeScope", "type": "string", "default": "all", "description": "可选，点击关闭区域，blank点击非菜单空白才关闭,all点击菜单内外都关闭，none菜单内外均不关闭仅下拉按键可以关闭", "attrType": "ATTR", "isNecessary": false, "valueSet": ["all", "blank", "none"], "isEvent": false }, { "name": "closeOnMouseLeaveMenu", "type": "boolean", "default": "false", "description": "可选，是否进入菜单后离开菜单的时候关闭菜单", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "toggleEvent", "type": ["EventEmitter<boolean>"], "description": "dropdown菜单展开和收起的布尔值，true表示将要展开，false表示将要关闭", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": true, "description": "按向下弹出的列表。", "tmw": "当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。", "cnName": "下拉菜单" }, { "name": "dDropDownToggle", "attrList": [{ "name": "toggleOnFocus", "type": "boolean", "default": "false", "description": "可选，通过Tab聚焦的时候自动展开", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "autoFocus", "type": "boolean", "default": "false", "description": "可选，实例化后自动聚焦", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true, "description": "开/关切换组件", "tmw": "当两种状态需要来回切换控制时，比如启用/禁用。", "cnName": "开关" }, { "name": "d-editable-select", "attrList": [{ "name": "ngModel", "type": "any", "default": "--", "description": "可选，绑定选中对象，可双向绑定", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "ngModelChange", "type": "EventEmitter", "default": "--", "description": "可选，仅支持事件绑定，用于处理选中对象发生变化", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "source", "type": "any[]", "default": "--", "description": "必选，菜单的条目", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，值为true禁用下拉框", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabledKey", "type": "string", "default": "--", "description": "可选，设置禁用选项的Key值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholder", "type": "string", "default": "", "description": "可选，没有选中项的时候提示文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "itemTemplate", "type": "TemplateRef", "default": "--", "description": "可选，下拉菜单条目的模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "noResultItemTemplate", "type": "TemplateRef", "default": "--", "description": "可选，下拉菜单条目搜索后没有结果的模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxHeight", "type": "number", "default": "--", "description": "可选，下拉菜单的最大高度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "searchFn", "type": "Function", "default": "(term:string)=>Observable<any[]>", "description": "可选，自定义搜索函数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "enableLazyLoad", "type": "boolean", "default": "false", "description": "可选，是否允许懒加载", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "loadMore", "type": ["EventEmitter<any>"], "description": "懒加载触发事件，配合enableLazyLoad使用,使用$event.loadFinish()关闭loading状态，其中$event为AutoCompletePopupComponent的实例", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "下拉选择框。", "tmw": "用户可以从多个选项中选择一项或几项；仅支持用户在下拉选项中选择和搜索系统提供的选项，不支持输入。", "cnName": "下拉选择框" }, { "name": "dForm", "attrList": [{ "name": "layout", "type": "string", "default": "horizontal", "description": "可选，设置表单的排列方式", "attrType": "ATTR", "isNecessary": false, "valueSet": ["horizontal", "vertical", "columns"], "isEvent": false }, { "name": "labelSize", "type": "string", "default": "", "description": "可选，设置label的占宽，未设置默认为100px,sm对应80px,lg对应150px", "attrType": "ATTR", "isNecessary": false, "valueSet": ["sm", "", "lg"], "isEvent": false }], "directiveFlag": true, "description": "表单具备数据收集、数据校验、数据提交功能，在业务中被大量使用，并且布局方式很多，包括单列、多列、向导式、Tab页式。", "tmw": "表单应用广泛，应用在过滤、创建、编辑等场景。", "cnName": "表单" }, { "name": "d-form-label", "attrList": [{ "name": "required", "type": "boolean", "default": "false", "description": "可选，表单选项是否必填", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "hasHelp", "type": "boolean", "default": "false", "description": "可选，表单项是否需要帮助指引", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "helpTips", "type": "string", "default": "", "description": "可选，表单项帮助指引提示内容，需配合hasHelp使用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": false }, { "name": "d-form-control", "attrList": [], "directiveFlag": false, "description": "d-form-item参数" }, { "name": "d-form-item", "attrList": [], "directiveFlag": false }, { "name": "d-fullscreen", "attrList": [{ "name": "fullscreen-target", "type": "HTMLElement", "default": "--", "description": "必选，内容投影，设置需要全屏的元素", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "fullscreen-launch", "type": "HTMLElement", "default": "--", "description": "必选，内容投影，设置触发进入全屏的按钮", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "mode", "type": "string", "default": "immersive", "description": "可选，设置全屏模式", "attrType": "ATTR", "isNecessary": false, "valueSet": ["immersive", "normal"], "isEvent": false }, { "name": "zIndex", "type": "number", "default": "10", "description": "可选，设置全屏层级", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "fullscreenLaunch", "type": ["EventEmitter<boolean>"], "description": "可选，全屏之后的回调", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "全屏组件。", "tmw": "当用户需要将某一区域进行全屏展示时。", "cnName": "全屏" }, { "name": "dImagePreview", "attrList": [{ "name": "customSub", "type": "Subject<HTMLElement>", "default": "--", "description": "可选，customsub触发next时，打开预览", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disableDefault", "type": "boolean", "default": "false", "description": "可选，关闭默认点击触发图片预览方式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true, "description": "Image容器元素上使用`dImagePreview`指令" }, { "name": "dLoading", "attrList": [{ "name": "loading", "type": "LoadingType", "default": "--", "description": "可选，控制loading状态", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "message", "type": "string", "default": "--", "description": "可选，loading时的提示信息", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "loadingTemplateRef", "type": "TemplateRef<any>", "default": "--", "description": "可选，自定义loading模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "backdrop", "type": "boolean", "default": "--", "description": "可选，loading时是否显示遮罩", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showLoading", "type": "boolean", "default": "--", "description": "可选，手动启动和关闭loading状态,与loading参数不能同时使用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "positionType", "type": "string", "default": "relative", "description": "可选，指定dLoading宿主元素的定位类型,取值与cssposition属性一致", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "view", "type": "{top?:string,left?:string}", "default": "{top:50%,left:50%}", "description": "可选，调整loading的显示位置，相对于宿主元素的顶部距离与左侧距离", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true, "description": "提示用户页面正在执行指令，需要等待。", "tmw": "当执行指令时间较长（需要数秒以上）时，向用户展示正在执行的状态。", "cnName": "加载提示" }, { "name": "d-input-number", "attrList": [{ "name": "max", "type": "number", "default": "100", "description": "可选，最大值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "min", "type": "number", "default": "0", "description": "可选，最小值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "step", "type": "number", "default": "1", "description": "可选，步进值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，禁止输入态开关", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "size", "type": "string", "default": "", "description": "可选，组件大小", "attrType": "ATTR", "isNecessary": false, "valueSet": ["", "sm", "lg"], "isEvent": false }, { "name": "ngModel", "type": "number", "default": "--", "description": "可选，组件的值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "decimalLimit", "type": "number", "default": "--", "description": "可选，限制小数点后的位数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "autoFocus", "type": "boolean", "default": "false", "description": "可选，自动获取焦点", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "allowEmpty", "type": "boolean", "default": "false", "description": "可选，是否允许值为空", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholder", "type": "string", "default": "--", "description": "可选，要显示的placeholder", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxLength", "type": "number", "default": "0", "description": "可选，限制最大输入的长度，0为不限制", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "reg", "type": "string", "default": "--", "description": "用于限制输入的正则或正则字符串", "attrType": "ATTR", "isNecessary": false, "valueSet": ["RegExp", "string"], "isEvent": false }, { "name": "whileValueChanging", "type": ["EventEmitter<number>"], "description": "用户使用键盘输入时发出的事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "afterValueChanged", "type": ["EventEmitter<number>"], "description": "组件值变化时发出的事件，使用ngModelChange来监听值的变化", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "通过鼠标或键盘，输入范围内的数值", "tmw": "当需要获取标准数值时。", "cnName": "数字输入框" }, { "name": "dMoveable", "attrList": [{ "name": "dMoveable", "type": "boolean", "default": "false", "description": "可选，是否启用拖动移动功能", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "handle", "type": "HTMLElement", "default": "--", "description": "可选，可以拖动的元素", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "moveEl", "type": "HTMLElement", "default": "--", "description": "可选，被拖动的区块，默认为使用dMoveable指令的元素", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true }, { "name": "d-panel", "attrList": [{ "name": "type", "type": "string", "default": "default", "description": "可选，面板的类型", "attrType": "ATTR", "isNecessary": false, "valueSet": ["default", "primary", "success", "danger", "warning", "info"], "isEvent": false }, { "name": "heading", "type": "string", "default": "--", "description": "可选，面板的头部标题", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "cssClass", "type": "string", "default": "--", "description": "可选，自定义class名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isCollapsed", "type": "boolean", "default": "false", "description": "可选，是否展开", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "toggle", "type": ["EventEmitter<boolean>"], "description": "可选，点击面板时的回调，返回当前面板的展开状态", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "内容面板，用于内容分组。", "tmw": "当页面内容需要进行分组显示时使用，一般包含头部、内容区域、底部是哪个部分。", "cnName": "面板" }, { "name": "d-popover", "attrList": [{ "name": "content", "type": "string", "default": "--", "description": "必选，弹出框的显示内容或模板引用", "attrType": "ATTR", "isNecessary": true, "valueSet": ["string", "HTMLElement", "TemplateRef"], "isEvent": false }, { "name": "visible", "type": "boolean", "default": "false", "description": "可选，弹框的初始化弹出状态", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "trigger", "type": "string", "default": "click", "description": "弹框触发方式", "attrType": "ATTR", "isNecessary": false, "valueSet": ["hover", "click"], "isEvent": false }, { "name": "controlled", "type": "boolean", "default": "false", "description": "可选，是否通过trigger方式触发弹框", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "position", "type": "string", "default": "top", "description": "可选，内容弹出方向", "attrType": "ATTR", "isNecessary": false, "valueSet": ["top", "right", "bottom", "left"], "isEvent": false }, { "name": "popType", "type": "string", "default": "default", "description": "可选，弹出框类型，样式不同", "attrType": "ATTR", "isNecessary": false, "valueSet": ["success", "error", "warning", "info", "default"], "isEvent": false }, { "name": "showAnimate", "type": "boolean", "default": "false", "description": "可选，是否显示动画", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "appendToBody", "type": "boolean", "default": "true", "description": "可选，默认为true，仅当popover绑定元素外层宽高不够时，overflow为hidden，popover的弹出框不会被一并隐藏掉。", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "zIndex", "type": "number", "default": "1060", "description": "可选，z-index值，用于手动控制层高", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "scrollElement", "type": "Element", "default": "window", "description": "可选，在这里默认是window,只有当页面的滚动不在window上且appendToBody的属性为true时候才需要传值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "hoverToContent", "type": "boolean", "default": "false", "description": "可选，是否允许鼠标从宿主移动到内容上，仅需要在trigger为hover的时候设置", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": false, "description": "简单的文字提示气泡框。popover用来通知用户非关键性问题或提示某控件处于某特殊情况。", "tmw": "单击控件则显示提示，单击空白处提示消失，气泡浮层不承载复杂文本和操作。", "cnName": "悬浮提示" }, { "name": "d-progress", "attrList": [{ "name": "percentage", "type": "number", "default": "0", "description": "可选，进度条的值最大为100", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "percentageText", "type": "string", "default": "--", "description": "可选，进度条当前值的文字说明比如：30%!!!4/5", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "barbgcolor", "type": "string", "default": "#5170ff", "description": "可选，进度条的颜色显示，默认为天蓝色", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "height", "type": "string", "default": "20px", "description": "可选，进度条的高度值，默认值为20px", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isCircle", "type": "boolean", "default": "false", "description": "可选，显示进度条是否为圈形", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "strokeWidth", "type": "number", "default": "6", "description": "可选，设置圈形进度条宽度，单位是进度条与画布宽度的百分比", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": false, "description": "进度条，用来展示操作的当前进度。", "tmw": "1、当操作需要较长的时间时，向用户展示操作进度。              2、当操作需要打断现有界面或后台运行，需要较长时间时。              3、当需要显示一个操作完成的百分比或已完成的步骤/总步骤时。", "cnName": "进度条" }, { "name": "d-rate", "attrList": [{ "name": "read", "type": "boolean", "default": "false", "description": "可选，设置是否为只读模式，只读模式无法交互", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "count", "type": "number", "default": "5", "description": "可选，设置总等级数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "type", "type": "string", "default": "--", "description": "可选，设置当前评分的类型，不同类型对应不同颜色", "attrType": "ATTR", "isNecessary": false, "valueSet": ["success", "warning", "error"], "isEvent": false }, { "name": "color", "type": "string", "default": "--", "description": "可选，星星颜色", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "icon", "type": "string", "default": "--", "description": "可选，评分图标的样式，只支持devUI图标库中所有图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "character", "type": "string", "default": "--", "description": "可选，评分图标的样式，icon与character只能设置其中一个", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": false, "description": "等级评估", "tmw": "用户对一个产品进行评分时可以使用，有两种模式，只读模式和动态评分模式", "cnName": "等级评估" }, { "name": "d-radio-group", "attrList": [{ "name": "name", "type": "string", "default": "--", "description": "必选，单选项名称", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "values", "type": "array", "default": "--", "description": "必选，单选数据组", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，是否禁用该单选项组", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "change", "type": ["EventEmitter<any>"], "description": "单选项值改变时触发，返回选中的值", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false }, { "name": "d-radio", "attrList": [{ "name": "name", "type": "string", "default": "--", "description": "必选，单选项名称", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "value", "type": "string", "default": "--", "description": "必选，单选项值", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，是否禁用该单选项", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "ngModelChange", "type": ["EventEmitter<any>"], "description": "Form事件，单选项值改变时触发，返回选中的值", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "单选框。", "tmw": "用户要从一个数据集中选择单个选项，且能并排查看所有可选项，选项数量在2~7之间，建议使用单选按钮。", "cnName": "单选框" }, { "name": "d-search", "attrList": [{ "name": "size", "type": "string", "default": "", "description": "可选，搜索框尺寸，有三种选择lg、、sm", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholder", "type": "string", "default": "PleaseInputkeywords", "description": "可选，输入框的placeholder", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxLength", "type": "number", "default": "Number.MAX_SAFE_INTEGER", "description": "可选，输入框的max-length", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "delay", "type": "number", "default": "300", "description": "可选，debounceTime的延迟", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，输入框是否可用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isKeyupSearch", "type": "boolean", "default": "false", "description": "可选，是否支持输入值立即出发searchFn", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "searchFn", "type": ["string"], "description": "回车或点击搜索按钮触发的回调函数，返回文本框输入的值", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "搜索框。", "tmw": "当用户需要在数据集中搜索所需数据时，输入所需数据的内容（或部分内容），返回所有匹配内容的搜索结果。", "cnName": "搜索框" }, { "name": "d-select", "attrList": [{ "name": "options", "type": "array", "default": "[]", "description": "可选,和searchFn互斥，两者必须有且只有一个。下拉选项资源stringobject", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isSearch", "type": "boolean", "default": "false", "description": "可选,是否支持过滤搜索", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "scrollHight", "type": "string", "default": "300px", "description": "可选,下拉菜单高度,建议使用px作为高度单位", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "hightLightItemClass", "type": "string", "default": "bg-grey", "description": "可选,下拉高亮css", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "filterKey", "type": "string", "default": "--", "description": "当传入资源options类型为object时,必选,针对传入资源options的每项对应字段做过滤操作", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "multiple", "type": "boolean", "default": "false", "description": "可选,是否支持多选", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isSelectAll", "type": "boolean", "default": "false", "description": "可选,是否显示全选", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "readonly", "type": "boolean", "default": "true", "description": "可选,是否可以输入", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "size", "type": "string", "default": "", "description": "可选,下拉选框尺寸,有三种选择lg,,sm", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选,是否禁用下拉框", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholder", "type": "string", "default": "PleaseInputkeywords", "description": "可选,输入框的placeholder", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "searchFn", "type": "function", "default": "--", "description": "可选,搜索函数,当需要自定义下拉选择过滤规则时可以使用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "valueParser", "type": "function", "default": "--", "description": "可选,决定选择框文字如何显示,默认显示filterKey字段或者本身的值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "formatter", "type": "function", "default": "--", "description": "可选,决定下拉框每项文字如何显示,默认显示filterKey字段或者本身的值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "direction", "type": "up,down,auto", "default": "", "description": "可选,下拉选框尺寸,有三种选择up,down,auto", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "overview", "type": "string", "default": "border", "description": "可选,决定选择框样式显示,默认有边框border,underlined", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "enableLazyLoad", "type": "boolean", "default": "false", "description": "可选,是否支持数据懒加载，用于滚动到底部时动态请求数据", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig", "type": "object", "default": "N/A", "description": "可选,可输入配置项参考示例", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig.labelization", "type": "object", "default": "N/A", "description": "可选,标签化多选结果的配置项,参考示例", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig.labelization.enable", "type": "boolean", "default": "false", "description": "可选下的必填参数,是否启用标签化,使用必须置为true,参考示例", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig.labelization.overflow", "type": "string", "default": "", "description": "可选,多个标签超出容器时候的预处理行为,值为normal!!!scroll-y!!!multiple-line!!!string对应默认隐藏,纵向滚动、自动变多行和自定义类", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig.labelization.containnerMaxHeight", "type": "string", "default": "1.8em", "description": "可选,限制容器最高高度。多行模式下默认不限制高度,单行模式下默认为1.8em", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig.labelization.labelMaxWidth", "type": "string", "default": "100%", "description": "可选下,限制标签宽度,默认值为行宽的100%", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig.selectedItemWithTemplate", "type": "object", "default": "N/A", "description": "可选,在单选情况下,显示选项使用了template的情况下,顶部选中的内容是否也以template展示,参考示例", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "extraConfig.selectedItemWithTemplate.enable", "type": "boolean", "default": "--", "description": "可选下的必填参数,是否启用选中项使用模板,使用必须置为true,参考示例", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "optionDisabledKey", "type": "string", "default": "", "description": "可选,禁用单个选项;当传入资源options类型为objectObj,比如设置为disabled,则当对象的disable属性为true时,该选项将禁用;当设置为时不禁用单个选项", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "optionImmutableKey", "type": "string", "default": "", "description": "可选,禁用单个选项;当传入资源options类型为objectObj,比如设置为immutable,则当对象的immutable属性为true时,该选项将禁被禁止变更;当设置为时不生效", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "noResultItemTemplate", "type": "TemplateRef", "default": "--", "description": "可选,没有匹配项的展示结果", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "keepMultipleOrder", "type": "string", "default": "user-select", "description": "可选,user-select!!!origin,配置多选的时候是否维持原数组排序还是用户选择的顺序排序,默认是用户顺序", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customViewTemplate", "type": "TemplateRef", "default": "--", "description": "可选,支持自定义区域显示内容定制,可以使用choose来选择某项,choose需要传两个必填参数,第一个为选择的选项,第二个为选项在列表的index值,event参数选填,若不填请自行处理冒泡,详见demo", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customViewDirection", "type": "string", "default": "bottom", "description": "customViewTemplate所处的相对下拉列表的位置", "attrType": "ATTR", "isNecessary": false, "valueSet": ["bottom", "right", "left"], "isEvent": false }, { "name": "appendToBody", "type": "boolean", "default": "false", "description": "可选,true会被附加到body", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "appendToBodyDirections", "type": "string", "default": "[rightDown,leftDown,rightUp,leftUp]", "description": "可选，方向数组优先采用数组里靠前的位置，AppendToBodyDirection和ConnectedPosition请参考dropdown", "attrType": "ATTR", "isNecessary": false, "valueSet": ["Array<AppendToBodyDirection", "ConnectedPosition>"], "isEvent": false }, { "name": "width", "type": "number", "default": "--", "description": "可选,搭配appendToBody使用，设置下拉宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "virtualScroll", "type": "boolean", "default": "false", "description": "可选,是否虚拟滚动，大数据量场景试用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "allowClear", "type": "boolean", "default": "false", "description": "可选,配置是否允许清空选值，仅单选场景适用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "inputItemTemplate", "type": "TemplateRef", "default": "--", "description": "可选参数,自定义模板，若传入，会忽略ContentChild", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "valueChange", "type": ["string", ["EventEmitter<Array<any>", "any>"]], "description": "可选,输出函数,当选中某个选项项后,将会调用此函数,参数为当前选择项的值", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "toggleChange", "type": ["EventEmitter<boolean>"], "description": "可选,输出函数,下拉打开关闭toggle事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "loadMore", "type": ["EventEmitter<{instance:Selectcomponent,event:ScrollEvent}>"], "description": "懒加载触发事件，配合enableLazyLoad使用，使用$event.instance.loadFinish()结束本次加载,event为懒加载监听的滚动事件，参考dLazyLoad", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "下拉选择框。", "tmw": "用户可以从多个选项中选择一项或几项；仅支持用户在下拉选项中选择和搜索系统提供的选项，不支持输入。", "cnName": "下拉选择框" }, { "name": "d-splitter", "attrList": [{ "name": "orientation", "type": "string", "default": "horizontal", "description": "可选，指定Splitter分割方向,可选值vertical!!!horizontal", "attrType": "ATTR", "isNecessary": false, "valueSet": ["vertical", "horizontal"], "isEvent": false }, { "name": "splitBarSize", "type": "string", "default": "2px", "description": "可选，分隔条大小，默认2px", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabledBarSize", "type": "string", "default": "1px", "description": "可选，pane设置不可调整宽度时生效", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": false, "description": "Splitter将页面拆分为多个部分，并允许用户控制页面布局。", "tmw": "需要动态调整不同页面布局区域大小的时候选择使用。", "cnName": "分割器" }, { "name": "d-splitter-pane", "attrList": [{ "name": "size", "type": "string", "default": "--", "description": "可选，指定pane宽度，设置像素值或者百分比", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "minSize", "type": "string", "default": "--", "description": "可选，指定pane最小宽度，设置像素值或者百分比", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxSize", "type": "string", "default": "--", "description": "可选，指定pane最大宽度，设置像素值或者百分比", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "resizable", "type": "boolean", "default": "true", "description": "可选，指定pane是否可调整大小，会影响相邻pane", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "collapsible", "type": "boolean", "default": "false", "description": "可选，指定pane是否可折叠收起", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "collapsed", "type": "boolean", "default": "false", "description": "可选，指定pane初始化是否收起，配合collapsible使用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "collapseDirection", "type": "string", "default": "both", "description": "可选，指定非边缘pane收起方向，配合collapsible使用", "attrType": "ATTR", "isNecessary": false, "valueSet": ["before", "after", "both"], "isEvent": false }, { "name": "sizeChange", "type": ["EventEmitter<string>"], "description": "大小变动时，返回改变后的值,像素值或者百分比", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "collapsedChange", "type": ["EventEmitter<boolean>"], "description": "折叠和展开时，返回当前pane是否折叠", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false }, { "name": "d-slider", "attrList": [{ "name": "min", "type": "number", "default": "0", "description": "可选，滑动输入条的最小值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "max", "type": "number", "default": "100", "description": "可选，滑动输入条的最大值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "step", "type": "number", "default": "1", "description": "可选，滑动输入条的步长，取值必须大于等于0，且必须可被(max-min)整除", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，值为true时禁止用户输入", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "tipsRenderer", "type": "string", "default": "(value)=>String(value)", "description": "可选，渲染Popover内容的函数，传入null时不显示Popover", "attrType": "ATTR", "isNecessary": false, "valueSet": ["function", "null"], "isEvent": false }], "directiveFlag": false, "description": "滑动输入条可以更直观地展示当前值和可选范围。", "tmw": "当用户需要在数值区间内进行选择时使用。", "cnName": "滑动输入条" }, { "name": "d-status", "attrList": [{ "name": "type", "type": "string", "default": "invalid", "description": "必选，表示类型", "attrType": "ATTR", "isNecessary": true, "valueSet": ["invalid", "running", "waiting", "important", "less-important", "error"], "isEvent": false }], "directiveFlag": false, "description": "状态传达了组件或者页面可互动元素交互的结果。", "tmw": "表示一个任务的执行结果时使用。", "cnName": "状态" }, { "name": "d-sticky", "attrList": [{ "name": "zIndex", "type": "number", "default": "--", "description": "可选，指定包裹层的z-index，用于浮动的时候控制z轴的叠放", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "container", "type": "HTMLElement", "default": "父容器", "description": "可选，触发的容器，可不同于父容器", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "view", "type": "{top?:number,bottom?:number}", "default": "{top:0,bottom:0}", "description": "可选，用于可视区域的调整，比如顶部有固定位置的头部等，数值对应被遮挡的顶部或底部的高度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "scrollTarget", "type": "HTMLElement", "default": "document.documentElement", "description": "可选，设置要发生滚动的容器，一般为滚动条所在容器，为主页面的滚动条时候可以不设置", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "statusChange", "type": ["EventEmitter<StickyStatus>"], "description": "可选，状态变化的时候触发，值为变化后的状态值，normal表示处于正常状态，follow表示处于跟着页面滚动固定位置状态，stay表示横向滚动时候的跟随固定状态,remain表示被容器托起处于容器底部跟着容器走的状态", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "页面内容固定在可视区域。", "tmw": "当用户在滚动屏幕时，需要某个区域内容在段落或者浏览器可视区域可见时。", "cnName": "便贴" }, { "name": "d-tabs", "attrList": [{ "name": "type", "type": "string", "default": "tabs", "description": "可选，选项卡组的类型", "attrType": "ATTR", "isNecessary": false, "valueSet": ["tabs", "pills", "options"], "isEvent": false }, { "name": "showContent", "type": "boolean", "default": "true", "description": "可选，是否显示选项卡对应的内容", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "activeTab", "type": "string", "default": "--", "description": "可选，当前激活的选项卡，值为选项卡的id", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "cssClass", "type": "string", "default": "--", "description": "可选，自定义选项卡组的css类", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customWidth", "type": "string", "default": "--", "description": "可选，自定义选项卡的宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "vertical", "type": "boolean", "default": "false", "description": "可选，是否垂直显示", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "beforeChange", "type": "string", "default": "--", "description": "tab切换前的回调函数,返回boolean类型，返回false可以阻止tab的切换", "attrType": "ATTR", "isNecessary": false, "valueSet": ["function", "Promise", "Observable"], "isEvent": false }, { "name": "activeTabChange", "type": ["string", ["EventEmitter<number", "string>"]], "description": "可选，选项卡切换的回调函数，返回当前激活选项卡的id", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "选项卡切换组件。", "tmw": "用户需要通过平级的区域将大块内容进行收纳和展现，保持界面整洁。", "cnName": "选项卡切换" }, { "name": "d-tab", "attrList": [{ "name": "tabId", "type": "string", "default": "--", "description": "可选，选项卡的id值,需要设置为唯一值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "id", "type": "string", "default": "--", "description": "可选，一般和tabId一致", "attrType": "ATTR", "isNecessary": false, "valueSet": ["number", "string"], "isEvent": false }, { "name": "title", "type": "string", "default": "--", "description": "可选，选项卡的标题", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，选项卡是否不可用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": false }, { "name": "d-tags-input", "attrList": [{ "name": "tags", "type": "Array", "default": "[]", "description": "必选，记录输入的标签和选择的标签列表", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "displayProperty", "type": "string", "default": "name", "description": "可数，列表项使用的属性名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholder", "type": "boolean", "default": "", "description": "可选，输入框的placeholder", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "minLength", "type": "number", "default": "3", "description": "可选，输入标签内容的最小长度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxLength", "type": "number", "default": "Number.MAX_SAFE_INTEGER", "description": "可选，输入标签内容的最大长度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxTags", "type": "number", "default": "Number.MAX_SAFE_INTEGER", "description": "可选，可输入标签的最大个数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "caseSensitivity", "type": "boolean", "default": "false", "description": "可选，大小写敏感，默认忽略大小写", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "spellcheck", "type": "boolean", "default": "true", "description": "可选，input输入框的spellcheck", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isAddBySpace", "type": "boolean", "default": "true", "description": "可选，是否支持空格键输入标签", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "suggestionList", "type": "Array", "default": "[]", "description": "可选，下拉选项，默认可选择的标签列表", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "checkBeforeAdd", "type": "string", "default": "无", "description": "可选，自定义校验函数，类型为(newTag:string)=>boolean或者Promise<boolean>或者Observable<boolean>", "attrType": "ATTR", "isNecessary": false, "valueSet": ["Function", "Promise", "Observable"], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，disabled灰化状态", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "valueChange", "type": ["EventEmitter<any>"], "description": "当选中某个选项项后，将会调用此函数，参数为当前选择项的值。如果需要获取所有选择状态的值，请使用(ngModelChange)", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "用于输入多个标签。", "tmw": "用户需要输入多个标签时。", "cnName": "标签输入" }, { "name": "d-tag", "attrList": [{ "name": "tag", "type": "string", "default": "--", "description": "必选，记录输入的标签和选择的标签", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "titleContent", "type": "string", "default": "--", "description": "可选，设置鼠标悬浮时title的显示内容", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "labelStyle", "type": "string", "default": "", "description": "可选，标签的样式可使用blue-w98、green-w98、yellow-w98、orange-w98、pink-w98、purple-w98、turquoise-w98,olivine-w98,或可传入自定义class", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "deletable", "type": "boolean", "default": "false", "description": "可选，设置标签是否可删除", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "customViewTemplate", "type": "TemplateRef", "default": "--", "description": "可选，自定义标签模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "tagDelete", "type": ["EventEmitter<{tag:tag}>"], "description": "删除tag的时候触发的事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false }, { "name": "d-tags", "attrList": [{ "name": "tags", "type": "Array", "default": "[]", "description": "必选，记录输入的标签和选择的标签", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "displayProperty", "type": "string", "default": "", "description": "可选，设置属性名，使得标签名为该属性对应的值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "deletable", "type": "boolean", "default": "false", "description": "可选，设置标签是否可删除", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "titleProperty", "type": "string", "default": "", "description": "可选，设置属性名，鼠标悬浮时title显示的值", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "tagDelete", "type": ["EventEmitter<{tag:tag,index:index}>"], "description": "删除某个tag的时候触发的事件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "标签展示组件。", "tmw": "用户需要展示多个标签时。", "cnName": "标签" }, { "name": "dTextInput", "attrList": [{ "name": "id", "type": "string", "default": "--", "description": "可选，文本框id", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholder", "type": "string", "default": "--", "description": "可选，文本框placeholder", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，文本框是否被禁用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "error", "type": "boolean", "default": "false", "description": "可选，文本框是否出现输入错误", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true }, { "name": "d-toast", "attrList": [{ "name": "value", "type": "Array<Message>", "default": "--", "description": "必选，消息内容数组，Message对象定义见下文", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "life", "type": "number", "default": "5000/10000", "description": "可选，超时时间，超时后自动消失，鼠标悬停可以阻止消失，单位毫秒，成功、提示类默认为5000毫秒，错误、警告类默认为10000毫秒", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "sticky", "type": "boolean", "default": "false", "description": "可选，是否常驻，默认自动关闭", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "style", "type": "string", "default": "--", "description": "可选，样式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "styleClass", "type": "string", "default": "--", "description": "可选，类名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "closeEvent", "type": ["EventEmitter<any>"], "description": "可选，返回被手动关闭或自动消失的单条消息内容", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "valueChange", "type": ["EventEmitter<Message[]>"], "description": "可选，返回变化（手动关闭或自动消失）后剩余消息内容数组，Message对象定义见下文", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "全局信息提示组件。", "tmw": "当需要向用户全局展示提示信息时使用，显示数秒后消失。", "cnName": "全局通知" }, { "name": "dText", "attrList": [{ "name": "id", "type": "string", "default": "--", "description": "可选，文本框id", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholder", "type": "string", "default": "--", "description": "可选，文本框placeholder", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，文本框是否被禁用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "error", "type": "boolean", "default": "false", "description": "可选，文本框是否出现输入错误", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "resize", "type": "string", "default": "none", "description": "可选，文本框是否可调整大小，可选项：不可调整，水平调整，垂直调整，自由调整，默认继承", "attrType": "ATTR", "isNecessary": false, "valueSet": ["none", "vertical", "horizontal", "both", "inherit"], "isEvent": false }], "directiveFlag": true }, { "name": "d-pagination", "attrList": [{ "name": "pageSize", "type": "number", "default": "10", "description": "可选，每页显示最大条目数量", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "total", "type": "number", "default": "0", "description": "可选，显示的总条目数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "pageSizeOptions", "type": "number[]", "default": "10", "description": "可选，分页每页最大条目数量的下拉框的数据源，默认有四种选择5,10,20,50", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "pageIndex", "type": "number", "default": "1", "description": "可选，初始化页码", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "maxItems", "type": "number", "default": "10", "description": "可选，分页最多显示几个按钮", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "preLink", "type": "string", "default": "--", "description": "可选，pre按钮文字,默认设置为左箭头图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "nextLink", "type": "string", "default": "--", "description": "可选，next按钮文字,默认设置为右箭头图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "size", "type": "number", "default": "", "description": "可选，分页组件尺寸，有三种选择lg,,sm,分别代表大，中，小", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "canJumpPage", "type": "boolean", "default": "true", "description": "可选，是否显示分页输入跳转", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "canChangePageSize", "type": "boolean", "default": "false", "description": "可选，是否显示用于选择更改分页每页最大条目数量的下拉框", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "canViewTotal", "type": "boolean", "default": "true", "description": "可选，是否显示总条目", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "totalItemText", "type": "string", "default": "所有条目", "description": "可选，总条目文本", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "goToText", "type": "string", "default": "跳至", "description": "可选，跳转文本", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showJumpButton", "type": "boolean", "default": "false", "description": "可选，是否显示跳转按钮", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showTruePageIndex", "type": "boolean", "default": "false", "description": "可选，页码超出分页范围时候也显示当前页码的开关", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "selectDirection", "type": "string", "default": "auto", "description": "可选，下拉菜单默认方向,有三种选择auto,up,down", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "lite", "type": "boolean", "default": "false", "description": "可选，是否切换为极简模式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showPageSelector", "type": "boolean", "default": "true", "description": "可选，极简模式下是否显示页码下拉", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "haveConfigMenu", "type": "boolean", "default": "false", "description": "可选，极简模式下是否显示配置", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "pageIndexChange", "type": ["EventEmitter<number>"], "description": "可选，页码变化的回调,返回当前页码值", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "pageSizeChange", "type": ["EventEmitter<number>"], "description": "可选，每页最大条目数量变更时的回调，返回当前每页显示条目数", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "采用分页的形式分隔长列表，每次只加载一个页面。", "tmw": "当加载/渲染所有数据将花费很多时间时，可以切换页码浏览数据。", "cnName": "分页" }, { "name": "d-toggle", "attrList": [{ "name": "size", "type": "string", "default": "small", "description": "可选，开关尺寸大小", "attrType": "ATTR", "isNecessary": false, "valueSet": ["small", "medium", "large"], "isEvent": false }, { "name": "color", "type": "string", "default": "--", "description": "可选，开关打开时的自定义颜色", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "checked", "type": "boolean", "default": "false", "description": "可选，开关是否打开，默认关闭", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "[ngModel]", "type": "boolean", "default": "false", "description": "可选，指定当前是否打开，可双向绑定", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，是否禁用开关", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "beforeChange", "type": "string", "default": "--", "description": "可选，开关变化前的回调函数,返回boolean类型，返回false可以阻止开关的变化", "attrType": "ATTR", "isNecessary": false, "valueSet": ["Function", "Promise", "Observable"], "isEvent": false }, { "name": "change", "type": ["EventEmitter<boolean>"], "description": "可选,开关打开返回true,关闭返回false", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "开/关切换组件", "tmw": "当两种状态需要来回切换控制时，比如启用/禁用。", "cnName": "开关" }, { "name": "dTooltip", "attrList": [{ "name": "content", "type": "string", "default": "--", "description": "必选，tooltip显示内容", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "position", "type": "string", "default": "bottom", "description": "可选，tooltip显示位置", "attrType": "ATTR", "isNecessary": false, "valueSet": ["left", "right", "top", "bottom"], "isEvent": false }, { "name": "showAnimate", "type": "boolean", "default": "false", "description": "可选，是否显示划出动画", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }], "directiveFlag": true, "description": "文字提示组件", "tmw": "用户鼠标移动到文字上，需要进一步的提示时使用。", "cnName": "提示" }, { "name": "d-tree-select", "attrList": [{ "name": "placeholder", "type": "string", "default": "--", "description": "可选，占位字符串", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选，禁止输入态", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "expandTree", "type": "boolean", "default": "false", "description": "可选，是否自动展开树", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "multiple", "type": "boolean", "default": "false", "description": "可选，多选开关", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "treeNodeIdKey", "type": "string", "default": "id", "description": "可选，id键值名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "treeNodeChildrenKey", "type": "string", "default": "children", "description": "可选，children子节点键值名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabledKey", "type": "string", "default": "disabled", "description": "可选，disabled节点禁选键值名", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "leafOnly", "type": "boolean", "default": "false", "description": "可选，仅叶节点可选开关", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "delimiter", "type": "string", "default": ",", "description": "可选，选中结果分隔符（用于多选）", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "iconParentOpen", "type": "string", "default": "DefaultIcons.iconParentOpen", "description": "可选，树节点打开时图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "iconParentClose", "type": "string", "default": "DefaultIcons.iconParentClose", "description": "可选，树节点关闭时图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "iconLeaf", "type": "string", "default": "DefaultIcons.iconLeaf", "description": "可选，节点图标", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "closeOnNodeSelected", "type": "boolean", "default": "true", "description": "可选，选中节点时关闭下拉框的开关（仅用于单选）", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "width", "type": "string", "default": "--", "description": "可选，下拉框宽度", "attrType": "ATTR", "isNecessary": false, "valueSet": ["auto", "~px", "~%"], "isEvent": false }, { "name": "searchable", "type": "boolean", "default": "false", "description": "可选，是否可搜索树", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "readyEvent", "type": "function", "default": "(treeSelect:TreeSelectComponent)=>{}", "description": "可选，当组件初始化完成时可调用的钩子函数", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "appendTo", "type": "string", "default": "--", "description": "可选，将下拉框附着到输入值的DOM选择器节点中，值为空时下拉框在此组件内", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "allowUnselect", "type": "boolean", "default": "true", "description": "可选，是否允许单选模式下反选已选中的项目", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "iconTemplatePosition", "type": "string", "default": "before-checkbox", "description": "可选，自定义template的位置", "attrType": "ATTR", "isNecessary": false, "valueSet": ["before-checkbox", "after-checkbox"], "isEvent": false }, { "name": "allowClear", "type": "boolean", "default": "false", "description": "可选，是否允许单选模式下点击输入框上的清除按钮来清空已选中的项目。allowUnselect必须为true，否则将破坏体验一致性规则。", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "valueChanged", "type": ["EventEmitter"], "description": "选择节点时触发的变化，参数为数组或对象", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "树形选择框", "tmw": "文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用树控件可以完整展现其中的层级关系，并具有展开收起选择等交互功能。", "cnName": "树形选择框" }, { "name": "d-transfer", "attrList": [{ "name": "sourceOption", "type": "array", "default": "[]", "description": "可选参数，穿梭框源数据", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "targetOption", "type": "array", "default": "[]", "description": "可选参数，穿梭框目标数据", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "titles", "type": "array", "default": "[]", "description": "可选参数，穿梭框标题", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "height", "type": "string", "default": "320px", "description": "可选参数，穿梭框高度", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isSearch", "type": "number", "default": "false", "description": "可选参数，是否可以搜索", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isSourceDroppable", "type": "boolean", "default": "false", "description": "可选参数，源是否可以拖拽", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "isTargetDroppable", "type": "boolean", "default": "false", "description": "可选参数，目标是否可以拖拽", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "disabled", "type": "boolean", "default": "false", "description": "可选参数穿梭框禁止使用", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "transferToSource", "type": ["返回穿梭框源和目标数据"], "description": "当点击右穿梭时，返回源和目标数据；", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "transferToTarget", "type": ["返回穿梭框源和目标数据"], "description": "当点击左穿梭时，返回源和目标数据；", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "双栏穿梭选择框", "tmw": "需要在多个可选项中进行多选时。穿梭选择框可用只管的方式在两栏中移动数据，完成选择行为。其中左边一栏为source，右边一栏为target。最终返回两栏的数据，提供给开发者使用", "cnName": "穿梭框" }, { "name": "d-quadrant-diagram", "attrList": [{ "name": "view", "type": "IViewConfigs", "default": "{height:900,width:950}", "description": "可选，指定象限图所占宽高，由于需要计算坐标轴及象限区域，值必须为具体数字，若需要根据容器大小变更，建议使用document相关方法计算出实际值后传入", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "axisConfigs", "type": "IAxisConfigs", "default": "参考下方DEFAULT_AXIS_CONFIGS", "description": "可选，设置坐标轴相关属性，具体配置参数意义参考下方IAxisConfigs", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "showQuadrants", "type": "boolean", "default": "true", "description": "可选，是否显示四个象限区域", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "quadrantConfigs", "type": "Array<IQuadrantConfigs>", "default": "参考下方DEFAULT_QUADRANT_CONFIGS", "description": "可选，设置四个象限区域的相关属性，数组中数据的顺序分别代表第一象限、第二象限、第三象限、第四象限，具体配置参数意义参考下方IQuadrantConfigs", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "labelData", "type": "Array<ILabelDataConfigs>", "default": "[]", "description": "可选，指定警告提示的样式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "currentLabelSize", "type": "labelSize", "default": "large", "description": "可选，设置当前的标签尺寸，small表现为点，normal表现为含有标题的标签，large表现为含有标题和进度条的标签", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "smallLabelTemplate", "type": "TemplateRef<any>", "default": "--", "description": "可选，自定义currentLabelSize=small时的标签样式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "normalLabelTemplate", "type": "TemplateRef<any>", "default": "--", "description": "可选，自定义currentLabelSize=normal时的标签样式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "largeLabelTemplate", "type": "TemplateRef<any>", "default": "--", "description": "可选，自定义currentLabelSize=large时的标签样式", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "diagramId", "type": "string", "default": "devui-quadrant-diagram-+当前组件顺序", "description": "可选，为象限图组件添加id属性，用于区分不同实例", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dropScope", "type": "string", "default": "default", "description": "可选，限制drop的位置，必须匹配对应的dragScope，详情参考DragDropAPI", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "dropEvent", "type": ["EventEmitter<any>"], "description": "可选，拖拽放置时的触发事件，返回值{dragData:e.dragData,xAxisValue:xAxisValue,yAxisValue:yAxisValue},分别对应当前标签数据，标签放置的x值，标签放置的y值", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "zoomOutEvent", "type": ["EventEmitter<any>"], "description": "可选，点击缩小按钮的触发事件，返回值为当前的标签尺寸", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "zoomInEvent", "type": ["EventEmitter<any>"], "description": "可选，点击放大按钮的触发事件，返回值为当前的标签尺寸", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "fullScreenEvent", "type": ["EventEmitter<any>"], "description": "可选，点击全屏按钮的触发事件，返回值为当前的是否是全屏状态", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "象限图，根据需求对事务进行区域划分与价值排序", "tmw": "可用于管理事务的优先级", "cnName": "象限图" }, { "name": "d-single-upload", "attrList": [{ "name": "fileOptions", "type": "IFileOptions，参考下方options", "default": "--", "description": "必选，待上传文件配置", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "filePath", "type": "string", "default": "--", "description": "必选，文件路径", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "uploadOptions", "type": "IUploadOptions，参考下方options", "default": "--", "description": "必选，上传配置", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "autoUpload", "type": "boolean", "default": "false", "description": "可选，是否自动上传", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholderText", "type": "string", "default": "选择文件", "description": "可选，上传输入框中的Placeholder文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "confirmText", "type": "string", "default": "确定", "description": "可选，错误信息弹出框中确认按钮文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "preloadFilesRef", "type": "TemplateRef<any>", "default": "--", "description": "可选，用于创建自定义已选择文件列表模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "uploadText", "type": "string", "default": "上传", "description": "可选，上传按钮文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "uploadedFiles", "type": "Array<Object>", "default": "[]", "description": "可选，获取已上传的文件列表", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "uploadedFilesRef", "type": "TemplateRef<any>", "default": "--", "description": "可选，用于创建自定义已上传文件列表模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "withoutBtn", "type": "boolean", "default": "false", "description": "可选，是否舍弃按钮", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "enableDrop", "type": "boolean", "default": "false", "description": "可选，是否支持拖拽", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "beforeUpload", "type": ["boolean、Promise<boolean>、Observable<boolean>"], "description": "上传前的回调，通过返回trueorfalse,控制文件是否上传,参数为文件信息及上传配置", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "fileOver", "type": ["EventEmitter<any>"], "description": "支持拖拽上传时，文件移动到可拖放区域触发事件,可拖动的元素移出放置目标时返回false，元素正在拖动到放置目标时返回true", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "fileDrop", "type": ["EventEmitter<any>"], "description": "支持拖拽上传时，当前拖拽的文件列表回调，单文件上传默认返回第一个文件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "successEvent", "type": ["EventEmitter<any>"], "description": "上传成功时的回调函数,返回文件及xhr的响应信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "errorEvent", "type": ["EventEmitter<any>"], "description": "上传错误时的回调函数，返回上传失败的错误信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "deleteUploadedFileEvent", "type": ["EventEmitter<any>"], "description": "删除上传文件的回调函数，返回删除文件的路径信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "文件上传组件", "tmw": "当需要将文件上传到后端服务器时。", "cnName": "上传" }, { "name": "d-multiple-upload", "attrList": [{ "name": "fileOptions", "type": "IFileOptions，参考下方options", "default": "--", "description": "必选，待上传文件配置", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "filePath", "type": "string", "default": "--", "description": "必选，文件路径", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "uploadOptions", "type": "IUploadOptions，参考下方options", "default": "--", "description": "必选，上传配置", "attrType": "ATTR", "isNecessary": true, "valueSet": [], "isEvent": false }, { "name": "autoUpload", "type": "boolean", "default": "false", "description": "可选，是否自动上传", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "placeholderText", "type": "string", "default": "选择多个文件", "description": "可选，上传输入框中的Placeholder文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "confirmText", "type": "string", "default": "确定", "description": "可选，错误信息弹出框中确认按钮文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "preloadFilesRef", "type": "TemplateRef<any>", "default": "--", "description": "可选，用于创建自定义已选择文件列表模板", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "uploadText", "type": "string", "default": "上传", "description": "可选，上传按钮文字", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "uploadedFiles", "type": "Array<Object>", "default": "[]", "description": "可选，获取已上传的文件列表", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "uploadedFilesRef", "type": "TemplateRef<any>", "default": "--", "description": "可选，用于创建自定义已上传文件列表模版", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "withoutBtn", "type": "boolean", "default": "false", "description": "可选，是否舍弃按钮", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "enableDrop", "type": "boolean", "default": "false", "description": "可选，是否支持拖拽", "attrType": "ATTR", "isNecessary": false, "valueSet": [], "isEvent": false }, { "name": "beforeUpload", "type": ["boolean、Promise<boolean>、Observable<boolean>"], "description": "上传前的回调，通过返回trueorfalse,控制文件是否上传,参数为文件信息及上传配置", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "fileOver", "type": ["EventEmitter<any>"], "description": "支持拖拽上传时，文件移动到可拖放区域触发事件,可拖动的元素移出放置目标时返回false，元素正在拖动到放置目标时返回true", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "fileDrop", "type": ["EventEmitter<any>"], "description": "支持拖拽上传时，当前拖拽的文件列表回调，单文件上传默认返回第一个文件", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "successEvent", "type": ["EventEmitter<any>"], "description": "上传成功时的回调函数,返回文件及xhr的响应信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "errorEvent", "type": ["EventEmitter<any>"], "description": "上传错误时的回调函数，返回上传失败的错误信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }, { "name": "deleteUploadedFileEvent", "type": ["EventEmitter<any>"], "description": "删除上传文件的回调函数，返回删除文件的路径信息", "attrType": "Event", "isNecessary": false, "hasvalueSet": true, "isEvent": true }], "directiveFlag": false, "description": "文件上传组件", "tmw": "当需要将文件上传到后端服务器时。", "cnName": "上传" }];
	});

	var Igniter_1 = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	exports.__esModule = true;





	// const info = require('../source/info.js');
	/*
	 * @Author: your name
	 * @Date: 2020-06-05 20:55:45
	 * @LastEditTime: 2020-06-05 22:12:57
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\Host\Igniter.ts
	 */
	var Igniter = /** @class */ (function () {
	    function Igniter() {
	        this.FrameName = type$1.SupportFrameName.Null;
	        this.componentList = [];
	        this.componentToUrl = new Map();
	        this.rootPaths = [];
	    }
	    Igniter.prototype.init = function () {
	    };
	    Igniter.prototype.parseTextDocument = function (textDocument, parseOption) {
	        var _a = server$1.__moduleExports.host.parser.parseTextDocument(textDocument, parseOption), root = _a.root, errors = _a.errors;
	        server$1.__moduleExports.host.snapshotMap.set(textDocument.uri, new Host_1.SnapShot(root, errors, textDocument));
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
	    };
	    Igniter.prototype.ignite = function (path) {
	        var _this = this;
	        var _index = path.indexOf('\\src');
	        var _nodeModulePath = path;
	        try {
	            this.checkProjectFrameworkAndComponentName(_nodeModulePath);
	            server$1.__moduleExports.logger.info("Scanner Done!,\nRootPaths:" + this.rootPaths + "\nParsing Document...");
	            if (this.FrameName !== type$1.SupportFrameName.Null && this.componentList !== [])
	                this.rootPaths.forEach(function (root) {
	                    _this.parseAllDocument(root + 'src');
	                });
	            server$1.__moduleExports.logger.info("Parsing Done! Loading Source...");
	            this.loadSourceTree();
	            server$1.__moduleExports.logger.info('Igniter Done, Extension Start...');
	            server$1.__moduleExports.logger.info("Welcome To DevUIHelper");
	            server$1.__moduleExports.logger.info("Thanks To Zoujie Linruihong Wangyihui and Zhangke");
	            server$1.__moduleExports.logger.info("Thanks To PKU_Huawei class");
	            server$1.__moduleExports.logger.info("This extension was built by yqLiu, enjoy it!");
	        }
	        catch (_a) { }
	        return { frame: this.FrameName, components: this.componentList };
	    };
	    Igniter.prototype.parseAllDocument = function (path) {
	        var _this = this;
	        var pa = [];
	        try {
	            pa = fs.readdirSync(path);
	        }
	        catch (_a) {
	            return;
	        }
	        pa.forEach(function (element) {
	            var info = fs.statSync(path + '\\' + element);
	            if (info.isDirectory()) {
	                // logger.debug(`dir:${path+'\\'+element}`);
	                _this.parseAllDocument(path + '/' + element);
	            }
	        });
	    };
	    Igniter.prototype.checkProjectFrameworkAndComponentName = function (nodeModulesPath) {
	        var _this = this;
	        // let result:IgniterResult ={Frame:SupportFrameName.Null,Components:[]};
	        var pa = fs.readdirSync(nodeModulesPath);
	        if (!pa) {
	            return;
	        }
	        pa.forEach(function (ele) {
	            var _path = nodeModulesPath + '/' + ele;
	            var info = fs.statSync(_path);
	            if (info.isDirectory()) {
	                if (_path.endsWith('devui')) {
	                    if (!_this.componentList.includes(type$1.SupportComponentName.DevUI))
	                        _this.componentList.push(type$1.SupportComponentName.DevUI);
	                    server$1.__moduleExports.logger.info("Find Devui At " + _path);
	                    _this.componentToUrl.set(type$1.SupportComponentName.DevUI, _path);
	                }
	                // this.checkProjectFrameworkAndComponentName(_path);
	                else if (_path.endsWith("/@angular")) {
	                    _this.FrameName = type$1.SupportFrameName.Angular;
	                    var _tempPath = _path.replace(/node_modules(\S)*/g, "");
	                    if (!_this.rootPaths.includes(_tempPath)) {
	                        _this.rootPaths.push(_tempPath);
	                    }
	                    server$1.__moduleExports.logger.info("Find Angular At " + _path);
	                }
	                else {
	                    _this.checkProjectFrameworkAndComponentName(_path);
	                }
	            }
	        });
	    };
	    Igniter.prototype.loadSourceTree = function () {
	        var e_1, _a;
	        try {
	            for (var _b = __values(this.componentToUrl.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var com = _c.value;
	                this._loadSouceTree(com).then(function (value) {
	                    server$1.__moduleExports.host.HTMLComoponentSource = value[0];
	                    server$1.__moduleExports.host.HTMLDirectiveSource = value[1];
	                });
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	    };
	    Igniter.prototype._loadSouceTree = function (comPath) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                return [2 /*return*/, new Promise(function (resolve, rejects) {
	                        // fs.readFile(comPath+"/wch/info.json", { encoding: 'UTF-8' }, (err, data) => {
	                        // 	if (err) {
	                        // 		rejects(err.message);
	                        // 	} else {
	                        // 		const comInfo = JSON.parse(data);
	                        // 		// logger.debug(comInfo[0]);
	                        // 		resolve(host.architect.build(comInfo));
	                        // 	}
	                        // });
	                        resolve(server$1.__moduleExports.host.architect.build(info.devuiInfo, type$1.SupportComponentName.DevUI));
	                    })];
	            });
	        });
	    };
	    return Igniter;
	}());
	exports.Igniter = Igniter;
	});

	var type$3 = createCommonjsModule(function (module, exports) {
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spread = (commonjsGlobal && commonjsGlobal.__spread) || function () {
	    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	    return ar;
	};
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-06-08 15:53:51
	 * @LastEditTime: 2020-06-08 22:26:35
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\parser\Expression\type.ts
	 */
	var ExpressionTreeNode = /** @class */ (function () {
	    function ExpressionTreeNode(infoNode, type, insertText, attrs, subTags, id) {
	        if (attrs === void 0) { attrs = []; }
	        if (subTags === void 0) { subTags = []; }
	        this.infoNode = infoNode;
	        this.type = type;
	        this.insertText = insertText;
	        this.attrs = attrs;
	        this.subTags = subTags;
	        this.id = id;
	        this.base = 0;
	        this.incrementalFlag = false;
	        this.content = [];
	        this.times = 1;
	    }
	    ExpressionTreeNode.prototype.addAttr = function (attr) {
	        if (attr)
	            this.attrs.push([attr]);
	    };
	    ExpressionTreeNode.prototype.addAttrs = function (attrs) {
	        this.times = this.times > attrs.length ? this.times : attrs.length;
	        this.attrs.push(attrs);
	    };
	    ExpressionTreeNode.prototype.addSubTag = function (subTags) {
	        var _a;
	        (_a = this.subTags).push.apply(_a, __spread(subTags));
	    };
	    ExpressionTreeNode.prototype.setInsertText = function (insertText) {
	        this.insertText = insertText;
	        return this;
	    };
	    ExpressionTreeNode.prototype.getAttrOfIndex = function (index) {
	        var result = [];
	        this.attrs.forEach(function (e) {
	            if (index > e.length - 1) {
	                result.push(e[e.length - 1]);
	            }
	            else {
	                result.push(e[index]);
	            }
	        });
	        return result;
	    };
	    ExpressionTreeNode.prototype.addContent = function (content) {
	        this.times = this.times > content.length ? this.times : content.length;
	        this.content = content;
	    };
	    ExpressionTreeNode.prototype.getContent = function (index) {
	        if (!this.incrementalFlag) {
	            if (index >= this.content.length) {
	                return this.content[this.content.length - 1];
	            }
	            return this.content[index];
	        }
	        else {
	            return this.content[0].replace('**Inc%%', "" + (index + this.base));
	        }
	    };
	    ExpressionTreeNode.prototype.setIncrementalContent = function (content) {
	        this.incrementalFlag = true;
	        content.match(/\(.*?\)/);
	        var result = content.match(/\(([^)]*)\)/);
	        this.base = parseInt(result[1]);
	        this.content[0] = content.replace(/\(.*?\)/, '**Inc%%');
	    };
	    return ExpressionTreeNode;
	}());
	exports.ExpressionTreeNode = ExpressionTreeNode;
	var ExpressionNodeType;
	(function (ExpressionNodeType) {
	    ExpressionNodeType[ExpressionNodeType["ID"] = 0] = "ID";
	    ExpressionNodeType[ExpressionNodeType["CLASS"] = 1] = "CLASS";
	    ExpressionNodeType[ExpressionNodeType["COMPONENTPREFIX"] = 2] = "COMPONENTPREFIX";
	    ExpressionNodeType[ExpressionNodeType["DIRECTIVE"] = 3] = "DIRECTIVE";
	    ExpressionNodeType[ExpressionNodeType["ELEMENT"] = 4] = "ELEMENT";
	    ExpressionNodeType[ExpressionNodeType["TAG"] = 5] = "TAG";
	    ExpressionNodeType[ExpressionNodeType["Attribute"] = 6] = "Attribute";
	})(ExpressionNodeType = exports.ExpressionNodeType || (exports.ExpressionNodeType = {}));
	exports.testCode = "<div class=\"card-header\">\u53EF\u62D6\u62FD\u9879</div>\n<div class=\"card-block\">\n  <ul class=\"list-group\">\n\t<li\n\t  dDraggable\n\t  *ngFor=\"let item of list1\"\n\t  [dragScope]=\"'default-css'\"\n\t  [dragData]=\"{ item: item, parent: list1 }\"\n\t  class=\"list-group-item over-flow-ellipsis\"\n\t>\n\t  {{ item.name }}\n\t</li>\n  </ul>\n</div>";
	});

	var ExpressionLexer = createCommonjsModule(function (module, exports) {
	var __read = (commonjsGlobal && commonjsGlobal.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spread = (commonjsGlobal && commonjsGlobal.__spread) || function () {
	    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	    return ar;
	};
	exports.__esModule = true;






	var OPERATORS = [chars.$STAR, chars.$PERIOD, chars.$LBRACKET, chars.$HASH, chars.$LBRACE, chars.$LPAREN];
	var OperatorsWithoutBracket = [chars.$STAR, chars.$PERIOD, chars.$HASH, chars.$LBRACE];
	var BracketsOperator = [chars.$LBRACE, chars.$LBRACKET, chars.$LPAREN];
	var ExpresssionLexer = /** @class */ (function () {
	    function ExpresssionLexer() {
	        this.brackets = new Map();
	        this.fragment = '';
	        this.ErrorFlag = false;
	        this.startCursor = new lexer.Cursor("", -1, -1);
	        this.endCursor = new lexer.Cursor("", -1, -1);
	        this.operator = -1;
	        this.HTMLTags = ['xmp', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dir', 'div', 'dfn', 'dialog', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'];
	        this.rootNode = undefined;
	        this.brackets.set(chars.$LBRACKET, chars.$RBRACKET);
	        this.brackets.set(chars.$LPAREN, chars.$RPAREN);
	        this.brackets.set(chars.$LBRACE, chars.$RBRACE);
	    }
	    ExpresssionLexer.prototype.parse = function (expression) {
	        this.init();
	        var root = this.slicer(expression);
	        // console.log(JSON.stringify(root));
	        return this.interperate(root);
	    };
	    //进行标签层级的划分进而交付给divider
	    ExpresssionLexer.prototype.slicer = function (expression) {
	        var _this = this;
	        if (!expression.match(/\.|\[|\#|\*|\>|\{\!/)) {
	            return undefined;
	        }
	        this.initCursor(expression);
	        expression = this.getComName(expression);
	        // const RealExpression = this.comName?expression.substring(startIndex):expression;
	        //笛卡尔积模式
	        if (expression.indexOf('**') !== -1) ;
	        //普通表达式模式TODO:分割器
	        var subExp = this._slicer(expression);
	        var tempRoots = [];
	        var nodesQueue = [];
	        subExp.forEach(function (e, index) {
	            if (e.match(/^\[(\s|\S)*\]$/)) {
	                e = e.replace(/^\[|\]$/g, "");
	                var slices = _this.getSlicesWithBracket(e, chars.$COMMA, _this.brackets);
	                tempRoots = slices.map(function (e) {
	                    return e.indexOf('>') === -1 ? _this.divider(e) : _this.slicer(e)[0];
	                });
	            }
	            else {
	                tempRoots = index > 0 ? [_this.divider(e, nodesQueue[index - 1][0])] : [_this.divider(e)];
	            }
	            if (tempRoots && index > 0) {
	                nodesQueue[index - 1].forEach(function (root) {
	                    root.addSubTag(tempRoots);
	                });
	            }
	            nodesQueue[index] = tempRoots;
	        });
	        return nodesQueue[0];
	    };
	    ExpresssionLexer.prototype._slicer = function (exp) {
	        this.initCursor(exp);
	        var result = [];
	        try {
	            while (true) {
	                var end = this.endCursor.tryStopAt([chars.$GT, chars.$LBRACKET]);
	                if (end === chars.$GT) {
	                    result.push(this.getContent());
	                    this.MoveCursorOverTempFragment();
	                    continue;
	                }
	                else {
	                    this.endCursor.tryStopByPairs(chars.$LBRACKET, chars.$RBRACKET);
	                }
	            }
	        }
	        catch (error) {
	            result.push(this.getContent());
	        }
	        return result;
	    };
	    //进行tag级别的划分。
	    ExpresssionLexer.prototype.divider = function (expression, fatherTag) {
	        try {
	            expression = this.getComName(expression);
	            //初始化tag
	            this.initDivider(expression);
	            this.endCursor.tryStopAt(OPERATORS);
	            var name_1 = this.getContent();
	            var tempComName = util$1.getcomNameFromPrefix(name_1);
	            if (tempComName) {
	                this.comName = tempComName;
	                return this.divider(this.startCursor.getText().substring(this.startCursor.offset));
	            }
	            else {
	                this.createTagNode(name_1, fatherTag);
	            }
	            //加入属性
	            while (this.endCursor.offset < expression.length) {
	                if (OPERATORS.includes(this.endCursor.peek())) {
	                    this.operator = this.endCursor.peek();
	                    this.getFragment();
	                    this.operate();
	                }
	                else {
	                    this.endCursor.advance();
	                }
	            }
	        }
	        catch (_a) {
	            this.fragment = this.getContent();
	            if (this.rootNode && !BracketsOperator.includes(this.operator)) {
	                this.operate();
	            }
	            else if (!this.rootNode) {
	                this.createTagNode(this.fragment);
	            }
	        }
	        return this.rootNode;
	    };
	    ExpresssionLexer.prototype.getComName = function (expression) {
	        //检测组件库标记是否存在
	        var startIndex = expression.indexOf('.') + 1;
	        var prefixName = expression.substring(0, startIndex - 1);
	        if (this.checkMails(prefixName)) {
	            return undefined;
	        }
	        var tempCom = util$1.getcomNameFromPrefix(prefixName);
	        this.comName = tempCom ? tempCom : this.comName;
	        return tempCom ? expression.substring(startIndex) : expression;
	    };
	    ExpresssionLexer.prototype.getFragment = function () {
	        this.endCursor.advance();
	        this.startCursor = this.endCursor.copy();
	        switch (this.operator) {
	            case chars.$PERIOD: {
	                if (this.startCursor.peek() !== chars.$LBRACKET) {
	                    this.endCursor.tryStopAt(OperatorsWithoutBracket);
	                    break;
	                }
	                else {
	                    this.endCursor.tryStopAt([chars.$RBRACKET]);
	                    this.endCursor.advance();
	                    break;
	                }
	            }
	            case chars.$LBRACKET:
	                this.endCursor.tryStopAt([chars.$RBRACKET]);
	                break;
	            case chars.$LBRACE:
	                this.endCursor.tryStopAt([chars.$RBRACE]);
	                break;
	            default:
	                this.endCursor.tryStopAt(OPERATORS);
	                break;
	        }
	        this.fragment = this.getContent();
	    };
	    //匹配规则：nameSelf ->sorDescription -> fatherCom+Prefix -> fatherDir+Prefix -> namePrefix -> htmlTag
	    ExpresssionLexer.prototype.createTagNode = function (tagName, fatherTag) {
	        var _this = this;
	        var tagsource = server$1.__moduleExports.host.HTMLComoponentSource;
	        var tagNode;
	        if (this.HTMLTags.includes(tagName)) {
	            tagNode = new Storage.TagComponent(tagName);
	        }
	        if (this.comName && !tagNode) {
	            tagNode = tagsource.prefixCut[this.comName][tagName];
	            if (!tagNode && fatherTag) {
	                var tagNameWithFater_1 = fatherTag.infoNode.getName + '-' + tagName;
	                tagNode = tagsource.getSubNodes().find(function (e) { return (e.getName().startsWith(tagNameWithFater_1)); });
	                if (!tagNode) {
	                    fatherTag.attrs.forEach(function (e) {
	                        if (e[0].type === type$3.ExpressionNodeType.DIRECTIVE || !tagNode) {
	                            tagNameWithFater_1 = util$1.getTagPrefixFromComName(_this.comName) + e[0].infoNode.getName().toLowerCase() + '-' + tagName;
	                            tagNode = tagsource.getSubNodes().find(function (e) { return (e.getName().startsWith(tagNameWithFater_1)); });
	                        }
	                    });
	                }
	            }
	            if (!tagNode) {
	                var nodes = server$1.__moduleExports.host.HTMLComoponentSource.prefixSchema[this.comName];
	                if (tagName.length > 1)
	                    tagNode = nodes.find(function (e) { return e.prefixName.startsWith(tagName); });
	            }
	        }
	        if (!tagNode) {
	            tagNode = new Storage.TagComponent(tagName);
	        }
	        var insertText = '<' + tagNode.getCompletionItem().insertText;
	        this.rootNode = new type$3.ExpressionTreeNode(tagNode, type$3.ExpressionNodeType.TAG).setInsertText(insertText);
	    };
	    //分为两种：
	    //.[directive.value] 指令及其属性 指令/属性全名->属性简写->属性prefix/
	    //.属性值 -> 指令 -> 属性值 -> class 
	    ExpresssionLexer.prototype.getPeriod = function (attrName) {
	        var _a = this.rootNode, type = _a.type, infoNode = _a.infoNode;
	        if (type !== type$3.ExpressionNodeType.TAG) {
	            return;
	        }
	        //检测是否满足[...]样式：
	        if (attrName.match(/\[(\S*)\]/)) {
	            this.getBracket(true);
	            return;
	        }
	        var result = this.getDirective(attrName);
	        return result = result ? result : this.getATTR(this.rootNode, attrName, false);
	    };
	    //单括号应该是仅匹配属性(CSS语法)
	    ExpresssionLexer.prototype.getBracket = function (directiveFlag) {
	        var _this = this;
	        var fragment = this.fragment.replace(/^\[|\]$/g, "");
	        var singleExps = fragment.split(',');
	        var nodes = [];
	        singleExps.forEach(function (e) {
	            var fragments = e.split('.');
	            var directiveOrATTRNode;
	            if (directiveFlag) {
	                directiveOrATTRNode = _this.getDirective(fragments[0]);
	            }
	            else {
	                directiveOrATTRNode = _this.getATTR(_this.rootNode, fragments[0], true);
	            }
	            if (!directiveOrATTRNode) {
	                directiveOrATTRNode = _this.getATTR(_this.rootNode, fragments[0], false);
	            }
	            if (directiveOrATTRNode && fragments.length > 1) {
	                fragments.forEach(function (e, index) {
	                    if (index > 0) {
	                        if (directiveOrATTRNode.type === type$3.ExpressionNodeType.DIRECTIVE)
	                            directiveOrATTRNode.addAttr(_this.getATTR(directiveOrATTRNode, fragments[index], false));
	                        else if (directiveOrATTRNode.type === type$3.ExpressionNodeType.Attribute) {
	                            _this.setATTRValue(directiveOrATTRNode, fragments[index]);
	                        }
	                    }
	                });
	            }
	            if (directiveOrATTRNode) {
	                nodes.push(directiveOrATTRNode);
	            }
	        });
	        this.rootNode.addAttrs(nodes);
	    };
	    ExpresssionLexer.prototype.getStar = function () {
	        var timenum = parseInt(this.fragment);
	        this.rootNode.times = timenum;
	    };
	    ExpresssionLexer.prototype.getHash = function () {
	        this.rootNode.id = this.fragment;
	    };
	    //功能函数
	    //匹配规则: sortDescription -> name -> prefix -> suffix
	    ExpresssionLexer.prototype.getDirective = function (directiveNameOrPrefix) {
	        var result;
	        if (directiveNameOrPrefix.length < 2) {
	            return;
	        }
	        if (this.comName) {
	            result = server$1.__moduleExports.host.HTMLDirectiveSource.prefixCut[util$1.getTagPrefixFromComName(this.comName, true) + directiveNameOrPrefix];
	        }
	        result = result ? result : server$1.__moduleExports.host.HTMLDirectiveSource.directivePrefixCut[directiveNameOrPrefix];
	        result = result ? result : this.getBestChoice(Object.values(server$1.__moduleExports.host.HTMLDirectiveSource.getSchema()), [
	            function (e, outcome) { return (outcome == directiveNameOrPrefix); },
	            function (e, outcome) { return (e.prefixName === directiveNameOrPrefix); },
	            function (e, outcome) { return (outcome.startsWith(directiveNameOrPrefix)); },
	            function (e, outcome) { return (e.prefixName.startsWith(directiveNameOrPrefix)); },
	            function (e, outcome) { return (outcome.endsWith(directiveNameOrPrefix)); },
	            function (e, outcome) { return (e.prefixName.endsWith(directiveNameOrPrefix)); },
	        ], type$3.ExpressionNodeType.DIRECTIVE, function (e) { return (e.getName().toLowerCase()); });
	        return result ? new type$3.ExpressionTreeNode(result, type$3.ExpressionNodeType.DIRECTIVE).setInsertText(result.getCompletionItem().insertText) : undefined;
	    };
	    //优先级 sortDescription -> prefix -> suffix -> name
	    //如果写的正好满足name,则name优先
	    ExpresssionLexer.prototype.getATTR = function (node, nameOrPrefix, createATTRFlag) {
	        var infoNode = node.infoNode;
	        var attrNode = undefined;
	        if (!(infoNode instanceof Storage.Component)) {
	            this.ErrorFlag = true;
	            throw Error("get attribute from " + node.infoNode.getName());
	        }
	        else if (nameOrPrefix.length > 1) {
	            if (nameOrPrefix.startsWith('\!')) {
	                attrNode = this.getAttrFromName(infoNode, nameOrPrefix.substring(1), false);
	            }
	            else {
	                attrNode = this.getAttrFromValue(infoNode, nameOrPrefix);
	                if (!attrNode) {
	                    attrNode = this.getAttrFromName(infoNode, nameOrPrefix);
	                }
	            }
	        }
	        if (!attrNode) {
	            attrNode = createATTRFlag ? new type$3.ExpressionTreeNode(new Storage.Attribute(nameOrPrefix), type$3.ExpressionNodeType.Attribute, nameOrPrefix + "=\"${1}\"") :
	                new type$3.ExpressionTreeNode(new Storage.Attribute(nameOrPrefix), type$3.ExpressionNodeType.Attribute, "class=\"" + nameOrPrefix + "\"");
	        }
	        return attrNode;
	    };
	    ExpresssionLexer.prototype.setATTRValue = function (node, value) {
	        if (node.infoNode instanceof Storage.Attribute) {
	            node.infoNode.getValueSet().forEach(function (e) {
	                if (e.startsWith(value)) {
	                    value = "\"" + e + "\"";
	                }
	            });
	        }
	        node.insertText = node.insertText.replace(/\${1(\S)*}/, value);
	        return;
	    };
	    ExpresssionLexer.prototype.getAttrFromValue = function (infoNode, nameOrPrefix) {
	        var prefixToValue = infoNode.getPrefixToValue();
	        var attrNode = prefixToValue[nameOrPrefix];
	        var valueName = nameOrPrefix;
	        if (!attrNode) {
	            valueName = Object.keys(prefixToValue).find(function (e) { return e.startsWith(nameOrPrefix); });
	            valueName = valueName ? valueName : Object.keys(prefixToValue).find(function (e) { return e.endsWith(nameOrPrefix); });
	            attrNode = valueName ? prefixToValue[valueName] : undefined;
	        }
	        var insertText = attrNode ? attrNode.getCompletionItem().insertText.replace(/\$\{(\s|\S)*\}/g, "'" + valueName + "'") : "";
	        return attrNode ? new type$3.ExpressionTreeNode(attrNode, type$3.ExpressionNodeType.Attribute).setInsertText(insertText) : undefined;
	    };
	    //name ->prefix ->suffix
	    ExpresssionLexer.prototype.getAttrFromName = function (infoNode, nameOrPrefix, booleanValue) {
	        if (booleanValue === void 0) { booleanValue = true; }
	        var attrs = {};
	        var insertText = undefined;
	        attrs[1] = [];
	        attrs[2] = [];
	        attrs[3] = [];
	        infoNode.getSubNodes().forEach(function (e) {
	            var attrName = e.getName().toLowerCase();
	            if (attrName == nameOrPrefix) {
	                attrs[1].push(e);
	            }
	            else if (attrName.startsWith(nameOrPrefix)) {
	                attrs[2].push(e);
	            }
	            else if (attrName.endsWith(nameOrPrefix)) {
	                attrs[3].push(e);
	            }
	        });
	        var attrNode = attrs[1].length === 0 ? (attrs[2].length === 0 ? (attrs[3].length === 0 ? undefined : attrs[3][0]) : attrs[2][0]) : attrs[1][0];
	        if (attrNode && attrNode.getValueType() == 'boolean') {
	            insertText = attrNode.getCompletionItem().insertText.replace('${1|true,false|}', "" + booleanValue);
	        }
	        return attrNode ? new type$3.ExpressionTreeNode(attrNode, type$3.ExpressionNodeType.Attribute).setInsertText(insertText ? insertText : attrNode.getCompletionItem().insertText) : undefined;
	    };
	    ExpresssionLexer.prototype.getBrace = function () {
	        var slices = this.fragment.split(',');
	        if (slices.length === 1 && this.fragment.match(/\(.*\)/)) {
	            this.rootNode.setIncrementalContent(this.fragment);
	        }
	        else {
	            this.rootNode.addContent(slices);
	        }
	    };
	    ExpresssionLexer.prototype.operate = function () {
	        switch (this.operator) {
	            case chars.$PERIOD: {
	                this.rootNode.addAttr(this.getPeriod(this.fragment));
	                break;
	            }
	            case chars.$STAR: {
	                this.getStar();
	                break;
	            }
	            case chars.$HASH: {
	                this.getHash();
	                break;
	            }
	            case chars.$LBRACKET: {
	                this.getBracket(false);
	                break;
	            }
	            case chars.$LBRACE: {
	                this.getBrace();
	                break;
	            }
	        }
	    };
	    ExpresssionLexer.prototype.getBestChoice = function (source, fun, type, prefun) {
	        var res = {};
	        for (var i = 1; i <= fun.length; i++) {
	            res[i] = [];
	        }
	        try {
	            source.forEach(function (e) {
	                if (res[1].length < 1) {
	                    fun.forEach(function (f, index) {
	                        var outcome = prefun(e);
	                        if (f(e, outcome)) {
	                            res[index].push(e);
	                        }
	                    });
	                }
	                else {
	                    throw new Error();
	                }
	            });
	        }
	        catch (_a) { }
	        var _result = undefined;
	        for (var i = 1; i <= fun.length; i++) {
	            if (!_result) {
	                _result = res[i][0] ? res[i][0] : undefined;
	            }
	        }
	        return _result;
	    };
	    ExpresssionLexer.prototype.isHTMLInfoNode = function (node) {
	        if (node.getCompletionItem() !== undefined) {
	            return true;
	        }
	        return false;
	    };
	    ExpresssionLexer.prototype.checkMails = function (s) {
	        var Mails = ['qq', '163', 'foxmail', 'outlook', '126'];
	        if (Mails.includes(s)) {
	            return true;
	        }
	        return false;
	    };
	    ExpresssionLexer.prototype.resetCursor = function (startoffset, endOffset) {
	        if (endOffset) {
	            this.endCursor.offset = endOffset;
	        }
	        this.startCursor.offset = startoffset;
	    };
	    ExpresssionLexer.prototype.detectBracket = function () {
	        var tempPair = this.brackets[this.endCursor.peek()];
	        if (tempPair) {
	            this.endCursor.tryStopByPairs(this.endCursor.peek(), tempPair);
	            this.fragment = this.startCursor.getContentEndOf(this.endCursor);
	            return true;
	        }
	        return false;
	    };
	    ExpresssionLexer.prototype.init = function () {
	        this.comName = undefined;
	    };
	    ExpresssionLexer.prototype.initDivider = function (text) {
	        this.ErrorFlag = false;
	        this.fragment = '';
	        this.rootNode = undefined;
	        this.operator = -1;
	        this.initCursor(text);
	    };
	    ExpresssionLexer.prototype.initCursor = function (text) {
	        this.startCursor = new lexer.Cursor(text, 0, text.length);
	        this.endCursor = new lexer.Cursor(text, 0, text.length);
	    };
	    //将返回当前的content,并且将start与endCursor置位当前endCursor的后一位
	    ExpresssionLexer.prototype.getContent = function () {
	        var content = this.startCursor.getContentEndOf(this.endCursor);
	        return content;
	    };
	    ExpresssionLexer.prototype.MoveCursorOverTempFragment = function () {
	        var end = this.endCursor.offset + 1;
	        this.resetCursor(end, end);
	    };
	    ExpresssionLexer.prototype.getSlicesWithBracket = function (exp, operator, pairs) {
	        var result = [];
	        this.startCursor = new lexer.Cursor(exp);
	        this.endCursor = new lexer.Cursor(exp);
	        try {
	            while (true) {
	                this.endCursor.tryStopAt(__spread([operator], pairs.keys()));
	                switch (this.endCursor.peek()) {
	                    case operator:
	                        result.push(this.getContent());
	                        this.MoveCursorOverTempFragment();
	                        break;
	                    default: this.endCursor.tryStopByPairs(this.endCursor.peek(), pairs.get(this.endCursor.peek()));
	                }
	            }
	        }
	        catch (_a) {
	            result.push(this.startCursor.getContentEndOf(this.endCursor));
	        }
	        return result;
	    };
	    /**
	     * 渲染部门
	     */
	    //渲染函数入口，通过对顶级节点数组渲染后拼接成为字符串，之后返回
	    ExpresssionLexer.prototype.interperate = function (nodes) {
	        var _this = this;
	        var result = nodes.map(function (e) {
	            return _this._interperate(e, "");
	        });
	        var _insertText = result.join('\n');
	        var i = 2;
	        //处理snippet级
	        while (_insertText.match(/\{1\|/)) {
	            _insertText = _insertText.replace(/\{1\|/, "{" + i++ + "|");
	        }
	        //处理普通属性级
	        while (_insertText.match(/\{1\}/)) {
	            _insertText = _insertText.replace(/\{1\}/, "{" + i++ + "}");
	        }
	        //处理$0
	        while (_insertText.match(/\$0/)) {
	            _insertText = _insertText.replace(/\$0/, "$" + i++);
	        }
	        return _insertText;
	    };
	    //进行标签渲染
	    ExpresssionLexer.prototype._interperate = function (node, retact) {
	        var _this = this;
	        if (node.subTags.length === 0) {
	            return this._interperateAttr(node, retact, true);
	        }
	        else {
	            var subInserText = node.subTags.map(function (tag) {
	                return _this._interperate(tag, retact + '\t');
	            });
	            var tagText = subInserText.join('\n');
	            return this._interperateAttr(node, retact, false).replace(/\$0/g, tagText);
	        }
	    };
	    //进行属性渲染
	    ExpresssionLexer.prototype._interperateAttr = function (node, retract, endFlag) {
	        var _insertText = node.insertText;
	        var startStr = _insertText.slice(0, _insertText.indexOf('$0') - 1).replace(/\n|\r|\n\r/g, ' ');
	        var endStr = _insertText.slice(_insertText.indexOf('$0') - 1).replace(/\n|\r|\n\r/g, ' ');
	        if (!endFlag) {
	            endStr = '>\n$0\n' + retract + endStr.slice(3);
	        }
	        var attrString = [];
	        var idString = undefined;
	        if (node.id) {
	            idString = "id=\"" + node.id + "\"";
	        }
	        var result = [];
	        var _loop_1 = function (i) {
	            attrString = [];
	            var attrs = node.getAttrOfIndex(i);
	            attrs.forEach(function (e) {
	                attrString.push(e.insertText);
	                if (e.type === type$3.ExpressionNodeType.DIRECTIVE) {
	                    e.attrs.forEach(function (ele) {
	                        var dirAttrs = e.getAttrOfIndex(i);
	                        attrString.push(dirAttrs[0].insertText);
	                    });
	                }
	            });
	            if (attrString) {
	                attrString.unshift(idString);
	            }
	            if (attrString.length > 0) {
	                startStr += '';
	            }
	            var content = node.getContent(i);
	            var _endStr = endStr;
	            if (content) {
	                if (endStr.indexOf('\n$0') !== -1) {
	                    _endStr = endStr.replace('\n$0', content + '\n$0');
	                }
	                else {
	                    _endStr = endStr.replace('$0', content + '$0');
	                }
	                result.push(retract + startStr + attrString.join(' ') + _endStr);
	            }
	            else
	                result.push(retract + startStr + attrString.join(' ') + endStr);
	        };
	        for (var i = 0; i < node.times; i++) {
	            _loop_1(i);
	        }
	        return result.join('\n');
	    };
	    return ExpresssionLexer;
	}());
	exports.ExpresssionLexer = ExpresssionLexer;
	});

	var ExpressionAdm_1 = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-06-05 23:04:19
	 * @LastEditTime: 2020-06-08 20:43:14
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\Expression\ExpressionAdm.ts
	 */






	var ExpressionAdm = /** @class */ (function () {
	    function ExpressionAdm(prefixs) {
	        this.componentPrefix = [];
	        this.htmltag = [];
	        this.expLexer = new ExpressionLexer.ExpresssionLexer();
	        this.mkbuilder = new util.MarkUpBuilder();
	        this.componentPrefix = prefixs;
	    }
	    ExpressionAdm.prototype.getExpression = function (offset, text) {
	        var start = offset, end = offset;
	        while (!(chars.WhiteCharsAndLTAndSLASH.includes(text.charCodeAt(start))) && start >= 0) {
	            start--;
	        }
	        // if(text.charCodeAt(start)===$AT){
	        // 	start--;
	        // }
	        while (!(chars.WhiteCharsAndLTAndGTANDSPLASH.includes(text.charCodeAt(end))) && end < text.length) {
	            end++;
	        }
	        // logger.debug(`get:${text.substring(start+1,end)}`);
	        return { res: text.substring(start + 1, end), span: new type.Span(start + 1, end) };
	    };
	    ExpressionAdm.prototype.createCompletion = function (params) {
	        var textDocument = params.textDocument, span = params.span, expression = params.expression;
	        // expression = expression.substr(1);
	        if (!expression.startsWith('@')) {
	            return [];
	        }
	        if (expression == '@test') {
	            var test = vscodeLanguageserver.CompletionItem.create('@test');
	            test.textEdit = { range: util.convertSpanToRange(textDocument, span), newText: type$3.testCode };
	            test.documentation = new util.MarkUpBuilder('![](https://s1.ax1x.com/2020/06/13/txlqFU.png)').getMarkUpContent();
	            return [test];
	        }
	        var expressionResult = this.expLexer.parse(expression.substring(1));
	        if (!expressionResult) {
	            return [];
	        }
	        //completionItem制作。
	        var _completionItem = vscodeLanguageserver.CompletionItem.create(expression);
	        _completionItem.kind = vscodeLanguageserver.CompletionItemKind.Function;
	        _completionItem.textEdit = { range: util.convertSpanToRange(textDocument, span), newText: "" + expressionResult };
	        // _completionItem.documentation= this.mkbuilder.setSpecialContent('html',`${expressionResult.replace(/(\$[0-9])|(\$\{(\s|\S)*\})/g,"")}`).getMarkUpContent();
	        _completionItem.documentation = this.mkbuilder.setSpecialContent('html', "" + expressionResult).getMarkUpContent();
	        _completionItem.insertTextFormat = vscodeLanguageserver.InsertTextFormat.Snippet;
	        // logger.debug(`create:${expressionResult}`);
	        return [_completionItem];
	    };
	    return ExpressionAdm;
	}());
	exports.ExpressionAdm = ExpressionAdm;
	});

	var Host_1 = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;










	var Host = /** @class */ (function () {
	    function Host() {
	        var _this = this;
	        this.parser = new parser.YQ_Parser();
	        this.hunter = new Hunter_1.Hunter();
	        this.igniter = new Igniter_1.Igniter();
	        this.snapshotMap = new Map();
	        this.hoverProvider = new HoverProvider_1.HoverProvider();
	        this.completionProvider = new CompletionProvider_1.CompletionProvider();
	        this.documents = new vscodeLanguageserver.TextDocuments(vscodeLanguageserverTextdocument.TextDocument);
	        this.expressionAdm = new ExpressionAdm_1.ExpressionAdm(['d']);
	        this.architect = new Architect_1.Architect();
	        this.HTMLComoponentSource = new Storage.RootNode();
	        this.HTMLDirectiveSource = new Storage.RootNode();
	        this.documents.onDidChangeContent(function (change) {
	            if (_this.parseOption)
	                _this.igniter.parseTextDocument(change.document, _this.parseOption);
	        });
	    }
	    Host.prototype.getDocumentFromURI = function (uri) {
	        var _result = this.documents.get(uri);
	        if (!_result) {
	            throw Error("Cannot get file from uri " + uri);
	        }
	        return _result;
	    };
	    Host.prototype.getSnapShotFromURI = function (uri) {
	        var _result = this.snapshotMap.get(uri);
	        if (!_result) {
	            throw Error("Cannot get snapShot from uri " + uri);
	        }
	        return _result;
	    };
	    Host.prototype.setParseOption = function (parseOption) {
	        this.parseOption = parseOption;
	    };
	    return Host;
	}());
	exports.Host = Host;
	var Agent = /** @class */ (function () {
	    function Agent() {
	    }
	    return Agent;
	}());
	exports.Agent = Agent;
	var SnapShot = /** @class */ (function () {
	    function SnapShot(root, errors, textDocument) {
	        this.root = root;
	        this.errors = errors;
	        this.textDocument = textDocument;
	        this.HTMLAstToHTMLInfoNode = new Map();
	        this.context = "";
	        this.context = this.textDocument.getText();
	    }
	    return SnapShot;
	}());
	exports.SnapShot = SnapShot;
	});

	var DConnection_1 = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;
	/*
	 * @Author: your name
	 * @Date: 2020-05-15 12:53:58
	 * @LastEditTime: 2020-06-06 08:19:47
	 * @LastEditors: Please set LastEditors
	 * @Description: In User Settings Edit
	 * @FilePath: \DevUIHelper-LSP\server\src\DConnection.ts
	 */




	var DConnection = /** @class */ (function () {
	    function DConnection(host, logger) {
	        this.connection = vscodeLanguageserver.createConnection(vscodeLanguageserver.ProposedFeatures.all);
	        this.addProtocalHandlers();
	        this.host = host;
	        this.logger = logger;
	    }
	    DConnection.prototype.addProtocalHandlers = function () {
	        var _this = this;
	        this.connection.onInitialize(function (e) { return _this.onInitialze(e); });
	        this.connection.onInitialized(function () { return _this.onInitialized; });
	        this.connection.onDidChangeConfiguration(function (e) { return _this.onDidChangeConfiguration; });
	        this.connection.onHover(function (e) { return _this.onHover(e); });
	        this.connection.onCompletion(function (e) { return _this.onCompletion(e); });
	    };
	    DConnection.prototype.onInitialze = function (params) {
	        var capabilities = params.capabilities;
	        if (params.rootPath) {
	            server$1.__moduleExports.logger.debug("Find Project At " + params.rootPath);
	            this.igniteResult = this.host.igniter.ignite(params.rootPath);
	            this.host.setParseOption(this.igniteResult);
	        }
	        return {
	            capabilities: {
	                textDocumentSync: vscodeLanguageserver.TextDocumentSyncKind.Full,
	                // Tell the client that the server supports code completion
	                completionProvider: {
	                    resolveProvider: false,
	                    triggerCharacters: ['<', '.', '-', '+', '[', ']', '(', '\"', ' ', , '*', '\@', ',', 'a',
	                        'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
	                        'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
	                },
	                hoverProvider: true
	            }
	        };
	    };
	    DConnection.prototype.onInitialized = function () {
	        server$1.__moduleExports.logger.debug("Welcome to DevUI Helper!");
	        // if (hasConfigurationCapability) {
	        // 	// Register for all configuration changes.
	        // 	connection.client.register(DidChangeConfigurationNotification.type, undefined);
	        // }
	        // if (hasWorkspaceFolderCapability) {
	        // 	connection.workspace.onDidChangeWorkspaceFolders(_event => {
	        // 		connection.console.log('Workspace folder change event received.');
	        // 	});
	        // }
	    };
	    DConnection.prototype.onDidChangeConfiguration = function (change) {
	        // if (hasConfigurationCapability) {
	        // 	// Reset all cached document settings
	        // 	documentSettings.clear();
	        // } else {
	        // 	globalSettings = <ExampleSettings>(
	        // 		(change.settings.languageServerExample || defaultSettings)
	        // 	);
	        // }
	    };
	    DConnection.prototype.onCompletion = function (_textDocumentPosition) {
	        // logger.debug(`Completion work`);		
	        // logger.debug(`cursorOffset at : ${this.host.documents.get(_textDocumentPosition.textDocument.uri)?.offsetAt(_textDocumentPosition.position) }`);
	        // this.host.igniter.checkProjectFrameworkAndComponentName('c:\\MyProgram\\angular\\demo1');
	        if (!this.igniteResult || this.igniteResult.frame === type$1.SupportFrameName.Null || this.igniteResult.components === []) {
	            return [];
	        }
	        return this.host.completionProvider.provideCompletionItes(_textDocumentPosition, type$2.FileType.HTML);
	    };
	    DConnection.prototype.onHover = function (_textDocumentPosition) {
	        if (!this.igniteResult || this.igniteResult.frame === type$1.SupportFrameName.Null || this.igniteResult.components === []) {
	            return;
	        }
	        return this.host.hoverProvider.provideHoverInfoForHTML(_textDocumentPosition);
	    };
	    DConnection.prototype.listen = function () {
	        this.connection.listen();
	        this.host.documents.listen(this.connection);
	    };
	    DConnection.prototype.info = function (msg) {
	        this.logger.info(msg);
	    };
	    return DConnection;
	}());
	exports.DConnection = DConnection;
	});

	var server = createCommonjsModule(function (module, exports) {
	exports.__esModule = true;



	exports.logger = createLogger();
	exports.host = new Host_1.Host();
	exports.dconnection = new DConnection_1.DConnection(exports.host, exports.logger);
	exports.dconnection.listen();
	function createLogger() {
	    log4js.configure({
	        appenders: {
	            devuihelper: {
	                type: "console"
	            }
	        },
	        categories: { "default": { appenders: ["devuihelper"], level: "debug" } }
	    });
	    return log4js.getLogger("devuihelper");
	}
	exports.createLogger = createLogger;
	});

	var server$1 = /*@__PURE__*/unwrapExports(server);

	return server$1;

});
