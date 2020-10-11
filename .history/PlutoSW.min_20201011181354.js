window.PlutoComponents=[];class PlutoComponent{constructor(name,data){const arrayChangeMethod=["push","pop","unshift","shift","splice","sort","reverse"],{getOwnPropertyNames:getOwnPropertyNames,getOwnPropertySymbols:getOwnPropertySymbols,defineProperty:defineProperty,getOwnPropertyDescriptor:getOwnPropertyDescriptor}=Object;function isObject(obj){return"object"==typeof obj}function isArray(arr){return Array.isArray(arr)}function isFunction(fn){return"function"==typeof fn}const getOwnKeys=isFunction(getOwnPropertySymbols)?function(obj){return getOwnPropertyNames(obj).concat(getOwnPropertySymbols(obj))}:getOwnPropertyNames;function deepObserve(obj,hook){const mapStore={};let arrayChanging=!1;function wrapProperty(key){let value=obj[key];const desc=getOwnPropertyDescriptor(obj,key);desc&&!1===desc.configurable||defineProperty(obj,key,{get:()=>mapStore[key]?value:((isObject(value)||isArray(value))&&deepObserve(value,hook),mapStore[key]=!0,value),set:val=>(val instanceof PlutoElement==!1&&(isObject(val)||isArray(val))&&deepObserve(val,hook),mapStore[key]=!0,arrayChanging||hook(obj),val),enumerable:desc.enumerable,configurable:!0})}return(isObject(obj)||isArray(obj))&&getOwnKeys(obj).forEach(key=>wrapProperty(key)),isArray(obj)&&arrayChangeMethod.forEach(key=>{const originFn=obj[key];defineProperty(obj,key,{value(...args){const originLength=obj.length;if(arrayChanging=!0,originFn.bind(obj)(...args),arrayChanging=!1,obj.length>originLength){const keys=new Array(obj.length-originLength).fill(1).map((value,index)=>(index+originLength).toString());keys.forEach(key=>wrapProperty(key))}hook(obj)},enumerable:!1,configurable:!0,writable:!0})}),obj}this.element=null,"object"!=typeof name?(window.PlutoComponents[name]=this,this.data=deepObserve(data,newdata=>{var dataDiff=this.calcDiff(newdata,data);this.dataDiff=Object.values(dataDiff),this.onDataChange()})):this.data=deepObserve(name,newdata=>{var dataDiff=this.calcDiff(newdata,data);this.dataDiff=Object.values(dataDiff),this.onDataChange()}),this.onCreate()}calcDiff(o1,o2){var k,kDiff,diff={};for(k in o1)o1.hasOwnProperty(k)&&("object"!=typeof o1[k]||"object"!=typeof o2[k]?k in o2&&o1[k]===o2[k]||void 0!==o2[k]&&(diff[k]=o2[k]):(kDiff=this.calcDiff(o1[k],o2[k]))&&void 0!==kDiff&&(diff[k]=kDiff));for(k in o2)!o2.hasOwnProperty(k)||k in o1||void 0!==o2[k]&&(diff[k]=o2[k]);for(k in diff)if(diff.hasOwnProperty(k))return diff;return!1}onDataChange(){this.element.replace(this._render().element)}onCreate(){}onMount(){}_render(){var observer;return this.element=this.render(),new MutationObserver((mutations,me)=>{if(this.mounted)return this.onMount(this.element),void me.disconnect()}).observe(document,{childList:!0,subtree:!0}),this.element}toString(){return this.render()}}window.PlutoImplements=[],window.PlutoSupportedTags=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","i","iframe","img","input","ins","kbd","label","legend","li","link","main","map","mark","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr"];const Pluto={query:query=>{var query="string"==typeof query?document.querySelector(query):query.nodeType&&query.nodeType===Node.ELEMENT_NODE?query:query instanceof Pluto?query.element:null;return new PlutoElement(query)},jsonHighlight:json=>(json=Pluto.jsonPretty(json).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")).replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,(function(match){var style="color:darkorange;";return/^"/.test(match)?style=/:$/.test(match)?"color:red;":"color:green;":/true|false/.test(match)?style="color:blue;":/null/.test(match)&&(style="color:magenta;"),'<span style="'+style+'">'+match+"</span>"})),jsonPretty:json=>JSON.stringify(json,void 0,4),assign:name=>(window.PlutoSupportedTags.push(name),Pluto[name]=new PlutoElement(name),Pluto[name]),implement:(name,props)=>{PlutoImplements[name]=props},extend:(name,fn)=>{PlutoElement.prototype[name]=fn}};JSON.highlight=Pluto.jsonHighlight,JSON.pretty=Pluto.jsonPretty,window.PlutoSupportedTags.forEach(e=>{Object.defineProperty(Pluto,e,{get(){var element;return PlutoImplements[e]?new PlutoElement(e).props(PlutoImplements[e]):new PlutoElement(e)}})});class PlutoElement{constructor(element){var temp;switch(this.components=[],typeof element){case"string":temp=window.PlutoSupportedTags.includes(element)?document.createElement(element):document.createRange().createContextualFragment(element).firstChild;break;case"object":element.nodeType&&element.nodeType===Node.ELEMENT_NODE?temp=element:element instanceof Pluto&&(temp=element.current)}temp.PlutoSW={},this.element=temp}props(...props){if("string"==typeof props[0])return props[1]?(this.element[props[0]]=props[1],this):this.element[props[0]];props=props[0];for(let r in props)if("object"==typeof props[r])for(let t in props[r])this.element[r][t]=props[r][t];else this.element[r]=props[r];return this}removeAttr(...attrs){if(attrs)return this.element.removeAttribute(...attrs),this}attr(...attrs){if("string"==typeof attrs[0])return attrs[1]?(this.element.setAttribute(attrs[0],attrs[1]),this):this.element.getAttribute(attrs[0]);attrs=attrs[0];for(let r in attrs){var rattrs=attrs[r];if("object"==typeof rattrs){var attrData="";for(let t in rattrs)attrData+=`${t}:${rattrs[t]};`;this.element.setAttribute(r,attrData)}else this.element.setAttribute(r,rattrs)}return this}class(...name){return name?(this.element.classList.add(...name),this):this.element.classList.toString()}removeClass(...name){if(name)return this.element.classList.remove(...name),this}hasClass(name){return!!name&&this.element.classList.contains(name)}remove(){return this.element.remove(),this}style(...css){if("string"==typeof css[0])return css[1]?(this.element.style[css[0]]=css[1],this):this.element.style[css[0]];css=css[0];for(let r in css)this.element.style[r]=css[r];return this}beforeRender(elements){var tempElem=[];return elements.forEach(elem=>{if(elem instanceof PlutoElement)tempElem.push(elem);else{if(elem.props&&void 0!==elem.props&&PlutoComponents[elem.props.name])var component=PlutoComponents[elem.props.name];else{var component=new elem.component(elem.props);this.components.push(component)}component.mounted=!0,tempElem.push(component._render())}}),tempElem}child(...elements){elements=this.beforeRender(elements).map(x=>x.element);try{this.element.append(...elements)}catch(error){console.error(error)}return this}prepend(...elements){elements=this.beforeRender(elements).map(x=>x.element);try{this.element.prepend(...elements)}catch(error){console.error(error)}return this}noClear(){return this.noClearChilds=!0,this}render(...elements){return this.noClearChilds||(this.element.innerHTML="",this.noClearChilds=!1),this.child(...elements),this}renderTo(selector){var parent=Pluto.query(selector);return this.noClearChilds||(parent.element.innerHTML="",this.noClearChilds=!1),parent.child(this),this}text(text){return void 0===text?this.element.innerText:(this.element.innerText=text,this)}value(text){return void 0===text?this.element.value:(this.element.value=text,this)}show(){return this.element.style.display="block",this}hide(){return this.element.style.display="none",this}focus(){return this.element.focus(),this}blur(){return this.element.blur(),this}replace(element){return this.element.replaceWith(element),this.element=element,this}id(id){return id?(this.element.id=id,this):this.element.id}html(html){return void 0===html?this.element.innerHTML:(this.element.innerHTML=html,this)}data(...props){if(!props.length)return this.element.PlutoSW;if("string"==typeof props[0])return props[1]?(this.element.PlutoSW[props[0]]=props[1],this):this.element.PlutoSW[props[0]];props=props[0];for(let r in props)if("object"==typeof props[r])for(let t in props[r])this.element.PlutoSW[r]={},this.element.PlutoSW[r][t]=props[r][t];else this.element.PlutoSW[r]=props[r];return this}on(ev,fn){return fn?this.element.addEventListener(ev,fn.bind(event,this)):this.element[ev](),this}toString(){return this.element.outerHTML}}export{Pluto,PlutoComponent};