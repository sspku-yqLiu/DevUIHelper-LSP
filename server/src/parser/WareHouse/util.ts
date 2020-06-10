
import { SupportComponentName } from '../type';

export function getPrefix(name:string,comName:SupportComponentName):string{
	switch (comName) {
		case SupportComponentName.DevUI :
			return name.indexOf('-')===-1?name.substring(1,4):name.substring(2).split('-').map(e=>(e.charAt(0))).join('');
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
export function getTagPrefixFromComName(comName:SupportComponentName):string|undefined{
	switch(comName){
		case SupportComponentName.DevUI:return 'd-';
	}
}