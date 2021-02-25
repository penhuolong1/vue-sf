<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="2">
        <ul class="menuList">
          <li
            v-for="item in menuList"
            :key="item.name"

            :class="{ isChoice:nowChoice === item.name }"
            @click="go(item)"
          >{{ item.name }}</li>
        </ul>
      </el-col>
      <el-col :span="22">
        <div class="grid-content">
          <router-view :now-choice.sync="nowChoice" />
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      咨询电话 0592-2952694
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { exist } from '@/api/contract/contract.js'
import { getUserRouters } from '@/api/user/user'
export default {
  name: 'OtherHome',
  data() {
    return {
      menuList: this.$store.state.user.menuList,
      // menuList: [
      //   { name: '首页', path: '/otherHome/index', permission: [1, 4, 6] },
      //   { name: '资讯管理', path: '/otherHome/news', permission: [1, 4, 6] },
      //   { name: '队伍管理', path: '/otherHome/team', permission: [1, 4, 6] },
      //   { name: '账号管理', path: '/otherHome/account', permission: [1, 2, 4, 6] }
      // ],
      nowChoice: '',
      loginId: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created() {
    if (this.getUserInfo.roleType != 2) {
      this.init()
    }
  },
  mounted() {
    this.loginId = this.$store.state.user.loginId
  },
  methods: {
    go({ name, path }) {
      if (this.$route.path === path) return false
      if (path == '/contactCenter') {
        exist({ loginId: this.loginId }).then(res => {
          if (res.state == 100) {
            if (res.data.exist == true) {
              this.$store.commit('SET_SHOWINDEX', 2)
            } else {
              this.$store.commit('SET_SHOWINDEX', 0)
            }
            const routeData = this.$router.resolve({ path: '/contactCenter' })
            window.open(routeData.href, '_blank')
          }
        })
      } else {
        this.$router.push({ path: path })
      }
    },
    init() {
      if (this.getUserInfo.courtType == 0) { // 诉非联动中心
        if (this.getUserInfo.courtId === 1) {
          this.menuList.push({
            name: '工作考评',
            path: '/evaluation/city'
          })
        } else {
          if (this.getUserInfo.courtName.indexOf('诉非联动中心')) {
            this.menuList.push({
              name: '工作考评',
              path: '/evaluation/area'
            })
          }
        }
      } else if (this.getUserInfo.courtType == 1) { // 区级和市级联动单位
        if (this.getUserInfo.courtLevel == 1) { // 市级联动单位
          if (this.getUserInfo.courtName === '市中级法院' || this.getUserInfo.courtName === '市委政法委') {
            return
          }
          this.menuList.push({
            name: '工作考评',
            path: '/evaluation/city'
          })
        }
      }
      console.log(this.menuList)
    }
  }
}
</script>

<style scoped lang = "scss">
  .menuList {
    height: auto;
    padding: 10px 0;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.1);
    li {
      height: 60px;
      width: 100%;
      text-align: center;
      line-height: 60px;
      color: #fff;
      margin-top: 10%;
      cursor: pointer;
    }
  }
  .grid-content {
    width: 100%;
    min-height: calc(100vh - 120px);
    height: auto;
    background-color: #fff;
    border-radius: 10px;
    padding: 25px;
  }
  .isChoice {
    border-top-left-radius: 25px;
    border-bottom-right-radius: 25px;
    background-color: rgba(255,255,225,0.3);
  }
  .footer {
    position: fixed;
    color: black;
    bottom: 10px;
  }
</style>
