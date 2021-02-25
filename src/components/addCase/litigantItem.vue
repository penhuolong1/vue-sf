<template>
  <div class="litigant-box">
    <el-scrollbar style="height:100%">
      <el-row style="min-height: 50px;">
        <span class="dot" />
        <span class="title">申请人</span>
        <span class="add" @click="changeStatus(4)">+</span>
        <p v-for="item in applicantfilter" :key="item.id" class="litigant">
          <span class="pointer" @click="edit(item)">{{ item.litigantName }}</span>
          <i class="el-icon-error" @click="deleteLiti(item.id)" />
          <el-row class="lawyer-box">
            <p v-for="(item2,index) in item.lawyer" :key="item2.id">
              <span class="pointer" @click="change(item2,item.id)">代理人{{ index + 1 }}：{{ item2.agentName }}</span>
              <i class="el-icon-error" @click="deleteLawyer(item2.id)" />
            </p>
            添加代理人
            <i class="el-icon-circle-plus-outline" @click="addLawyer(item.id)" />
          </el-row>
        </p>
      </el-row>
      <el-row style="min-height: 50px;">
        <span class="dot" style="background-color:#86C33B;" />
        <span class="title" style="color:#86C33B;">被申请人</span>
        <span class="add" @click="changeStatus(5)">+</span>
        <p v-for="item in respondentfliter" :key="item.id" style="color:#86C33B;" class="litigant">
          <span class="pointer" @click="edit(item)">{{ item.litigantName }}</span>
          <i class="el-icon-error" @click="deleteLiti(item.id)" />
          <el-row class="lawyer-box">
            <p v-for="(item2,index) in item.lawyer" :key="item2.id">
              <span class="pointer" @click="change(item2,item.id)">代理人{{ index + 1 }}：{{ item2.agentName }}</span>
              <i class="el-icon-error" @click="deleteLawyer(item2.id)" />
            </p>
            添加代理人
            <i class="el-icon-circle-plus-outline" @click="addLawyer(item.id)" />
          </el-row>
        </p>
      </el-row>
      <lawyer2
        ref="lawyer2"
        v-bind="$attrs"
        :law-parent-id="litigantId"
        :lawyer-id="lawyerId"
        v-on="$listeners"
      />
    </el-scrollbar>
  </div>
</template>

<script>
// import lawyer from './lawyer'
import lawyer2 from './lawyer2'
import { deleteLitigant, delLawyer } from '@/api/litigant/litigant'
export default {
  name: 'LitigantItem',
  components: {
    lawyer2
  },
  props: {
    applicant: {
      type: Array,
      default: () => ([])
    },
    respondent: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      litigantArr: [],
      litigantId: '',
      lawyerId: ''
    }
  },
  computed: {
    applicantfilter() {
      return this.applicant.map(item => {
        return {
          ...item,
          lawyer: item.lawyer.filter(item => item.enable)
        }
      })
    },
    respondentfliter() {
      return this.respondent.map(item => {
        return {
          ...item,
          lawyer: item.lawyer.filter(item => item.enable)
        }
      })
    }
  },
  mounted() {

  },
  methods: {
    changeStatus(status) {
      this.$emit('update:litigationStatus', status)
      this.$emit('add', false)
    },
    addLawyer(litigantId) {
      this.litigantId = litigantId
      this.lawyerId = ''
      this.$refs.lawyer2.show()
    },
    edit(item) {
      this.$emit('edit', item)
    },
    change(item, litigantId) {
      this.litigantId = litigantId
      this.lawyerId = item.id
      this.$refs.lawyer2.change()
      // this.$refs.lawyer.change(item, litigantId)
    },
    deleteLiti(litigantId) {
      const data = {
        litigantId
      }
      deleteLitigant(data).then(({ state, message }) => {
        state === 100 && this.$message.success(message)
        this.$emit('done')
      })
    },
    deleteLawyer(lawyerId) {
      const data = {
        lawyerId
      }
      delLawyer(data).then(({ state, message }) => {
        state === 100 && this.$message.success(message)
        this.$emit('done')
      })
    }
  }
}
</script>

<style scoped lang = "scss">
  .litigant-box {
    width: 250px;
    min-height: 300px;
    max-height: 300px;
    overflow: auto;
    background-color: #F3F4F4;
    border-radius: 5px;
    padding: 20px;
  }
  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #EAAA56;
    border-radius: 10px;
    margin-right: 20px;
  }
  .title {
    color: #EAAA56;
    font-weight: bold;
    font-size: 14px;
  }
  .add {
    display: inline-block;
    width: 25px;
    height: 25px;
    color: #fff;
    background-color: #579DFC;
    text-align: center;
    line-height: 25px;
    border-radius: 5px;
    cursor: pointer;
    float: right;
  }
  .litigant {
    color: #EAAA56;
    padding-left: 30px;
    line-height: 25px;
    margin-top: 5px;
    font-size: 14px;
    .lawyer-box {
      min-height: 30px;
      color: #719AEF;
      i {
        cursor: pointer;
      }
    }
  }
  .pointer {
    display: inline-block;
    width: 90%;
    cursor: pointer;
    i {
      display: inline-block;
      width: 8%;
      cursor: pointer;
    }
  }
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
.el-icon-error {
  cursor: pointer;
}
</style>
