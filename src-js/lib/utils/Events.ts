import { IAPPEvents } from "../../interfaces";
import { injectable } from "inversify";

/**
 * Manages events at class level.
 * Its a singleton since all app needs to be aware.
 *
 * @usage extend this class and use .on() .off() and .fire() at your main class.
 */
@injectable()
class Events implements IAPPEvents {
  private events: object

  constructor() {
    // Events definition list.
    this.events = {}
  }

  /**
   * Registers a callback for an event.
   *
   * @param eventName
   * @param cb
   */
  public on(eventName, cb) {
    const self = this
    if (!self.events.hasOwnProperty(eventName)) {
      self.events[eventName] = []
    }

    let cbAlreadyStored = false

    self.events[eventName].forEach(storedCb => {
      if (!cbAlreadyStored) {
        cbAlreadyStored = self._callbacksAreTheSame(storedCb, cb)
      }
    })

    if (!cbAlreadyStored) {
      self.events[eventName].push(cb)
    }
  }

  /**
   * Unregisters a callback for an event.
   *
   * @param eventName
   * @param cb
   */
  off(eventName, cb) {
    const self = this

    self.events[eventName].forEach(storedCb => {
      const same = self._callbacksAreTheSame(storedCb, cb)

      if (same) {
        delete self.events[eventName][cb] // @todo test this.
      }
    })
  }

  /**
   * Fires an event calling all registered callbacks.
   * @param eventName
   * @param params
   */
  fire(eventName: string, params: [any, any, HTMLElement]): void {
    const self = this

    if (self.events.hasOwnProperty(eventName)) {
      self.events[eventName].forEach(cb => cb(...params))
    }
  }

  /**
   *
   * @param a
   * @param b
   * @returns {boolean}
   * @private
   */
  _callbacksAreTheSame(a, b) {
    return a.toString() === a.toString()
  }

}

export default Events
