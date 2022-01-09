<?php

namespace Drupal\nppe_pel\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controls ajax requests.
 */
class NppePelController extends ControllerBase {

  /**
   * Stores a serialized layout into an entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to be saved.
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   The client response.
   *
   * @throws \Drupal\Core\Entity\EntityStorageException
   */
  public function storeLayout(EntityInterface $entity, Request $request) {
    $layout = $request->request->get('layout');

    $entity->set('nppe_pel_layout', Json::encode($layout));
    $entity->save();
    return new JsonResponse();
  }

}
