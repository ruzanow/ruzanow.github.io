// ==UserScript==
// @name Let me see where images
// @author Lex1
// @version 1.5.9
// @description Improves "cached images" mode. Replaces empty alt attributes and copies alt attributes to the title.
// @ujs:documentation http://ruzanow.ru/index/0-5
// @ujs:download http://ruzanow.ru/userjs/let-me-see-img.js
// ==/UserScript==

window.addEventListener('load', function(){
	var imgs = document.images || document.getElementsByTagName('img');
	if(!imgs || imgs.length > 3000)return;
	var altTxt = !window.postMessage ? '&nbsp;&nbsp;&nbsp;' : (navigator.language == 'ru' ? '\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435' : 'Image');
	for(var i = 0, img; img = imgs[i]; i++){
		var imgAlt = img.getAttribute('alt');
		if(imgAlt){
			if(!img.complete && imgAlt.length > 20 && !img.hasAttribute('width'))img.setAttribute('alt', imgAlt.slice(0, 20) + '\u2026');
			if(!img.hasAttribute('title'))img.setAttribute('title', imgAlt);
		}
		else{
			if(!img.complete && (img.hasAttribute('alt') != (img.hasAttribute('width') && img.hasAttribute('height'))))img.setAttribute('alt', altTxt);
		}
	}
}, false);