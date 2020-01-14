<template>
  <div class="postPublish">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-form ref="postList" :model="post" label-width="80px">
        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="post.title"></el-input>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="类型">
          <el-radio-group v-model="post.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 内容 -->
        <el-form-item label="内容">
          <!-- 编辑器 -->
          <VueEditor :config="config" v-if="post.type===1" ref="postContent" />
          <!-- 上传视频 -->
          <el-upload
            class="upload-demo"
            action="http://localhost:3000/upload"
            :headers="getToken()"
            :on-success="handlerSuccess"
            :before-upload="return_upload"
            v-if="post.type===2"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
          </el-upload>
        </el-form-item>
        <!-- 栏目 -->
        <!-- indeterminate说明当前没有全选也没有全不选 -->
        <!-- checkAll选择的状态 -->
        <el-form-item label="栏目">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="post.categories" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cateList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面">
          <el-upload
            action="http://localhost:3000/upload"
            list-type="picture-card"
            :headers="getToken()"
            :on-success="fengmian"
            :on-remove="fengmiandelete"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="isclick">发布</el-button>
    </el-card>
  </div>
</template>

<script>
import { getCateList, publishPost } from "@/apis/articel.js";
import VueEditor from "vue-word-editor";
import "quill/dist/quill.snow.css";
export default {
  name: "app",
  components: {
    VueEditor
  },
  data() {
    return {
      post: {
        title: "",
        type: 1,
        categories: [],
        content: "",
        cover: []
      },
      cateList: [],
      config: {
        // 上传图片的配置
        uploadImage: {
          url: "http://localhost:3000/upload",
          name: "file",
          headers: this.getToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess(res, insert) {
            insert("http://localhost:3000" + res.data.data.url);
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: "http://localhost:3000/upload",
          name: "file",
          headers: this.getToken(),
          uploadSuccess(res, insert) {
            insert("http://localhost:3000" + res.data.data.url);
          }
        }
      },
      checkAll: false,
      isIndeterminate: false
    };
  },
  async mounted() {
    let res = await getCateList();
    this.cateList = res.data.data.splice(2);
  },
  methods: {
    async isclick() {
      if (this.post.type === 1) {
        this.post.content = this.$refs.postContent.editor.root.innerHTML;
      }
      this.post.categories = this.post.categories.map(val => {
        return { id: val };
      });
      // console.log(this.post);
      let res = await publishPost(this.post);
      // console.log(res);
      if (res.data.message === "文章发布成功") {
        this.$message.success("文章发布成功");
        this.$router.push({ name: "Postlist" });
      }
    },
    // 切换全选全不选状态
    handleCheckAllChange(val) {
      this.post.categories = val
        ? this.cateList.map(value => {
            return value.id;
          })
        : [];
      // console.log(this.post.categories);

      this.isIndeterminate = false;
    },
    // 单选触发的事件
    handleCheckedCitiesChange(value) {
      // console.log(value);
      let checklength = value.length;
      this.checkAll = checklength === this.cateList.length;
      this.isIndeterminate =
        checklength > 0 && checklength < this.cateList.length;
    },
    // 获取token值
    getToken() {
      let token = localStorage.getItem("houtai_key");
      return {
        Authorization: token
      };
    },
    // 上传成功后的回调
    handlerSuccess(response) {
      // console.log(response);
      if (response.message === "文件上传成功") {
        this.post.content = "http://127.0.0.1:3000" + response.data.url;
      }
    },
    // 上传文件之前做判断
    return_upload(file) {
      console.log(file);
      if (file.type.indexOf("video/")) {
        this.$message.warning("请选择视频文件");
        return false;
      }
    },
    // 上传封面成功后
    fengmian(response) {
      this.post.cover.push({ id: response.data.id });
    },
    // 封面上传后的回调函数
    fengmiandelete(file) {
      // console.log(file);
      let id = file.response.data.id;
      for (let i = 0; i < this.post.cover.length; i++) {
        if (this.post.cover[i].id === id) {
          this.post.cover.splice(i, 1);
          break;
        }
      }
    }
  }
};
</script>

<style lang='less' scoped>
.item {
  padding: 18px 0;
}
</style>