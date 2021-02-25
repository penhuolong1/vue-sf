<template>
  <div class="content">
    <el-row>
      <!-- 左侧列表 -->
      <el-col :span="5" class="boxBorder scrollBox">
        <el-row class="leftTop">
          <el-col :span="15">
            <i class="el-icon-search" />
            <input v-model="serchName" type="text" placeholder="请输入" class="leftTopInput">
          </el-col>
          <el-col :span="4"><el-button type="primary" size="small" @click="serchGroup">搜索</el-button></el-col>
          <el-col :span="4"><el-button type="primary" size="small" @click="ToLaunch">发起</el-button></el-col>
        </el-row>
        <el-row>
          <List>
            <ListItem v-for="(item,key) in chartList" :key="key" :class="{ isChoice:id === item.id }" style="padding:10px" @click.native="choice(item)">
              <ListItemMeta :avatar="touxiang" :title="item.group_name" :description="item.messageContent ? item.messageContent.type == 'text' ? item.messageContent.text : item.messageContent.type == 'img' ? '[图片]' : item.messageContent.type == 'file' ? '[文件]':item.messageContent.type == 'voice' ? '[语音]':'' :''" />
              <template slot="extra">
                <p v-if=" item.messageContent" style="padding: 2px 0;font-size:12px">
                  <span v-if="item.messageContent.time > dayTime()">{{ item.messageContent.createTime.substr(11,5) }}</span>
                  <span v-if="item.messageContent.time < dayTime() && item.messageContent.time > dayTime()-86400000" style="font-size:12px">昨天</span>
                  <span v-if="item.messageContent.time < dayTime()-86400000">{{ item.messageContent.createTime.substr(0,10) }}</span>
                </p>
                <p style="padding: 2px 0;text-align: right;">
                  <Badge :count="item.messageCount" class-name="demo-badge-alone" />
                </p>
              </template>
            </ListItem>
          </List>
        </el-row>
      </el-col>
      <!-- 中间聊天内容 -->
      <el-col :span="15" class="boxBorder">
        <el-row :gutter="10" class="centerTop">
          <el-col :span="24" class="centerTopContent">
            <p class="chartName" :title="group.groupName">{{ group.groupName }}<span v-if="group.mans && group.mans.length>0">&nbsp;({{ group.mans.length }})</span></p>
            <img v-if="group.mans.length>0" :src="imgUrl2" alt="" title="发起视频" @click="showModel">
          </el-col>
        </el-row>
        <el-row id="chatBox" :gutter="10" class="centerContent">
          <el-col style="width:100%;padding:10px;">
            <div>
              <chatItem
                v-for="(item, index) in chatRecordList"
                v-if="Number(item.time) < Number(group.leaveTime)"
                :id="'chatItem'+item.time"
                :key="index"
                :direction="direction"
                :content="item"
                :num="index"
              />
              <el-divider v-if="showDivider"><span class="listDivider">新消息</span></el-divider>
              <chatItem
                v-for="(item, index) in chatRecordList"
                v-if="Number(item.time) >= Number(group.leaveTime)"
                :id="'chatItem'+item.time"
                :key="index"
                :direction="direction"
                :content="item"
                :num="index"
              />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="centerBottom">
          <div v-loading="loading" element-loading-text="拼命发送中..." element-loading-spinner="el-icon-loading" class="bottomContent">
            <el-row>
              <textarea id="" v-model="chatContent" name="" rows="6" placeholder="请输入消息内容,回车键快捷发送,换行使用shift+enter" style="resize:none" class="mytextarea" @keyup.enter="enterSend" />
            </el-row>
            <el-row>
              <el-col :span="2"><Icon size="22" color="#0097fe" style="cursor:pointer;" type="md-attach" title="发送文件(格式:pdf/doc/docx/xls/xlsx/text)" @click="choiceFile" />&emsp;&emsp;<Icon size="22" color="#0097fe" style="cursor:pointer;" type="md-image" title="发送图片(格式:png/jpg)" @click="choiceImg" /><input ref="uploadFile" type="file" style="display:none" @change="fileChange"></el-col>
              <el-col :span="22"><el-button type="primary" size="small" class="send" @click="send">发送</el-button></el-col>
            </el-row>
          </div>
        </el-row>
      </el-col>
      <!-- 右侧 -->
      <el-col :span="4" class="boxBorder" style="overflow-y:auto">
        <!-- 操作 -->
        <el-row v-if="group.mans.length>0 && loginId == group.mans[0].loginId" :gutter="10" class="rightTop">
          <img class="cursor" :src="editUrl" alt="" @click="edit">
          <span class="operation cursor" @click="edit">编辑</span>
          <img :src="dissolutionUrl" alt="" class="operationBig cursor" @click="deleteGroup">
          <span class="operation cursor" style="color:#FF0000" @click="deleteGroup">解散</span>
        </el-row>
        <!-- 右侧聊天室信息 -->
        <el-row class="rightCenter">
          <!-- 发起者-->
          <el-row :gutter="10" class="box">
            <p class="title">发起者</p>
            <p class="detail">
              {{ group.mans && group.mans.length>0 ? group.mans[0].name :'' }}
            </p>
          </el-row>
          <!-- 发起时间  -->
          <el-row :gutter="10" class="box">
            <p class="title">发起时间</p>
            <p class="detail">
              {{ group.createDate }}
            </p>
          </el-row>
          <!-- 发起事由 -->
          <el-row :gutter="10" class="box">
            <p class="title">发起事由</p>
            <p class="detail">
              <span>
                {{ group.reason }}
              </span>
            </p>
          </el-row>
          <!-- 已加入 -->
          <el-row :gutter="10" class="peoplebox">
            <p class="title">已加入</p>
            <p class="detail">
              <ul v-if="group.mans && group.mans.length>0">
                <li v-for="(item,key) in group.mans" :key="key" class="peopleList">
                  <el-badge v-if="item.flag" is-dot class="item" type="success" />
                  <img style="width:18px;height:18px" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
                  <span class="name">{{ item.name }}</span>
                  <img v-if="!item.flag && loginId == group.mans[0].loginId && item.loginId!=loginId" :src="icon" style="cursor:pointer;" alt="发起通知" title="发起通知" @click="sendnotice(item.loginId)">
                </li>
              </ul>
            </p>
          </el-row>
          <!-- 未加入 -->
          <el-row :gutter="10" class="peoplebox">
            <p class="title">未加入</p>
            <p class="detail">
              <ul v-if="group.outman && group.outman.length>0">
                <li v-for="(item,key) in group.outman" :key="key" class="peopleList">
                  <img style="width:18px;height:18px" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
                  <span class="name"><span v-if="item.status == 2">(拒绝)</span>{{ item.name }}</span>
                  <img v-if="loginId == group.mans[0].loginId" :src="icon" style="cursor:pointer;" alt="发起通知" title="发起通知" @click="sendnotice(item.loginId)">
                </li>
              </ul>
            </p>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      width="550px"
      :close-on-click-modal="false"
    >
      <div style="width:100%">
        <el-row :gutter="10">
          <el-form ref="form" :model="ruleForm" label-width="80px">
            <el-form-item label="名称:" prop="groupName">
              <el-input v-model="ruleForm.groupName" style="width: 90%;" />
            </el-form-item>
            <el-form-item label="事由:" prop="reason">
              <el-input v-model="ruleForm.reason" style="width: 90%;" />
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGroup">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="发起视频"
      :visible.sync="videoVisible"
      width="550px"
      :close-on-click-modal="false"
    >
      <div style="width:100%">
        <el-checkbox-group v-model="checkListArr">
          <el-checkbox v-for="(item,key) in checkList" :key="key" :label="item.loginId" style="margin-bottom: 30px;">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="videoVisible = false">取 消</el-button>
        <el-button type="primary" @click="getToken">发 起</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import chatItem from './chatItem.vue' // 聊天对话框
