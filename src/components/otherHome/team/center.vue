<template>
  <div class="center">
    <el-row :gutter="20">
      <teamItem
        v-for="item in arr"
        :key="item.id"
        :team-type="teamType"
        :item="item"
        :list-court="listCourt"
        @done="done"
      />
    </el-row>
    <el-row>
      <el-col :span="24" class="page-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="6"
          :total="total"
          :current-page.sync="current"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listCourtByType, getCourtInfoByType } from '@/api/otherHome/otherHome'
import teamItem from './teamItem'
export default {
  name: 'Center',
  components: {
    teamItem
  },
  data() {
    return {
      arr: [],
      total: 1,
      teamType: 0,
      listCourt: [],
      current: 1
    }
  },
  computed: {

  },
  mounted() {
    this.getList(0)
  },
  methods: {
    getList(teamType, pageNum = 1) {
      const params = {
        type: teamType, // 类型
        pageNum // 页码
      }
      const params2 = {
        type: Number(teamType) - 1,
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
    done() {
      this.getList(this.teamType, this.nowPage)
    },
    handleCurrentChange(e) {
      this.nowPage = e
      this.getList(this.teamType, e)
    }
  }
}
</script>

<style scoped lang = "scss">
  .center {
    padding: 10px;
  }
  .page-box {
    text-align: right;
    margin-top: 20px;
    height: 80px;
  }
</style>
