
# Wearable Pneumatics - Web Interface

This web interface provides a simple way to control a series of actuators connected to an ESP32. It features a 3x3 grid of buttons, each corresponding to an actuator.

## Features

- **MQTT Communication:** The web interface communicates with the ESP32 via an MQTT broker.
- **Actuator Control:**  Each button toggles a corresponding actuator on or off.
- **Connection Status:** The interface displays the current connection status to the MQTT broker.
- **Message Log:** A log of sent and received messages is displayed for debugging purposes.

## Installation and Setup

1. **Prerequisites:**
   - [Bun](https://bun.sh/) must be installed.

2. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-url>/Javascript Code/web-mqtt
   ```

3. **Install dependencies:**
   - This project uses [Vite](https://vitejs.dev/) for the frontend development server. If you don't have Vite installed globally, you can install it with Bun:
    ```bash
    bun add -g vite
    ```
   - Install the project dependencies using Bun:
    ```bash
    bun install
    ```

4. **Configure MQTT Broker:**
   - The MQTT broker credentials are hardcoded in `src/main.js`. You may need to update the following lines to match your broker's configuration:
     ```javascript
     const client = mqtt.connect('mqtt://your-broker-address:port', { username: 'your-username', password: 'your-password' });
     ```

5. **Run the development server:**
   ```bash
   bun run dev
   ```
   This will start a local development server. Open your web browser and navigate to the provided URL (usually `http://localhost:5173`).

## Usage

- Click on any of the buttons in the 3x3 grid to send a command to the corresponding actuator.
- The button will change color to indicate the on/off state.
- The "MQTT Connection Status" section will show if the web interface is connected to the MQTT broker.
- The "Messages" section will display a log of sent and received MQTT messages.
"
