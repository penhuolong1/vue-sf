<template>
  <div>
    <div
      v-show="!isEdit"
      style="padding:20px"
    >
      <div class="operation">
        <p
          class="el-icon-plus"
          style="background:#2176FE"
          @click="add"
        />
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          stripe
          align="center"
          style="width: 100%"
          @row-click="rowClick"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="70"
          />
          <el-table-column
            prop="name"
            label="证据材料名称"
            align="center"
            show-overflow-tooltip
            width="200"
          />
          <el-table-column
            prop="name"
            label="证据来源"
            align="center"
            show-overflow-tooltip
            width="150"
          />
          <el-table-column
            prop="name"
            label="页数"
            align="center"
            show-overflow-tooltip
            width="70"
          />
          <el-table-column
            label="操作"
            align="center"
            show-overflow-tooltip
            width="100"
          >
            <template>
              <el-button
                type="danger"
                @click.stop="del"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div
      v-show="isEdit"
      class="up-box"
    >
      <div class="up-title">
        <el-button
          icon="el-icon-arrow-left"
          circle
          @click.native="edit"
        />
        <p
          v-show="imgUrlsList.length"
          class="el-icon-plus"
          style="background: #2475FE;"
          @click="uploadImg()"
        />
        <p
          class="el-icon-check"
          style="background: #FEC503;"
        />
      </div>
      <div class="up-data">
        <div class="up-about">
          <div class="about-item">
            <p>证据序号{{ actionTable }}</p>
            <el-input
              v-model="evidence.serial "
              placeholder="请输入份数"
              clearable
            />
          </div>
          <div class="about-item">
            <p>证据名称</p>
            <el-input
              v-model="evidence.name"
              placeholder="请输入证据名称"
              clearable
            />
          </div>
          <div class="about-item">
            <p>证据来源</p>
            <el-input
              v-model="evidence.source "
              placeholder="请输入证据来源"
              clearable
            />
          </div>
          <div class="about-item">
            <p>证明对象</p>
            <el-input
              v-model="evidence.prove "
              placeholder="请输入证明对象"
              clearable
            />
          </div>
        </div>
        <div class="upload">
          <div
            v-show="!imgUrlsList.length"
            class="mater-upload-wrapper"
          >
            <input
              ref="file"
              type="file"
              style="display:none;"
              @change="getFile($event)"
            >
            <div
              class="upload-content"
              @click="uploadImg()"
            >
              <img
                src="@/assets/img/materUpload.png"
                alt=""
              >
              <div class="tip">png、jpg、doc&pdf最大10MB</div>
              <div class="title">证据上传</div>
            </div>
          </div>
          <div v-show="imgUrlsList.length">
            <div
              v-for="(item,index) in imgUrlsList"
              :key="index"
              class="img-list"
            >
              <div>
                <img
                  src="@/assets/img/materUpload.png"
                  alt=""
                >
              </div>
              <div class="del-icon">
                <i class="el-icon-error" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImg } from '@/api/case/index.js'
export default {
  name: 'BillOfMaterials',
  props: ['showAction', 'coverData', 'editFlag'],
  data() {
    return {
      isEdit: false,
      actionTable: '',
      tableData: [
        { id: 1, name: '测试' },
        { id: 2, name: '测试测试测试测试测试测试测试' }
      ],
      evidence: {
        serial: '', // 证据序号
        name: '', // 证据名称
        source: '', // 来源
        prove: '' // 证明对象
      },
      imgUrlsList: []
    }
  },
  methods: {
    init() {
      return new Promise((resolve, reject) => {
        if (this.coverData.caseId) {
          resolve(true)
        } else {
          resolve(true)
        }
      })
    },
    // 新增证据
    add() {
      this.actionTable = ''
      this.edit()
    },
    // 修改当行
    rowClick(res) {
      console.log(res)
      this.actionTable = res.id
      this.edit()
    },
    del() {
      console.log('删除')
    },
    edit() {
      this.isEdit = !this.isEdit
    },
    uploadImg() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      uploadImg(param).then(res => {
        if (res.state === 100) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success'
          })
          this.imgUrlsList.push(res.url)
          this.$refs.file.value = ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
::v-deep .table .el-button {
  padding: 8px 15px;
}
.operation {
  position: relative;
  display: flex;
  margin-bottom: 24px;
}
.operation p {
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
.up-box {
  position: relative;
  padding: 28px 15px;
  width: 100%;
  background: #f9f9fb;
  .up-title {
    margin-bottom: 50px;
    ::v-deep .el-button.is-circle {
      padding: 10px;
      margin-right: 25px;
      font-size: 18px;
      color: #2475fe;
    }
    p {
      margin-right: 25px;
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
    }
  }
  .up-data {
    position: relative;
    display: flex;
    width: 100%;
    .up-about {
      width: 30%;
      padding-right: 5%;
      border-right: 1px dashed #b9bed3;
      .about-item {
        margin-bottom: 15px;
        p {
          margin-bottom: 10px;
          color: #2475fe;
          font-size: 16px;
          font-weight: bold;
        }
        ::v-deep .el-input__inner {
          padding: 0 0 0 30px;
          background: #f9f9fb;
          border: none;
        }
      }
    }
  }
  .upload {
    position: relative;
    width: 70%;
    padding-left: 15px;
  }
}
.mater-upload-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    text-align: center;
    .tip {
      font-size: 12px;
      color: #8a92a5;
      margin-top: 5px;
    }
    .title {
      font-size: 16px;
      color: $themeColor;
      margin-top: 5px;
    }
  }
  .image-show-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .no-img {
      font-size: 20px;
      color: #bababa;
    }
    .upload-content {
      flex: 1;
      cursor: pointer;
    }
    .img-wrapper {
      flex: 1;
      height: 80%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      padding: 10px;
      position: relative;
      &:first-child {
        margin-right: 10px;
      }
      &:last-child {
        margin-left: 10px;
      }
      img {
        width: 100%;
      }
    }
  }
}
.upload-content {
  cursor: pointer;
}
.img-list {
  position: relative;
  float: left;
  margin: 30px 5%;
  width: 40%;
  height: 200px;
  img {
    width: 100%;
    max-height: 200px;
  }
}
.del-icon {
  position: absolute;
  width: 100%;
  bottom: -40px;
  text-align: center;
  cursor: pointer;
  i {
    color: #ec4c4d;
    font-size: 30px;
  }
}
.again-box {
  text-align: right;
  .text-blue {
    color: $subMenuActiveText;
    margin-right: 10px;
  }
  ::v-deep .el-button {
    padding: 8px;
  }
}
</style>
