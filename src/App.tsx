import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { Card, Typography, Space, Button, Tooltip } from 'antd'
import { UserOutlined, SolutionOutlined, EditOutlined, HighlightOutlined, BgColorsOutlined, BorderOutlined, DeleteOutlined, ArrowRightOutlined, ScissorOutlined, AimOutlined, HeartOutlined, StarOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import './App.css'
import { useState } from 'react'
import Background from './Background'
import Dandelion from './Dandelion'
import mqtt from 'mqtt'
import { useEffect } from 'react'
import { useRef } from 'react'
import MqttTest from './MqttTest'


const { Title } = Typography

const NAVS = [
  { key: 'home', label: 'homepage', cn: '首页', path: '/' },
  { key: 'patient', label: 'patient', cn: '患者', path: '/patient' },
  { key: 'doctor', label: 'doctor', cn: '医生', path: '/doctor' },
  { key: 'mqtt', label: 'MQTT', cn: 'MQTT', path: '/mqtt-test' },
]

function UserInfoPopover() {
  // 假设当前登录者信息如下
  const user = {
    name: 'Bob',
    gender: 'Male',
    age: 32,
    birthday: '1992-05-18',
    regTime: '2023-04-01 14:23',
    phone: '138****8888',
    email: 'bob@example.com',
    address: 'Pudong, Shanghai',
    id: 'P20230401001',
  }
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      onMouseEnter={e => {
        const pop = document.createElement('div')
        pop.innerHTML = `
          <div style="padding:18px 28px;min-width:220px;background:#fff;border-radius:12px;box-shadow:0 4px 24px #0001;position:absolute;top:56px;right:0;z-index:999;font-size:15px;line-height:2;">
            <b style='font-size:18px;'>Patient Info</b><br/>
            Name: ${user.name}<br/>
            Gender: ${user.gender}<br/>
            Age: ${user.age}<br/>
            Birthday: ${user.birthday}<br/>
            Registration: ${user.regTime}<br/>
            Phone: ${user.phone}<br/>
            Email: ${user.email}<br/>
            Address: ${user.address}<br/>
            ID: ${user.id}
          </div>
        `
        pop.className = 'user-popover'
        pop.style.pointerEvents = 'none'
        e.currentTarget.appendChild(pop)
      }}
      onMouseLeave={e => {
        const pops = e.currentTarget.querySelectorAll('.user-popover')
        pops.forEach(p => p.remove())
      }}
    >
      <UserOutlined style={{ fontSize: 32, color: '#52c41a', marginRight: 8, verticalAlign: 'middle' }} />
      <span style={{ fontWeight: 600, fontSize: 18, color: '#333', verticalAlign: 'middle' }}>Bob</span>
    </div>
  )
}

function LogoHeader() {
  const navigate = useNavigate ? useNavigate() : undefined
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '10px 24px',
      zIndex: 100,
      background: 'rgba(255,255,255,0.85)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      <img
        src="logo.png"
        alt="ArtClue Logo"
        style={{
          height: 36,
          width: 36,
          marginRight: 16,
          filter: 'contrast(1.15) saturate(1.2) drop-shadow(0 2px 8px #e0e0e0)',
          borderRadius: 8,
          objectFit: 'contain',
          background: 'none',
          boxShadow: 'none',
          border: 'none',
        }}
      />
      <span style={{
        fontWeight: 700,
        fontSize: 28,
        fontFamily: 'Georgia, serif',
        letterSpacing: 1,
        color: '#222',
        textShadow: '0 1px 0 #fff, 0 2px 8px #e0e0e0',
        marginRight: 40
      }}>
        ArtClue
      </span>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', marginLeft: 120 }}>
        <nav style={{ display: 'flex', gap: 32 }}>
          {NAVS.map(item => (
            <span
              key={item.key}
              onClick={() => navigate && navigate(item.path)}
              style={{
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontWeight: 500,
                fontSize: 20,
                color: '#444',
                cursor: 'pointer',
                position: 'relative',
                padding: '2px 8px',
                borderRadius: 4,
                transition: 'background 0.2s',
                marginRight: 4
              }}
              onMouseEnter={e => {
                const tip = document.createElement('div')
                tip.innerText = item.cn
                tip.style.position = 'absolute'
                tip.style.bottom = '-28px'
                tip.style.left = '50%'
                tip.style.transform = 'translateX(-50%)'
                tip.style.background = '#fff'
                tip.style.color = '#1677ff'
                tip.style.fontSize = '15px'
                tip.style.padding = '2px 10px'
                tip.style.borderRadius = '6px'
                tip.style.boxShadow = '0 2px 8px #eee'
                tip.style.whiteSpace = 'nowrap'
                tip.className = 'nav-tip'
                e.currentTarget.appendChild(tip)
              }}
              onMouseLeave={e => {
                const tips = e.currentTarget.querySelectorAll('.nav-tip')
                tips.forEach(t => t.remove())
              }}
            >
              {item.label}
            </span>
          ))}
        </nav>
      </div>
      <div style={{ marginLeft: 'auto', marginRight: 72 }}>
        <UserInfoPopover />
      </div>
    </div>
  )
}

function Home() {
  const navigate = useNavigate()
  const metaTitleStyle = { fontSize: 30, fontWeight: 700, textAlign: 'center' as const, marginBottom: 8 }
  // MQTT连接相关状态
  const [mqttOn, setMqttOn] = useState(false)
  const [mqttLoading, setMqttLoading] = useState(false)
  const [showMqttSuccess, setShowMqttSuccess] = useState(false)

  // 处理MQTT开关
  const handleMqttToggle = () => {
    if (!mqttOn) {
      setMqttOn(true)
      setMqttLoading(true)
      setTimeout(() => {
        setMqttLoading(false)
        setShowMqttSuccess(true)
        setTimeout(() => setShowMqttSuccess(false), 2200)
      }, 2000)
    } else {
      setMqttOn(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        <Card
          hoverable
          style={{ width: 320, height: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => navigate('/doctor')}
          cover={<SolutionOutlined style={{ fontSize: 48, color: '#1677ff', margin: '32px auto' }} />}
        >
          <div style={metaTitleStyle}>Doctor Entry</div>
          <div style={{ textAlign: 'center' }}>Check the results</div>
        </Card>
        <Card
          hoverable
          style={{ width: 320, height: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => navigate('/patient')}
          cover={<UserOutlined style={{ fontSize: 48, color: '#52c41a', margin: '32px auto' }} />}
        >
          <div style={metaTitleStyle}>Patient Entry</div>
          <div style={{ textAlign: 'center' }}>Write and Draw</div>
        </Card>
      </div>
      {/* MQTT Connection开关浮动区域 */}
      <div style={{
        position: 'fixed',
        right: 76,
        bottom: 76,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        boxShadow: '0 2px 12px #0002',
        padding: '10px 22px 10px 18px',
        minWidth: 220
      }}>
        <span style={{ fontWeight: 600, fontSize: 17, marginRight: 16 }}>MQTT Connection</span>
        {/* 滑动开关 */}
        <div
          onClick={handleMqttToggle}
          style={{
            width: 48,
            height: 28,
            borderRadius: 16,
            background: mqttOn ? '#52c41a' : '#eee',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.3s',
            marginRight: 14,
            boxShadow: mqttOn ? '0 0 8px #52c41a55' : '0 0 4px #ccc',
            display: 'inline-block',
          }}
        >
          <div style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: 3,
            left: mqttOn ? 23 : 3,
            transition: 'left 0.3s',
            boxShadow: '0 2px 8px #0001',
          }} />
        </div>
        {/* 加载动画 */}
        {mqttLoading && (
          <span style={{ display: 'inline-block', width: 24, height: 24 }}>
            <svg width="24" height="24" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" stroke="#1890ff" strokeWidth="4" fill="none" strokeDasharray="60" strokeDashoffset="20">
                <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
              </circle>
            </svg>
          </span>
        )}
      </div>
      {/* 顶部弹窗提示 */}
      {showMqttSuccess && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          color: '#222',
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 12,
          padding: '16px 40px',
          boxShadow: '0 2px 16px #0002',
          zIndex: 2000,
          letterSpacing: 1
        }}
        className="mqtt-slide-down"
        >
          MQTT has been successfully connected.
        </div>
      )}
    </div>
  )
}

function Doctor({ records = [], setRecords }: { records?: {img: string, desc: string, analysis: string, userDescription?: string}[], setRecords?: React.Dispatch<React.SetStateAction<{img: string, desc: string, analysis: string, userDescription?: string}[]>> }) {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', background: 'none', margin: 0, padding: 0, position: 'relative', minHeight: 400 }}>
      {/* 白色背景板区域 */}
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px #0002',
        width: 480,
        minHeight: 320,
        margin: '0 auto',
        padding: '36px 0 24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Exercise records标题 */}
        <div style={{ fontSize: 40, fontWeight: 700, color: '#222', marginBottom: 32 }}>Exercise records</div>
        {records.length > 0 ? (
          <div style={{ color: '#222', fontSize: 22, width: '100%' }}>
            {records.map((rec, idx) => (
              <button
                key={idx}
                style={{
                  margin: '12px auto',
                  background: '#222',
                  borderRadius: 8,
                  padding: '12px 32px',
                  width: 260,
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  boxShadow: '0 2px 8px #0002',
                  display: 'block',
                }}
                onClick={() => navigate(`/doctor/record/${idx + 1}`)}
              >
                {`Record ${idx + 1}`}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ color: '#bbb', fontSize: 20, marginTop: 40 }}>No records yet.</div>
        )}
        {/* Empty All按钮 */}
        {records.length > 0 && setRecords && (
          <button
            onClick={() => setRecords(() => [])}
            style={{
              position: 'absolute',
              right: 32,
              bottom: 24,
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #0002',
            }}
          >
            Empty All
          </button>
        )}
      </div>
    </div>
  )
}

