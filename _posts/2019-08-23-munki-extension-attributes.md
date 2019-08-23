---
layout: post
title: Munki Extension Attributes
categories: macOS jamf munki
---

# Jamf and Munki

I am in the process of implementing Jamf Pro at my current institution into our fairly mature Munki environment. Our plan is to allow Munki to do what it's good at (software deployment) and allow Jamf Pro to do what it's good at _(or maybe adequate enough at?)_

## Munki Setup

For the most part we follow [Groob's Opinionated Guide](https://groob.io/posts/manifest-guide/), with one minor tweak: when nesting manifests, we try to keep the naming logical and follow a pattern of including the parent name in the child manifest.

```txt
C02K503BFS7J
└── dept_office_hr
    └── dept_office
        └── dept
            └── org_sitewide
```

This forms our baseline departmental structure, and while we also use cross departmental manifests for core apps, this gives us a great starting point for departments to define their areas.

## MDM RFP

During our RFP process, it became clear that I did not want to recreate this structure in the MDM we would choose. While I was pulling for [MicroMDM]({% post_url 2019-01-29-micromdm_munki_update %}), I also knew the complexities of this setup and the fact that we simply do not have a team large enough to support it long term. Because Jamf Pro has become an industry standard, and allowed us to easily control multi-department access, Jamf Pro was selected.

## Making Connections from Jamf Pro to Munki

Within Munki it is very simple to require a dependency for an app, but a little more complicated when working with two separate solutions. Our solution has become a couple of Jamf Pro Extension Attributes for Munki. While there is a [Munki Extension Attribute](https://www.jamf.com/jamf-nation/third-party-products/files/900/check-munki-manifest-on-client) on Jamf Nation, it only reads the `ClientIdentifier` for Munki, not every manifest that was included. Thankfully, I have some experience with the same problem in creating a [Munki Manifests module](https://github.com/joncrain/manifests) for [MunkiReport](https://github.com/munkireport/munkireport-php). This solution simply walks through the manifest directory of Munki and reads the names of the files.

```py
#!/usr/bin/python

import os

def get_munki_manifests():
    manifests = "/Library/Managed Installs/manifests"
    munki_manifests = []
    for manifest in os.listdir(manifests):
        munki_manifests.append(manifest)
    munki_manifests.sort(key=str.lower)
    return munki_manifests

def main():
    munki_manifests = get_munki_manifests()
    i = 0
    for manifest in munki_manifests:
        if i == 0:
            print("<result>" + manifest)
        else:
            print(manifest)
        i = 1
    print("</result>")

if __name__ == "__main__":
    main()
```

We can save that directly into an Extension Attribute and then create a SmartGroup based on a specific manifest.

![jamf-munki]({{ site.url }}/images/jamf-munki.png){:height="80%" width="80%"}

We have also created an Extension Attribute for Catalogs by simply substituting `catalog` for `manifest` in the above code.

This has been very helpful in allowing us to utilize the same structure we have already been working with and are comfortable with to implement Jamf Pro.