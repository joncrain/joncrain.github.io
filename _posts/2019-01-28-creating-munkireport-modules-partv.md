---
layout: post
title: Creating MunkiReport Modules Part 5
categories: macOS MunkiReport
---

# Processing the Data

If you have been following along with the tutorial, we should now have a module installed on a client that is pushing data to our server. Now we need to make sure that the server is ready to do something with the data. Our primary focus in this article will be on `awesome_model.php`, which is unsurprisingly the model component of the [MVC framework](https://en.wikipedia.org/wiki/Model–view–controller), which will manage the data of the module. But before we get to the model, we need to first make sure that we have a table in the database to put it.

## Creating the Table - (Migration)

 While earlier versions of MunkiReport created the table within the model, the current version creates tables via a database migration which utilizes the [Laravel migration framework](https://laravel.com/docs/5.7/migrations). When we initially created the module from the template, a migrations folder and file was created. The file will look like this:

```php
<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Capsule\Manager as Capsule;

class AwesomeInit extends Migration
{
    public function up()
    {
        $capsule = new Capsule();
        $capsule::schema()->create('awesome', function (Blueprint $table) {
            $table->increments('id');
            $table->string('serial_number')->unique();
            $table->string('item1');
            $table->integer('item2');

            $table->index('item1');
            $table->index('item2');
        });
    }

    public function down()
    {
        $capsule = new Capsule();
        $capsule::schema()->dropIfExists('awesome');
    }
}
```

Luckily, the file contains the majority of what we need for a successful migration. We just need to correct the names and types of data that we would like to have in our table. 

The first field is the `id` field which we can just leave alone. 

The second is the `serial_number`, which is most likely going to be used to join different tables together. The decision must be made  whether there will be one record per machine, or if there will be many records for each machine. If you have many records, make sure to take out the unique constraint. In our example, we may have many launch daemons, so we need to remove it so that it is simply `$table->string('serial_number');`. 

We then need to create the rest of our fields and assign them the proper type based on the values that will be stored in them.

```php
$table->increments('id');
$table->string('serial_number');
$table->boolean('disabled');
$table->string('groupname');
$table->string('inetd_compatibility');
$table->boolean('keep_alive');
$table->string('label');
$table->string('name');
$table->boolean('on_demand');
$table->string('path');
$table->string('process_type');
$table->string('program');
$table->string('program_arguments');
$table->string('queue_directories');
$table->string('root_directory');
$table->boolean('run_at_load');
$table->integer('start_interval');
$table->string('start_on_mount');
$table->string('stderr_path');
$table->string('stdout_path');
$table->string('username');
$table->string('watch_paths');
$table->string('working_directory');
```

You are also able to define indexes for the table. Indexes speed up queries, but result in slower writes. MySQL can have up to 64 indexed columns. You cannot index big integers or text or blobs. Generally only the fields that are used in widgets or listings should be indexed, if they can be. _(thanks to tuxudo and bochoven for this information!)_

If the table needs to be altered in the future (new/remove field, change names, change type, etc.), a new migration must be created. More instructions concerning this can be found on the [MunkiReport wiki](https://github.com/munkireport/munkireport-php/wiki/How-to-create-a-migration).

## Understanding the Model

Now let's turn our attention toward the model and take a look at the file that was generated for us. Ignoring the comments and the actual functions, we get the following:

```php
<?php

use munkireport\models\MRModel as Eloquent;

class awesome_model extends Eloquent
{
    protected $table = 'awesome';

    protected $fillable = [
      'serial_number',
      'item1',
      'item2',
    ];

    public $timestamps = false;

}
```

### Creating a New Class

The first thing this file does is extends the `Model` class by creating the `awesome_model` class. We will change the lowercase `a` to uppercase `A` to follow the [PSR-0 Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md#1-overview). There is no style police for the project, but we want the code to look similar, so be polite and check out other modules or simply ask.

```php
class Awesome_model extends Eloquent
```

#### Defining Models

MunkiReport has recently changed to the [Eloquent](https://laravel.com/docs/7.x/eloquent#eloquent-model-conventions) model. In this model a table is defined with `protected $table = 'awesome';` which has been created for us. After that, the `$fillable` array tells us what items in the table can be mass-assigned.

```php
    protected $fillable = [
      'serial_number',
      'disabled',
      'groupname',
      'inetd_compatibility',
      'keep_alive',
      'label',
      'name',
      'on_demand',
      'path',
      'process_type',
      'program',
      'program_arguments',
      'queue_directories',
      'root_directory',
      'run_at_load',
      'start_interval',
      'start_on_mount',
      'stderr_path',
      'stdout_path',
      'username',
      'watch_paths',
      'working_directory',
    ];

    public $timestamps = false;
}
```

## Processor

The processor will vary a bit more based on what kind of data is sent in the postflight. The basic concept is that you need to read the data in, replace (or write more data) and save it back to the table.

```php
<?php

use munkireport\processors\Processor;

class Awesome_processor extends Processor
{
    public function run($data)
    {
        $modelData = ['serial_number' => $this->serial_number];

		// Parse data
        $sep = ' = ';
		foreach(explode(PHP_EOL, $data) as $line) {
            if($line){
                list($key, $val) = explode($sep, $line);
                $modelData[$key] = $val;
            }
		} //end foreach explode lines

        awesome_model::updateOrCreate(
            ['serial_number' => $this->serial_number], $modelData
        );
        
        return $this;
    }   
}
```

## Troubleshooting

You may run into issue with trying to get the correct data in the correct place.

### Go back to the source

You are processing the data from the file we created in `/usr/local/munkireport/scripts/cache/` so make sure that the data is there to begin with. 

### Caching

Remember that MunkiReport [caches the data](https://github.com/munkireport/munkireport-php/wiki/How-to-create-a-module#caching) and only sends if the data has changed. If you make changes and want to try sending again, the hash of the file must change, so be sure to alter the data (manually if needed) and then run the following command to send it:

```bash
sudo /usr/local/munkireport/munkireport-runner
```

### Debugging

If you have print statements in the model, they should print out during the postflight run.

### SQL

Because we have not created to view the data at this point, make sure that you are comfortable returning data from the database whether that be from the command line or a GUI application.

## Conclusion

There is a lot of information here and it's as much for me as it is for everyone else. Hope that this is helpful, and if any corrections are needed or questions arise, please let me know on Slack!

## More in this Series

* [Part 1]({% post_url 2018-11-30-creating-munkireport-modules %}) Getting Started
* [Part 2]({% post_url 2018-12-03-creating-munkireport-modules-partii %}) Module Structure
* [Part 3]({% post_url 2018-12-05-creating-munkireport-modules-partiii %}) Module Deployment
* [Part 4]({% post_url 2018-12-06-creating-munkireport-modules-partiv %}) Gathering the Data
* *[Part 5]({% post_url 2019-01-28-creating-munkireport-modules-partv %}) Processing the Data*
* [Part 6]({% post_url 2019-08-24-creating-munkireport-modules-partvi %}) Presenting the Data - Listing