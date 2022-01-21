<template>
  <main class="skeleton">
    <div class="sidebar">
      <h2>Available components</h2>
      <AvailableComponents />
      <h2>Available fields</h2>
      <AvailableFields />
    </div>
    <div class="content">
      <LayoutCanvas />
    </div>
  </main>
</template>

<script>
  import AvailableComponents from "./components/AvailableComponents.vue";
  import AvailableFields from "./components/AvailableFields.vue";
  import LayoutCanvas from "./components/LayoutCanvas.vue";

  export default {
    name: "Layout builder",
    components: {
      AvailableComponents,
      AvailableFields,
      LayoutCanvas,
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
