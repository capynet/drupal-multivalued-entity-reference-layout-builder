export interface IAppParams {
  get(key: string): {} | []
}

export interface ILiveLayoutMiniMap {
  rendered: HTMLElement
  render(): HTMLElement
}

export interface ILayoutBuilder {
  realContainer: HTMLElement

  setup(el: Element, json: {}): void

  init(): void

  toJSON(): void

  registerSidebarZones(): void

  handleActions(): void
}

export interface IUtils {
  htmlFragment(el: string): HTMLElement

  setDefaultElementConf(el: HTMLElement, conf: {}, reset?: boolean): void

  setElementConf(el: Element, conf: {}, reset?: boolean): void

  getDefaultElementConf(el: HTMLElement): { cols?, marginBottom?, rowStructure?, noGutter? }

  getElementConf(el: HTMLElement): { cols?, marginBottom?, rowStructure?, noGutter?, structure? }

  getCssVar(cssVarName: string): string
}

export interface IUserTracker {
}

export interface IQuickLinks {
  init(layoutBuilder?: ILayoutBuilder): void

  show(): void

  hide(): void

  actions(): void
}

export interface IFormOptionHandlers {
  setHandler(el: HTMLElement, input: Element): void

  marginBottomHandler(el: HTMLElement, input: HTMLInputElement): void

  applyVisualMarginBottom(el: HTMLElement, margin: number): void

  //  rowStructure(el: HTMLElement, formContainer: RadioNodeList): void

  applyVisualColStructure(el: HTMLElement): void

  removeRow(el: HTMLElement, input: HTMLInputElement): void

  //  removeComponent(el: HTMLElement, input: HTMLInputElement): void

  noGuttersHandler(el: HTMLElement, formContainer: RadioNodeList): void

  applyVisualNoGutters(el: HTMLElement): void
}

export interface IAPPEvents {
  on(eventName: string, cb: Function): void

  off(eventName: string, cb: Function): void

  fire(eventName: string, params?: any[]): void

  _callbacksAreTheSame(a: Function, b: Function): void
}

export interface IGrid {
  json: {}

  init(json: any[]): void

  render(base: HTMLElement, attachComponents: "placeholders" | boolean, buildId: string): HTMLElement

  newRow(colConf: {}, options?: {
    addConfigLayer: boolean,
    applyVisualConfig: boolean
  }): HTMLElement

  newCol(colConf: {}, options?: {
    addConfigLayer: boolean,
    applyVisualConfig: boolean
  }): HTMLElement

  newCompPlaceholder(): HTMLElement

  newComp(compConf: {}, options?: {
    addConfigLayer: boolean,
    applyVisualConfig: boolean
  }): HTMLElement
}

export interface ILiveLayoutManager {
  rendered: HTMLElement
  layoutWrapper: HTMLElement

  getLayoutCells(): NodeListOf<Element>

  linkCols(): void

  makeLiveLayoutSortable(): void

  updateSortableColsOnLiveLayout(): void

  render(): HTMLElement
}

export interface IConfigManager {
  addConfigLayer(type: string, el: Element, tplContextualMenu: HTMLElement, tplContextualForm: HTMLElement, formParams?: {}): void

  removeConfigLayer(el: HTMLElement): void

  renderConfigForm(el: HTMLElement, formTpl: HTMLElement, formTplOpts: {}): HTMLElement

  addFormInputHandlers(el: HTMLElement, form: HTMLElement): void

  setFormInputDefaults(el: HTMLElement, form: HTMLElement): void

  handleDeactivation(): void

  applyVisualConfig(el: Element, config: {}): void

  cleanVisualConfig(el: HTMLElement): void
}

export interface IComponentsManager {
  init(container: Element): void

  components: NodeListOf<HTMLElement>

  processComponent(componentEl: HTMLElement): void;

  cleanComponents(): void;
}

export interface ISidebar {
  el: HTMLElement

  setFooterZone(content: HTMLElement): void;

  getFooterZone(): HTMLElement;

  render(): void;

  show(): void;

  hide(): void;
}

export interface ISerialization {
  toJSON(liveLayout: HTMLElement): any[]
}

export interface ICurrentOnEdit {
  type: string
  el: string
  form: string
}
