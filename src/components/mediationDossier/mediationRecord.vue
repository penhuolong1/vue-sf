<template>
  <div style="padding:20px">
    <div class="form">
      <!-- <div class="operation"  v-show="editFlag">
                <p class="el-icon-plus" @click="setForm('add')" style="background:#2176FE"></p>
                <p class="el-icon-minus" @click="setForm('del')" style="background:#FDC603"></p>
            </div> -->
      <div class="form-data">
        <el-row type="flex">
          <el-col class="el-col bg-gray" :span="9">时间</el-col>
          <el-col class="el-col bg-gray" :span="15">
            <span v-show="!editFlag">{{ formData.selectTime }}</span>
            <el-date-picker
              v-show="editFlag"
              v-model="formData.selectTime"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="el-col" :span="9">地点</el-col>
          <el-col class="el-col" :span="15">
            <span v-show="!editFlag">{{ formData.address }}</span>
            <el-input v-show="editFlag" v-model="formData.address" placeholder="请输入内容" />
          </el-col>
        </el-row>
        <el-row v-if="showAction.id != 9" type="flex">
          <el-col class="el-col bg-gray" :span="9">参加人</el-col>
          <el-col class="el-col bg-gray" :span="15">
            <span v-show="!editFlag">{{ formData.joinMan }}</span>
            <el-input v-show="editFlag" v-model="formData.joinMan" placeholder="请输入内容" />
          </el-col>
        </el-row>
        <!-- <el-row v-show="showAction.id == 7" type="flex">
          <el-col class="el-col" :span="9">被调查人</el-col>
          <el-col class="el-col" :span="15">
            <span v-show="!editFlag">{{ formData.beMan }}</span>
            <el-input v-show="editFlag" v-model="formData.beMan" placeholder="请输入内容" />
          </el-col>
        </el-row> -->
      </div>
      <div class="about">
        <p class="about-title">
          <span v-if="showAction.id == 9">人民调解委员会已将人民调解的相关规定告知各方当事人<br></span>
          {{ showAction.id == 7 ? '调查' : '调解' }}记录：
        </p>
        <div v-show="!editFlag" class="situation" style="color:#2176FE">{{ formData.briefSituation?formData.briefSituation:"请输入记录内容...." }}</div>
        <el-input
          v-show="editFlag"
          v-model="formData.briefSituation"
          class="situation"
          type="textarea"
          autosize
          placeholder="请输入内容"
        />
      </div>
      <div v-if="showAction.id == 9" class="dispute">
        <span class="dispute-title">化解结果：</span>
        <span v-show="!editFlag">{{ formData.results ? formData.results : '未选择' }}</span>
        <el-select v-show="editFlag" v-model="formData.results" placeholder="请选择化解结果">
          <el-option
            v-for="it in resultsList"
            :key="it.id"
            :label="it.name"
            :value="it.name"
          />
        </el-select>
      </div>
      <litigant v-if="showAction.id == 9" ref="litigant2" v-model="partIds" :booktype="9" title="参与人" />
      <litigant v-if="showAction.id != 9" ref="litigant1" v-model="partIds" :booktype="7" />
    </div>
  </div>
</template>

<script>
import { returnFileParams } from '@/api/dossier/dossier.js'
import litigant from './litigant'

export default {
  components: {
    litigant
  },
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      formData: {
        selectTime: '',
        address: '',
        joinMan: '',
        beMan: '',
        briefSituation: '',
        results: ''
      },
      resultsList: [
        { id: 0, name: '解纷成功' },
        { id: 1, name: '解纷不成' },
        { id: 2, name: '有待继续解纷' }
      ],
      partIds: []
    }
  },
  methods: {
    // 初始化
    init() {
      console.log(this.showAction)
      this.$refs.litigant1 && this.$refs.litigant1.getLitigantList()
      this.$refs.litigant2 && this.$refs.litigant2.getLitigantList()
      this.formData = {
        selectTime: '',
        address: '',
        joinMan: '',
        beMan: '',
        briefSituation: '',
        results: ''
      }
      this.partIds = []
      return new Promise((resolve, reject) => {
        if (this.coverData.id) {
          returnFileParams({
            mediateTableId: this.coverData.id,
            dirTypeId: this.showAction.type }
          ).then(res => {
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    },
    setForm() {

    }

  }
}
</script>

<style lang="scss" scoped>
    .form{
        padding: 12px 0;
    }
    .operation {
        position: relative;
        display: flex;
        margin-bottom: 24px;
    }
    .operation p{
        margin-right: 25px;
        width: 40px;
        height: 40px;
        border-radius: 5px;
        line-height: 40px;
        text-align: center;
        font-size: 30px;
        color: #fff;
        cursor: pointer;
    }
    .operation span {
        position: absolute;
        right: 10px;
        line-height: 40px;
        color:rgb(36,117,252);
        cursor: pointer;
    }
    .form-data {
        border-top: 1px solid rgba(221,223,225,1);
        border-left: 1px solid rgba(221,223,225,1);
    }
    .form-data .el-col{
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-right: 1px solid rgba(221,223,225,1);
        border-bottom: 1px solid rgba(221,223,225,1);
    }
    .bg-gray {
        background: rgb(250,250,252);
    }
    ::v-deep .el-col .el-input__inner {
        border: none;
    }
    ::v-deep .bg-gray .el-input__inner {
        background: rgb(250,250,252);
    }
    .about {
        margin-top: 31px;
        .about-title {
            margin-bottom: 25px;
        }
        .situation {
            padding: 20px 40px;
            line-height: 45px;
            background:rgba(250,250,250,1);
            border:1px solid rgba(240,241,242,1);
        }
        ::v-deep .situation .el-textarea__inner {
            background: rgba(250,250,250,1);
        }
    }
    .dispute{
        margin-top: 35px;
        span {
            margin-right: 19px;
        }
    }
</style>
