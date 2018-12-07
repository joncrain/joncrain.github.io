---
layout: post
title: Creating MunkiReport v3 Modules Part 2
categories: macOS MunkiReport
---

In [part I]({% post_url 2018-11-30-creating-munkireport-modules %}) we made an awesome module. Or we made the framework for an awesome module. Or really we got ourselves ready to make an awesome module with the awesome built in MunkiReport tools. In this article, we deep dive into the module itself.

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
* admin - will show up under the Admin heading (not quite available at this time, but will be coming soon!)
* tab - will show up as a new tab under the client view
* widget - creates a widget that can be used on the dashboard or report page

### `awesome_controller.php`

The controller file defines how the data is parsed out of the database into a format that the views can then display.

### `awesome_model.php`

The model file does the work of pulling the data out of the database.

### `composer.json`

There is more magic behind this file, but for now we'll say it's just `json` data of the module name, description and license.