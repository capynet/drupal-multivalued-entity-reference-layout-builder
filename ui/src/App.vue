<template>
  <main class="skeleton">
    <div class="sidebar">
      <h2>Available components</h2>
      <AvailableComponents />
      <RawJson :data="layout" title="JSON layout" />
    </div>
    <div class="content">
      <LayoutCanvas :layout="layout" />
    </div>
  </main>
</template>

<script>
import { onMounted } from "vue";
import useLayout from "./store";
import RawJson from "./components/RawJson.vue";
import AvailableComponents from "./components/AvailableComponents.vue";
import LayoutCanvas from "./components/LayoutCanvas.vue";

export default {
  name: "Layout builder",

  components: {
    AvailableComponents,
    LayoutCanvas,
    RawJson,
  },

  setup() {
    const { layout, fetchLayout } = useLayout();

    onMounted(() => {
      fetchLayout();
    });

    return {
      layout,
    };
  },

};
</script>

<style scoped>
#plb-app {
}

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
