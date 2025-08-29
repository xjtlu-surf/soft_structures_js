import mqtt from 'mqtt'

// MQTT连接配置
const config = {
  host: '8.133.250.249',
  port: 8083,
  protocol: 'ws',
  username: 'surf_user1',
  password: 'dojxop-5Domzu-farreb'
}

console.log('Connecting to MQTT broker...')
const client = mqtt.connect(`ws://${config.host}:${config.port}/mqtt`, {
  username: config.username,
  password: config.password
})

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
