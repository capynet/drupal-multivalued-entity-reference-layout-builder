import { ILiveLayoutMiniMap, IGrid, ISerialization, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";
// Templates
import tplLiveLayoutMinimap from '../templates/misc/live-layout-minimap.handlebars'
import Sortable from "sortablejs/modular/sortable.complete.esm";

/**
 * Represents a small version of the layout.
 */
@injectable()
class LiveLayoutMiniMap implements ILiveLayoutMiniMap {
  rendered: HTMLElement

  constructor(
    @inject(TYPES.utils) private utils: IUtils,
    @inject(TYPES.serializer) private serializer: ISerialization,
    @inject(TYPES.grid) private grid: IGrid,
  ) {

  }

  linkCols() {
    const self = this
    self.makeLiveLayoutSortable()
    self.makeAvailableColsSortable()
  }

  /**
   * Makes "live layout" sortable for "layout" sortable group.
   */
  makeLiveLayoutSortable() {
    const self = this

    Sortable.create(self.rendered, {
      group: 'layoutMiniMap',
      direction: 'vertical',
      fallbackOnBody: true,
      handle: '[data-action="move"]',
      /**
       * Handles addition of new fields (a row with cols).
       * This only gets triggered by direct user interactions and it's not
       * related to the layout creation with a json initial config file.
       */
      onAdd: function (e) {
        /*
        * Here "e.item" is not a real row. Is just a visual Element
        * with the required information to allow the creation of
        * real row and inner cols.
        * */
        const row = e.item
        const defaultConf = JSON.parse(row.dataset.defaultConf)
        const newRow = self.grid.newRow(defaultConf, {addConfigLayer: true, applyVisualConfig: true})

        for (let i = 0; i < defaultConf.cols; i++) {
          const newCol = self.grid.newCol({}, {addConfigLayer: true, applyVisualConfig: true})
          newRow.appendChild(newCol)
        }

        row.replaceWith(newRow)

        // Each time live layout gets new rows with cols it's
        // time to re map col/cell areas to make them dropable.
        //        self.updateSortableColsOnLiveLayout()
      },
    })
  }

  /**
   * Makes all available rows sortable for "layout" sortable group.
   */
  makeAvailableColsSortable() {
    const self = this

    // @fixme para que esto funcione no puedo hablar diectamente con los available rows. Tengo que lanzar un evento para que quien quiera conectarse al minilayout lo haga (en este caso la clase que esté gestionando los available rows)
    // Connect available rows to the "layout" group
//    Sortable.create(document.querySelector('[data-available-cols]'), {
//      group: {
//        name: 'layoutMiniMap',
//        pull: 'clone',
//        put: false
//      },
//      fallbackOnBody: true,
//      swapThreshold: 0.65,
//      direction: 'vertical',
//      sort: false,
//    })

  }

  render() {
    const self = this
    const base = this.utils.htmlFragment(tplLiveLayoutMinimap());
    self.rendered = this.grid.render(base, 'placeholders', 'layout-mini-map')
    self.linkCols()
    return self.rendered
  }

}

export default LiveLayoutMiniMap
