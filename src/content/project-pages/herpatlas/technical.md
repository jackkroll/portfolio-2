---
title: "MI HERP Atlas Writeup"
description: "A technical summary of my experience on the Michigan HERP Atlas MTU enterprise team"
---
## This writeup is not done yet!
I will finish it soon :)

## Login Loader
The sponsor for this project specifically requested the addition of a turtle loader, I was tasked with expanding it to the login page. 
> If I am stuck waiting I at least want to have a cute turtle to look at

This addition also included modernization of the login page to match the branding of the rest of the app :)
## Drafts Page
Primarily a UI skeleton for another group member to implement, though it was an important lesson with UI reusability
- Add record flow modified to act as an edit record flow that detects prefilled content and can display it accordingly
- View Record page has defaults and understands which are drafts and which aren't

This allowed for the setup to pull in stored drafts from local storage. 
## Review + Submit Page 
My second task was to help reduce visual clutter on the page to review all your responses before submitting them. 

As it was given to me, the page simply would display every possible value and if you didn't respond to that, it would display as blank causing a lot of clutter. 
This was my first experience with .NET Maui Converters. I was used to the modern conveniences of inline logic in Swift. In this case I utilized a converter to optionally hide fields that were null.

**Before** 
```cs
<Label Text="{Binding AirTemp, StringFormat='Air Temperature: {0}'}" TextColor="White"/>
<Label Text="{Binding FCAir, StringFormat='Air Temp Unit: {0}'}" TextColor="White"/>
<Label Text="{Binding GroundTemp, StringFormat='Ground Temperature: {0}'}" TextColor="White"/>
```
**After**
```cs
<Label Text="{Binding AirTemp, StringFormat='Air Temperature: {0}'}"
    TextColor="White"
    IsVisible="{Binding AirTemp, Converter={StaticResource NullConverter}}"/>
<Label Text="{Binding FCAir, StringFormat='Air Temp Unit: {0}'}"
    TextColor="White"
    IsVisible="{Binding FCAir, Converter={StaticResource NullConverter}}"/>
<Label Text="{Binding GroundTemp, StringFormat='Ground Temperature: {0}'}"
    TextColor="White"
    IsVisible="{Binding GroundTemp, Converter={StaticResource NullConverter}}"/>
```

Further, each input is organized into sections, but you wouldn't want to display a section with no content, so additional bindings were made to determine if content in that section is empty
ex. 
```cs
<Label Text="No information provided in this section"
    TextColor="White"
    IsVisible="{Binding TimeLocationSectionIsEmpty}" />
```

___

## Map Improvements 
My first task was to improve the UX for the page where you input the date/time/location of your observation. All of these can easily be autofilled by leveraging device data, but this process involved a lot more nuance.

### Order of operations on page load

1. Set map center to Lansing (otherwise it will default to Maui, HI) with view distance of 10 miles
2. If user location is available, validate it and set the view distance to 100 meters

**In that process of fetching the users location and validating an unknown amount of time has passed, it is entirely possible that a user has selected a location!**

Therefor only if there has been no selection has been made, default to the users' location. 

### Location Validation
When I joined the project the location validation was just validating a bounding box for Michigan
```cs
private bool IsInMichigan(double latitude, double longitude) {
    return latitude >= minLat && latitude <= maxLat && longitude >= minLon && longitude <= maxLon;
}
```
But we can be smarter than that, using map data we can extract the "Admin Area" which for the US is a "state". 
```cs 
private async Task<bool> AdminAreaIsMichigan(Location location)
        {
            try {
                var placemarks = await Geocoding.GetPlacemarksAsync(location.Latitude, location.Longitude);
                var placemark = placemarks?.FirstOrDefault();
                if (placemark != null)
                {
                    return placemark.AdminArea == "MI";
                }
                else
                {
                    return IsInMichigan(location.Latitude, location.Longitude);
                }
            } catch (Exception ex)
            {
                // Handle exceptions (no network, permission denied, etc.)
                return IsInMichigan(location.Latitude, location.Longitude);
            }
        }
```
This is not a foolproof method, it does require some network availability and could be throttled. However, for most cases it will feel far more accurate and there will be no noticeable latency added.