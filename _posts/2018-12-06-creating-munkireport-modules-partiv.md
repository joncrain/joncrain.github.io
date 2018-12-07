---
layout: post
title: Creating MunkiReport v3 Modules Part 4
categories: macOS MunkiReport
---

* [Part 1]({% post_url 2018-11-30-creating-munkireport-modules %}) Getting Started
* [Part 2]({% post_url 2018-12-03-creating-munkireport-modules-partii %}) Module Structure
* [Part 3]({% post_url 2018-12-05-creating-munkireport-modules-partiii %}) Module Deployment

# Gathering the Data

I've also been helping with updating the [wiki](https://github.com/munkireport/munkireport-php/wiki) for MunkiReport, and there is already some good info on there about [doing this](https://github.com/munkireport/munkireport-php/wiki/How-to-create-a-module), so let's try to do something different and _unsupported_! MunkiReport can take any piece of parseable data, (a text file, plist, json, xml, etc.) to input into the MunkiReport database. So let's find the data we want to get and a way to get the data.

## What Data?

I'm guessing if you're reading this, you already have some information in mind that you want to add to MunkiReport. If you don't have something in mind, then take a look at the [issues](https://github.com/munkireport/munkireport-php/issues) or hop on Slack and ask people for advice. There are no shortages of ideas! For this one, I'm thinking LaunchAgents and LaunchDaemons.

## Osquery

I've had an interest in [osquery](https://osquery.io) ever since Facebook/Mike Arpaia open sourced it in 2014. It has a tool to get tons of information from the host and output in `json` format.

We are unfortunately implementing a dependency into our module, so this is probably not something that you want to actually do. **Don't do this**. This is only ~~for science~~ an exercise to expand some possibilities and see what trouble we can get in.

So let's do something simple on the query end of things: [find LaunchAgents and LaunchDaemons from default search paths](https://osquery.io/schema/3.3.0#launchd), which is super simple for osquery.

```sh
$ osqueryi --json 'SELECT * FROM launchd WHERE name NOT LIKE "com.apple%"'

[
  {"disabled":"","groupname":"","inetd_compatibility":"","keep_alive":"","label":"com.googlecode.munki.ManagedSoftwareCenter","name":"com.googlecode.munki.ManagedSoftwareCenter.plist","on_demand":"","path":"/Library/LaunchAgents/com.googlecode.munki.ManagedSoftwareCenter.plist","process_type":"","program":"","program_arguments":"/usr/local/munki/launchapp -a /Applications/Managed Software Center.app","queue_directories":"","root_directory":"","run_at_load":"","start_interval":"","start_on_mount":"","stderr_path":"","stdout_path":"","username":"","watch_paths":"","working_directory":""},
  {"disabled":"","groupname":"","inetd_compatibility":"","keep_alive":"","label":"com.googlecode.munki.MunkiStatus","name":"com.googlecode.munki.MunkiStatus.plist","on_demand":"","path":"/Library/LaunchAgents/com.googlecode.munki.MunkiStatus.plist","process_type":"","program":"","program_arguments":"/Applications/Managed Software Center.app/Contents/Resources/MunkiStatus.app/Contents/MacOS/MunkiStatus","queue_directories":"","root_directory":"","run_at_load":"","start_interval":"","start_on_mount":"","stderr_path":"","stdout_path":"","username":"","watch_paths":"","working_directory":""},
  {"disabled":"","groupname":"","inetd_compatibility":"","keep_alive":"","label":"com.googlecode.munki.authrestartd","name":"com.googlecode.munki.authrestartd.plist","on_demand":"","path":"/Library/LaunchDaemons/com.googlecode.munki.authrestartd.plist","process_type":"","program":"","program_arguments":"/usr/local/munki/authrestartd","queue_directories":"","root_directory":"","run_at_load":"","start_interval":"","start_on_mount":"","stderr_path":"","stdout_path":"","username":"","watch_paths":"","working_directory":""},
  {"disabled":"","groupname":"","inetd_compatibility":"","keep_alive":"","label":"com.microsoft.office.licensingV2.helper","name":"com.microsoft.office.licensingV2.helper.plist","on_demand":"","path":"/Library/LaunchDaemons/com.microsoft.office.licensingV2.helper.plist","process_type":"","program":"/Library/PrivilegedHelperTools/com.microsoft.office.licensingV2.helper","program_arguments":"/Library/PrivilegedHelperTools/com.microsoft.office.licensingV2.helper","queue_directories":"","root_directory":"","run_at_load":"","start_interval":"","start_on_mount":"","stderr_path":"","stdout_path":"","username":"","watch_paths":"","working_directory":""},
  ...
]
```

At some point we may want to revisit and cut down the information we want to get, but we'll just go with this for now. Since we now know what data we want and have a pretty simple way of getting it, let's look at how we deploy this to our clients.

## Scripts

```
awesome
└── ...
└── scripts
    ├── awesome.sh
    ├── install.sh
    └── uninstall.sh
```

Let's take a look at the module script that was created with `addmodule.sh`

### `awesome.sh`

```sh
#!/bin/sh

# Script to collect data
# and put the data into outputfile

CWD=$(dirname $0)
CACHEDIR="$CWD/cache/"
OUTPUT_FILE="${CACHEDIR}awesome.txt"
SEPARATOR=' = '

# Skip manual check
if [ "$1" = 'manualcheck' ]; then
	echo 'Manual check: skipping'
	exit 0
fi

# Create cache dir if it does not exist
mkdir -p "${CACHEDIR}"

# Business logic goes here

# Output data here
echo "item1${SEPARATOR}string value" > ${OUTPUT_FILE}
echo "item2${SEPARATOR}100" >> ${OUTPUT_FILE}
```

