import { IComponentsManager } from "../../interfaces";
import { injectable } from "inversify";

/**
 * @docme
 */
@injectable()
class ComponentsManager implements IComponentsManager {
  public container: HTMLElement
  public components: NodeListOf<HTMLElement>

  constructor() {
  }

  init(container) {
    const self = this
    self.container = container
    self.components = container.querySelectorAll('[data-component-id]')

    // Process components.
    self.components.forEach((component) => {
      this.processComponent(component)
      this.cleanComponents()
    })
  }

  /**
   * Process a new component before it gets rendered.
   * @param component
   */
  processComponent(component: HTMLElement) {
    const self = this
  }

  /**
   * Parses all available components modifying their
   * attributes to avoid HTML collisions.
   *
   * @todo reccheck this afther the refactor.
   */
  cleanComponents() {
    //    const innerNodes = this.componentsContainer.querySelectorAll(':scope *')
    //
    //    for (let innerNode of innerNodes) {
    //
    //      // Find and replace any ID attribute with a generic name.
    //      if (innerNode.getAttribute('id')) {
    //        innerNode.setAttribute('id', 'component-pel--' + innerNode.getAttribute('id'))
    //      }
    //
    //      // @fixme this should be a business logic. Add a event trigger here to allow
    //      //   external scripts provide their own logic and move this script to a separated file.
    //      // Modify any blazy media element attributes to avoid "loading" feedback.
    //      if (innerNode.dataset.src) {
    //        innerNode.setAttribute('src', innerNode.dataset.src)
    //        innerNode.classList.remove('b-lazy')
    //        innerNode.parentElement.classList.remove('media--loading')
    //      }
    //
    //    }
  }

}

export default ComponentsManager
