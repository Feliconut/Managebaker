<?php

namespace Managebaker\Oauth;

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\Routes('forum'))
        ->get('/auth/managebaker', 'auth.managebaker', Controllers\PassportController::class),

    (new Extend\Compat(function (Dispatcher $events) {
        $events->subscribe(Listeners\AddClientAssets::class);
    })),
];
