import { IUtils } from "../../interfaces";
import { injectable } from "inversify";

@injectable()
class Utils implements IUtils {
  private readonly elementConfName: string
  private readonly elementDefaultConfName: string

  constructor() {
    this.elementConfName = 'elementConf'
    this.elementDefaultConfName = 'elementDefaultConf'
  }

  /**
   * Reads a CSS variable globally available.
   * @param {String} name Name of the variable without '--' prefix.
   * @returns {string} variable value.
   */
  getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)
  }

  /**
   *
   * @param {HTMLElement} el
   * @param {Object} obj
   * @param {Boolean} reset
   * @param {string} storageName
   */
  _setDataset(el, obj = {}, reset = false, storageName) {
    if (reset) {
      el.dataset[storageName] = JSON.stringify({})
      return
    }

    if (storageName in el.dataset) {
      const stored = JSON.parse(el.dataset[storageName])
      const merged = Object.assign(stored, obj)
      el.dataset[storageName] = JSON.stringify(merged)
    } else {
      el.dataset[storageName] = JSON.stringify(obj)
    }
  }

  /**
   *
   * @param {HTMLElement} el
   * @param storageName
   */
  _getDataset(el, storageName) {
    return (storageName in el.dataset) ? JSON.parse(el.dataset[storageName]) : {}
  }

  /**
   * @param {HTMLElement} el
   * @param {Object} obj
   * @param {Boolean} reset
   */
  setElementConf(el, obj = {}, reset = false) {
    this._setDataset(el, obj, reset, this.elementConfName)
  }

  /**
   *
   * @param {HTMLElement} el
   */
  getElementConf(el) {
    return this._getDataset(el, this.elementConfName)
  }

  /**
   * @param {HTMLElement} el
   * @param {Object} obj
   * @param {Boolean} reset
   */
  setDefaultElementConf(el, obj = {}, reset = false) {
    this._setDataset(el, obj, reset, this.elementDefaultConfName)
  }

  /**
   *
   * @param {HTMLElement} el
   */
  getDefaultElementConf(el) {
    return this._getDataset(el, this.elementDefaultConfName)
  }

  /**
   * Generates an HTMLElement with nested elements.
   *
   * @param {string} fragment
   * @returns {HTMLElement}
   */
  htmlFragment(fragment: string) {
    const wrapper = document.createElement('template');
    wrapper.innerHTML = fragment.trim();
    return wrapper.content.firstElementChild.cloneNode(true) as HTMLElement
  }
}

export default Utils
