// ==UserScript==
// @name Block external scripts
// @author Lex1
// @version 1.3.11
// @description Block external scripts and document.write (usually used for js-ads).
// @include http://*
// @exclude http://*youtube.com/*
// @exclude http://*metacafe.com/*
// @exclude http://vimeo.com/*
// @exclude http://www.piter.fm/*
// @exclude http://*lastfm.ru/*
// @exclude http://*facebook.com/*
// @exclude http://*vk.com/*
// @exclude http://*myspace.com/*
// @exclude http://twitter.com/*
// @exclude http://*flickr.com/*
// @exclude http://*deviantart.com/*
// @exclude http://*ebay.com/*
// @exclude http://*wikipedia.org/*
// @exclude http://*yahoo.com/*
// @exclude http://*.ya.ru/*
// @exclude http://*hotmail.com/*
// @exclude http://*imageshack.us*
// @exclude http://*britannica.com/*
// @exclude http://*bbc.co.uk/*
// @exclude http://*cnn.com/*
// @exclude http://*opera.com/*
// @exclude http://*eurosport.ru/*
// @exclude http://*newegg.com/*
// @exclude http://*livegames.ru/*
// @exclude http://picasaweb.google.com/*
// @exclude http://playset.ru/*
// @exclude http://molotok.ru/*
// @exclude http://kinozal.tv/*
// @exclude http://tvshack.net/*
// @exclude http://megashare.by/*
// @exclude http://anonym.to/*
// @exclude http://www.macromedia.com/*
// @exclude http://example.com/*
// ==/UserScript==

