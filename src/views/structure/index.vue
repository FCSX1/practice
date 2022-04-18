<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容-头部 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tool
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepts"
        />

        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope='obj' 接收传递给插槽的数据 data 是每个节点的数据对象 -->
          <tree-tool
            slot-scope="{ data }"
            :tree-node="data"
            @addDepts="addDepts"
            @editDepts="editDepts"
            @delDepts="getDepartment"
          />
        </el-tree>
      </el-card>
    </div>
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartment"
    />
  </div>
</template>

<script>
import { getDepartment } from '@/api/structures'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept'
import TreeTool from './components/tree-tool'
export default {
  components: {
    AddDept,
    TreeTool
  },
  data() {
    return {
      company: {}, // 头部数据结构
      departs: [],
      defaultProps: {
        label: 'name', // 表示从这个属性显示内容
        children: 'children' // 从这个属性去找子节点
      },
      showDialog: false, // 默认不显示弹层
      node: null // 记录当前点击的node
    }
  },
  created() {
    this.getDepartment() // 调用自身的方法
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // 将列表数据转换成树形数据
      this.departs = tranListToTreeData(result.depts, '')
    },
    // 监听tree-tool中触发的点击添加子部门的事件
    // node 是我们点击的部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true // 弹出层
      this.node = node // 赋值操作的节点
      this.$refs.addDept.gainDepartment(node.id)
    }
  }
}
</script>

<style>
.tree-card{
  padding: 30px 140px;
  font-size: 14px;
}
</style>
