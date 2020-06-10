/*
 * @Author: your name
 * @Date: 2020-06-05 20:55:33
 * @LastEditTime: 2020-06-08 14:37:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \DevUIHelper-LSP\server\src\Host\Hunter.ts
 */ 
import { SearchParser } from '../parser/parser';
import { SearchResult, SearchResultType } from '../parser/type';
import { HTMLAST, HTMLTagAST, HTMLATTRAST } from '../parser/ast';
import { HTMLInfoNode, Directive } from '../parser/WareHouse/Storage';
import { host } from '../server';
import { convertStringToName } from '../util';

export class Hunter {
	private searchParser = new SearchParser();
	constructor() {
	}

	searchTerminalAST(offset: number, uri: string): SearchResult {
		let _snapShot = host.snapshotMap.get(uri);
		if (!_snapShot) { throw Error(`this uri does not have a snapShot: ${uri}`); }
		const { root, textDocument, HTMLAstToHTMLInfoNode } = _snapShot;
		if (!root) {
			throw Error(`Snap shot does not have this file : ${uri}, please parse it befor use it!`);
		}
		let _result = this.searchParser.DFS(offset, root);
		//调整Node位置
		return _result ? _result : { ast: undefined, type: SearchResultType.Null };
	}

	findHTMLInfoNode(ast: HTMLAST | undefined, uri: string, map?: Map<HTMLAST, HTMLInfoNode>): HTMLInfoNode | undefined {
		if (!ast) {
			throw Error(`ast Does not Exits in file: ${uri}`);
		}
		if (!map) {
			map = host.getSnapShotFromURI(uri).HTMLAstToHTMLInfoNode;
		}
		if(ast instanceof HTMLATTRAST){
			let attrname = ast.getName().replace(/\[|\(|\)|\]/g,"");
			let hostcopy = host;
			let directive = host.HTMLDirectiveSource.getSchema()[attrname];
			if(directive){
				return directive;
			}
		}
		//表内存在则直接返回
		let res = map.get(ast);
		if (res) { return res; }

		if (ast.getName() == "$$ROOT$$") {
			let _htmlroot = host.HTMLComoponentSource;
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
			return host.HTMLComoponentSource.getSubNode(_name);
		}
		else {
			//表内没有则向上递归
			_name = convertStringToName(_name);
			let _parentInfoNode = map.get(_parentast);
			if (!_parentInfoNode) {
				_parentInfoNode = this.findHTMLInfoNode(_parentast, uri);
			}
			if (_parentInfoNode) {
				let _currentInfoNode = _parentInfoNode?.getSubNode(_name);
				if (_currentInfoNode) {
					map.set(ast, _currentInfoNode);
				}
				return _currentInfoNode;
			}
		}
	}
}