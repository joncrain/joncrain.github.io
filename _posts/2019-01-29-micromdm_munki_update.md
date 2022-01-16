---
layout: post
title: MunkiMDM Updates
categories: macOS MicroMDM Munki
---

I few months back I put together a little proof of concept utilizing the MicroMDM api to control UAMDM profiles with Munki by having Munki trigger the MDM profile install.

It seems like every time I bring it up I have people asking why I would want to do it this way. Here are my top reasons:

* It simplifies management. i.e. Most of our profiles are already in Munki, so it makes sense (in my mind at least) to have all of them managed in a similar way.
* It allows us to rely on Munki's built in logic. I don't need to recreate groups and/or smart groups within a commercial MDM. I already have it in Munki.
* We currently don't have an MDM, and MicroMDM is free*!

*_free in a sense that it only costs my time and effort_

# How It Works

In past blog posts I concentrated on specific parts of making it work, but I've never really given the complete overview. So here is what my workflow looks like:

1. Profiles are created via [ProfileCreator](https://github.com/erikberglund/ProfileCreator) and imported into Munki.

2. Add a `preinstall_script` and an `uninstall_script`
   * The preinstall does the actual installing of the profile, essentially calling the [middleware]({% post_url 2018-11-01-micromdm_munki %}) and adding the profile from the Munki cache as it's payload.
   * I also added some python to write to the `ConfigProfileData.plist` that Munki uses to keep track of what profiles are installed.
   * The uninstall script does the exact opposite.
3. Add any other dependencies to the pkginfo file.
   * I require the enrollment profile for MicroMDM
   * The MicroMDM enrollment profile requires [umad](https://github.com/erikng/umad) which nags users to approve the MDM
   * Add the minimum os version for the profile
4. Deploy to machine

# The Finished Product

Here's a gist of the completed [pkginfo file](https://gist.github.com/joncrain/c3b9cb5951b1a5412072599796b19992).

and here is the result!

![tcc.mov]({{ site.url }}/assets/tcc.mov){:width="100%"}
