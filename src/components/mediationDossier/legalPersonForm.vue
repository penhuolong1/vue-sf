<template>
  <div class="form">
    <div class="form-data">
      <el-row type="flex">
        <el-col class="el-col bg-gray" :span="9">委托人名称</el-col>
        <el-col class="el-col" :span="15">
          <span v-show="!editFlag">{{ formData.litigantName }}</span>
          <el-input v-show="editFlag" v-model="formData.litigantName" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="el-col" :span="9">统一社会信用代码</el-col>
        <el-col class="el-col" :span="15">
          <span v-show="!editFlag">{{ formData.litigantName }}</span>
          <el-input v-show="editFlag" v-model="formData.litigantName" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="el-col bg-gray" :span="9">法定代表人或主要负责人姓名</el-col>
        <el-col class="el-col" :span="5">
          <span v-show="!editFlag">{{ formData.sex }}</span>
          <el-input v-show="editFlag" v-model="formData.sex" placeholder="请输入内容" />
        </el-col>
        <el-col class="el-col bg-gray" :span="5">职务</el-col>
        <el-col class="el-col" :span="5">
          <span v-show="!editFlag">{{ formData.employer }}</span>
          <el-input v-show="editFlag" v-model="formData.employer" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="el-col" :span="9">身份证号</el-col>
        <el-col class="el-col" :span="15">
          <span v-show="!editFlag">{{ formData.identityCard }}</span>
          <el-input v-show="editFlag" v-model="formData.identityCard" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="el-col bg-gray" :span="9">地址</el-col>
        <el-col class="el-col bg-gray" :span="15">
          <span v-show="!editFlag">{{ formData.address }}</span>
          <el-input v-show="editFlag" v-model="formData.address" placeholder="请输入内容" />
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="el-col" :span="9">联系号码</el-col>
        <el-col class="el-col" :span="15">
          <span v-show="!editFlag">{{ formData.phone }}</span>
          <el-input v-show="editFlag" v-model="formData.phone" placeholder="请输入内容" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LegalPersonForm',
  props: ['formData', 'editFlag'],
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {

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
</style>
