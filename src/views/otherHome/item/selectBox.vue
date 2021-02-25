<template>
  <div class="selectBox">
    <el-row class="item" :gutter="20">
      <el-col :span="4">
        <elSelectTree ref="elSelectTree" v-model="courtId" size="mini" :type="teamType" />
      </el-col>
      <el-col :span="4">
        <el-select v-model="disputeArr" size="mini" style="width: 100%;" placeholder="请选择解纷类型" multiple>
          <el-option
            v-for="(item,index) in disputeArr1"
            :key="index"
            :label="item.name"
            :value="item.index"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-if="teamType == 2" v-model="orgType" size="mini" style="width: 100%;" placeholder="请选择组织类型" multiple>
          <el-option
            v-for="(item,index) in organizationArr"
            :key="index"
            :label="item.name"
            :value="item.index"
          />
        </el-select>
      </el-col>
      <el-col v-if="teamType == 2" :span="4">
        <el-input v-model="courtName" size="mini" placeholder="组织名称" />
      </el-col>
      <el-col v-if="teamType == 20" :span="4" style="margin-left: 20px;">
        <el-input v-model="scope" size="mini" placeholder="专业领域" />
      </el-col>
      <el-col v-if="teamType == 20" :span="4">
        <el-input v-model="name" size="mini" placeholder="调解员名称" />
      </el-col>
      <el-col :span="6">
        <el-button size="mini" style="margin-left: 20px;" @click="reset">清空</el-button>
        <el-button type="primary" size="mini" style="margin-left: 20px;" @click="search">搜索</el-button>
        <el-button
          v-if="teamType != 20"
          v-hasPermi="['team:organize:add']"
          type="success"
          class="add-btn"
          size="mini"
          style="margin-left: 20px;"
          @click="add"
        >添加</el-button>
        <el-button
          v-if="teamType === 20"
          v-hasPermi="['team:staff:add']"
          type="success"
          class="add-btn"
          size="mini"
          style="margin-left: 20px;"
          @click="add"
        >添加</el-button>
      </el-col>
    </el-row>
    <addStaff ref="addStaff" @done="search" />
    <addOrganize ref="addOrganize" @done="search" />
  </div>
</template>

<script>
import addOrganize from './addOrganize'
import addStaff from './addStaff'
import { getCourtInfoByType, listCourtByCourId, getCourtByLevel } from '@/api/team/team'
import { mapGetters } from 'vuex'
import elSelectTree from '@/components/el-select-tree/index'
export default {
  name: 'SelectBox',
  components: {
    addStaff,
    addOrganize,
    elSelectTree
  },
  props: {
    teamType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      disputeArr1: [
        { name: '调解', index: 1 },
        { name: '仲裁', index: 2 },
        { name: '公证', index: 3 },
        { name: '行政复议', index: 4 },
        { name: '行政裁决', index: 5 }
      ],
      organizationArr: [
        { name: '法院特邀调解', index: 1 },
        { name: '人民调解', index: 2 },
        { name: '行业调解', index: 3 },
        { name: '商事调解', index: 4 },
        { name: '律师调解', index: 5 },
        { name: '行政调解', index: 6 }
      ],
      courtName: '',
      mediateType: [],
      orgType: [],
      disputeArr: [],
      orgArr: [],
      courtId: '',
      courtData: [],
      scope: '',
      name: '',
      options: null,
      props: {
        label: 'name',
        children: 'child'
      }
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  mounted() {
    // this._getCourtInfoByType()
    this._listCourtByCourId()
  },
  methods: {
    choiceDispute({ index, name }) {
      console.log(!!index)
      const newArr = this.disputeArr1.map((item) => {
        return {
          ...item,
          test: !!item.index
        }
      })
      console.log(newArr, this.disputeArr1)
      const aindex = this.disputeArr.findIndex((item) => item === index)
      aindex !== -1
        ? this.disputeArr.splice(aindex, 1)
        : this.disputeArr.push(index)
      console.log(this.disputeArr, this.disputeArr.join(','))
    },
    choiceOrganization({ index }) {
      const index1 = this.orgType.findIndex((item) => item == index)
      if (index1 < 0) {
        this.orgType.push(index)
      } else {
        this.orgType.splice(index1, 1)
      }
    },
    search() {
      const mediateType = this.disputeArr
        ? this.disputeArr.join(',')
        : this.disputeArr
      const orgType = this.orgType ? this.orgType.join(',') : this.orgType
      let params = {}
      if (this.teamType == 2) {
        params = {
          mediateType,
          orgType,
          parentCourtId: this.courtId,
          courtName: this.courtName
        }
      } else {
        params = {
          mediateType,
          orgType,
          courtId: this.courtId,
          name: this.name,
          scope: this.scope
        }
      }
      this.$emit('search', params)
    },
    resetType() {
      this.mediateType = ''
      this.orgType = []
      this.courtName = ''
    },
    add() {
      if (this.teamType != 20) {
        this.$refs.addOrganize.show(this.teamType)
      }
      if (this.teamType === 20) {
        this.$refs.addStaff.show(this.teamType)
      }
    },
    getColor(index) {
      return this.disputeArr.includes(index)
    },
    getColor1(index) {
      return this.orgType.includes(index)
    },
    // 获取所属单位
    _listCourtByCourId() {
      const params = {
        courtId: this.getUserInfo.courtId,
        type: 2,
        pageSize: 1000,
        dept: 1,
        courtType: '1,2'
      }
      listCourtByCourId(params).then((res) => {
        if (res.state === 100) {
          const obj = res.content.map((item) => {
            const obj = {
              name: item.name,
              cId: item.dId,
              id: item.id,
              selfCourtId: item.selfCourtId
            }
            return obj
          })
          this.options = obj
        }
      })
    },
    // 清空
    reset() {
      this.disputeArr = []
      this.orgType = []
      this.courtId = ''
      this.courtName = ''
      this.scope = ''
      this.name = ''
      this.$refs.elSelectTree.reset()
    }
  }
}
</script>

<style scoped lang = "scss">
.selectBox {
  border-bottom: 5px solid #f2f5fa;
  padding: 20px 15px;
}
.item {
  line-height: 28px;
  font-weight: 700;
}
.disputeItem {
  width: 120px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  color: #007aff;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
}
.add-btn {
  background-color: #F9BC01;
  border-color: #F9BC01;
}
.isChoice {
  color: #fff;
  background: #007aff;
  border: 1px solid #007aff;
  border-radius: 5px;
  box-shadow: 0px 3px 6px 0px rgba(0, 151, 254, 0.4);
}
</style>
