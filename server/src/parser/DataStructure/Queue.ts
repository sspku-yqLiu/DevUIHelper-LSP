import { LinkedList,Node } from './LinkList';
import { Span } from './type';

/*
 * @Author: your name
 * @Date: 2020-05-03 18:24:23
 * @LastEditTime: 2020-05-12 21:29:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \UI_Components_Helper\server\src\dataStructor\Stack.ts
 */

export class Queue<T> extends LinkedList<T>{
	constructor(){
		super({name:'Queue',span:new Span(-1,-1)});
	}
	find(cb?:()=>any,param?:T):T|undefined{
		return super.getElement(cb,param);
	}
	moveTotail(node:Node){
		if(!node.next){
			return;
		}
		if(node.next){
			node.pre!.next = node.next;
			node.next!.pre = node.pre;
		}
		this.end!.next = node;
		node.pre=this.end;
		this.end = node;
	}
	popWithShift(element:T,len:number){
		this.insertNode(element);
		if(this.length>=len){
			this.shift();
		}
	}
	shift(){
		if(this.length>1){
			this.head.next = this.head.next!.next;
			this.head.next!.pre=this.head;
			this.length--;
		}
	}
}

