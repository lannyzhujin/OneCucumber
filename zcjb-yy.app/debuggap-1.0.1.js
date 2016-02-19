/*
 * 	author: vic wang
 * 	version: 1.0.1
 */
(function(){
	debuggap = {};
	
	var qs = function(q,c){ c = c ? c : document;return c.querySelector(q);};
	var qsa = function(q,c){ c = c ? c : document;return c.querySelectorAll(q);};
	var dg = debuggap;
	dg.css3Prefix = '-webkit-';
	dg.selfClosing = {img: 1, hr: 1, br: 1, area: 1, base: 1, basefont: 1, input: 1, link: 1, meta: 1,
			command: 1, embed: 1, keygen: 1, wbr: 1, param: 1, source: 1, track: 1, col: 1};
	dg.size = function (){
		return {
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	};
	dg.extend = function() {
		var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;
	
		if ( target.constructor == Boolean ) {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
	
		if ( typeof target != "object" && typeof target != "function" )
			target = {};
	
		if ( length == 1 ) {
			target = this;
			i = 0;
		}
	
		for ( ; i < length; i++ )
	
			if ( (options = arguments[ i ]) != null )
	
				for ( var name in options ) {
					if ( target === options[ name ] )
						continue;
	
					if ( deep && options[ name ] && typeof options[ name ] == "object" && target[ name ] && !options[ name ].nodeType )
						target[ name ] = psoft.extend( deep, target[ name ], options[ name ] );
	
					else if ( options[ name ] != undefined )
						target[ name ] = options[ name ];
	
				}
	
		return target;
	};
	dg.css = function( node, param, fun, time ){
		if( typeof param == 'object' ){
			node.length || ( node = [ node ] );
			for( var i=0; i< node.length; i++ ){
				var temp = node[i];
				for( var n in param){
					if( n in temp.style ){
						temp.style[ n ] = param[ n ];
					}else{
						str = ';' + n + ':' + param[n];
						temp.style.cssText += str;
					}
				}
			}
			if( fun ){
				var temp = function(){
					fun(node);
				}
				setTimeout( temp, time );
			}
		}else{
			var style = getComputedStyle(node,null);
			return style.getPropertyValue(param);
		}
	};
	
	dg.class = {
		add:function( node, name ){
			var classes = node.className;
			if( !this.have(node, name) ){
				classes = classes ? ( classes + " " + name ) : name.toString() ;			
				node.setAttribute('class',classes);
			}
		},
		remove:function( node, name ){
			if( name ){
				var classes = node.className;
				classes = classes.replace(name,'').replace( /^\s+|\s+$/g, "" );
				node.setAttribute('class',classes);
			}else{
				node.className='';
			}
		},
		have:function( node, name ){
			var reg = new RegExp("\\b" + name + "\\b" );
			var classes = node.className;
			return reg.exec(classes);
		}
	};
	dg.scale = function( color ){
		var flag;
		if( flag = qs('#debuggapScale') ){
			flag.parentNode.removeChild(flag);
		}
		if( color ){
			conf.scaleColor = color;
		}else{
			color = conf.scaleColor;
		}
		var arr =[
		    ['top, transparent 4px, '+color+' 5px','10px 5px','100%','10px'],
		    ['top, transparent 24px, '+color+' 25px','20px 25px','100%','20px'],
		    ['left, transparent 4px, '+color+' 5px','5px 10px','10px','100%'],
		    ['left, transparent 24px, '+color+' 25px','25px 20px','20px','100%']
		];
		flag = document.createElement('div');
		flag.id = 'debuggapScale';
		dg.class.add(flag, 'dg-scale');
		for( var i=0;i<4;i++){
			var div = document.createElement('div');
			var childArr = arr[i];
			style = 'background:'+dg.css3Prefix+'linear-gradient('+childArr[0]+');background-size:'+childArr[1]+';height:'+childArr[2]+';width:'+childArr[3];
			style += ';position:absolute;left:0px;top:0px;z-index:999;';
			div.setAttribute('style',style);
			flag.appendChild(div);
		}
		qs('#debuggapRoot').appendChild(flag);
	};
	dg.conf = {
		scaleColor:'#cccccc',
		lineColor :'#cc6600'
	};
	var conf = {};
	debuggap.extend( conf,dg.conf );
	dg.draw = {    
	    drawLi:function( obj ){
				var li = document.createElement('li');
				li.className = "dg-node";
				if( obj.nodeType == 8 ){
					var value = obj.nodeValue;
					value = value.replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
					li.innerHTML = '<pre class="pre"><span class="com">&lt;!--'+ value +'--&gt;</span></pre>';
					return li;
				}else if( obj.nodeType == 3 ){
					li.innerHTML = '<pre class="pre">'+obj.nodeValue+'</pre>';
					return li;
				}
				var tag = obj.tagName.toLowerCase();
				var str = '<span class="tag">&lt;'+tag+'</span>';
				var attrs = obj.attributes;
				var dir = null;
				for( var i=0;i<attrs.length;i++){
					str += ' <span class="attr">'+attrs[i].name+'=</span>'+'<span class="val">"'+attrs[i].value+'"</span>';
				}
				if( dg.selfClosing[tag] ){
					str +='<span class="tag">/&gt;</span>';
				}else {
					str +='<span class="tag">&gt;</span>';
					if( obj.childNodes.length ){
						str += '...';
						dir = document.createElement('span');
						dir.className = 'dg-right';
	                    var tap = document.createElement('span');
						tap.className = 'dg-tap';
					}
					str += '<span class="tag">&lt;/'+tag+'&gt;</span>';
				}
	
				li.innerHTML = str;
	            if( dir ){
	                li.appendChild(dir);
	                li.appendChild(tap);
	            }
				return li;
		},
		getRelation:function( obj ){
			var parent = obj.parentNode;
			var result = [];
			var current = obj;
			do{
				var ch = [];
				var tmp = parent.childNodes;
				for( var i=0;i<tmp.length;i++){
					if( dg.inArray( tmp[i].nodeType, [1,8] ) && tmp[i].className !='dg-child' ){
						ch.push(tmp[i]);
					}
				}
				for( var y=0;y<ch.length;y++){
	
					if( ch[y] == current ){
						break;
					}
				}
				result.unshift(y);
				if( parent.tagName.toLowerCase() == 'ul' && parent.id == 'debuggapTree' ){
					break;
				}
				current = parent.parentNode;
				do{
					current = current.previousSibling;
				}while(current.nodeType != 1 );
	
				parent = current.parentNode;
				
			}while(1);
			return result;
		},
		findRelation:function( obj ){
			var root = document;
			var tmp = root.childNodes;
			var rt;
			do{
				var ch = [];
				for( var i=0;i<tmp.length;i++){
					if( dg.inArray( tmp[i].nodeType,[1,8,10]) && tmp[i].id != 'debuggapRoot' ){
						ch.push(tmp[i]);
					}
				}
				var pos = obj.shift();
				rt = ch[pos];
				tmp = rt.childNodes;
			}while(obj.length);
			return rt;		
		},
		doAction:function( node ){
			var value = {};
			if( !dg.class.have(node,'dg-rotate') ){
	
				var li = this.add( node.parentNode );
			}else{
	
				var li = this.del( node );
			}
			delete node;
		},
		add:function( ele ){
			var value = ele.innerHTML;
			value = value.replace(/\.\.\.(.*?)<\/span>/,'');
			ele.innerHTML = value;
			var relation = this.getRelation(ele);
			var result = this.findRelation(relation);
			var ch = result.childNodes;
			var li = document.createElement('li');
			li.className ='dg-child';
			var ul = document.createElement('ul');
			for( var i=0;i<ch.length;i++){
				if( dg.inArray( ch[i].nodeType, [1,3,8] ) && ch[i].id != 'debuggapRoot' ){
					if( ch[i].nodeType == 3 && ch[i].nodeValue.replace( /^\s+|\s+$/g, "" ) == "" ){
						 continue;
					}
					ul.appendChild( this.drawLi(ch[i]) );
				}
			}
			li.appendChild(ul);
			var close = document.createElement('li');
			close.className ='dg-child';
			close.innerHTML = '<span class="tag">&lt;/'+result.tagName.toLowerCase() + '&gt;</span>';
			ele.parentNode.insertBefore(close,ele.nextSibling);
			ele.parentNode.insertBefore(li,close);
			var node = qs('.dg-right',ele);
			dg.class.add(node, 'dg-rotate');
			return ele;
		},
		del:function( node ){
			var li = node.parentNode;
			var value = li.innerHTML;
			var tag = value.match(/&lt;(.+?)<\/span>/)[1];
			value = value.replace(/&gt;<\/span>/,'&gt;<\/span>...<span class="tag">&lt;/'+tag+'&gt;</span>');
			li.innerHTML = value;
			var ele = li.nextSibling;
			ele.parentNode.removeChild(ele);
			li.parentNode.removeChild(li.nextSibling);
			var node = qs('.dg-right',li);
			dg.class.remove(node, 'dg-rotate');
			if( dg.class.have( li,'line-wh') ){
				dg.map.treeToEle(li);
			}
			return li;
		}
	};
	dg.extend({
		indexArray:function( ele, arr ){
			for( var i=0;i<arr.length;i++){
				if( arr[i] == ele ){
					return i;
				}
			}
			return -1;
		},
		inArray:function( ele, arr ){
			return ( this.indexArray(ele, arr) != -1 ) ? true : false;
		},
		isArray:function( obj ) {
			return toString.call( obj ) === "[object Array]";
		},
		each:function( object, callback, args ){
			if ( object.length == undefined ) {
				for ( var name in object )
					if ( callback.call( object[ name ], name, object[ name ], args ) === false )
						break;
			} else{
				for ( var i = 0, length = object.length; i < length; i++ )
					if ( callback.call( object[ i ], i, object[ i ], args ) === false )
						break;
			}
		},
		position:function( node ){
			var left=0,top=0;
			var w = node.clientWidth;
			var h = node.clientHeight;
			var ele = node;
			while( ele && ele != document.body ){
				left += ele.offsetLeft;
				top += ele.offsetTop;
				ele = ele.offsetParent;
			}
			return {left:left,top:top,width:w,height:h};
		},
		max:function( a, b ){
			return a > b ? a : b;
		},
		min:function( a, b ){
			return a > b ? b : a;
		},
		preName:function( name ){
			return dg.css3Prefix + name;
		},
		trim:function( str ){
			return str.replace( /^\s+|\s+$/g, "" );
		}
	});
	dg.map = {
		treeToEle:function( node ){
			this.preShadowNode && this.removeMap( this.preShadowNode );
			this.preShadowNode = node;
			
			var relation = dg.draw.getRelation(node);
			var result = dg.draw.findRelation(relation);
			this.drawShadow(result);
			
			dg.class.add(node,'line-wh');
			dg.each(qsa('span',node),function(){
				dg.class.add(this,'font-wh');
			});
		},
		eleToTree:function( node ){
			var relation = dg.map.getRelation(node);
			dg.doc.trigger( qsa('#debuggapBlock .dg-leaf')[0],'tap' );
			var currentNode = qs('#debuggapTree');
			for( var i=0;i<relation.length-1;i++){
				var v = relation[i];
				var li = qsa( 'li',currentNode )[v];
				dg.draw.add(li);
				currentNode = li.nextSibling;
			}
			li = qsa( 'li',currentNode )[ relation[i] ];
			dg.map.treeToEle(li);
		},
		getRelation:function( node ){
			var rt = [],tmp,ch;
			var ele = node;
			do{
				tmp = ele.parentNode.childNodes;
				ch = [];
				for( var i=0;i<tmp.length;i++){
					if( dg.inArray( tmp[i].nodeType, [1,8] ) ){
						ch.push(tmp[i]);
					}
				}
				for( var y=0;y<ch.length;y++){
					if( ch[y] == ele ){
						break;
					}
				}
				rt.unshift(y);
				ele = ele.parentNode;
			}while( ele && ele.tagName.toLowerCase() != 'html' );
			rt.unshift(1);
			return rt;
		},
		removeMap:function( node ){
			
			dg.class.remove(node,'line-wh');
			dg.each( qsa('span',node),function(){
				dg.class.remove(this,'font-wh');
			});
			var dom = qs('#debuggapShadow');
			dom && debuggapNode.removeChild( dom );
			dg.each( qsa('.debuggapLine'),function(){
				debuggapNode.removeChild(this);
			});
			
			this.preShadowNode = null;
			
		},
		drawShadow:function( node ){
			var dom = qs('#debuggapShadow');
			dom && debuggapNode.removeChild( dom );
	
			var pos = dg.position(node);
			var list = ['padding','border','margin'];
			var d = ['left','right','top','bottom'];
			var rt ={};
			for( var i=0;i<list.length;i++){
				rt[list[i]] = [];
				var end='';
				if( list[i] == 'border' ){
					end="-width";
				}
				for( var j=0;j<d.length;j++){
					var name = list[i]+'-'+d[j]+end;
					rt[list[i]].push( parseInt(dg.css(node,name)) );
				}
			}
			pos.left = dg.max( pos.left - rt['margin'][0], 0 );
			pos.top = dg.max( pos.top - rt['margin'][2], 0 );
            pos.width = dg.max( pos.width - rt['padding'][0]-rt['padding'][1], 0 );
            pos.height = dg.max( pos.height - rt['padding'][2]-rt['padding'][3], 0 );
			var div = document.createElement('div');
			dg.css(div,{width:pos.width+'px',height:pos.height+'px',opacity:0.5,'background-color':'#3879d9'});
			for( var i=0; i<4; i++){
				rt['margin'][i] += rt['border'][i];
			}
			list.splice(1,1);
			for( var j=0; j<list.length; j++){
				var str = list[j];
				if( rt[str][0] + rt[str][1] + rt[str][2] + rt[str][3] != 0){
					var tmp = document.createElement('div');
					var value ={'opacity':0.8};
					for( var i=0;i<d.length;i++){
						var name =  'border-'+d[i];
						value[name] = rt[str][i] +'px solid '+ this['borderColor'][str];
					}
					dg.css( tmp, value );
					tmp.appendChild(div);
					div = tmp;
				}
			}
			dg.css(div, {position:'absolute',left:pos.left+'px',top:pos.top+'px'});
			div.id='debuggapShadow';
			var first = debuggapNode.childNodes[0];
			debuggapNode.insertBefore(div,first);
			var w = pos.width + rt['padding'][0] + rt['padding'][1]+ rt['margin'][0] + rt['margin'][1];
			var h = pos.height + rt['padding'][2] + rt['padding'][3]+ rt['margin'][2] + rt['margin'][3];
			this.drawLine(pos.left,pos.top,w,h);
		},
		drawLine:function(a,b,w,h){
			dg.each( qsa('.debuggapLine'),function(){
				debuggapNode.removeChild(this);
			});
			if( w ==0 || h == 0 ){
				return;
			}
			
			var width = dg.size().width;
			var height = dg.size().height;
			var lines = [[a,0,1,b],[a+w-1,0,1,b],[a,b+h,1,height-b-h],[a+w-1,b+h-1,1,height-b-h],[0,b,a,1],[a+w,b,width-a-w,1],[0,b+h-1,a,1],[a+w,b+h-1,width-a-w,1]];
			var flag = document.createDocumentFragment();
			var color = conf.lineColor;
			for( var i=0;i<lines.length;i++){
				var v = lines[i];
				var d = document.createElement('div');
				dg.css( d,{left:v[0]+'px',top:v[1]+'px',width:v[2]+'px',height:v[3]+'px',position:'absolute','background-color':color});
				dg.class.add( d,'debuggapLine');
				flag.appendChild(d);
			}
			var first = debuggapNode.childNodes[0];
			debuggapNode.insertBefore(flag,first);
		},
		noMap:{html:1,head:1,script:1,style:1,meta:1,title:1,option:1},
		borderColor:{padding:'#329406',border:'#dd903f',margin:'#c56c0e'},
		preShadowNode:null
	};
	dg.console = {
		log:function( ){
			var node = this.createLine();
			if( !dg.inArray(this.focus,['all','log']) ){
				dg.css(node,{'display':'none'});
			}
			dg.class.add( node,'dg-l');
			qsa('td',node)[1].innerHTML = this.concatArg(arguments);
		},
		warn:function(){
			var node = this.createLine();
			if( !dg.inArray(this.focus,['all','warn']) ){
				dg.css(node,{'display':'none'});
			}
			dg.class.add( node,'dg-w');
			qsa('td',node)[0].innerHTML = '<div class="dg-warn"></div><div class="dg-type-con">!</div>';
			qsa('td',node)[1].innerHTML = this.concatArg(arguments);
		},
		error:function(){
			var node = this.createLine();
			if( !dg.inArray(this.focus,['all','error']) ){
				dg.css(node,{'display':'none'});
			}
			dg.class.add( node,'dg-e');
			qsa('td',node)[0].innerHTML = '<div class="dg-error"></div><div class="dg-type-con">x</div>';
			qsa('td',node)[1].innerHTML = "<span style='color:red'>"+this.concatArg(arguments)+'</span>';
		},
		concatArg:function(obj){
			var str='';
			for( var i=0,len=obj.length;i<len;i++){
				str += (' '+obj[i]) ;
			}
			return str;
		},
		tryCatch:function( str ){
			if( this.history[0] != str ){
				this.history.unshift(str);
			}
			var node = this.createLine( str );
			try{
				var value = new Function( "return " + str )();
				if( !value ){
					value +='';
				}else if( typeof value == 'string' ){
					value = '<span style="white-space:pre;color:#cb4416;">' + value.replace(/\>/g,'&gt;').replace(/\</g,'&lt;') +'</span>';
				}else if( typeof value == 'function' ){
					value = '<span style="white-space:pre">' + value + '</span>';
				}
				this.log( value );
			}catch(e){
				this.error(e.name+': '+e.message);
			};
		},
		createLine:function( str ){
			var node = document.createElement('tr');
			node.innerHTML = '<td></td><td></td>';
			dg.each(qsa('td',node),function(i){
				if( i == 1 && str){
					this.innerHTML = '<span style="color:blue;">'+str+'</span>';
				}else{
					this.innerHTML = '';
				}
			});
			dg.class.add(qsa('td',node)[0],'dg-type');
			dg.class.add(qsa('td',node)[1],'dg-con');
			qs('table',qs('#debuggapConsole')).appendChild( node );
			return node;
		},
		history:[],
		index:-1,
		up:function(){
			this.index ++;
			if( this.index < this.history.length ){
				qs('#debuggapInput').value = this.history[ this.index ];
			}else{
				this.index --;
			}
		},
		down:function(){
			this.index --;
			if( this.index < 0 ){
				qs('#debuggapInput').value = '';
				this.index = -1;
			}else{
				qs('#debuggapInput').value = this.history[ this.index ];
			}
		},
		go:function(){
			var dom = qs('#debuggapInput');
			if( !dom.value ){
				return;
			}
			this.tryCatch(dom.value);
			this.index = -1;
			dom.value = '';
		},
		clean:function(){
			var p = qs('.dg-console',qs('#debuggapConsole'));
			var trs = qsa('tr',p);
			dg.each( trs,function(){
				this.parentNode.removeChild( this );
			});
		},
		focus:'all',
		filter:function( obj ){
			var value = obj.innerHTML;
			if( value.toLowerCase() == 'clean' ){
				this.clean();
				return true;
			}
			this.focus = value.toLowerCase();
			dg.each( qsa('span',obj.parentNode),function(){
				if( this == obj ){
					dg.class.add( this,'dg-console-focus');
				}else{
					dg.class.remove( this,'dg-console-focus');
				}
			});
			var c =  value.toLowerCase()[0];
			var p = qs('.dg-console',qs('#debuggapConsole'));
			if( c == 'a' ){
				var rt = {'display':'table-row'};
			}else{
				var rt = {'display':'none'}
			}
			dg.each( qsa('.dg-l,.dg-e,.dg-w',p),function(){
				dg.css(this,rt);
			});
			if( c !='a' ){
				var str = '.dg-'+c;
				dg.each( qsa(str),function(){
					dg.css(this,{'display':'table-row'});
				});
			}
		},
		overwrite:function(){
			var list = ['log','warn','error'];
			for( var i=0; i<list.length; i++){
				var tmp = console[ list[i] ];
				(function( fun, type ){
					console[ type ] = function(){
						fun.apply(this,arguments);
						qs('#debuggapConsole') && dg.console[ type ].apply(dg.console,arguments);
					};
				})( tmp, list[i] );
			}
			list = null;
			tmp = null;
			delete list;
			delete tmp;
		}
	};
	dg.event = {
		eventIndex:1,
		inWrap:function(pos,touch){
			var maxX = pos.left + pos.width;
			var maxY = pos.top + pos.height;
			var pX = touch.pageX;
			var pY = touch.pageY;
			if( pX > pos.left && pY > pos.top && pX < maxX && pY < maxY ){
				return true;
			}
		},
		register:function( regNode ){
		   	if( !(this instanceof arguments.callee) ){
		   		return true;
		   	}   
		   	var topNode = regNode.parentNode;
		   	var stopTap = 0;
		   	var directTap = 0;
		   	var originalX=0,originalY=0;
		   	var translate='';
		   	
		   	var events = {};
		   	this.bind = function( node, type, fun ){
		   		var event;
				if( typeof node == 'string' ){
					if( event = events[node] ){
						event[type] = fun;				
					}else{
						event = {};
						event[type]=fun;
						events[ node ] = event;
					}
				}else if( node.dgEventIndex ){
		   			event = events[ node.dgEventIndex ];
		   			if( event ){
		   				event[type] = fun;
		   			}else{
			   			event ={};
			   			event[type] = fun;
			   			events[ node.dgEventIndex ] = event;
		   			}
		   		}else{
		   			node.dgEventIndex = dg.event.eventIndex ++;
		   			event ={};
		   			event[type] = fun;
		   			events[ node.dgEventIndex ] = event;
		   		}
		   	}
		   	
		   	this.unbind = function( node ){
		   		if( node.dgEventIndex && events[ node.dgEventIndex ] ){
		   			events[ node.dgEventIndex ] = null;
		   			delete events[ node.dgEventIndex ];
		   		}
		   	}
		   	
		   	this.trigger = function( node, type ){
		   		var index = node.dgEventIndex;
		   		var event;
		   		if( event = events[index] ){
		   			event[type].call( node, null );
		   		}
		   	}
		   	
		   	this.destroy = function(){
		   		events = null;
		   		regNode.removeEventListener('touchmove',move,false);
				regNode.removeEventListener('touchend',end,false);
				regNode.removeEventListener('touchstart',start,false);
				move = null;
				end = null;
				start = null;
		   	}
		   	
			var start = function( e ){	
				var touch = e.touches[0];
				var ele = touch.target;
				directTap = 0;
				while( ele != topNode && ele ){
					var index = ele.dgEventIndex;
					var s = events[index];
					if( s && s.scroll ){
						var t = s.scroll;
						stopTap = 0;
						directTap = 1;
						t.dgOx = touch.pageX;
						t.dgOy = touch.pageY;
						dg.css( t, {'-webkit-transition':''} );
						var translate = t.style['WebkitTransform'] ? t.style['WebkitTransform'] : 'translate(0px,0px)';
						var arr = translate.match(/translate\(([^\)]*)\)/)[1].split(',');
						t.dgX = parseInt( arr[0] );
						t.dgY = parseInt( arr[1] );
						return true;
					}else if( s && s.move ){
						stopTap = 0;
					}
					if( s && s.taps  ){
						if( s.taps.call( ele,e ) ){
							return true;
						}
					}
					ele = ele.parentNode;
				}
			};
			
			var move = function( e ){	
				var touch = e.touches[0];
				var ele = touch.target;
				while( ele != topNode && ele ){
					var index = ele.dgEventIndex;
					var s = events[index];
					if( s && s.scroll ){
						var t = s.scroll;
						stopTap = 1;
						if( Math.abs( touch.pageY - t.dgOy ) > Math.abs( touch.pageX -t.dgOx ) ){
							var value = 'translate('+t.dgX+'px,'+ ( touch.pageY-t.dgOy + t.dgY )+'px) ';
						}else{
							var value = 'translate('+ ( touch.pageX-t.dgOx + t.dgX ) +'px,'+ t.dgY +'px) ';
						} 
						t.style['WebkitTransform'] = value;
						
						e.preventDefault();
						return true;
					}else if( s && s.move ){
						stopTap = 1;
						e.preventDefault();
						e.stopPropagation();
						if( s.move.call(ele,e) ){
							return true;
						}
					}
					
					ele = ele.parentNode;
				}
			};
			
			var end = function( e ){
				var touch = e.changedTouches[0];
				var ele = touch.target;
				while( ele != topNode && ele ){
					var index = ele.dgEventIndex;
					var tagName = ( ele.tagName || '').toLowerCase();
					var s = events[index] ? events[index] : events[tagName] ;
					if( s && s.tap && !stopTap ){
						if( ele.nodeType == 1 ){
							var p = dg.position( ele );
						}else{
							directTap = 1;
						}
						if( directTap || dg.event.inWrap(p,touch) ){
							if( s.tap.call( ele,e ) ){
								return true;
							}
						}
					}
					if( s && s.scroll && stopTap ){
						var t = s.scroll;
						stopTap = 0;
						var translate = t.style['WebkitTransform'] ? t.style['WebkitTransform'] : 'translate(0px,0px)';
						var arr = translate.match(/translate\(([^\)]*)\)/)[1].split(',');
						
						t.dgX = parseInt( arr[0] );
						t.dgY = parseInt( arr[1] );
						var maxY = dg.max( t.scrollHeight - parseInt( dg.css(t.parentNode,'height') ) , 0 );
						var maxX = dg.max( t.scrollWidth - parseInt( dg.css(t.parentNode,'width') ), 0 );
						
						var x='',y='';
						var changed = 0;
						if( t.dgY > 0 ){
							y='0px';
							changed = 1;
						}else if( Math.abs(t.dgY) > maxY ){
							y='-'+maxY+'px';
							changed = 1;
						}
						if( t.dgX > 0 ){
							x='0px';
							changed = 1;
						}else if( Math.abs(t.dgX) > maxX ){
							x='-'+maxX+'px';
							changed = 1;
						}
					
						if( changed ){
							x || ( x = t.dgX+'px' );
							y || ( y = t.dgY +'px' );
							
							var value='translate('+x+','+y+')';
							dg.css( t,{'-webkit-transition':'-webkit-transform 0.5s','-webkit-transform':value});
						}
						return true;
					}
					ele = ele.parentNode;
				}
			};
			
			regNode.addEventListener('touchmove',move,false);
			regNode.addEventListener('touchend',end,false);
			regNode.addEventListener('touchstart',start,false);
	   }
	};
	dg.init ={
		setting:function(){
			
		},
		addWrap:function(){
			if( debuggapNode = qs('#debuggapRoot') ){
				return;
			}
			var d = document.createElement('div');
			d.id= 'debuggapRoot';
			document.body.appendChild(d);
			debuggapNode = d;
		},
		addStyle:function(){
			var s = document.createElement('style');
			s.innerHTML=''+
			'body{-webkit-text-size-adjust:100%}'+
			'#debuggapRoot .dg-block{white-space:nowrap;margin: 0px;padding: 20px;}'+
        	'#debuggapRoot td{font-family: arial,sans-serif;letter-spacing: 1px;}'+
        	
        	'#debuggapRoot .dg-scale{}'+

			'#debuggapRoot li{list-style:none;padding-left:15px;position:relative;font-size:15px;font-family:arial,sans-serif;line-height:18px;}'+
			'#debuggapRoot ul{list-style:none;padding-left:0px;margin:0px;}'+
			'span.dg-down{display:inline-block;border-left:5px solid transparent;border-right:5px solid transparent;border-top:10px solid #515151;width:0px;height:0px;position:absolute;left:0px;top:3px;}'+
			'span.dg-right{-webkit-transition:-webkit-transform 0.5s;transition:transform 0.5s;display:inline-block;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:10px solid #515151;width:0px;height:0px;position:absolute;left:0px;top:3px;}'+
            'span.dg-tap{height:18px;padding:0px 25px;left:-30px;position:absolute;}'+
			'span.dg-rotate{-webkit-transform:rotate(90deg);transform:rotate(90deg);}'+

			'#debuggapRoot .tag{color:#a5129f;}'+
			'#debuggapRoot .attr{color:#994500}'+
			'#debuggapRoot .val{color:#1a1a7e;}'+
			'#debuggapRoot .com{color:#236e25;}'+
			'#debuggapRoot .pre{margin:0px;padding:0px;}'+
			'#debuggapRoot .font-wh{color:#fff;}'+
			'#debuggapRoot .line-wh{color:#fff;background-color:#3879d9;}'+
			
			'#debuggapTree {position:absolute;}'+
			
			
			'.debuggapFull {background-color:rgba(255,255,255,0.5);position:absolute;left:0px;top:0px;right:0px;bottom:0px;z-index:999;overflow:hidden;}'+
			'.debuggapFull0 {background-color:rgba(255,255,255,1);position:absolute;left:0px;top:0px;right:0px;bottom:0px;z-index:999;overflow:hidden;}'+

			
			'#debuggapRoot .dg-out{background-color: transparent;position: absolute;z-index: 999;top: 20px;right: 20px;border: 2px solid #00abe3;border-radius: 30px;width: 30px;height: 30px;}'+
			'#debuggapRoot .dg-inner{width:20px;height: 20px;background: #ccc;margin: 5px;border-radius: 20px;background-color: #00abe3;}'+
			'#debuggapConsole{display:none;padding:10px;margin:0px;}'+
			'#debuggapConsole .dg-console{overflow:hidden;}'+
			'#debuggapConsole .dg-console tr{display:table-row}'+
			'#debuggapInput {width:100%;line-height:16px;padding:2px;margin:0px;border:1px solid #ccc;outline-style:none;}'+
			'#debuggapConsole .dg-up{border-left:8px solid transparent;border-bottom:16px solid #515151;border-right:8px solid transparent;width:0px;height:0px;position:absolute;left:0px;top:7px;}'+
			'#debuggapConsole .dg-go{border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:16px solid #515151;width:0px;height:0px;position:absolute;right:0px;top:2px;}'+
			'#debuggapConsole .dg-down{border-top:16px solid #515151;border-right:8px solid transparent;border-left:8px solid transparent;width:0px;height:0px;position:absolute;left:0px;top:7px;}'+
			'#debuggapConsole .dg-upP{width:20px;height:25px;position:absolute;left:0px;top:0px;}'+
			'#debuggapConsole .dg-downP{width:20px;height:25px;position:absolute;left:25px;top:0px;}'+
			'#debuggapConsole .dg-goP{width:30px;height:20px;position:absolute;right:0px;top:0px;}'+
			'#debuggapConsole .dg-type{width:20px;height:16px;text-align:center;position:relative;}'+
			'#debuggapConsole .dg-con{border-bottom:1px solid #ccc;font-size:11px ! important;word-break:break-all;}'+
			'#debuggapConsole .dg-error{border:6px solid #d80c15;border-radius:6px;width:0px;height:0px;position:absolute;left:0px;top:1px;}'+
			'#debuggapConsole .dg-type-con{width:10px;height:10px;position:absolute;left:1px;top:1px;color:#fff;line-height:10px;font-size:14px;}'+
			'#debuggapConsole .dg-warn{border-left:6px solid transparent;border-bottom:12px solid #f4bd00;border-right:6px solid transparent;width:0px;height:0px;position:absolute;left:0px;top:1px;}'+
			'#debuggapConsole .dg-console-info{padding:0px 5px;color:#fff;background-color:#a8a8a8;border-radius:10px;margin-right:5px;font-size:14px;}'+
			'#debuggapConsole .dg-console-focus{background-color:rgb(0,171,227);}'+
			
			'#debuggapConfig {padding:10px;margin:0px;}'+
			'#debuggapConfig .dg-conf-bts{height:30px;overflow:hidden;}'+
			'#debuggapConfig .dg-conf-reset{border-radius:5px;float:left;background-color:rgb(0,171,227);color:#fff;border:0px}'+
			'#debuggapConfig .dg-conf-modify{border-radius:5px;float:right;background-color:rgb(0,171,227);color:#fff;border:0px;}'+
			
			'#debuggapBlock {}'+
			'#debuggapBlock .dg-leaf{width:70px;height:70px;border-radius:30px;text-align:center;line-height:70px;color:#fff;margin:1px;float:left;background-color:rgba(0,171,227,0.7);}'+
			'#debuggapBlock .dg-flower{width:144px;height:144px;position:absolute;z-index:999;left:50%;top:50%;margin-left:-72px;margin-top:-72px;opacity:0;display:none;-webkit-transition:opacity 0.5s;}'+
			'#debuggapBlock .dg-center{width:50px;height:50px;position:absolute;left:47px;top:47px;border-radius:50px;text-align:center;line-height:50px;color:#fff;margin:1px;float:left;background-color:rgba(0,171,227,1);}';
			
			debuggapNode.appendChild(s);
		},
		addBlock:function(){
			var d = document.createElement('div');
			d.id = 'debuggapBlock';
			d.innerHTML = '<div id="debuggapScrim" class="debuggapFull" style="display:none;"></div>'+
                		  '<div class="dg-flower" class="dg-flower">'+
				          '<div class="dg-leaf" style="border-top-left-radius:0px;">finder</div>'+
				          '<div class="dg-leaf" style="border-top-right-radius:0px;">map</div>'+
				          '<div class="dg-leaf" style="border-bottom-left-radius:0px;">config</div>'+
				          '<div class="dg-leaf" style="border-bottom-right-radius:0px;" >console</div>'+
				          '<div class="dg-center">close</div></div>'+
					      '<div class="dg-out"><div class="dg-inner"></div></div>';
			debuggapNode.appendChild( d );
		},
		addConsole:function(){
			var d = document.createElement('div');
			d.id='debuggapConsole';
			d.innerHTML ='<div class="dg-console">'+
                		'<table border=0 cellpadding="0" cellspacing="0" width=100%></table></div>'+
                		'<table border=0 cellpadding="0" cellspacing="0" width=100%>'+
                		'<tr><td><input type="txt" id="debuggapInput"/></td><td style="position:relative;width:25px"> <div class="dg-goP"><div class="dg-go"></div></div></td></tr>'+
                		'<tr><td colspan=2 style="height:25px;width:100%;position:relative;">'+
                		'<div class="dg-upP"><div class="dg-up"></div></div>'+
                		'<div class="dg-downP"><div class="dg-down"></div></div>'+
                		'<div style="position:absolute;right:0px;top: 7px;"><span class="dg-console-info dg-console-focus">All</span><span class="dg-console-info">Error</span><span class="dg-console-info">Warn</span><span class="dg-console-info">Log</span><span class="dg-console-info">Clean</span> </div></td></tr></table>';
			debuggapNode.appendChild( d );
		},
		showTree:function(){
			var d = document.createElement('ul');
			d.id = 'debuggapTree';
			dg.class.add( d,'dg-block' );
			d.innerHTML = '<li style="color:#ccc;">&lt;!DOCTYPE html&gt;</li>';
			debuggapNode.appendChild( d );
			var obj = document.documentElement;
			var rt = debuggap.draw.drawLi(obj);
			document.getElementById('debuggapTree').appendChild(rt);
			dg.scale();
			dg.class.add( qs('#debuggapRoot'),'debuggapFull' );
			dg.css( qs('#debuggapTree'),{'min-width':debuggap.size.width+'px','min-height':debuggap.size.height+'px'} );
			
		},
		destroyTree:function(){
			debuggapNode.removeChild( qs('#debuggapTree') );
			debuggapNode.removeChild( qs('#debuggapScale') );
			dg.class.remove(debuggapNode, 'debuggapFull');
		},
		showConfig:function(){
			if( !qs('#debuggapConfig') ){
				var d = document.createElement('div');
				d.id='debuggapConfig';
				d.innerHTML='<table width="100%" border=0><caption>Config Setting</caption>'+
							'<tr><td>scale color:</td><td><input type="txt" id="scaleColor"/></td></tr>'+
							'<tr><td>line color:</td><td><input type="txt" id="lineColor"/></td></tr>'+
							'</table>'+
							'<div class="dg-conf-bts"><input class="dg-conf-reset" type="button" value="reset"/><input class="dg-conf-modify"  type="button" value="modify"/></div>';
				debuggapNode.appendChild( d );
				for( var i in conf ){
					qs('#'+i).value = conf[i];
				}
			}
			
		}
	};
	dg.start = function(){
		dg.console.overwrite();
		dg.init.setting();
		dg.init.addWrap();
		dg.init.addStyle();
		dg.init.addConsole();
		dg.init.addBlock();
		var doc = new dg.event.register( document );
		dg.doc = doc;
		doc.bind( qs('#debuggapBlock .dg-out'),'tap',function(){
			doc.unbind(document);
			var dom = qs('#debuggapBlock .dg-flower');
			if( dg.css( dom,'opacity') == 0 ){
				dg.css(qs('#debuggapScrim'),{display:'block'});
				dg.css( qs('.dg-out'),{display:'none'});
				dg.css(dom,{opacity:1,display:'block'});
			}else{
				dg.css(dom,{opacity:0},function(dom){dg.css( dom,{display:'none'});},500);
			}
			return true;
		});
		
		doc.bind( qs('#debuggapBlock .dg-out'),'move',function(e){
			var target = e.touches[0];
			var x = target.pageX,y = target.pageY;
			var mX = dg.size().width - 40;
			var mY = dg.size().height - 40;
			
			if( x < 10 ){
				x = 10;	
			}else if( x > mX ){
				x = mX;	
			}
			if( y < 10 ){
				y = 10;
			}else if( y > mY ){
				y = mY;
			}
			
			dg.css( this,{top:y+'px',left:x+'px'});
			return true;
		});
		doc.bind('span','tap',function(){
			if( dg.class.have(this,'dg-tap') ){
	            var ele = qs('.dg-right',this.parentNode);
				dg.draw.doAction( ele );
				return true;
			}else if( dg.class.have(this,'dg-console-info') ){
				dg.console.filter(this);
				return true;
			}
		});
		doc.bind('li','tap',function(){
			if( dg.class.have(this,'dg-node') ){
				var value = this.innerHTML;
				var tag = value.match(/&lt;(.*?)<\/span>/)[1];
				if( !dg.map.noMap[tag] ){
					if( dg.class.have(this,'line-wh') ){
						dg.map.removeMap( this );
					}else{
						dg.map.treeToEle( this );
					}
				}
				return true;
			}
		});
		doc.bind('input','tap',function(){
			if( this.parentNode && this.parentNode.className == 'dg-conf-bts' ){
				var value = this.value;
				if( value == 'reset' ){
					for( var i in conf ){
						conf[i] = qs('#'+i).value = dg.conf[i];
					}
				}else{
					for( var i in conf ){
						conf[i] = qs('#'+i).value;
					}
				}
				return true;
			}
		});
		
		doc.bind( qs('#debuggapScrim'),'tap',function( e ){
			dg.css(this,{display:'none'});
			dg.css( qs('#debuggapBlock .dg-flower'),{opacity:0},function(dom){dg.css( dom,{display:'none'});},500);
			dg.css( qs('.dg-out'),{display:'block'});
			return true;
		});
		doc.bind( qsa('#debuggapBlock .dg-leaf')[0],'tap',function( e ){
			doc.trigger( qs('#debuggapBlock .dg-center'),'tap' );
			dg.init.showTree();
            doc.bind( qs('#debuggapRoot'),'scroll',qs('#debuggapTree'));
			return true;
		});
		doc.bind( qsa('#debuggapBlock .dg-leaf')[1],'tap',function( e ){
			doc.trigger( qs('#debuggapBlock .dg-center'),'tap' );
            doc.bind( qs('#debuggapRoot'),'scroll',null);

    		doc.bind( document,'taps',function(e){
    			var ele = e.changedTouches[0].target;
    			if( !dg.inArray( ele.className,['dg-inner','dg-out'] ) ){
    				dg.map.eleToTree(ele);
    			}
    			e.preventDefault();
    			doc.unbind(document);
    		});
            
            e.preventDefault();
            e.stopPropagation();
			return true;
		});
		doc.bind( qsa('#debuggapBlock .dg-leaf')[2],'tap',function( e ){
			doc.trigger( qs('#debuggapBlock .dg-center'),'tap' );
			dg.class.add( qs('#debuggapRoot'),'debuggapFull0' );
			dg.init.showConfig();
			return true;
		});
		doc.bind( qsa('#debuggapBlock .dg-leaf')[3],'tap',function( e ){
			doc.trigger( qs('#debuggapBlock .dg-center'),'tap' );
			dg.css( qs('#debuggapConsole'),{'display':'block'});
			dg.class.add( qs('#debuggapRoot'),'debuggapFull0' );
			doc.bind( qs('#debuggapRoot'),'scroll',qs('#debuggapConsole .dg-console table'));
			dg.css( qs('#debuggapConsole .dg-console'),{'height':( dg.size().height - 65) +'px'});
			return true;
		});
		doc.bind( qs('#debuggapBlock .dg-center'),'tap',function( e ){
			doc.trigger( qs('#debuggapScrim'),'tap' );
			dg.each( qsa('#debuggapTree,#debuggapScale,#debuggapShadow,#debuggapConfig,.debuggapLine'),function(){
				debuggapNode.removeChild(this);
			});
			dg.css( qs('#debuggapConsole'),{'display':'none'});
			dg.class.remove( debuggapNode);
			return true;
		});
		qs('#debuggapInput').addEventListener('keypress',function( e ){
			if( e.which == 13 || e.keyCode == 13 ){
				dg.console.go();
			}
		},false);
		
		doc.bind( qs('#debuggapConsole .dg-upP'),'tap',function( e ){
			dg.console.up();
		});
		
		doc.bind( qs('#debuggapConsole .dg-goP'),'tap',function( e ){
			dg.console.go();
		});
		
		doc.bind( qs('#debuggapConsole .dg-downP'),'tap',function( e ){
			dg.console.down();
		});
		
	};
	(function(){
		if ( /loaded|complete/.test(document.readyState) )
		{
			setTimeout(dg.start,200);
		}else{
			setTimeout( arguments.callee, 10 );
		}
	})();

})();