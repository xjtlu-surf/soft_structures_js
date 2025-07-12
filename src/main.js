import './style.css'
import mqtt from 'mqtt'


const statusDiv = document.querySelector('#mqtt-status');
const messagesDiv = document.querySelector('#mqtt-messages');
const buttonMatrixDiv = document.querySelector('#button-matrix');

const MQTT_SERVER = import.meta.env.VITE_MQTT_SERVER
const MQTT_USER_B64 = import.meta.env.VITE_MQTT_USER_B64;
const MQTT_PASSWORD_B64 = import.meta.env.VITE_MQTT_PASSWORD_B64;

// Decode the credentials
const MQTT_USER = atob(MQTT_USER_B64);
const MQTT_PASSWORD = atob(MQTT_PASSWORD_B64);

const client = mqtt.connect(MQTT_SERVER, { username: MQTT_USER, password: MQTT_PASSWORD });

// State to track the toggle status of each button (false = off, true = on)
const buttonStates = {};

// Create 9 buttons and append them to the button-matrix div
for (let i = 1; i <= 9; i++) {
  const button = document.createElement('button');
  button.textContent = `Led ${i}`;
  button.dataset.buttonNumber = i; // Store the button number
  button.classList.add('matrix-button'); // Add a class for styling
  buttonMatrixDiv.appendChild(button);

  // Initialize button state
  buttonStates[i] = false; // All buttons start in the "off" state

  button.addEventListener('click', () => {
    const buttonNumber = button.dataset.buttonNumber;
    const topic = 'wearable';

    // The value to send is based on the *current* state.
    // If off (false), send 100. If on (true), send 0.
    const valueToSend = buttonStates[buttonNumber] ? 0 : 100;

    // Now, toggle the state for the next click.
    buttonStates[buttonNumber] = !buttonStates[buttonNumber];

    // Toggle the button's visual state
    if (buttonStates[buttonNumber]) {
      button.classList.add('matrix-button-on');
    } else {
      button.classList.remove('matrix-button-on');
    }

    const payload = {
      actuator: String(buttonNumber - 1),
      value: valueToSend
    };

    const message = JSON.stringify(payload);

    if (client.connected) {
      console.log(`Attempting to publish message '${message}' to topic '${topic}' for button ${buttonNumber}...`);
      client.publish(topic, message, (err) => {
        if (err) {
          console.error(`Failed to publish message for button ${buttonNumber}:`, err);
          const p = document.createElement('p');
          p.textContent = `Failed to send: Led ${buttonNumber} (Error: ${err.message})`;
          messagesDiv.appendChild(p);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } else {
          console.log(`Successfully published message '${message}' to topic '${topic}' for button ${buttonNumber}`);
          const p = document.createElement('p');
          p.textContent = `Sent: ${message}`; // Display sent message
          messagesDiv.appendChild(p);
          messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
        }
      });
    } else {
      console.warn(`Client not connected. Cannot publish message for button ${buttonNumber}. Current status: ${statusDiv.textContent}`);
      const p = document.createElement('p');
      p.textContent = `Not sent: Led ${buttonNumber} (Client not connected)`;
      messagesDiv.appendChild(p);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  });
}

client.on('connect', () => {
  statusDiv.textContent = 'Connected to MQTT broker!';
  console.log('Connected to MQTT broker');
  client.subscribe('test', (err) => {
    if (!err) {
      console.log('Subscribed to topic: test');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', (topic, message) => {
  const msg = `Received message on topic ${topic}: ${message.toString()}`;
  console.log(msg);
  const p = document.createElement('p');
  p.textContent = msg;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
});

client.on('error', (err) => {
  statusDiv.textContent = `MQTT Error: ${err.message}`;
  console.error('MQTT Error:', err);
});

client.on('close', () => {
  statusDiv.textContent = 'Disconnected from MQTT broker.';
  console.log('Disconnected from MQTT broker');
});

client.on('reconnect', () => {
  statusDiv.textContent = 'Reconnecting to MQTT broker...';
  console.log('Reconnecting to MQTT broker...');
});

client.on('offline', () => {
  statusDiv.textContent = 'MQTT client is offline.';
  console.log('MQTT client is offline.');
});



