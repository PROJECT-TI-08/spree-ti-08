/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(t){function e(e,o){var n,s,r,a=e.nodeName.toLowerCase();return"area"===a?(n=e.parentNode,s=n.name,e.href&&s&&"map"===n.nodeName.toLowerCase()?(r=t("img[usemap='#"+s+"']")[0],!!r&&i(r)):!1):(/^(input|select|textarea|button|object)$/.test(a)?!e.disabled:"a"===a?e.href||o:o)&&i(e)}function i(e){return t.expr.filters.visible(e)&&!t(e).parents().addBack().filter(function(){return"hidden"===t.css(this,"visibility")}).length}t.ui=t.ui||{},t.extend(t.ui,{version:"1.11.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),t.fn.extend({scrollParent:function(e){var i=this.css("position"),o="absolute"===i,n=e?/(auto|scroll|hidden)/:/(auto|scroll)/,s=this.parents().filter(function(){var e=t(this);return o&&"static"===e.css("position")?!1:n.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==i&&s.length?s:t(this[0].ownerDocument||document)},uniqueId:function(){var t=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++t)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&t(this).removeAttr("id")})}}),t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,o){return!!t.data(e,o[3])},focusable:function(i){return e(i,!isNaN(t.attr(i,"tabindex")))},tabbable:function(i){var o=t.attr(i,"tabindex"),n=isNaN(o);return(n||o>=0)&&e(i,!n)}}),t("<a>").outerWidth(1).jquery||t.each(["Width","Height"],function(e,i){function o(e,i,o,s){return t.each(n,function(){i-=parseFloat(t.css(e,"padding"+this))||0,o&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),s&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],s=i.toLowerCase(),r={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};t.fn["inner"+i]=function(e){return void 0===e?r["inner"+i].call(this):this.each(function(){t(this).css(s,o(this,e)+"px")})},t.fn["outer"+i]=function(e,n){return"number"!=typeof e?r["outer"+i].call(this,e):this.each(function(){t(this).css(s,o(this,e,!0,n)+"px")})}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(t.fn.removeData=function(e){return function(i){return arguments.length?e.call(this,t.camelCase(i)):e.call(this)}}(t.fn.removeData)),t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),t.fn.extend({focus:function(e){return function(i,o){return"number"==typeof i?this.each(function(){var e=this;setTimeout(function(){t(e).focus(),o&&o.call(e)},i)}):e.apply(this,arguments)}}(t.fn.focus),disableSelection:function(){var t="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.bind(t+".ui-disableSelection",function(t){t.preventDefault()})}}(),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(e){if(void 0!==e)return this.css("zIndex",e);if(this.length)for(var i,o,n=t(this[0]);n.length&&n[0]!==document;){if(i=n.css("position"),("absolute"===i||"relative"===i||"fixed"===i)&&(o=parseInt(n.css("zIndex"),10),!isNaN(o)&&0!==o))return o;n=n.parent()}return 0}}),t.ui.plugin={add:function(e,i,o){var n,s=t.ui[e].prototype;for(n in o)s.plugins[n]=s.plugins[n]||[],s.plugins[n].push([i,o[n]])},call:function(t,e,i,o){var n,s=t.plugins[e];if(s&&(o||t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType))for(n=0;n<s.length;n++)t.options[s[n][0]]&&s[n][1].apply(t.element,i)}}}),/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(t){var e=0,i=Array.prototype.slice;return t.cleanData=function(e){return function(i){var o,n,s;for(s=0;null!=(n=i[s]);s++)try{o=t._data(n,"events"),o&&o.remove&&t(n).triggerHandler("remove")}catch(r){}e(i)}}(t.cleanData),t.widget=function(e,i,o){var n,s,r,a,l={},u=e.split(".")[0];return e=e.split(".")[1],n=u+"-"+e,o||(o=i,i=t.Widget),t.expr[":"][n.toLowerCase()]=function(e){return!!t.data(e,n)},t[u]=t[u]||{},s=t[u][e],r=t[u][e]=function(t,e){return this._createWidget?void(arguments.length&&this._createWidget(t,e)):new r(t,e)},t.extend(r,s,{version:o.version,_proto:t.extend({},o),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(o,function(e,o){return t.isFunction(o)?void(l[e]=function(){var t=function(){return i.prototype[e].apply(this,arguments)},n=function(t){return i.prototype[e].apply(this,t)};return function(){var e,i=this._super,s=this._superApply;return this._super=t,this._superApply=n,e=o.apply(this,arguments),this._super=i,this._superApply=s,e}}()):void(l[e]=o)}),r.prototype=t.widget.extend(a,{widgetEventPrefix:s?a.widgetEventPrefix||e:e},l,{constructor:r,namespace:u,widgetName:e,widgetFullName:n}),s?(t.each(s._childConstructors,function(e,i){var o=i.prototype;t.widget(o.namespace+"."+o.widgetName,r,i._proto)}),delete s._childConstructors):i._childConstructors.push(r),t.widget.bridge(e,r),r},t.widget.extend=function(e){for(var o,n,s=i.call(arguments,1),r=0,a=s.length;a>r;r++)for(o in s[r])n=s[r][o],s[r].hasOwnProperty(o)&&void 0!==n&&(t.isPlainObject(n)?e[o]=t.isPlainObject(e[o])?t.widget.extend({},e[o],n):t.widget.extend({},n):e[o]=n);return e},t.widget.bridge=function(e,o){var n=o.prototype.widgetFullName||e;t.fn[e]=function(s){var r="string"==typeof s,a=i.call(arguments,1),l=this;return r?this.each(function(){var i,o=t.data(this,n);return"instance"===s?(l=o,!1):o?t.isFunction(o[s])&&"_"!==s.charAt(0)?(i=o[s].apply(o,a),i!==o&&void 0!==i?(l=i&&i.jquery?l.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+s+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; attempted to call method '"+s+"'")}):(a.length&&(s=t.widget.extend.apply(null,[s].concat(a))),this.each(function(){var e=t.data(this,n);e?(e.option(s||{}),e._init&&e._init()):t.data(this,n,new o(s,this))})),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(i,o){o=t(o||this.defaultElement||this)[0],this.element=t(o),this.uuid=e++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),o!==this&&(t.data(o,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===o&&this.destroy()}}),this.document=t(o.style?o.ownerDocument:o.document||o),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),i),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:t.noop,_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var o,n,s,r=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(r={},o=e.split("."),e=o.shift(),o.length){for(n=r[e]=t.widget.extend({},this.options[e]),s=0;s<o.length-1;s++)n[o[s]]=n[o[s]]||{},n=n[o[s]];if(e=o.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];r[e]=i}return this._setOptions(r),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!e),e&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(e,i,o){var n,s=this;"boolean"!=typeof e&&(o=i,i=e,e=!1),o?(i=n=t(i),this.bindings=this.bindings.add(i)):(o=i,i=this.element,n=this.widget()),t.each(o,function(o,r){function a(){return e||s.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof r?s[r]:r).apply(s,arguments):void 0}"string"!=typeof r&&(a.guid=r.guid=r.guid||a.guid||t.guid++);var l=o.match(/^([\w:-]*)\s*(.*)$/),u=l[1]+s.eventNamespace,d=l[2];d?n.delegate(d,u,a):i.bind(u,a)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(i).undelegate(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?o[t]:t).apply(o,arguments)}var o=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){t(e.currentTarget).addClass("ui-state-hover")},mouseleave:function(e){t(e.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){t(e.currentTarget).addClass("ui-state-focus")},focusout:function(e){t(e.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(e,i,o){var n,s,r=this.options[e];if(o=o||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],s=i.originalEvent)for(n in s)n in i||(i[n]=s[n]);return this.element.trigger(i,o),!(t.isFunction(r)&&r.apply(this.element[0],[i].concat(o))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(o,n,s){"string"==typeof n&&(n={effect:n});var r,a=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),r=!t.isEmptyObject(n),n.complete=s,n.delay&&o.delay(n.delay),r&&t.effects&&t.effects.effect[a]?o[e](n):a!==e&&o[a]?o[a](n.duration,n.easing,s):o.queue(function(i){t(this)[e](),s&&s.call(o[0]),i()})}}),t.widget}),/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(t){return function(){function e(t,e,i){return[parseFloat(t[0])*(f.test(t[0])?e/100:1),parseFloat(t[1])*(f.test(t[1])?i/100:1)]}function i(e,i){return parseInt(t.css(e,i),10)||0}function o(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var n,s,r=Math.max,a=Math.abs,l=Math.round,u=/left|center|right/,d=/top|center|bottom/,h=/[\+\-]\d+(\.[\d]+)?%?/,c=/^\w+/,f=/%$/,p=t.fn.position;t.position={scrollbarWidth:function(){if(void 0!==n)return n;var e,i,o=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),s=o.children()[0];return t("body").append(o),e=s.offsetWidth,o.css("overflow","scroll"),i=s.offsetWidth,e===i&&(i=o[0].clientWidth),o.remove(),n=e-i},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),o=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,s="scroll"===o||"auto"===o&&e.height<e.element[0].scrollHeight;return{width:s?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),o=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:o,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:o||n?i.width():i.outerWidth(),height:o||n?i.height():i.outerHeight()}}},t.fn.position=function(n){if(!n||!n.of)return p.apply(this,arguments);n=t.extend({},n);var f,g,m,v,y,b,w=t(n.of),_=t.position.getWithinInfo(n.within),x=t.position.getScrollInfo(_),W=(n.collision||"flip").split(" "),C={};return b=o(w),w[0].preventDefault&&(n.at="left top"),g=b.width,m=b.height,v=b.offset,y=t.extend({},v),t.each(["my","at"],function(){var t,e,i=(n[this]||"").split(" ");1===i.length&&(i=u.test(i[0])?i.concat(["center"]):d.test(i[0])?["center"].concat(i):["center","center"]),i[0]=u.test(i[0])?i[0]:"center",i[1]=d.test(i[1])?i[1]:"center",t=h.exec(i[0]),e=h.exec(i[1]),C[this]=[t?t[0]:0,e?e[0]:0],n[this]=[c.exec(i[0])[0],c.exec(i[1])[0]]}),1===W.length&&(W[1]=W[0]),"right"===n.at[0]?y.left+=g:"center"===n.at[0]&&(y.left+=g/2),"bottom"===n.at[1]?y.top+=m:"center"===n.at[1]&&(y.top+=m/2),f=e(C.at,g,m),y.left+=f[0],y.top+=f[1],this.each(function(){var o,u,d=t(this),h=d.outerWidth(),c=d.outerHeight(),p=i(this,"marginLeft"),b=i(this,"marginTop"),T=h+p+i(this,"marginRight")+x.width,E=c+b+i(this,"marginBottom")+x.height,N=t.extend({},y),D=e(C.my,d.outerWidth(),d.outerHeight());"right"===n.my[0]?N.left-=h:"center"===n.my[0]&&(N.left-=h/2),"bottom"===n.my[1]?N.top-=c:"center"===n.my[1]&&(N.top-=c/2),N.left+=D[0],N.top+=D[1],s||(N.left=l(N.left),N.top=l(N.top)),o={marginLeft:p,marginTop:b},t.each(["left","top"],function(e,i){t.ui.position[W[e]]&&t.ui.position[W[e]][i](N,{targetWidth:g,targetHeight:m,elemWidth:h,elemHeight:c,collisionPosition:o,collisionWidth:T,collisionHeight:E,offset:[f[0]+D[0],f[1]+D[1]],my:n.my,at:n.at,within:_,elem:d})}),n.using&&(u=function(t){var e=v.left-N.left,i=e+g-h,o=v.top-N.top,s=o+m-c,l={target:{element:w,left:v.left,top:v.top,width:g,height:m},element:{element:d,left:N.left,top:N.top,width:h,height:c},horizontal:0>i?"left":e>0?"right":"center",vertical:0>s?"top":o>0?"bottom":"middle"};h>g&&a(e+i)<g&&(l.horizontal="center"),c>m&&a(o+s)<m&&(l.vertical="middle"),r(a(e),a(i))>r(a(o),a(s))?l.important="horizontal":l.important="vertical",n.using.call(this,t,l)}),d.offset(t.extend(N,{using:u}))})},t.ui.position={fit:{left:function(t,e){var i,o=e.within,n=o.isWindow?o.scrollLeft:o.offset.left,s=o.width,a=t.left-e.collisionPosition.marginLeft,l=n-a,u=a+e.collisionWidth-s-n;e.collisionWidth>s?l>0&&0>=u?(i=t.left+l+e.collisionWidth-s-n,t.left+=l-i):u>0&&0>=l?t.left=n:l>u?t.left=n+s-e.collisionWidth:t.left=n:l>0?t.left+=l:u>0?t.left-=u:t.left=r(t.left-a,t.left)},top:function(t,e){var i,o=e.within,n=o.isWindow?o.scrollTop:o.offset.top,s=e.within.height,a=t.top-e.collisionPosition.marginTop,l=n-a,u=a+e.collisionHeight-s-n;e.collisionHeight>s?l>0&&0>=u?(i=t.top+l+e.collisionHeight-s-n,t.top+=l-i):u>0&&0>=l?t.top=n:l>u?t.top=n+s-e.collisionHeight:t.top=n:l>0?t.top+=l:u>0?t.top-=u:t.top=r(t.top-a,t.top)}},flip:{left:function(t,e){var i,o,n=e.within,s=n.offset.left+n.scrollLeft,r=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,u=t.left-e.collisionPosition.marginLeft,d=u-l,h=u+e.collisionWidth-r-l,c="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,f="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,p=-2*e.offset[0];0>d?(i=t.left+c+f+p+e.collisionWidth-r-s,(0>i||i<a(d))&&(t.left+=c+f+p)):h>0&&(o=t.left-e.collisionPosition.marginLeft+c+f+p-l,(o>0||a(o)<h)&&(t.left+=c+f+p))},top:function(t,e){var i,o,n=e.within,s=n.offset.top+n.scrollTop,r=n.height,l=n.isWindow?n.scrollTop:n.offset.top,u=t.top-e.collisionPosition.marginTop,d=u-l,h=u+e.collisionHeight-r-l,c="top"===e.my[1],f=c?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,p="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>d?(o=t.top+f+p+g+e.collisionHeight-r-s,(0>o||o<a(d))&&(t.top+=f+p+g)):h>0&&(i=t.top-e.collisionPosition.marginTop+f+p+g-l,(i>0||a(i)<h)&&(t.top+=f+p+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,o,n,r,a=document.getElementsByTagName("body")[0],l=document.createElement("div");e=document.createElement(a?"div":"body"),o={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},a&&t.extend(o,{position:"absolute",left:"-1000px",top:"-1000px"});for(r in o)e.style[r]=o[r];e.appendChild(l),i=a||document.documentElement,i.insertBefore(e,i.firstChild),l.style.cssText="position: absolute; left: 10.7432222px;",n=t(l).offset().left,s=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()}(),t.ui.position}),/*!
 * jQuery UI Tooltip 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/tooltip/
 */
function(t){"function"==typeof define&&define.amd?define(["jquery","./core","./widget","./position"],t):t(jQuery)}(function(t){return t.widget("ui.tooltip",{version:"1.11.4",options:{content:function(){var e=t(this).attr("title")||"";return t("<a>").text(e).html()},hide:!0,items:"[title]:not([disabled])",position:{my:"left top+15",at:"left bottom",collision:"flipfit flip"},show:!0,tooltipClass:null,track:!1,close:null,open:null},_addDescribedBy:function(e,i){var o=(e.attr("aria-describedby")||"").split(/\s+/);o.push(i),e.data("ui-tooltip-id",i).attr("aria-describedby",t.trim(o.join(" ")))},_removeDescribedBy:function(e){var i=e.data("ui-tooltip-id"),o=(e.attr("aria-describedby")||"").split(/\s+/),n=t.inArray(i,o);-1!==n&&o.splice(n,1),e.removeData("ui-tooltip-id"),o=t.trim(o.join(" ")),o?e.attr("aria-describedby",o):e.removeAttr("aria-describedby")},_create:function(){this._on({mouseover:"open",focusin:"open"}),this.tooltips={},this.parents={},this.options.disabled&&this._disable(),this.liveRegion=t("<div>").attr({role:"log","aria-live":"assertive","aria-relevant":"additions"}).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body)},_setOption:function(e,i){var o=this;return"disabled"===e?(this[i?"_disable":"_enable"](),void(this.options[e]=i)):(this._super(e,i),void("content"===e&&t.each(this.tooltips,function(t,e){o._updateContent(e.element)})))},_disable:function(){var e=this;t.each(this.tooltips,function(i,o){var n=t.Event("blur");n.target=n.currentTarget=o.element[0],e.close(n,!0)}),this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.is("[title]")&&e.data("ui-tooltip-title",e.attr("title")).removeAttr("title")})},_enable:function(){this.element.find(this.options.items).addBack().each(function(){var e=t(this);e.data("ui-tooltip-title")&&e.attr("title",e.data("ui-tooltip-title"))})},open:function(e){var i=this,o=t(e?e.target:this.element).closest(this.options.items);o.length&&!o.data("ui-tooltip-id")&&(o.attr("title")&&o.data("ui-tooltip-title",o.attr("title")),o.data("ui-tooltip-open",!0),e&&"mouseover"===e.type&&o.parents().each(function(){var e,o=t(this);o.data("ui-tooltip-open")&&(e=t.Event("blur"),e.target=e.currentTarget=this,i.close(e,!0)),o.attr("title")&&(o.uniqueId(),i.parents[this.id]={element:this,title:o.attr("title")},o.attr("title",""))}),this._registerCloseHandlers(e,o),this._updateContent(o,e))},_updateContent:function(t,e){var i,o=this.options.content,n=this,s=e?e.type:null;return"string"==typeof o?this._open(e,t,o):(i=o.call(t[0],function(i){n._delay(function(){t.data("ui-tooltip-open")&&(e&&(e.type=s),this._open(e,t,i))})}),void(i&&this._open(e,t,i)))},_open:function(e,i,o){function n(t){u.of=t,r.is(":hidden")||r.position(u)}var s,r,a,l,u=t.extend({},this.options.position);if(o){if(s=this._find(i))return void s.tooltip.find(".ui-tooltip-content").html(o);i.is("[title]")&&(e&&"mouseover"===e.type?i.attr("title",""):i.removeAttr("title")),s=this._tooltip(i),r=s.tooltip,this._addDescribedBy(i,r.attr("id")),r.find(".ui-tooltip-content").html(o),this.liveRegion.children().hide(),o.clone?(l=o.clone(),l.removeAttr("id").find("[id]").removeAttr("id")):l=o,t("<div>").html(l).appendTo(this.liveRegion),this.options.track&&e&&/^mouse/.test(e.type)?(this._on(this.document,{mousemove:n}),n(e)):r.position(t.extend({of:i},this.options.position)),r.hide(),this._show(r,this.options.show),this.options.show&&this.options.show.delay&&(a=this.delayedShow=setInterval(function(){r.is(":visible")&&(n(u.of),clearInterval(a))},t.fx.interval)),this._trigger("open",e,{tooltip:r})}},_registerCloseHandlers:function(e,i){var o={keyup:function(e){if(e.keyCode===t.ui.keyCode.ESCAPE){var o=t.Event(e);o.currentTarget=i[0],this.close(o,!0)}}};i[0]!==this.element[0]&&(o.remove=function(){this._removeTooltip(this._find(i).tooltip)}),e&&"mouseover"!==e.type||(o.mouseleave="close"),e&&"focusin"!==e.type||(o.focusout="close"),this._on(!0,i,o)},close:function(e){var i,o=this,n=t(e?e.currentTarget:this.element),s=this._find(n);return s?(i=s.tooltip,void(s.closing||(clearInterval(this.delayedShow),n.data("ui-tooltip-title")&&!n.attr("title")&&n.attr("title",n.data("ui-tooltip-title")),this._removeDescribedBy(n),s.hiding=!0,i.stop(!0),this._hide(i,this.options.hide,function(){o._removeTooltip(t(this))}),n.removeData("ui-tooltip-open"),this._off(n,"mouseleave focusout keyup"),n[0]!==this.element[0]&&this._off(n,"remove"),this._off(this.document,"mousemove"),e&&"mouseleave"===e.type&&t.each(this.parents,function(e,i){t(i.element).attr("title",i.title),delete o.parents[e]}),s.closing=!0,this._trigger("close",e,{tooltip:i}),s.hiding||(s.closing=!1)))):void n.removeData("ui-tooltip-open")},_tooltip:function(e){var i=t("<div>").attr("role","tooltip").addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content "+(this.options.tooltipClass||"")),o=i.uniqueId().attr("id");return t("<div>").addClass("ui-tooltip-content").appendTo(i),i.appendTo(this.document[0].body),this.tooltips[o]={element:e,tooltip:i}},_find:function(t){var e=t.data("ui-tooltip-id");return e?this.tooltips[e]:null},_removeTooltip:function(t){t.remove(),delete this.tooltips[t.attr("id")]},_destroy:function(){var e=this;t.each(this.tooltips,function(i,o){var n=t.Event("blur"),s=o.element;n.target=n.currentTarget=s[0],e.close(n,!0),t("#"+i).remove(),s.data("ui-tooltip-title")&&(s.attr("title")||s.attr("title",s.data("ui-tooltip-title")),s.removeData("ui-tooltip-title"))}),this.liveRegion.remove()}})});