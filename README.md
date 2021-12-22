# POE Private League Overlay

**Problem Statement**: Tools that are available in the internet have pre-determined leagues that are not customizable for the users. Hence, private leagues do not have anything for them. Specifically for private races that are not **famous** to everyone.

**Solution**: This tool will provide an overlay for all leagues. You only need the character's name and the private league name. e.g.:
```
Private League Name: Forever Exiled HCSSF Scourge (PL19601)
Character Name: ShadowsAreSquishyLUL
```

You only need to edit the **config.ini** and provide the full Private League Name (including the PL code) then run the app itself.

## Usage

> Edit the **config.ini**
```
[DEFAULT]
# WARNING: CHANGING THIS VALUE TO LESS THAN 10 SECONDS
# MIGHT RESULT TO BEING RATE-LIMITED OR WORSE, IP-BANNED BY GGG
updateInterval = 10
leagueName = Forever Exiled HCSSF Scourge (PL19601)
charName = ShadowsAreSquishyLUL

# Separate keys with spaces
exitKeys = alt q
```
> run **python pplo**

> To Exit the app, just press the configured **exitKeys** combination set in the **config.ini**

| ![Warning](/assets/warning.png) |  Sometimes, it does not exit as soon as you press it, just press the configured **exitKeys** again and/or hover on the overlay |
| -- | -- |

> Display configurations are also inside **config.ini**
```
[DISPLAY]
#windowAlpha - transparency - can be 0 to 100
windowAlpha = 50.00
showGlobalRank = True
showBaseClassRank = True
showAscendancyRank = True
showClass = True
showLevel = True
showLeagueName = True
showLastUpdatedTime = False

#show all stats in just one line
showOneLiner = True

# coordinates
# x = 0, y = 0 is top-left most of your screen
windowPositionX = 0
windowPositionY = 0
```

## LIMITATIONS

> This can only process upto 2000 data points. This is because the GGG's api serves only 200 data points per page and more api calls mean more chances of getting rate-limited. Another reason is because this will be stored in memory and may cause your system to crash if we handle more. Hence, it will show **CHARACTER NOT FOUND OR RANK > 2000** if it doesn't see your character in the data that have been collected.