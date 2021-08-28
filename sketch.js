//.......... serial port
let serial;   // variable to hold an instance of the serialport library
let portName = 'COM8';    // fill in your serial port name here
let inData;   // variable to hold the input data from Arduino

// variables
let sound;
let distanceA;
let distanceB;
let distanceC;
let motionA;
let motionB;
let motionC;

//.......... canvas size
let minWidth = 1280;   //set min width and height for canvas
let minHeight = 720;
let width, height;    // actual width and height for the sketch
let totalWidth =  1280;
let totalHeight = 720;

//.......... image mask and video
let vid;
let img1;
let img2;
let img3;
let img4;
let img5;
let img6;
let shape;
// let island1, island2;

//.......... UI for changing paras
let soundSlider;
let distanceASlider;
let distanceBSlider;
let distanceCSlider;
let motionASlider;
let motionBSlider;
let motionCSlider;

//.......... pattern 1: noise
let ranges = 25; // 100

//.......... pattern 2: https://openprocessing.org/sketch/838545
let kMax; // maximal value for the parameter "k" of the blobs
let step = 0.01; // difference in time between two consecutive blobs
let n = 100; // total number of blobs
let radius = 0; // radius of the base circle
let inter = 0.05; // difference of base radii of two consecutive blobs
let maxNoise = 500; // maximal value for the parameter "noisiness" for the blobs

//.......... pattern 3:


function preload() {
  // vid = createVideo('testvideo1.mp4');
  // vid.hide();
  // theShader = new p5.Shader(this.renderer, vertShader, fragShader);

  // read all the files (for img approach)
  // img1 = loadImage("1.jpg");
  // img2 = loadImage("2.jpg");
  // img3 = loadImage("3.jpg");
  // img4 = loadImage("4.jpg");
  // img5 = loadImage("5.jpg");
  // img6 = loadImage("6.jpg");
}


