<template>
  <section class="available-components">
    <draggable
      :list="components"
      item-key="cols"
      class="list-group"
      ghost-class="ghost"
      @start="dragging = true"
      @end="dragging = false"
    >
      <template #item="{ element }">
        <div class="lc-field">{{ element.label }}</div>
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

<style scoped>
  .lc-field {
    border: 1px solid black;
    padding: 10px;
  }
</style>
