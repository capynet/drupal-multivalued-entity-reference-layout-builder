import { reactive, toRefs } from "vue";

const url = 'http://localhost:3000/layout';

const state = reactive({
    layout: [],
});

export default function useLayout() {
    const fetchLayout = async () => {
        state.layout = await (await fetch(url)).json();
    }

    const addRow = (pos, index) => {
        const rowTpl = {
            "cols": [
                {
                    "components": [],
                    "contentPositioning": "bananas"
                },
            ]
        };

        let position;

        switch (pos) {
            case "before":
                position = index;
                break;
            case "after":
                position = index + 1;
                break;
        }

        state.layout.rows.splice(position, 0, rowTpl);
    }

    return {
        ...toRefs(state),
        fetchLayout,
        addRow
    }
}