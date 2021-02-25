<template>
  <div class="content">
    <el-row :gutter="10">
      <!-- 右侧 -->
      <el-col :span="24" class="boxBorder scrollBox">
        <!-- 操作 -->
        <el-row v-if="group.mans.length>0 && loginId == group.mans[0].loginId" :gutter="10" class="rightTop">
          <img class="cursor" :src="editUrl" alt="">
          <span class="operation cursor">编辑</span>
          <img :src="dissolutionUrl" alt="" class="operationBig cursor">
          <span class="operation cursor" style="color: #9597a6;">解散</span>
        </el-row>
        <!-- 右侧聊天室信息 -->
        <el-row :gutter="10" class="rightCenter">
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
                  <!-- <el-badge v-if="item.flag" is-dot class="item" type="success" /> -->
                  <span v-if="item.flag || loginId == item.loginId" style="width:10px;height:10px;background-color: #67C23A;border-radius: 50%;display: block;margin-right: 10px;margin-top:4px;" />
                  <img style="width:18px;height:18px" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
                  <span class="name">{{ item.name }}</span>
                  <img v-if="!item.flag && loginId!=item.loginId && loginId == group.mans[0].loginId && item.loginId!=loginId" :src="icon" alt="发起通知" @click="sendnotice(item.loginId)">
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
                  <img v-if="loginId == group.mans[0].loginId" :src="icon" alt="发起通知" @click="sendnotice(item.loginId)">
                </li>
              </ul>
            </p>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { sendnotice } from '@/api/contract/contract.js'
export default {
  components: {
  },
  props: {
    loginId: {
      type: String,
      default: ''
    },
    userLength: {
      type: Number,
      default: 1
    },
    groupId: {
      type: String,
      default: ''
    },
    user1: {
      type: Array,
      default() {
        return []
      }
    },
    groupF: {
      type: Object,
      default: function() {
        return {
          mans: [], // 已加入人员
          outman: [], // 未加入人员
          reason: '', // 事由
          groupName: '群组名', // 当前聊天室名称
          createDate: '', // 发起时间
          leaveTime: null, // 离开聊天室得时间点
          roomId: '',
          vedioMan: '' // 视频发起者id
        }
      }
    }

  },
  data() {
    return {
      editUrl: require('@/assets/contactCenter/edit.png'),
      dissolutionUrl: require('@/assets/contactCenter/jiesan.png'),
      icon: require('@/assets/contactCenter/10012.png'),
      num: 1,
      group: {
        mans: [], // 已加入人员
        outman: [], // 未加入人员
        reason: '', // 事由
        groupName: '群组名', // 当前聊天室名称
        createDate: '', // 发起时间
        leaveTime: null, // 离开聊天室得时间点
        roomId: '',
        vedioMan: '' // 视频发起者id
      },
      videoUser: []
    }
  },
  watch: {
    groupF: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        this.group = { ...newVal }

        this.changeFlag(this.videoUser)
        // if (this.videoUser.length == 0) {
        //   let mansArr = []
        //   mansArr = this.group.mans.map(item => {
        //     item.flag = false
        //     return item
        //   })
        //   this.group.mans = mansArr
        //   return
        // }
        // let garr = []
        // this.videoUser.forEach(element => {
        //   garr = this.group.mans.map(item2 => {
        //     if (element.id == item2.loginId) {
        //       item2.flag = true
        //     }
        //     return item2
        //   })
        // })
        // this.group.mans = garr
      }
    },
    user1: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        const arr = newVal
        this.videoUser = newVal
        this.changeFlag(arr)
        // if (arr.length == 0) {
        //   let mansArr = []
        //   mansArr = this.group.mans.map(item => {
        //     item.flag = false
        //     return item
        //   })
        //   this.group.mans = mansArr
        //   return
        // }
        // let garr = []
        // arr.forEach(element => {
        //   garr = this.group.mans.map(item2 => {
        //     if (element.id == item2.loginId) {
        //       item2.flag = true
        //     }
        //     return item2
        //   })
        // })
        // this.group.mans = garr
      }
    },
    userLength(curVal, oldVal) {
      this.num = curVal
    }
  },
  created() {
    console.log(this.loginId, '***************', this.group)
  },
  destroyed() {

  },
  mounted() {
  },
  methods: {
    // 其他人都不在线时。不显示小绿标
    changeFlag(arr) {
      if (arr.length == 0) {
        let mansArr = []
        mansArr = this.group.mans.map(item => {
          item.flag = false
          return item
        })
        this.group.mans = mansArr
        return
      }
      let garr = []
      arr.forEach(element => {
        garr = this.group.mans.map(item2 => {
          if (element.id == item2.loginId) {
            item2.flag = true
          }
          return item2
        })
      })
      this.group.mans = garr
    },
    // changeFlagFalse(arr) {
    //   if (arr.length == 0) {
    //     let mansArr = []
    //     mansArr = this.group.mans.map(item => {
    //       item.flag = false
    //       return item
    //     })
    //     this.group.mans = mansArr
    //     return
    //   }
    // },
    // // 有其他人在线时，显示小绿标
    // changeFlagTrue(arr) {
    //   let garr = []
    //   arr.forEach(element => {
    //     garr = this.group.mans.map(item2 => {
    //       if (element.id == item2.loginId) {
    //         item2.flag = true
    //       }
    //       return item2
    //     })
    //   })
    //   this.group.mans = garr
    // },
    // 向不在线人员发起通知
    sendnotice(loginId) {
      if (this.num > 9) { // 超过九人不在发起通知
        this.$message.error('同时视频人数最多9人')
        return
      }
      const params = {
        groupId: this.groupId,
        sendId: loginId,
        roomId: this.group.roomId,
        type: '视频'
      }
      sendnotice(params).then(res => {
        if (res.state == 100) {
          this.$message({
            message: '已发送通知',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.content{
   width: 100%;
   height: 100vh;
   .boxBorder{
    height: 100vh;
  }
  .scrollBox{
    background-color: white;
    overflow-y: auto;
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
      color: #9597a6;
    }
    .cursor{
      cursor: pointer;
    }
  }
  .rightCenter{
    padding: 20px;
    .box{
        height: 100px;
        border-bottom:1px solid #dedede;
        display: flex;
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
          margin-left:20px;
          margin-top:20px;
        }
      }
    .peoplebox{
      height: auto;
      border-bottom:1px solid #dedede;
      .title{
        font-size: 16px;
        font-weight: 400;
        margin-top:20px;
      }
      .detail{
        font-size: 14px;
        font-weight: 400;
        margin-left:20px;
        margin-top:20px;
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
