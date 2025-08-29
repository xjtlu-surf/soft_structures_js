import mqtt from 'mqtt'


// MQTT连接配置

console.log('Connecting to MQTT broker...')

const MQTT_SERVER = import.meta.env.VITE_MQTT_SERVER
const MQTT_USER_B64 = import.meta.env.VITE_MQTT_USER_B64;
const MQTT_PASSWORD_B64 = import.meta.env.VITE_MQTT_PASSWORD_B64;
// Decode the credentials
const MQTT_USER = atob(MQTT_USER_B64);
const MQTT_PASSWORD = atob(MQTT_PASSWORD_B64);

const client = mqtt.connect(MQTT_SERVER, { username: MQTT_USER, password: MQTT_PASSWORD });

client.on('connect', () => {
  console.log('✅ MQTT Connected successfully!')
  
  // 订阅patient主题
  client.subscribe('patient', (err) => {
    if (err) {
      console.error('❌ Subscribe error:', err)
    } else {
      console.log('✅ Successfully subscribed to patient topic')
      
      // 发送测试消息
      const testMessage = {
        type: 'test',
        data: 'Hello from test script',
        timestamp: new Date().toISOString(),
        sender: 'test-script'
      }
      
      client.publish('patient', JSON.stringify(testMessage), (err) => {
        if (err) {
          console.error('❌ Publish error:', err)
        } else {
          console.log('✅ Test message sent successfully')
        }
      })
    }
  })
})

client.on('message', (topic, message) => {
  console.log(`📨 Received message on topic "${topic}":`)
  try {
    const jsonMessage = JSON.parse(message.toString())
    console.log('📋 Parsed JSON:', JSON.stringify(jsonMessage, null, 2))
  } catch (error) {
    console.log('📋 Raw message:', message.toString())
  }
})

client.on('error', (err) => {
  console.error('❌ MQTT Error:', err)
})

client.on('disconnect', () => {
  console.log('🔌 MQTT Disconnected')
})

// 5秒后断开连接
setTimeout(() => {
  console.log('🔌 Disconnecting...')
  client.end()
  process.exit(0)
}, 5000)
