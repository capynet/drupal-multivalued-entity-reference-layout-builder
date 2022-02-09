<template>
  <main class="skeleton">
    <div class="sidebar">
      <h2>Available components</h2>
      <AvailableComponents />
      <RawJson :data="layout" title="JSON layout" />
    </div>
    <div class="content">
      <LayoutCanvas />
    </div>
  </main>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import RawJson from "./RawJson.vue";
import AvailableComponents from "./AvailableComponents.vue";
import LayoutCanvas from "./LayoutCanvas.vue";

export default {
  name: "Layout builder",

  components: {
    AvailableComponents,
    LayoutCanvas,
    RawJson,
  },

  setup() {
    const store = useStore()

    return {
      layout: computed(() => store.state.layout),
    };
  },

};
</script>

<style scoped>
.skeleton {
  display: flex;
}

.skeleton .sidebar {
  width: 30%;
}

.skeleton .content {
  width: 80%;
}
</style>
