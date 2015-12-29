<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<?php
if (file_exists("jquery.ui.touch-punch.min.js")){
	// enable mobile touch if punch is in same directory
?>
<script src="jquery.ui.touch-punch.min.js"></script>
<?php
}
?>
<script src="connectableshape.js" type="text/javascript" ></script>
<script>
	

$(function() {
        $("#thediv").html('<svg xmlns="http://www.w3.org/2000/svg" id="svgarea" class="mycanvas"></svg>');

        var canvas=document.getElementById("svgarea");
        var canvas2=document.getElementById("thediv2");


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

	var i1 = new connectableShape( {svgContainer:canvas2,
					type:"domobject",
					relatedobject:$("#selectbox")[0],
					draggable:false,
					fillcolour:"#7770FF",
					onclick:function(e){console.log('clicked rr');},
					});
	var i2 = new connectableShape( {svgContainer:canvas2,
					type:"domobject",
					relatedobject:$("#gobox")[0],
					draggable:false,
					fillcolour:"#7770FF",
					onclick:function(e){console.log('clicked rr');},
					});

<?php
if ($_GET['type']=="loadtest"){
?>
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
<?php 
}
?>

	var c12 = s1.joinTo({shapeto:s2,socketfrom:2, fromend:"arrow", endsize:10});
	var c12b = s1.joinTo({shapeto:s2, type:connectableJoin.TypeEnum.BEZIER,socketfrom:3, toend:"arrow"});
	var c13b = s1.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:2, fromend:"many", toend:",many"});
	var c13b = s1.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:1});
	var c23b = s2.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:1, socketto:3, toend:"arrow"});
	var c23b = s2.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:3, socketto:1, fromend:"arrow"});
	var c23b = s2.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:2, socketto:2});
	var c13b = s1.joinTo({shapeto:s3, type:connectableJoin.TypeEnum.BEZIER, socketfrom:0, socketto:1, toend:"arrow"});

	var c15b = i1.joinTo({shapeto:i2, type:connectableJoin.TypeEnum.BEZIER, socketfrom:0, socketto:1, fromend:"arrow", toend:"arrow", endsize:5, linewidth:4.5});
	var c15b = i1.joinTo({shapeto:i2, type:connectableJoin.TypeEnum.BEZIER, socketfrom:1, socketto:2, fromend:"arrow", toend:"arrow", endsize:5, linewidth:2.5});
	var c15b = i1.joinTo({shapeto:i2, type:connectableJoin.TypeEnum.BEZIER, socketfrom:2, socketto:3, fromend:"many", toend:"many", endsize:5, linewidth:2});
	var c15b = i1.joinTo({shapeto:i2, type:connectableJoin.TypeEnum.BEZIER, socketfrom:3, socketto:0, fromend:"arrow", toend:"arrow", endsize:5});




});
</script>

<style>
#thediv {width:100%; height:600px; border:1px solid #FF0000; display:block; }
.mycanvas {background-color:#FFEEFE; width:100%; height:100%;}
#thediv2 {width:100%;  border:1px solid #005FF0; display:block; position:relative;}
#thediv2 > svg {position:absolute;}
svg {position:relative; }
</style>

</head>
<body>

<div id='thediv' class='thediv'>
</div>
<div id='thediv2' class='thediv2'>
<form method="GET">
<br/>
<br/>
<select id="selectbox"  name='type' onchange="this.form.submit()">
	<option value="std" <?php echo ($_GET['type']!="loadtest"?"SELECTED":""); ?>>Multi Connected</option>
	<option value="loadtest" <?php echo ($_GET['type']=="loadtest"?"SELECTED":""); ?>>Load Test</option>
</select>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<center><input id="gobox" type="submit" value="this is a large button please ignore it"></center>
</form>
<br/>
<br/>
<br/>
<br/>
<br/>
</div>
</body>
</html>

