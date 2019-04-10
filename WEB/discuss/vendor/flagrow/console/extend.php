<?php

namespace Flagrow\Console;

use Flarum\Extend\Compat;
use Flarum\Foundation\Application;

return [
    (new Compat(function (Application $app) {
        $app->register(Providers\ConsoleProvider::class);
    }))
];
