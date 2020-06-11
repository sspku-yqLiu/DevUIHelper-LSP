
import { SupportComponentName } from '../type';

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