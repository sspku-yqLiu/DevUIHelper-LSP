
import { SupportComponentName } from '../yq-Parser/type';
import { MarkUpBuilder } from '../../util';

export function getPrefix(name:string,comName:SupportComponentName):string{
	switch (comName) {
		case SupportComponentName.DevUI :
			return getPrefixForDevUI(name);
			break;
		default:
			break;
	}
	return "";
}
export function getcomNameFromPrefix(prefix:string):SupportComponentName|undefined{
	switch(prefix){
		case 'd': return SupportComponentName.DevUI;
	}
}
export function getTagPrefixFromComName(comName:SupportComponentName,directive=false):string|undefined{
	switch(comName){
		case SupportComponentName.DevUI:return directive?'d':'d-';
	}
}
export function getPrefixForDevUI(name:string):string{
	let result= "";
	if(name.indexOf('-')===-1){
		result = 'd'+name.replace(/[a-z]/g,"");
		if(result.length<2){
			result =  name.substring(1,4);
		}
	}else{
		result = name.substring(2).split('-').map(e=>(e.charAt(0))).join('');
		if(result.length<2){
			result =  name.substring(2,5);
		}
	}
	return result.toLowerCase();
}

//致敬ng-zorro的snippet插件
//这里使用了相同的函数名，但是内部实现不同
export function getComponentMarkDownString(useDescription:boolean=false):MarkUpBuilder{
	let res = new MarkUpBuilder();
	if(this.description&&useDescription){
		res.addContent(`- 简介`);
		res.addContent(this.description);
	}
	if(this.tmw){
		res.addContent(`- 何时使用`);
		res.addContent(this.tmw);
	}
	return res;
}
export function getComponentHoverInfo():MarkUpBuilder{
	let res = getComponentMarkDownString.call(this,true);
	if(this.subNodes.length>0){
		res.addContent(`- 属性和事件`);
		this.subNodes.forEach(attr => {
			res.addContent(`>\`${attr.getName()}\`:${attr.getSortDescription()}`) ;
		});
	}
	return res;
}
export function getAttributeMarkDownString(useType:boolean=false){
	const source = this.fatherPointer?this.fatherPointer.getName():"";
	return new MarkUpBuilder().addContent(source?`- From ${source}`:""+`${this.description}`).
	addCodeBlock('typescript', [
				useType?`type: ${this.type}`:"",
				`Description:${this.description}`,
                `DefaultValue: ${this.getDefaultValue()}`,
                `value: ${this.valueSet.length>0?'['+this.valueSet+']':'any'}`]); 
}
export function getAttributeHoverInfo(){
	return getAttributeMarkDownString.call(this,true);
}