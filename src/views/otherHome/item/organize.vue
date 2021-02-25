<template>
  <!-- 队伍管理-解纷组织 -->
  <div class="organize">
    <selectBox ref="selectBox" :team-type="teamType" @search="search" />
    <div class="item-box">
      <el-row :gutter="20">
        <detailOrganize
          v-for="item in arr"
          :key="item.id"
          :all-data="arr"
          :team-type="teamType"
          :item="item"
          :list-court="listCourt"
          @done="done"
        />
        <div v-if="noData" style="text-align: center;">暂无数据</div>
      </el-row>
      <el-row>
        <el-col :span="24" class="page-box">
          <div ref="pageBox" style="width: 10px;height: 10px;" />
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="6"
            :total="total"
            :current-page.sync="current"
            hide-on-single-page
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { listCourtByType, getCourtInfoByType } from '@/api/team/team'
import detailOrganize from './detailOrganize'
import selectBox from './selectBox'
export default {
  name: 'Organize',
  components: {
    selectBox, detailOrganize
  },
  props: {
    teamType: { // 机构类型，0：分流中心，1：联动单位，2：解纷阻止，3：解纷员
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      arr: [],
      total: 1,
      current: 1,
      mediateType: '',
      ortType: '',
      courtName: '',
      nowPage: 1,
      listCourt: [],
      searchParam: {},
      isShow: ''
    }
  },
  computed: {
    noData() {
      return this.arr.length < 1
    }
  },
  watch: {
    teamType(cur, old) {
      this.resetType()
    }
  },
  mounted() {

  },
  methods: {
    getList(pageNum = 1) {
      const params = {
        type: 2, // 类型
        pageNum, // 页码
        pageSize: 6,
        ...this.searchParam
      }
      getCourtInfoByType(params).then(res => {
        if (res.state === 100) {
          this.arr = res.data
          this.total = res.total
          return
        }
        this.arr = []
        this.total = 1
      }).catch(() => {
        this.arr = []
        this.total = 1
      })
    },
    handleCurrentChange(e) {
      this.nowPage = e
      this.getList(e)
    },
    search(params) {
      this.searchParam = params
      this.current = 1
      this.getList(1)
    },
    resetType() {
      this.mediateType = ''
      this.ortType = ''
      this.courtName = ''
      this.current = 1
      this.$refs.selectBox.resetType() // 调用子组件方法清空搜索表单
    },
    done() {
      this.getList(this.current)
    }
  }
}
</script>

<style scoped lang = "scss">
  .item-box {
    padding: 20px;
  }
  .page-box {
    text-align: right;
    height: 80px;
  }
  .organize{
    height: auto;
  }
  /* fade过渡动效 */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }
  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .isShow{
    display: none;
  }
</style>
