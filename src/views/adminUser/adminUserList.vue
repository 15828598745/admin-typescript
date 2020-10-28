<template>
  <div>
    <el-button v-waves type="primary" @click="addUser">创建</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="账号"></el-table-column>
      <el-table-column prop="pwd" label="密码"></el-table-column>
      <el-table-column prop="createDate" label="建立时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm confirm-button-text="确认" cancel-button-text="不用了" icon="el-icon-info" icon-color="red" title="确认删除这条数据？" @onConfirm="del(scope.row)">
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="操作" :visible.sync="dialogVisible" @closed="cancel">
      <el-form ref="fromRules" label-width="100px" class="demo-ruleForm" :model="form" :rules="fromRules">
        <el-form-item label="管理员账号" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="name">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="页面权限">
          <el-tree ref="tree" node-key="name" :data="treeData" show-checkbox :default-checked-keys="treeChecked" :props="treeProp" highlight-current default-expand-all>
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { getUserList, addUser, updateUser, delUser } from "../../api/adminUser"
import { EErrCode } from "../../utils/errCode"
import { IPower, UserModule } from "../../store/modules/user"
interface IForm {
  adminUserId?: number
  name: string
  pwd: string
  parent: number
  power: IPower[]
  createDate?: string | Date
}
@Component({
  name: "adminUserList"
})
export default class extends Vue {
  private tableData: IForm[] = []
  private dialogVisible = false
  private form: IForm = {
    name: "",
    pwd: "",
    parent: 0,
    power: []
  }
  private treeData: any[] = []
  private treeProp = {
    label: this.getPropLabel,
    children: "children"
  }
  private treeChecked: string[] = []
  private isAdd = false

  created() {
    this.getList()
  }

  async getList() {
    let ret = await getUserList({})
    if (ret.code !== EErrCode.OK) {
      return
    }
    this.tableData = ret.msg
  }

  addUser() {
    this.channelTreeData(UserModule.power)
    this.isAdd = true
    this.dialogVisible = true
  }

  edit(row: IForm) {
    row = JSON.parse(JSON.stringify(row))
    this.form = row
    this.channelTreeData(row.power)
    this.isAdd = false
    this.dialogVisible = true
  }

  async del(row: IForm) {
    let ret = await delUser({ adminUserId: row.adminUserId })
    if (ret.code !== EErrCode.OK) {
      return
    }
    this.getList()
    this.$message.success("操作成功")
  }

  async confirm() {
    try {
      await (this.$refs.fromRules as any).validate()
      let checedList = (this.$refs.tree as any).getCheckedKeys()
      this.form.power = this.generateTree(this.treeData, checedList)
      let ret = this.isAdd ? await addUser(this.form) : await updateUser(this.form)
      if (ret.code !== EErrCode.OK) {
        this.$message.error(ret.msg)
        return
      }
      this.getList()
      this.$message.success("操作成功")
      this.dialogVisible = false
    } catch (error) {
      console.log(error)
    }
  }

  cancel() {
    this.form = {
      name: "",
      pwd: "",
      parent: 0,
      power: []
    }
  }

  get fromRules() {
    return {
      name: [
        { required: true, message: "请输入管理员昵称", trigger: "blur" },
        { min: 4, max: 16, message: "长度在 4 到 16 个字符", trigger: "blur" }
      ],
      pwd: [
        { required: true, message: "请输入管理员密码", trigger: "blur" },
        { min: 4, max: 16, message: "长度在 4 到 16 个字符", trigger: "blur" }
      ]
    }
  }

  channelTreeData(currentRoute: IPower[]) {
    let arr: IPower[] = []
    UserModule.power.forEach(i => {
      arr.push({ ...i })
    })
    this.treeData = arr
    this.treeChecked = this.treeCheckedList(currentRoute)
  }

  treeCheckedList(list: IPower[]): Array<string> {
    let arr: string[] = []
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.children) {
        arr.push(...this.treeCheckedList(item.children))
        for (let j = 0; j < UserModule.power.length; j++) {
          let jitem = UserModule.power[j]
          if (jitem.name === item.name) {
            if (jitem.children && jitem.children.length === item.children.length) {
              arr.push(item.name)
            }
            break
          }
        }
      } else {
        arr.push(item.name)
      }
    }
    return arr
  }

  getPropLabel(data: any, node: any) {
    return node.data.meta.title
  }

  generateTree(data: IPower[], checedList: string[]): Array<IPower> {
    let arr = []
    for (let i = 0; i < data.length; i++) {
      let item = { ...data[i] }
      if (item.children) {
        item.children = this.generateTree(item.children, checedList)
      }
      if (checedList.includes(item.name) || (item.children && item.children.length > 0)) {
        arr.push(item)
      }
    }
    return arr
  }
}
</script>

<style lang="scss" scoped>
#input {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 8em;
  max-width: 80%;
  background: none;
  border: none;
  outline: none;
  color: #abc;
  font-size: 3em;
  text-align: center;
  z-index: 999;
  transform: translateX(-50%);
  user-select: none;
}
</style>
