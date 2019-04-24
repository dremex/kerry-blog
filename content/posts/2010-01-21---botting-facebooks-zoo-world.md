---
title: Botting Facebook's Zoo World
date: "2010-01-21"
template: "post"
draft: false
slug: "/2010/01/21/botting-facebooks-zoo-world/"
category: "Programming"
tags:
  - "Automation"
description: "Over the past few weeks a certain someone I know has been playing a real-time game on Facebook called \"Zoo World\". Users earn money by adding animals, buildings, etc to their zoo and then use this money to improve their zoo (think Roller Coaster Tycoon). Money is earned in real time which means that every tick (5 minutes) you receive a sum of money depending on how well your zoo is rated."
---
Over the past few weeks a certain someone I know has been playing a real-time game on Facebook called "Zoo World". Users earn money by adding animals, buildings, etc to their zoo and then use this money to improve their zoo (think Roller Coaster Tycoon). Money is earned in real time which means that every tick (5 minutes) you receive a sum of money depending on how well your zoo is rated.

Zoo World also has a few mechanisms in place that prevent people from earning money while not at their computer, specifically a button appears when a period of inactivity has passed and the zoo day timer stops ticking until you press this button (there's a handful of other buttons that can appear but this is the main culprit).

Recently I discovered java's robot library (java.awt.robot) and this seemed like the perfect opportunity to use it and [ZooBot](http://www.xmech.net/portfolio/desktop/zoo/) is the result. [ZooBot](http://www.xmech.net/portfolio/desktop/zoo/) is a little application that will scan the screen every few minutes looking for these buttons and presses them if they're found.

Now you can earn cash while sleeping! I wonder what other facebook games I could use method on...