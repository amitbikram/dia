import Konva from 'konva/lib/Core';
import { Circle } from 'konva/lib/shapes/Circle';
import { Ellipse } from 'konva/lib/shapes/Ellipse';
import { Arrow } from 'konva/lib/shapes/Arrow';


var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});

var layer = new Konva.Layer();

var circle1 = new Circle({
    x: 300,
    y: 200,
    radius: 100,
    fill: '#d2d2d2',
    stroke: 'black',
    strokeWidth: 2,
});

// add the shape to the layer
layer.add(circle1);

var circle2 = new Circle({
    x: 700,
    y: 200,
    radius: 100,
    fill: '#d2d2d2',
    stroke: 'black',
    strokeWidth: 2,
});

// add the shape to the layer
layer.add(circle2);


var arrow = new Arrow({
    x: 300,
    y: 200,
    points: [100, 0, 300, 0],
    pointerLength: 20,
    pointerWidth: 20,
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
    tension: 20,
});

// add the shape to the layer
layer.add(arrow);

// add the layer to the stage
stage.add(layer);