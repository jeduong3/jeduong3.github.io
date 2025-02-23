const int LED_PIN = 9;     // Set pin 9 for LED (PWM to fade)
const int BUTTON_PIN = 2;  // Set button digital pin 2
const int POT_PIN = A0;    // Potentiometer to analog pin A0 

void setup() {
  pinMode(LED_PIN, OUTPUT); // LED to output
  pinMode(BUTTON_PIN, INPUT_PULLUP); // button to input
  Serial.begin(9600); // start serial communication
}

void loop() {
  int potValue = analogRead(POT_PIN); // read potentiometer value (0-1023)
  int buttonState = digitalRead(BUTTON_PIN); // read button state (HIGH or LOW)

  // send data to p5.js in CSV format
  Serial.print(potValue);
  Serial.print(",");
  Serial.println(buttonState);

  // check if data is available from p5.js
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');  // read incoming serial data
    int brightness = input.toInt(); // convert to integer

    if (brightness >= 0 && brightness <= 255) {
      analogWrite(LED_PIN, brightness); // adjust LED brightness based on received value
    }
  }

  delay(50); // set small delay
}
