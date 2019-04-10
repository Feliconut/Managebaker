# Console by ![Flagrow logo](https://avatars0.githubusercontent.com/u/16413865?v=3&s=20) [Flagrow](https://discuss.flarum.org/d/1832-flagrow-extension-developer-group)

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/flagrow/console/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/flagrow/console.svg)](https://packagist.org/packages/flagrow/console) [![Total Downloads](https://img.shields.io/packagist/dt/flagrow/console.svg)](https://packagist.org/packages/flagrow/console) [![Join our Discord server](https://discordapp.com/api/guilds/240489109041315840/embed.png)](https://flagrow.io/join-discord)

Because you can't extend the default Flarum console commands, this package adds an alternate `php vendor/bin/flagrow` command that uses events to register new commands.

## Install

Use [Bazaar](https://discuss.flarum.org/d/5151-flagrow-bazaar-the-extension-marketplace) or install manually:

    composer require flagrow/console

## Usage

You don't have to enable the extension to use it.
Once installed, you can run commands from your install root like this:

    php flarum list

If you enable the extension, the `info` and `cache:clear` commands of Flarum will be loaded in the console application as well.

## Use in your extension

The real deal is using it in your own extension.
Simply require it in your extension `composer.json` file:

    "require": {
        "flagrow/console": "^0.2"
    },

And now listen for the `ConfigureConsoleApplication` event.
Have a look at the [AddFlarumCommands](src/Listeners/AddFlarumCommands.php) class.

Example implementations:
- [flagrow/serve](https://github.com/flagrow/serve)
- [flagrow/bazaar](https://github.com/flagrow/bazaar)

## Task Scheduling, cron jobs

To set a schedule, create a [Service Provider](https://laravel.com/docs/5.1/packages#service-providers) which
resolves the `Illuminate\Console\Scheduling\Schedule` through IoC, then use its methods to configure the schedule
for the command, see the [Task Scheduling documentation](https://laravel.com/docs/5.1/scheduling#defining-schedules).

Example implementations:
- [flagrow/bazaar](https://github.com/flagrow/bazaar)

## Security

If you discover a security vulnerability within Console, please send an email to the Flagrow team at security@flagrow.io. All security vulnerabilities will be promptly addressed.

Please include as many details as possible. You can use `php flarum info` to get the PHP, Flarum and extension versions installed.

## Links

- [Source code on GitHub](https://github.com/flagrow/console)
- [Report an issue](https://github.com/flagrow/console/issues)
- [Download via Packagist](https://packagist.org/packages/flagrow/console)

An extension by [Flagrow](https://flagrow.io/).
