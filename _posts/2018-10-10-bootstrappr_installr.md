---
layout: post
title: Bootstrappr/Installr/Wrappr/Deployr
---

I have been digging into Bootstrappr and Installr lately and have wanted to have a record of some of my interesting findings, so I decided to use it as an excuse to turn on the blog part of my site. In sticking with the missing vowel theme I have created a wrappr for them which I termed [deployr](https://github.com/joncrain/deployr).

# Bootstrappr & Installr
If you're reading this, you probably have heard of [Bootstrappr](https://github.com/munki/bootstrappr) and [Installr](https://github.com/munki/installr) before. If you have not, just go read [Greg's article on Bootstrappr](https://managingosx.wordpress.com/2018/01/17/bootstrappr/) for a basic understanding of what it's used for. Installr is similar but simply uses the macOS installer's built in `startosinstall` command to start an install from the command line. 

The more I used these tools, the more I thought it would be great to combine them into one. But it wasn't really until I decided that I wanted the ability to _**customize the name of a machine**_ as a part of the initial Installr script did I really start digging into a way to wrap them together. It was a fun little puzzle as the Recovery Mode brings in interesting level of restraint to what you can and can't do.

> sidenote - Naming during Bootstrappr is already something gmarnin has written about as he described his [Bootstrappr Workflow](https://gmarnin.com/my-bootstrappr-workflow/). So just go there if you want some tips on that. I implemented using outset, which...works. I may change it in the future however.

Naming pre-Installr is a chicken/egg problem. You don't have the OS installed until Installr is run, and the only things you can pass to `startosinstall` are (as [Rich Trouton points out](https://derflounder.wordpress.com/2017/09/26/using-the-macos-high-sierra-os-installers-startosinstall-tool-to-install-additional-packages-as-post-upgrade-tasks/)) "signed or unsigned distribution-style flat packages." So in order to customize the name of an Installr run workflow, you need a custom package. Essentially we simply want a way to run a script on the booted machine, so really all we need is a payload free package with a postinstall script.

> caveat - doesn't it make more sense just to have munki or your management solution name the machine something based on serial or MAC address? The answer is yes, yes it does. However, I work in education on a team of around 10 other desktop administrators, and as much as I've tried, I've been unable to convince them of this fact. But, if you can name the machine later, just do it that way.

As a part of our bash script then, we need to ask the tech some questions and get some answers to store in variables. For example:
```
echo -e "What is the tag number of this machine?"
read TAG
```
We can also pull some info about the machine, but again be careful as `system_profiler` is another thing that is unavailable!
```
SERIAL=$(ioreg -c IOPlatformExpertDevice -d 2 | awk -F\" '/IOPlatformSerialNumber/{print $(NF-1)}')
```
# Building a Custom Package within Recovery Mode
No problem. But what do we have to work with? Well, recovery mode has `pkgutil`, but that only makes flat packages. `productbuild` is what we need, but is not found in Recovery. So we need to add that to our dmg. We also would need `pkgbuild` as well, but instead we can just use an already created and expanded package so we can simply edit the postinstall script, flatten and then build with `productbuild` like so:

```
#### Create package for installr
create_installr_package () {
	mkdir -p "/Volumes/packages"
	current_dir="/Volumes/packages"
	cp -r /Volumes/deploy/script_package/ $current_dir
	cat  > $current_dir/tmp/Scripts/postinstall <<EOL
#!/bin/bash
defaults write /Library/Preferences/com.apple.RemoteDesktop.plist Text1 -string "$1"
defaults write /Library/Preferences/com.apple.RemoteDesktop.plist Text2 -string "$2"
defaults write /Library/Preferences/com.apple.RemoteDesktop.plist Text3 -string "$3"
defaults write /Library/Preferences/com.apple.RemoteDesktop.plist Text4 -string "$4"
/usr/sbin/scutil --set ComputerName "$5"
/usr/sbin/scutil --set LocalHostName "$5"
/usr/sbin/scutil --set HostName "$5"
EOL
	/usr/sbin/pkgutil --flatten $current_dir/tmp/ $current_dir/script.pkg
	/Volumes/deploy/script_package/productbuild -p $current_dir/script.pkg /Volumes/final_script.pkg
	rm -rf $current_dir/
}
```

# Creating a Wrappr

Since we want to ask for the same information regardless if we're running Bootstrappr or Installr and since they are very similar, let's combine them, so we only have one package directory to maintain.

You will want your variables and your volume selector for either workflow, so those questions, ask up front. And then we can ask for what type of workflow. 
```
Select your workflow
1) Bootstrap machine with preinstalled OS. Will install and configure munki.
2) Install High Sierra and bootstrap munki.
3) Install Mojave and bootstrap munki.
4) Quit
```


Another great thing I was able to add, (er, take away?) was the hassle of including the entire macOS Installer in the dmg whenever I wanted to change something small in Installr. I simply created another dmg for High Sierra and another for Mojave that the script simply calls.
```
DMG_LOCATION="http://macbootstrap/"
INSTALLER = mojave
/usr/bin/hdiutil attach "$DMG_LOCATION/$INSTALLER.dmg";
```
Once I did that, it was much easier to test the scripts.

I then borrowed someones option menu and went to work with some options. One of the defaults looks something like this:
```
    2 ) echo "You picked $opt";
	OS=highsierra
	create_installr_package "$TAG" "$LOCATION" "$INVENTORY" "$SELECTEDDEPARTMENT" "$HOSTNAME"
	installr "$OS" "$SELECTEDVOLUME" "$DMG_LOCATION"
	break;;
```
With functions to create the custom naming package and Installr, it makes it pretty simple to add new OS's.

I've alse written a webhook to MS Teams for our internal deployr, but because it uses [relocatable-python](https://github.com/gregneagle/relocatable-python) it is not for the faint of heart, because again, using https with `curl` is not allowed and why would python be in Recovery Mode? It is pretty awesome though and I threw some links straight to MunkiReport and MunkiWebAdmin in the post. I may have another post just on that.
![teams-webhook]({{ site.url }}/assets/teams.png)

# Other Helpful Hints
You need the computer booted on Recovery Mode 10.13+ (?), so not every machine will have the proper recovery mode to use these techniques. Apple has a support doc on [Recovery Mode](https://support.apple.com/en-us/HT204904) that supposedly says "Option-⌘-R" will "Upgrade to the latest macOS compatible with your Mac." which I would think means would internet recovery to 10.13.6 at least, but it didn't work for my mid 2011 iMacs. Luckily I still have an old DeployStudio netboot server sitting around! And what better use for it, than to boot old machines up to a 10.13 image to use Installr on!

Getting the settings and packages right can take time. When mounting and unmounting the dmg's, I found it unreliable as if it were caching the old dmg somehow. In order to get everything right quickly, use a VMware Fusion VM and take a machine snapshot in recovery mode right before you mount the dmg. Totally worth it. If you're having trouble with booting to recovery, take a look at this [Booting into macOS Recovery Mode in VMware Fusion 10](https://babodee.wordpress.com/2018/10/10/booting-into-macos-recovery-in-vmware-fusion-10/).

# Conclusion
If you have the need for both Bootstrappr and Installr, give this a look. If you only need Installr and need to name machines, take a look and let me know what you think. I'm around most days @joncrain on [MacAdmins Slack](http://macadmins.org/).