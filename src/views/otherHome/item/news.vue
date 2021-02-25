<template>
  <div class="">
    <div class="header">
      <span :class="{isChoice:nowChoice === 'notice'}" @click="getNotice('notice')">
        公告中心
      </span>
      <span :class="{isChoice:nowChoice === 'message'}" @click="getNotice('message')">
        系统消息
      </span>
    </div>
    <div class="body">
      <!-- 系统公告 -->
      <el-row v-if="nowChoice === 'notice'" :gutter="20">
        <el-col :span="3">
          <div v-permission="[1,4,6]" class="button-box">
            <el-button v-hasPermi="['news:add']" type="primary" @click="add">新建</el-button>
          </div>
          <el-row style="margin-top: 20px;">
            <el-col :span="12"><span :class="{isPointer:nowList === 2}" class="pointer" @click="getList(1,2,1)">未读</span></el-col>
            <el-col :span="12" style="text-align: right;">{{ count.notRead }}</el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="12"><span :class="{isPointer:nowList === 1}" class="pointer" @click="getList(1,1,1)">已读</span></el-col>
            <el-col :span="12" style="text-align: right;">{{ count.hasRead }}</el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="12"><span :class="{isPointer:nowList === 0}" class="pointer" @click="getList(1,0,1)">全部</span></el-col>
            <el-col :span="12" style="text-align: right;">{{ allRead }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="18" :offset="2" style="border-left: 1px solid #E8ECEF;min-height: calc(100vh - 240px);height: auto;">
          <message-box v-if="changeShow == 'messageBox'" ref="messageBox" :get-type="getType" :count.sync="count" @show="show" />
          <messageDetail v-if="changeShow == 'messageDetail'" :get-count="getCount" :detail="detail" @show="show" />
          <sendMessage v-if="changeShow == 'sendMessage'" :get-count="getCount" @backList="backList" />
        </el-col>
      </el-row>
      <!-- 系统消息 -->
      <el-row v-if="nowChoice === 'message'" :gutter="20">
        <el-col :span="3">
          <el-row style="margin-top: 20px;">
            <el-col :span="18"><span :class="{isPointer:nowList_message == 2}" class="pointer" @click="getList2(1,2,2)">未读消息</span></el-col>
            <el-col :span="6" style="text-align: right;">{{ count.notRead }}</el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col :span="18"><span :class="{isPointer:nowList_message == 1}" class="pointer" @click="getList2(1,1,2)">已读消息</span></el-col>
            <el-col :span="6" style="text-align: right;">{{ count.hasRead }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="18" :offset="2" style="border-left: 1px solid #E8ECEF;min-height: calc(100vh - 240px);height: auto;">
          <messageSystem ref="messageSystem" :count.sync="count" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import messageBox from '@/components/otherHome/news/messageBox'
import messageDetail from '@/components/otherHome/news/messageDetail'
import sendMessage from '@/components/otherHome/news/sendMessage'
import messageSystem from '@/components/otherHome/news/messageSystem'
import { listAffiche } from '@/api/otherHome/otherHome'
import { mapGetters } from 'vuex'
export default {
  name: 'News',
  components: {
    messageBox, messageDetail, sendMessage, messageSystem
  },
  inject: ['reload'],
  data() {
    return {
      // nowList_message: 2,
      nowList: 0,
      count: {
        hasRead: 0,
        notRead: 0
      },
      detail: {
        sendName: '',
        date: '',
        title: '',
        content: '',
        file: ''
      },
      getType: {
        readType: 0, // 0：全部 1：已读 2：未读
        afficheType: 1// 1:公告 2：系统消息
      }
    }
  },
  computed: {
    ...mapGetters(['changeShow', 'nowList_message', 'clickMessage']),
    allRead() {
      return Number(this.count.hasRead) + Number(this.count.notRead)
    },
    // 公告详情id
    unique_id() {
      return this.$store.state.news.unique_id
    },
    // 公告、消息标签页面控制
    nowChoice() {
      return this.$store.state.news.nowChoice
    }

  },
  watch: {
    clickMessage(newVal) {
      console.log(newVal)
      this.reload()
    }
  },
  mounted() {
    this.$emit('update:nowChoice', '资讯管理')
  },
  methods: {
    getCount() {
      const params = {
        pageSize: 10,
        pageNum: 1,
        readType: this.getType.readType, // 0：全部 1：已读 2：未读
        afficheType: 1// 1:公告 2：系统消息
      }
      listAffiche(params).then(res => {
        if (res.state === 100) {
          this.count = {
            hasRead: res.hasRead,
            notRead: res.notRead
          }
        }
      })
    },
    // 获取相应状态公告列表内容
    getList(pageNum, readType, afficheType) {
      this.getType = {
        readType: readType,
        afficheType: afficheType
      }
      this.nowList = readType
      this.backList()
    },
    // 获取相应状态系统消息列表内容
    getList2(pageNum, readType, afficheType) {
      this.$store.commit('SET_NOWLIST_MESSAGE', readType)
      this.$refs.messageSystem.getList(pageNum, readType, afficheType)
    },
    show(status) {
      this.$store.commit('SET_CHANGESHOW', status)
    },
    add() {
      this.$store.commit('SET_CHANGESHOW', 'sendMessage')
    },
    getNotice(msg) {
      this.$store.commit('SET_NOECHOICE', msg)
    },
    backList() {
      this.$store.commit('SET_CHANGESHOW', 'messageBox')
    }
  }
}
</script>

<style lang="scss">
  .el-col-12 {
    color: #4D4F5C;
  }
</style>

<style scoped lang = "scss">
  .header {
    height: 60px;
    border-bottom: 5px solid #f2f5fa;
    span{
      width: 100px;
      height: 60px;
      line-height: 60px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
  }
  .body {
    margin-bottom: 50px;
  }
  .button-box {
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-bottom: 1px solid #f1f1f3;
  }
  .isChoice {
    border-bottom: 5px solid #007AFF;
  }
  .pointer{
    cursor: pointer;
  }
  .isPointer{
    color: #007AFF;
  }
</style>
