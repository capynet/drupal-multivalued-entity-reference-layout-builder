<template>
  <draggable
    :list="layout.rows"
    item-key="rows"
    class="draggable-rows"
    ghost-class="ghost"
    @start="dragging = true"
    @end="dragging = false"
    :group="{ name: 'layout', pull: 'clone', put: false }"
  >
    <template #item="{ element }">
      <DOMField :row="element" />
    </template>
  </draggable>

  <RawJson :data="layout" title="Layout builder composition" />
</template>

<script>
  import draggable from "vuedraggable";
  import RawJson from "./RawJson.vue";
  import DOMField from "./DOMField.vue";

  export default {
    name: "layoutCanvas",
    display: "LayoutCanvas",

    components: {
      draggable,
      RawJson,
      DOMField,
    },

    data() {
      return {
        layout: {},
        dragging: false,
      };
    },

    mounted() {
      fetch("http://localhost:3000/layout")
        .then((res) => res.json())
        .then((data) => (this.layout = data));
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
</style>
