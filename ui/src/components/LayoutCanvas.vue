<template>
  <draggable
    :list="layout.rows"
    item-key="rows"
    class="draggable-rows"
    ghost-class="ghost"
    @start="dragging = true"
    @end="dragging = false"
    direction="vertical"
    :group="{ name: 'layout', pull: 'clone', put: false }"
  >
    <template #item="{ element, index }">
      <DOMField :row="element" :index="index" />
    </template>
  </draggable>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import draggable from "vuedraggable";
import DOMField from "./DOMField.vue";

export default {
  name: "layoutCanvas",
  display: "LayoutCanvas",

  components: {
    draggable,
    DOMField,
  },

  setup() {
    const store = useStore()

    return {
      layout: computed(() => store.state.layout),
    };
  },

  data() {
    return {
      dragging: false,
    };
  },

};
</script>

<style scoped lang="scss">
.ghost {
  opacity: 0.5;
  background: #369;
}

.draggable-rows {
  margin-top: 50px; // Temporal for development.
  border: 1px solid purple;
}
</style>
