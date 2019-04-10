<?php

Namespace Empewoow\AuthRedirect;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
  $events->subscribe(Listener\AddClientAssets::class);
  $events->subscribe(Listener\AddAuthAttribute::class);
};
