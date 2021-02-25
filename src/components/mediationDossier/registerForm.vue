// 登记表
<template>
  <div style="padding:20px">
    <!-- <div class="dispute">
            <span class="dispute-title">日期</span>
            <span v-show="!editFlag">{{selectTime ? selectTime : '未选择'}}</span>
            <el-date-picker
                    v-show="editFlag"
                    v-model="selectTime"
                    value-format='yyyy-MM-dd'
                    type="date"
                    placeholder="选择日期">
            </el-date-picker>
        </div> -->
    <!-- <div class="about">
            <div class="situation">
                人民解纷委员会依当事人申请（人民解纷委员会主动解纷），经当事人同意,解纷
                <span v-show="!editFlag" style="color:blue">{{mediator ? mediator : 'XXX、XXX'}}</span>
                <el-input v-show="editFlag" style="width:150px;height:30px" placeholder="XXX、XXX" size="small" v-model="mediator" clearable></el-input>
                之间的纠纷。
            </div>
            <div class="situation" v-show="!editFlag">{{mediator}}</div>
            <el-input
                class="situation"
                v-show="editFlag"
                type="textarea"
                autosize
                placeholder="人民解纷委员会依当事人申请（人民解纷委员会主动解纷）..."
                v-model="mediator">
            </el-input>
        </div> -->
    <!-- <div class="dispute">
            <span class="dispute-title">纠纷类型</span>
            <span v-show="!editFlag">{{disputeType ? dossierTypeAry[disputeType].name : '未选择'}}</span>
            <el-select v-show="editFlag" v-model="disputeType" placeholder="请选择纠纷类型">
                <el-option
                        v-for="(item,index) in dossierTypeAry"
                        :key="index"
                        :label="item.name"
                        :value="index">
                </el-option>
            </el-select>
        </div> -->
    <!-- <div class="dispute">
            <span class="dispute-title">本案来源</span>
            <span v-show="!editFlag">{{source ? source : '未选择'}}</span>
            <el-select  v-show="editFlag" v-model="source" placeholder="请选择本案来源">
                <el-option
                        v-for="item in sourceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                </el-option>
            </el-select>
        </div> -->
    <!-- <div class="dispute">
            <p style="margin-bottom:25px">本案来源</p>
            <div>
                <el-button style="margin-right:35px" type="primary" plain>当事人申请</el-button>
                <el-button type="primary">人民解纷委员会</el-button>
            </div>
        </div> -->
    <div class="about">
      <p class="about-title">纠纷简要情况：</p>
      <div v-show="!editFlag" class="situation">{{ briefSituation }}</div>
      <el-input
        v-show="editFlag"
        v-model="briefSituation"
        class="situation"
        type="textarea"
        autosize
        placeholder="请输入内容"
      />
    </div>
    <litigant v-model="partIds" :booktype="4" />
  </div>
</template>

<script>
import { returnFileParams } from '@/api/dossier/dossier.js'
import litigant from './litigant'

export default {
  name: 'RegisterForm',
  components: {
    litigant
  },
  props: ['showAction', 'editFlag', 'coverData'],
  data() {
    return {
      mediator: '',
      selectTime: '', // 时间
      disputeType: '',
      source: '',
      briefSituation: '', // 纠纷简要情况
      sourceList: [
        { id: 1, name: '当事人申请' },
        { id: 2, name: '人民解纷委员会主动解纷' }
      ],
      partIds: []
    }
  },
  computed: {
    dossierTypeAry() {
      return this.$store.getters.getBriefList
    }
  },
  methods: {
    // 初始化
    init() {
      this.mediator = ''
      this.selectTime = ''// 时间
      this.disputeType = ''
      this.source = ''
      this.briefSituation = ''// 纠纷简要情况
      this.partIds = []
      return new Promise((resolve, reject) => {
        if (this.coverData.id) {
          returnFileParams({
            mediateTableId: this.coverData.id,
            dirTypeId: this.showAction.type }
          ).then(res => {
            if (res.state == 100) {
              this.briefSituation = res.reason
            }
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .tip {
        text-align: right;
        color: rgb(32,112,249);
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
        ::v-deep .situation .el-textarea__inner,
        ::v-deep .el-input__inner {
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
