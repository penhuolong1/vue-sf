<template>
  <el-select v-model="selectValue" :size="size" style="width: 100%;" :placeholder="placeholder" clearable @clear="reset">
    <el-option :value="option" style="height: auto">
      <div>
        <el-input v-model="searchInput" type="text" size="mini" placeholder="请输入关键字" @click.stop.native="stopClick">
          <template slot="append">
            <el-button @click.stop.native="search">搜索</el-button>
          </template>
        </el-input>
        <div>
          <el-radio-group v-if="isCaseList" v-model="radio" @click.stop.native="stopClick">
            <el-radio :label="1">本单位</el-radio>
            <el-radio :label="2">本单位及下级单位</el-radio>
          </el-radio-group>
        </div>
        <el-tree
          v-if="isTree"
          ref="tree"
          :props="props"
          :load="loadNode"
          lazy
          show-checkbox
          node-key="id"
          :check-strictly="true"
          @check-change="checkChange"
        />
      </div>
    </el-option>
  </el-select>
</template>

<script>
import { listCourtByCourId, getCourtInfoByType } from '@/api/team/team'
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    size: { // select 大小 medium/small/mini
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    type: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择所属单位'
    },
    isCaseList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectValue: '',
      props: {
        label: 'name',
        children: 'child'
      },
      option: null,
      searchInput: '',
      isTree: true,
      radio: 1
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  watch: {
    radio() {
      this.$emit('getRadio', this.radio)
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 清空
    reset() {
      this.selectValue = ''
      this.radio = 1
      this.$refs.tree.setCheckedKeys([])
      this.$emit('getRadio', this.radio)
      this.$emit('input', '')
    },
    stopClick() {
      console.log('阻止事件冒泡')
    },
    search() {
      this.isTree = false
      setTimeout(() => {
        this.isTree = true
      }, 100)
    },
    checkChange(item, node, self) {
      console.log(item.id)
      if (node == true) {
        this.editCheckId = item.id
        this.$refs.tree.setCheckedKeys([item.id])
        this.label = item.label
        this.selectValue = item.name
        this.$emit('input', this.editCheckId)
      } else {
        if (this.editCheckId == item.id) {
          this.$refs.tree.setCheckedKeys([])
          this.label = ''
          this.selectValue = ''
          this.$emit('input', '')
        }
      }
    },
    loadNode(node, resolve) {
      if (!node) {
        return
      }
      if (node.level === 0) {
        const params = {
          courtId: 1, // 查询所有的联动单位和调解组织的东西
          type: 2,
          pageSize: 1000,
          dept: 1,
          courtType: 1,
          courtName: this.searchInput
        }
        if (this.searchInput) { // 假如是通过名字查找则不传下一级
          delete params.dept
        } else {
          params.dept = 1
        }
        if (this.type == 2) { // 为调解组织所属单位只查联动单位
          params.courtType = '1'
        } else if (this.type == 20) { // 为调解员所属单位查联动单位和调解组织
          params.courtType = '1,2'
        }
        if (this.isCaseList) {
          if (this.getUserInfo.courtType === 0) { // 假如为联动中心则直接查下级联动单位
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
                return resolve(obj)
              }
            })
          } else if (this.getUserInfo.courtType == 4) {
            const params = {
              type: 2,
              pageSize: 1000,
              dept: 1,
              courtType: 1,
              courtName: this.searchInput
            }
            if (this.searchInput) { // 假如是通过名字查找则不传下一级
              delete params.dept
            } else {
              params.dept = 1
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
                return resolve(obj)
              }
            })
          } else {
            params.courtId = this.getUserInfo.courtId
            const obj = {
              name: this.getUserInfo.courtName,
              cId: this.getUserInfo.courtId,
              id: this.getUserInfo.courtUid
            }
            return resolve([obj])
          }
        } else {
          // 找二级
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
              return resolve(obj)
            }
          })
        }
      }
      if (node.level > 0) {
        const params = {
          courtId: node.data.cId,
          type: 2,
          pageSize: 1000,
          dept: 1,
          courtType: 1
        }
        if (this.type == 2) { // 为调解组织所属单位只查联动单位
          params.courtType = '1'
        } else if (this.type == 20) { // 为调解员所属单位查联动单位和调解组织
          params.courtType = '1,2'
        }
        // 找二级
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
            return resolve(obj)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-select-dropdown__item.hover{
  background-color: #fff;
}
</style>
