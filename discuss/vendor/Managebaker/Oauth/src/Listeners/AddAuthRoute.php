<?php

namespace Managebaker\Oauth\Listeners;

use Managebaker\Oauth\Controllers\PassportController;
use Flarum\Event\ConfigureForumRoutes;
use Illuminate\Contracts\Events\Dispatcher;

class AddAuthRoute
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureForumRoutes::class, [$this, 'configureForumRoutes']);
    }

    /**
     * @param ConfigureForumRoutes $event
     */
    public function configureForumRoutes(ConfigureForumRoutes $event)
    {
        $event->get('/auth/managebaker', 'auth.managebaker', PassportController::class);
    }
}
