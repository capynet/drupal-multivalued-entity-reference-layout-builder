import tpl from '../templates/misc/start-editor-quickLinks.handlebars'
import { ILayoutBuilder, IQuickLinks, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

/**
 * Represents a set of links displayed when the user enters in the preview mode.
 */
@injectable()
class StartEditorQuickLinks implements IQuickLinks {
  el: HTMLElement
  layoutBuilder: ILayoutBuilder

  constructor(
    @inject(TYPES.utils) private utils: IUtils,
  ) {

  }

  init(layoutBuilder) {
    this.layoutBuilder = layoutBuilder
    this.el = this.layoutBuilder.realContainer.appendChild(this.utils.htmlFragment(tpl()))
    this.actions()
  }

  show() {
    this.el.classList.add('open')
  }

  hide() {
    this.el.classList.remove('open')
  }

  actions() {
    const self = this
    this.el.querySelectorAll('[data-action]').forEach(function (input: HTMLInputElement, i) {

      switch (input.dataset.action) {
        case 'start-live-layout':
          input.addEventListener('click', function (e) {
            self.layoutBuilder.init()
          })

          input.addEventListener('mouseenter', function () {
            self.layoutBuilder.realContainer.classList.add('visual-editable-area')
          })

          input.addEventListener('mouseleave', function () {
            self.layoutBuilder.realContainer.classList.remove('visual-editable-area')
          })

          break
      }
    })
  }
}

export default StartEditorQuickLinks
