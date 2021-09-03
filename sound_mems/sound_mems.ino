////////////////////////////////////////////////
#include <Ewma.h>
#include <EwmaT.h>

Ewma adcFilter1(0.1);   // Less smoothing - faster to detect changes, but more prone to noise
//Ewma adcFilter2(0.01);  // More smoothing - less prone to noise, but slower to detect changes
Ewma adcFilter2(0.09);
Ewma adcFilter3(0.09);
Ewma adcFilter4(0.09);
 


// Pin info
#define soundSensorPin A0 // Connect the MEMS AUD output to the Arduino A0 pin
#define echoPinA 2 // attach pin D2 Arduino to pin Echo of HC-SR04, ultra
#define trigPinA 3 //attach pin D3 Arduino to pin Trig of HC-SR04, ultra
#define echoPinB 4 // attach pin D2 Arduino to pin Echo of HC-SR04, ultra
#define trigPinB 5 //attach pin D3 Arduino to pin Trig of HC-SR04, ultra
#define echoPinC 6 // attach pin D2 Arduino to pin Echo of HC-SR04, ultra
#define trigPinC 7 //attach pin D3 Arduino to pin Trig of HC-SR04, ultra


int motionPinA = 8;               // choose the input pin (for PIR sensor)
int pirStateA = LOW;             // we start, assuming no motion detected
int motionValueA = 0;   
int isMotionDetectedA = 0;

int motionPinB = 9;               // choose the input pin (for PIR sensor)
int pirStateB = LOW;             // we start, assuming no motion detected
int motionValueB = 0;   
int isMotionDetectedB = 0;

int motionPinC = 10;               // choose the input pin (for PIR sensor)
int pirStateC = LOW;             // we start, assuming no motion detected
int motionValueC = 0;   
int isMotionDetectedC = 0;

// Variables
int rawSoundSensorValue = 0;
int filteredMappedSoundValue = 0;

long ultraSensorDurationA = 0; // variable for the duration of sound wave travel
long ultraSensorDurationB = 0; // variable for the duration of sound wave travel
long ultraSensorDurationC = 0; // variable for the duration of sound wave travel
int distanceA = 0; // variable for the distance measurement
int distanceB = 0; // variable for the distance measurement
int distanceC = 0; // variable for the distance measurement


String out_data;


void setup() {
  Serial.begin(9600);
  pinMode(trigPinA, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(echoPinA, INPUT); // Sets the echoPin as an INPUT
  pinMode(trigPinB, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(echoPinB, INPUT); // Sets the echoPin as an INPUT
  pinMode(trigPinC, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(echoPinC, INPUT); // Sets the echoPin as an INPUT
  pinMode(motionPinA, INPUT);     // declare sensor as input
}

void loop() {

  
  ////////////////////////////// sound sensor
  rawSoundSensorValue = analogRead(soundSensorPin);
  float filtered1rawSoundSensorValue = adcFilter1.filter(rawSoundSensorValue);
//  float filtered2rawSoundSensorValue = adcFilter2.filter(rawSoundSensorValue);
//  filteredMappedSoundValue = map(rawSoundSensorValue, 0, 1023, 0, 255); // map the value from potentiometer (range from 0 to 1023) to the brightness (from 0 to 255)

  ////////////////////////////// ultrasoninc sensor


  distanceA = CalculateDistanceA();
  distanceA = adcFilter2.filter(distanceA);
  distanceB = CalculateDistanceB();
  distanceB = adcFilter3.filter(distanceB);
  distanceC = CalculateDistanceC();
  distanceC = adcFilter4.filter(distanceC);

  ReadMotionSensorA();
  ReadMotionSensorB();  
  ReadMotionSensorC();
//
  out_data = String(filtered1rawSoundSensorValue) + "," +
             String(distanceA)  + "," + String(distanceB)  + "," + String(distanceC)  + "," +
             String(isMotionDetectedA)  + "," + String(isMotionDetectedB)  + "," + String(isMotionDetectedC) + "\n";
//  Serial.print(rawSoundSensorValue); Serial.print(", ");
//  Serial.print(distanceA); Serial.print(", ");
//  Serial.print(distanceB); Serial.print(", ");
//  Serial.print(distanceC); Serial.print(", ");
//  Serial.print(isMotionDetectedA); Serial.print(", ");
//  Serial.print(isMotionDetectedB); Serial.print(", ");
//  Serial.println(isMotionDetectedC);  
//  Serial.write(distanceB);
  delay(1);
  for (int i = 0; i < out_data.length(); i++)
    Serial.write(out_data[i]);
  out_data = "";

}


int CalculateDistanceA()
{
  int ultraSensorDistance = 0;
  digitalWrite(trigPinA, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPinA, HIGH);
  delayMicroseconds(5);
  digitalWrite(trigPinA, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  ultraSensorDurationA = pulseIn(echoPinA, HIGH);
  // Calculating the distance
  ultraSensorDistance = ultraSensorDurationA * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
  return ultraSensorDistance;
}

int CalculateDistanceB()
{
  int ultraSensorDistance = 0;
  digitalWrite(trigPinB, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPinB, HIGH);
  delayMicroseconds(5);
  digitalWrite(trigPinB, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  ultraSensorDurationB = pulseIn(echoPinB, HIGH);
  // Calculating the distance
  ultraSensorDistance = ultraSensorDurationB * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
  return ultraSensorDistance;
}

int CalculateDistanceC()
{
  int ultraSensorDistance = 0;
  digitalWrite(trigPinC, LOW);
  delayMicroseconds(2);
  // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  digitalWrite(trigPinC, HIGH);
  delayMicroseconds(5);
  digitalWrite(trigPinC, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  ultraSensorDurationC = pulseIn(echoPinC, HIGH);
  // Calculating the distance
  ultraSensorDistance = ultraSensorDurationC * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
  return ultraSensorDistance;
}

void ReadMotionSensorA()
{
  motionValueA = digitalRead(motionPinA);  // read input value
  if (motionValueA == HIGH)  // check if the input is HIGH
  {            
    if (pirStateA == LOW) 
    {
      isMotionDetectedA = 1;
      pirStateA = HIGH;
    }
  } 
  else 
  {
  
    if (pirStateA == HIGH)
    {
      isMotionDetectedA = 0;
      pirStateA = LOW;
    }
  }
}

void ReadMotionSensorB()
{
  motionValueB = digitalRead(motionPinB);  // read input value
  if (motionValueB == HIGH)  // check if the input is HIGH
  {            
    if (pirStateB == LOW) 
    {
      isMotionDetectedB = 1;
      pirStateB = HIGH;
    }
  } 
  else 
  {
    if (pirStateB == HIGH)
    {
      isMotionDetectedB = 0;
      pirStateB = LOW;
    }
  }
}

void ReadMotionSensorC()
{
  motionValueC = digitalRead(motionPinC);  // read input value
  if (motionValueC == HIGH)  // check if the input is HIGH
  {            
    if (pirStateC == LOW) 
    {
      isMotionDetectedC = 1;
      pirStateC = HIGH;
    }
  } 
  else 
  {
    if (pirStateC == HIGH)
    {
      isMotionDetectedC = 0;
      pirStateC = LOW;
    }
  }
}
