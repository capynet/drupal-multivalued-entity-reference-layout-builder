import { ISerialization, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

@injectable()
class Serializer implements ISerialization {

  constructor(@inject(TYPES.utils) private utils: IUtils) {
  }

  /**
   * Returns a layout's JSON representation.
   *
   * @returns []
   */
  toJSON(liveLayout) {
    const self = this
    let json = []

    // Loop rows.
    liveLayout.querySelectorAll(':scope > .row').forEach(function (row) {
      let rowStructure = null
      const elementDataRow = self.utils.getElementConf(row)

      // If rowStructure is defined, we need to extract it from the row since this con
      if (elementDataRow.rowStructure) {
        rowStructure = elementDataRow.rowStructure
        delete elementDataRow.rowStructure
      }

      // Start the row config.
      const rowItem = {conf: elementDataRow, cols: []}

      // Loop cols.
      row.querySelectorAll(':scope > .col').forEach(function (col, i) {
        const elementConf = self.utils.getElementConf(col)

        // In case user selected a cols structure set those values to each col.
        if (rowStructure !== null) {
          const colStructure = {}

          for (let brk in rowStructure) {
            if (rowStructure[brk] !== 'equal') {
              colStructure[brk] = rowStructure[brk].split('_')[i]
            }
          }

          elementConf.structure = colStructure
        }


        const colItem = {conf: elementConf, components: []}

        // Loop components
        col.querySelectorAll(':scope > [data-component-id]').forEach(function (realComponent, k) {
          const elementDataComponentWrapper = self.utils.getElementConf(realComponent)

          colItem.components.push({
            id: realComponent.dataset.componentId,
            conf: elementDataComponentWrapper
          })
        })

        // PHP ignores empty arrays and we need to preserve the
        // original order with a falsy value.
        colItem.components = colItem.components.length !== 0 ? colItem.components : ['empty'];
        rowItem.cols.push(colItem)
      })

      json.push(rowItem)
    })

    return json
  }

}

export default Serializer
