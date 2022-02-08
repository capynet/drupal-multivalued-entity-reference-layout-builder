<template>
  <a href="#" @click="launch" v-if="!builderLaunched">Launch</a>

  <LayoutBuilder v-if="builderLaunched" />
</template>

<script>
import { defineAsyncComponent, ref } from 'vue'
const LayoutBuilder = defineAsyncComponent(() => import('./components/LayoutBuilder.vue'))

export default {
  name: "Layout builder",

  components: {
    LayoutBuilder,
  },

  setup() {
    let builderLaunched = ref(false);

    const launch = (e) => {
      e.preventDefault();
      builderLaunched.value = true;
    }


    return {
      builderLaunched,
      launch
    };
  },

};
</script>

<style scoped>
</style>
