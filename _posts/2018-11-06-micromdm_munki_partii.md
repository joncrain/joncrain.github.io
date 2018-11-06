---
layout: post
title: Munki + MicroMDM = MunkiMDM? Part II
categories: macOS MicroMDM Munki
---

In my [last post]({% post_url 2018-11-01-micromdm_munki %}), I discussed how to use Munki to control UAMDM Profiles using the MicroMDM API. As a proof of concept, it works great, but it also stores the API key for MicroMDM on any machine it is pushed to. Not ideal to have someone grab this and lock your entire fleet!

### But Why Again?
The idea is to use Munki's logic for when a profile should be installed. All profiles originate from the same place, departments can target their own profiles to their own fleets as needed.

# Basic Middleware

There are a few ways one can install a profile with MicroMDM. 
* Include in the [Blueprint](https://github.com/micromdm/micromdm/wiki/Quickstart#blueprints) which will install the profile at enrollment.
* Via the API InstallProfile command. The API command takes the UDID of the computer and the base64 encoded profile as it's payload.

We will obviously be focusing on the second option. To get this info back to the server, we'll create a simple `curl` command that will hold a little json data and will trigger a small Flask app on the server.

## Client Side
Our preinstall check changes to:
```sh
#!/bin/sh
udid=$(ioreg -d2 -c IOPlatformExpertDevice | awk -F\" '/IOPlatformUUID/{print $(NF-1)}')

curl --header "Content-Type: application/json" --request POST \
--data '{"profile":"org.domain.tcc-1.0.mobileconfig"}' \
https://micromdm-api.domain.org/install_profile/$udid
```
And the relevant line of the uninstall becomes:
```sh
curl --header "Content-Type: application/json" \
 --request POST --data '{"profile":"edu.cmich.tcc"}' \
 https://micromdm-api.techops.cmich.edu/remove_profile/$udid
```

## Server Side

With a little help from [@grahamgilbert](https://twitter.com/grahamgilbert) and a few others, I put this script together:
```py
from flask import Flask, request
import base64
import requests
from env import settings

application = Flask(__name__)

@application.route('/install_profile/<uuid>', methods=['GET', 'POST'])
def install_profile(uuid):
    content = request.json
    profile = ('/path_to/munki_repo/pkgs/profiles/%s' % content['profile'])
    with open(profile, "rb") as f:
        bytes = f.read()
        base64_profile = base64.b64encode(bytes).decode('ascii')
    payload = {
        'udid': uuid,
        'payload': base64_profile,
        'request_type': 'InstallProfile'
    }
    requests.post(
        '{}/v1/commands'.format(settings.get('micromdm_url')),
        auth=('micromdm', settings.get('micromdm_key')),
        json=payload
    )
    return uuid

@application.route('/remove_profile/<uuid>', methods=['GET', 'POST'])
def remove_profile(uuid):
    content = request.json
    profile = content['profile']
    payload = {
        'udid': uuid,
        'identifier': profile,
        'request_type': 'RemoveProfile'
    }
    requests.post(
        '{}/v1/commands'.format(settings.get('micromdm_url')),
        auth=('micromdm', settings.get('micromdm_key')),
        json=payload
    )
    return uuid

if __name__ == '__main__':
    application.run(debug=True)
```
To get the env settings, create a file called env.py in the same directory like so:
```py
settings = {
    'micromdm_url': 'https://mdm.domain.org',
    'micromdm_key': 'sample-mdm-token-here',
}
```
There are a ton of ways to run the flask app, but since I'm already running MunkiWebAdmin on this server using nginx and gunicorn, I did it that way. This involves setting up a virtualenv for the flask app, a new nginx site, and a new systemd to start up the app. 