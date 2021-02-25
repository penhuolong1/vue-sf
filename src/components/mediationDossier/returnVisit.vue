<template>
  <div style="padding:20px">
    <div class="form">
      <!-- <div class="operation"  v-show="editFlag">
                <p class="el-icon-plus" @click="setForm('add')" style="background:#2176FE"></p>
                <p class="el-icon-minus" @click="setForm('del')" style="background:#FDC603"></p>
            </div> -->
      <div class="form-data">
        <!-- <el-row type="flex">
          <el-col class="el-col" :span="9">当事人</el-col>
          <el-col class="el-col" :span="15">
            <span v-show="!editFlag">{{ formData.people }}</span>
            <el-input v-show="editFlag" v-model="formData.people" placeholder="请输入内容" />
          </el-col>
        </el-row> -->
        <!-- <el-row type="flex">
                    <el-col class="el-col bg-gray" :span="9">解纷协议编号</el-col>
                    <el-col class="el-col bg-gray" :span="15">
                        <span v-show="!editFlag">{{formData.id}}</span>
                        <el-input v-show="editFlag" v-model="formData.id" placeholder="请输入内容"></el-input>
                    </el-col>
                </el-row> -->
        <el-row type="flex">
          <el-col class="el-col bg-gray" :span="9">回访事由</el-col>
          <el-col class="el-col bg-gray" :span="15">
            <span v-show="!editFlag">{{ formData.cause }}</span>
            <el-input v-show="editFlag" v-model="formData.cause" placeholder="请输入内容" />
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="el-col " :span="9">时间</el-col>
          <el-col class="el-col " :span="15">
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
      </div>
      <div class="about">
        <p class="about-title">
          回访情况：
        </p>
        <div v-show="!editFlag" class="situation" style="color:#2176FE">{{ formData.briefSituation?formData.briefSituation:"请输入回访情况内容...." }}</div>
        <el-input
          v-show="editFlag"
          v-model="formData.briefSituation"
          class="situation"
          type="textarea"
          autosize
          placeholder="请输入内容"
        />
      </div>
      <litigant ref="litigant" v-model="partIds" :booktype="11" />
    </div>
  </div>
</template>

<script>
import { returnFileParams } from '@/api/dossier/dossier.js'
import litigant from './litigant'

export default {
  name: 'ReturnVisit',
  components: {
    litigant
  },
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      formData: {
        selectTime: '',
        people: '',
        id: '',
        cause: '',
        briefSituation: ''
      },
      partIds: []
    }
  },
  methods: {
    // 初始化
    init() {
      this.formData = {
        selectTime: '',
        people: '',
        id: '',
        cause: '',
        briefSituation: ''
      }
      this.partIds = []
      this.$refs.litigant && this.$refs.litigant.getLitigantList()
      return new Promise((resolve, reject) => {
        if (this.coverData.id) {
          returnFileParams({
            mediateTableId: this.coverData.id,
            dirTypeId: this.showAction.type }
          ).then(res => {
            if (res.state == 100) {

            }
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
