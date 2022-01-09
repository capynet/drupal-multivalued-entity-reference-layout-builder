<?php

/**
 * @file
 * Hooks specific to the NPPE PEL module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Allows to modify the default representation of a component in PEL.
 *
 * @param array
 *   The render array of the component to be used by NPPE PEL
 */
function hook_pel_component_representation_alter(array &$component) {
  if (isset($component['#paragraph']) && $component['#paragraph']->bundle() === 'forms') {
    $title = $component['field_c_view_view'][0]['contents']['#view']->display_handler->default_display->options['title'];

    $component['field_c_view_view'] = [
      '#type' => 'markup',
      '#markup' => t('No preview available for "Form component" (<strong>' . $title . '</strong> list).'),
    ];
  }
}

/**
 * @} End of "addtogroup hooks".
 */
