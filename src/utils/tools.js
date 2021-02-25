import { FILE_SIZE } from './constVal'
import { Message } from 'element-ui'
// 升序排序
/**
 *
 * @param {升序的数组} ary
 * @param {根据的字段} clom
 */
export function sortNum(ary, clom) {
  // 根據距離遠近排序，越近在前面，升序
  ary.sort((a, b) => {
    if (a[clom] < b[clom]) {
      return -1
    } else if (a[clom] == b[clom]) {
      return 0
    } else {
      return 1
    }
  })
  return ary
}

/**
 *
 * @param {要插入目标元素后面的新元素} newElement
 * @param {目标元素} targetElement
 */
export function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode
  if (parent.lastChild == targetElement) {
    // 如果最后的节点是目标元素，则直接添加。因为默认是最后
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling)
    // 如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
  }
}

/**
 * @description 身份证算出出生年月和性别
 * @param [string] 身份证号码
 */

export function tools_calcIdentiyInfo(str) {
  // 获取性别
  const sex = parseInt(str.substr(16, 1)) % 2 == 1 ? '男' : '女'
  const brith = str.substring(6, 10) + '-' + str.substring(10, 12) + '-' + str.substring(12, 14)
  const obj = {
    sex: sex,
    birth: brith
  }
  return obj
}

// 获取指定值的在数组的index值
export const findArrayIndexByKey = function(arrayStr, key, value) {
  return arrayStr.findIndex(function(item) {
    return item[key] == value
  })
}

/**
 * 计算当前月份的天数
 */
export const monthDay = () => {
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  return new Date(year, month, 0).getDate()
}

/**
 * 限制上传文件大小,文件名不可包含特殊字符
 * @param {number} size 文件大小
 */
export const limitFileSize = file => {
  const size = file.size
  const type = file.type
  const name = file.name
  if (name.includes(',') || name.includes(';')) {
    Message.error('文件名不可包含特殊字符')
    return true
  } else {
    if (type == 'application/pdf') { // pdf上传不需要限制大小
      return false
    } else {
      if (size / 1024 > FILE_SIZE * 1000) {
        Message.error('上传的文件不能超过20M')
        return true
      } else {
        return false
      }
    }
  }
}
