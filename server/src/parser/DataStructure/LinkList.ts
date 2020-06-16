
import{Span} from './type';

/*
 * @Author: your name
 * @Date: 2020-05-03 09:59:29
 * @LastEditTime: 2020-06-06 19:21:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \UI_Components_Helper\server\src\dataStructor\LinkList.ts
 */

export interface Node{
	/**
	 * 元素
	 */
	data:any;

	/**
	 * 后继指针
	 */
	next:Node|undefined;
	/**
	 * 前驱指针
	 */
	pre:Node|undefined;

}
export interface LinkList<T>{
	/**
	 * 头结点
	 */
	head:HeadNode;

	/**
	 * 长度
	 */
	length:number;
	/**
	 * 尾节点
	 */
	end:LinkNode<T>|undefined;
	
	/**
	 * 插入节点
	 */
	insertNode(newElement:T,node?:Node):void;

	/**
	 * 插入链表
	 */
	insetLinkList(list:LinkList<T>,node?:Node):void;

	/**
	 * 获取元素
	 */
	getElement(cb?:()=>any,param?:T):T|undefined;

	/**
	 * 依据下标获取元素
	 * @param num 
	 */
	get(num:number):Node|undefined;

	/**
	 * 转化为数组
	 */
	toArray():T[];
}
export class HeadNode implements Node{
	data:HeadNodeData;
	pre:Node|undefined;
	next:Node|undefined;
	constructor(headInfo:HeadNodeData){
		this.data = headInfo;
	}

}
export interface HeadNodeData{
	/**
	 * 名称
	 */
	name:String;
	/**
	 * 控制域
	 */
	span:Span;
	/**
	 * 其余一些你想添加的东西
	 */
	details?:any;
}
export class LinkNode<N> implements Node{

	data :N|undefined;

	next:LinkNode<N>|undefined ;

	pre:Node|undefined ;

	constructor(element:N){ this.data = element;}
}
/**
 * 这是一个带头结点的链表
 */
export class LinkedList<T>implements LinkList<T>{
	/**
	 * 头结点
	 */
	head:HeadNode;
	headInfo:HeadNodeData;
	length:number;
	end:LinkNode<T>|undefined;

	constructor(headInfo:HeadNodeData){
		this.head = new HeadNode(headInfo);
		this.headInfo = this.head.data;
		this.length = 0 ;
	}
	/**
	 * 请使用回调函数改变头节点内容。
	 * @param cb 回调函数
	 */
	changeHeadValue(cb:()=>void){
		cb.call(this.head);
	}
	getHeadData(){
		return this.head.data;
	}
	getEnd():T|undefined{
		if(this.end ){
			return this.end.data;
		}
		return;
	}
	insertNode(newElement:T,node?:Node):LinkNode<T>{
		let _newnode = new LinkNode(newElement);
		if(node){
			let p = node.next;
			node.next = _newnode;
			_newnode.pre = node;
			_newnode.next = p;
			if(p){
				p.pre = _newnode;
			}
		}
		else{
			if(this.end){
				this.end.next = _newnode;
				_newnode.pre = this.end;
			}else{
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
	insetLinkList(list:LinkList<T>,node?:Node){
		if(!list.end){
			return;
		}
		if(this.end){
			if(node){
				let p = node.next;
				node.next = list.head.next;
				list.head.next!.pre = node;
				if(p)
					p.pre = list.end;
			}else{
				if(this.end){
					this.end.next = list.head.next;
					list.head.next!.pre = this.end;

				}else{
					this.head.next = list.head.next;
					list.head.pre = this.head;
				}
			}
			this.end = list.end;
			this.length+=list.length;
		}
	}
	getElement(cb?:(param:T,data?:any)=>any,param?:T):T|undefined{
		let _node = this.head.next;
		if(this.length<=0||(!cb&&!param)){
			return;
		}
		if(!param&&cb){
			while(_node){
				if(cb(_node.data)){
					return _node.data;
				}
				_node = _node.next;
			}
		}
		else if(!cb&&param){
			while(_node){
				if(this.objectDeepEqual(param,_node.data)){
					return _node.data;
				}
				_node = _node.next;
			}
		}else{
			while(_node){
				if(cb!(_node.data)&&this.objectDeepEqual(param,_node.data))
					return _node.data;
				_node = _node.next;
			}
		}
		return;
	}
	//TODO: 完成function函数
	filter(fun:Function){

	}
	get(param:number):Node|undefined{
		let _node = this.head.next;
		while(_node!=null&&param>0){
			_node = _node.next;
		}
		if(_node=== null){
			throw Error(`IndecOutOfArrayException!!!!`);
		}
		return _node;
	}
	toArray():T[]{
		let res:T[] = [];
		let _node = this.head.next;
		while(_node!=null){
			res.push(_node.data);
			_node = _node.next;
		}
		return res;
	}
	getEach(cb?:(elment:T)=>any):any[]{
		if(!cb){
			return [];
		}
		let _result = [];
		let _node = this.head.next;
		while(_node){
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
	changeNodeWithAction(action:(node:T)=>void,node?:LinkNode<T>):void{
		
		let _node = this.head.next;
		if(node)
		 _node = node;

		while(_node!=null){
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
	popAndShiftWithAction(node:Node,action?:(node:Node)=>boolean):boolean{
		let _node:Node|undefined = node;
	
		while(_node?.next){
			if(action){
				if(!action(_node.data)){ return false;}
			}
			_node = _node.next;
		}
		if(action){
			if(!action(_node.data)){ 
				return false;
			}
		}
		node.pre!.next=undefined;
		_node.pre=this.head;
		let p = this.head.next;
		this.head.next = node;
		_node.next = p;
		p!.pre = _node;
		return true;
	}

	objectDeepEqual(obj1:any, obj2:any) {
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
	unshift():T|undefined{
		if(this.length>0){
			let _nodedata = this.head.next?.data;
			this.head.next = this.head.next!.next;
			if(this.head.next){
			this.head.next.pre = this.head;
			}
			this.length--;
			return _nodedata;

		}
	}
	toJSON =()=>{
		return {info:this.headInfo,array:this.toArray()};
	}

}