(function(){
	var skip = '^data:|^http://ajax.googleapis.com/|^http://www.google.com/jsapi|^http://maps.google.com/|^http://www.google.com/recaptcha/'
	+ '|^http://[0-9a-z-]+.gstatic.com/|^http://[0-9a-z-]+.appspot.com/|^http://yui.yahooapis.com/|^http://script.aculo.us/'
	+ '|^http://ipinfodb.com/|^http://api.recaptcha.net/|^http://rutube.ru/|^http://css.yandex.net/|^http://api-maps.yandex.ru/'
	+ '|^http://s\\d+.addthis.com/js/|^http://s\\d+.ucoz.net/src/u.js|^http://[0-9a-z-]+.imgsmail.ru/|^http://62.105.135.100/|^https?://auth.tbn.ru'
	+ '|swfobject.js$|show_afs_search.js$|chart.js$|ajax.js$|widgets.js$|common.js$|AC_RunActiveContent.js$|jquery[0-9a-z.-]*.js$';

	var reSkip = new RegExp(skip.replace(/\/|\.(?=\w)/g, '\\$&'), 'i');
	var noreload = true, blocked = '', prefix = 'ujs_block_ext_scripts';

	var getValue = function(name){
		if(window.localStorage){
			return window.localStorage.getItem(name) || '';
		}
		else{
			var eq = name+'=', ca = document.cookie.split(';');
			for(var i = ca.length; i--;){
				var c = ca[i];
				while(c.charAt(0) == ' ')c = c.slice(1);
				if(c.indexOf(eq) == 0)return unescape(c.slice(eq.length));
			};
			return '';
		}
	};
	var setValue = function(name, value, del){
		if(window.localStorage){
			if(del){window.localStorage.removeItem(name)}else{window.localStorage.setItem(name, value)};
		}
		else{
			if(document.cookie.split(';').length < 30 && document.cookie.length-escape(getValue(name)).length+escape(value).length < 4000){
				var date = new Date();
				date.setTime(date.getTime()+((del ? -1 : 10*365)*24*60*60*1000));
				document.cookie = name+'='+escape(value)+'; expires='+date.toGMTString()+'; path=/';
			}
			else{
				alert('Cookies are full!');
			}
		}
	};
	var getTLD = function(domain, full){
		if(!domain)return '';
		var r = domain.match(/^((?:\d{1,3}\.){3})\d{1,3}$/); if(r)return r[1] + '0';
		var a = domain.split('.'), l = a.length; if(l < 2)return domain;
		return full ? a[l - 2] + '.' + a[l - 1] : a[(l > 2 && /^(co|com|net|org|edu|gov|mil|int)$/i.test(a[l - 2])) ? l - 3 : l - 2];
	};

	var createButton = function(){
		var enabled = getValue(prefix) != 'disabled';
		if(enabled && noreload && !blocked)return;
		var ru = window.navigator.language == 'ru';
		var lng_u = ru ? '\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C: ' : 'Unblock: ';
		var lng_d = ru ? '\u0411\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E' : 'Blocking disabled';
		var lng_b = ru ? '\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D' : 'Blocked';
		var lng_s = ru ? '\u0441\u043A\u0440\u0438\u043F\u0442' : 'script';
		var lng_r = ru ? '\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443' : 'This page must be reloaded';
		var count = blocked.split('; ').length;
		if(count > 1){
			if(ru){lng_b += '\u043E'; lng_s += (count > 4) ? '\u043E\u0432' : '\u0430'}else{lng_s += 's'};
		};
		var txt = noreload ? (enabled ? lng_b + ' ' + count + ' ' + lng_s : lng_d) : lng_r;
		var title = (enabled && noreload) ? lng_u + blocked : '';

		var b = document.getElementById(prefix);
		if(b){b.value = txt; b.title = title; return};
		b = document.createElement('input');
		b.type = 'button';
		b.value = txt;
		b.title = title;
		b.id = prefix;
		b.setAttribute('style', 'display:inline-block;position:fixed;visibility:hidden;right:0;bottom:0;width:auto;height:auto;margin:0;padding:1px 8px;font:12px Times New Roman;z-index:9999;cursor:pointer;');
		b.addEventListener('click', function(e){
			if(e.ctrlKey && !e.shiftKey && !e.altKey){alert(lng_b + ':\n\n' + blocked.replace(/; /g, '\n')); return};
			if(noreload){
				if(enabled){setValue(prefix, 'disabled')}else{setValue(prefix, 'enabled', true)};
				this.value = lng_r;
				this.style.width = 'auto';
				noreload = false;
			}
			else{
				window.location.reload(false);
			}
		}, false);
		b.addEventListener('mouseout', function(){this.setAttribute('style', 'visibility:hidden;'); this.parentNode.removeChild(this)}, false);
		(document.body || document.documentElement).appendChild(b);
		var maxWidth = b.offsetWidth;
		b.style.width = 0;
		b.style.visibility = 'visible';
		var timer = window.setInterval(function(){
			var width = parseInt(b.style.width || maxWidth) + 20;
			if(width > maxWidth){clearTimeout(timer); width = maxWidth};
			b.style.width = width + 'px';
		}, 10);
	};

	if(getValue(prefix) != 'disabled'){
		document.write = function(w){
			return function(s){
				if(/<\/?(script|iframe|embed|object)/i.test(s)){
					blocked = /(^.*document\.write\{)(\d+)(\}.*$)/.test(blocked) ? RegExp.$1 + (parseInt(RegExp.$2) + 1) + RegExp.$3 : (blocked ? blocked + '; ' : '') + 'document.write{1}';
					// if(window.opera)window.opera.postError('Blocked: ' + s);
				}
				else{
					w.call(this, s);
				}
			};
		}(document.write);

		window.opera.addEventListener('BeforeExternalScript', function(e){
			var s = e.element.src; if(!s || reSkip.test(s))return;
			var h = window.location.hostname, n = !/\.(com|[a-z]{2})$/.test(h);
			if(getTLD(/^https?:\/\/([^\/]+@)?([^:\/]+)/i.test(s) ? RegExp.$2 : h, n) != getTLD(h, n)){
				e.preventDefault();
				if(blocked.indexOf(s) == -1)blocked += blocked ? '; ' + s : s;
				// if(window.opera)window.opera.postError('On <' + h + '> blocked external script: ' + s);
			}
		}, false);
	};
	document.addEventListener('mousemove', function(e){
		var docEle = (document.compatMode == 'CSS1Compat' && window.postMessage) ? document.documentElement : document.body;
		if(docEle && docEle.clientHeight - e.clientY < 20 && docEle.clientWidth - e.clientX < 40)createButton();
	}, false);
})();