---
layout: post
title: MunkiReport Setup Tweaks
categories: macOS MunkiReport
---

# MunkiReport Setup

I wanted to share some quick tips of things I've learned over the past year that help you utilize some of the lesser known config options for MunkiReport. I primarly use the Git method of installation, but some of these things will be helpful if you simply download the project as well.

## Create a Separate Directory/Repo for Your Configuration Files

Arjen has done a great job of separating MunkiReport files from the configuration of these files, so my first tip is **don't store any of the config in the MunkiReport directory**.

If your files live at:

```bash
/usr/local/munkireport
```

Create:

```bash
/usr/local/munkireport-config
```

Once it's in a separate directory, it is much easier to source control.

## Use Symlinks for `.env` and `composer.local.json`

Move your `.env` file to `/usr/local/munkireport-config/.env` and then create a symlink back to the MunkiReport root.

```bash
ln -s /usr/local/munkireport/.env /usr/local/munkireport-config/.env
```

Not everyone is in need of `composer.local.json`, but if you are installing other modules with composer, you probably should be using it. Move it to your config directory as well.

```bash
ln -s /usr/local/munkireport/composer.local.json /usr/local/munkireport-config/composer.local.json
```

## Copy Your Local Folder and Store with Your Configuration

As of MunkiReport 4.0, the configuration has moved from `config.php` to `.env` and a `local` directory. The `local` directory contains things like certs, users, dashboards, module_configs, etc.

By default this simply lives in the MunkiReport root directory. However, we can configure this directory location by the `LOCAL_DIRECTORY_PATH` within our `.env` file. This way we do not need a symlink and still keep our configuration out of the root.

Copy `/usr/local/munkireport/local/` to `/usr/local/munkireport-config/local/` and then edit `.env` to contain this line:

```bash
LOCAL_DIRECTORY_PATH="/usr/local/munkireport-config/local/"
```

## Add Custom Modules

### With Composer

A lot of [custom modules](https://github.com/munkireport/munkireport-php/wiki/Modules#unofficialbeta-modules) are available via Composer. You can add modules easily to your `composer.local.json` by running this command:

```bash
COMPOSER=composer.local.json composer require joncrain/manifests
```

(where `joncrain/manifest` is the name of the [Packagist repository](https://packagist.org/packages/joncrain/manifests))

If you are utilizing this method, make sure that your `MODULE_SEARCH_PATHS` contain the full paths to the vendors folder:

```bash
MODULE_SEARCH_PATHS="/usr/local/munkireport/vendor/tuxudo/, /usr/local/munkireport/vendor/joncrain/"
```

### Without Composer

If you are downloading the modules, then create a directory in `/usr/local/munkireport-config/custom_modules` as well and add it to your search paths:

```bash
MODULE_SEARCH_PATHS="/usr/local/munkireport-config/custom_modules/, /usr/local/munkireport/vendor/tuxudo/, /usr/local/munkireport/vendor/joncrain/"
```

Also remember that any module in the `MODULE_SEARCH_PATHS` will take precedence over the built in modules. This can be handy when trying newer versions that have not been merged into core yet!

## Conclusion

As always, hit me up on Slack if you have more questions or more tips to share! Hopefully this is helpful for some!