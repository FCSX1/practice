<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!--  -->
        <tree-tool />
      </el-card>
    </div>
    <add-dept />
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept'
import TreeTool from './components/tree-tool'
export default {
  components: {
    AddDept,
    TreeTool
  }
}
</script>

<style>
.tree-card{
  padding: 30px 140px;
  font-size: 14px;
}
</style>
