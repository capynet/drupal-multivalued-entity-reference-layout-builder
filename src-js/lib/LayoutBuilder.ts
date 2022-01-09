import tplLayoutFormActions from './templates/misc/layout-form-actions.handlebars'
import { IAPPEvents, IComponentsManager, ILayoutBuilder, ILiveLayoutManager, IQuickLinks, IGrid, ISerialization, ISidebar, IUserTracker, IUtils, IAppParams } from "../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../types";

@injectable()
class LayoutBuilder implements ILayoutBuilder {
  pelContainer: HTMLElement
  realContainer: HTMLElement
  layoutPlaceholder: HTMLElement
  userTracker: any
  jsonLayout: any[]

  constructor(
    @inject(TYPES.componentsManager) private componentsManager: IComponentsManager,
    @inject(TYPES.startEditorQuickLinks) private startEditorQuickLinks: IQuickLinks,
    @inject(TYPES.sidebar) private sidebar: ISidebar,
    @inject(TYPES.grid) private grid: IGrid,
    @inject(TYPES.liveLayoutManager) private liveLayoutManager: ILiveLayoutManager,
    @inject(TYPES.events) private eventsInstance: IAPPEvents,
    @inject(TYPES.userTracker) private userTrackerInstance: IUserTracker,
    @inject(TYPES.previewQuickLinks) private previewQuickLinks: IQuickLinks,
    @inject(TYPES.serializer) private serializer: ISerialization,
    @inject(TYPES.utils) private utils: IUtils,
    @inject(TYPES.appParams) private appParams: IAppParams
  ) {
  }

  /**
   * Init function.
   */
  setup(pelContainer, jsonLayout) {
    const self = this
    self.pelContainer = pelContainer
    self.jsonLayout = jsonLayout
    self.realContainer = self.pelContainer.nextElementSibling as HTMLElement

    // Attach the launcher links.
    self.startEditorQuickLinks.init(self)
    self.previewQuickLinks.init()
  }

  init() {
    const self = this
    self.pelContainer.removeAttribute('hidden');
    self.realContainer.setAttribute('hidden', 'hidden')
    self.componentsManager.init(self.pelContainer.nextElementSibling)
    self.layoutPlaceholder = self.pelContainer.querySelector('[data-live-layout-placeholder]')
    self.grid.init(self.jsonLayout)
    self.sidebar.render()
    self.sidebar.show()
    self.registerSidebarZones()


    // Render layout/s
    self.layoutPlaceholder.appendChild(self.liveLayoutManager.render())

    self.handleActions()
  }

  /**
   * Encodes the layout into a JSON object.
   * @returns {*}
   */
  toJSON() {
    return this.grid.json
  }

  /**
   * Process all available contents placed at the sidebar.
   */
  registerSidebarZones() {
    const self = this

    // Declare tabs/zones
//    const defaultContent = self.utils.htmlFragment(tplAvailableRows({assetsPath: process.env.ASSETS_PATH, available_rows: self.appParams.get('available_rows')}));

//    self.sidebar.setZones([
//      {id: 'rows', label: 'Rows', defaultContent: defaultContent},
//    ])

    // Special zone designated to form actions.
    self.sidebar.setFooterZone(self.utils.htmlFragment(tplLayoutFormActions()))
  }

  /**
   * Trigger an event to this.$container to notify
   */
  handleActions() {
    const self = this
    let footerZone = self.sidebar.getFooterZone()

    footerZone.querySelector('.pel-save-layout').addEventListener('click', function (e) {
      const evt = new CustomEvent("layout.save", {detail: {jsonLayout: self.grid.json}});
      self.pelContainer.dispatchEvent(evt);
    })

    footerZone.querySelector('.pel-discard-layout').addEventListener('click', function (e) {
      const confirmSave = confirm('If you proceed, all modifications will be lost')

      if (confirmSave) {
        location.reload()
      }
    })

    self.sidebar.el.querySelector('.preview-layout').addEventListener('click', function (e) {
      document.body.classList.add('live-layout-preview-mode')
      self.sidebar.hide()
      self.previewQuickLinks.show()
    })

    // React when "exit preview" happens.
    self.eventsInstance.on('exit.preview', function () {
      document.body.classList.remove('live-layout-preview-mode')
      self.sidebar.show()
      self.previewQuickLinks.hide()
    })
  }
}


export default LayoutBuilder
