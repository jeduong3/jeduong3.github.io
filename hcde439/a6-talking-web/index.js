const BAUD_RATE = 9600; // match with Arduino's baud rate

let port, connectBtn; // declare global variables
let buttonState = 1; // store button state 
let potValue = 0; // store potentiometer value 
let bgColor = 255; // default background color

function setup() {
  setupSerial(); // run serial setup function

  // create full-screen canvas
  createCanvas(windowWidth, windowHeight);

  // p5 text settings
  textFont("system-ui", 30);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  
  // create the connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(onConnectButtonClicked);
}

function draw() {
  const portIsOpen = checkPort(); // check if port is open
  if (!portIsOpen) return; // if port is not open, exit the draw loop

  let str = port.readUntil("\n"); // read from the serial port until newline
  if (str.length == 0) return; // if no data is received, return

  let values = str.trim().split(","); // split data by comma
  if (values.length === 2) {
    potValue = int(values[0]); // convert potentiometer value to integer 
    buttonState = int(values[1]); // convert button state to int 
  }

  // update background color if the button is pressed
  if (buttonState === 0) {
    bgColor = color(random(255), random(255), random(255)); // set background color to random
  }

  background(bgColor); // update background color 

  // display instructions
  fill(0);
  textSize(map(potValue, 0, 1023, 20, 80)); // Change text size with potentiometer
  text("Move the mouse to control LED brightness", width / 2, height / 3);
  text("Press the button to pause background color", width / 2, height / 2);
  text("Touch the potentiometer to change text size", width / 2, height * 2 / 3);

  // send LED brightness value based on mouse X position**
  let brightness = map(mouseX, 0, width, 0, 255);
  brightness = constrain(brightness, 0, 255); // make sure value stays in range

  port.write(brightness + "\n"); // send brightness to Arduino
}

// serial setup function
function setupSerial() {
  port = createSerial();
  
  // check previously used ports
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }
}

// check if serial port is open 
function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    background("gray"); // grey background if not connected
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

// handle button connection click 
function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE); // open serial connection 
  } else {
    port.close(); // close connection 
  }
}
