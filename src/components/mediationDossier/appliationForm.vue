<template>
  <div class="form">
    <div v-show="editFlag && !noneBtn" class="operation">
      <p class="el-icon-plus" style="background:#2176FE" @click="setForm('add')" />
      <p class="el-icon-minus" style="background:#FDC603" @click="setForm('del')" />
      <p v-show="noSave" class="el-icon-upload" style="background:#39b54a" @click="save()" />
      <span v-show="isAddAgent" class="add" @click="addAgent">
        +添加代理人信息
      </span>
    </div>
    <div class="form-data">
      <el-row v-if="isAddAgent" type="flex">
        <el-col class="el-col" :span="6">
          {{ typeName }}类型
        </el-col>
        <el-col class="el-col" :span="18">
          <span v-show="!editFlag">{{ identity }}</span>
          <el-select v-show="editFlag" v-model="formData.type" style="width:100%" placeholder="选择类型">
            <el-option
              v-for="(it,inx) in identityList"
              :key="inx"
              :label="it.name"
              :value="it.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row v-if="identity != '法人'" type="flex">
        <el-col class="el-col bg-gray" :span="6">
          <!-- {{typeName}} -->
          姓名
        </el-col>
        <el-col class="el-col" :span="6">
          <span v-show="!editFlag">{{ formData.litigantName }}</span>
          <el-input v-show="editFlag" v-model="formData.litigantName" placeholder="请输入内容" />
        </el-col>
        <el-col class="el-col bg-gray" :span="6">民族</el-col>
        <el-col class="el-col" :span="6">
          <span v-show="!editFlag">{{ formData.nation }}</span>
          <el-input v-show="editFlag" v-model="formData.nation" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row v-if="identity != '法人'" type="flex">
        <el-col class="el-col bg-gray" :span="6">性别</el-col>
        <el-col class="el-col" :span="6">
          <span v-show="!editFlag">{{ sex }}</span>
          <el-select v-show="editFlag" v-model="formData.sex" placeholder="选择性别">
            <el-option
              v-for="(it,inx) in sexList"
              :key="inx"
              :label="it.name"
              :value="it.id"
            />
          </el-select>
        </el-col>
        <el-col class="el-col bg-gray" :span="6">年龄</el-col>
        <el-col class="el-col" :span="6">
          <span v-show="!editFlag">{{ formData.years }}</span>
          <el-input v-show="editFlag" v-model="formData.years" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row v-if="identity == '法人'" type="flex">
        <el-col class="el-col  bg-gray" :span="9">姓名</el-col>
        <el-col class="el-col  bg-gray" :span="15">
          <span v-show="!editFlag">{{ formData.legalManName }}</span>
          <el-input v-show="editFlag" v-model="formData.legalManName" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row v-if="identity == '法人'" type="flex">
        <el-col class="el-col" :span="9">统一社会信用代码</el-col>
        <el-col class="el-col" :span="15">
          <span v-show="!editFlag">{{ formData.legalManId }}</span>
          <el-input v-show="editFlag" v-model="formData.legalManId" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row v-if="identity == '法人'" type="flex">
        <el-col class="el-col  bg-gray" :span="9">企业名称</el-col>
        <el-col class="el-col  bg-gray" :span="15">
          <span v-show="!editFlag">{{ formData.litigantName }}</span>
          <el-input v-show="editFlag" v-model="formData.litigantName" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="el-col" :span="9">证件号码</el-col>
        <el-col class="el-col" :span="15">
          <span v-show="!editFlag">{{ formData.identityCard }}</span>
          <el-input v-show="editFlag" v-model="formData.identityCard" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row v-if="identity == '法人'" type="flex">
        <el-col class="el-col bg-gray" :span="9">联系号码</el-col>
        <el-col class="el-col bg-gray" :span="15">
          <span v-show="!editFlag">{{ formData.legalManPhone }}</span>
          <el-input v-show="editFlag" v-model="formData.legalManPhone" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row v-if="identity != '法人'" type="flex">
        <el-col class="el-col bg-gray" :span="9">联系号码</el-col>
        <el-col class="el-col bg-gray" :span="15">
          <span v-show="!editFlag">{{ formData.phone }}</span>
          <el-input v-show="editFlag" v-model="formData.phone" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="el-col" :span="9">联系地址</el-col>
        <el-col class="el-col" :span="15">
          <span v-show="!editFlag">{{ formData.address }}</span>
          <el-input v-show="editFlag" v-model="formData.address" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row v-if="identity != '法人'" type="flex">
        <el-col class="el-col bg-gray" :span="9">职业或职务</el-col>
        <el-col class="el-col bg-gray" :span="15">
          <span v-show="!editFlag">{{ formData.employer }}</span>
          <el-input v-show="editFlag" v-model="formData.employer" placeholder="请输入内容" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppliationForm',
  props: ['formData', 'type', 'index', 'inx', 'editFlag', 'noneBtn', 'noSave'],
  data() {
    return {
      sexList: [
        { id: 0, name: '男' },
        { id: 1, name: '女' }
      ],
      identityList: [
        { id: 0, name: '自然人' },
        { id: 1, name: '法人' }
      ]
    }
  },
  computed: {
    // 显示添加代理人
    isAddAgent() {
      let flag = false
      const ary = ['applicantInfo', 'respondentInfo', 'litigant']
      if (ary.indexOf(this.type) != -1) flag = true
      return flag
    },
    // 头部名称
    typeName() {
      let name = ''
      switch (this.type) {
        case 'applicantInfo':
          name = '申请人'
          break
        case 'applicantInfoLawyer':
          name = '代理人'
          break
        case 'respondentInfo':
          name = '被申请人'
          break
        case 'respondentInfoLawyer':
          name = '被代理人'
          break
        case 'litigant':
          name = '当事人'
          break

        default:
          break
      }
      return name
    },
    // 性别
    sex() {
      let sex = ''
      switch (this.formData.sex) {
        case 0:
        case '0':
          sex = '男'
          break
        case 1:
        case '1':
          sex = '女'
          break

        default:
          break
      }
      return sex
    },
    // 身份
    identity() {
      let identity = ''
      switch (this.formData.type) {
        case 0:
        case '0':
          identity = '自然人'
          break
        case 1:
        case '1':
          identity = '法人'
          break

        default:
          break
      }
      return identity
    }
  },
  methods: {
    setForm(operation) {
      this.$emit('setForm', operation, this.type, this.index, this.inx)
    },
    addAgent() {
      this.$emit('setForm', 'add', this.type + 'Lawyer', this.index, this.inx)
    },
    save() {
      this.$emit('save', this.type, this.index, this.inx)
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
    .operation .add {
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
</style>
