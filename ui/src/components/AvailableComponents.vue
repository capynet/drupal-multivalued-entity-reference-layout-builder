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
import { computed } from 'vue'
import { useStore } from 'vuex'
import draggable from "vuedraggable";


export default {
  name: "availableComponents",
  display: "AvailableComponents",

  components: {
    draggable,
  },

  setup() {
    const store = useStore()

    return {
      components: computed(() => store.state.components),
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
