// Class
import { IAPPEvents, IAppParams, IConfigManager, IFormOptionHandlers, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

@injectable()
class ConfigManager implements IConfigManager {

  constructor(
    @inject(TYPES.formOptionHandlers) private formOptionHandlers: IFormOptionHandlers,
    @inject(TYPES.events) private events: IAPPEvents,
    @inject(TYPES.utils) private utils: IUtils,
    @inject(TYPES.appParams) private appParams: IAppParams,
  ) {
  }

  /**
   * Adds an option list to the element and links the configuration form.
   */
  addConfigLayer(type, el, tplContextualMenu, tplContextualForm, formParams = {}) {
    // @todo is this necessary?
    if ('configLayerAdded' in el.dataset) {
      return
    }

    const self = this
    const renderedTplContextualMenu = self.utils.htmlFragment(tplContextualMenu())
    self.handleDeactivation()
    const openConfBtn = renderedTplContextualMenu.querySelector('[data-action="open-conf"]');

    openConfBtn.addEventListener('click', function (e) {
      const form = self.renderConfigForm(el, tplContextualForm, formParams)
      el.classList.add('mode-edit-on')

      // System notification.
      self.events.fire('item.conf.active', [type, el, form])
    })

    openConfBtn.addEventListener('mouseenter', function () {
      el.classList.add('mode-edit-on-preview')
    })

    openConfBtn.addEventListener('mouseleave', function () {
      el.classList.remove('mode-edit-on-preview')
    })

    el.appendChild(renderedTplContextualMenu);

    // Attach conf object.
    this.utils.setElementConf(el, this.utils.getDefaultElementConf(el))
    el.dataset.configLayerAdded = true
  }

  /**
   * Removes all config manager layer leaving the only the original component.
   *
   * @param {HTMLElement} el
   */
  removeConfigLayer(el) {
    if ('configLayerAdded' in el.dataset) {
      el.querySelector('[data-config-element-trigger]').remove()
      this.cleanVisualConfig(el)
      delete el.dataset.configLayerAdded
      this.utils.setElementConf(el, null, true)
      this.utils.setDefaultElementConf(el, null, true)
    }
  }

  /**
   * Renders the linked configuration form.
   *
   * @param {HTMLElement} el
   * @param {Function} formTpl
   * @param formTplOpts
   *
   * @returns {HTMLElement}
   */
  renderConfigForm(el, formTpl, formTplOpts) {
    const self = this
    const form = this.utils.htmlFragment(formTpl(formTplOpts))
    self.addFormInputHandlers(el, form)
    self.setFormInputDefaults(el, form)
    return form
  }

  addFormInputHandlers(el, form) {
    const self = this
    form.querySelectorAll('[data-config-id]').forEach(function (input) {
      self.formOptionHandlers.setHandler(el, input)
    })
  }

  /**
   * @todo this method should be splitted?
   *
   * @param el
   * @param form
   */
  setFormInputDefaults(el, form) {
    const self = this
    const elementConf = this.utils.getElementConf(el)

    // Margin bottom defaults.
    if (elementConf.hasOwnProperty('marginBottom')) {
      const el = form.querySelector('[data-config-id="margin-bottom"]');
      // Yes, we need to set the value internally and visually.
      el.value = elementConf.marginBottom
      el.setAttribute('value', elementConf.marginBottom)
    }


    // Edge case: Does this element has "cols"? so lets dig their "col"
    // configurations since we need them to expose them into the row form.
    if (elementConf.hasOwnProperty('cols')) {
      // We need to unify the collection of cols structures in unique identifiers.
      const packedStructures = {}

      el.querySelectorAll(':scope > .col').forEach(col => {
        const colElementConf = this.utils.getElementConf(col)

        if (colElementConf.structure) {
          for (let brk in colElementConf.structure) {
            const brkStructure = colElementConf.structure[brk]

            if (packedStructures.hasOwnProperty(brk)) {
              packedStructures[brk] += `_${brkStructure}`
            } else {
              packedStructures[brk] = brkStructure
            }


          }
        }
      })

      for (let brk in packedStructures) {
        const structure = packedStructures[brk]
        form.querySelector(`[data-config-id="structure"] [data-breakpoint="${brk}"][value="${structure}"]`).setAttribute('checked', 'checked')
      }

    }

    // Col gutter defaults.
    if (elementConf.hasOwnProperty('noGutter')) {

      if (Object.keys(elementConf.noGutter).length !== 0) {
        for (let brk in elementConf.noGutter) {
          const struct = elementConf.noGutter[brk]
          form.querySelector(`[data-config-id="no-gutters"] [data-breakpoint="${brk}"][value="${struct}"]`).setAttribute('checked', 'checked')
        }
      } else {
        // @todo check this part. Have sense? I cant find the utility.
        // Set "checked" structures as the active config.
        const defaults = form.querySelectorAll(`[data-config-id="no-gutters"] [data-breakpoint]:checked`)

        defaults.forEach(function (defaultRadio) {
          const structure = defaultRadio.value

          // Store conf.
          self.utils.setElementConf(el, {'noGutter': {breakpoint: structure}})
          self.formOptionHandlers.applyVisualNoGutters(el)
        })
      }
    }

  }

  /**
   * Listen to 'item.conf.deactivate'
   */
  handleDeactivation() {
    const self = this
    // Wen config is deactivated we do some cleans.
    self.events.on('item.conf.deactivate', function (type, el, form, clean = false) {
      const emptyMsg = self.utils.htmlFragment('<p>Edit a row, col or component to see the configuration form here.</p>');
      el.classList.remove('mode-edit-on')
    })
  }

  /**
   * @docme
   *
   * @param {HTMLElement} el
   * @param {Object} config
   */
  applyVisualConfig(el, config) {
    const self = this

    for (let conf in config) {
      switch (conf) {
        case 'marginBottom':
          self.formOptionHandlers.applyVisualMarginBottom(el, config[conf])
          break
        case 'structure':
          self.formOptionHandlers.applyVisualColStructure(el)
          break
        case 'noGutter':
          self.formOptionHandlers.applyVisualNoGutters(el)
          break
      }
    }
  }

  /**
   * Cleans an applied configuration added to the DOM element.
   * Mainly used for components that needs to roll back to the available
   * component's list.
   *
   * @param {HTMLElement} el
   */
  cleanVisualConfig(el) {
    const self = this

    for (let conf in self.utils.getElementConf(el)) {
      switch (conf) {
        case 'marginBottom':
          self.formOptionHandlers.applyVisualMarginBottom(el, 0)
          break
      }
    }
  }
}

export default ConfigManager
