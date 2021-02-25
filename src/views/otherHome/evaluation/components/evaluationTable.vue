<template>
  <div>
    <div class="header">
      <div class="header-left">
        <h3>工作考评列表</h3>
        <div class="tip">开启考评后，针对考评表各内容项进行一一答题，其中需注意系统评分分数会随单位自评而调整。自评分为保存和提交，提交后无可修改直接进入复评阶段。</div>
      </div>
    </div>
    <div class="wrapper">
      <el-table
        :data="list"
        class="my-table-1"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="index"
          label="序号"
          width="80"
        />
        <el-table-column
          prop="name"
          label="单位名称"
        />
        <el-table-column
          prop="sysScores"
          label="系统评分"
          align="center"
        />
        <el-table-column
          prop="unitScore"
          label="单位自评"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.selfScores">{{ scope.row.selfScores }}</span>
            <span v-else class="sty2">未自评</span>
          </template>
        </el-table-column>
        <el-table-column
          label="自评时间"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span class="sty1">{{ scope.row.selfDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="againScore"
          label="复评"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reviewScores != '-'  ">{{ scope.row.reviewScores }}</span>
            <a v-if="scope.row.reviewScores == '-' && getOpInfo.review == 1" @click="startReview(scope.row)">开始复评</a>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="复评时间"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span class="sty1">{{ scope.row.reviewDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <a v-if="scope.row.reviewScores != '-'" @click="startReview(scope.row)">查看详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { opTime, evaUnit} from '@/api/evaluation/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [
      ],
      dialogVisible: false,
      form: {},
      rules: {
        time1: [
          { required: true, message: '请选择自评时间', trigger: 'blur' }
        ],
        time2: [
          { required: true, message: '请选择复评时间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['getOpInfo'])
  },
  created() {
    this.getEvaUnit()
  },
  mounted() {
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        console.log(this.form)
        const params = {
          sStart: this.form.time1[0],
          sEnd: this.form.time1[1],
          rStart: this.form.time2[0],
          rEnd: this.form.time2[1]
        }
        opTime(params).then(({ state, message }) => {
          if (state === 100) {
            this.$message.success(message)
          }
        })
      })
    },
    getEvaUnit() {
      evaUnit({type: this.type}).then(res => {
        console.log(res)
        if (res.state === 100) {
          this.list = res.data.map((item, index) => {
            return {
              index: index+1,
              ...item
            }
          })
        }
      })
    },
    // 开始复评
    startReview(info) {
      const obj = {
        courtName: info.name,
        area: this.type,
        courtId: info.id,
      }
      this.$store.commit('SET_EVIINFO', obj)
      this.$router.push({path:`/evaluation/answer?type=0`})
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  .header-left {
    flex:1;
    h3 {
      color: #464a53;
      font-size: 22px;
    }
    .tip {
      font-size: 14px;
      color: #abafb3;
      margin-top: 10px;
    }
  }
  .header-right {
    width: 250px;
    text-align: right;
  }
}
.wrapper {
  margin-top: 20px;
  .score {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      margin-left: 5px;
      width: 20px;
      cursor: pointer;
    }
  }
}
.my-table {
  font-size: 15px;
}
.sty1 {
  color: #ABAFB3;
}
.sty2 {
  color: #83C9EF;
}
</style>
