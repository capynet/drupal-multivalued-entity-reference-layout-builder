<template>
  <div class="raw-data">
    <h2>{{ title }}</h2>
    <pre>{{ data }}</pre>
  </div>
</template>

<script>
export default {
  name: "rawJson",
  display: "RawJSON",

  props: {
    title: String,
    data: Object,
  },
};
</script>

<style scoped lang="scss">
.raw-data {
  border: 1px solid blue;
  margin: 0;
  padding: 10px;
}
</style>
