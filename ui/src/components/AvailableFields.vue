<template>
  <section class="available-fields">
    <draggable
      :list="availableFields"
      item-key="cols"
      class="list-group"
      ghost-class="ghost"
      @start="dragging = true"
      @end="dragging = false"
      :group="{ name: 'layout', pull: 'clone', put: false }"
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
    name: "availableFields",
    display: "AvailableFields",

    components: {
      draggable,
    },

    data() {
      return {
        availableFields: [],
        dragging: false,
      };
    },

    mounted() {
      fetch("http://localhost:3000/availableFields")
        .then((res) => res.json())
        .then((data) => {
          // We need to "hydrate" component slots.
          data.forEach((el) => {
            el.components = Array.from({ length: el.cols }, () => []);
          });

          this.availableFields = data;
        });
    },
  };
</script>

<style scoped>
  .ghost {
    opacity: 0.5;
    background: #369;
  }

  .available-fields {
    background: #ccc;
    padding: 10px;
  }

  .lc-field {
    border: 1px solid black;
    padding: 10px;
  }
</style>