So most of this is boilerplate code, and the built in comments tell you most of what you need to know. Because we want to generate code with osquery, we can make this file even simpler.

```sh
#!/bin/sh

CWD=$(dirname $0)
CACHEDIR="$CWD/cache/"
OUTPUT_FILE="${CACHEDIR}awesome.json" # changed from .txt!

# Skip manual check
if [ "$1" = 'manualcheck' ]; then
	echo 'Manual check: skipping'
	exit 0
fi

# Create cache dir if it does not exist
mkdir -p "${CACHEDIR}"

# Business logic goes here
osqueryi --json 'SELECT * FROM launchd WHERE name NOT LIKE "com.apple%" ORDER BY name' > ./awesome.json
```

It does not need to be bash either. Theoretically, it's possible to do this in `python` if you prefer:  
(I know, we're introducing more dependencies: [osquery-python](https://github.com/osquery/osquery-python)) ¯\\_(ツ)_/¯

```py
import os
import sys
import osquery
import json

DEBUG = False

# Don't skip manual check
if len(sys.argv) > 1:
    if sys.argv[1] == 'debug':
        print('**** DEBUGGING ENABLED ****')
        DEBUG = True
        import pprint
        PP = pprint.PrettyPrinter(indent=4)

def main():
    """Main"""
    # Create cache dir if it does not exist
    cachedir = '%s/cache' % os.path.dirname(os.path.realpath(__file__))
    if not os.path.exists(cachedir):
        os.makedirs(cachedir)

    query_cmd = 'SELECT * FROM launchd WHERE name NOT LIKE "com.apple%"'
    instance = osquery.SpawnInstance()
    instance.open()  # This may raise an exception

    # Issues queries and call osquery Thrift APIs.
    RESULTS = instance.client.query(query_cmd)
    with open('awesome.json', 'w') as outfile:
        json.dump(RESULTS.response, outfile, indent=4)

if __name__ == "__main__":
    main()
```

Either one should leave you with an `awesome.json` file in your MunkiReport `cache` directory.

### Install/Uninstall Scripts

The other two files in the `script` directory tell the MunkiReport package how to install and uninstall the file that we just created.

#### `install.sh`

```sh
#!/bin/bash

# awesome controller
CTL="${BASEURL}index.php?/module/awesome/"

# Get the scripts in the proper directories
"${CURL[@]}" "${CTL}get_script/awesome.sh" -o "${MUNKIPATH}preflight.d/awesome.sh" # or awesome.py if we go with that

# Check exit status of curl
if [ $? = 0 ]; then
	# Make executable
	chmod a+x "${MUNKIPATH}preflight.d/awesome.sh" # or awesome.py if we go with that

	# Set preference to include this file in the preflight check
	setreportpref "awesome" "${CACHEPATH}awesome.json" # changed from awesome.txt

else
	echo "Failed to download all required components!"
	rm -f "${MUNKIPATH}preflight.d/awesome.sh" # or awesome.py if we go with that

	# Signal that we had an error
	ERR=1
fi
```

#### `uninstall.sh`

```sh
#!/bin/bash

# Remove awesome script
rm -f "${MUNKIPATH}preflight.d/awesome.sh" # or awesome.py if we go with that

# Remove awesome.txt file
rm -f "${MUNKIPATH}preflight.d/cache/awesome.json" # changed from awesome.txt

```

You will again need to change the name of any file names that have been altered, but everything else should be good to go.

### How MunkiReport Deploys to the Client

If you have followed [Part 1]({% post_url 2018-11-30-creating-munkireport-modules %}), you should have your module loaded into your development site after running this command:

```sh
##### this will make sure that the module is loaded
echo "MODULES='$module_name'" >> ../.env
```

You can double check this by either looking at your `.env` file or by checking for it's existence at http://localhost:8080/index.php?/install/dump_modules/env 

If you have it loaded and have saved your scripts if you now go to http://localhost:8080/index.php?/install you will see the script that is called when you [install or package the client](https://github.com/munkireport/munkireport-php/wiki/Client-setup#command-line-manual-install). In this script you should be able to search for the name of your module and see the `install.sh` script for it. If you instead see the `uninstall.sh` script, you probably have not loaded the module in your `.env`.

## How MunkiReport Manages the Data

This is an important thing to know as you develop modules as it can cause headaches if you do not understand. I have been taught about this by @tuxudo, so I will simply quote him on this part:

> MunkiReport works by checking the hash of files that are to be uploaded. If the file is the same, it assumes nothing has changed and it doesn't upload it. Thus if the file isn't processed because of a problem with the model, it won't attempt to process it again because it has the same hash.

As your developing the processing of this data that we're sending, you must remember that to test again, something needs to change. If it so happens that you think that data should be getting uploaded, but is simply not appearing, you may want to try one of three things:

* Change some of the data being uploaded. The hash of the file will be different and it will get uploaded.
* Delete you machine out of MunkiReport and try checking in again. When deleting a machine, it also deletes any related data, so you have a fresh start.
* Run this on the db which will clear the hash for the file your working on and will re-upload when checking in again:

```sql
DELETE FROM hash WHERE name = 'awesome'; /* or whatever your table name is */
```

## Conclusion

If none of this makes sense, take a look at the scripts in other modules. The more you read, the better idea you will have of ways to get the data that you want.