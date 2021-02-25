<template>
  <div class="base-info-wrapper">
    <div class="content-left">
      <sticky :sticky-top="120">
        <menuLeft :menu-data="menuData" @getMenu="getMenu" />
      </sticky>
    </div>
    <div class="content-right">
      <baseInfo id="baseInfo" />
      <dispute id="dispute" />
      <litigant id="litigant" />
      <evidence id="evidence" />
      <!-- 立案了才有立案信息 -->
      <fileCase v-if="getCaseInfo.cbJudge" id="fileCase" />
      <jointLog id="jointLog" @getList="getList" />
    </div>
  </div>
</template>

<script>
import menuLeft from '@/components/menu/caseMenuLeft'
import baseInfo from './components/baseInfo'
import dispute from './components/dispute'
import litigant from './components/litigant'
import evidence from './components/evidence'
import fileCase from './components/fileCase'
import jointLog from './components/jointLog'
import sticky from '@/components/sticky'
import { mapGetters } from 'vuex'
export default {
  components: {
    menuLeft,
    baseInfo,
    dispute,
    litigant,
    evidence,
    fileCase,
    jointLog,
    sticky
  },
  props: {

  },
  data() {
    return {
      list: [], // 协同信息列表
      menuData: [{
        content: '基本信息',
        color: '#F4AA5A'
      }, {
        content: '纠纷概况',
        color: '#7AC246'
      }, {
        content: '当事人信息',
        color: '#649BED'
      }, {
        content: '证据信息',
        color: '#EB6E63'
      }]
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getTeamData'])
  },
  watch: {
    getCaseInfo() {
      this.init()
    }
  },
  created() {
    this.$store.dispatch('GetCaseInfo')
  },
  mounted() {
    // document.getElementById('mainContent').addEventListener('scroll', () => {
    //   console.log(123)
    // })
  },
  methods: {
    // 初始化菜单
    init() {
      this.menuData = [{
        content: '基本信息',
        color: '#F4AA5A',
        id: 'baseInfo'
      }, {
        content: '纠纷概况',
        color: '#7AC246',
        id: 'dispute'
      }, {
        content: '当事人信息',
        color: '#649BED',
        id: 'litigant'
      }, {
        content: '证据信息',
        color: '#EB6E63',
        id: 'evidence'
      }]
      if (this.list && this.list.length > 0) {
        this.menuData.push({
          content: '协同信息',
          color: '#7AC246',
          id: 'jointLog'
        })
      }
      if (this.getCaseInfo.cbJudge) {
        this.menuData.push({
          content: '立案信息',
          color: '#F4AA5A',
          id: 'fileCase'
        })
      }
    },
    // 获取协同列表数据
    getList(list) {
      this.list = list
      this.init()
    },
    // 点击右侧菜单跳转到指定位置
    getMenu(id) {
      document.getElementById(id).scrollIntoView()
    }
  }
}
</script>

<style scoped lang="scss">
.base-info-wrapper {
  width: 100%;
  height: auto;
  display: flex;
  .content-left {
    width: 150px;
  }
  .content-right {
    width: calc(100% - 150px);
    padding-left: 30px;
  }
}
</style>
