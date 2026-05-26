---
title: SmarterBlinds
description: Upgrading my old BLE blinds and connecting them up to Apple Home
date: 2026-05-26
---

### Background
My bedroom blinds were upgraded in 2019 with bluetooth enabled motorized blinds from Home Decorators. Though they are
not particularly fancy, and the app is nothing to write home about, they do work well for their purpose. However, I was 
tired of an app that often took too long to connect, and was stuck in the last century in terms of design and connectivity.


### The upgrade process
After an initial search there was [pretty clear path forward](https://www.reddit.com/r/homebridge/comments/ou3rts/homedepot_motorized_blinds/). had an old Raspberry Pi lying around that I figured could get the job done.

Some important notes:
**Mac Address Spoofing:**
  - Make sure to clone the alias too, I had connection issues until this step so it seems to be part of that for some reason. 
**Range Limitations:**
  - When using a Pi 4B, I had pretty severe connectivity issues, going through a wall seemed to make it very unreliable so it may be best to locate it in the same room, or explore different bluetooth antenna options.


### Usage
Download the small project [here](https://github.com/jackkroll/smarterblinds)!

Package Install: `pip install -r requirements.txt`

Usage: `python main.py   --mac MAC:ADDRESS:HERE   --name "DEFAULT NAME HERE"   --port 51826`

There is no native ability to determine the current state the shade, or to set an arbitrary position (this could be simulated via software though likely!). 
Therefore, the slider is used as a basic open/closed and the switch is used as the "favorite" position toggle.