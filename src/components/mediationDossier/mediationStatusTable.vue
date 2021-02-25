<template>
  <!-- 撤销申请书 -->
  <div style="padding:20px">
    <div class="about">
      <p class="about-title">调解过程摘要</p>
      <div v-for="(item, index) in processInfo" :key="index" class="situation form-item">
        <div class="form-item-left">
          <el-input
            v-model="item.text"
            autosize
            placeholder="请输入内容"
          />
        </div>
        <div class="form-item-right">
          <el-button size="mini" icon="el-icon-minus" circle @click="delProcessInfo(index)" />
          <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="addProcessInfo" />
        </div>
      </div>
    </div>
    <div class="about">
      <p class="about-title">终止的原因</p>
      <el-select v-model="stopReason" multiple class="situation" style="width: 100%;" placeholder="请选择">
        <el-option
          v-for="item in selectData"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-if="stopReason.indexOf(7) !== -1" class="about">
      <p class="about-title">其他</p>
      <div class="situation">
        <el-input
          v-model="other"
          type="textarea"
          autosize
          placeholder="请输入内容"
          maxlength="50"
          show-word-limit
        />
      </div>
    </div>
    <div class="about">
      <p class="about-title">繁简分流建议</p>
      <el-select v-model="simple" class="situation" style="width: 100%;" placeholder="请选择">
        <el-option
          v-for="item in selectData1"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="about">
      <p class="about-title">争议焦点</p>
      <div class="situation">
        <el-input
          v-model="focus"
          type="textarea"
          autosize
          placeholder="请输入内容"
          maxlength="50"
          show-word-limit
        />
      </div>
    </div>
    <div class="about">
      <p class="about-title">备注</p>
      <div class="situation">
        <el-input
          v-model="remark"
          type="textarea"
          autosize
          placeholder="请输入内容"
          maxlength="50"
          show-word-limit
        />
      </div>
    </div>
    <div class="about">
      <p class="about-title">接收调解时间</p>
      <div class="situation">
        <el-date-picker
          v-model="startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择接收调解时间"
        />
      </div>
    </div>
    <div class="about">
      <p class="about-title">调解终止时间</p>
      <div class="situation">
        <el-date-picker
          v-model="endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择调解终止时间"
        />
      </div>
    </div>
    <!-- <litigant ref="litigant" v-model="partIds" /> -->
  </div>
</template>

<script>
import {
//   getLitigantInfo,
  addLitigant,
  addCompanyLit,
  editLitigant,
  editCompanyLit,
  deleteLitigant,
  addOrUpdateLawyer,
  delLawyer,
  returnFileParams
} from '@/api/dossier/dossier.js'
import appliationForm from '@/components/mediationDossier/appliationForm'// 申请人
import litigant from './litigant'

export default {
  name: 'Application',
  components: {
    appliationForm,
    litigant
  },
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      selectData: [
        {
          value: 1,
          label: '期限届满无法达成调解协议'
        },
        {
          value: 2,
          label: '一方当事人撤回调解申请或明确表示不接受调解'
        },
        {
          value: 3,
          label: '双方分歧较大且难以达成调解协议'
        },
        {
          value: 4,
          label: '当事人可能存在恶意串通、损害公共利益或者第三人合法权益的情况'
        },
        {
          value: 5,
          label: '当事人隐瞒重要事实、提供虚假情况、故意拖延时间'
        },
        {
          value: 6,
          label: '被告方无法联系'
        },
        {
          value: 7,
          label: '其他'
        }
      ],
      selectData1: [
        {
          value: 1,
          label: '繁案'
        },
        {
          value: 2,
          label: '简案'
        }
      ],
      processInfo: [
        { text: '' }
      ],
      stopReason: [],
      focus: '',
      remark: '',
      simple: '',
      other: '',
      startTime: '',
      endTime: '',
      partIds: []
    }
  },
  computed: {
    form() {
      const params = {
      }
      params.processInfo = this.processInfo.map(item => {
        return item.text
      })
      params.stopReason = this.stopReason.filter(item => {
        return item != 7
      }).map(item => {
        return this.selectData.find(item1 => {
          return item1.value == item
        }).label
      })
      if (this.stopReason.indexOf(7) != -1) {
        params.stopReason.push(this.other)
      }
      if (this.simple == 1) {
        params.simple = false
      } else if (this.simple == 2) {
        params.simple = true
      } else {
        params.simple = null
      }
      params.focus = this.focus
      params.remark = this.remark
      params.startTime = this.startTime
      params.endTime = this.endTime
      // params.partIds = this.partIds
      return params
    }
  },
  methods: {
    reset() {
      this.causes = []
      this.other = ''
    },
    // 添加案件进程
    addProcessInfo() {
      this.processInfo.push({
        text: ''
      })
    },
    // 删除案件进程
    delProcessInfo(index) {
      if (this.processInfo.length == 1) {
        this.$message.error('至少保留一条案件过程')
        return
      }
      this.processInfo.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>

    .about {
        margin-top: 31px;
        .about-title {
            margin-bottom: 25px;
        }
        .situation {
            padding: 20px 40px;
            background:rgba(250,250,250,1);
            border:1px solid rgba(240,241,242,1);
        }
        ::v-deep .situation .el-textarea__inner {
            background: rgba(250,250,250,1);
        }
    }
    .form-item {
      .form-item-left {
        flex: 1;
      }
      .form-item-right {
        width: 100px;
        padding-left: 10px;
      }
    }

</style>
