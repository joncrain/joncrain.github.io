---
layout: post
title: Creating Munkireport v3 Modules Part 1
categories: macOS munkireport
---

Recent changes with munkireport have decoupled the modules from the core of the munkireport project. Many thanks to Arjen van Bochoven (@bochoven) for all the hard work in bringing this to reality. I've seemed to pick an interesting time to learn how to create modules and I wanted to share some things I've learned along the way. Also big thanks to John Eberle (@tuxudo) and Zack McCauley (@zack_mccauley) for their help and patience getting me this far.

# Setup a Dev Environment

Coming into this process, I thought this would be a tough thing to get started. Turns out it's not! Actually this script will get one running for you:

```sh
#!/bin/bash

dev_site_root=~/Documents/munkireport
git clone https://github.com/munkireport/munkireport-php.git $dev_site_root
cd $dev_site_root

#### Choose the branch to load:
# git checkout master
git checkout wip
# git checkout tags/v3.2.6

git pull

echo '<?php' > config.php
echo 'AUTH_METHODS="NOAUTH"' > .env

composer install --no-dev --no-suggest --optimize-autoloader
# composer update --no-dev
# composer dumpautoload --optimize --no-dev
php database/migrate.php
# can someone fix the bluetooth module so we don't need this again?
php database/migrate.php
php -S localhost:8080 -t $dev_site_root/public
```

![munkireport]({{ site.url }}/images/munkireport.png){:height="70%" width="70%"}

Depending on your needs, you may want to add stuff to the `.env` or `config.php` file, but running as is will get you started with a dev site running at [http://localhost:8080](http://localhost:8080). Also, don't be afraid to walk through the commands one by one to understand what each one does.

To enroll a test machine (I just use my machine for this) run:
```
sudo /bin/bash -c "$(curl -s http://localhost:8080/index.php?/install)"
```
If you have your machine enrolled in another instance, you'll obviously need to change it back when you're done if you want it to check back in to that one.

I keep a script like this ready on my computer and make updates as needed to get my environment up and running quickly. I've been digging the built in terminal of VS Code lately and have the site running in one tab, with a couple of other terminal tabs open for other edits.

![vs-code]({{ site.url }}/images/vs-code.png){:height="80%" width="80%"}

# Create a Module from the Module Template

There is a (not well publicized) script for building modules located in the `build` directory. To utilize the script you need to:
* configure a custom module directory
* add the custom module directory to your `.env`
* call the `addmodule.sh` script from that directory using the new module name as the argument.

Here is an example script which will do it for you:
```sh
#!/bin/bash
dev_site_root=~/Documents/munkireport
module_name=awesome

cd $dev_site_root
mkdir custom_modules
cd custom_modules
##### this will edit the .env to add the full path to the custom_modules dir
echo "MODULE_SEARCH_PATHS=$(pwd)" >> ../.env
##### the actual script
../build/addmodule.sh $module_name
##### this will make sure that the module is loaded
echo "MODULES='$module_name'" >> ../.env
```
Your new module should be available at [http://localhost:8080/index.php?/show/listing/awesome/awesome](http://localhost:8080/index.php?/show/listing/awesome/awesome)!

![new-module]({{ site.url }}/images/new-module.png){:height="70%" width="70%"}

From here, take a look at [How to create a module](https://github.com/munkireport/munkireport-php/wiki/How-to-create-a-module) and [How to create a module (advanced)](https://github.com/munkireport/munkireport-php/wiki/How-to-create-a-module-%28advanced%29) and other wiki articles on how to get the data that you want. I will dig into this part a little more in upcoming articles.
