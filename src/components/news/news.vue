<template>
  <div class="case-type-wrapper">
    <div v-show="showNewsBox" class="newsBox">
      <div class="title">
        <h1>系统公告/消息({{ noticeMaxNum }})</h1>
        <div><i class="el-icon-remove" @click="showNewsBox = false" /></div>
      </div>
      <div class="contentBox">
        <div v-for="(item,index) in noticeList" :key="index" class="content" @click="noticeDetail(item.unique_id,item.affiche_type)">
          <div class="contentL"><i class="el-icon-chat-dot-round" @click="showNewsBox = false" /></div>
          <div class="contentR">
            <div class="contentRT">{{ item.affiche_type == '1'? item.title:item.content }}</div>
            <div class="contentRB">
              <div>{{ item.send_name }}</div>
              <div class="contentRBTime">{{ item.send_date | timeDate('MM-DD H:m') }}</div>
            </div>
          </div>
        </div>
        <div class="NoContent">{{ noticeMaxNum }}条系统公告/消息 未读</div>
      </div>
      <div class="bottomBox">
        <div @click="readAll">忽略全部</div>
        <div @click="showMore">查看全部</div>
      </div>
    </div>
    <div v-show="!showNewsBox" class="smallNewsBox">
      <img src="@/assets/bigData/news.png" alt="" @click="getNoticeList">
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    noticeList: {
      type: Array,
      default() {
        return []
      }
    },
    noticeMaxNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showNewsBox: false
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  inject: ['reload'],
  methods: {
    // 获取公告、消息内容
    getNoticeList() {
      this.$emit('getNoticeList')
      this.showNewsBox = true
    },
    // 改变公告是否显示状态
    changeShowNewsBox(type) {
      this.showNewsBox = type
    },
    // 进入查看公告/消息详情
    noticeDetail(unique_id, affiche_type) {
      if (affiche_type == 1) { // 公告
        this.$store.commit('SET_CHANGESHOW', 'messageDetail')
        this.$store.commit('SET_NOECHOICE', 'notice')
        this.$store.commit('SET_UNIQUEID', unique_id)
      } else { // 消息
        this.$store.commit('SET_NOWLIST_MESSAGE', 1) // 选中已读，
        this.$store.commit('SET_READTYPE', 1) // 显示已读列表
        this.$store.commit('SET_NOECHOICE', 'message')
      }
      const clickTime = new Date().getTime()
      this.$store.commit('SET_CLICKMESSAGE', clickTime)
      this.showNewsBox = false
      // 置为已读
      const readAffiche = require('@/api/otherHome/otherHome.js').readAffiche
      readAffiche({ afficheIds: [unique_id] })
      if (this.$route.name != 'news') {
        this.$router.push({ name: 'news' })
      }
    },
    // 查看全部
    showMore() {
      this.$store.commit('SET_CHANGESHOW', 'messageBox')
      this.$store.commit('SET_NOECHOICE', 'notice')
      this.showNewsBox = false
      this.$router.push({ name: 'news' })
    },
    // 忽略全部
    readAll() {
      const readAll = require('@/api/otherHome/otherHome.js').readAll
      readAll()
      this.showNewsBox = false
      if (this.$route.name == 'news') {
        this.reload()// 刷新页面，不闪烁
      }
    }
  }
}
</script>

<style scoped lang="scss">
.case-type-wrapper {
  height: 100%;
    .newsBox{
        z-index: 10000;
        border: 2px solid #999999a1;
        position: fixed;
        bottom: 20px;
        right:40px;
        width: 360px;
        max-height: 455px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .title{
            flex-shrink:0;
            background-color: #1882CC;
            height: 40px;
            padding: 0 10px 0 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items:center;
            color: #fff;
            font-size: 12px;
            margin: 0 0 10px 0;
            i{
                font-size: 22px;
                cursor: pointer;
            }
        }
        .contentBox{
            width: 100%;
            padding: 0 10px;
            overflow-y: auto;
            .content{
                display: flex;
                flex-direction: row;
                justify-content:flex-start;
                align-items: center;
                width: 100%;
                height: 80px;
                border-bottom: 1px solid #ccc;
                cursor: pointer;
                .contentL{
                    width:36px;
                    flex-shrink:0;
                    i{
                        font-size: 26px;
                        color: #4e6c8b;
                    }
                }
                .contentR{
                    width: calc(100% - 36px);
                    padding: 0 10px 0 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    font-size: 12px;
                    .contentRT{
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        letter-spacing: 1.2px;
                        line-height: 18px;
                        color: #000;
                    }
                    .contentRB{
                        padding: 10px 0;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        .contentRBTime{
                          flex-shrink: 0;
                        }
                    }
                }
            }
            .NoContent{
              font-size: 12px;
              text-align: center;
              height: 30px;
              line-height: 30px;
            }
        }
        .bottomBox{
          flex-shrink:0;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          background-color: #d1d1d1;
          height: 40px;
          font-size: 12px;
          color: #000;
          padding: 0 10px 0 10px;
          cursor: pointer;
        }
    }
    .smallNewsBox{
        z-index: 10000;
        position: fixed;
        bottom: 20px;
        right:40px;
        width: 40px;
        height: 40px;
        background-color:#1882CC;
        border-radius: 50%;
        cursor: pointer;
        img{
            width: 30px;
            height: 30px;
            margin-left: 5px;
            margin-top: 5px;
        }
    }
}
</style>
