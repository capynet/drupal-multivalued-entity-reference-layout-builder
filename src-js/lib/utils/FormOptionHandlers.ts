import { IAPPEvents, IFormOptionHandlers, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

@injectable()
class FormOptionHandlers implements IFormOptionHandlers {

  constructor(
    @inject(TYPES.events) private events: IAPPEvents,
    @inject(TYPES.utils) private utils: IUtils
  ) {
  }

  setHandler(el, input) {
    const configId = input.dataset.configId

    switch (configId) {
      // Generic margin bottom.
      case 'margin-bottom':
        this.marginBottomHandler(el, input)
        break

      // Rows structure
      case 'structure':
        this.rowStructure(el, input)
        break

      case 'no-gutters':
        this.noGuttersHandler(el, input)
        break

      case 'remove-row':
        this.removeRow(el, input)
        break

      //      case 'remove-component':
      //        this.removeComponent(el, input)
      //        break
    }
  }

  /**
   * Set the margin bottom configuration.
   *
   * @param {HTMLElement} el element where the margin gets applied.
   * @param {HTMLInputElement} input has the margin user specified.
   */
  marginBottomHandler(el: HTMLElement, input: HTMLInputElement) {
    const self = this

    input.addEventListener('change', function (e) {
      const margin = this.value
      // Store conf.
      self.utils.setElementConf(el, {'marginBottom': margin})
      self.applyVisualMarginBottom(el, margin)
    })
  }

  /**
   * Visually represent the applied conf.
   *
   * @param {HTMLElement} el element where the margin gets applied.
   * @param {Number} margin can be the defined element margin or an arbitrary one.
   */
  applyVisualMarginBottom(el, margin) {
    const removableClassNames = ['mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5']

    // Clean all margin classes.
    el.classList.forEach((className, key) => {
      if (removableClassNames.includes(className)) {
        el.classList.remove(className)
      }
    })

    // Add the right one.
    if (margin >= 1) {
      el.classList.add('mb-' + margin)
    }
  }

  /**
   * Handles row structure (distribution of columns).
   *
   * Since this structure belongs to cols and not to the row, the stored
   * configuration its temporary stored at the row but at serialization
   * to json it will be moved to the correct place (to each inner col).
   *
   * @param {HTMLElement} el element where the structure gets applied.
   * @param {RadioNodeList} formContainer
   */
  rowStructure(el, formContainer) {
    const self = this

    const elementData = self.utils.getElementConf(el)

    // This is a new prop on the conf object. Ensure it exists.
    elementData.rowStructure || (elementData.rowStructure = {})

    formContainer.querySelectorAll('[type="radio"]').forEach((radio) => {
      radio.addEventListener('change', function (e) {
        const structure = radio.value
        const breakpoint = radio.dataset.breakpoint

        // Store conf.
        elementData.rowStructure[breakpoint] = structure
        self.utils.setElementConf(el, elementData)
        //        self.applyVisualColStructure(el)
      })
    })
  }

  /**
   * Visually represent the applied conf.
   *
   * @param {HTMLElement} colEl element where the structure got applied.
   */
  applyVisualColStructure(colEl) {
    const elementConf = this.utils.getElementConf(colEl)

    // 1: Remove all related class names acting as col structure modifiers.
    // -----------------------------
    const removableClassNames = ['col-', 'col-sm-', 'col-md-', 'col-lg-', 'col-xl-']

    // Remove all class except "col".
    // @todo move this snippet to Utils.removeClass() accepting arrays.
    colEl.classList.forEach((className, key) => {
      removableClassNames.forEach((removableClassName) => {
        if (className.indexOf(removableClassName) === 0) {
          colEl.classList.remove(className)
        }
      })
    })

    // 2: After cleaning all classes at step 1 it's time to add the new ones.
    // -----------------------------
    for (let brk in elementConf.structure) {
      const brkStructure = elementConf.structure[brk]
        const className = `col${brk !== 'xs' ? '-' + brk : ''}-${brkStructure}`
        colEl.classList.add(className)
    }

  }

  /**
   * Removes the item from the live layout.
   *
   * @param {HTMLElement} el row element.
   * @param {HTMLInputElement} input.
   */
  removeRow(el, input) {
    const self = this
    input.addEventListener('click', function (e) {

      // @todo if there is a component inside we cant delete the row.
      const confirmSave = confirm('Confirm row delete? All components will return to the available list.')

      if (confirmSave) {
        // Remove the row.
        el.remove()
        // And since row has been removed we exit form edit.
        self.events.fire('item.conf.deactivate', ['row', el])
      }
    })
  }

  /**
   * Removes the item from the live layout.
   *
   * @param {HTMLElement} el component element.
   * @param {HTMLInputElement} input.
   */
  //  removeComponent(el, input) {
  //    const self = this
  //    input.addEventListener('click', function (e) {
  //      // Inform to the system we are deleting this component to allow
  //      // ComponentsManager recovers it and put into the available components list.
  //      self.events.fire('liveLayout.removed.component', [el])
  //      // And since row has been removed we exit form edit.
  //      self.events.fire('item.conf.deactivate', ['component', el])
  //    })
  //  }

  /**
   * Removes the item from the live layout.
   *
   * @param {HTMLElement} el component element.
   * @param {RadioNodeList} formContainer.
   */
  noGuttersHandler(el, formContainer) {
    const self = this
    const elementData = self.utils.getElementConf(el)

    // This is a new prop on the conf object. Ensure it exists.
    elementData.noGutter || (elementData.noGutter = {})

    formContainer.querySelectorAll('[type="radio"]').forEach((radio) => {
      radio.addEventListener('change', function (e) {
        const val = radio.value
        const breakpoint = radio.dataset.breakpoint

        // Store conf.
        elementData.noGutter[breakpoint] = val
        self.utils.setElementConf(el, elementData)

        self.applyVisualNoGutters(el)
      })
    })
  }

  /**
   * Visually represent the applied conf.
   *
   * @param {HTMLElement} el element where the gutters got applied.
   */
  applyVisualNoGutters(el) {
    const elementData = this.utils.getElementConf(el)

    // Clean for all classes starting with "gutter-".
    el.classList.forEach((className, key) => {
      if (className.indexOf("gutter-") === 0) {
        el.classList.remove(className)
      }
    })

    for (let brk in elementData.noGutter) {
      el.classList.add(elementData.noGutter[brk])
    }
  }

}

export default FormOptionHandlers
