<template>
  <div class="box-card">
    <div class="search-wrapper">
      <!-- <el-input v-model="value" class="search-item" placeholder="解纷组织名称" type="text" />
      <el-select v-model="value" class="search-item" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="searcn-btn search">搜索</el-button>
      <el-button class="searcn-btn reset">重置</el-button> -->
      <a class="ranking" @click.stop="ranking">排行榜<i class="el-icon-arrow-right" /></a>
    </div>
    <div class="court-wrapper" :gutter="40">
      <courtItem v-for="(item, index) in courtData" :key="index" class="active" :active="selectCourtData.id == item.id" :item="item" />
    </div>
    <div class="page-wrapper" style="text-align: right;">
      <el-pagination
        background
        :page-size="searchParams.pageSize"
        layout="prev, pager, next"
        :total="listCastTotal"
        @prev-click="caseListPrev"
        @next-click="caseListNext"
        @current-change="caseListPage"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="'调解组织排行榜'"
      append-to-body
      width="800px"
      :visible.sync="detailVisible"
    >
      <courtLeaderBoard />
    </el-dialog>
  </div>
</template>

<script>
import courtItem from '@/views/litigant/components/courtItem'
import { listCourt } from '@/api/litigant/litigant'
import courtLeaderBoard from '@/components/leaderboard/court'
export default {
  name: 'SelectUnit',
  components: {
    courtItem,
    courtLeaderBoard
  },
  data() {
    return {
      bodyStyle: {
        width: '97%',
        height: '95%'
      },
      value: '',
      options: [],
      searchParams: {
        pageSize: 8
      },
      listCastTotal: 0,
      courtData: [],
      selectCourtData: '',
      detailVisible: false,
      tableData: []
    }
  },
  computed: {
  },
  mounted() {
  },
  created() {
    this.listCourt()
  },
  methods: {
    listCourt() {
      this.searchParams.courtId = this.$store.state.litigant.registerCourt.id
      listCourt(this.searchParams).then(res => {
        if (res.state === 100) {
          this.courtData = res.content
          this.listCastTotal = res.total
        }
      })
    },
    // 上一页
    caseListPrev(index) {
      console.log('----上一页---------')
      this.searchParams.pageNum = index
      this.listCourt()
    },
    // 下一页
    caseListNext(index) {
      this.searchParams.pageNum = index
      this.listCourt()
    },
    // 选择第几页
    caseListPage(index) {
      this.searchParams.pageNum = index
      this.listCourt()
    },
    // 选择机构
    selectCourt(item) {
      this.selectCourtData = item
    },
    // 返回
    back() {
      this.$router.push({ name: 'step5' })
    },
    next() {
      if (!this.selectCourtData) {
        this.$message.error('请先选择解纷组织')
        return
      }
      const data = {
        id: this.selectCourtData.id,
        name: this.selectCourtData.name
      }
      this.$store.commit('SET_COURTDATA', data)
      this.$router.push({ name: 'step5' })
    },
    ranking() {
      this.detailVisible = true
    }
  }
}
</script>

<style scoped lang = "scss">
.box-card {
  .ranking {
    color: #007AFF;
    float: right;
  }
  .randing-table {
    thead {
      display: none;
    }
  }
  .search-wrapper {
    overflow: hidden;
    .search-item {
      width: 200px;
      margin-right: 10px;
    }
    .searcn-btn {
      padding: 8px 15px;
      margin-right: 15px;
    }
    .search {
      margin-left: 5px;
      color: #fff;
      background-color: #007AFF;
    }
    .reset {
      color: #007AFF;
      border-color: #007AFF;
    }
  }
  .court-wrapper {
    margin-top: 20px;
    height: 100%;
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    .court-item {
      width: 25%;
    }
  }
  .footer {
    margin-top: 40px;
    text-align: right;
    .submit {
      background-color: #007AFF;
      color: #fff;
    }
    .back {
      color: #007AFF;
      border-color: #007AFF;
    }
  }
}
</style>