var s1 = function( sketch ) {
  
  let values;
  sketch.setup = function() {

  // set the canvas to match the window size
  if (window.innerWidth > minWidth){
    width = window.innerWidth;
  } else {
    width = minWidth;
  }
  if (window.innerHeight > minHeight) {
    height = window.innerHeight;
  } else {
    height = minHeight;
  }

  //set up canvas
  // createCanvas(width, height); 
  let canvas1 = sketch.createCanvas(totalWidth, totalHeight * 0.49);
  canvas1.position(0,0);
  sketch.background(0);
  sketch.noStroke();

  //set up communication port
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port

  serial.on('list', sketch.printList);  // set a callback function for the serialport list event
  serial.on('connected', sketch.serverConnected); // callback for connecting to the server
  serial.on('open', sketch.portOpen);        // callback for the port opening
  serial.on('data', sketch.serialEvent);     // callback for when new data arrives
  serial.on('error', sketch.serialError);    // callback for errors
  serial.on('close', sketch.portClose);      // callback for the port closing

  // setup UI for testing
  soundSlider = sketch.createSlider(0, 1023, 512);
  soundSlider.position(10, 15);
  soundSlider.style('width', '80px');

  distanceASlider = sketch.createSlider(1, 300, 300);
  distanceASlider.position(10, 35);
  distanceASlider.style('width', '80px');

  distanceBSlider = sketch.createSlider(1, 300, 300);
  distanceBSlider.position(10, 55);
  distanceBSlider.style('width', '80px');

  distanceCSlider = sketch.createSlider(1, 300, 300);
  distanceCSlider.position(10, 75);
  distanceCSlider.style('width', '80px');
  
  motionASlider = sketch.createSlider(0, 1, 0, 0.01);
  motionASlider.position(10, 100);
  motionASlider.style('width', '80px');
  
  motionBSlider = sketch.createSlider(0, 1, 0, 1);
  motionBSlider.position(10, 125);
  motionBSlider.style('width', '80px');
  
  motionCSlider = sketch.createSlider(0, 1, 0, 1);
  motionCSlider.position(10, 150);
  motionCSlider.style('width', '80px');


  }
  sketch.draw = function() {
    sound = soundSlider.value();
    sketch.text('sound ' + String(sound), soundSlider.x * 2 + soundSlider.width, 25);
    // distanceA = distanceASlider.value();
    sketch.text('distA ' + String(distanceA), soundSlider.x * 2 + soundSlider.width, 50);
    // distanceB = distanceBSlider.value();
    sketch.text('distB ' + String(distanceB), soundSlider.x * 2 + soundSlider.width, 75);
    // distanceC = distanceCSlider.value();
    sketch.text('distC ' + String(distanceC), soundSlider.x * 2 + soundSlider.width, 100);
    motionA = motionASlider.value();
    sketch.text('moA ' + String(motionA), soundSlider.x * 2 + soundSlider.width, 125);
    motionB = motionBSlider.value();
    sketch.text('moB ' + String(motionB), soundSlider.x * 2 + soundSlider.width, 150);
    motionC = motionCSlider.value();
    sketch.text('moC ' + String(motionC), soundSlider.x * 2 + soundSlider.width, 175);
  
    ////////////////////////////////////////////
    sketch.background(0);
    //..... pattern 1: noise 
    sketch.noFill();
    sketch.strokeWeight(3);
  
    // console.log(distanceA, distanceB, distanceC);
    let noisePlay = sketch.map(distanceA, 25, 600, 5, 1);
    ranges = sketch.map(distanceA, 25, 600, 50, 10); // amount of lines
    
    // sketch.print(distanceA, noisePlay, ranges);
    // console.log(noisePlay);
    for (let i = 0; i < ranges; i++) {
      let paint = sketch.map(i, 0, ranges, 0, 255);
      sketch.stroke(paint);
      
  
      sketch.beginShape();
      for (let x = 0; x < totalWidth + 11; x += 20) {
        // let n = noise(x * 0.001, i * 0.01, frameCount * 0.02);
        let n = sketch.noise(x * 0.001 * noisePlay, i * 0.01*noisePlay, sketch.frameCount * 0.005 * noisePlay);
        let y = sketch.map(n, 0, 1, 0, totalHeight-400);
        sketch.vertex(x, y);
        // console.log(x, y)
      }
      sketch.endShape();
    }
  }

  sketch.gotData = function() {
    var currentString = serial.readStringUntil("\n");
    if (currentString != "")
    {
      sketch.values = sketch.split(currentString, ',');
      console.log(sketch.values);
    }
    
    sound =     Number(sketch.values[0]);
    if (Number(sketch.values[1]) < 600) distanceA = Number(sketch.values[1]);
    else distanceA = 600;
    if (Number(sketch.values[2]) < 600) distanceB = Number(sketch.values[2]);
    else distanceB = 600;
    if (Number(sketch.values[3]) < 600) distanceC = Number(sketch.values[3]);
    else distanceC = 600;
    // distanceA = Number(sketch.values[1]);  
    // distanceB = Number(sketch.values[2]);  
    // distanceC = Number(sketch.values[3]);  
    motionA =   Number(sketch.values[4]);
    motionB =   Number(sketch.values[5]);
    motionC =   Number(sketch.values[6]);
  }
  
  sketch.printList = function(portList) {
   // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
      sketch.print(i + " " + portList[i]);
    }
  }
  
  sketch.serverConnected = function() {
    sketch.print('connected to server.');
  }
  
  sketch.portOpen = function() {
    sketch.print('the serial port opened.')
  }
  
  sketch.serialEvent = function() {
    // inData = Number(serial.read());
    sketch.gotData();
  }
  
  sketch.serialError = function(err) {
    sketch.print('Something went wrong with the serial port. ' + err);
  }
  
  sketch.portClose = function() {
    sketch.print('The serial port closed.');
  }


};

