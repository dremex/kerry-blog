---
title: Introducing Track Every Hour
date: "2019-04-28"
template: "post"
draft: false
slug: "/2019/04/28/introducing-track-every-hour/"
category: "Programming"
tags:
  - "Programming"
  - "Track Every Hour"
description: "I've always been interested in tracking personal statistics such as workouts, music listening habits, and books I've read and then visualizing the data to find interesting patterns or just to reminisce. Earlier this month I came across a Reddit post that linked to a spreadsheet containing a recording of every activity for the previous year broken down to an hour by hour basis. I knew I had to give this a try and better yet, this was a perfect time to hack on a little app to help with tracking my daily activity."
---

I've always been interested in tracking personal statistics such as workouts, music listening habits, and books I've read and then visualizing the data to find interesting patterns or just to reminisce. Earlier this month I came across a Reddit post that linked to a spreadsheet containing a recording of every activity for the previous year broken down to an hour by hour basis. The author was able to look back over their year and recall different life events and how they affected their daily activities.

I knew I had to give this a try and so in mid-April, I began tracking my daily activities broken down hour by hour. After the first week I was able to already see patterns emerging - I generally sleep at the same time throughout the week and take a few hours in the morning to either read, take the dog for a walk, or get some gaming in before starting work.

Initially, I came up with a list of activities that I commonly do throughout any given day and then categorized them. Next, I fire up a google spreadsheet that has a row for each day of the year and columns representing every hour of the day. Throughout the day I try to open the spreadsheet and fill in what I've done for the recent hours. Generally, I'll log whatever activity took most of the time for any given hour. So if I wake up in the morning, spend 15 minutes making breakfast and then start working for the remaining 45 minutes, I'll block that hour out as "work".

![Track Every Hour Spreadsheet](/media/track-every-hour/track-every-hour-spreadsheet.png)

This has worked pretty well but I would love an easier way to input data throughout the day. For example what if the spreadsheet were able to auto-suggest common activities (I'm generally asleep between the hours of 12-7 AM so why not suggest that and allow me to simply click a button to log it). It would also be helpful if my phone received a push notification if I forgot to add an activity for the last 3 hours, this would help prevent me from becoming too far behind and forgetting what I was doing for a given time block.

Anything I can do to help ease some of the data entry burdens will increase the chance that I stick to this project instead of abandoning it after a few weeks. This made me realized there was a perfect opportunity to hack up a little app that would ease the burden of tracking my day and thus 'Track Every Hour' was born.

My goal is to create a PWA with a clean and fast UI that allows me to easily track my activities throughout the day. This can be expanded in the future to implement some of the ideas outlined earlier and even visualizations to keep me motivated throughout the year. In the next update, I'll begin the project by stubbing out the API using swagger.io and possibly even writing some of the code to power it.