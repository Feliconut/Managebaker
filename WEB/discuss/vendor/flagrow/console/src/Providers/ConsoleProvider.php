<?php

namespace Flagrow\Console\Providers;

use Flagrow\Console\Listeners\ConfigureConsole;
use Flarum\Foundation\AbstractServiceProvider;
use Illuminate\Console\Scheduling\Schedule;

class ConsoleProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->app->singleton(Schedule::class);

        $this->app->make('events')->subscribe(ConfigureConsole::class);
    }

    public function provides()
    {
        return [Schedule::class];
    }
}
