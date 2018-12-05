---
layout: post
title: Creating MunkiReport v3 Modules Part 3
categories: macOS MunkiReport
---

[Part 1]({% post_url 2018-11-30-creating-munkireport-modules %}) Getting Started
[Part 2]({% post_url 2018-12-03-creating-munkireport-modules-partii %}) Module Structure

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

Once you check again, you may get a warning that your package has a similar name to another package, and if you're ok with that just continue. It will do more magic and you will see this:

![packagist]({{ site.url }}/images/packagist.png){:height="100%" width="100%"}

Once we add our release to Packagist we are able to require our module by running the following command to add it to our `composer.local.json`:

```sh
COMPOSER=composer.local.json composer require joncrain/awesome:^1.0
```