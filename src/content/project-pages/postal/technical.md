---
title: "Penpal Technical Writeup"
description: ""
showDate: False
showReadingTime: False
showAuthor: False
---

## Original Project Ideation
This project started as a simple exploration of various topics learned from my graphs class, where I was able to quickly prototype a network using AI assisted tools.
I felt this could go a lot deeper though, as when I finally put pen to paper I slow down I seem to create much more intentional letters to people.

This was an idea explored in a discussion several months ago in my "Science Technology & Society" class where 
digital messaging has vastly changed the expectations surrounding messaging. In a world where you can reach anyone instantly, pressure is placed upon a recipient to similarly respond instantly.

By slowing the process itself down, you can adjust those expectations and create an experience that is far more intentional and 
users can create letters with much more meaning than a blue text bubble. 

## Project Architecture

### MVVM+C
This project was a clean slate for my to implement a lot of core learnings and architectural best practices into use.
It is organized using a MVVM+C which made organization and navigation much cleaner. 
In most cases I simply use `NavigationLinks`, but they are pushing a `ViewRoute` enum (with args) onto the stack.
By taking advantage of MVVM, once a `ViewRoute` was pushed onto the stack with args which initialized the view. 

### API Calls
Similarly, the API is organized as an enum where each route with its possible args are provided. 
A given case is defined by its expected result not its location on the server API.

(e.g. address book `get`, `update`, `delete` are all separate cases, but are requested at the same endpoint via their proper methods)

These cases can then return several things:
- A path where they are on the server
- The methods that should be used
- A URL that works (accordingly for those with `get` parameters)

### Subscription Support
The project starts around the announcement of Revenuecat shipaton, so I figured it was an opportunity to utilize it.
Usage is dead simple, but setup was particularly tricky for some reason. 
I encountered an issue where StoreKit would not sync my products in ASC, but simply remaking them using reverse DNS coding made everything sync fine. 

### Fastlane Screenshots
I experimented with fastlane screenshots on prior apps, however using a MVVM+C architecture was incredibly helpful for 
this and allows direct pushing of views for screenshots to be implemented which is dictated by custom launch arguments. 
## AI Usage Disclaimer
Especially considering the deadline for Shipaton and school, AI was utilized in part to help develop this project.
All project architecture and UI was heavily handwritten + designed. All code generated was always reviewed for quality. 
AI was especially useful at setting up serverless preview data, it created many states for me to validate and preview UI designs for.



