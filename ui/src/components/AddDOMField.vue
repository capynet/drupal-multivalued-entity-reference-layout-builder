<template>
  <div class="add-row" :data-pos="pos">
    <a href="#" @click="add">Add a row</a>
    <!--   <ul> -->
    <!--     <li>1 col</li> -->
    <!--     <li>2 col</li> -->
    <!--     <li>3 col</li> -->
    <!--     <li>4 col</li> -->
    <!--     <li>6 col</li> -->
    <!--     <li>12 col</li> -->
    <!--   </ul> -->
  </div>
</template>

<script>
import useLayout from "../store";

export default {
  name: "AddDOMField",
  display: "addDOMField",

  setup() {
    const { addRow } = useLayout();

    return {
      addRow,
    };
  },

  props: {
    pos: String,
    row: Object,
  },

  data() {
    return {};
  },

  methods: {
    add(e) {
      e.preventDefault();
      this.addRow();
    },
  },
};
</script>

<style scoped>
.add-row a {
  background: red;
  color: white;
  text-decoration: none;
  padding: 3px;
}

.add-row ul {
  display: none;
  position: absolute;
}

.add-row a:hover + ul {
  display: block;
}
</style>
