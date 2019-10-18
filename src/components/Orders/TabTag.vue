<template>
  <div class="input-wrap">
    <!-- tags 遍历传递过来的标签  -->
    <span
      v-for="(item,index) in tags"
      :key="index"
      class="form-span"
      :class="{'checked':selectTag == item}"
      @click="$emit('checkTag',item)"
    >{{item}}</span>
    <!-- 当选中的标签 等于 遍历的标签时，添加样式 -->
    <!-- 绑定一个点击事件， 并将点击的那一个标签传递过去 -->
  </div>
</template>

<script>
export default {
  name: "TabTag",
  props: {
    tags: Array, // 传递过来的标签
    selectTag: String //  （父组件）选中的标签  传递给子组件的
  }
};
</script>

<style scoped>
.input-wrap {
  flex: 1 1 0;
  padding: 2.666667vw 0;
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
}
.input-wrap .form-span {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 1.066667vw;
  font-size: 0.9rem;
  color: #666;
  line-height: 7.466667vw;
  width: 18.133333vw;
  margin-right: 2.666667vw;
  text-align: center;
}
.checked {
  color: #2395ff !important;
  background: #eef7ff !important;
  border-color: rgba(35, 149, 255, 0.18) !important;
}
</style>
