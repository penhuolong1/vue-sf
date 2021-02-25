<template>
  <el-col :span="6">
    <div class="card">
      <div class="title1">
        公告
      </div>
      <div class="showMore">
        <el-button type="text" @click="showMore">查看更多</el-button>
      </div>
      <div class="notice-box">
        <div v-for="item in caseList" :key="item.name" class="notice-item">
          <p style="cursor: pointer;" @click="noticeDetail(item.unique_id)">{{ item.title }}</p>
          <span>{{ item.send_name }}</span>
          <span>{{ item.date }}</span>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import { listAffiche, readAffiche } from '@/api/otherHome/otherHome'
export default {
  name: 'Notice',
  data() {
    return {
      caseList: []
    }
  },
  computed: {

  },
  mounted() {
    this.getList()
  },
  methods: {
    exChange(time) {
      const myDate = new Date(time)
      return `${myDate.getFullYear()}-${(myDate.getMonth() + 1)}-${myDate.getDate()}`
    },
    getList(pageNum = 1) {
      const params = {
        pageNum: 1,
        pageSize: 7,
        afficheType: 1
      }
      listAffiche(params).then(res => {
        const data = res.data.map(item => {
          return {
            ...item,
            title: item.title,
            sendName: item.admin.name,
            date: this.exChange(item.send_date)
          }
        })
        this.caseList = data
      })
    },
    showMore() {
      this.$store.commit('SET_CHANGESHOW', 'messageBox')
      this.$store.commit('SET_NOECHOICE', 'notice')
      this.$router.push({ name: 'news' })
    },
    // 进入查看公告/消息详情
    noticeDetail(unique_id) {
      readAffiche({ afficheIds: [unique_id] })
      this.$store.commit('SET_CHANGESHOW', 'messageDetail')
      this.$store.commit('SET_NOECHOICE', 'notice')
      this.$store.commit('SET_UNIQUEID', unique_id)
      this.$router.push({ name: 'news' })
    }
  }
}
</script>

<style scoped lang = "scss">
  .card {
    padding: 15px;
    width: 100%;
    height: 535px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.16);
    .title1 {
      width: 70%;
      display: inline-block;
      height: 25px;
      font-size: 20px;
      font-family: Segoe UI, Segoe UI-Bold;
      font-weight: 700;
      color: #000000;
      line-height: 26px;
    }
    .showMore {
      display: inline-block;
      width: 25%;
    }
  }
  .notice-box {
    height: auto;
    padding: 15px;
    .notice-item {
      height: 60px;
      border-bottom: 1px solid #DEDEDE;
      p:nth-child(1){
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 30px;
        height: 30px;
      }
      span:nth-child(2){
        display: inline-block;
        width: 58%;
        font-size: 12px;
      }
      span:nth-child(3){
        display: inline-block;
        width: 40%;
        font-size: 12px;
        text-align: right;
      }
    }
  }
</style>
