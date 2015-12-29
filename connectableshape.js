//requires jquery
function connectableShape(options){
	var _self=this;
	var _settings = $.extend({
		svgContainer:null,
		type:"rectangle",
		relatedObject:null,
		roundedness:null,
		width:100,
		height:100,
		x:100,
		y:100,
		text:"",
		linecolour:"#000",
		fillcolour:"#0FF",
		dragable:false,	// boolean to allow dragable
		onstartdrag:function(dragevent){}, // callback function to call when drag starts
		ondrag:function(dragevent){}, // callback function to call when each movement along the drag is recieved
		onenddrag:function(dragevent){}, // callback function to call when the drag movement is dropped
		onclick:function(clickevent){}, // callback function to call when the object is clicked. 
		}, options );

	var _activeConnections = [];
	this.connectors = [];
	var _screenObject=null;
	var _connectableShapesData = {};

	this.setSVGContainer = function(container){
		_settings.svgContainer=container;
	}
	this.getSVGContainer = function(){
		return(_settings.svgContainer);
	}
	this.setType=function(type){
		if (!_connectableShapesData || !_connectableShapesData[type]){
			throw "Invalid shape type '"+type+"'";
			return (false);
		}
		_settings.type=type;
		_self.connectors=_connectableShapesData[type].conn;
		return(true);	
	}
	this.getPos=function(){
//console.log($(_screenObject).attr("width"));
		var w= parseFloat($(_screenObject).outerWidth(true));
		if (w==0 || isNaN(w)) w=parseFloat($(_screenObject).attr("width"));
		var h= parseFloat($(_screenObject).outerHeight(true));
		if (h==0 || isNaN(h)) h=parseFloat($(_screenObject).attr("height"));


		return({left:parseFloat($(_screenObject).attr("x")) ,
			top:parseFloat($(_screenObject).attr("y")) ,
			width:w,
			height:h,
			});
	}

	this.drawMe=function(){
		if ((!_settings.svgContainer) || (_settings.svgContainer==null)) {
			throw "No SVG container specified";
			return (false);
		}
		if (!_self.setType(_settings.type)) return(false);
		if (_screenObject && (_screenObject.connectableShapeType!=_settings.type)){
			// we have a different type, remove what is there, and create a new obj
			$(_screenObject).remove();
			_screenObject=null;
		}
		if (_screenObject ==null){
			if (_connectableShapesData[_settings.type] && _connectableShapesData[_settings.type].create){
				_screenObject=_connectableShapesData[_settings.type].create(_settings);
				$(_settings.svgContainer).append(_screenObject);
				if (typeof(_settings.onclick)=="function"){
					$(_screenObject).on("click",_settings.onclick);
				}
			}
		}
		$(_screenObject).find("text").html(_settings.text);
		_positionScreenObject();
		_styleScreenObject();
		$(window).resize(function (){
					_positionScreenObject();
					_styleScreenObject();
					_redrawJoins();
				});
		
		if (_settings.draggable) $(_screenObject).draggable()
				.bind('dragstop', function(event, ui){ 
					if (typeof(_settings.ondragstart)=="function"){
						_settings.ondragstart({e:event,u:ui});
					}
				})
				.bind('drag', function(event, ui){
					// update coordinates manually, since top/left style props don't work on SVG
					event.target.setAttribute('x', ui.offset.left);
					event.target.setAttribute('y', ui.offset.top);
					if (typeof(_settings.ondrag)=="function"){
						_settings.ondrag({e:event,u:ui});
					}
					_redrawJoins();

				})
				.bind('dragstop', function(event, ui){
					_redrawJoins();
					if (typeof(_settings.ondragend)=="function"){
						_settings.ondragend({e:event,u:ui});
					}
				});
		return(true);
	}

	this.joinTo=function(options){
        	var _settings = $.extend({
			shapefrom:_self
                	}, options );
		var j=new connectableJoin(_settings);
		return(j);
	}

	this.setActiveConnection=function(connectionObj){
		_activeConnections.push(connectionObj);
	}

	function _redrawJoins(){
		for (c in _activeConnections){
//console.log(_activeConnections[c]);
			 _activeConnections[c].drawMe();
		}
	}
	function _positionScreenObject(){
//console.log(_screenObject);

		var x; 
		var y; 
		if (_settings.type=="domobject"){
//console.log(_settings);
			x=_settings.x=$(_settings.relatedobject).position().left-1;
			y=_settings.y=$(_settings.relatedobject).position().top-1;
			var w=$(_settings.relatedobject).outerWidth(true)+2;
			var h=$(_settings.relatedobject).outerHeight(true)+2;

			$(_screenObject).attr({"x":x,"y":y, "width":w, "height":h});
			$(_screenObject).css({"left":x, "top":y, "z-index":$(_settings.relatedobject).zIndex()-1});
		} else {
			x=(parseFloat(_settings.x)+parseFloat($(_screenObject).attr("cxoff")));
			y=(parseFloat(_settings.y)+parseFloat($(_screenObject).attr("cyoff")));
			if ($(_screenObject).attr("usecx")==1){
				$(_screenObject).attr({"cx":x,"cy":y});
			} else {
				$(_screenObject).attr({"x":x,"y":y});
			}
		}
	}

	function _styleScreenObject(){
		$(_screenObject).find("circle,rect,line").css({"fill":_settings.fillcolour,"stroke":_settings.linecolour});
	}


	_connectableShapesData.circle={
		create:function(settings){
			var s = _makeConnectableShapeSVG("svg",{width:100,height:100,cxoff:-50,cyoff:-50,connectableShapeType:"circle"});
			var grp = _makeConnectableShapeSVG("g",{transform:"translate(50,50)"});
			var obj = _makeConnectableShapeSVG("circle",{x:50,y:50,r:49,connectableShapeType:"circle",usecx:1});
			$(grp).append(obj);
			var tobj = _makeConnectableShapeSVG("text",{x:"0",y:"0","text-anchor":"middle","dominant-baseline":"middle"});
			$(grp).append(tobj);
			$(s).append(grp);
			return(s);
		},
		conn:[{x:50,y:0,nx:0,ny:-1},{x:100,y:50,nx:1,ny:0},{x:50,y:100,nx:0,ny:1},{x:0,y:50,nx:-1,ny:0}]};
	_connectableShapesData.rectangle={
		create:function(settings){
			var s = _makeConnectableShapeSVG("svg",{width:100,height:100,cxoff:-50,cyoff:-25,connectableShapeType:"circle"});
			var grp = _makeConnectableShapeSVG("g",{});
			var obj= _makeConnectableShapeSVG("rect",{x:0,y:0,width:"100%",height:"100%",cxoff:-50,cyoff:-50,connectableShapeType:"rectangle"});
			$(grp).append(obj);
			var tobj = _makeConnectableShapeSVG("text",{x:"50%",y:"50%","text-anchor":"middle","dominant-baseline":"middle"});
			$(grp).append(tobj);
			$(s).append(grp);
			return(s);
		},
		conn:[{x:50,y:0,nx:0,ny:-1},{x:100,y:50,nx:1,ny:0},{x:50,y:100,nx:0,ny:1},{x:0,y:50,nx:-1,ny:0}]};
	_connectableShapesData.roundedrectangle={
		create:function(settings){
			var rnd=parseFloat(_settings.roundness);
			if (isNaN(rnd)) rnd=10;

			var s = _makeConnectableShapeSVG("svg",{width:100,height:100,cxoff:-50,cyoff:-25,connectableShapeType:"roundedrectangle"});
			var grp = _makeConnectableShapeSVG("g",{});
			var obj= _makeConnectableShapeSVG("rect",{x:0,y:0,width:"100%",height:"100%",cxoff:-50,cyoff:-50,rx:rnd,ry:rnd,connectableShapeType:"roundedrectangle"});
			$(grp).append(obj);
			var tobj = _makeConnectableShapeSVG("text",{x:"50%",y:"50%","text-anchor":"middle","dominant-baseline":"middle"});
			$(grp).append(tobj);
			$(s).append(grp);
			return(s);
		},
		conn:[{x:50,y:0,nx:0,ny:-1},{x:100,y:50,nx:1,ny:0},{x:50,y:100,nx:0,ny:1},{x:0,y:50,nx:-1,ny:0}]};
	_connectableShapesData.domobject={
		create:function(settings){
			
			//.resize( handler )
			var _obj = settings.relatedobject;
			var rnd=parseFloat(_settings.roundness);
			if (isNaN(rnd)) rnd=0;	

			var s = _makeConnectableShapeSVG("svg",{width:$(_obj).width()+2,
								height:$(_obj).height()+2,
								cxoff:($(_obj).width()+2)/2,
								cyoff:($(_obj).height()+2)/2,
								connectableShapeType:"domobject"});
			var grp = _makeConnectableShapeSVG("g",{width:"100%", height:"100%", preserveAspectRatio:"none" });
			var obj= _makeConnectableShapeSVG("rect",{x:0,y:0,
								width:"100%",
								height:"100%",
								cxoff:"50%",
								cyoff:"50%",
								rx:rnd,ry:rnd,
								connectableShapeType:"domobj"});
			$(grp).append(obj);
			var tobj = _makeConnectableShapeSVG("text",{x:"50%",y:"50%","text-anchor":"middle","dominant-baseline":"middle"});
			$(grp).append(tobj);
			$(s).append(grp);
			return(s);
		},
		conn:[{x:50,y:0,nx:0,ny:-1},{x:100,y:50,nx:1,ny:0},{x:50,y:100,nx:0,ny:1},{x:0,y:50,nx:-1,ny:0}]};

	function _makeConnectableShapeSVG(tag, attrs) {
	        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	        for (var k in attrs){
	                el.setAttribute(k, attrs[k]);
	        }
	        return(el);
	}

	function _constructor(){
		if (!_self.setType(_settings.type)) return(false);
		if (!_self.drawMe()) return(false);
		return(_self);
	}
	_constructor();
}


