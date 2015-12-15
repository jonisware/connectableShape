# connectableShape
This is Javascript SVG based library that allows you to create connectable and dragable shapes for use in charts. It requires jquery and a browser capable of displaying SVG.

##Dependencies
*jquery
*jquery ui

##Usage
###create a SVG container for the shapes to go into. 

`<svg xmlns="http://www.w3.org/2000/svg" id="svgarea" ></svg>`

###grab the object 

`var canvas=document.getElementById("svgarea");`

###Create a shape

` var shape1 = new connectableShape( {svgContainer:canvas,`
`                                        type:"roundedrectangle",`
`                                        x:400,`
`                                        y:100,`
`                                        text:"Rectangle 1",`
`                                        draggable:true,`
`                                        fillcolour:"#7770FF",`
`                                        });`

###Create a second shape

` var shape2 = new connectableShape( {svgContainer:canvas,`
`                                        type:"roundedrectangle",`
`                                        x:200,`
`                                        y:300,`
`                                        text:"Rectangle 2",`
`                                        draggable:true,`
`                                        fillcolour:"#7770FF",`
`                                        });`

###Create a connection between 2 shapes
`var join1 = shape1.joinTo({shapeto:shape2, type:connectableJoin.TypeEnum.BEZIER, socketfrom:2, socketto:1});`

