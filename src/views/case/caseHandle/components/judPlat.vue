<template>
  <!-- 同步司法行政平台 -->
  <el-form ref="form" :model="form" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="24">
        <el-form-item label="调解方式" prop="state">
          <el-radio v-if="state" v-model="form.state" :label="true">书面调解</el-radio>
          <el-radio v-model="form.state" :label="false">口头调解</el-radio>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="司法行政平台账号" prop="appUser">
          <el-input v-model="form.appUser" style="width: 100%;" placeholder="请输入司法行政平台账号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="司法行政平台密码" prop="appPsw">
          <el-input v-model="form.appPsw" type="password" style="width: 100%;" placeholder="请输入司法行政平台密码" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="受理日期" prop="djrq">
          <el-date-picker
            v-model="form.djrq"
            style="width: 100%;"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            placeholder="请选择受理日期"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="form.state" :span="12">
        <el-form-item label="登记人" prop="djr">
          <el-input v-model="form.djr" style="width: 100%;" placeholder="请输入登记人" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="案号" prop="ah">
          <el-input v-model="form.ah" style="width: 100%;" placeholder="请输入案号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="纠纷类别" prop="jflx">
          <el-select v-model="form.jflx" filterable style="width: 100%;" placeholder="请选择纠纷类别">
            <el-option
              v-for="item in jflx"
              :key="item.pro1"
              :label="item.pro2"
              :value="item.pro1"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="调委会" prop="twh">
          <el-select v-model="form.twh" filterable style="width: 100%;" placeholder="请选择调委会">
            <el-option
              v-for="item in twh"
              :key="item.pro1"
              :label="item.pro2"
              :value="item.pro1"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调解员信息" prop="tjyxx">
          <el-cascader
            v-model="form.tjyxx"
            placeholder="请选择调解员"
            style="width: 100%;"
            :props="tjyprops"
            :options="tjy"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.state">
      <el-col :span="12">
        <el-form-item label="案件来源" prop="ajly">
          <el-select v-model="form.ajly" filterable style="width: 100%;" placeholder="请选择案件来源">
            <el-option
              v-for="item in ajly"
              :key="item.pro1"
              :label="item.pro2"
              :value="item.pro1"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="案件难度级别" prop="ndjb">
          <el-select v-model="form.ndjb" filterable style="width: 100%;" placeholder="请选择难度级别">
            <el-option
              v-for="item in ndjb"
              :key="item.pro1"
              :label="item.pro2"
              :value="item.pro1"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="奖励金额" prop="jlje">
          <el-input v-model="form.jlje" type="number" style="width: 100%;" placeholder="请输入奖励金额" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调解结果" prop="tjjg">
          <el-select v-model="form.tjjg" filterable style="width: 100%;" placeholder="请选择调解结果">
            <el-option
              v-for="item in tjjg"
              :key="item.pro1"
              :label="item.pro2"
              :value="item.pro1"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="纠纷简要情况" prop="jfjyqk">
          <el-input v-model="form.jfjyqk" type="textarea" style="width: 100%;" placeholder="请输入纠纷简要情况" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="!form.state">
      <el-col :span="24">
        <el-form-item label="调解地点" prop="tjdd">
          <el-input v-model="form.tjdd" style="width: 100%;" placeholder="请输入调解地点" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.state">
      <el-col :span="12">
        <el-form-item label="协议日期" prop="xysj">
          <el-date-picker
            v-model="form.xysj"
            style="width: 100%;"
            type="date"
            value-format="yyyy/MM/dd"
            placeholder="请选择协议日期"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="记录人" prop="jlr">
          <el-input v-model="form.jlr" style="width: 100%;" placeholder="请输入记录人" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.state">
      <el-col :span="12">
        <el-form-item label="协议编号" prop="xybh">
          <el-input v-model="form.xybh" style="width: 100%;" placeholder="请输入协议编号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="履行期限" prop="lxsj">
          <el-date-picker
            v-model="form.lxsj"
            style="width: 100%;"
            type="date"
            value-format="yyyy/MM/dd"
            placeholder="请选择履行期限"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.state">
      <el-col :span="12">
        <el-form-item label="履行方式" prop="lxfs">
          <el-select v-model="form.lxfs" filterable style="width: 100%;" placeholder="请选择履行方式">
            <el-option
              v-for="item in lxfs"
              :key="item.pro1"
              :label="item.pro2"
              :value="item.pro1"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="涉案金额" prop="saje">
          <el-input v-model="form.saje" type="number" style="width: 100%;" placeholder="请输入涉案金额" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.state">
      <el-col :span="24">
        <el-form-item label="履行地点" prop="lxdd">
          <el-input v-model="form.lxdd" style="width: 100%;" placeholder="请输入履行地点" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="form.state">
      <el-col :span="24">
        <el-form-item label="协议内容" prop="xynr">
          <el-input v-model="form.xynr" type="textarea" style="width: 100%;" placeholder="请输入协议内容" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="申请人">
          <el-button type="primary" size="mini" @click="add(1)">添加申请人</el-button>
          <el-table
            :data="sqr"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              prop="dsrlx"
              label="类型"
            >
              <template slot-scope="scope">
                {{ scope.row.dsrlx | filterlx(dsrlx) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dsrxm"
              label="姓名"
            />
            <el-table-column
              prop="dh"
              label="电话"
            />
            <el-table-column
              label="证件类型"
            >
              <template slot-scope="scope">
                {{ scope.row.zjlx | filterlx(zjlx) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="zjhm"
              label="证件号码"
            />
            <el-table-column
              prop=""
              label="操作"
            >
              <template slot-scope="scope">
                <a @click="update(scope.row, 1)">修改</a>
                <a class="table-click" @click="del(scope.row, 1)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="被申请人">
          <el-button type="primary" size="mini" @click="add(2)">添加被申请人</el-button>
          <el-table
            :data="bsqr"
            border
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              prop="dsrlx"
              label="类型"
            >
              <template slot-scope="scope">
                {{ scope.row.dsrlx | filterlx(dsrlx) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dsrxm"
              label="姓名"
            />
            <el-table-column
              prop="dh"
              label="电话"
            />
            <el-table-column
              label="证件类型"
            >
              <template slot-scope="scope">
                {{ scope.row.zjlx | filterlx(zjlx) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="zjhm"
              label="证件号码"
            />
            <el-table-column
              prop=""
              label="操作"
            >
              <template slot-scope="scope">
                <a @click="update(scope.row, 2)">修改</a>
                <a class="table-click" @click="del(scope.row, 2)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-row>
    <litigant ref="litigant" :mz="mz" :dsrlx="dsrlx" :zjlx="zjlx" :xb="xb" @done="done" />
  </el-form>
</template>

<script>
import litigant from './litigant'
import { sfInfo } from '@/api/case/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    litigant
  },
  filters: {
    // 翻译类型
    filterlx: (val, lx) => {
      if (!val) {
        return ''
      }
      return lx.find(item => item.pro1 == val).pro2
    }
  },
  props: {

  },
  data() {
    return {
      state: null,
      form: {},
      rules: {
        djrq: [
          { required: true, message: '请选择受理日期', trigger: 'change' }
        ],
        djr: [
          { required: true, message: '请输入登记人', trigger: 'blur' }
        ],
        ah: [
          { required: true, message: '请输入案号', trigger: 'blur' }
        ],
        jflx: [
          { required: true, message: '请选择纠纷类别', trigger: 'change' }
        ],
        twh: [
          { required: true, message: '请选择调委会', trigger: 'change' }
        ],
        tjyxx: [
          { required: true, message: '请选择调解员', trigger: 'change' }
        ],
        ajly: [
          { required: true, message: '请选择案件来源', trigger: 'change' }
        ],
        ndjb: [
          { required: true, message: '请选择难度级别', trigger: 'change' }
        ],
        jlje: [
          { required: true, message: '请输入奖励金额', trigger: 'blur' }
        ],
        tjjg: [
          { required: true, message: '请选择调解结果', trigger: 'change' }
        ],
        jfjyqk: [
          { required: true, message: '请输入纠纷简要情况', trigger: 'blur' }
        ],
        tjdd: [
          { required: true, message: '请输入调解地点', trigger: 'blur' }
        ],
        xysj: [
          { required: true, message: '请选择协议日期', trigger: 'change' }
        ],
        jlr: [
          { required: true, message: '请输入记录人', trigger: 'blur' }
        ],
        xybh: [
          { required: true, message: '请输入协议编号', trigger: 'blur' }
        ],
        lxsj: [
          { required: true, message: '请输入履行期限', trigger: 'blur' }
        ],
        lxfs: [
          { required: true, message: '请选择履行方式', trigger: 'change' }
        ],
        saje: [
          { required: true, message: '请输入涉案金额', trigger: 'blur' }
        ],
        lxdd: [
          { required: true, message: '请输入履行地点', trigger: 'blur' }
        ],
        xynr: [
          { required: true, message: '请输入协议内容', trigger: 'blur' }
        ],
        appUser: [
          { required: true, message: '请输入司法行政平台账号', trigger: 'blur' }
        ],
        appPsw: [
          { required: true, message: '请输入司法行政平台密码', trigger: 'blur' }
        ]
      },
      twh: [], // 调委会数据
      tjy: [], // 调解员数据
      tjyprops: { // 调解员级联器配置
        value: 'pro1',
        label: 'pro2',
        children: 'second'
      },
      jflx: [], // 解纷类别
      ndjb: [], // 难度级别
      ajly: [], // 案件来源
      lxfs: [], // 履行方式
      zjlx: [], // 证件类型
      xb: [], // 性别
      mz: [], // 名族
      dsrlx: [], // 申请人类型
      sqr: [], // 申请人
      bsqr: [], // 被申请人
      tjjg: [
        {
          pro1: true,
          pro2: '调解成功'
        },
        {
          pro1: false,
          pro2: '调解失败'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo']),
    params() {
      const sqr = this.sqr && this.sqr.length > 0 ? this.sqr.map(item => {
        const obj = {
          ...item,
          type: '1'
        }
        if (obj.dsrlx != '8a4f832c5d3f24d3015d3fce1014007e') { // 假如类型不是自然人
          delete obj.xb
          delete obj.mz
          delete obj.nl
          delete obj.zy
        }
        delete obj.index
        return obj
      }) : []
      const bsqr = this.bsqr && this.bsqr.length > 0 ? this.bsqr.map(item => {
        const obj = {
          ...item,
          type: '2'
        }
        delete obj.index
        return obj
      }) : []
      const tjyxx = { [this.form.tjyxx[0]]: {
        [this.form.tjyxx[1]]: {
          [this.form.tjyxx[2]]: this.form.tjyxx[3]
        }
      }}
      const form = {
        caseId: this.getCaseInfo.id,
        appUser: this.form.appUser,
        appPsw: this.form.appPsw,
        sfxz: {
          state: this.form.state,
          djrq: this.form.djrq,
          djr: this.form.djr,
          ah: this.form.ah,
          jflx: this.form.jflx,
          ajly: this.form.ajly,
          twh: this.form.twh,
          tjyxx: tjyxx,
          ajndjb: this.form.ndjb,
          jlje: this.form.jlje,
          jfjyqk: this.form.jfjyqk,
          tjdd: this.form.tjdd,
          tjjg: this.form.tjjg,
          xys: {
            xysj: this.form.xysj,
            jlr: this.form.jlr,
            xybh: this.form.xybh,
            lxsj: this.form.lxsj,
            lxfs: this.form.lxfs,
            saje: `${this.form.saje}`,
            lxdd: this.form.lxdd,
            xynr: this.form.xynr
          },
          litigants: [...sqr, ...bsqr]
        }
      }
      return form
    }
  },
  created() {
    this.getsfInfo()
  },
  mounted() {

  },
  methods: {
    getsfInfo() {
      sfInfo({ caseId: this.getCaseInfo.id }).then(({ state, data }) => {
        if (state == 100) {
          this.twh = data.twh
          this.tjy = data.tjy
          this.jflx = data.jflx
          this.ndjb = data.ndjb
          this.ajly = data.ajly
          this.lxfs = data.lxfs
          this.zjlx = data.zjlx
          this.xb = data.xb
          this.mz = data.mz
          this.dsrlx = data.dsrlx
          this.form = {
            djrq: data.djrq,
            djr: data.djr,
            state: data.state,
            ah: data.ah,
            jfjyqk: data.jfjyqk,
            tjdd: data.tjdd,
            xybh: data.ah,
            saje: data.saje,
            xynr: data.xynr
          }
          this.state = data.state
          this.sqr = data.sqr && data.sqr.length > 0 ? data.sqr.map((item, index) => {
            return {
              ...item,
              index
            }
          }) : []
          this.bsqr = data.bsqr && data.bsqr.length > 0 ? data.bsqr.map((item, index) => {
            return {
              ...item,
              index
            }
          }) : []
        }
      })
    },
    add(type) {
      this.$refs.litigant.show({}, type)
    },
    del(obj, type) {
      this.$confirm('是否删除该当事人?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(res => {
        if (type == 1) {
          this.sqr.splice(obj.index, 1)
        } else {
          this.bsqr.splice(obj.index, 2)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    update(obj, type) {
      this.$refs.litigant.show(obj, type)
      console.log(obj)
    },
    // 添加当事人成功
    done(form, type) {
      const params = { ...form }
      if (!form.index && form.index !== 0) {
        if (type == 1) {
          params.index = this.sqr.length
          this.sqr.push(params)
        } else {
          params.index = this.bsqr.length
          this.bsqr.push(params)
        }
      } else {
        if (type == 1) {
          this.sqr[form.index] = form
        } else {
          this.bsqr[form.index] = form
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.table-click {
  margin-left: 10px;
}
</style>
