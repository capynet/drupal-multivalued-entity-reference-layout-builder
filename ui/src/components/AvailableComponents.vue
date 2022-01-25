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
        <div class="lc-component">{{ element.label }}</div>
      </template>
    </draggable>
  </section>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "availableComponents",
  display: "AvailableComponents",

  components: {
    draggable,
  },

  data() {
    return {
      components: [],
      dragging: false,
    };
  },

  mounted() {
    fetch("http://localhost:3000/components")
      .then((res) => res.json())
      .then((data) => (this.components = data));
  },
};
</script>

<style scoped lang="scss">
.lc-component {
  border: 1px solid red;
  padding: 10px;
}
</style>
