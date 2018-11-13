---
layout: post
title: Munki + MicroMDM = MunkiMDM? Part III
categories: macOS MicroMDM Munki
---

Check out [Part I]({% post_url 2018-11-01-micromdm_munki %}) & [Part II]({% post_url 2018-11-06-micromdm_munki_partii %}) for more info on the background and progress to this point.

# Extending the Middleware

## Implementing Basic Authentication

Bad things can be done with an MDM. Let's add a little more protection from bad actors doing bad things to our machines. Flask has a [basic auth extension](https://flask-basicauth.readthedocs.io/en/latest/) and it's pretty simple to implement. I'm storing the user/pass in our settings file.
```py
from flask_basicauth import BasicAuth
from env import settings

application = Flask(__name__)

application.config['BASIC_AUTH_USERNAME'] = settings.get('basic_auth_user')
application.config['BASIC_AUTH_PASSWORD'] = settings.get('basic_auth_password')
basic_auth = BasicAuth(application)
```
```py
settings = {
    'micromdm_url': 'https://mdm.domain.org',
    'micromdm_key': 'sample-mdm-token-here',
    'basic_auth_user': 'john',
    'basic_auth_password': 'matrix',
}
```
Then for any command you wish to implement include `@basic_auth.required` decorator after the `route()` decorator:
```py
@application.route('/api/<command>', methods=['GET', 'POST'])
@basic_auth.required
```

## Making the command a little more extensible

The next thing I wanted too accomplish was to parameterize all the commands to make it easier to read and add more commands as needed. This was harder for me to grasp because I have not worked with Flask a whole lot, but in practice it's pretty simple. I went down a rabbit whole of trying to do metaprogramming with python, but luckily didn't find anything that worked. The solution is that this is already built into Flask, I was just using it in a ~~wrong~~ _different_ way. 

### The `route()` Decorator
Initially I was trying to stick the udid into the route, but this meant that I needed a static route defined for each command. When trying to parameterize, Flask would complain about multiple functions called the same thing. Since we can pass the `udid` with json, we can remove that from the Flask route. 

#### The Old Way
```py
@application.route('/static_route/<udid>', methods=['GET', 'POST'])
def static_route(udid):
    do stuff

# Call with:
curl http://localhost:5000/static_route/$udid
```
#### The New Way
```py
@application.route('/api/<command>', methods=['GET', 'POST'])
def api(command):
    do stuff

# Call with:
curl --header "Content-Type: application/json" --request POST --data '{"udid":"'$udid'"} http://localhost:5000/api/RestartDevice/
```

Since MicroMDM supports all the commands listed in [Apple's MDM Protocol Reference Guide](https://developer.apple.com/enterprise/documentation/MDM-Protocol-Reference.pdf), this allows this simple Flask app to be fairly powerful. Maybe too powerful? 

## But not that extensible...

There are practical limits that we should probably put in place here. We don't want just any command to be able to be run, so let's create an array of valid commands that we'd like to accept.

```py
supported_commands = ['RestartDevice','InstallProfile','RemoveProfile','ShutDownDevice'...]
...
def api(command):
    if command not in supported_commands:
        return 'Command %s not valid.\n' % command
```

## What about commands that have more keys?

Most commands take more than just the `udid` and `request_type`. In order to accommodate this, we'll check the json data to see if those keys exist, and if so add it to the payload.

```py
    content = request.json
    def check(arg):
        if arg in content:
            payload[arg] = content[arg]
    payload = {
        'request_type': command
    }
    check('udid')
    check('pin')                # For DeviceLock
    check('product_key')        # For ScheduleOSUpdate
    check('install_action')     # For ScheduleOSUpdateScan    
```
There are many ways to loop this check, for now this works and is fairly readable/user friendly.

## Put it all together!
```py
from flask import Flask, request
import base64
import requests
from env import settings
from flask_basicauth import BasicAuth

application = Flask(__name__)

application.config['BASIC_AUTH_USERNAME'] = settings.get('basic_auth_user')
application.config['BASIC_AUTH_PASSWORD'] = settings.get('basic_auth_password')
basic_auth = BasicAuth(application)

supported_commands = ['RestartDevice','InstallProfile','RemoveProfile','ShutDownDevice'...]

@application.route('/api/<command>', methods=['GET', 'POST'])
@basic_auth.required
def api(command):
    if command not in supported_commands:
        return 'Command %s not valid.\n' % command
    content = request.json
    def check(arg):
        if arg in content:
            payload[arg] = content[arg]
    payload = {
        'request_type': command
    }
    check('udid')
    check('pin')                # For DeviceLock
    check('product_key')        # For ScheduleOSUpdate
    check('install_action')     # For ScheduleOSUpdateScan
    check('force')              # For ScheduleOSUpdateScan
    check('identifier')         # For RemoveProfile
    if 'profile' in content:    # For InstallProfile
        profile = ('/path_to/munki_repo/pkgs/profiles/%s' % content['profile'])
        with open(profile, "rb") as f:
            bytes = f.read()
            payload['Payload'] = base64.b64encode(bytes).decode('ascii')
    requests.post(
        '{}/v1/commands'.format(settings.get('micromdm_url')),
        auth=('micromdm', settings.get('micromdm_key')),
        json=payload
    )
    return 'Issuing %s: Success! \n' % command

if __name__ == '__main__':
    application.run(debug=True)
```
