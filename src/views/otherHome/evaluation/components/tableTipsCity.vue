<template>
  <div>
    <div class="header">
      <div class="header-left">
        <h3>工作考评-须知</h3>
        <div class="tip">开启自评前页面，考评表内容须知：诉非联动工作考评按照百分制计算，基础分值为90分，最后得分根据市平安综治建设考评分值折算。针对考评表各内容项进行一一答题，其中需注意系统评分
          分数会随单位自评而调整。自评分为保存和提交，提交后无可修改直接进入复评阶段。
        </div>
      </div>
      <div class="header-right">
        <!-- 只有诉非联动中心才能设置自评时间 -->
        <el-button v-if="getUserInfo.courtId == 1 && getOpInfo.opening != 1" type="primary" @click="dialogVisible = true">设定自评时间，开启考评</el-button>
        <el-button v-if="getUserInfo.courtId != 1 && (getOpInfo.opening == 1 && getOpInfo.self == 1) || (getUserInfo.courtId != 1 && getOpInfo.opening == 0)" :type="getOpInfo.self == 1 ? 'primary':'info'" :disabled="getOpInfo.self != 1" @click="startEvalu">已阅读须知，开始自评</el-button>
        <el-button v-if="getUserInfo.courtId != 1 && getOpInfo.opening == 1 && getOpInfo.self != 1" type="primary" @click="startEvalu">查看详情</el-button>
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
          prop="orders"
          label="序号"
          width="80"
        />
        <el-table-column
          prop="title"
          label="考核内容"
        />
        <el-table-column
          prop="content"
          label="评分标准"
        >
          <template slot-scope="scope">
            <span style="color: #ABAFB3;">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="scores"
          label="分值"
          width="180"
          align="center"
        />
        <el-table-column
          label="系统评分"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span class="score">{{ scope.row.sysScores }}
              <el-tooltip v-if="scope.row.system && scope.row.system.length > 0" class="item" effect="dark" :content="scope.row.system[0].items" placement="top">
                <img src="@/assets/icon/tips.png">
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="单位自评"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span class="score">{{ scope.row.selfScores }}
              <el-tooltip v-if="scope.row.self && scope.row.self.length > 0" class="item" effect="dark" :content="scope.row.self[0].items" placement="top">
                <img src="@/assets/icon/tips.png">
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="中心复评"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span class="score">{{ scope.row.reviewScores }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="开启考评"
      :visible.sync="dialogVisible"
      width="500px"
      :append-to-body="true"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="自评时间" prop="time1">
          <el-date-picker
            v-model="form.time1"
            type="daterange"
            range-separator="-"
            start-placeholder="自评时间"
            end-placeholder="自评时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="复评时间" prop="time2">
          <el-date-picker
            v-model="form.time2"
            type="daterange"
            range-separator="-"
            start-placeholder="复评时间"
            end-placeholder="复评时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { opTime, list } from '@/api/evaluation/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  props: {
    type: {
      type: String,
      default: '市'
    }
  },
  data() {
    return {
      list: [],
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
    ...mapGetters(['getUserInfo', 'getOpInfo'])
  },
  watch: {
    getOpInfo() {
      // if (this.getOpInfo.id) {
      //   this.getList()
      // }
      this.getList()
    }
  },
  created() {
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
            this.dialogVisible = false
            this.$store.dispatch('GetOpInfo')
          }
        })
      })
    },
    // 开始自评
    startEvalu() {
      const obj = {
        area: this.type
      }
      this.$store.commit('SET_EVIINFO', obj)
      this.$router.push({ path: '/evaluation/answer?type=0' })
    },
    getList() {
      const params = {
        type: this.type,
        id: this.getOpInfo.id
      }
      list(params).then(res => {
        if (res.state === 100) {
          this.list = res.data
          let selfTotal = 90
          let systemTotal = 90
          let reviewTotal = 90
          this.list.forEach(item => {
            if (this.isRealNum(item.selfScores)) {
              selfTotal += Number(item.selfScores)
            }
            if (this.isRealNum(item.sysScores)) {
              systemTotal += Number(item.sysScores)
            }
            if (this.isRealNum(item.reviewScores)) {
              reviewTotal += Number(item.reviewScores)
            }
          })
          this.list.push({
            orders: '总分',
            sysScores: systemTotal,
            selfScores: selfTotal,
            reviewScores: reviewTotal
          })
        }
      })
    },
    isRealNum(val) {
      if (val === '' || val == null) {
        return false
      }
      if (!isNaN(val)) {
        return true
      } else {
        return false
      }
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
</style>
