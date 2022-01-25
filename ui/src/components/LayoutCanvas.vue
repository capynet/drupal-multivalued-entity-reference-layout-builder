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
</template>

<script>
import draggable from "vuedraggable";
import DOMField from "./DOMField.vue";
import useLayout from "../store";

export default {
  name: "layoutCanvas",
  display: "LayoutCanvas",

  components: {
    draggable,
    DOMField,
  },

  setup() {
    const { layout } = useLayout();

    return {
      layout,
    };
  },

  data() {
    return {
      dragging: false,
    };
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
