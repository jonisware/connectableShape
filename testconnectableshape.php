<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<?php
require_once("/usr/local/wam2/lib/core.php");

add_jquery();

?>
<script src="/wam/js/connectableshape.js" type="text/javascript" ></script>
<script>
	

$(function() {
        $("#thediv").html('<svg xmlns="http://www.w3.org/2000/svg" id="svgarea" class="mycanvas"></svg>');

        var canvas=document.getElementById("svgarea");






	var s1 = new connectableShape( {svgContainer:canvas,
					type:"circle",
					x:300,
					text:"this is a circle",
					fillcolour:"#FF0000",
					draggable:true,
					onclick:function(e){console.log('clicked c');},
					});
	var s2 = new connectableShape( {svgContainer:canvas,
					type:"rectangle",
					x:200,
					y:200,
					text:"this is a rect",
					fillcolour:"#00FF00",
					draggable:true,
					onclick:function(e){console.log('clicked r');},
					});
	var s3 = new connectableShape( {svgContainer:canvas,
					type:"roundedrectangle",
					x:400,
					y:300,
					text:"this is not a circle",
					draggable:true,
					fillcolour:"#7770FF",
					onclick:function(e){console.log('clicked rr');},
					});
	var s4=[];
	var hex=[0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];
	for (var i=0; i<50; i++){

		s4.push( new connectableShape( {svgContainer:canvas,
					type:"roundedrectangle",
					x:(Math.random()*800),
					y:(Math.random()*600),
					text:"i="+i+"",
					draggable:true,
					fillcolour:"#"+hex[parseInt(Math.random()*16)]+hex[parseInt(Math.random()*16)]+hex[parseInt(Math.random()*16)]+hex[parseInt(Math.random()*16)]+hex[parseInt(Math.random()*16)]+hex[parseInt(Math.random()*16)],
					onclick:function(e){console.log('clicked rr');},
					}));
		var c14b = s1.joinTo({shapeto:s4[i], type:connectableJoin.TypeEnum.LINE, socketfrom:0, socketto:1});
		var c24b = s2.joinTo({shapeto:s4[i], type:connectableJoin.TypeEnum.BEZIER, socketfrom:0, socketto:1});
		var c34b = s3.joinTo({shapeto:s4[i], type:connectableJoin.TypeEnum.BEZIER, socketfrom:0, socketto:1});
	}


	var c12 = s1.joinTo({shapeto:s2,socketfrom:2});
	var c12b = s1.joinTo({shapeto:s2, type:connectableJoin.TypeEnum.BEZIER,socketfrom:3});
	var c13b = s1.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:2});
	var c13b = s1.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:1});
	var c23b = s2.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:1, socketto:3});
	var c23b = s2.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:3, socketto:1});
	var c23b = s2.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:2, socketto:2});
	var c13b = s1.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:0, socketto:1});
	var c14b = s1.joinTo({shapeto:s4, type:connectableJoin.TypeEnum.BEZIER, socketfrom:0, socketto:1});
	var c24b = s2.joinTo({shapeto:s4, type:connectableJoin.TypeEnum.BEZIER, socketfrom:0, socketto:1});




});
</script>

<style>
#thediv {width:100%; height:600px; border:1px solid #FF0000; display:block; }
.mycanvas {background-color:#FFEEFE; width:100%; height:100%;}
</style>

</head>
<body>

<div id='thediv' class='thediv'></div>
</body>
</html>