function connectableJoin(options){
        var _self=this;
        var _settings = $.extend({
                svgContainer:null,
		shapefrom:null,
		socketfrom:0,
		shapeto:null,
		socketto:0,
		fromend:"none",
		toend:"none",
//		endsize:5,
		type:connectableJoin.TypeEnum.STRAIGHT,
                linecolour:"#000",
		linewidth:1,
                onclick:function(clickevent){}, // callback function to call when the object is clicked.
                }, options );
//console.log(options);
//console.log(_settings);
	var _screenObject=null;
	var _zindex=10;
	this.drawMe = function(){
		// check and get the ends and get the normals
		if(!_checkvalid())return(false);
		var fromsock=_settings.shapefrom.connectors[_settings.socketfrom];
		var tosock=_settings.shapeto.connectors[_settings.socketto];

		var fpos=_settings.shapefrom.getPos();
		var tpos=_settings.shapeto.getPos();

		var fsx=(fromsock.x/100)*fpos.width; 
		var fsy=(fromsock.y/100)*fpos.height;
		var tsx=(tosock.x/100)*tpos.width; 
		var tsy=(tosock.y/100)*tpos.height; 
//console.log(fpos.height, fsx,fsy," ",tsx, tsy);

		
		var path="M "+(fpos.left+fsx)+" "+(fpos.top+fsy);
//		if (_settings.fromend=="arrow"){
//			path+=_addArrow((fpos.left+fsx),(fpos.top+fsy),_settings.endsize, fromsock.nx, fromsock.ny);
//		}
		if (_settings.type==connectableJoin.TypeEnum.STRAIGHT){
			path+=" L "+(tpos.left+tsx)+" "+(tpos.top+tsy);
		}
		if (_settings.type==connectableJoin.TypeEnum.BEZIER){
			var mx = Math.max(Math.abs(fpos.left-tpos.left)/2,(75*_settings.linewidth));
			var my = Math.max(Math.abs(fpos.top-tpos.top)/2,(75*_settings.linewidth));
			path+=" C "+(fpos.left+fsx+(mx*fromsock.nx))+" "+(fpos.top+fsy+(my*fromsock.ny))+
				"  "+(tpos.left+tsx+(mx*tosock.nx))+" "+(tpos.top+tsy+(my*tosock.ny))+
				"  "+(tpos.left+tsx)+" "+(tpos.top+tsy);
		}
//		if (_settings.toend=="arrow"){
//			path+=_addArrow((tpos.left+tsx),(tpos.top+tsy),_settings.endsize, tosock.nx, tosock.ny);
//		}

		var s = _makeConnectableShapeSVG("svg",{width:"100%", height:"100%",style:"z-index:"+_zindex});
		var grp = _makeConnectableShapeSVG("g",{});
		var o = {d:path, stroke:_settings.linecolour, "stroke-width":_settings.linewidth, fill:"none", style:""};
		
		if (_settings.fromend=="arrow") o.style+="marker-start:url(#csmarkerarrowheadstart);";
		if (_settings.toend=="arrow") o.style+="marker-end:url(#csmarkerarrowheadend);";
		if (_settings.fromend=="many") o.style+="marker-start:url(#csmarkercrowsfootstart);";
		if (_settings.toend=="many") o.style+="marker-end:url(#csmarkercrowsfootend);";

		var obj= _makeConnectableShapeSVG("path",o);
		$(grp).append(obj);
//		var tobj = _makeConnectableShapeSVG("text",{x:"50",y:"50","text-anchor":"middle","dominant-baseline":"middle"});
//		$(grp).append(tobj);
		$(s).append(grp);
		$(_screenObject).remove();
		_screenObject=s;
		$(_settings.svgContainer).prepend(_screenObject);
		
	}
/*	function _addArrow(px,py,s,nx,ny){
//console.log(px,py,s,nx,ny);
		var path=" L "+(px+(nx*s)-(ny*s))+" "+(py+(ny*s)+(nx*s));
		path+=" L "+(px+(nx*s)+(ny*s))+" "+(py-(nx*s)+(ny*s));
		path+=" L "+(px)+" "+(py);
//console.log(path);
		return(path);
	}
*/
	function _checkvalid(){
		if ((_settings.shapefrom==null) || (!_settings.shapefrom.connectors)){
			throw "Missing shape from";
			return (false);
		}
		if ((_settings.shapeto==null) || (!_settings.shapeto.connectors)){
			throw "Missing shape to";
			return (false);
		}
		if (_settings.socketfrom==null) _settings.socketfrom=0
		else _settings.socketfrom = parseInt(_settings.socketfrom);
		if (_settings.socketto==null) _settings.socketto=0
		else _settings.socketto = parseInt(_settings.socketto);
		if ((!_settings.shapefrom.connectors[_settings.socketfrom]) || (typeof(_settings.shapefrom.connectors[_settings.socketfrom].x)=="undefined")){
			throw "Missing shape from socket number "+_settings.socketfrom;
			return(false)
		}
		if (!_settings.shapeto.connectors[_settings.socketto] || (typeof(_settings.shapeto.connectors[_settings.socketto].x)=="undefined")){
			throw "Missing shape to socket number "+_settings.socketto;
			return(false)
		}
		return(true);
	}
	function _styleScreenObject(){
		$(_screenObject).find("path").css({"stroke":_settings.linecolour});
	}
	function _makeConnectableShapeSVG(tag, attrs) {
	        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	        for (var k in attrs){
	                el.setAttribute(k, attrs[k]);
	        }
	        return(el);
	}

	function _constructor(){
		if(!_checkvalid())return(false);
		if (_settings.svgContainer==null) _settings.svgContainer=_settings.shapefrom.getSVGContainer();
		_settings.shapefrom.setActiveConnection(_self);
		_settings.shapeto.setActiveConnection(_self);
		// see if we have the markers defined. if not define them
		if (!($("#csmarkerarrowhead") && $("#csmarkerarrowhead")[0])){
			var defs = _makeConnectableShapeSVG("defs",{});
			var marker = _makeConnectableShapeSVG("marker",{id:"csmarkerarrowheadstart", 
					markerWidth:"10",
					markerHeight:"10",
					refX:"0",
					refY:"5",
					orient:"auto"
					});
    			var markerpath=_makeConnectableShapeSVG("path",{d:"M10,10 L10,0 L0,5 L10,10", stroke:_settings.linecolour, fill:_settings.linecolour});
			$(marker).append(markerpath);
			$(defs).append(marker);

			var marker = _makeConnectableShapeSVG("marker",{id:"csmarkerarrowheadend", 
					markerWidth:"10",
					markerHeight:"10",
					refX:"10",
					refY:"5",
					orient:"auto"
					});
    			var markerpath=_makeConnectableShapeSVG("path",{d:"M0,0 L0,10 L10,5 L0,0", stroke:_settings.linecolour, fill:_settings.linecolour});
			$(marker).append(markerpath);
			$(defs).append(marker);

			marker = _makeConnectableShapeSVG("marker",{id:"csmarkercrowsfootstart", 
					markerWidth:"10",
					markerHeight:"10",
					refX:"0",
					refY:"5",
					orient:"auto"
					});
    			markerpath=_makeConnectableShapeSVG("path",{d:"M0,0 L10,5 L0,10", stroke:_settings.linecolour, fill:"none"});
			$(marker).append(markerpath);
			$(defs).append(marker);

			marker = _makeConnectableShapeSVG("marker",{id:"csmarkercrowsfootend", 
					markerWidth:"10",
					markerHeight:"10",
					refX:"10",
					refY:"5",
					orient:"auto"
					});
    			markerpath=_makeConnectableShapeSVG("path",{d:"M10,0 L0,5 L10,10", stroke:_settings.linecolour, fill:"none"});
			$(marker).append(markerpath);
			$(defs).append(marker);
			$(_settings.svgContainer).prepend(defs);
		}
		_zindex = 10;
		$(_settings.svgContainer).children().each(function(){
			_zindex = Math.min(parseInt($(this).zIndex()), _zindex);
		});
		_self.drawMe();
	}
	_constructor();
}

connectableJoin.TypeEnum={
	STRAIGHT:"straight",
	STRAIGHTLINE:"straight",
	LINE:"straight",
	BEZIER:"bezier"
}