var s2 = function( sketch ) {
  sketch.setup = function() {
    // set the canvas to match the window size
    if (window.innerWidth > minWidth){
      width = window.innerWidth;
    } else {
      width = minWidth;
    }
    if (window.innerHeight > minHeight) {
      height = window.innerHeight;
    } else {
      height = minHeight;
    }

    let canvas2 = sketch.createCanvas(totalWidth*0.6, totalHeight * 0.52);
    
    canvas2.position(0,totalHeight * 0.48);
    sketch.background(200)
    //.......... pattern 2:
    sketch.colorMode(sketch.HSB, 1);
    sketch.angleMode(sketch.DEGREES);
    sketch.noFill();
    //noLoop();
    kMax = sketch.random(0.6, 1.0);
    sketch.noStroke();

  }
  sketch.draw = function() {
    sketch.background(0)
    sketch.noStroke();
    let t = sketch.frameCount/100;
    for (let i = n; i > 0; i--) {
      let alpha = 1 - (i / n);
      // fill((alpha/5 + 0.75)%1, 1, 1, alpha);

      // console.log(distanceB);
      
      
      let color_value = sketch.map(distanceB, 0, 600, 0.7, 0.3)
      sketch.fill((alpha/5 + color_value)%1, 1, 1, alpha);
      // fill((alpha/5 + 0.75)%1, alpha);
      let size = (radius + i * inter);
      let k = kMax * sketch.sqrt(i/n);
      let noisiness = maxNoise * (i / n);
      sketch.blob(size, sketch.width/2+100, sketch.height/2-100, k, t - i * step, noisiness);
    }
  }

  sketch.blob = function(size, xCenter, yCenter, k, t, noisiness) {
    sketch.beginShape();
    let angleStep = 360 / 10;
    for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
      let r1, r2;
      /*
      if (theta < PI / 2) {
        r1 = cos(theta);
        r2 = 1;
      } else if (theta < PI) {
        r1 = 0;
        r2 = sin(theta);
      } else if (theta < 3 * PI / 2) {
        r1 = sin(theta);
        r2 = 0;
      } else {
        r1 = 1;
        r2 = cos(theta);
      }
      */
      r1 = sketch.cos(theta)+1;
      r2 = sketch.sin(theta)+1; // +1 because it has to be positive for the function noise
      let r = size + sketch.noise(k * r1,  k * r2, t) * noisiness;
      let x = xCenter + r * sketch.cos(theta);
      let y = yCenter + r * sketch.sin(theta);
      sketch.curveVertex(x, y);
    }
    sketch.endShape();
  }
};

var s3 = function( sketch ) {
  sketch.setup = function() {
    // set the canvas to match the window size
    if (window.innerWidth > minWidth){
      width = window.innerWidth;
    } else {
      width = minWidth;
    }
    if (window.innerHeight > minHeight) {
      height = window.innerHeight;
    } else {
      height = minHeight;
    }

    let canvas2 = sketch.createCanvas(totalWidth*0.48, totalHeight * 0.55);
    
    canvas2.position(totalWidth*0.52, totalHeight * 0.45);
    sketch.background(200)
    //.......... pattern 2:
    sketch.colorMode(sketch.HSB, 1);
    sketch.angleMode(sketch.DEGREES);
    sketch.noFill();
    //noLoop();
    kMax = sketch.random(0.6, 1.0);
    sketch.noStroke();

  }
  sketch.draw = function() {
    sketch.background(0)
    sketch.noStroke();
    let t = sketch.frameCount/100;
    for (let i = n; i > 0; i--) {
      let alpha = 1 - (i / n);

      let color_value = sketch.map(distanceC, 0, 600, 0.7, 0.3)
      sketch.fill((alpha/5 + color_value)%1, 1, 1, alpha);


      // fill((alpha/5 + 0.75)%1, 1, 1, alpha);
      // sketch.fill((alpha/5 + distanceC)%1, alpha);
      // fill((alpha/5 + 0.75)%1, alpha);
      let size = radius + i * inter;
      let k = kMax * sketch.sqrt(i/n);
      let noisiness = maxNoise * (i / n);
      sketch.blob(size, sketch.width/2-150, sketch.height/2-50, k, t - i * step, noisiness);
    }
  }

  sketch.blob = function(size, xCenter, yCenter, k, t, noisiness) {
    sketch.beginShape();
    let angleStep = 360 / 10;
    for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
      let r1, r2;
      /*
      if (theta < PI / 2) {
        r1 = cos(theta);
        r2 = 1;
      } else if (theta < PI) {
        r1 = 0;
        r2 = sin(theta);
      } else if (theta < 3 * PI / 2) {
        r1 = sin(theta);
        r2 = 0;
      } else {
        r1 = 1;
        r2 = cos(theta);
      }
      */
      r1 = sketch.cos(theta)+1;
      r2 = sketch.sin(theta)+1; // +1 because it has to be positive for the function noise
      let r = size + sketch.noise(k * r1,  k * r2, t) * noisiness;
      let x = xCenter + r * sketch.cos(theta);
      let y = yCenter + r * sketch.sin(theta);
      sketch.curveVertex(x, y);
    }
    sketch.endShape();
  }
};


