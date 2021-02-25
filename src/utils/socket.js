let websock = null
import { SOCKETURL } from './constVal'
import store from '../store/'
import router from '../router/'
console.log('区分生产和开发环境:')
console.log(process.env)
// 初始化weosocket
function initWebSocket(loginId, roomId, websocketonmessage) {
  // ws地址 -->这里是你的请求路径
  const ws = `${SOCKETURL}/websocket?username=${loginId}&roomId=${roomId}`
  websock = new WebSocket(ws)
  websock.onmessage = function(e) {
    heartCheck.reset().start()
    websocketonmessage(e)
  }
  websock.onclose = function(e) {
    console.log(e)
    console.log('websock关闭')
  }
  websock.onopen = function() {
    heartCheck.reset().start() // 心跳检测重置
    websocketOpen()
  }
  // 连接发生错误的回调方法
  websock.onerror = function() {
    console.log('WebSocket连接发生错误')
  }
}
// 联络中心初始化weosocket
function initWebSocket2(loginId, websocketonmessage) {
  // ws地址 -->这里是你的请求路径
  const ws = `${SOCKETURL}/websocket?username=${loginId}`
  websock = new WebSocket(ws)
  websock.onmessage = function(e) {
    heartCheck.reset().start()
    websocketonmessage(e)
  }
  websock.onclose = function(e) {
    // store.commit('SET_SHOWINDEX', 0)
    store.dispatch('GetUserInfo')
    console.log('websock关闭')
  }
  websock.onopen = function() {
    heartCheck.reset().start() // 心跳检测重置
    websocketOpen()
  }
  // 连接发生错误的回调方法
  websock.onerror = function() {
    console.log('WebSocket连接发生错误')
  }
}

// 实际调用的方法
function sendSock(agentData, callback) {
  if (websock.readyState === websock.OPEN) {
    // 若是ws开启状态
    websocketsend(agentData)
  } else if (websock.readyState === websock.CONNECTING) {
    // 若是 正在开启状态，则等待1s后重新调用
    setTimeout(function() {
      sendSock(agentData, callback)
    }, 1000)
  } else {
    // 若未开启 ，则等待1s后重新调用
    setTimeout(function() {
      sendSock(agentData, callback)
    }, 1000)
  }
}

// 数据发送
function websocketsend(agentData) {
  console.log(JSON.stringify(agentData))
  websock.send(JSON.stringify(agentData))
}

// 创建 websocket 连接
function websocketOpen() {
  console.log('连接成功')
}

// 关闭socket
function closeSocket() {
  websock.close()
}

const heartCheck = {
  timeout: 10000, // 30秒发一次心跳
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    return this
  },
  start: function() {
    var self = this
    this.timeoutObj = setTimeout(function() {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      if (websock.readyState != 1) { // 只有在连接状态下才发送心跳
        console.log('websocket已关闭不发送心跳')
        return
      }
      const data = {
        cmd: 13,
        hbbyte: 1
      }
      console.log('发送心跳')
      websocketsend(data)
      console.log('ping!')
      self.serverTimeoutObj = setTimeout(function() { // 如果超过一定时间还没重置，说明后端主动断开了
        websock.close() // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout)
    }, this.timeout)
  }
}

// api方法
// 发送聊天信息
function sendMessage(params) {
  params.cmd = 11
  params.chatType = 1
  params.msgType = 0
  sendSock(params)
}
// 发送视频通知信息
function sendMessage2(params) {
  params.cmd = 11
  params.chatType = 2
  params.msgType = 0
  sendSock(params)
}

// 获取群组在线人数
function groupUser(params) {
  params.cmd = 17
  params.type = 0
  sendSock(params)
}
// 退出群组
function exitGroup(params) {
  params.cmd = 14
  params.type = 0
  sendSock(params)
  closeSocket()
}
// 退出群组
function exitGroup2(params) {
  params.cmd = 14
  params.type = 0
  sendSock(params)
}
// 将方法暴露出去
export {
  initWebSocket,
  sendMessage,
  exitGroup,
  exitGroup2,
  closeSocket,
  groupUser,
  sendMessage2,
  initWebSocket2
}
