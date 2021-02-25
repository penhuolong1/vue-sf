<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="案件来源" prop="caseSource">
          <el-select
            v-model="form.caseSource"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in caseSourceData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="案件类型" prop="applyType">
          <el-select
            v-model="form.applyType"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in typeArr"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="是否分流" prop="flowStatus">
          <el-select
            v-model="form.flowStatus"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in flowAry"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="登记号" prop="dCaseNo">
          {{ form.dCaseNo }}
          <el-button v-if="!lawCaseId1" type="primary" @click="getCaseLoginNo">重新获取</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-if="form.flowStatus != 1" :span="12">
        <el-form-item label="分流中心" prop="centerCourtId">
          <el-select
            v-model="form.centerCourtId"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in mediaterData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请日期" prop="registerDate">
          <el-date-picker
            v-model="form.registerDate"
            type="datetime"
            placeholder="选择申请日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="受理日期" prop="acceptanceTime">
          <el-date-picker
            v-model="form.acceptanceTime"
            type="datetime"
            placeholder="选择受理日期"
            style="width: 100%"
            @change="selectedAcceptanceTime"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="解纷期限">
          <span>{{ form.mediateTerm }}</span>
        </el-form-item>
      </el-col>
    </el-row> -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="纠纷事由" prop="briefId">
          <!-- <el-select
            v-model="form.briefId"
            placeholder="请选择"
            style="width: 100%"
            @change="selectBrief"
          >
            <el-option
              v-for="items in briefData"
              :key="items.id"
              :label="items.name"
              :value="items.id"
            />
          </el-select> -->
          <!-- <el-cascader v-model="form.briefId" :options="briefData" :props="props" filterable clearable stype="width: 100%;" /> -->
          <brief v-model="form.briefId" :name="briefName" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="纠纷金额(元)" prop="applyStandard">
          <el-input v-model="form.applyStandard" type="number" placeholder="纠纷金额(不涉及填0)" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="原案号">
          <el-input v-model="form.caseNo" type="text" placeholder="请输入原案号" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="受理单位" prop="registerCourtId">
          <el-select
            v-model="form.registerCourtId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in mediaterData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row> -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="请求事项" prop="mediateRequest">
          <el-input
            v-model="form.mediateRequest"
            type="textarea"
            :rows="7"
            placeholder="请输入请求事项"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="事实与理由" prop="reason">
          <el-input
            v-model="form.reason"
            type="textarea"
            :rows="7"
            placeholder="请输入事实与理由"
            style="width: 100%;"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <div style="text-align: right;">
      <el-button @click="cancel">返回</el-button>
      <el-button :loading="loading" type="primary" @click="next">下一步</el-button>
    </div>
  </el-form>
</template>