// var s3 = function( sketch ) {
//   let img3

//    sketch.setup = function() {
//     img3 = sketch.loadImage("2.jpg");
//     let canvas2 = sketch.createCanvas(totalWidth/2, totalHeight * 0.4);
//     canvas3.position(totalWidth/2, totalHeight * 0.6);
//   }
//   sketch.draw = function() {
//     //for canvas 2
//     sketch.background(90);
//     sketch.ellipse(150, 150, 50, 50);
//   }
// };


new p5(s1);
new p5(s2);
new p5(s3);


// function setup() {
//   // // set the canvas to match the window size
//   // if (window.innerWidth > minWidth){
//   //   width = window.innerWidth;
//   // } else {
//   //   width = minWidth;
//   // }
//   // if (window.innerHeight > minHeight) {
//   //   height = window.innerHeight;
//   // } else {
//   //   height = minHeight;
//   // }

//   // //set up canvas
//   // createCanvas(width, height); 
//   // noStroke();

//   // //set up communication port
//   // serial = new p5.SerialPort();       // make a new instance of the serialport library
//   // serial.list();                      // list the serial ports
//   // serial.open(portName);              // open a serial port

//   // serial.on('list', printList);  // set a callback function for the serialport list event
//   // serial.on('connected', serverConnected); // callback for connecting to the server
//   // serial.on('open', portOpen);        // callback for the port opening
//   // serial.on('data', serialEvent);     // callback for when new data arrives
//   // serial.on('error', serialError);    // callback for errors
//   // serial.on('close', portClose);      // callback for the port closing

//   // // setup UI for testing
//   // soundSlider = createSlider(0, 1023, 512);
//   // soundSlider.position(10, 15);
//   // soundSlider.style('width', '80px');

//   // distanceASlider = createSlider(1, 300, 300);
//   // distanceASlider.position(10, 35);
//   // distanceASlider.style('width', '80px');

//   // distanceBSlider = createSlider(1, 300, 300);
//   // distanceBSlider.position(10, 55);
//   // distanceBSlider.style('width', '80px');

//   // distanceCSlider = createSlider(1, 300, 300);
//   // distanceCSlider.position(10, 75);
//   // distanceCSlider.style('width', '80px');
  
//   // motionASlider = createSlider(0, 1, 0, 0.01);
//   // motionASlider.position(10, 100);
//   // motionASlider.style('width', '80px');
  
//   // motionBSlider = createSlider(0, 1, 0, 1);
//   // motionBSlider.position(10, 125);
//   // motionBSlider.style('width', '80px');
  
//   // motionCSlider = createSlider(0, 1, 0, 1);
//   // motionCSlider.position(10, 150);
//   // motionCSlider.style('width', '80px');



//   //.......... pattern 2:
//   colorMode(HSB, 1);
// 	angleMode(DEGREES);
//   noFill();
// 	//noLoop();
// 	kMax = random(0.6, 1.0);
// 	noStroke();


//   //.......... pattern 3

// }

