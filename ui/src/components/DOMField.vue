<template>
  <div class="row-wrapper">
    <AddDOMField pos="before" :index="index" />

    <div
      class="lc-field lb-grid"
      :style="`grid-template-columns: repeat(${this.row.cols.length}, 1fr);`"
    >
      <div v-for="col in row.cols" :key="col">
        <draggable
          :list="col.components"
          item-key="cell"
          class="cell-components"
          ghost-class="ghost"
          @start="dragging = true"
          @end="dragging = false"
          group="cell"
        >
          <template #item="{ element }">
            <div class="lc-component" v-html="element.preview || element.label"></div>
          </template>
        </draggable>

        <!-- <RawJson :data="col" title="Raw col" /> -->
      </div>
    </div>
    <AddDOMField pos="after" :index="index" />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import RawJson from "./RawJson.vue";
import AddDOMField from "./AddDOMField.vue";

export default {
  name: "DOMField",
  display: "domField",

  components: {
    draggable,
    RawJson,
    AddDOMField,
  },

  props: {
    row: Object,
    index: Number,
  },

  data() {
    return {
      dragging: false
    };
  },
};
</script>

<style scoped lang="scss">
.ghost {
  opacity: 0.5;
  background: #369;
}

.row-wrapper {
  position: relative;
  z-index: 0;

  &:hover {
    z-index: 1;

    .add-row {
      display: block;
    }
  }

  .lc-field {
    // Columns.
    > * {
      border: 1px solid $color-blue;
      min-height: 20px;

      .cell-components {
        min-height: 30px;
        width: 100%;
        background: #e4a8a8;
      }
    }
  }
}

.add-row {
  display: none;
  position: absolute;
  left: 50%;
  z-index: 0;

  &[data-pos="before"] {
    top: 0;
    transform: translate(-50%, -50%);
  }
  &[data-pos="after"] {
    bottom: 0;
    transform: translate(-50%, 50%);
  }
}
</style>
