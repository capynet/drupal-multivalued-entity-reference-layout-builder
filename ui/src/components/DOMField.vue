<template>
  <div class="row-wrapper">
    <AddDOMField pos="before" :index="index" />

    <div class="lc-field">
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
          <template #item="{ element }">{{ element.label }}</template>
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

.row-wrapper {
  position: relative;
  z-index: 0;
}

.add-row {
  display: none;
  position: absolute;
  left: 50%;
  z-index: 0;
}

.add-row[data-pos="before"] {
  top: 0;
  transform: translate(-50%, -50%);
}

.add-row[data-pos="after"] {
  bottom: 0;
  transform: translate(-50%, 50%);
}

.row-wrapper:hover {
  z-index: 1;
}

.row-wrapper:hover .add-row {
  display: inline-block;
}
</style>
