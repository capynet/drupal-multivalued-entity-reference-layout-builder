import { createStore } from 'vuex'

class StoreApp {
    constructor(confPack) {
        return createStore({
            state() {
                return {
                    count: confPack.mountPoint,
                    layout: confPack.layout,
                    components: confPack.components
                }
            },
            mutations: {
                addRow(state, { position, rowTpl }) {
                    state.layout.rows.splice(position, 0, rowTpl);
                }
            }
        })
    }
}

export default StoreApp;