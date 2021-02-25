<!-- 申请协同  -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="案件协同"
    append-to-body
    :visible.sync="modalVisible"
  >
    <div class="wrapper">
      <ul class="header">
        <li v-for="(item, index) in headerList" :key="index" :class="{'active':headIndex === item.id}" @click="getHead(item.id)">{{ item.text }}</li>
      </ul>
      <collaborationLogList :list-index="headIndex" />
    </div>
    <div class="footer">
      <ul>
        <li v-for="(item, index) in footerList" :key="index" class="footer-item" @click="cliCKFoot(index, item.type)">
          <img :src="item.img">
          <span :class="{'disable': item.type == 2}">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import collaborationLogList from './collaborationLogList'
import { endTeamWork } from '@/api/collaboration/index'
export default {
  components: {
    collaborationLogList
  },
  props: {

  },
  data() {
    return {
      modalVisible: false,
      headerList: [],
      headIndex: 0,
      list: [],
      footerList: [
        {
          name: '发起新的',
          img: require('@/assets/icon/icon1.png'),
          type: 1
        },
        {
          name: '结束本单',
          img: require('@/assets/icon/icon4.png'),
          type: 1 // 为1为可点击 2为不可点击
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getLogList'])
  },
  watch: {
    getLogList() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    // 初始化数据
    init() {
      const list = this.getLogList.infoList
      if (!list) {
        return
      }
      this.list = this.getLogList.infoList
      this.headerList = list.map((item, index) => {
        return {
          text: `协同${index + 1}`,
          id: item.uid
        }
      })
      this.headIndex = this.list[0].uid
      this.getFootList()
    },
    getFootList() {
      const list = this.list.filter(item => {
        return item.uid == this.headIndex
      })
      if (list[0].finished) {
        this.footerList[1].img = require('@/assets/icon/icon7.png')
        this.footerList[1].name = '已结束'
        this.footerList[1].type = 2
      } else {
        this.footerList[1].img = require('@/assets/icon/icon4.png')
        this.footerList[1].name = '结束本单'
        this.footerList[1].type = 1
      }
    },
    // 显示模态框
    show() {
      this.modalVisible = true
    },
    // 选择菜单
    getHead(index) {
      this.headIndex = index
      this.getFootList()
    },
    // 点击底部菜单
    cliCKFoot(index, type) {
      if (type == 2) {
        return
      }
      if (index === 0) { // 发起新的
        this.$emit('getNew')
      } else { // 结束本单
        const params = {
          teamWorkId: this.headIndex
        }
        endTeamWork(params).then(res => {
          if (res.state === 100) {
            this.$message.success(res.message)
            const params = {
              caseId: this.getCaseInfo.id
            }
            this.$store.dispatch('getListTeamByCase', params)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  .header {
    width: 100%;
    display: inline-flex;
    overflow: auto;
    justify-content: center;
    li {
      line-height: 30px;
      margin-right: 15px;
      color: black;
      text-align: center;
      min-width: 50px;
      cursor: pointer;
      &.active {
        color: rgba(0,122,255,1);
        border-bottom: 3px solid rgba(0,122,255,1);
      }
    }
  }
}
.footer {
  text-align: center;
  margin-top: 20px;
  ul {
    display: inline-flex;
    width: 300px;
    height: 40px;
    line-height: 40px;
    box-shadow: 0px 3px 6px 0px rgba(112,112,112,0.46);
    z-index: 10;
    border-radius: 20px;
    .footer-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-align: center;
      font-size: 16px;
      color: #007AFF;
      position: relative;
      &.disable {
        &::after {
          content: '';
          background-color: #707070;
        }
      }
      &::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 10px;
        right: 0px;
        top: 50%;
        margin-top: -6px;
        background-color: #007AFF;
      }
      img {
        margin-right: 10px;
        width: 21px;
        height: 22px;
      }
      .disable {
        color: #707070;
      }
      &:last-child {
        &::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 10px;
        right: 0px;
        top: 50%;
        margin-top: -5px;
        background-color: #fff;
      }
      }
    }
  }
}
</style>
