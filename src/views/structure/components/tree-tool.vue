<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height:40px;width:100%"
  >
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>
          {{ treeNode.manager }}
        </el-col>
        <el-col>
          <el-dropdown @command="operateDept">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->

            <template #dropdown>
              <el-dropdown-menu>

                <el-dropdown-item command="add">
                  添加子部门
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="!isRoot"
                  command="edit"
                >编辑部门</el-dropdown-item>

                <el-dropdown-item
                  v-if="!isRoot"
                  command="del"
                >删除部门</el-dropdown-item>

              </el-dropdown-menu>
            </template>

          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
    <!--  -->
  </el-row>
</template>

<script>
import { deleteDepartment } from '@/api/structures'
export default {
  props: {
  // 定义传入的属性
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDept(type) {
      if (type === 'add') {
        this.$emit('addDepts', this.treeNode)
      } else if (type === 'edit') {
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('确认删除吗').then(() => {
          return deleteDepartment(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepts')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>

</style>
