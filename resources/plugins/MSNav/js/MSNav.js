function MSNav(oParent, sClass){
	var aElem = oParent.getElementsByTagName('*');
	var aClass = [];
	var i = 0;
	for(i=0;i<aElem.length;i++)if(aElem[i].className == sClass)aClass.push(aElem[i]);
	return aClass;
};
function msNavCss(obj, attr, value){
	if(arguments.length == 2){
		var style = obj.style,
			currentStyle = obj.currentStyle;
		if(typeof attr === 'string')return currentStyle ? currentStyle[attr] : getComputedStyle(obj, false)[attr];
		for(var propName in attr)propName == 'opacity' ? (style.filter = "alpha(opacity=" + attr[propName] + ")", style.opacity = attr[propName] / 100) : style[propName] = attr[propName]; 
	}else if(arguments.length == 3){
		switch(attr){
			case "width":
			case "height":
			case "paddingTop":
			case "paddingRight":
			case "paddingBottom":
			case "paddingLeft":
			case "top":
			case "right":
			case "bottom":
			case "left":
			case "marginTop":
			case "marginRigth":
			case "marginBottom":
			case "marginLeft":
				obj.style[attr] = value + "px";
				break;
			case "opacity":
				obj.style.filter = "alpha(opacity=" + value + ")";
				obj.style.opacity = value / 100;
				break;
			default:
				obj.style[attr] = value;
		}
	}
};
function msNavExtend(destination, source){
	for (var propName in source) destination[propName] = source[propName];
	return destination;
};
function msNavDoMove(obj, json, fnEnd){
	clearInterval(obj.timer);
	obj.iSpeed = 0;
	fnEnd = msNavExtend({
		type: "buffer",
		callback: function() {}
	}, fnEnd);
	obj.timer = setInterval(function(){
		var iCur = 0,
			iStop = true;
		for(var propName in json){
			iCur = parseFloat(msNavCss(obj, propName));
			propName == 'opacity' && (iCur = Math.round(iCur * 100));
			switch(fnEnd.type){
				case 'buffer':
					obj.iSpeed = (json[propName] - iCur) / 3;
					obj.iSpeed = obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
					json[propName] == iCur || (iStop = false, msNavCss(obj, propName, iCur + obj.iSpeed));
					break;
				case 'elasticity':
					obj.iSpeed += (json[propName] - iCur) / 3;
					obj.iSpeed *= 0.75;
					Math.abs(json[propName] - iCur) <= 1 &&  Math.abs(obj.iSpeed) <= 1 ? msNavCss(obj, propName, json[propName]) : msNavCss(obj, propName, json[propName]) || (iStop = false, msNavCss(obj, propName, iCur + obj.iSpeed));
					break;
				case 'accelerate':
					obj.iSpeed = obj.iSpeed + 3;
					iCur >= json[propName] ? msNavCss(obj, propName, json[propName]) : msNavCss(obj, propName, json[propName]) || (iStop = false, msNavCss(obj, propName, iCur + obj.iSpeed));
				break;
			}
		}
		if(iStop){
			clearInterval(obj.timer);
			obj.timer = null;
			obj.iSpeed = 0;
			fnEnd.callback();	
		}
	},30);
};