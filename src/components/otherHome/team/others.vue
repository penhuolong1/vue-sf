<template>
  <div class="others">
    <selectBox ref="selectBox" :team-type="teamType" @search="search" />
    <div class="item-box">
      <el-row :gutter="20">
        <!-- <transition-group name="breadcrumb" mode="out-in"> -->
        <teamItem
          v-for="item in arr"
          :key="item.id"
          :team-type="teamType"
          :item="item"
          :list-court="listCourt"
          @done="done"
        />
        <!-- </transition-group> -->
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
import { listCourtByType, getCourtInfoByType } from '@/api/otherHome/otherHome'
import teamItem from './teamItem'
import selectBox from './selectBox'
export default {
  name: 'Others',
  components: {
    selectBox, teamItem
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
      listCourt: []
    }
  },
  computed: {

  },
  watch: {
    teamType(cur, old) {
      this.resetType()
    }
  },
  mounted() {

  },
  methods: {
    getList(teamType, pageNum = 1) {
      const params = {
        type: teamType, // 类型
        pageNum, // 页码
        pageSize: 6,
        mediateType: this.mediateType, // 纠纷类型
        ortType: this.ortType, // 组织类型
        courtName: this.courtName // 机构名
      }
      const params2 = {
        type: teamType === 20 ? 2 : Number(teamType) - 1, // 如果是解纷员则查询type为2的隶属机构列表，否则都查询上一级隶属机构列表
        pageSize: 100
      }
      listCourtByType(params2).then(res => {
        this.listCourt = res.content
      })
      getCourtInfoByType(params).then(({ state, data: { content, total }}) => {
        if (state === 100) {
          this.arr = content
          this.total = total
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
      this.getList(this.teamType, e)
    },
    search(mediateType, ortType, courtName) {
      this.mediateType = mediateType
      this.ortType = ortType
      this.courtName = courtName
      this.current = 1
      this.getList(this.teamType, 1)
    },
    resetType() {
      this.mediateType = ''
      this.ortType = ''
      this.courtName = ''
      this.current = 1
      this.$refs.selectBox.resetType() // 调用子组件方法清空搜索表单
    },
    done() {
      this.getList(this.teamType, this.nowPage)
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
    margin-top: 20px;
    height: 80px;
  }
  .others{
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
</style>
