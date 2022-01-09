import tplQuickLinks from '../templates/misc/preview-quicklinks.handlebars'
import { IAPPEvents, IQuickLinks, IUtils } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

/**
 * Represents a set of links displayed when the user enters in the preview mode.
 */
@injectable()
class PreviewQuickLinks implements IQuickLinks {
  quickLinks: HTMLElement

  constructor(
    @inject(TYPES.events) private events: IAPPEvents,
    @inject(TYPES.utils) private utils: IUtils,
  ) {
  }

  init(): void {
    // @todo can we avoid Drupal here to keep this solution agnostic?
    const currentTakenSpace = window.Drupal.displace()
    this.quickLinks = document.body.appendChild(this.utils.htmlFragment(tplQuickLinks()))
    this.quickLinks.style.bottom = `${currentTakenSpace.bottom}px`;
    this.actions()
  }

  show() {
    this.quickLinks.classList.add('open')
  }

  hide() {
    this.quickLinks.classList.remove('open')
  }

  actions() {
    const self = this
    this.quickLinks.querySelectorAll('[data-action]').forEach(function (input: HTMLInputElement, i) {

      switch (input.dataset.action) {
        case 'exit-preview':
          input.addEventListener('click', function (e) {
            self.events.fire('exit.preview')
          })
          break
        case 'reveal-grid':
          input.addEventListener('click', function (e) {
            input.classList.toggle('btn-light')
            input.classList.toggle('btn-success')
            document.body.classList.toggle('live-layout-preview-mode-reveal-grid')
          })
          break
      }
    })
  }

}

export default PreviewQuickLinks
