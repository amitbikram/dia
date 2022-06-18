import './style.css'

import Konva from 'konva/lib/Core';
import { Rect } from 'konva/lib/shapes/Rect';
import { Circle } from 'konva/lib/shapes/Circle';

let shapeArray = [];


var stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});

// add canvas element
var layer = new Konva.Layer();
stage.add(layer);


let isNowDrawing = false;
// add cursor styling
stage.on('mousedown', mousedownHandler);
stage.on('mousemove', mousemoveHandler);
stage.on('mouseup', mouseupHandler);

let circle = null;

function mousedownHandler(e) {
  isNowDrawing = true;

  circle = new Circle({
    x: stage.getPointerPosition().x,
    y: stage.getPointerPosition().y,
    radius: 0,
    fill: '#d2d2d2',
    stroke: 'black',
    strokeWidth: 2,
  });
  // add the shape to the layer
  layer.add(circle).batchDraw();

  circle.on('click', function (e) {
    
  });
}

function mousemoveHandler(e) {
  if(!isNowDrawing) return;
  const newRadius = stage.getPointerPosition().x - circle.x();
  if(newRadius > 0) {
    circle.radius(newRadius);
    layer.batchDraw();
  } else if(newRadius < 0) {
    circle = null;
  }
}

function mouseupHandler(e) {
  isNowDrawing = false;
}
