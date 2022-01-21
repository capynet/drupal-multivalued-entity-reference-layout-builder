<template>
  <div class="lc-field">
    <div v-for="i in data.cols" :key="i"></div>
  </div>
</template>

<script>
  export default {
    name: "DOMField",
    display: "domField",

    props: {
      data: Object,
    },
  };
</script>

<style scoped>
  .lc-field {
    display: flex;
  }

  .lc-field > * {
    border: 1px solid black;
    padding: 10px;
    flex: 1 1 0px;
    min-height: 20px;
  }
</style>
