/*
 * @Author: your name
 * @Date: 2020-04-08 20:38:08
 * @LastEditTime: 2020-06-05 22:03:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\completion.ts
 */
import { adjustSpanToAbosulutOffset, getRangeFromDocument, getsubstringForSpan, autoSelectCompletionRangeKind, getRangefromSpan, convertSpanToRange } from './util';
import {   Component,} from './source/html_info';
import { host, logger } from './server';
import { CompletionItem, Range, HoverParams, TextDocumentPositionParams } from 'vscode-languageserver';
import { HTMLAST, HTMLTagAST, HTMLCommentAST } from './parser/ast';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { FileType, CompletionSearchResult, CompletionType, CompletionRangeKind } from './type';
import { SearchResultType, SupportFrameName } from './parser/type';
import { Span } from './DataStructure/type';
import { SnapShot } from './Host/Host';
import { WhiteChars, Space, WhiteCharsAndGTAndSPLASH, WhiteCharsAndLTAndLTANDSPLASH, newLine } from './parser/chars';
import { forEachTrailingCommentRange } from 'typescript/lib/tsserverlibrary';

export class CompletionProvider {
	private tabCompletionFlag = true;

	constructor() { }
	provideCompletionItes(_params: TextDocumentPositionParams, type: FileType): CompletionItem[] {
		// host.igniter.loadSourceTree();
		host.igniter.loadSourceTree();
		let { textDocument, position } = _params;
		let _textDocument = host.getDocumentFromURI(textDocument.uri);
		let _offset = _textDocument.offsetAt(position);
		// host.igniter.parseTextDocument(_textDocument,{frameName:SupportFrameName.Angular,tagMarkedPrefixs:[]})
		if (type === FileType.HTML) {
			return this.provideCompletionItemsForHTML(_offset, _textDocument);
		} else {
			return [];
		}
	}
	provideCompletionItemsForHTML(_offset: number, _textDocument: TextDocument): CompletionItem[] {
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
			if (node === host.HTMLComoponentSource) {
				let _endflag = ast.getSpan() === ast.nameSpan;
				if (_endflag) {
					return node.getFullCompltionItems(_range, _endflag);
				}
			}
			return node.getFullCompltionItems(_range);
		} else {
			return node.getNameCompltionItems(_range);
		}
	}

	searchTerminalASTForCompletion(offset: number, textDocument: TextDocument): CompletionSearchResult {
		let { ast, type } = host.hunter.searchTerminalAST(offset - 1, textDocument.uri);
		if (!ast) { throw Error(`this offset does not in any Node :${offset}`); }
		switch (type) {
			case (SearchResultType.Content):
				if (ast instanceof HTMLTagAST) {
					return ({ node: host.HTMLComoponentSource, span: undefined, ast: ast, type: CompletionType.NONE });
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
					return ({ node: host.HTMLComoponentSource, span: _span, ast: ast, type: _type });
				}
				return { node: host.hunter.findHTMLInfoNode(ast.parentPointer, textDocument.uri), span: _span, ast: ast.parentPointer!, type: _type };
			}
			case (SearchResultType.Value): {
				if (this.getCompletionFlag(textDocument.getText(), offset)) {
					return { node: host.hunter.findHTMLInfoNode(ast, textDocument.uri), span: undefined, ast: ast, type: CompletionType.FUll };
				}
			}
			case (SearchResultType.Null): return { node: undefined, span: undefined, ast: new HTMLCommentAST(), type: CompletionType.FUll };
		}

	}
	getCompletionFlag(text: string, offset: number): boolean {
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
	CompletionItemsFactory(node: Component, ast: HTMLTagAST, type: CompletionType, range?: Range): CompletionItem[] {
		let _directives = ast.attrList!.directive.getEach(e => e.getName());
		let _attrs = ast.attrList!.attr.getEach(e => e.getName());
		//alert: 测试用
		let _directiveWithName:string[] = [];
		let _directivesNodes = _directives?.map(name => {
			return host.HTMLDirectiveSource.getSubNode(name);
		});
		let _result: CompletionItem[] = [];
		//寻找directive的info
		_directivesNodes?.forEach(node => {
			if (node)
				_result.push(...node.getFullCompltionItems(range));
			}
		);
		_attrs?.forEach(node => {
			let attrName = node.replace(/\[|\(|\)|\]/g,"");
			if (host.HTMLDirectiveSource.getDirectiveWithNameSet()[attrName]){
				_directiveWithName.push(attrName);
				_result.push(...host.HTMLDirectiveSource.getSubNode(attrName).getFullCompltionItems(range));
			}
		});
		//加载directive自身
		_result.push(...host.HTMLDirectiveSource.getNameCompltionItems().filter(e=>{
			for (let name of [..._directiveWithName,..._directives!]) {
				if (name.includes(e.label))
					return false;
			}
			return true;
		}));
		if (type === CompletionType.FUll && range) {
			//加载component的info
			_result.push(...node.getFullCompltionItems(range));

			_result = _result.filter((e) => {
				for (let name of _attrs!) {
					if (name.includes(e.label))
						return false;
				}
				return true;
			});
			return _result;
		} else {
			_result.push(...node.getNameCompltionItems());
			_directivesNodes?.forEach(node => {
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