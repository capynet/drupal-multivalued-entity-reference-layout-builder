import { reactive, toRefs } from "vue";

const url = 'http://localhost:3000/layout';

const state = reactive({
    layout: [],
});

export default function useLayout() {
    const fetchLayout = async () => {
        state.layout = await (await fetch(url)).json();
    }

    const addRow = () => {
        const rowTpl = {
            "cols": [
                {
                    "components": [],
                    "contentPositioning": "center"
                },
                {
                    "components": [],
                    "cellPositioning": "auto"
                }
            ]
        };

        state.layout.rows.push(rowTpl);
    }

    return {
        ...toRefs(state),
        fetchLayout,
        addRow
    }
}