// function draw() {
//   // updating values
//   // sound = soundSlider.value();
//   // text('sound ' + String(sound), soundSlider.x * 2 + soundSlider.width, 25);
//   // distanceA = distanceASlider.value();
//   // text('distA ' + String(distanceA), soundSlider.x * 2 + soundSlider.width, 50);
//   // distanceB = distanceBSlider.value();
//   // text('distB ' + String(distanceB), soundSlider.x * 2 + soundSlider.width, 75);
//   // distanceC = distanceCSlider.value();
//   // text('distC ' + String(distanceC), soundSlider.x * 2 + soundSlider.width, 100);
//   // motionA = motionASlider.value();
//   // text('moA ' + String(motionA), soundSlider.x * 2 + soundSlider.width, 125);
//   // motionB = motionBSlider.value();
//   // text('moB ' + String(motionB), soundSlider.x * 2 + soundSlider.width, 150);
//   // motionC = motionCSlider.value();
//   // text('moC ' + String(motionC), soundSlider.x * 2 + soundSlider.width, 175);

//   // ////////////////////////////////////////////
//   // background(0);
//   // //..... pattern 1: noise 
//   // noFill();
//   // strokeWeight(2);

//   // let noisePlay = map(distanceA, 0, 300, 5, 1);
//   // ranges = map(distanceB, 0, 300, 50, 10); // amount of lines
//   // // console.log(noisePlay);
//   // for (let i = 0; i < ranges; i++) {
//   //   let paint = map(i, 0, ranges, 0, 255);
//   //   stroke(paint);
    

//   //   beginShape();
//   //   for (let x = 400; x < width*0.5 + 11; x += 20) {
//   //     // let n = noise(x * 0.001, i * 0.01, frameCount * 0.02);
//   //     let n = noise(x * 0.001 * noisePlay, i * 0.01*noisePlay, frameCount * 0.005 * noisePlay);
//   //     let y = map(n, 0, 1, 150, height/2);
//   //     vertex(x, y);
//   //   }
//   //   endShape();
//   // }

//   //..... pattern 2: temperature 
//   noStroke();
//   let t = frameCount/100;
//   for (let i = n; i > 0; i--) {
// 		let alpha = 1 - (i / n);
// 		// fill((alpha/5 + 0.75)%1, 1, 1, alpha);
// 		fill((alpha/5 + motionA)%1, 1, 1, alpha);
// 		// fill((alpha/5 + 0.75)%1, alpha);
// 		let size = radius + i * inter;
// 		let k = kMax * sqrt(i/n);
// 		let noisiness = maxNoise * (i / n);
//     blob(size, width/2, height/2, k, t - i * step, noisiness);
//   }

// }

// function display(img, shape1, w, h) {
//   img.mask(shape1);
//   img.resize(w, h);
//   image(img, 0, 0)
//   // setTimeout(()=> {}, 2000);
// }

// function gotData() {
//   var currentString = serial.readStringUntil("\n");
//   if (currentString != "")
//   {
//     values = split(currentString, ',');
//     console.log(values);
//   }
  
//   sound =     Number(values[0]);
//   if (Number(values[1]) < 300) distanceA = Number(values[1]);
//   else distanceA = 300;
//   if (Number(values[2]) < 300) distanceB = Number(values[2]);
//   else distanceB = 300;
//   if (Number(values[3]) < 300) distanceC = Number(values[3]);
//   else distanceC = 300;
//   // distanceA = Number(values[1]);  
//   // distanceB = Number(values[2]);  
//   // distanceC = Number(values[3]);  
//   motionA =   Number(values[4]);
//   motionB =   Number(values[5]);
//   motionC =   Number(values[6]);
// }

// function printList(portList) {
//  // portList is an array of serial port names
//  for (var i = 0; i < portList.length; i++) {
//  // Display the list the console:
//  print(i + " " + portList[i]);
//  }
// }

// function serverConnected() {
//   print('connected to server.');
// }

// function portOpen() {
//   print('the serial port opened.')
// }

// function serialEvent() {
//   // inData = Number(serial.read());
//   gotData();
// }

// function serialError(err) {
//   print('Something went wrong with the serial port. ' + err);
// }

// function portClose() {
//   print('The serial port closed.');
// }

