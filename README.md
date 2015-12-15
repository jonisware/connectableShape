# connectableShape
This is Javascript SVG based library that allows you to create connectable and dragable shapes for use in charts. It requires jquery and a browser capable of displaying SVG.

##Dependencies
* jquery
* jquery ui

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

` var shape2 = connectableShape {svgContainer:canvas,`
`                                        type:"roundedrectangle",`
`                                        x:200,`
`                                        y:300,`
`                                        text:"Rectangle 2",`
`                                        draggable:true,`
`                                        fillcolour:"#7770FF",`
`                                        });`

###Create a connection between 2 shapes
`var join1 = shape1.joinTo({shapeto:shape2, type:connectableJoin.TypeEnum.BEZIER, socketfrom:2, socketto:1});`

##Documentation
###Class - connectableShape
####Constructor
  connectableShape(options)
#####Options
* svgContainer - This allows you to specify where you wish this object to be placed. It defaults null.
* type - This specifies the type of shape you wish to create. It can be one of the shape types, e.g. "rectangle", "roundedrectangle", "circle".
* width - this is the width of the object in pixels.
* height - This is the height of the object in pixels.
* x - The horizontal position of top left corner in pixels.
* y - The vertical position of top left corner in pixels.
* text - The text within the shape.
* linecolour - The colour of the border of the shape. This can be either a worded colour or a hex rgb colour.
* fillcolour - The colour of the content of the shape. This can be either a worded colour or a hex rgb colour.
* dragable - A boolean to denote whether or not it is draggable.
* onstartdrag - A callback to be called when an object starts dragging. It has 1 parameter which is an object that contains e for the event object and u for the ui object of the dragged item.
* ondrag - A callback to be called when an object is being dragged. It has 1 parameter which is an object that contains e for the event object and u for the ui object of the dragged item.
* onenddrag - A callback to be called when an object finishes dragging (i.e. is dropped). It has 1 parameter which is an object that contains e for the event object and u for the ui object of the dragged item.
* onclick - A callback to be called when an object is clicked on. It has 1 parameter which is an object that contains e for the event object and u for the ui object of the dragged item.

####Methods
#####setSVGContainer(container)
This sets the SVG container for the object. 
#####getSVGContainer()
This returns the current SVG container for the shape. 
#####setType(type)
This sets the type for the object allowing you to change the object from, say a circle to a rounded rectangle. 
It has one parameter - type and is a string that can be one of the shape types, e.g. "rectangle", "roundedrectangle", "circle".
#####getPos()
This returns the current position of the object within the container. It returns an objeccontaining a left and a top property. 
#####drawMe()
This redraws the object. 
#####joinTo(options)
This joins this object to object spefified in the options. 
NOTE. The options for this are the same as the options passed into the constructor for the connectableJoin class apart from the shapeFrom is pre-set to the current shape. 
#####setActiveConnection(connectionObject)
This allows you to set an active connection within the object. This should normally not be used but is called from the connectableJoin when it sets up the connection and the abiloity to move the connection if the object moves. 
###Class - connectableJoin
####Constructor
connectableJoin(options)
#####Options
* svgContainer - This allows you to specify where you wish this object to be placed. It defaults to the container of the shapeFrom object.
* shapeFrom - This is the object that you want to have the link from and should be an instance of connectableShape
* socketFrom - This is the index of the socket you wish to attach to in the object the link is going from. Sockets are indexed by this id from a numerical array of sockets counter clockwise from the top of the object depending on the shape. For most shapes it is one of the following numbers. 0 - top connector, 1 - right connector, 2 bottom connector, 4 left connector.
* shapeTo - This is the object that you want to have the link to and should be an instance of connectableShape
* socketTo - This is the index of the socket you wish to attach to in the object the link is going to. Sockets are indexed by this id from a numerical array of sockets counter clockwise from the top of the object depending on the shape. For most shapes it is one of the following numbers. 0 - top connector, 1 - right connector, 2 bottom connector, 4 left connector.
* type - This is one of the members of the enumerate connectableJoin.TypeEnum and can be one of
> * connectableJoin.TypeEnum.STRAIGHT - for a straight line join
> * connectableJoin.TypeEnum.LINE - for a straight line join
> * connectableJoin.TypeEnum.STRAIGHTLINE - for a straight line join
> * connectableJoin.TypeEnum.BEZIER - for a curved line join
* linecolour - The colour of the connecting line. This can be either a worded colour or a hex rgb colour.
* onclick - A callback to be called when the line is clicked on. It has 1 parameter which is an object that contains e for the event object and u for the ui object of the dragged item.
####Methods
#####drawMe()
This redraws the connection. 
