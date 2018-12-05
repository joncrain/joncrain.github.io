---
layout: post
title: Creating MunkiReport v3 Modules Part 2
categories: macOS MunkiReport
---

In [part I](2018-11-30-creating-munkireport-modules) we made an awesome module. Or we made the framework for an awesome module. Or really we got ourselves ready to make an awesome module with the awesome built in MunkiReport tools. In this article, we deep dive into the module itself.

# Module Structure

## File Structure

First, let's take a look at exactly what the MunkiReport `addmodule.sh` script did for us:

```
awesome
└──locales
    └── en.json
└── migrations
    └── 2018_12_04_234243_awesome_init.php
└── scripts
    ├── awesome.sh
    ├── install.sh
    └── uninstall.sh
└── views
    ├── awesome_listing.php
    ├── awesome_report.php
    └── awesome_widget.php
├── awesome_controller.php
├── awesome_model.php
├── composer.json
└── provides.php
```

This is an awesome looking module.

Let's get an overview of what everything is.

### Locales

I had a few years of Spanish in high school mixed with a semester of French in college, which leaves me relying on other people to fill up this directory for me! Basically any user facing text strings need to be provided via the i18n localization framework and stored in the proper language `json` file in the directory.

### Migrations

MunkiReport relies on the [Laraval Migrations Framework](https://laravel.com/docs/5.6/migrations) to manage database table creation and updating. This file is full of magic and unicorns.

### Scripts

These define how the module is deployed to the client, and how exactly the client pulls the right information.

* `install.sh` - how the script is deployed/installed
* `uninstall.sh` - how the script is uninstalled
* `awesome.sh` - defaults to shell script, but this could be python or really anything other kind of script

### Views

There are a number of different types of views, and a module can have as many or as little as you want! By default a listing, report, and widget are created by the `addmodule.sh` script. (The following list shows generally what they are used for, but the actual file that controls where they are defined is the `provides.php` file.)

* listing - will show up under the Listings heading
* report - will show up under the Reports heading
* admin - will show up under the Admin heading
* tab - will show up as a new tab under the client view
* widget - creates a widget that can be used on the dashboard or report page

### `awesome_controller.php`

The controller file defines how the data is parsed out of the database into a format that the views can then display.

### `awesome_model.php`

The model file does the work of pulling the data out of the database.

### `composer.json`

There is more magic behind this file, but for now we'll say it's just `json` data of the module name, description and license.

# Module Deployment Process

For years, modules have been included into the core of MunkiReport. It has lowered the bar for admins to simply install and have things work, but it has slowed development of both the core and modules as the complexity and pace of development has risen. Adding custom modules has always been possible, but decoupling modules from the core truly allows us to have a supported workflow for adding and updating modules outside of the MunkiReport repo.

_The process outlined below may not be for everyone. It is not a prereq to creating your own modules. Some may find in useful in certain situations, but it is by no means necessary!_

The process utilizes [Composer](https://getcomposer.org), [GitHub](https://github.com), and [Packagist](https://packagist.org).

## Composer

Composer is a dependency manager for PHP.

Cool.

We don't really have to worry about this at the moment. MunkiReport uses it in the background. Occasionally we need to run `composer`, but we'll discuss that later.

## GitHub

First of all, if you don't have an account, go make one. Modules are now separated into their own [dedicated repo](https://github.com/new). Simple enough to do:

![new-repo]({{ site.url }}/images/new-repo.png){:height="100%" width="100%"}

Create the repository sans readme and license and then run:

```sh
git init
git add .
git commit -m "First commit"
git remote add origin https://github.com/IsabellaCommunitySportsplex/awesome.git
git push -u origin master
```

Once the module is functional we will create a release for this module:

![new-release]({{ site.url }}/images/new-release.png){:height="100%" width="100%"}

## Packagist

Packagist is the main Composer repository. To add our release to Packagist, submit the package here: https://packagist.org/packages/submit

Add the link to the GitHub repo in the Repository URL and click submit. You may see this:

![submit-package-fail]({{ site.url }}/images/submit-package-fail.png){:height="70%" width="70%"}

Oh noes! Will I actually have to talk to Bochoven?! Well, if you want it to be part of the MunkiReport repositories, yes. But luckily, we just need to change this line in our `composer.json` file for the repo:

```json
"name": "munkireport/awesome",
```

To our namespace:

```json
"name": "joncrain/awesome",
```

Once you check again, you may get a warning that your pacakge has a similar name to another package, and if you're ok with that just continue. It will do more magic and you will see this:

![packagist]({{ site.url }}/images/packagist.png){:height="100%" width="100%"}

Once we add our release to Packagist we are able to require our module by running the following command to add it to our `composer.local.json`:

```sh
COMPOSER=composer.local.json composer require joncrain/awesome:^1.0
```