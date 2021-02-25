import axiosConfig from "@/utils/axios.js";
import Qs from 'qs'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax();
// 获取菜单树
export function getMenuTree(params) {
    return service({
        url: "/menu/getMenuTree.jhtml",
        method: "POST",
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        data: Qs.stringify(params)
    });
}
// 修改菜单树
export function editMenu(params) {
    return service({
        url: "/menu/editMenu.jhtml",
        method: "POST",
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        data: Qs.stringify(params),
    });
}
// 添加菜单
export function addMenu(params) {
    return service({
        url: "/menu/addMenu.jhtml",
        method: "POST",
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        data: Qs.stringify(params),
    });
}
// 查询菜单
export function selectMenu(params) {
    return service({
        url: "/menu/selectMenu.jhtml",
        method: "get",
        params
    });
}
// 删除菜单
export function deleteMenu(params) {
    return service({
        url: "/menu/deleteMenu.jhtml",
        method: "get",
        params
    });
}