<script>
import { updateCase, caseNo, detailCase, briefTree } from '@/api/case/index.js'
import { CASETYPE } from '@/utils/constVal.js'
import { getMediater1 } from '@/api/common/common.js'
import { monthDay } from '@/utils/tools.js'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'
import brief from '@/components/brief/index.vue'
export default {
  name: 'Step1',
  components: {
    brief
  },
  data() {
    return {
      loading: false,
      form: {
      },
      props: {
        value: 'id',
        label: 'label',
        checkStrictly: true
      },
      caseSourceData: [
        // 案件来源
        {
          value: '单位登记',
          label: '单位登记'
        },
        {
          value: '当事人申请',
          label: '当事人申请'
        }
      ],
      briefData: [], // 案由
      registerCourt: '', // 受理单位
      typeArr: [
      ],
      isflow: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      brief: [],
      mediaterData: [], // 解纷机构数据
      getCourt: {
        // 获取机构信息
        1: (() => {
          // 当登陆角色为解纷机构的时候
          return this.$store.state.user.userInfo
        })(),
        2: (() => {
          // 角色为解纷员的时候
          console.log('解纷员不能添加')
        })()
      },
      rules: {
        caseSource: [
          { required: true, message: '请选择案件来源', trigger: 'change' }
        ],
        applyType: [
          { required: true, message: '请选择案件类型', trigger: 'change' }
        ],
        flowStatus: [
          { required: true, message: '请选择是否分流', trigger: 'change' }
        ],
        centerCourtId: [
          { required: true, message: '请选择分流中心', trigger: 'change' }
        ],
        flowCourtId: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        registerDate: [
          { required: true, message: '请选择申请日期', trigger: 'blur' }
        ],
        briefId: [
          { required: true, message: '请选择纠纷事由', trigger: 'change' }
        ],
        registerCourtId: [
          { required: true, message: '请选择受理单位', trigger: 'change' }
        ],
        applyStandard: [
          { required: true, message: '请输入纠纷金额(元)', trigger: 'change' }
        ],
        mediateRequest: [
          { required: true, message: '请输入请求事项', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请输入事实与理由', trigger: 'blur' }
        ]
      },
      lawCaseId1: '',
      flowData: [],
      briefName: ''
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    flowAry() {
      let ary = [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ]
      if (this.getUserInfo.courtName.indexOf('诉非联动中心') != -1 && this.getUserInfo.courtType === 0) { // 如果是联动中心不能选否
        ary = [{
          id: 0,
          name: '是'
        }]
      }
      return ary
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.getMediater()
    this.getCaseLoginNo()
    this.getTypeArr()
    this.lawCaseId1 = ''
    const lawCaseId = this.$store.getters.getLawCaseId || window.localStorage.getItem('lawCaseId')
    if (!lawCaseId) {
      return
    }
    this.lawCaseId1 = lawCaseId
    this.detailCase(lawCaseId)
  },
  methods: {
    // 获取案件类型
    getTypeArr() {
      this.typeArr = []
      for (const key in CASETYPE) {
        this.typeArr.push({ id: CASETYPE[key], value: CASETYPE[key] })
      }
    },
    // 获取解纷机构
    getMediater() {
      // getMediater({ pageSize: 1000 }).then(res => {
      //   this.mediaterData = JSON.parse(JSON.stringify(res.content))
      // })
      // const courtInfo = this.getCourt[this.$store.state.user.userRole]
      const params = {
        type: 1,
        pageSize: 1000,
        courtType: 0,
        courtId: this.getUserInfo.courtUid
      }
      getMediater1(params).then(res => {
        this.mediaterData = JSON.parse(JSON.stringify(res.content))
      })
    },
    // 获取案由
    getBrief() {
      briefTree().then(res => {
        this.briefData = res.data
      })
    },
    // 获取登字号和解纷号
    getCaseLoginNo() {
      // 获取登字号
      caseNo({ type: 1 }).then(res => {
        if (res.state == 100) {
          this.$set(this.form, 'dCaseNo', res.data)
        }
      })
    },
    /**
     * 获取解纷期限 受理时间的基础上加一个月
     */
    getMediateTerm() {
      if (!this.form.acceptanceTime) {
        this.$set(this.form, 'mediateTerm', '')
        return
      }
      const days = monthDay()
      const acceptanceTimeStr = new Date(this.form.acceptanceTime).getTime()
      const mediateTermStr = acceptanceTimeStr + days * 86400000
      this.$set(this.form, 'mediateTerm', formatDate(new Date(mediateTermStr).getTime()))
    },
    /**
     * 选择受理时间后触发
     */
    selectedAcceptanceTime() {
      this.getMediateTerm()
    },
    next() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.form)
          if (this.form.registerDate) {
            this.form.registerDate = formatDate(
              new Date(this.form.registerDate).getTime()
            )
          }
          const params = {
            ...this.form
          }
          if (params.flowStatus == 1) {
            params.flowCourtId = this.getUserInfo.courtUid
            params.centerCourtId = ''
          } else {
            params.flowCourtId = ''
          }
          this.loading = true
          updateCase(params).then(res => {
            console.log(res)
            if (res.state === 100) {
              this.$message.success(res.message)
              this.$router.push({ name: 'step3' })
              this.$store.commit('SET_CASEID', res.caseId)
              window.localStorage.setItem('lawCaseId', res.caseId)
              this.$emit('update:step', 1)
            } else {
              this.loading = false
            }
          })
        }
      })
    },
    // 获取案件详情
    detailCase(id) {
      detailCase({ lawCaseId: id }).then(res => {
        const data = res.lawCase
        if (res.state === 100) {
          this.form = {
            caseId: id,
            caseSource: data.caseSource,
            applyType: data.applyType,
            flowStatus: data.flowStatus,
            dCaseNo: data.dCaseNo,
            registerDate: formatDate(data.registerDate),
            // acceptanceTime: formatDate(data.acceptanceDate),
            applyStandard: data.applyStandard,
            // mediateTerm: formatDate(data.mediateTerm),
            briefId: data.brief ? data.brief.id : '',
            registerCourtId: data.registerCourt
              ? data.registerCourt.id
              : '', // 审核/登记机构id
            mediateRequest: data.mediateRequest,
            reason: data.reason,
            flowCourtId: data.flowCourt ? data.flowCourt.id : '',
            centerCourtId: data.centerCourt ? data.centerCourt.id : '',
            caseNo: data.caseNo
          }
          this.briefName = data.brief.name
          this.$store.commit('SET_BRIEF', data.brief ? data.brief.name : '')
          window.localStorage.setItem('brief', data.brief ? data.brief.name : '')
        }
      })
    },
    // 返回
    cancel() {
      this.$router.push('/home')
    },
    // 选择案由
    selectBrief(e) {
      const item = this.briefData.find(item => item.id == e)
      this.$store.commit('SET_BRIEF', item.name)
      window.localStorage.setItem('brief', item.name)
    }
  }
}
</script>

<style scoped lang = "scss">
  $borderColor:#409EFF;
  .isSelect {
    background: $borderColor;
    border-color: $borderColor;
    color: #FFF;
  }
</style>
