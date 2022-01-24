<template>
  <div class="lc-field">
    <div v-for="col in data.cols" :key="col">
      <draggable
        :list="col"
        item-key="cell"
        class="cell-components"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
        group="cell"
      >
        <template #item="{ element }">
          <div class="cell-element">{{ element.label }}</div>
        </template>
      </draggable>
    </div>
    <!-- <RawJson :data="data" title="Field structure" /> -->
  </div>
</template>

<script>
  import draggable from "vuedraggable";
  import RawJson from "./RawJson.vue";

  export default {
    name: "DOMField",
    display: "domField",

    components: {
      draggable,
      RawJson,
    },

    props: {
      data: Object,
    },

    data() {
      return {
        //cellComponents: Array.from({ length: 12 }, () => []),
        dragging: false,
      };
    },
  };
</script>

<style scoped>
  .lc-field {
    display: flex;
  }

  .lc-field > * {
    border: 1px solid black;
    padding: 10px;
    flex: 1 1 0px;
    min-height: 20px;
  }

  .ghost {
    opacity: 0.5;
    background: #369;
  }

  .cell-components {
    min-height: 30px;
    width: 100%;
    background: #ebebeb;
  }
</style>
