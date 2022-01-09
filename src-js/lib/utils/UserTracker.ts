import { IUserTracker, ICurrentOnEdit, IAPPEvents } from "../../interfaces";
import { inject, injectable } from "inversify";
import TYPES from "../../types";

/**
 * Centralizes anc keep the track of the user over all layout actions.
 */
@injectable()
class UserTracker implements IUserTracker {
  currentOnEdit: ICurrentOnEdit

  constructor(@inject(TYPES.events) private events: IAPPEvents) {
    this.trackActiveConfigClicks()
    this.currentOnEdit = null
  }

  /**
   * When a user edit some item options we track it and when it clicks
   * outside the config form or the item it fires an event to react.
   */
  trackActiveConfigClicks() {
    const self = this

    self.events.on('item.conf.active', function (type, el, form) {

      // If there is an active config form, finish it.
      if (self.currentOnEdit !== null) {
        self.events.fire('item.conf.deactivate', [
          self.currentOnEdit.type,
          self.currentOnEdit.el,
          self.currentOnEdit.form,
          true
        ])

        self.currentOnEdit = null
      }

      /**
       * Checks user clicks over all body checking
       * if we should close the config form.
       * @param e
       */
      const checkerFn = function (e) {
        const target = e.target

        const clickedInsideItem: Boolean = el.isEqualNode(target) || target.closest(`[data-dom-uuid="${el.dataset.domUuid}"]`) !== null
        const clickedInsideForm: Boolean = form.isEqualNode(target) || target.closest(`[data-dom-uuid="${form.dataset.domUuid}"]`) !== null
        const clickedZoneContent: Boolean = target.classList.contains('zone-contents')
        const clickedNewTriggerConf: Boolean = target.closest(`[data-config-element-trigger]`) !== null

        if ((!clickedInsideItem && !clickedInsideForm && !clickedZoneContent) || clickedNewTriggerConf) {
          document.removeEventListener('mouseup', checkerFn)
          self.events.fire('item.conf.deactivate', [type, el, form])
          self.currentOnEdit = null
        }
      }

      document.addEventListener('mouseup', checkerFn)

      // indicate the active config form.
      self.currentOnEdit = {type, el, form}
    })
  }
}

export default UserTracker