import { searchPageGroup, selectGroup, leave, deleteGroup, editGroup, sendnotice, getToken, getUserById, initGroup, uploadFile, addGroupRoom } from '@/api/contract/contract.js'
import { initWebSocket2, closeSocket, sendMessage, groupUser, exitGroup2, sendMessage2 } from '@/utils/socket.js'
import { formatDate } from '@/utils/format.js'
import { uploadFrontImage } from '@/api/litigant/litigant'
import { limitFileSize } from '@/utils/tools.js'
export default {
  components: {
    chatItem
  },
  props: {
    goLaunch: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      chartList: [], // 左侧人员列表
      id: localStorage.getItem('mygroupId') ? JSON.parse(localStorage.getItem('mygroupId')) : '', // 当前聊天室id
      loginId: null, // 登陆者ID
      loginUserInfo: null, // 登陆人信息
      chatContent: '', // 聊天输入框内容
      group: {
        mans: [], // 已加入人员
        outman: [], // 未加入人员
        reason: '', // 事由
        groupName: '群组名', // 当前聊天室名称
        createDate: '', // 发起时间
        leaveTime: null, // 离开聊天室得时间点
        roomId: ''
      },
      chatRecordList: [], // 聊天记录
      showDivider: false,
      direction: 'directionLeft',
      dialogVisible: false,
      ruleForm: {
        groupName: '',
        reason: ''
      },
      serchName: '', // 搜索内容
      uploadType: '',
      videoVisible: false,
      checkList: [], // 发起视频备选人员
      checkListArr: [], // 勾选人员
      editUrl: require('@/assets/contactCenter/outline-edit-24px.png'),
      dissolutionUrl: require('@/assets/contactCenter/3852.png'),
      icon: require('@/assets/contactCenter/10012.png'),
      imgUrl2: require('@/assets/contactCenter/video.png'),
      touxiang: require('@/assets/contactCenter/qunzu.png'),
      loading: false

    }
  },
  created() {
    this.loginUserInfo = this.$store.state.user.userInfo
  },
  // 每次页面渲染完之后聊天记录得滚动条在最底部
  updated: function() {
    this.$nextTick(function() {
      var div = document.getElementById('chatBox')
      div.scrollTop = div.scrollHeight
    })
  },
  mounted() {
    console.log('chatRoom')
    this.searchPageGroup()
    // 获取登陆者ID
    this.loginId = this.$store.state.user.loginId
    // 获取聊天室id
    this.id = this.$store.state.contract.id
    console.log('当前聊天室id', this.id)
    // 进入该聊天室

    initGroup({ loginId: this.loginId }).then(res => {
      if (res.state == 100) {
        initWebSocket2(this.loginId, this.getMessage)// 连接weosocket
      }
    })
    if (this.$store.state.contract.id != '') {
      // 获取群组信息
      this.selectGroup()
    }
    this.dayTime()
  },
  methods: {
    // 获取聊天室左侧人员列表
    searchPageGroup() {
      const params = {
        groupName: this.serchName,
        pageNum: 1,
        pageSize: 1000
      }
      searchPageGroup(params).then(res => {
        if (res.state == 100) {
          res.content = res.content.map(item => {
            item.messageContent = JSON.parse(item.messageContent)
            item.messageData.map((flag, index) => {
              flag.messageContent = JSON.parse(flag.messageContent)
            })
            // 若有选中聊天室则显示聊天记录
            if (this.id == item.id) {
              // 组装历史记录
              for (let i = 0; i < item.messageData.length; i++) {
                if (item.messageData[i]) {
                  this.chatRecordList.push(item.messageData[i].messageContent || item.messageData[i])
                }
              }
            }
            return item
          })
          this.chartList = res.content
        }
      })
    },
    // 搜索聊天室
    serchGroup() {
      this.searchPageGroup()
    },
    // 点击切换群组
    choice(item) {
      // 更新左侧的列表
      this.chartList.forEach(flag => {
        if (item.id == flag.id) {
          flag.messageCount = 0
        }
      })
      if (this.id != '') {
        // 记录离开群组时间
        const params = {
          groupId: this.id, // 群组groupId
          loginId: this.loginId // 登录者ID
        }
        this.leave(params)
      }
      this.id = item.id
      localStorage.setItem('mygroupId', JSON.stringify(item.id))
      console.log(this.id)
      // 清除上一个聊天室聊天记录
      this.chatRecordList = []
      // 获取群组信息
      this.selectGroup()

      // 获取历史记录
      for (let i = 0; i < item.messageData.length; i++) {
        if (item.messageData[i]) {
          this.chatRecordList.push(item.messageData[i].messageContent || item.messageData[i])
        }
      }
      // 新消息分割线是否显示
      this.showDivider = false
      for (let j = 0; j < this.chatRecordList.length; j++) {
        if (this.chatRecordList[j].time >= item.leaveTime) {
          this.showDivider = true
        }
      }
    },
    // 获取当前群组信息
    selectGroup() {
      const params = {
        groupId: this.id
      }
      selectGroup(params).then(res => {
        if (res.state == 100) {
          this.checkList = []
          const manaArr = JSON.parse(res.group.mans) || []// 已加入人员
          manaArr.map(item => {
            item.flag = false
            return item
          })
          this.group.mans = manaArr// 已加入人员
          // this.group.mans = JSON.parse(res.group.mans) || []// 已加入人员
          this.group.outman = JSON.parse(res.group.outman) || []// 未加入人员
          this.group.reason = res.group.reason // 事由
          this.group.groupName = res.group.groupName // 聊天室名称
          this.group.createDate = formatDate(res.group.createDate) // 发起时间
          this.group.leaveTime = res.leaveTime // 离开聊天室得时间点
          this.group.roomId = res.group.roomId
          console.log(this.group)
          let arr = []
          arr = this.group.mans.concat(this.group.outman)
          arr.forEach((item, key) => {
            if (item.loginId == this.loginId) {
              arr.splice(key, 1)
            }
          })
          this.checkList = arr
          // 获取在线群组用户
          this.getGroupUser()
        }
      })
    },
    // 获取群组在线人数
    getGroupUser() {
      const params = {
        userid: this.loginId,
        groupId: this.id
      }
      groupUser(params)
    },
    // 退出群组
    exitGroup2() {
      const params = {
        userid: this.loginId
      }
      exitGroup2(params)
    },
    // 初始化weosocket
    initSocket() {
      console.log('*********初始化weosocket********')
      // initWebSocket(this.loginId, this.id, this.getMessage)// 开启当前聊天室的weosocket
      initWebSocket2(this.loginId, this.getMessage)// 开启当前聊天室的weosocket
    },
    // 接收聊天记录
    getMessage(e) {
      const data = JSON.parse(e.data)
      if (data.command == 18) {
        // 获取在线人数
        const dataArr = data.data.groups
        const dataArrLength = dataArr.length
        for (let i = 0; i < dataArrLength; i++) {
          if (dataArr[i].group_id == this.id) {
            const arr = dataArr[i].users
            for (let j = 0; j < this.group.mans.length; j++) {
              this.group.mans[j].flag = false
              for (let k = 0; k < arr.length; k++) {
                if (this.group.mans[j].loginId == arr[k].id) {
                  this.group.mans[j].flag = true
                  break
                }
              }
            }
            break
          }
        }

        this.$forceUpdate()
      }
      if (data.command === 9) {
        // 有人加入群聊
        if (this.id != '' && data.data.group == this.id) {
          this.selectGroup()
        }
      }
      if (data.command === 10) {
        // 有人退出群聊
        if (this.id != '' && data.data.group == this.id) {
          this.selectGroup()
        }
      }
      if (data.command === 11) {
        const content = JSON.parse(data.data.content)
        this.chartList.forEach((item, index) => {
          if (content.groupId == item.id) {
            item.messageData.push(content) // 添加进历史记录
            item.messageContent = content // 左侧最新消息展示
            // 有新消息的群组排列在前面
            const chartItem = item
            this.chartList.splice(index, 1)
            this.chartList.unshift(chartItem)
          }
        })
        const time = new Date().getTime()
        content.time = time
        if (content.groupId == this.id) { // 当前聊天室消息，直接添加进窗口
          this.chatRecordList.push(content)
          // this.$nextTick(() => {
          //   document.getElementById(`chatItem${time}`).scrollIntoView()
          // })
        } else { // 其他聊天室消息，设置未读数据+1
          this.chartList.forEach(flag => {
            if (content.groupId == flag.id) {
              flag.messageCount += 1
              // flag.messageContent = content
              this.$forceUpdate()
            }
          })
        }
        // if (content.type == 'rollback') {
        //   // 发出测回信息
        //   const chatRecordListnum = findArrayIndexByKey(
        //     this.chatRecordList,
        //     'messageid',
        //     content.text
        //   )
        //   if (chatRecordListnum >= 0) {
        //     this.$set(
        //       this.chatRecordList[chatRecordListnum],
        //       'isWithdraw',
        //       true
        //     )
        //   }
        // } else if (content.type == 'words') {
        //   // 发出禁言消息
        // } else {
        //   this.chatRecordList.push(content)
        // }
      }
    },
    // 回车发送消息
    enterSend(event) {
      if (event.shiftKey && event.keyCode == 13) {
        // 不需要执行任何代码。会自动换行
      } else {
        this.send() // 提交的发送消息函数
      }
    },
    // 发送消息
    send() {
      if (this.chatContent.replace(/^\s*|[\x00-\x1f]|\s*$/g, '') == '') { // 判空
        this.$message.error('请先输入发送内容')
        this.chatContent = ''
        return
      }
      const time = new Date().getTime()
      const params = {
        from: this.loginId,
        group_id: this.id,
        createTime: time,
        content: {
          userName: this.loginUserInfo.result.name,
          role: this.loginUserInfo.roleType,
          text: this.chatContent,
          loginId: this.loginId,
          groupId: this.id,
          type: 'text',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.loginId}${time}`
        }
      }
      console.log('发送消息', params)
      sendMessage(params)
      this.chatContent = ''
    },
    // 撤回
    withdraw(id) {
      const time = new Date().getTime()
      const params = {
        from: this.loginId,
        group_id: this.id,
        createTime: time,
        content: {
          userName: this.loginUserInfo.result.name,
          role: this.loginUserInfo.roleType,
          text: id,
          content: '',
          loginId: this.loginId,
          groupId: this.id,
          type: 'rollback',
          time: time,
          createTime: formatDate(time),
          messageid: `${this.loginId}${time}`
        }
      }
      sendMessage(params)
    },
    // 记录离开群组时间
    leave(params) {
      leave(params).then(res => {
        if (res.state == 100) {
          console.log('记录离开群组时间')
        }
      })
    },
    // 今日凌晨的时间戳
    dayTime() {
      const today = new Date()
      return today.getTime() - today.getHours() * 60 * 60 * 1000 - today.getMinutes() * 60 * 1000 - today.getSeconds() * 1000 - today.getMilliseconds()
    },
    // 删除群组
    deleteGroup() {
      const params = {
        groupId: this.id
      }
      deleteGroup(params).then(res => {
        if (res.state == 100) {
          // 更新左侧的列表
          this.searchPageGroup()
          this.id = ''
          this.chatRecordList = []
          this.group = {
            mans: [], // 已加入人员
            outman: [], // 未加入人员
            reason: '', // 事由
            groupName: '群组名', // 当前聊天室名称
            createDate: '', // 发起时间
            leaveTime: null// 离开聊天室得时间点
          }
          this.$message({
            message: res.message,
            type: 'success'
          })
        }
      })
    },
    // 修改群组信息
    edit() {
      this.ruleForm.groupName = this.group.groupName
      this.ruleForm.reason = this.group.reason
      this.dialogVisible = true
    },
    // 提交修改群组信息
    editGroup() {
      const params = {
        groupId: this.id,
        groupName: this.ruleForm.groupName,
        reason: this.ruleForm.reason
      }
      editGroup(params).then(res => {
        if (res.state == 100) {
          // 更新信息获取群组信息
          this.selectGroup()
          // 获取聊天室左侧人员列表
          this.searchPageGroup()
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.dialogVisible = false
        }
      })
    },
    // 跳转发起配置页面
    ToLaunch() {
      closeSocket()
      if (this.id != '') { // 记录离开群组时间
        const params = {
          groupId: this.id, // 群组groupId
          loginId: this.loginId// 登录者ID
        }
        this.leave(params)
      }
      this.$store.commit('SET_SHOWINDEX', 0)
      // 退出群组
      // this.exitGroup2()
      this.$nextTick(() => {
        this.goLaunch()
      })
    },
    // 上传文件
    choiceFile() {
      this.uploadType = 'file'
      this.$refs.uploadFile.dispatchEvent(new MouseEvent('click'))
    },
    // 上传图片
    choiceImg() {
      this.uploadType = 'img'
      this.$refs.uploadFile.dispatchEvent(new MouseEvent('click'))
    },
    fileChange(event) {
      this.loading = true
      if (event.target.files.length < 1) {
        this.loading = false
        return
      }
      const fileList = Object.values(event.target.files)
      const size = fileList[0].size
      if (limitFileSize(fileList[0])) { // 限制文件大小不能超过20M
        this.loading = false
        return
      }
      console.log(fileList)
      const formData = new FormData()
      const imgArr = ['img', 'IMG', 'png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
      const fileArr = ['doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'pdf', 'PDF', 'txt']
      for (const item of fileList) {
        formData.append('file', item)
        const last = item.name.substring(item.name.lastIndexOf('.') + 1)
        if (this.uploadType == 'file') {
          if (fileArr.indexOf(last) == -1) {
            this.$message.error('请上传pdf/doc/docx/xls/xlsx/text格式文件!')
            this.loading = false
            return
          }
        } else {
          if (imgArr.indexOf(last) == -1) {
            this.loading = false
            this.$message.error('请上传png/jpg格式图片!')
            return
          }
        }
      }
      const time = new Date().getTime()
      if (this.uploadType == 'file') {
        uploadFile(formData).then(res => {
          this.loading = false
          if (res.state == 100) {
            const params = {
              from: this.loginId,
              group_id: this.id,
              createTime: time,
              content: {
                userName: this.loginUserInfo.result.name,
                role: this.loginUserInfo.roleType,
                text: res.url,
                fileName: res.name,
                loginId: this.loginId,
                groupId: this.id,
                type: 'file',
                time: time,
                createTime: formatDate(time),
                messageid: `${this.loginId}${time}`
              }
            }
            console.log('发送消息', params)
            sendMessage(params)
            this.chatContent = ''
          }
        })
      } else {
        uploadFrontImage(formData).then(res => {
          this.loading = false
          if (res.state == 100) {
            const params = {
              from: this.loginId,
              group_id: this.id,
              createTime: time,
              content: {
                userName: this.loginUserInfo.result.name,
                role: this.loginUserInfo.roleType,
                text: res.url,
                loginId: this.loginId,
                groupId: this.id,
                type: 'img',
                time: time,
                createTime: formatDate(time),
                messageid: `${this.loginId}${time}`
              }
            }
            console.log('发送消息', params)
            sendMessage(params)
            this.chatContent = ''
          }
        })
      }
    },
    // 向不在线人员发起通知
    sendnotice(loginId) {
      const params = {
        groupId: this.id,
        sendId: loginId,
        roomId: this.group.roomId,
        type: '聊天室(可视频)'
      }
      sendnotice(params).then(res => {
        if (res.state == 100) {
          this.$message({
            message: '已发送通知',
            type: 'success'
          })
        }
      })
    },
    showModel() {
      this.checkListArr = []
      this.videoVisible = true
    },
    // 发起视频
    getToken() {
      console.log('-------------------', this.checkListArr)
      if (this.checkListArr.length > 8) {
        this.$message.error('发起视频最多可选择8人')
        return
      }
      if (this.checkListArr.length == 0) {
        this.$message.error('请先勾选邀请加入视频人员')
        return
      }
      this.checkListArr.forEach(item => {
        // 系统首页通知
        const params = {
          groupId: this.id,
          sendId: item,
          roomId: this.group.roomId,
          type: '视频'
        }
        sendnotice(params)
        // 聊天信息页面通知
        getUserById({ loginId: item }).then(res => {
          if (res.state == 100) {
            const time = new Date().getTime()
            const obj = {
              from: this.loginId,
              to: item,
              group_id: this.id,
              createTime: time,
              chatType: 0,
              content: {
                roomId: this.group.roomId,
                userName: this.loginUserInfo.result.name,
                role: this.loginUserInfo.roleType,
                text: '邀请【' + res.name + '】进入视频，点击此消息进入',
                loginId: this.loginId,
                groupId: this.id,
                to: item,
                type: 'text',
                time: time,
                createTime: formatDate(time),
                messageid: `${this.loginId}${time}`
              }
            }
            sendMessage2(obj)
            console.log('发送视频通知', obj)
          }
        })
      })
      const params = {
        groupId: this.id,
        permission: 'admin',
        roomId: this.group.roomId
      }
      getToken(params).then(res => {
        if (res.state == 100) {
          addGroupRoom({ groupId: this.id }).then(res => {
            console.log('存储发起者')
          })
          closeSocket()
          // 记录离开群组时间
          const params = {
            groupId: this.id, // 群组groupId
            loginId: this.loginId // 登录者ID
          }
          this.leave(params)
          localStorage.setItem('mygroupId', JSON.stringify(this.id))
          this.$store.commit('SET_ID', this.id)
          this.$store.commit('SET_TOKEN', res.data.result)
          this.$store.commit('SET_SHOWINDEX', 1)
        }
      })
    }

  }
}
</script>
<style scoped lang="scss">
::v-deep .ivu-list-item-meta-description{
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.content{
   width: 100%;
   height: 100vh;
  .boxBorder{
    border:1px solid #dedede;
    height: 100vh;
  }
  .scrollBox{
    background-color: white;
    overflow-y: auto;
  }
  .leftTop{
    height: 60px;
    background-color: white;
    display: flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    border-bottom:1px solid #dedede;
    .leftTopInput{
      border:none;
      outline:none;
      padding-left:5px;
      width: 80%;
    }

  }
  .isChoice{
    background-color: #F1F4F7;
  }
  .centerTop{
    height:60px;
    padding-left:15px;
    border-bottom:1px solid #dedede;
    .chartName{
      line-height: 60px;
      width: 400px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .centerTopContent{
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img{
        height: 73px;
        width: 73px;
      }
    }
  }
  .centerContent{
    height: 70%;
    overflow-y:auto;
    .listDivider{
      color: #007aff;
    }
  }
  .centerBottom{
    height: calc(30% -60px);
    display: flex;
    flex-direction:row;
    justify-content:center;
    .bottomContent{
      width: 95%;
      height: 95%;
      background-color: white;
      border:1px solid #dedede;
      padding-bottom:10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .mytextarea{
        border:none;
        outline:none;
        margin-bottom:10px;
        width: 99%;
        padding-left:10px;
        padding-right:10px;
        padding-top: 10px;
      }
      .send{
        text-align: center;
        float:right;
        margin-right: 30px;
      }
    }
  }
  .rightTop{
    height: 60px;
    display: flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    border-bottom:1px solid #dedede;
    .operationBig{
      margin-left:30px;
    }
    .operation{
      margin-left:10px;
    }
    .cursor{
      cursor: pointer;
    }
  }
  .rightCenter{
    padding: 20px;
    .box{
        min-height: 80px;
        border-bottom:1px solid #dedede;
        display: flex;
        margin-bottom:20px;
        flex-direction:column;
        justify-content:center;
        align-items:flex-start;
        .title{
          font-size: 16px;
          font-weight: 400;
        }
        .detail{
          font-size: 14px;
          font-weight: 400;
          margin:20px 0 20px 20px;
        }
      }
    .peoplebox{
      height: auto;
      border-bottom:1px solid #dedede;
      margin-bottom: 20px;
      .title{
        font-size: 16px;
        font-weight: 400;
      }
      .detail{
        font-size: 14px;
        font-weight: 400;
        margin:20px 0 20px 20px;
      }
      .detail2{
        margin-left:42px;
      }
      .peopleList{
        padding: 10px 0;
        display: flex;
        flex-direction:row;
        align-items:flex-start;
        ::v-deep .el-badge__content.is-dot{
          height: 12px;
          width: 12px;
          top: 2px;
          margin-right:10px;
        }
        .name{
          margin-left:10px;
          margin-right:10px;
        }
      }
    }

  }
  .demo-badge-alone{
    background: #5cb85c !important;
  }
}
</style>