// 记录详情页面
function RecordDetail({ records }: { records: {img: string, desc: string, analysis: string, userDescription?: string}[] }) {
  const { id } = useParams();
  const idx = id ? parseInt(id, 10) - 1 : -1;
  const record = records[idx];
  if (!record) return <div style={{padding:80, textAlign:'center'}}>No record found.</div>;
  return (
    <div style={{ display: 'flex', minHeight: 500, alignItems: 'flex-start', justifyContent: 'center', padding: 60, gap: 60 }}>
      {/* 左侧图片 */}
      <div style={{ width: 320, minWidth: 220, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18, color: '#333' }}>Final Images</div>
        {record.img ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            {record.img.split('\n').map((imgSrc, index) => (
              <img 
                key={index}
                src={imgSrc} 
                alt={`record ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  borderRadius: 12, 
                  objectFit: 'contain',
                  border: '1px solid #e8e8e8'
                }} 
              />
            ))}
          </div>
        ) : (
          <span>No image</span>
        )}
      </div>
      {/* 右侧描述和分析 */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001', padding: 32, minWidth: 320 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18, color: '#333' }}>Your Description</div>
        <div style={{ fontSize: 17, color: '#444', marginBottom: 32, whiteSpace: 'pre-line' }}>
          {record.userDescription || record.desc || <span style={{color:'#bbb'}}>No description</span>}
        </div>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18, color: '#333' }}>System Analysis</div>
        <div style={{ fontSize: 17, color: '#444', whiteSpace: 'pre-line' }}>{record.analysis}</div>
      </div>
    </div>
  )
}

 
function PatientIntro() {
  const firstRef = useRef<HTMLDivElement>(null)
  const secondRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  // 动画：依次显示
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [showStart, setShowStart] = useState(false)
  useEffect(() => {
    setTimeout(() => setShow1(true), 400)
    setTimeout(() => setShow2(true), 1800)
  }, [])
  useEffect(() => {
    if (show2) {
      const timer = setTimeout(() => setShowStart(true), 800)
      return () => clearTimeout(timer)
    }
  }, [show2])
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 120
    }}>
      <div style={{
        fontSize: 54,
        fontWeight: 800,
        fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif',
        marginBottom: 36,
        marginTop: 32,
        letterSpacing: 1,
        color: '#222',
        textShadow: '0 2px 12px #eee',
        transition: 'opacity 0.8s',
        opacity: 1
      }}>
        Introduction
      </div>
      <div
        ref={firstRef}
        style={{
          fontSize: 22,
          fontWeight: 500,
          fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif',
          color: '#fff',
          marginBottom: 24,
          maxWidth: 700,
          textAlign: 'center',
          opacity: show1 ? 1 : 0,
          transition: 'opacity 1.2s',
        }}
      >
        Welcome to ArtClue. Please follow our guidelines and start a unique journey!
      </div>
      <div
        ref={secondRef}
        style={{
          fontSize: 18,
          fontWeight: 400,
          fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif',
          color: '#fff',
          maxWidth: 700,
          textAlign: 'center',
          lineHeight: 1.8,
          opacity: show2 ? 1 : 0,
          transition: 'opacity 1.2s',
        }}
      >
        First step: Relax. Just feel every part of your body, and do some drawing on the human model. You can use <i style={{ fontSize: 22, fontWeight: 700, color: '#ffb6d5' }}>different lines, colors or shapes</i> to assist your creation. After confirming that you've completed your work, you can talk to me in the dialog box on the right about the insights you gained during the creative process. Are you ready? Let's get started!
      </div>
      {/* Start按钮，所有文字出现后再延迟一会儿显示 */}
      {showStart && (
        <Button
          type="primary"
          size="large"
          style={{ marginTop: 48, width: 180, fontSize: 22, fontWeight: 700, borderRadius: 12 }}
          onClick={() => navigate('/patient/start')}
        >
          Start
        </Button>
      )}
    </div>
  )
}

// 预留新界面组件
function PatientStart({ setRecords }: { setRecords?: React.Dispatch<React.SetStateAction<{img: string, desc: string, analysis: string}[]>> }) {
  // 聊天相关状态
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ from: 'system' | 'user'; text: string }[]>([])
  // 绘画相关状态
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingMode, setDrawingMode] = useState(false)
  const [eraserMode, setEraserMode] = useState(false)
  const [completedDrawing, setCompletedDrawing] = useState<string | null>(null)
  const [brushColor, setBrushColor] = useState('red')
  const [brushSize, setBrushSize] = useState(8)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDrawingRef = useRef(false)
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 640 })
  
  // 绘画历史记录
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([])
  const [currentStep, setCurrentStep] = useState(-1)

  // 新增动画状态
  const [slideUp, setSlideUp] = useState(false)
  const [slideUp1_5, setSlideUp1_5] = useState(false)
  const [slideUp2, setSlideUp2] = useState(false)
  const [slideUp3, setSlideUp3] = useState(false)
  const [slideUp4, setSlideUp4] = useState(false)
  const [slideUp5, setSlideUp5] = useState(false)
  const [slideUp6, setSlideUp6] = useState(false)
  const [slideUpStomach1, setSlideUpStomach1] = useState(false)
  const [slideUpStomach2, setSlideUpStomach2] = useState(false)
  const [slideUpStomach3, setSlideUpStomach3] = useState(false)
  const [slideUpStomach4, setSlideUpStomach4] = useState(false)
  const [slideUpDrawAgain, setSlideUpDrawAgain] = useState(false)
  const [slideUpComplete, setSlideUpComplete] = useState(false)
  const [slideUpBodySensation, setSlideUpBodySensation] = useState(false)
  const [slideUpUser, setSlideUpUser] = useState(false)
  const [showAnalysisLoading, setShowAnalysisLoading] = useState(false)
  const [slideUpSys, setSlideUpSys] = useState(false)
  const [slideUpAnalysis, setSlideUpAnalysis] = useState(false)
  const [slideUpRecord, setSlideUpRecord] = useState(false)
  const [slideUpThanks, setSlideUpThanks] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [slideUpBack1, setSlideUpBack1] = useState(false)
  const [slideUpBack2, setSlideUpBack2] = useState(false)
  const [slideUpBack3, setSlideUpBack3] = useState(false)
  const [slideUpBack4, setSlideUpBack4] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate();

  // 新增：记录描述作品的内容
  const [waitingForDesc, setWaitingForDesc] = useState(false)
  const [descDraft, setDescDraft] = useState<string | null>(null)
  const [waitingForComfort, setWaitingForComfort] = useState(false)
  const [waitingForStomachResponse, setWaitingForStomachResponse] = useState(false)
  const [waitingForBackResponse, setWaitingForBackResponse] = useState(false)
  const [waitingForWaistResponse, setWaitingForWaistResponse] = useState(false)
  const [completeCount, setCompleteCount] = useState(0) // 新增：跟踪complete次数
  const [firstCompleteImage, setFirstCompleteImage] = useState<string>('') // 第一次complete的图像
  const [secondCompleteImage, setSecondCompleteImage] = useState<string>('') // 第二次complete的图像
  const [allUserMessages, setAllUserMessages] = useState<string[]>([]) // 所有用户消息
  const [colorAnalysis, setColorAnalysis] = useState<string>('') // 颜色分析
  const [stomachAnalysis, setStomachAnalysis] = useState<string>('') // 胃部分析
  const [backAnalysis, setBackAnalysis] = useState<string>('') // 背部分析
  const [waistAnalysis, setWaistAnalysis] = useState<string>('') // 腰部分析
  const [userInputHistory, setUserInputHistory] = useState<string[]>(() => {
    // 从localStorage加载历史记录
    const saved = localStorage.getItem('userInputHistory')
    return saved ? JSON.parse(saved) : []
  }) // 用户输入历史记录
  const [waitingForBodySensation, setWaitingForBodySensation] = useState(false) // 等待身体感受描述
  const [showAllHistory, setShowAllHistory] = useState(false) // 是否显示所有历史记录

  // 新增：模式选择
  const [mode, setMode] = useState<'mode1' | 'mode2' | 'mode3' | 'mode4'>('mode1')

  // 记录用到的颜色
  const [usedColors, setUsedColors] = useState<string[]>([])

  // 新增：正面/背面切换
  const [isFront, setIsFront] = useState(true)

  // 新增：分别保存正面和背面的绘制图像
  const [frontImageData, setFrontImageData] = useState<string>('')
  const [backImageData, setBackImageData] = useState<string>('')

  // 新增：工具栏状态
  const [currentTool, setCurrentTool] = useState<'brush' | 'bucket' | 'shape' | 'eraser' | 'arrow'>('arrow')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showShapePicker, setShowShapePicker] = useState(false)
  const [selectedShape, setSelectedShape] = useState<'square' | 'rectangle' | 'star' | 'polygon' | 'circle' | 'triangle' | 'diamond' | 'heart'>('square')
  const [isColorPickerHovered, setIsColorPickerHovered] = useState(false)
  const [isShapePickerHovered, setIsShapePickerHovered] = useState(false)
  const [showBrushThickness, setShowBrushThickness] = useState(false)
  const [showEraserPanel, setShowEraserPanel] = useState(false)
  const [isEraserPanelHovered, setIsEraserPanelHovered] = useState(false)
  const [showArrowPanel, setShowArrowPanel] = useState(false)
  const [isArrowPanelHovered, setIsArrowPanelHovered] = useState(false)
  const [isBrushPanelHovered, setIsBrushPanelHovered] = useState(false)
  const [showUndoPanel, setShowUndoPanel] = useState(false);
  const [showRedoPanel, setShowRedoPanel] = useState(false);
  const [shapeStartPos, setShapeStartPos] = useState({ x: 0, y: 0 });

  // 颜色选项 - 只保留有颜色分析的颜色
  const colorOptions = [
    { name: 'Pink', color: '#ffb6b6' },
    { name: 'Light Blue', color: '#b6d6ff' },
    { name: 'Yellow', color: '#ffff44' },
    { name: 'Light Green', color: '#b6ffb6' }
  ]

  // 形状选项
  const shapeOptions = [
    { name: 'Square', shape: 'square', icon: <BorderOutlined className="shape-icon" /> },
    { name: 'Rectangle', shape: 'rectangle', icon: <BorderOutlined className="shape-icon" style={{ transform: 'scaleX(1.5)' }} /> },
    { name: 'Circle', shape: 'circle', icon: <BorderOutlined className="shape-icon" style={{ borderRadius: '50%' }} /> },
    { name: 'Triangle', shape: 'triangle', icon: <BorderOutlined className="shape-icon" style={{ transform: 'rotate(45deg)' }} /> },
    { name: 'Star', shape: 'star', icon: <StarOutlined className="shape-icon" /> },
    { name: 'Polygon', shape: 'polygon', icon: <BorderOutlined className="shape-icon" style={{ transform: 'rotate(30deg)' }} /> },
    { name: 'Diamond', shape: 'diamond', icon: <BorderOutlined className="shape-icon" style={{ transform: 'rotate(45deg) scale(1.2)' }} /> },
    { name: 'Heart', shape: 'heart', icon: <HeartOutlined className="shape-icon" /> }
  ]

  // 获取当前选择的形状图标
  const getSelectedShapeIcon = () => {
    const selectedShapeOption = shapeOptions.find(option => option.shape === selectedShape)
    return selectedShapeOption ? selectedShapeOption.icon : <BorderOutlined className="shape-icon" />
  }

  // 绘制形状的函数
  const drawShape = (ctx: CanvasRenderingContext2D, endX: number, endY: number, isPreview: boolean = false) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // 获取起始点（鼠标按下时的位置）
    const startX = shapeStartPos.x
    const startY = shapeStartPos.y
    
    const width = Math.abs(endX - startX)
    const height = Math.abs(endY - startY)
    const x = Math.min(startX, endX)
    const y = Math.min(startY, endY)
    
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = brushColor
    ctx.fillStyle = brushColor
    ctx.lineWidth = isPreview ? 1 : 2
    
    switch (selectedShape) {
      case 'square':
        if (isPreview) {
          ctx.strokeRect(x, y, width, width)
        } else {
          ctx.fillRect(x, y, width, width)
        }
        break
      case 'rectangle':
        if (isPreview) {
          ctx.strokeRect(x, y, width, height)
        } else {
          ctx.fillRect(x, y, width, height)
        }
        break
      case 'circle':
        const radius = Math.min(width, height) / 2
        const centerX = x + width / 2
        const centerY = y + height / 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        if (isPreview) {
          ctx.stroke()
        } else {
          ctx.fill()
        }
        break
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(x + width / 2, y)
        ctx.lineTo(x, y + height)
        ctx.lineTo(x + width, y + height)
        ctx.closePath()
        if (isPreview) {
          ctx.stroke()
        } else {
          ctx.fill()
        }
        break
      case 'star':
        drawStar(ctx, x + width / 2, y + height / 2, Math.min(width, height) / 2, isPreview)
        break
      case 'polygon':
        drawPolygon(ctx, x + width / 2, y + height / 2, Math.min(width, height) / 2, 6, isPreview)
        break
      case 'diamond':
        ctx.beginPath()
        ctx.moveTo(x + width / 2, y)
        ctx.lineTo(x + width, y + height / 2)
        ctx.lineTo(x + width / 2, y + height)
        ctx.lineTo(x, y + height / 2)
        ctx.closePath()
        if (isPreview) {
          ctx.stroke()
        } else {
          ctx.fill()
        }
        break
      case 'heart':
        drawHeart(ctx, x + width / 2, y + height / 2, Math.min(width, height) / 2, isPreview)
        break
    }
  }

  // 绘制星形
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, isPreview: boolean) => {
    const spikes = 5
    const outerRadius = radius
    const innerRadius = radius * 0.4
    
    ctx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes
      const r = i % 2 === 0 ? outerRadius : innerRadius
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    if (isPreview) {
      ctx.stroke()
    } else {
      ctx.fill()
    }
  }

  // 绘制多边形
  const drawPolygon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, sides: number, isPreview: boolean) => {
    ctx.beginPath()
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    if (isPreview) {
      ctx.stroke()
    } else {
      ctx.fill()
    }
  }

  // 绘制心形
  const drawHeart = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, isPreview: boolean) => {
    ctx.beginPath()
    ctx.moveTo(cx, cy + radius * 0.3)
    ctx.bezierCurveTo(cx, cy, cx - radius, cy, cx - radius, cy + radius * 0.7)
    ctx.bezierCurveTo(cx - radius, cy + radius * 1.3, cx, cy + radius * 1.3, cx, cy + radius * 1.3)
    ctx.bezierCurveTo(cx, cy + radius * 1.3, cx + radius, cy + radius * 1.3, cx + radius, cy + radius * 0.7)
    ctx.bezierCurveTo(cx + radius, cy, cx, cy, cx, cy + radius * 0.3)
    if (isPreview) {
      ctx.stroke()
    } else {
      ctx.fill()
    }
  }

  useEffect(() => {
    // 第一条消息立即显示
    setMessages([{ from: 'system', text: "Hi! Welcome here. I'm your assistant!" }])
    setSlideUp(true)
    setTimeout(() => setSlideUp(false), 700)
    
    // 第二条消息延迟显示
    const timer1_5 = setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'system', text: 'Before everything begins, you can find a quiet and comfortable place. This will be an enjoyable journey.' }])
      setSlideUp1_5(true)
      setTimeout(() => setSlideUp1_5(false), 700)
    }, 1200)
    
    // 第三条消息延迟显示
    const timer2 = setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'system', text: 'How are you feeling now? Are you comfortable?' }])
      setSlideUp2(true)
      setTimeout(() => setSlideUp2(false), 700)
      setWaitingForComfort(true) // 等待用户回答舒适度
    }, 2700)
    
    return () => {
      clearTimeout(timer1_5)
      clearTimeout(timer2)
    }
  }, [])



  // Mode参数
  const [modeParams, setModeParams] = useState({
    frequency: 10,
    airbagCombo: 'A+B'
  })

  // MQTT client
  const mqttClientRef = useRef<any>(null)
  useEffect(() => {
    const MQTT_SERVER = import.meta.env.VITE_MQTT_SERVER
    const MQTT_USER_B64 = import.meta.env.VITE_MQTT_USER_B64;
    const MQTT_PASSWORD_B64 = import.meta.env.VITE_MQTT_PASSWORD_B64;

    // Decode the credentials
    const MQTT_USER = atob(MQTT_USER_B64);
    const MQTT_PASSWORD = atob(MQTT_PASSWORD_B64);

    const client = mqtt.connect(MQTT_SERVER, { username: MQTT_USER, password: MQTT_PASSWORD });

    
    client.on('connect', () => {
      console.log('PatientStart MQTT Connected')
      // 订阅patient主题
      client.subscribe('patient', (err) => {
        if (err) {
          console.error('PatientStart MQTT Subscribe Error:', err)
        } else {
          console.log('PatientStart successfully subscribed to patient topic')
        }
      })
    })
    
    client.on('message', (topic, message) => {
      if (topic === 'patient') {
        try {
          // 解析JSON消息
          const jsonMessage = JSON.parse(message.toString())
          console.log('PatientStart received patient message:', jsonMessage)
          
          // 处理接收到的JSON消息
          handlePatientMessageInStart(jsonMessage)
        } catch (error) {
          console.error('PatientStart error parsing patient message:', error)
          console.log('PatientStart raw message:', message.toString())
        }
      }
    })
    
    client.on('error', (err) => {
      console.error('PatientStart MQTT Error:', err)
    })
    
    mqttClientRef.current = client
    return () => {
      client.end()
    }
  }, [])
  
  // 处理PatientStart中接收到的patient消息
  const handlePatientMessageInStart = (message: any) => {
    console.log('PatientStart processing patient message:', message)
    
    // 根据消息内容进行相应处理
    if (message.type) {
      switch (message.type) {
        case 'status_update':
          console.log('PatientStart: Patient status updated:', message.data)
          break
        case 'alert':
          console.log('PatientStart: Patient alert:', message.data)
          break
        case 'data':
          console.log('PatientStart: Patient data received:', message.data)
          break
        case 'command':
          console.log('PatientStart: Received command:', message.data)
          // 可以在这里处理特定的命令
          break
        default:
          console.log('PatientStart: Unknown message type:', message.type)
      }
    }
  }

  // 保存当前canvas状态到历史记录
  const saveCanvasState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // 移除当前步骤之后的历史记录（如果撤销后重新绘画）
    const newHistory = drawingHistory.slice(0, currentStep + 1)
    newHistory.push(imageData)
    
    setDrawingHistory(newHistory)
    setCurrentStep(newHistory.length - 1)
  }

  // 恢复到指定步骤
  const restoreCanvasState = (step: number) => {
    const canvas = canvasRef.current
    if (!canvas || step < 0 || step >= drawingHistory.length) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.putImageData(drawingHistory[step], 0, 0)
  }

  // 初始化空白canvas状态
  useEffect(() => {
    if (canvasRef.current && drawingHistory.length === 0) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setDrawingHistory([imageData])
        setCurrentStep(0)
      }
    }
  }, [canvasSize])

  // 动态设置canvas尺寸与容器一致
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCanvasSize({ width: rect.width, height: rect.height })
    }
  }, [drawingMode])

  // 获取相对于canvas的坐标（考虑缩放）
  function getCanvasCoords(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  // 绘画事件处理
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!['brush', 'eraser', 'shape'].includes(currentTool)) return
    isDrawingRef.current = true
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getCanvasCoords(e)
    
    if (currentTool === 'shape') {
      // 对于shape工具，直接绘制形状
      setShapeStartPos({ x, y })
      drawShape(ctx, x + 30, y + 30, false) // 绘制一个固定大小的形状
      setTimeout(() => saveCanvasState(), 10)
      isDrawingRef.current = false
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y)
      if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = brushColor
      }
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !['brush', 'eraser'].includes(currentTool)) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getCanvasCoords(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawingRef.current && ['brush', 'eraser'].includes(currentTool)) {
      // 绘画结束时保存状态
      setTimeout(() => saveCanvasState(), 10)
    }
    isDrawingRef.current = false
  }

  // 工具点击处理函数
  const handleToolClick = (tool: 'brush' | 'bucket' | 'shape' | 'eraser' | 'arrow') => {
    setCurrentTool(tool)
    
    switch (tool) {
      case 'brush':
        setDrawingMode(true)
        setEraserMode(false)
        setBrushSize(12) // 笔刷较粗
        break
      case 'bucket':
        setDrawingMode(false)
        setEraserMode(false)
        // 颜料桶功能可以在这里实现
        break
      case 'shape':
        setDrawingMode(true)
        setEraserMode(false)
        // 图形功能可以在这里实现
        break
      case 'eraser':
        setDrawingMode(false)
        setEraserMode(true)
        break
      case 'arrow':
        setDrawingMode(false)
        setEraserMode(false)
        break
    }
  }



  const handleRubberClick = () => {
    handleToolClick('eraser')
  }

  const handleExitClick = () => {
    handleToolClick('arrow')
  }

  // Undo功能：撤销上一步
  const handleUndo = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      restoreCanvasState(newStep)
    }
  }

  // Redo功能：清空所有绘画内容
  const handleRedo = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 清空canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 重置历史记录
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setDrawingHistory([imageData])
    setCurrentStep(0)
  }

  // 添加状态来跟踪Complete按钮的点击状态
  const [frontCompleted, setFrontCompleted] = useState(false)
  const [userDescription, setUserDescription] = useState<string>('')

  // 修改handleComplete函数
  const handleComplete = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      // 创建离屏canvas来合成图像
      const offCanvas = document.createElement('canvas')
      offCanvas.width = canvas.width
      offCanvas.height = canvas.height
      const ctx = offCanvas.getContext('2d')
      if (!ctx) return
      
      // 先画人体模型底图（根据当前显示的人像）
      const baseImg = new window.Image()
      baseImg.crossOrigin = 'anonymous'
      baseImg.src = isFront ? '/soft_structures_js/human_model.png' : '/soft_structures_js/human_Back.png'
      await new Promise(resolve => { baseImg.onload = resolve })
      ctx.drawImage(baseImg, 0, 0, offCanvas.width, offCanvas.height)
      // 再画用户绘画内容
      ctx.drawImage(canvas, 0, 0)
      
      const dataURL = offCanvas.toDataURL('image/png')
      
      // 根据当前显示的人像保存到对应的状态
      if (isFront) {
        setFrontImageData(dataURL)
        setShowFrontImage(true)
      } else {
        setBackImageData(dataURL)
        setShowBackImage(true)
      }
      
      setFrontCompleted(true)
      setCompleteCount(prev => prev + 1) // 增加complete次数
      
      // 第一次complete：保存图像和进行颜色分析
      if (completeCount === 0) {
        setFirstCompleteImage(dataURL)
        const analysis = generateAnalysis(usedColors)
        setColorAnalysis(analysis)
        
        // 显示加载动画
        setShowAnalysisLoading(true)
        setTimeout(() => {
          setShowAnalysisLoading(false)
          setMessages(msgs => [...msgs, { from: 'system', text: analysis }])
          setSlideUpAnalysis(true)
          setTimeout(() => setSlideUpAnalysis(false), 700)
        }, 2000)
        
        // 在颜色分析后添加身体感受询问
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'Can you describe the sensations in your body parts?' }])
          setSlideUpBodySensation(true)
          setTimeout(() => setSlideUpBodySensation(false), 700)
          setWaitingForBodySensation(true) // 设置等待身体感受描述状态
        }, 4000)
      } else {
        // 第二次complete：保存图像并生成report
        setSecondCompleteImage(dataURL)
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'I see it. Nice painting!Thank you for your participation. I believe you will understand yourself more and more, and be able to control your emotions and psychology.' }])
          setSlideUpComplete(true)
          setTimeout(() => setSlideUpComplete(false), 700)
        }, 1000)
        
        // 生成report - 使用两次Final Image的图片
        if (setRecords) {
          const analysisParts = [colorAnalysis, stomachAnalysis, backAnalysis, waistAnalysis].filter(p => p && p.trim().length > 0)
          const combinedAnalysis = analysisParts.join('\n\n')
          setRecords(prev => ([...prev, {
            img: `${firstCompleteImage}\n${dataURL}`, // 两次Final Image的图片
            desc: allUserMessages.join('\n\n'), // 所有用户消息，每句之间空行
            analysis: combinedAnalysis, // 颜色、胃部和背部分析
            userDescription: allUserMessages.join('\n\n') // 所有用户消息，每句之间空行
          }]))
        }
      }
      
      // 渐显动画
      setTimeout(() => {
        if (isFront) {
          setShowFrontImage(true)
        } else {
          setShowBackImage(true)
        }
      }, 100)
    }
  }



  // 修改handleSend函数，记录用户描述
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim()) return
    
    const userInput = input.trim()
    setMessages(msgs => [...msgs, { from: 'user', text: userInput }])
    setAllUserMessages(prev => [...prev, userInput]) // 保存用户消息
    setUserInputHistory(prev => {
      const newHistory = [...prev, userInput]
      // 只保留最近20条记录
      const limitedHistory = newHistory.slice(-20)
      // 保存到localStorage
      localStorage.setItem('userInputHistory', JSON.stringify(limitedHistory))
      return limitedHistory
    }) // 保存用户输入历史
    setSlideUpUser(true)
    setTimeout(() => setSlideUpUser(false), 700)
    
    setInput('')
    
    // 检测tight关键词（在等待身体感受描述时）
    if (waitingForBodySensation && userInput.toLowerCase().includes('tight')) {
      // 发送MQTT命令
      sendMqttData(10, 'B')
      setWaitingForBodySensation(false)
      
      // 显示系统回复
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'I understand you feel tight. Let me help you relax.' }])
        setSlideUpSys(true)
        setTimeout(() => setSlideUpSys(false), 700)
      }, 800)
      return
    }
    
    // 检测stomach关键词
    if (userInput.toLowerCase().includes('stomach')) {
      // 触发stomach关键词时发送Frequency:10, Airbag Combination:B
      sendMqttData(10, 'B')
      
      // 保存胃部分析
      setStomachAnalysis('I\'m sorry your stomach feels tight. it\'s often a little signal, maybe from stress, a quick bite, or even the way you\'ve been sitting. Try slow breaths, a sip of warm water. It usually eases up with a little care. Be gentle with yourself, and I will loosening your clothes.')
      
      // 显示加载动画
      setShowAnalysisLoading(true)
      setTimeout(() => {
        setShowAnalysisLoading(false)
        setMessages(msgs => [...msgs, { from: 'system', text: 'I\'m sorry your stomach feels tight. it\'s often a little signal, maybe from stress, a quick bite, or even the way you\'ve been sitting. Try slow breaths, a sip of warm water. It usually eases up with a little care. Be gentle with yourself, and I will loosening your clothes.' }])
        setSlideUpStomach3(true)
        setTimeout(() => setSlideUpStomach3(false), 700)
        setWaitingForStomachResponse(true)
      }, 2000)
      
      // 第二条消息：放松身体（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Now relax your body, pay attention to your breathing, and feel its rhythm.' }])
        setSlideUpStomach1(true)
        setTimeout(() => setSlideUpStomach1(false), 700)
      }, 3800)
      
      // 第三条消息：关注胃部（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Then slowly shift your attention to your stomach.' }])
        setSlideUpStomach2(true)
        setTimeout(() => setSlideUpStomach2(false), 700)
      }, 6800)
      
      // 第四条消息：询问感受（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'How do you feel? Do you feel any better?' }])
        setSlideUpStomach4(true)
        setTimeout(() => setSlideUpStomach4(false), 700)
      }, 9800)
      
      return
    }
    
    // 检测lower back（支持多种同义/写法）
    const isLowerBackMentioned = (text: string) => {
      const t = text.toLowerCase()
      const patterns = [
        'lower back',
        'low back',
        'lower-back',
        '腰',
        '下背',
        '背部',
        '腰部'
      ]
      return patterns.some(p => t.includes(p))
    }
    if (isLowerBackMentioned(userInput)) {
      // 固定发送 Frequency:5, Airbag Combination:A
      sendMqttData(5, 'A')
      // 保存背部分析
      setBackAnalysis('I\'m sorry your lower back is sore. It must feel uncomfortable. Often this comes from muscle strain, maybe from long hours sitting, lifting, or sudden moves. Sometimes it\'s just tight muscles needing a little care. Many cases get better with gentle rest, avoiding heavy tasks, and light movement. We\'ll take good care of this together, and with some simple steps, you\'ll likely feel more comfortable soon. Take it easy, and we\'ll help ease that soreness.')
      
      // 显示加载动画
      setShowAnalysisLoading(true)
      setTimeout(() => {
        setShowAnalysisLoading(false)
        setMessages(msgs => [...msgs, { from: 'system', text: 'I\'m sorry your lower back is sore. It must feel uncomfortable. Often this comes from muscle strain, maybe from long hours sitting, lifting, or sudden moves. Sometimes it\'s just tight muscles needing a little care. Many cases get better with gentle rest, avoiding heavy tasks, and light movement. We\'ll take good care of this together, and with some simple steps, you\'ll likely feel more comfortable soon. Take it easy, and we\'ll help ease that soreness.' }])
        setSlideUpBack3(true)
        setTimeout(() => setSlideUpBack3(false), 700)
        setWaitingForBackResponse(true)
      }, 2000)
      
      // 第二条消息：放松身体（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Now relax your body, pay attention to your breathing, and feel its rhythm.' }])
        setSlideUpBack1(true)
        setTimeout(() => setSlideUpBack1(false), 700)
      }, 3800)
      
      // 第三条消息：关注背部（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Then slowly shift your attention to your lower back.' }])
        setSlideUpBack2(true)
        setTimeout(() => setSlideUpBack2(false), 700)
      }, 6800)
      
      // 第四条消息：询问感受（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'How do you feel? Do you feel any better?' }])
        setSlideUpBack4(true)
        setTimeout(() => setSlideUpBack4(false), 700)
      }, 9800)
      
      return
    }
    
    // 处理stomach回复
    if (waitingForStomachResponse) {
      setWaitingForStomachResponse(false)
      // 不管用户回复什么，都弹出绘画邀请（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Can you draw your feelings again?' }])
        setSlideUpDrawAgain(true)
        setTimeout(() => setSlideUpDrawAgain(false), 700)
      }, 3000)
      return
    }
    
    // 处理back回复
    if (waitingForBackResponse) {
      setWaitingForBackResponse(false)
      // 不管用户回复什么，都弹出绘画邀请（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Can you draw your feelings again?' }])
        setSlideUpDrawAgain(true)
        setTimeout(() => setSlideUpDrawAgain(false), 700)
      }, 3000)
      return
    }
    
    // 检测waist关键词
    if (userInput.toLowerCase().includes('waist')) {
      // 触发waist关键词时发送Frequency:10, Airbag Combination:C
      sendMqttData(10, 'C')

      const waistText = "Based on what you’ve told me, it’s most likely that you strained your lower back muscles or ligaments while lifting those heavy boxes. Plus, you probably already had some mild strain from sitting for long periods before that, which is why the symptoms have gotten worse gradually. There’s no need to be too concerned—this is really common after physical activity like moving, and it will improve quickly with the right care."
      // 保存腰部分析
      setWaistAnalysis(waistText)
      
      // 显示加载动画
      setShowAnalysisLoading(true)
      setTimeout(() => {
        setShowAnalysisLoading(false)
        setMessages(msgs => [...msgs, { from: 'system', text: waistText }])
        setSlideUpSys(true)
        setTimeout(() => setSlideUpSys(false), 700)
        setWaitingForWaistResponse(true)
      }, 2000)
      
      // 第二条消息：放松身体（3.8秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Now relax your body, pay attention to your breathing, and feel its rhythm.' }])
        setSlideUpStomach1(true)
        setTimeout(() => setSlideUpStomach1(false), 700)
      }, 3800)
      
      // 第三条消息：关注腰部（6.8秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Then slowly shift your attention to your waist.' }])
        setSlideUpStomach2(true)
        setTimeout(() => setSlideUpStomach2(false), 700)
      }, 6800)
      
      // 第四条消息：询问感受（9.8秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'How do you feel? Do you feel any better?' }])
        setSlideUpStomach4(true)
        setTimeout(() => setSlideUpStomach4(false), 700)
      }, 9800)
      
      return
    }
    
    // 处理waist回复
    if (waitingForWaistResponse) {
      setWaitingForWaistResponse(false)
      // 不管用户回复什么，都弹出绘画邀请（3秒后）
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Can you draw your feelings again?' }])
        setSlideUpDrawAgain(true)
        setTimeout(() => setSlideUpDrawAgain(false), 700)
      }, 3000)
      return
    }
    
    // 处理舒适度回答
    if (waitingForComfort) {
      setWaitingForComfort(false)
      // 用户回复舒适度问题后，发送 Frequency:10, Airbag Combination:A+B
      sendMqttData(10, 'A+B')
      if (userInput.toLowerCase() === 'yes') {
        // 用户回答yes，显示三条指导消息
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'Great! Let\'s get start.' }])
          setSlideUp3(true)
          setTimeout(() => setSlideUp3(false), 700)
        }, 800)
        
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'Now please click the Pen button, select a color according to your feelings and adjust the brush thickness.' }])
          setSlideUp4(true)
          setTimeout(() => setSlideUp4(false), 700)
        }, 2000)
        
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'After completing your creation, click the Exit button to exit the brush mode and then click Complete.' }])
          setSlideUp5(true)
          setTimeout(() => setSlideUp5(false), 700)
        }, 3200)
      } else {
        // 用户回答其他，显示安慰消息和指导
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'Take it easy, it\'s no big deal. The upcoming activities will help you gradually explore your inner self and feel a sense of security.' }])
          setSlideUp3(true)
          setTimeout(() => setSlideUp3(false), 700)
        }, 800)
        
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'Now please click the Pen button, select a color according to your feelings and adjust the brush thickness.' }])
          setSlideUp4(true)
          setTimeout(() => setSlideUp4(false), 700)
        }, 3000)
        
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'After completing your creation, click the Exit button to exit the brush mode and then click Complete.' }])
          setSlideUp5(true)
          setTimeout(() => setSlideUp5(false), 700)
        }, 4200)
      }
      return
    }
    
    // 如果完成了且还没有记录用户描述，记录用户描述
    if (frontCompleted && !userDescription) {
      setUserDescription(userInput)
    }
    
    // 检查是否为yes，保存记录
    if (setRecords && userInput.toLowerCase() === 'yes') {
      setRecords(prev => ([...prev, {
        img: completedDrawing || '',
        desc: descDraft || '',
        analysis: generateAnalysis(usedColors),
        userDescription: userDescription
      }]))
      
      // 弹出确认消息
      setTimeout(() => {
        setMessages(msgs => [...msgs, { from: 'system', text: 'Okay, your practice results for this time have been recorded.' }])
        setSlideUpRecord(true)
        setTimeout(() => setSlideUpRecord(false), 700)
        setTimeout(() => {
          setMessages(msgs => [...msgs, { from: 'system', text: 'Thank you for your participation. See you next time!' }])
          setSlideUpThanks(true)
          setTimeout(() => setSlideUpThanks(false), 700)
        }, 1200)
      }, 400)
      
      setDescDraft(null)
      setUsedColors([])
      setFrontCompleted(false)
      setUserDescription('')
      return
    }
    
    // 其余逻辑保持不变...
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'system', text: generateAnalysis(usedColors) }])
      setSlideUpAnalysis(true)
      setTimeout(() => setSlideUpAnalysis(false), 700)
    }, 800)
  }

  // 生成分析内容
  function generateAnalysis(colors: string[]): string {
    if (!colors.length) return 'No color detected.'
    const colorMap: Record<string, { label: string, text: string }> = {
      '#ffb6b6': {
        label: 'Pink',
        text: 'Pink may indicate your need for a sense of security or reflect a tender, sensitive state. Its soft qualities could suggest a longing for care and understanding. Your current mindset leans toward tranquility, with strong emotional connection needs.'
      },
      '#b6d6ff': {
        label: 'Blue',
        text: "Blue suggests you're seeking stability, or possibly using rationality to suppress certain intense emotions, demonstrating a tendency for 'self-regulation'. It indicates a need for 'stress release' and a longing for psychological space."
      },
      '#ffff44': {
        label: 'Yellow',
        text: "Yellow signifies your current positive psychological momentum: you may be in an emotional 'recovery phase', holding expectations for therapy/life, with inner vitality that might not yet be fully expressed."
      },
      '#b6ffb6': {
        label: 'Green',
        text: "Green suggests your desire to reconnect with either your 'authentic self' or a 'peaceful life rhythm'. Your psyche remains in a transitional state—serene yet tinged with uncertainty—requiring time to consolidate healing energy."
      }
    }
    const used = colors.filter(c => colorMap[c])
    if (!used.length) return 'No color detected.'
    const colorLabels = used.map(c => colorMap[c].label).join(', ')
    const analysisTexts = used.map(c => colorMap[c].text).join(' ')
    return `Great! I see you've used ${colorLabels}. ${analysisTexts}`
  }


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, showLoading])







  // 在PatientStart组件中添加新的状态变量
  const [showMode4Panel, setShowMode4Panel] = useState(false)
  const [isMode4PanelHovered, setIsMode4PanelHovered] = useState(false)
  const [frequency, setFrequency] = useState(10)
  const [airbagCombo, setAirbagCombo] = useState('A+B')

  // 添加MQTT发送函数
  const sendMqttData = (freq: number, combo: string) => {
    if (mqttClientRef.current) {
      const message = JSON.stringify({
        Frequency: freq,
        'Airbag Combination': combo
      })
      // 直接向patient主题发送，不包含子主题
      mqttClientRef.current.publish('patient', message)
    }
  }

  // 添加Final Image相关状态
  const [showFrontImage, setShowFrontImage] = useState(false)
  const [showBackImage, setShowBackImage] = useState(false)

  // 添加Undo功能
  const handleFrontUndo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      restoreCanvasState(currentStep - 1)
    }
  }

  // 修改Redo功能
  const handleFrontRedo = () => {
    if (currentStep < drawingHistory.length - 1) {
      setCurrentStep(currentStep + 1)
      restoreCanvasState(currentStep + 1)
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 120px)',
      marginTop: 60,
      background: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* 右上角返回首页按钮 */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: 4,
          right: 0,
          zIndex: 200,
          background: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0002',
        }}
      >
        Back to homepage
      </button>
      {/* 最左侧：Mode按钮和工具栏 */}
      <div style={{
        width: 200,
        minWidth: 200,
        height: 560,
        background: 'none', // 整体背景透明
        borderRadius: 18,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 48,
        padding: '0',
        justifyContent: 'flex-start',
        gap: 20, // 增加Mode和工具栏之间的间隔
        marginTop: -90, // 整体上移更多
      }}>
        {/* 正面/背面切换按钮 */}
        <div style={{ marginBottom: 16, width: '100%', textAlign: 'center' }}>
          <Button
            type={isFront ? 'primary' : 'default'}
            style={{ marginRight: 8, borderRadius: 8, fontWeight: 600 }}
            onClick={() => setIsFront(true)}
          >
            Front
          </Button>
          <Button
            type={!isFront ? 'primary' : 'default'}
            style={{ borderRadius: 8, fontWeight: 600 }}
            onClick={() => setIsFront(false)}
          >
            Back
          </Button>
        </div>
        {/* Mode按钮独立白色背景板 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          width: 200,
          maxWidth: 200,
          alignItems: 'center',
          padding: '16px 12px',
          background: '#fff',
          borderRadius: 18,
          border: '1px solid #e8e8e8',
          boxShadow: '0 4px 32px #0002',
          marginBottom: 20, // 增加与工具栏的间隔
        }}>
          <Button 
            type="default"
            style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, width: '100%', minWidth: 0, padding: '8px 12px', height: 'auto', minHeight: '40px' }} 
            onClick={() => {
              setMode('mode1')
              sendMqttData(5, 'A+B')
            }}
          >
            Embracing
          </Button>
          <Button 
            type={mode === 'mode2' ? 'primary' : 'default'} 
            style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, width: '100%', minWidth: 0, padding: '8px 12px', height: 'auto', minHeight: '40px' }} 
            onClick={() => setMode('mode2')}
          >
            Touching
          </Button>
          <Button 
            type={mode === 'mode3' ? 'primary' : 'default'} 
            style={{ fontWeight: 600, fontSize: 15, borderRadius: 8, width: '100%', minWidth: 0, padding: '8px 12px', height: 'auto', minHeight: '40px' }} 
            onClick={() => {
              setMode('mode3')
              // 点击Scanning按钮发送Frequency:10, Airbag Combination:A+B
              sendMqttData(10, 'A+B')
            }}
          >
            Scanning
          </Button>
          <div style={{ position: 'relative' }}>
            <Button 
              type="primary"
              style={{ 
                fontWeight: 600, 
                fontSize: 15, 
                borderRadius: 8, 
                width: '100%', 
                minWidth: 0, 
                padding: '8px 12px',
                height: 'auto',
                minHeight: '40px',
                background: '#1890ff',
                borderColor: '#1890ff'
              }} 
              onClick={() => setMode('mode4')}
              onMouseEnter={() => setShowMode4Panel(true)}
              onMouseLeave={() => {
                setTimeout(() => {
                  if (!isMode4PanelHovered) {
                    setShowMode4Panel(false)
                  }
                }, 100)
              }}
            >
              Customizing
            </Button>
            {/* Mode 4悬停面板 */}
            <div 
              className="tool-hover-panel"
              style={{
                position: 'absolute',
                left: 170,
                top: 0,
                background: '#fff',
                borderRadius: 8,
                padding: 12,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                zIndex: 1000,
                minWidth: 200,
                opacity: showMode4Panel ? 1 : 0,
                transform: showMode4Panel ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'all 0.2s ease-in-out',
                pointerEvents: showMode4Panel ? 'auto' : 'none'
              }}
              onMouseEnter={() => {
                setShowMode4Panel(true)
                setIsMode4PanelHovered(true)
              }}
              onMouseLeave={() => {
                setIsMode4PanelHovered(false)
                setShowMode4Panel(false)
              }}
            >
              {/* Frequency选项 */}
              <div style={{ 
                fontWeight: 600, 
                fontSize: 14, 
                color: '#333', 
                marginBottom: 8,
                borderBottom: '1px solid #eee',
                paddingBottom: 8
              }}>
                Frequency
              </div>
              <div style={{ 
                fontSize: 12, 
                color: '#666', 
                marginBottom: 8,
                lineHeight: 1.4
              }}>
                Adjust frequency parameter
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={frequency}
                onChange={e => setFrequency(Number(e.target.value))}
                style={{ 
                  width: '100%',
                  height: 6,
                  borderRadius: 3,
                  background: '#e0e0e0',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>
                {frequency}
        </div>
        
              {/* Airbag Combination选项 */}
              <div style={{ 
                fontWeight: 600, 
                fontSize: 14, 
                color: '#333', 
                marginTop: 12,
                marginBottom: 8,
                borderBottom: '1px solid #eee',
                paddingBottom: 8
              }}>
                Airbag Combination
              </div>
              <div style={{ 
                fontSize: 12, 
                color: '#666', 
                marginBottom: 8,
                lineHeight: 1.4
              }}>
                Select airbag combination
              </div>
              <select
                value={airbagCombo}
                onChange={e => setAirbagCombo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                  fontSize: 12,
                  outline: 'none'
                }}
              >
                <option value="A+B">A+B</option>
                <option value="A+C">A+C</option>
                <option value="B+C">B+C</option>
                <option value="A+B+C">A+B+C</option>
              </select>
            </div>
          </div>
        </div>

        {/* 工具栏独立白色背景板 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 12, 
          width: 200,
          maxWidth: 200,
          alignItems: 'center',
          position: 'relative',
          padding: '16px 12px',
          background: '#fff',
          borderRadius: 18,
          border: '1px solid #e8e8e8',
          boxShadow: '0 4px 32px #0002',
        }}>
          {/* 第一排：前3个工具 */}
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            justifyContent: 'center', 
            width: '100%' 
          }}>
          {/* 笔刷工具 */}
          <Tooltip title="Brush" placement="left">
            <div style={{ position: 'relative' }}>
              <Button
                type={currentTool === 'brush' ? 'primary' : 'default'}
                icon={<HighlightOutlined className="brush-icon" />}
                className="tool-button"
                onMouseEnter={() => setShowBrushThickness(true)}
                onMouseLeave={() => {
                    // 延迟检查，给用户时间移动到选择器
                  setTimeout(() => {
                      if (!isBrushPanelHovered) {
                      setShowBrushThickness(false)
                    }
                    }, 100)
                }}
                onClick={() => handleToolClick('brush')}
              />
                {/* 笔刷工具悬停提示 */}
                <div 
                  className="tool-hover-panel"
                  style={{
                    position: 'absolute',
                    left: 60,
                    top: 0,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    zIndex: 1000,
                    minWidth: 200,
                    opacity: showBrushThickness ? 1 : 0,
                    transform: showBrushThickness ? 'translateX(0)' : 'translateX(-10px)',
                    transition: 'all 0.2s ease-in-out',
                    pointerEvents: showBrushThickness ? 'auto' : 'none'
                  }}
                  onMouseEnter={() => {
                    setShowBrushThickness(true)
                    setIsBrushPanelHovered(true)
                  }}
                  onMouseLeave={() => {
                    setIsBrushPanelHovered(false)
                    setShowBrushThickness(false)
                  }}
                >
                  {/* 左侧文字解释 */}
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 14, 
                    color: '#333', 
                    marginBottom: 8,
                    borderBottom: '1px solid #eee',
                    paddingBottom: 8
                  }}>
                    Brush Tool
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#666', 
                    marginBottom: 12,
                    lineHeight: 1.4
                  }}>
                    Draw freehand lines and shapes with customizable thickness and color
                  </div>
                  {/* 右侧选项 */}
                  <div style={{ fontWeight: 500, fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 8 }}>
                    Brush Thickness
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={32}
                    value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    style={{ 
                      width: '100%',
                      height: 6,
                      borderRadius: 3,
                      background: '#e0e0e0',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>
                    {brushSize}px
                  </div>
                </div>
            </div>
          </Tooltip>

          {/* 颜料桶工具 */}
          <Tooltip title="Color Bucket" placement="left">
            <div style={{ position: 'relative' }}>
              <Button
                type={currentTool === 'bucket' ? 'primary' : 'default'}
                icon={<BgColorsOutlined style={{ color: brushColor }} />}
                className="tool-button"
                onMouseEnter={() => setShowColorPicker(true)}
                onMouseLeave={() => {
                    // 延迟检查，给用户时间移动到选择器
                  setTimeout(() => {
                    if (!isColorPickerHovered) {
                      setShowColorPicker(false)
                    }
                    }, 100)
                }}
                onClick={() => handleToolClick('bucket')}
              />
                {/* 颜料桶工具悬停提示 */}
                <div 
                  className="tool-hover-panel"
                  style={{
                    position: 'absolute',
                    left: 60,
                    top: 0,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    zIndex: 1000,
                    minWidth: 200,
                    opacity: showColorPicker ? 1 : 0,
                    transform: showColorPicker ? 'translateX(0)' : 'translateX(-10px)',
                    transition: 'all 0.2s ease-in-out',
                    pointerEvents: showColorPicker ? 'auto' : 'none'
                  }}
                  onMouseEnter={() => {
                    setShowColorPicker(true)
                    setIsColorPickerHovered(true)
                  }}
                  onMouseLeave={() => {
                    setIsColorPickerHovered(false)
                    setShowColorPicker(false)
                  }}
                >
                  {/* 左侧文字解释 */}
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 14, 
                    color: '#333', 
                    marginBottom: 8,
                    borderBottom: '1px solid #eee',
                    paddingBottom: 8
                  }}>
                    Color Picker
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#666', 
                    marginBottom: 12,
                    lineHeight: 1.4
                  }}>
                    Select colors for your brush and shapes from a variety of options
                  </div>
                  {/* 右侧选项 */}
                  <div style={{ fontWeight: 500, fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 8 }}>
                    Color Options
                  </div>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 4
                  }}>
                  {colorOptions.map((colorOpt) => (
                    <Button
                      key={colorOpt.name}
                      className="color-option"
                      style={{
                        width: 32,
                        height: 32,
                        background: colorOpt.color,
                        border: brushColor === colorOpt.color ? '2px solid #333' : '1px solid #ddd',
                        borderRadius: '50%',
                        padding: 0
                      }}
                      onClick={() => {
                        setBrushColor(colorOpt.color)
                        setUsedColors(prev => prev.includes(colorOpt.color) ? prev : [...prev, colorOpt.color])
                          setShowColorPicker(false)
                      }}
                    >
                      {brushColor === colorOpt.color ? '✓' : ''}
                    </Button>
                  ))}
                </div>
                </div>
            </div>
          </Tooltip>

          {/* 图形工具 */}
          <Tooltip title="Shapes" placement="left">
            <div style={{ position: 'relative' }}>
              <Button
                type={currentTool === 'shape' ? 'primary' : 'default'}
                icon={getSelectedShapeIcon()}
                className="tool-button"
                onMouseEnter={() => setShowShapePicker(true)}
                onMouseLeave={() => {
                    // 延迟检查，给用户时间移动到选择器
                  setTimeout(() => {
                    if (!isShapePickerHovered) {
                      setShowShapePicker(false)
                    }
                    }, 100)
                }}
                onClick={() => handleToolClick('shape')}
              />
                {/* 图形工具悬停提示 */}
                <div 
                  className="tool-hover-panel"
                  style={{
                    position: 'absolute',
                    left: 60,
                    top: 0,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    zIndex: 1000,
                    minWidth: 200,
                    opacity: showShapePicker ? 1 : 0,
                    transform: showShapePicker ? 'translateX(0)' : 'translateX(-10px)',
                    transition: 'all 0.2s ease-in-out',
                    pointerEvents: showShapePicker ? 'auto' : 'none'
                  }}
                  onMouseEnter={() => {
                    setShowShapePicker(true)
                    setIsShapePickerHovered(true)
                  }}
                  onMouseLeave={() => {
                    setIsShapePickerHovered(false)
                    setShowShapePicker(false)
                  }}
                >
                  {/* 左侧文字解释 */}
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 14, 
                    color: '#333', 
                    marginBottom: 8,
                    borderBottom: '1px solid #eee',
                    paddingBottom: 8
                  }}>
                    Shape Tools
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#666', 
                    marginBottom: 12,
                    lineHeight: 1.4
                  }}>
                    Add geometric shapes to your drawing with different styles
                  </div>
                  {/* 右侧选项 */}
                  <div style={{ fontWeight: 500, fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 8 }}>
                    Shape Options
                  </div>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 4
                  }}>
                  {shapeOptions.map((shapeOpt) => (
                    <Button
                      key={shapeOpt.name}
                      type={selectedShape === shapeOpt.shape ? 'primary' : 'default'}
                      className="shape-option"
                      style={{
                        height: 32,
                        width: 32,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                      }}
                      onClick={() => {
                        setSelectedShape(shapeOpt.shape as any)
                          setShowShapePicker(false)
                      }}
                    >
                      {shapeOpt.icon}
                    </Button>
                  ))}
                </div>
                </div>
            </div>
          </Tooltip>
          </div>

          {/* 第二排：后2个工具 */}
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            justifyContent: 'center', 
            width: '100%' 
          }}>
          {/* 橡皮擦工具 */}
          <Tooltip title="Eraser" placement="left">
              <div style={{ position: 'relative' }}>
            <Button
              type={currentTool === 'eraser' ? 'primary' : 'default'}
                  icon={<EraserIcon />}
              className="tool-button"
                  onMouseEnter={() => setShowEraserPanel(true)}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      if (!isEraserPanelHovered) {
                        setShowEraserPanel(false)
                      }
                    }, 150)
                  }}
              onClick={() => handleToolClick('eraser')}
            />
                {/* 橡皮擦工具悬停提示 */}
                <div 
                  className="tool-hover-panel"
                  style={{
                    position: 'absolute',
                    left: 60,
                    top: 0,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    zIndex: 1000,
                    minWidth: 200,
                    opacity: showEraserPanel ? 1 : 0,
                    transform: showEraserPanel ? 'translateX(0)' : 'translateX(-10px)',
                    transition: 'all 0.2s ease-in-out',
                    pointerEvents: showEraserPanel ? 'auto' : 'none'
                  }}
                  onMouseEnter={() => {
                    setShowEraserPanel(true)
                    setIsEraserPanelHovered(true)
                  }}
                  onMouseLeave={() => {
                    setIsEraserPanelHovered(false)
                    setShowEraserPanel(false)
                  }}
                >
                  {/* 左侧文字解释 */}
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 14, 
                    color: '#333', 
                    marginBottom: 8,
                    borderBottom: '1px solid #eee',
                    paddingBottom: 8
                  }}>
                    Eraser Tool
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#666', 
                    marginBottom: 12,
                    lineHeight: 1.4
                  }}>
                    Remove parts of your drawing by erasing with adjustable size
                  </div>
                  {/* 右侧选项 */}
                  <div style={{ fontWeight: 500, fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 8 }}>
                    Eraser Size
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={40}
                    value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    style={{ 
                      width: '100%',
                      height: 6,
                      borderRadius: 3,
                      background: '#e0e0e0',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>
                    {brushSize}px
                  </div>
                </div>
              </div>
          </Tooltip>

            {/* 鼠标按钮 */}
            <Tooltip title="Mouse" placement="left">
              <div style={{ position: 'relative' }}>
            <Button
              type={currentTool === 'arrow' ? 'primary' : 'default'}
                  icon={<MouseIcon />}
              className="tool-button"
                  onMouseEnter={() => setShowArrowPanel(true)}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      if (!isArrowPanelHovered) {
                        setShowArrowPanel(false)
                      }
                    }, 150)
                  }}
              onClick={() => handleToolClick('arrow')}
            />
                {/* 鼠标工具悬停提示 */}
                <div 
                  className="tool-hover-panel"
                  style={{
                    position: 'absolute',
                    left: 60,
                    top: 0,
          background: '#fff',
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
                    gap: 8,
                    zIndex: 1000,
                    minWidth: 200,
                    opacity: showArrowPanel ? 1 : 0,
                    transform: showArrowPanel ? 'translateX(0)' : 'translateX(-10px)',
                    transition: 'all 0.2s ease-in-out',
                    pointerEvents: showArrowPanel ? 'auto' : 'none'
                  }}
                  onMouseEnter={() => {
                    setShowArrowPanel(true)
                    setIsArrowPanelHovered(true)
                  }}
                  onMouseLeave={() => {
                    setIsArrowPanelHovered(false)
                    setShowArrowPanel(false)
                  }}
                >
                  {/* 左侧文字解释 */}
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 14, 
                    color: '#333', 
                    marginBottom: 8,
                    borderBottom: '1px solid #eee',
                    paddingBottom: 8
                  }}>
                    Mouse
          </div>
          <div style={{
                    fontSize: 12, 
                    color: '#666', 
                    marginBottom: 12,
                    lineHeight: 1.4
                  }}>
                    Navigate and select elements without drawing or modifying
          </div>
                  {/* 右侧选项 */}
                  <div style={{ 
                    fontSize: 12, 
                    color: '#666', 
                    textAlign: 'center',
                    padding: '8px',
                    background: '#f8f9fa',
                    borderRadius: 6,
                    border: '1px solid #e8e8e8'
                  }}>
                    Default cursor mode for navigation
                  </div>
                </div>
              </div>
          </Tooltip>
        </div>
      </div>

        {/* Final Image区域 */}
      <div style={{
          marginTop: 20,
          width: 200,
          maxWidth: 200,
        background: '#fff',
        borderRadius: 18,
          border: '1px solid #e8e8e8',
        boxShadow: '0 4px 32px #0002',
          padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
          gap: 12
      }}>
          <div style={{ 
            fontWeight: 600, 
            fontSize: 16, 
            color: '#333', 
            textAlign: 'center',
            marginBottom: 8
          }}>
            Final Image
        </div>
          
          {/* Front图片显示 */}
          <div style={{
              display: 'flex', 
              justifyContent: 'center' 
            }}>
            <div style={{ 
              width: '100%',
              border: '1px solid #e8e8e8',
              borderRadius: 8,
              padding: 8,
              background: '#fafafa'
            }}>
              <div style={{ 
                fontWeight: 500, 
                fontSize: 14, 
                color: '#666', 
                marginBottom: 6,
                textAlign: 'center'
              }}>
                {isFront ? 'Front Image' : 'Back Image'}
              </div>
              <div style={{ 
                height: 200,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                borderRadius: 6,
                border: '1px solid #e8e8e8',
                overflow: 'hidden'
              }}>
                {(isFront ? showFrontImage && frontImageData : showBackImage && backImageData) ? (
                  <img 
                    src={isFront ? frontImageData : backImageData} 
                    alt={isFront ? "Front Drawing" : "Back Drawing"}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      opacity: (isFront ? showFrontImage : showBackImage) ? 1 : 0,
                      transition: 'opacity 0.5s ease-in-out'
                    }} 
                  />
                ) : (
                  <div style={{ 
                    color: '#ccc', 
                    fontSize: 12,
                    textAlign: 'center'
                  }}>
                    No drawing yet
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
      </div>
    
      {/* 中间人体模型及按钮 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 60, marginRight: 60 }}>
        {/* 在人体模型img外层加ref和canvas尺寸同步 */}
        <div style={{ position: 'relative', display: 'inline-block' }} ref={containerRef}>
          <img
            src={isFront ? '/soft_structures_js/human_model.png' : '/soft_structures_js/human_Back.png'}
            alt={isFront ? "Human Model Front" : "Human Model Back"}
            style={{
              maxHeight: 640,
              maxWidth: 500,
              borderRadius: 18,
              boxShadow: '0 4px 32px #0002',
              background: '#fff',
              objectFit: 'contain',
              margin: '0 auto',
              display: 'block',
              width: '100%',
              height: '100%'
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: currentTool === 'brush' ? 'crosshair' : 
                      currentTool === 'eraser' ? 'grab' : 
                      currentTool === 'bucket' ? 'pointer' :
                      currentTool === 'shape' ? 'crosshair' :
                      'default',
              borderRadius: 18,
              zIndex: 10
            }}
            width={canvasSize.width}
            height={canvasSize.height}
            onMouseDown={['brush', 'eraser', 'shape'].includes(currentTool) ? startDrawing : undefined}
            onMouseMove={['brush', 'eraser'].includes(currentTool) ? draw : undefined}
            onMouseUp={['brush', 'eraser'].includes(currentTool) ? stopDrawing : undefined}
            onMouseLeave={['brush', 'eraser'].includes(currentTool) ? stopDrawing : undefined}
          />
        </div>
        {/* 按钮区 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, gap: 12 }}>
          <Button 
            onClick={handleFrontUndo} 
            icon={<ArrowLeftOutlined />}
            style={{ 
              fontWeight: 600, 
              fontSize: 16, 
              borderRadius: 10, 
              minWidth: 60,
              height: 40
            }}
          />
          <Button 
            onClick={handleFrontRedo} 
            icon={<ArrowRightOutlined />}
            style={{ 
              fontWeight: 600, 
              fontSize: 16, 
              borderRadius: 10, 
              minWidth: 60,
              height: 40
            }}
          />
          <Button 
            onClick={handleComplete} 
            type="primary" 
            style={{ 
              fontWeight: 600, 
              fontSize: 18, 
              borderRadius: 10, 
              minWidth: 120,
              height: 40
            }}
          >
            Complete
          </Button>
        </div>
      </div>

      {/* 右侧聊天框 */}
      <div style={{
        width: 440,
        minWidth: 380,
        height: 600,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px #0002',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 0,
        padding: 0,
        overflow: 'hidden',
      }}>
        {/* 聊天内容 */}
        <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#f7f7f7' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12
            }}>
              <div
                className={
                  msg.from === 'system' && idx === 0 && slideUp ? 'slide-up' :
                  msg.from === 'system' && idx === 1 && slideUp1_5 ? 'slide-up' :
                  msg.from === 'system' && idx === 2 && slideUp2 ? 'slide-up' :
                  msg.from === 'system' && idx === 3 && slideUp3 ? 'slide-up' :
                  msg.from === 'system' && idx === 4 && slideUp4 ? 'slide-up' :
                  msg.from === 'system' && idx === 5 && slideUp5 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Now relax your body, pay attention to your breathing, and feel its rhythm.' && slideUpStomach1 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Then slowly shift your attention to your stomach.' && slideUpStomach2 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'I\'m sorry your stomach feels tight. it\'s often a little signal, maybe from stress, a quick bite, or even the way you\'ve been sitting. Try slow breaths, a sip of warm water. It usually eases up with a little care. Be gentle with yourself, and I will loosening your clothes.' && slideUpStomach3 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'How do you feel? Do you feel any better?' && slideUpStomach4 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Now relax your body, pay attention to your breathing, and feel its rhythm.' && slideUpBack1 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Then slowly shift your attention to your lower back.' && slideUpBack2 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'I\'m sorry your lower back is sore. It must feel uncomfortable. Often this comes from muscle strain, maybe from long hours sitting, lifting, or sudden moves. Sometimes it\'s just tight muscles needing a little care. Many cases get better with gentle rest, avoiding heavy tasks, and light movement. We\'ll take good care of this together, and with some simple steps, you\'ll likely feel more comfortable soon. Take it easy, and we\'ll help ease that soreness.' && slideUpBack3 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'How do you feel? Do you feel any better?' && slideUpBack4 ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Can you draw your feelings again?' && slideUpDrawAgain ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Can you describe the sensations in your body parts?' && slideUpBodySensation ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'I see it. Nice painting!Thank you for your participation. I believe you will understand yourself more and more, and be able to control your emotions and psychology.' && slideUpComplete ? 'slide-up' :
                  msg.from === 'user' && idx === messages.length - 3 && slideUpUser ? 'slide-up' :
                  msg.from === 'system' && idx === messages.length - 2 && slideUpSys ? 'slide-up' :
                  msg.from === 'system' && idx === messages.length - 1 && slideUpAnalysis ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Okay, your practice results for this time have been recorded.' && slideUpRecord ? 'slide-up' :
                  msg.from === 'system' && msg.text === 'Thank you for your participation. See you next time!' && slideUpThanks ? 'slide-up' : ''
                }
                style={{
                  background:
                    msg.from === 'user' ? '#95ec69'
                    : ([
                        "Okay, now let's talk about your insights during the creative process! Please briefly describe your work.",
                        "Analyzing your final image, please wait......",
                        "Okay! Based on my analysis, recently... If you agree with my analysis，please reply \"yes\".",
                        "Okay, your practice results for this time have been recorded.",
                        "Thank you for your participation. See you next time!"
                      ].includes(msg.text)
                      ? '#e6f7ff' : '#fff'),
                  color: '#222',
                  borderRadius: 12,
                  padding: '8px 16px',
                  maxWidth: 320,
                  fontSize: 16,
                  boxShadow: '0 2px 8px #0001',
                  fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif',
                  fontWeight: 400
                }}
              >{msg.text}</div>
            </div>
          ))}
          {/* loading 动画 */}
          {showLoading && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <span className="chat-loading" style={{ display: 'inline-block', width: 32, height: 32 }}>
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="12" stroke="#1890ff" strokeWidth="4" fill="none" strokeDasharray="60" strokeDashoffset="20">
                    <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </span>
            </div>
          )}
          {/* 分析加载动画 */}
          {showAnalysisLoading && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
              <div style={{
                background: '#fff',
                color: '#222',
                borderRadius: 12,
                padding: '8px 16px',
                maxWidth: 320,
                fontSize: 16,
                boxShadow: '0 2px 8px #0001',
                fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span style={{ display: 'inline-block', width: 20, height: 20 }}>
                  <svg width="20" height="20" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="12" stroke="#1890ff" strokeWidth="4" fill="none" strokeDasharray="60" strokeDashoffset="20">
                      <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </span>
                Analyzing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* 用户输入历史记录 */}
        {userInputHistory.length > 0 && (
          <div style={{ 
            borderTop: '1px solid #eee', 
            background: '#f8f9fa', 
            padding: '8px 12px',
            maxHeight: 120,
            overflowY: 'auto'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}>
              <div style={{ 
                fontSize: 12, 
                color: '#666', 
                fontWeight: 600
              }}>
                Recent Messages ({userInputHistory.length}):
              </div>
              <button
                onClick={() => {
                  setUserInputHistory([])
                  localStorage.removeItem('userInputHistory')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4d4f',
                  fontSize: 10,
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: 4
                }}
                title="Clear all history"
              >
                Clear All
              </button>
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 4 
            }}>
              {(showAllHistory ? userInputHistory : userInputHistory.slice(-5)).map((msg, index) => (
                <button
                  key={index}
                  onClick={() => setInput(msg)}
                  style={{
                    background: '#e6f7ff',
                    border: '1px solid #91d5ff',
                    borderRadius: 12,
                    padding: '4px 8px',
                    fontSize: 11,
                    color: '#1890ff',
                    cursor: 'pointer',
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={msg}
                >
                  {msg.length > 15 ? msg.substring(0, 15) + '...' : msg}
                </button>
              ))}
            </div>
            {userInputHistory.length > 5 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1890ff',
                  fontSize: 10,
                  cursor: 'pointer',
                  padding: '2px 4px',
                  marginTop: 4
                }}
              >
                {showAllHistory ? 'Show Less' : `Show More (${userInputHistory.length - 5})`}
              </button>
            )}
          </div>
        )}
        {/* 输入框 */}
        <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #eee', background: '#fafafa', padding: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 16,
              borderRadius: 8,
              padding: '8px 12px',
              background: '#f3f3f3',
              marginRight: 8
            }}
          />
          <Button htmlType="submit" type="primary" style={{ borderRadius: 8, fontWeight: 600 }}>Send</Button>
        </form>
      </div>
    </div>
  )
}

