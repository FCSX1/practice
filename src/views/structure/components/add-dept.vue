<template>
  <!-- 放置弹出层组件 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单数据 label-width设置标题的宽度 -->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        >
        <!--  -->
        </el-input>
      </el-form-item>

      <el-form-item
        label="部门编码"
        prop="code"
      >

        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>

      <el-form-item
        label="部门负责人"
        prop="manager"
      >
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimle"
        >
          <!-- 遍历选项 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="部门介绍"
        prop="introduce"
      >
        <el-input
          v-model="formData.introduce"
          style="width:80%;"
          placeholder="1-300个字符"
          type="textarea resize:none"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 确认和取消 -->
    <template #footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button
            size="small"
            type="primary"
            @click="btnCancel"
          >取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确认</el-button>
        </el-col>
      </el-row>
    </template>

  </el-dialog>
</template>

<script>
import { getDepartment, addDepartment, gainDepartment, updateDepartment } from '@/api/structures'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门名称
      const { depts } = await getDepartment()
      // 去找同级部门下 有没有和value相同的数据，并且找到同级部门下的所有子部门
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        depts.filter(item => item.pid === this.formData.pids)
        depts.filter(item => item.pid === this.treeNode.pids)
      } else {
        // 没有id就是新增
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true 表示有一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式下
        // 不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式下
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 编码 和所有的部门编码都不能重复
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理员
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          {
            required: true, message: '部门名称不能为空', trigger: 'blur'
          },
          {
            min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur'
          },
          {
            trigger: 'blur', validator: checkNameRepeat
          }
        ],
        code: [
          {
            required: true, message: '部门编码不能为空', tirgger: 'blur'
          },
          {
            min: 1, max: 50, message: '部门编码长度为1-50个字符', tirgger: 'blur'
          },
          {
            tirgger: 'blur', validator: checkCodeRepeat
          }
        ],
        manager: [
          {
            required: true, message: '部门负责人不能为空',
            trigger: 'blur'
          }
        ],
        introduce: [
          {
            required: true, message: '部门介绍不能为空', trigger: 'blur'
          },
          {
            min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur'
          }
        ]
      }, // 校验规则 {key:数组}
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimle() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async gainDepartment(id) {
      this.formData = await gainDepartment(id)
    },
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updateDepartment(this.formData)
          } else {
            // 将id设置成我们的pid
            await addDepartment({ ...this.formData, pid: this.treeNode.id })
          }
          // 通知父组件
          this.$emit('addDepts') // 触发一个自定义事件
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      // 重置数据 只能重置表单上的数据
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style>

</style>
