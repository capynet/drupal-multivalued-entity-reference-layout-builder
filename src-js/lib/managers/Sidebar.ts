import { IAPPEvents, IAppParams, ILiveLayoutMiniMap, ISidebar, IUtils } from "../../interfaces";
import tplSidebar from "../templates/misc/sidebar.handlebars"
import tplAvailableRows from '../templates/misc/available-rows.handlebars'
import { inject, injectable } from "inversify";
import TYPES from "../../types";

/**
 * @docme
 */
@injectable()
class Sidebar implements ISidebar {
  public el: any
  zoneLabels: HTMLElement
  zoneContents: HTMLElement
  registeredZones: {}

  constructor(
    @inject(TYPES.events) private events: IAPPEvents,
    @inject(TYPES.utils) private utils: IUtils,
    @inject(TYPES.appParams) private appParams: IAppParams,
    @inject(TYPES.liveLayoutMiniMap) private liveLayoutMiniMap: ILiveLayoutMiniMap
  ) {
    this.zoneLabels = this.utils.htmlFragment(`<ul class="zone-tabs"></ul>`)
    this.zoneContents = this.utils.htmlFragment(`<div class="zone-contents"></div>`)
    // Its our internal pointer for each created zone.
    this.registeredZones = {}
  }

  /**
   * The DOM place where the sidebar class will inject the contents.
   */
  render() {
    const self = this
    self.el = this.utils.htmlFragment(tplSidebar())

    const contentAvailableRows = self.utils.htmlFragment(tplAvailableRows({assetsPath: process.env.ASSETS_PATH, available_rows: self.appParams.get('available_rows')}))
    const contentMiniLayout = self.liveLayoutMiniMap.render()

    self.el.querySelector('main').appendChild(contentAvailableRows)
    self.el.querySelector('main').appendChild(contentMiniLayout)

    // @todo can we avoid Drupal here to keep this solution agnostic?
    const currentTakenSpace = window.Drupal.displace()

    // assign sidebar values on next tick since dimensions are not available yet.
    setTimeout(function () {
      // Reserve the sidebar space.
      document.body.style.paddingLeft = `${self.el.offsetWidth + currentTakenSpace.left}px`
      self.el.style.top = `${currentTakenSpace.top}px`
      self.el.style.height = `calc(100% - ${currentTakenSpace.top}px)`
    })

    document.body.appendChild(self.el)
  }

  /**
   * Set contents for footer zone.
   *
   * @param {String} content
   */
  setFooterZone(content) {
    this.el.querySelector('footer').appendChild(content)
  }

  getFooterZone() {
    return this.el.querySelector('footer')
  }

  show() {
    this.el.classList.add('open')
  }

  hide() {
    this.el.classList.remove('open')
  }
}

export default Sidebar
