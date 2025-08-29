import React, { useEffect, useState, useRef } from 'react'
import mqtt from 'mqtt'
import { Button, Card, Typography, Space, Input, Select } from 'antd'

const { Title, Text } = Typography
const { Option } = Select

interface MqttMessage {
  id: string
  timestamp: string
  type: string
  data: any
}

const MqttTest: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<MqttMessage[]>([])
  const [testMessage, setTestMessage] = useState('')
  const [messageType, setMessageType] = useState('status_update')
  const mqttClientRef = useRef<any>(null)

  useEffect(() => {
    // 连接MQTT
    const client = mqtt.connect('ws://8.133.250.249:8083/mqtt', {
      username: 'surf_user1',
      password: 'dojxop-5Domzu-farreb'
    })

    client.on('connect', () => {
      console.log('MQTT Test Connected')
      setIsConnected(true)
      
      // 订阅patient主题
      client.subscribe('patient', (err) => {
        if (err) {
          console.error('MQTT Subscribe Error:', err)
        } else {
          console.log('Successfully subscribed to patient topic')
        }
      })
    })

    client.on('message', (topic, message) => {
      if (topic === 'patient') {
        try {
          const jsonMessage = JSON.parse(message.toString())
          console.log('Received patient message:', jsonMessage)
          
          const newMessage: MqttMessage = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            type: jsonMessage.type || 'unknown',
            data: jsonMessage
          }
          
          setMessages(prev => [newMessage, ...prev.slice(0, 9)]) // 保留最近10条消息
        } catch (error) {
          console.error('Error parsing patient message:', error)
          console.log('Raw message:', message.toString())
        }
      }
    })

    client.on('error', (err) => {
      console.error('MQTT Error:', err)
      setIsConnected(false)
    })

    client.on('disconnect', () => {
      console.log('MQTT Disconnected')
      setIsConnected(false)
    })

    mqttClientRef.current = client

    return () => {
      client.end()
    }
  }, [])

  // 发送测试消息到patient主题
  const sendTestMessage = () => {
    if (!mqttClientRef.current || !testMessage.trim()) return

    const message = {
      type: messageType,
      data: testMessage,
      timestamp: new Date().toISOString(),
      sender: 'test-client'
    }

    mqttClientRef.current.publish('patient', JSON.stringify(message), (err: any) => {
      if (err) {
        console.error('Error publishing message:', err)
      } else {
        console.log('Test message sent successfully')
        setTestMessage('')
      }
    })
  }

  // 清空消息列表
  const clearMessages = () => {
    setMessages([])
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>MQTT Patient Topic Test</Title>
      
      {/* 连接状态 */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Connection Status:</Text>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8 
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: isConnected ? '#52c41a' : '#ff4d4f'
            }} />
            <Text>{isConnected ? 'Connected' : 'Disconnected'}</Text>
          </div>
        </Space>
      </Card>

      {/* 发送测试消息 */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Send Test Message</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Text>Message Type:</Text>
            <Select
              value={messageType}
              onChange={setMessageType}
              style={{ width: 150 }}
            >
              <Option value="status_update">Status Update</Option>
              <Option value="alert">Alert</Option>
              <Option value="data">Data</Option>
              <Option value="command">Command</Option>
            </Select>
          </div>
          <Input.TextArea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message content..."
            rows={3}
          />
          <Button 
            type="primary" 
            onClick={sendTestMessage}
            disabled={!isConnected || !testMessage.trim()}
          >
            Send Message
          </Button>
        </Space>
      </Card>

      {/* 接收到的消息 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>Received Messages</Title>
          <Button onClick={clearMessages}>Clear All</Button>
        </div>
        
        {messages.length === 0 ? (
          <Text type="secondary">No messages received yet...</Text>
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {messages.map((msg) => (
              <Card 
                key={msg.id} 
                size="small" 
                style={{ marginBottom: 8 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>{msg.type}</Text>
                  <Text type="secondary">{msg.timestamp}</Text>
                </div>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: 8, 
                  borderRadius: 4,
                  fontSize: 12,
                  overflow: 'auto'
                }}>
                  {JSON.stringify(msg.data, null, 2)}
                </pre>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default MqttTest