function visualizeCenterContour()
{
  var x_offset = 640;
  var y_offset = 360;
  strokeWeight(0);
  fill("blue");
  stroke("yellow");
  beginShape();
  curveVertex(793 - x_offset, 130 - y_offset);
  curveVertex(782 - x_offset, 131 - y_offset);
  curveVertex(771 - x_offset, 132 - y_offset);
  curveVertex(738 - x_offset, 138 - y_offset);
  curveVertex(713 - x_offset, 135 - y_offset);
  curveVertex(696 - x_offset, 138 - y_offset);
  curveVertex(688 - x_offset, 142 - y_offset);
  curveVertex(680 - x_offset, 150 - y_offset);
  curveVertex(666 - x_offset, 183 - y_offset);
  curveVertex(658 - x_offset, 208 - y_offset);
  curveVertex(647 - x_offset, 228 - y_offset);
  curveVertex(630 - x_offset, 238 - y_offset);
  curveVertex(604 - x_offset, 246 - y_offset);
  curveVertex(595 - x_offset, 251 - y_offset);
  curveVertex(588 - x_offset, 274 - y_offset);
  curveVertex(579 - x_offset, 281 - y_offset);
  curveVertex(581 - x_offset, 317 - y_offset);
  curveVertex(578 - x_offset, 335 - y_offset);
  curveVertex(595 - x_offset, 345 - y_offset);
  curveVertex(617 - x_offset, 348 - y_offset);
  curveVertex(672 - x_offset, 381 - y_offset);
  curveVertex(700 - x_offset, 398 - y_offset);
  curveVertex(725 - x_offset, 409 - y_offset);
  curveVertex(738 - x_offset, 401 - y_offset);
  curveVertex(750 - x_offset, 394 - y_offset);
  curveVertex(763 - x_offset, 384 - y_offset);
  curveVertex(775 - x_offset, 380 - y_offset);
  curveVertex(796 - x_offset, 373 - y_offset);
  curveVertex(804 - x_offset, 366 - y_offset);
  curveVertex(810 - x_offset, 362 - y_offset);
  curveVertex(828 - x_offset, 364 - y_offset);
  curveVertex(850 - x_offset, 368 - y_offset);
  curveVertex(858 - x_offset, 362 - y_offset);
  curveVertex(863 - x_offset, 352 - y_offset);
  curveVertex(875 - x_offset, 338 - y_offset);
  curveVertex(888 - x_offset, 318 - y_offset);
  curveVertex(892 - x_offset, 302 - y_offset);
  curveVertex(890 - x_offset, 270 - y_offset);
  curveVertex(884 - x_offset, 234 - y_offset);
  curveVertex(877 - x_offset, 233 - y_offset);
  curveVertex(874 - x_offset, 219 - y_offset);
  curveVertex(860 - x_offset, 208 - y_offset);
  curveVertex(834 - x_offset, 196 - y_offset);
  curveVertex(817 - x_offset, 176 - y_offset);
  curveVertex(803 - x_offset, 142 - y_offset);
  curveVertex(796 - x_offset, 133 - y_offset);
  endShape();

}

class SculptureMask {
  constructor(ixp, iyp, iw, ih) {
    // this.img = iimg;
    this.xpos = ixp; // rect xposition
    this.ypos = iyp; // rect yposition
    this.w = iw; // single bar width
    this.h = ih; // rect height
  }

  // move(posX, posY, damping) {
  //   let dif = this.ypos - posY;
  //   if (abs(dif) > 1) {
  //     this.ypos -= dif / damping;
  //   }
  //   dif = this.xpos - posX;
  //   if (abs(dif) > 1) {
  //     this.xpos -= dif / damping;
  //   }
  // }

  // display() {
  //   for (let i = 0; i < this.t; i++) {
  //     rect(
  //       this.xpos + i * (this.d + this.w),
  //       this.ypos,
  //       this.w,
  //       height * this.h
  //     );
  //   }
  // }

  displayMask(img, shape1, w, h) {
    img.mask(shape1);
    img.resize(w, h);
    image(img, 0, 0);
    // setTimeout(()=> {}, 2000);
  }
}