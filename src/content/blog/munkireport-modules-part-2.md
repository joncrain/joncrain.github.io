---
title: 'Creating MunkiReport Modules Part 2'
description: 'Deep dive into MunkiReport module structure including locales, migrations, scripts, views, and the MVC components.'
pubDate: '2018-12-03'
tags: ['macOS', 'MunkiReport']
---

In [part I](/blog/munkireport-modules-part-1/) we made an awesome module. Or we made the framework for an awesome module. Or really we got ourselves ready to make an awesome module with the awesome built in MunkiReport tools. In this article, we deep dive into the module itself.

# Module Structure

## File Structure

First, let's take a look at exactly what the MunkiReport `addmodule.sh` script did for us:

```
awesome
└──locales
    └── en.json
└── migrations
    └── 2020_04_04_234243_awesome_init.php
└── scripts
    ├── awesome.sh
    ├── install.sh
    └── uninstall.sh
└── views
    ├── awesome_listing.yml
    ├── awesome_report.yml
    ├── awesome_tab.php
    └── awesome_widget.yml
├── awesome_controller.php
├── awesome_model.php
├── awesome_processor.php
├── composer.json
└── provides.yml
```

This is an awesome looking module.

Let's get an overview of what everything is.

### Locales

I had a few years of Spanish in high school mixed with a semester of French in college, which leaves me relying on other people to fill up this directory for me! Basically any user facing text strings need to be provided via the i18n localization framework and stored in the proper language `json` file in the directory.

### Migrations

MunkiReport relies on the [Laraval Migrations Framework](https://laravel.com/docs/5.6/migrations) to manage database table creation and updating. We will look a creating the migration in [Part 5](/blog/munkireport-modules-part-5/).

### Scripts

These define how the module is deployed to the client, and how exactly the client pulls the right information.

* `install.sh` - how the script is deployed/installed
* `uninstall.sh` - how the script is uninstalled
* `awesome.sh` - defaults to shell script, but this could be python or any other type of script that can gather data and store it in a file to ship to the server. The result should be a file in the `/usr/local/munki/preflight.d/cache` directory.

### Views

There are a number of different types of views, and a module can have as many or as little as it wants! By default a listing, report, and widget are created by the `addmodule.sh` script. (The following list shows generally what they are used for, but the actual file that controls where they are defined is the `provides.yml` file.)

* listing - will show up under the Listings heading

  ![listings](/images/listings.png)
* report - will show up under the Reports heading

  ![reports](/images/reports.png)
* admin - will show up under the Admin heading (not quite available at this time, but will be coming soon!)
* tab - will show up as a new tab under the client view

  ![tab](/images/tab.png)
* widget - creates a widget that can be used on the dashboard or report page

### `awesome_controller.php`

The controller file defines how the data is parsed out of the database into a format that the views can then display.

### `awesome_model.php`

The model file does the work of pulling the data out of the database.

### `awesome_processor.php`

The processor file helps in ingesting the data that the client is sending into the database.

### `composer.json`

There is more magic behind this file, but for now we'll say it's just `json` data of the module name, description and license.

## More in this Series

* [Part 1](/blog/munkireport-modules-part-1/) Getting Started
* *[Part 2](/blog/munkireport-modules-part-2/) Module Structure*
* [Part 3](/blog/munkireport-modules-part-3/) Module Deployment
* [Part 4](/blog/munkireport-modules-part-4/) Gathering the Data
* [Part 5](/blog/munkireport-modules-part-5/) Processing the Data
* [Part 6](/blog/munkireport-modules-part-6/) Presenting the Data - Listing
