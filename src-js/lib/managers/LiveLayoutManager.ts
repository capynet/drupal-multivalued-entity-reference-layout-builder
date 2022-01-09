import Sortable from 'sortablejs/modular/sortable.complete.esm.js'
// Templates
import tplLiveLayout from '../templates/misc/live-layout.handlebars'
import { IAPPEvents, IComponentsManager, IConfigManager, ILiveLayoutManager, ILiveLayoutMiniMap, IGrid, ISerialization, ISidebar, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

/**
 * Handles the live layout.
 * Live layout is the representation of the layout user is working on.
 *
 */
@injectable()
class LiveLayoutManager implements ILiveLayoutManager {
  public readonly layoutWrapper: HTMLElement
  private dragGhost: HTMLImageElement
  rendered: HTMLElement

  /**
   * @constructor
   */
  constructor(
    @inject(TYPES.grid) private grid: IGrid,
    @inject(TYPES.componentsManager) private componentsManager: IComponentsManager,
    @inject(TYPES.configManager) private configManager: IConfigManager,
    @inject(TYPES.utils) private utils: IUtils,
    @inject(TYPES.events) private events: IAPPEvents,
    @inject(TYPES.sidebar) private sidebar: ISidebar,
    @inject(TYPES.serializer) private serializerInstance: ISerialization,
  ) {
    this.layoutWrapper = this.utils.htmlFragment(tplLiveLayout())
    this.dragGhost = new Image()
    this.dragGhost.src = 'data:image/png;base64,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\n'
  }

  /**
   * Retrieve all available cells.
   * @returns NodeListOf<Element>
   */
  getLayoutCells() {
    const self = this
    return self.layoutWrapper.querySelectorAll(':scope > .row > .col')
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

    Sortable.create(self.layoutWrapper, {
      group: 'layout',
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
        self.updateSortableColsOnLiveLayout()
      },
    })
  }

  /**
   * Makes all available rows sortable for "layout" sortable group.
   */
  makeAvailableColsSortable() {
    const self = this

    // Connect available rows to the "layout" group
    Sortable.create(document.querySelector('[data-available-cols]'), {
      group: {
        name: 'layout',
        pull: 'clone',
        put: false
      },
      fallbackOnBody: true,
      swapThreshold: 0.65,
      direction: 'vertical',
      sort: false,
    })

  }

  /**
   * Makes/updates all available  sortable cells for "content" sortable group.
   */
  updateSortableColsOnLiveLayout() {
    const self = this
    const cells = self.getLayoutCells()

    cells.forEach(cell => {
      Sortable.create(cell, {
        group: {
          name: 'content',
        },
        fallbackOnBody: true,
        swapThreshold: 0.65,
        direction: 'vertical',
        sort: false,
        // Element dragging started
        onStart: function (e: Event) {

        },

        onEnd: function (e: Event) {
        },

        onAdd: function (e) {
          // @deprecated since "adding" components to the layout is no mo an option.
          //          const component = e.item
          //          self.configManager.addConfigLayer('component', component, tplTriggerComponentHandler, tplComponentOptions)
        },
        setData: function (dataTransfer, dragEl) {
          // Instead using the original component ghost image
          // (often is too big) we provide a small generic placeholder.
          dataTransfer.setDragImage(self.dragGhost, 50, 50);
        },
      })
    })

  }

  render() {
    const self = this
    self.rendered = this.grid.render(this.layoutWrapper, true, 'main-live-layout')
    self.linkCols()
    return self.rendered
  }

}


export default LiveLayoutManager
