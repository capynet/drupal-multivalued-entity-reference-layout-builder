<template>
  <div class="add-row" :data-pos="pos" :index="index">
    <span>Add row {{ pos }}</span>

    <ul>
      <li v-for="item in possibleFields" :key="item">
        <a href="#" @click="addRow(pos, index, item.value)">{{ item.label }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  props: {
    pos: String,
    index: Number
  },

  setup() {
    const store = useStore()

    /**
     * Add a new field to the layout.
     * 
     * @param {String} pos Indicates if the field should be added before or after the current field.
     * @param {Number} index Current field position used as reference.
     * @param {Number} cols Number of columns to add.
     */
    const addRow = (pos, index, cols) => {
      const position = index + (pos === 'after' ? 1 : 0)
      const rowTpl = { "cols": [] };

      for (let i = 0; i < cols; i++) {
        // colTpl must be inside the loop to avoid references to the same object.
        const colTpl = { "components": [] };
        rowTpl.cols.push(colTpl);
      }

      store.commit("addRow", { position, rowTpl });
    }


    return {
      addRow,
      possibleFields: [
        { label: '1 cols', value: 1 },
        { label: '2 cols', value: 2 },
        { label: '3 cols', value: 3 },
        { label: '4 cols', value: 4 },
        { label: '6 cols', value: 6 },
        { label: '12 cols', value: 12 },
      ],
    };
  },

};
</script>

<style scoped lang="scss">
.add-row {
  &:hover {
    display: block;

    ul {
      display: flex;
    }
  }

  &[data-pos="before"] {
    ul {
      bottom: 100%;
      transform: translate(-50%, 0);
    }
  }

  &[data-pos="after"] {
    ul {
      top: 100%;
      transform: translate(-50%, 0);
    }
  }

  > span {
    background: red;
    color: white;
    text-decoration: none;
    padding: 3px;
    display: block;
  }

  ul {
    display: none;
    position: absolute;
    margin: 0;
    padding: 0;
    list-style: none;
    white-space: nowrap;
    background: red;
    left: 50%;
    transform: translateX(-50%);

    li {
      display: block;
      background: white;
      border: 1px solid black;
      padding: 3px;
      margin: 0 5px;
    }
  }
}
</style>
