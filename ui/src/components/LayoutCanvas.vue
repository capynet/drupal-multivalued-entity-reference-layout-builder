<template>
  <draggable
    :list="canvasFields"
    item-key="cols"
    class="layout-canvas"
    ghost-class="ghost"
    @start="dragging = true"
    @end="dragging = false"
    group="layout"
  >
    <template #item="{ element }">
      <div class="lc-field">{{ element.name }} - {{ element.cols }}</div>
    </template>
  </draggable>

  <RawJson :data="canvasFields" title="Layout builder composition" />
</template>

<script>
  import draggable from "vuedraggable";
  import RawJson from "./RawJson.vue";

  export default {
    name: "layoutCanvas",
    display: "LayoutCanvas",

    components: {
      draggable,
      RawJson,
    },

    data() {
      return {
        canvasFields: [],
        dragging: false,
      };
    },

    mounted() {
      fetch("http://localhost:3000/canvasFields")
        .then((res) => res.json())
        .then((data) => (this.canvasFields = data));
    },
  };
</script>

<style scoped>
  .ghost {
    opacity: 0.5;
    background: #369;
  }

  .layout-canvas {
    border: 1px solid purple;
  }

  .lc-field {
    border: 1px solid black;
    padding: 10px;
  }
</style>
