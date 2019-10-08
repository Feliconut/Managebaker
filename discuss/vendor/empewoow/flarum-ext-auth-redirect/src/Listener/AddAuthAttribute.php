<?php

namespace Empewoow\AuthRedirect\Listener;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Settings\SettingsRepositoryInterface;

class AddAuthAttribute {
  /**
   * @var SettingsRepositoryInterface
   */
  protected $settings;

  /**
   * @param SettingsRepositoryInterface $settings
   */
  public function __construct(SettingsRepositoryInterface $settings) {
    $this->settings = $settings;
  }

  /**
   * @param Dispatcher $events
   */
  public function subscribe(Dispatcher $events) {
    $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
  }

  public function prepareApiAttributes(PrepareApiAttributes $event) {
    if ($event->isSerializer(ForumSerializer::class)) {
      $event->attributes['auth_redirect_url'] = $this->settings->get('empewoow-flarum-auth-redirect.auth_redirect_url');
      $event->attributes['auth_logout_url'] = $this->settings->get('empewoow-flarum-auth-redirect.auth_logout_url');
      $event->attributes['auth_disable_login'] = $this->settings->get('empewoow-flarum-auth-redirect.auth_disable_login');
      $event->attributes['auth_disable_signup'] = $this->settings->get('empewoow-flarum-auth-redirect.auth_disable_signup');
      $event->attributes['auth_disable_change_email'] = $this->settings->get('empewoow-flarum-auth-redirect.auth_disable_change_email');
    }
  }
}
