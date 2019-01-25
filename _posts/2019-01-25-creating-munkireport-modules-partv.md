---
layout: post
title: Creating MunkiReport Modules Part 5
categories: macOS MunkiReport
---

# Processing the Data

If you have been following along with the tutorial, we should now have a module that we are able to install on clients that is pushing data to our server. Now we need to make the server do something with the data. Our primary focus will be on our `awesome_model.php`, which is the file that defines the database and handles the incoming data processing. Let's take a look at this file that was generated for us. Ignoring the comments and the actual functions, we get the folowing:

```php
<?php
class awesome_model extends \Model {

    protected $restricted;

    function __construct($serial='')
    {
        ...
    }

    function process($data)
    {
        ...
    }
}
```

## Creating a New Class

The first thing this file does is extends the `Model` class by creating the `awesome_model` class. We will change the lowercase `a` to uppercase `A` to follow the [PSR-0 Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md#1-overview). There is no style police for the project, but we want the code to look similar, so be polite and check out other modules or simply ask.

```php
class Awesome_model extends \Model {
```

### Constructor Function

By default, the template gave us two functions. Let's look at each of these as well. The first is a `php` [constructor](http://php.net/manual/en/language.oop5.decon.php). Constructor's allow you to give an objects' properties values. The template has got us started, but we need to fill in a few gaps. For now, we know that we will have a new table called `awesome` with a primary key of `id`. Then when each machine checks in, it's record is created based on the serial number. I believe these first two fields will be in most modules. After that, we fill in the data from the json data that we will be importing.

```php
function __construct($serial='')
{
    parent::__construct('id', 'awesome'); //primary key, tablename
    $this->rs['id'] = '';
    $this->rs['serial_number'] = $serial;
    $this->rs['disabled'] = '';
    $this->rs['groupname'] = '';
    $this->rs['inetd_compatibility'] = '';
    $this->rs['keep_alive'] = '';
    $this->rs['label'] = '';
    $this->rs['name'] = '';
    $this->rs['on_demand'] = '';
    $this->rs['path'] = '';
    $this->rs['process_type'] = '';
    $this->rs['program'] = '';
    $this->rs['program_arguments'] = '';
    $this->rs['queue_directories'] = '';
    $this->rs['root_directory'] = '';
    $this->rs['run_at_load'] = '';
    $this->rs['start_interval'] = '';
    $this->rs['start_on_mount'] = '';
    $this->rs['stderr_path'] = '';
    $this->rs['stdout_path'] = '';
    $this->rs['username'] = '';
    $this->rs['watch_paths'] = '';
    $this->rs['working_directory'] = '';

    $this->serial = $serial;
}
```

### Process Function

The process function will vary a bit more based on what kind of data is sent in the postflight. 

```php
function process($data)
{
    // Check if data was uploaded
    if (! $json ) {
        print_r("Error processing manifests module: No JSON file found");
    } else {

        // Delete previous set
        $this->deleteWhere('serial_number=?', $this->serial_number);

        // Process json into object thingy
        $data = json_decode($json, true);

        // Copy default values
        $empty = $this->rs;

        foreach ($data as $key => $value) {
            // Reset values
            $this->rs = $empty;

            // traversing the json!
            $this->$key = $value;

            // save the data
            $this->id = '';
            $this->save();  
        }
    }
}
```

## More in this Series

* [Part 1]({% post_url 2018-11-30-creating-munkireport-modules %}) Getting Started
* [Part 2]({% post_url 2018-12-03-creating-munkireport-modules-partii %}) Module Structure
* [Part 3]({% post_url 2018-12-05-creating-munkireport-modules-partiii %}) Module Deployment
* [Part 4]({% post_url 2018-12-06-creating-munkireport-modules-partiv %}) Gathering the Data