const MQTT_SERVER = import.meta.env.VITE_MQTT_SERVER
const MQTT_USER_B64 = import.meta.env.VITE_MQTT_USER_B64;
const MQTT_PASSWORD_B64 = import.meta.env.VITE_MQTT_PASSWORD_B64;

// Decode the credentials
const MQTT_USER = atob(MQTT_USER_B64);
const MQTT_PASSWORD = atob(MQTT_PASSWORD_B64);

function App() {
  useEffect(() => {
    const client = mqtt.connect(MQTT_SERVER, { username: MQTT_USER, password: MQTT_PASSWORD });
      
    
    client.on('connect', () => {
      console.log('MQTT Connected')
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
          // 解析JSON消息
          const jsonMessage = JSON.parse(message.toString())
          console.log('Received patient message:', jsonMessage)
          
          // 这里可以处理接收到的JSON消息
          // 例如：更新状态、显示通知等
          handlePatientMessage(jsonMessage)
        } catch (error) {
          console.error('Error parsing patient message:', error)
          console.log('Raw message:', message.toString())
        }
      }
    })
    
    client.on('error', (err) => {
      console.error('MQTT Error:', err)
    })
    
    return () => {
      client.end()
    }
  }, [])
  
  // 处理接收到的patient消息
  const handlePatientMessage = (message: any) => {
    // 根据消息内容进行相应处理
    // 例如：显示通知、更新UI状态等
    console.log('Processing patient message:', message)
    
    // 这里可以添加具体的处理逻辑
    // 比如根据消息类型执行不同的操作
    if (message.type) {
      switch (message.type) {
        case 'status_update':
          console.log('Patient status updated:', message.data)
          break
        case 'alert':
          console.log('Patient alert:', message.data)
          break
        case 'data':
          console.log('Patient data received:', message.data)
          break
        default:
          console.log('Unknown message type:', message.type)
      }
    }
  }
  
  // 随机生成40个蒲公英参数，分布全屏
  const dandelions = Array.from({ length: 40 }).map((_, i) => ({
    x: 5 + Math.random() * 90,
    y: 10 + Math.random() * 80,
    duration: 10 + Math.random() * 12,
    delay: Math.random() * 10
  }))
  const [records, setRecords] = useState<{img: string, desc: string, analysis: string}[]>([])
  return (
    <BrowserRouter basename="/soft_structures_js/">
      <Background />
      {dandelions.map((d, i) => (
        <Dandelion key={i} {...d} />
      ))}
      <LogoHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<Doctor records={records} setRecords={setRecords} />} />
        <Route path="/doctor/record/:id" element={<RecordDetail records={records} />} />
        <Route path="/patient" element={<PatientIntro />} />
        <Route path="/patient/start" element={<PatientStart setRecords={setRecords} />} />
        <Route path="/mqtt-test" element={<MqttTest />} />
        {/* 预留路由 */}
        <Route path="/concept" element={<div style={{padding:80}}>Concept (Content Pending)</div>} />
        <Route path="/functions" element={<div style={{padding:80}}>Functions (Content Pending)</div>} />
        <Route path="/records" element={<div style={{padding:80}}>Diagnosis Records (Content Pending)</div>} />
        <Route path="/services" element={<div style={{padding:80}}>Featured Services (Content Pending)</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

// 自定义橡皮擦和鼠标SVG图标
const EraserIcon = () => (
  <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="3" width="10" height="22" rx="3" fill="#bbb" stroke="#888" strokeWidth="2"/>
    <rect x="6" y="13" width="10" height="2" fill="#888" />
  </svg>
);
const MouseIcon = () => (
  <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="14" height="20" rx="7" fill="#fff" stroke="#333" strokeWidth="2"/>
    <line x1="11" y1="8" x2="11" y2="16" stroke="#333" strokeWidth="2"/>
  </svg>
);
