<?php

namespace Drupal\nppe_pel;

use Drupal\Component\Serialization\Json;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Field\EntityReferenceFieldItemList;
use Drupal\Core\Render\Element;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Template\Attribute;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Main class for layout manipulation.
 */
class NppePelRenderer implements ContainerInjectionInterface {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * Creates a new NppePelRenderer instance.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Session\AccountInterface $current_user
   *   The current user.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, AccountInterface $current_user) {
    $this->entityTypeManager = $entity_type_manager;
    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('current_user')
    );
  }

  /**
   * Builds the PEL render array structure.
   *
   * @param array $build
   *   The original entity render array.
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   The entity to render.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function buildView(array &$build, ContentEntityInterface $entity) {
    $bundle_type = $entity->getEntityType()->getBundleEntityType();
    $entity_type = $this->entityTypeManager->getStorage($bundle_type)->load($entity->bundle());
    $plb_enabled = (bool) $entity_type->getThirdPartySetting('plb', 'enabled', FALSE);
    $plb_field_name = $entity_type->getThirdPartySetting('plb', 'field_name', '');

    if (!$plb_enabled || empty($plb_field_name)) {
      return;
    }

    $item_list = $entity->get($plb_field_name);

    if (!$item_list instanceof EntityReferenceFieldItemList) {
      return;
    }

    $components = $this->getComponentsFromEntity($entity->get($plb_field_name));

    if ($this->currentUser->hasPermission('use layout builder') && $entity->access('update')) {
      $route_name = \Drupal::routeMatch()->getRouteName();
      if ($route_name == 'entity.node.canonical') {
        $this->attachLayoutBuilder($build, $entity, $components);
      }
    }

    $this->renderLayout($build, $entity, $components);
  }

  /**
   * Finds and split a multivalued field into a render array.
   *
   * Returns a ready to render array with the entity id as key.
   *
   * @param \Drupal\Core\Field\EntityReferenceFieldItemList $item_list
   *   The multivalued field to process.
   *
   * @return array
   *   Array of inner entities of the multivalued field.
   */
  protected function getComponentsFromEntity(EntityReferenceFieldItemList $item_list) {
    $view_builder = $this->entityTypeManager->getViewBuilder($item_list->getFieldDefinition()
      ->getSetting('target_type'));
    $components = $view_builder->viewMultiple($item_list->referencedEntities(), 'full');
    $components_sorted = [];

    foreach (Element::children($components) as $pos) {
      $components[$pos]['#printed'] = FALSE;
      $renderable_entity = $view_builder->build($components[$pos]);
      $components_sorted[$components[$pos]["#paragraph"]->uuid()] = $renderable_entity;
    }

    return $components_sorted;
  }

  /**
   * Finds and split a multivalued field into a render array.
   *
   * @param array $components
   *   Array of inner entities of the multivalued field.
   *
   * @return array
   *   Array of entities with some sugar.
   * 
   * @todo is this for sending it to json structure?
   */
  protected function preprocessComponentsForLayoutBuilder(array &$components) {
    foreach (Element::children($components) as $pos) {
      // Prevent triggering any kind of js action while.
      // the component is at "drag" mode.
      $entity_uuid = $components[$pos]["#paragraph"]->uuid();
      $components[$pos]['#attributes']['data-component-id'] = $entity_uuid;

      // Let modules to alter their look&feel for presenting a component at the layout builder ui.
      \Drupal::moduleHandler()->alter('pel_component_representation', $components[$pos]);
    }

    return $components;
  }

  /**
   * Adds the layout builder layer to the entity.
   *
   * @param array $build
   *   Render array of the entity.
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   Processed entity.
   * @param array $components
   *   The components to attach.
   */
  protected function attachLayoutBuilder(array &$build, ContentEntityInterface $entity, array &$components) {
    $bundle_type = $build["#node"]->getEntityType()->getBundleEntityType();
    $entity_type = $this->entityTypeManager->getStorage($bundle_type)->load($entity->bundle());
    $pel_field_name = $entity_type->getThirdPartySetting('nppe_pel', 'field_name', '');

    $build[$pel_field_name]['#attributes'] = new Attribute(['data-is-pel' => TRUE]);

    $this->preprocessComponentsForLayoutBuilder($components);

    $build['layout_composer'] = [
      '#theme' => 'pel_builder',
      '#weight' => -1,
      '#sidebar' => [
        '#theme' => 'pel_builder_sidebar',
      ],
    ];

    $build['#attached']['drupalSettings']['nppe_pel'] = [
      'path' => Url::fromRoute('nppe_pel.save_layout', [
        'entity_type' => $entity->getEntityTypeId(),
        'entity' => $entity->id(),
      ], ['absolute' => TRUE])->toString(),

      // If we have a stored layout use it, other wise create a "standard" one of one row per component.
      // @todo check if default layout should be done at field processing instead here.
      'layout' => !$entity->nppe_pel_layout->isEmpty() ? Json::decode($entity->nppe_pel_layout->value) : $this->genDefaultLayout($components),
    ];

    $build['#attached']['library'][] = 'nppe_pel/nppe_pel';
  }

  /**
   * Generates a standard layout.
   *
   * It means a layout with a single row by component.
   *
   * @param $components
   *
   * @return array
   */
  function genDefaultLayout($components) {
    $layout = [];

    foreach ($components as $component) {
      $layout[] = [
        'conf' => [
          'cols' => 1,
        ],
        'cols' => [
          [
            'conf' => [],
            'components' => [
              ['id' => $component["#paragraph"]->uuid()],
            ],
          ],
        ],
      ];
    }

    return $layout;
  }

  /**
   * Renders the multivalued field through the layout if exists.
   *
   * @param array $build
   *   Render array of the entity.
   * @param \Drupal\Core\Entity\ContentEntityInterface $entity
   *   Processed entity.
   * @param array $components
   *   The components to attach.
   */
  protected function renderLayout(array &$build, ContentEntityInterface $entity, array $components) {
    // @todo should we provide a default layout? I think until user does not decides to use the builder we should not modify the output.
    $layout = !$entity->nppe_pel_layout->isEmpty() ? Json::decode($entity->nppe_pel_layout->value) : $this->genDefaultLayout($components);
    $bundle_type = $entity->getEntityType()->getBundleEntityType();
    $entity_type = $this->entityTypeManager->getStorage($bundle_type)->load($entity->bundle());
    $pel_field_name = $entity_type->getThirdPartySetting('nppe_pel', 'field_name', '');

    if ($layout) {
      // Override original field output with the "layouted" version.
      $build[$pel_field_name] = [
        '#theme' => 'pel_builder_rendered_layout',
        '#layout' => $layout,
        '#components' => $components,
      ];
    }
  }

}
