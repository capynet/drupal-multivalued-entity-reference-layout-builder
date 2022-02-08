<template>
  <section class="available-components">
    <draggable
      :list="components"
      item-key="components"
      class="draggable-available-components"
      ghost-class="ghost"
      @start="dragging = true"
      @end="dragging = false"
      group="cell"
    >
      <template #item="{ element }">
        <div class="lc-component" v-html="element.preview || element.label"></div>
      </template>
    </draggable>
  </section>
</template>

<script>
import draggable from "vuedraggable";
import stateStore from "../store";

export default {
  name: "availableComponents",
  display: "AvailableComponents",

  components: {
    draggable,
  },

  setup() {
    const { components } = stateStore();

    return {
      components,
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
.lc-component {
  border: 1px solid red;
  padding: 10px;
}
</style>
