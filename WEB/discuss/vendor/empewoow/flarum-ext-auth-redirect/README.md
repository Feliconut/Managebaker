# Flarum extension: Auth Redirect

## Introduction

With this plugin you can remove the sign-up and log-in buttons. You can change the behavior of the logout URL through the admin panel. Also when a user is not logged in, the plugin will redirect the user to this desired URL, in the plugin settings, this URL is called the "Redirect URL".

Please note that this plugin is still a work in progress.

## Screenshot

![Flarum extension settings](/resources/docs/flarum_extension_settings.png)

## During development

Run in (js/forum):

```
npm install

gulp watch
```

When it is compiled, run in Flarum root:

```
composer update
```

Also, whenever you changed the source code, run `php flarum cache:clear` and reload the page.

## Installation through Packagist

The extension is also on [Packagist](https://packagist.org/packages/empewoow/flarum-ext-auth-redirect), so you should be able to install it using:

```
composer require empewoow/flarum-ext-auth-redirect
```
