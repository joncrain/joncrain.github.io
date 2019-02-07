---
layout: post
title: Creating MunkiReport Modules Part 2
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

MunkiReport relies on the [Laraval Migrations Framework](https://laravel.com/docs/5.6/migrations) to manage database table creation and updating. We will look a creating the migration in [Part 5]({% post_url 2018-01-28-creating-munkireport-modules-partv %}).

### Scripts

These define how the module is deployed to the client, and how exactly the client pulls the right information.

* `install.sh` - how the script is deployed/installed
* `uninstall.sh` - how the script is uninstalled
* `awesome.sh` - defaults to shell script, but this could be python or any other type of script that can gather data and store it in a file to ship to the server. The result should be a file in the `/usr/local/munki/preflight.d/cache` directory.

### Views

There are a number of different types of views, and a module can have as many or as little as you want! By default a listing, report, and widget are created by the `addmodule.sh` script. (The following list shows generally what they are used for, but the actual file that controls where they are defined is the `provides.php` file.)

* listing - will show up under the Listings heading
  ![listings]({{ site.url }}/images/listings.png){:height="70%" width="70%"}
* report - will show up under the Reports heading
  ![reports]({{ site.url }}/images/reports.png){:height="70%" width="70%"}
* admin - will show up under the Admin heading (not quite available at this time, but will be coming soon!)
* tab - will show up as a new tab under the client view
  ![tab]({{ site.url }}/images/tab.png){:height="70%" width="70%"}
* widget - creates a widget that can be used on the dashboard or report page

### `awesome_controller.php`

The controller file defines how the data is parsed out of the database into a format that the views can then display.

### `awesome_model.php`

The model file does the work of pulling the data out of the database.

### `composer.json`

There is more magic behind this file, but for now we'll say it's just `json` data of the module name, description and license.

## More in this Series

* [Part 1]({% post_url 2018-11-30-creating-munkireport-modules %}) Getting Started
* [Part 2]({% post_url 2018-12-03-creating-munkireport-modules-partii %}) Module Structure
* [Part 3]({% post_url 2018-12-05-creating-munkireport-modules-partiii %}) Module Deployment
* [Part 4]({% post_url 2018-12-06-creating-munkireport-modules-partiv %}) Gathering the Data
* [Part 5]({% post_url 2019-01-28-creating-munkireport-modules-partv %}) Processing the Data