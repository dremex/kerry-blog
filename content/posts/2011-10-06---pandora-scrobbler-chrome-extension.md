---
title: Pandora Scrobbler Chrome Extension
date: "2011-10-06"
template: "post"
draft: false
slug: "/2011/10/06/pandora-scrobbler-chrome-extension/"
category: "Programming"
tags:
  - "Programming"
  - "Open Source"
description: "For the last year or two I've been using a web based application to scrobble tracks played from Pandora. However the latest UI (HTML 5) has broken the scrobbler and I haven't been able to find a replacement. With the possibility of losing track of my music listening habits I decided it was time to write my own chrome extension."
---
For the last year or two I've been using a web based application to scrobble tracks played from Pandora. However the latest UI (HTML 5) has broken the scrobbler and I haven't been able to find a replacement. With the possibility of losing track of my music listening habits I decided it was time to write my own chrome extension.

I've been using an [extension to scrobble turntable tracks](http://gabek.github.com/TurntableScrobbler/) that Gabek created and I decided to simply clone his project and replace the turntable detection with Pandora.

After spending a few hours learning how chrome extensions work I ended up with my version of a [Pandora Scrobbler](http://www.xmech.net/downloads/Pandora+Scrobller).

Running it is simple:

*   [Install the package](http://www.xmech.net/downloads/Pandora+Scrobller)
*   Open Pandora in a new tab
*   You'll be prompted to authorize the scrobbler via last.fm
*   After authorizing, simply reload your pandora tab.

Once you've authorized you won't need to authorize again unless you remove the extension or remove the app from your last.fm account. You can click on the "PS" icon in chrome to sign in as a different user or see which user you're logged in as.

I need to add a delay between when the song starts and when the scrobble request is sent (currently the song will be scrobbled as soon as it begins playing).

[Github repo](https://github.com/dremex/Pandora-Scrobbler).