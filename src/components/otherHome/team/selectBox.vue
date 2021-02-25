<template>
  <div class="selectBox">
    <el-row class="item">
      <el-col :span="2">
        纠纷类型
      </el-col>
      <el-col v-for="item in disputeArr" :key="item.index" :span="3">
        <span class="disputeItem" :class="{isChoice:mediateType === item.index}" @click="choiceDispute(item)">
          {{ item.name }}
        </span>
      </el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="2">
        组织类型
      </el-col>
      <el-col v-for="item in organizationArr" :key="item.index" :span="3">
        <span class="disputeItem" :class="{isChoice:ortType === item.index}" @click="choiceOrganization(item)">
          {{ item.name }}
        </span>
      </el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="10">
        <el-input v-model="courtName" size="mini" placeholder="请输入关键词搜索" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="mini" style="margin-left: 20px;" @click="search">搜索</el-button>
        <el-button type="success" size="mini" style="margin-left: 20px;" @click="add">添加</el-button>
      </el-col>
    </el-row>
    <!-- <add ref="add" v-bind="$attrs" v-on="$listeners" /> -->
    <add ref="add" @done="search" />
    <add2 ref="add2" @done="search" />
  </div>
</template>

<script>
import add from './add'
import add2 from './add2'
export default {
  name: 'SelectBox',
  components: {
    add, add2
  },
  props: {
    teamType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      disputeArr: [
        { name: '全部', index: '' },
        { name: '调解', index: 1 },
        { name: '仲裁', index: 2 },
        { name: '公证', index: 3 },
        { name: '行政复议', index: 4 },
        { name: '行政裁决', index: 5 }
      ],
      organizationArr: [
        { name: '全部', index: '' },
        { name: '法院特邀解纷', index: 1 },
        { name: '人民解纷', index: 2 },
        { name: '行业解纷', index: 3 },
        { name: '商事解纷', index: 4 },
        { name: '行政解纷', index: 5 }
      ],
      courtName: '',
      mediateType: '',
      ortType: ''
    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    choiceDispute({ index }) {
      this.mediateType = index
    },
    choiceOrganization({ index }) {
      this.ortType = index
    },
    search() {
      this.$emit('search', this.mediateType, this.ortType, this.courtName)
    },
    resetType() {
      this.mediateType = ''
      this.ortType = ''
      this.courtName = ''
    },
    add() {
      if (this.teamType != 20) {
        this.$refs.add.show(this.teamType)
      }
      if (this.teamType === 20) {
        this.$refs.add2.show(this.teamType)
      }
    }
  }
}
</script>

<style scoped lang = "scss">
 .selectBox {
    height: 200px;
    border-bottom: 5px solid #f2f5fa;
    padding: 15px;
    .item {
      height: 50px;
      line-height: 50px;
    }
    .el-col-2 {
      font-weight: 700;
    }
  }
  .disputeItem{
    width: 120px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    text-align: center;
    color: #007AFF;
    cursor: pointer;
    font-weight: 700;
    font-size: 15px;
  }
  .isChoice{
    color: #fff;
    background: #007aff;
    border: 1px solid #007aff;
    border-radius: 5px;
    box-shadow: 0px 3px 6px 0px rgba(0,151,254,0.4);
  }
</style>
