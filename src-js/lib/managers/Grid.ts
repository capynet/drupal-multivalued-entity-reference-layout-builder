// Element templates.
import tplRowEl from '../templates/grids/tb4/row.handlebars'
import tplColEl from '../templates/grids/tb4/col.handlebars'
import tplCompPlaceholderEl from '../templates/grids/tb4/comp.handlebars'
// Contextual menu templates.
import tplRowContextualItems from '../templates/config-manager/trigger-conf-row-handler.handlebars'
import tplColContextualItems from '../templates/config-manager/trigger-conf-col-handler.handlebars'
import tplCompContextualItems from '../templates/config-manager/trigger-conf-component-handler.handlebars'
// Element form templates.
import tplRowConfigForm from "../templates/config-manager/row-options.handlebars"
import tplColConfigForm from "../templates/config-manager/col-options.handlebars"
import tplCompConfigForm from '../templates/config-manager/component-options.handlebars'
// Class
import { IAppParams, IComponentsManager, IConfigManager, IGrid, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

@injectable()
class Grid implements IGrid {
  public json: any[]
  breakpoints: any[]

  constructor(
    @inject(TYPES.appParams) private appParams: IAppParams,
    @inject(TYPES.configManager) private configManager: IConfigManager,
    @inject(TYPES.utils) private utils: IUtils,
    @inject(TYPES.componentsManager) private componentsManager: IComponentsManager,
  ) {
  }

  init(json) {
    const self = this
    self.json = json

    this.breakpoints = [
      {key: 'xs', label: 'XS', value: self.utils.getCssVar('breakpoint-xs')},
      {key: 'sm', label: 'SM', value: self.utils.getCssVar('breakpoint-sm')},
      {key: 'md', label: 'MD', value: self.utils.getCssVar('breakpoint-md')},
      {key: 'lg', label: 'LG', value: self.utils.getCssVar('breakpoint-lg')},
      {key: 'xl', label: 'XL', value: self.utils.getCssVar('breakpoint-xl')},
    ]
  }

  /**
   * Converts the json representation into the real layout.
   */
  render(base, attachComponents, buildId) {
    const self = this

    // ROWS PROCESSING
    // --------------------------------------------------
    self.json.forEach(row => {
      const newRow = self.newRow(row.conf, {
        addConfigLayer: attachComponents !== 'placeholders',
        applyVisualConfig: attachComponents !== 'placeholders'
      })


      // COLS PROCESSING
      // --------------------------------------------------
      row.cols.forEach((colConf) => {
        const newCol = self.newCol(colConf, {
          addConfigLayer: attachComponents !== 'placeholders',
          applyVisualConfig: attachComponents !== 'placeholders'
        })

        // COMPONENTS PROCESSING
        // --------------------------------------------------
        // Or we attach placeholders...
        if (attachComponents === 'placeholders') {
          colConf.components.forEach(compConf => {

            // If component is a string, means the col is empty.
            if (typeof compConf !== 'string') {
              const newComp = self.newCompPlaceholder()
              newCol.appendChild(newComp)
            }

          })
        } else {

          // Or we attach or not real components.
          if (attachComponents) {
            colConf.components.forEach(compConf => {
              if (compConf !== 'empty') {
                const newComp = self.newComp(compConf, {addConfigLayer: true, applyVisualConfig: true})
                newCol.appendChild(newComp)
              }
            })

          }
        }

        newRow.appendChild(newCol)
      })

      base.appendChild(newRow)
    })

    return base
  }

  newRow(rowConf, options) {
    const self = this
    const newRow = self.utils.htmlFragment(tplRowEl())
    // Attach the configuration to the newly created element.
    self.utils.setElementConf(newRow, rowConf)

    if (options.addConfigLayer) {
      self.configManager.addConfigLayer(
        'row',
        newRow,
        tplRowContextualItems,
        tplRowConfigForm,
        {
          breakpoints: self.breakpoints,
          structures: self.appParams.get('row_structures')[`cols_${rowConf.cols}`]
        })
    }

    options.applyVisualConfig && self.configManager.applyVisualConfig(newRow, rowConf)

    return newRow
  }

  newCol(colConf, options) {
    const self = this
    const newCol = self.utils.htmlFragment(tplColEl())
    self.utils.setElementConf(newCol, colConf?.conf || {})

    options.addConfigLayer && self.configManager.addConfigLayer(
      'column',
      newCol,
      tplColContextualItems,
      tplColConfigForm
    )

    options.applyVisualConfig && self.configManager.applyVisualConfig(newCol, colConf?.conf || {})

    return newCol
  }

  newCompPlaceholder() {
    const self = this
    return self.utils.htmlFragment(tplCompPlaceholderEl())
  }

  newComp(compConf, options) {
    const self = this
    let newComponent = null

    // Loop real components until we find the related one to the provided UUID.
    self.componentsManager.components.forEach(el => {
      if (el.dataset.componentId === compConf.id) {
        newComponent = el
      }
    })

    self.utils.setElementConf(newComponent, (compConf.conf))

    options.addConfigLayer && self.configManager.addConfigLayer(
      'component',
      newComponent,
      tplCompContextualItems,
      tplCompConfigForm
    )

    options.applyVisualConfig && self.configManager.applyVisualConfig(newComponent, compConf.conf)

    return newComponent
  }

}

export default Grid
