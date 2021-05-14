# Jamesloon's Auto Chrome Grouping Extension:
#### Welcome to Jamesloon's Auto Chrome Grouping Extension!
* This chrome extension is designed to help users automate chrome tab groups by implementing automation around URL keys.
#### This extension can be installed from the Chrome Web Store [HERE](https://chrome.google.com/webstore?hl=en)
> **Disclaimer:** This project is released *as is* and does not have any implied warenties or garentees of any kind. Please adhere to google's terms of use and all local laws.

# Table of Contents
1. [Getting Started](#getting-started)
2. [Interface](#interface)
    - [Welcome](#welcome)
    - [Groups](#groups)
    - [BlackList](#blacklist)
    - [Settings](#settings)
    - [URL Parser](#url_parser)
3. [How it works](#how_it_works)

# Getting Started:
1. Ensure the extention is installed into Chrome
   1. The extention can be installed from the Chrome Web Store [HERE](https://chrome.google.com/webstore?hl=en)
   2. For testing or dev versions, please download the .zip file in the dist folder.
1. Open the extension from the extensions menu
2. Click the "Groups" Tab on the top to navigate to the groups table
  1. This table houses the key values to identify the URLs to group.
  2. See [Interface > Groups](#groups) for a break down of this tab.
1. In the Text Input Field above the table, enter a URL to see what keys are derived from it.
  1. Example: https://chrome.google.com Will yeild a Group Key of "chrome.google"
1. Click the Green "+" Sign next to the Group Key to add it to the table
2. Your should now see the Entry of "chrome.google" under the Group Key with the Color of Grey
3. Navigate to https://chrome.google.com and you should see it automatically create a tab group with the title of "chrome.google"
4. Open the extention and open the "Groups" tab again.
5. Click the "Color" value of Grey and change it. Notice how the Tab Group color updates with it.
6. Now Click the Red "-" icon next to "chrome.google" and close the tab with https://chrome.google.com open
7. Re-open https://chrome.google.com and notice it no longer performs the grouping
8. Try adding your own URLs using the Green "+" at the top

# Interface
> This section is dedicated to explaining the User Interface of the Widget

## Welcome
> The Welcome tab gives an intoduction to the chrome extension for quick information as to how the extension works
* About:
  * This section is dedicated to the reasons why this extension exists and a little about it. It also (as ov V0.1.2) will have a link back to this GitHub Project
* How it works:
  * This section is dedicated to the simple expliantion of the extension's functionality and also has a URL parser to add entries to the Groups table or Blacklist

## Groups
> This section is for the Groups tab on the Chrome extension

Please see [URL Parser](#url_parser) for the top input field.

Table:
* Group Key: 
  * Responsible for telling the extension what key words in the URL to group on. 
  * Clicking on the value will allow the user to edit it.
* Color: 
  * Can be one of the Chrome Tab Group Colors listed [HERE](https://developer.chrome.com/docs/extensions/reference/tabGroups/#type-Color)
* Actions: 
  * Used to remove the Group Key OR add it to the [Blacklist](#blacklist)
* Refresh: 
  * Used to refresh the table when ServiceNow automation is enabled and creates an entry between browser restarts.
## Blacklist
> The Blacklist is to prevent the automation from running on certain URL keys. **NOTE:** Do *NOT* be generic here else you may prevent valid mappings.

Please see [URL Parser](#url_parser) for the top input field. This *only* supports adding to the blacklist.

Table:
* Group Name
  * The Key to blacklist
* Remove
  * Remove item from the blacklist

## Settings
> This page controls how the widget acts as well as provides basic developer tools for troubleshooting.
* Enable Extension:
  * This controls if the extension is active or not
  * Disabling this setting will prevent new groups from being created AND new tabs being automatically associated to those groups.
* Automate ServiceNow Grouping:
  * Disabled by default
  * Enable to automatically group ServiceNow OR Service-Now windows/environments. This was the origonal purpose of the extension.

## URL_Parser
> This part of the extension controls what aspects are seen by the script for automation and ability to add that key to the Groups or Blacklist
* Text Input:
  * This is where the URL of the site to be grouped goes.
  * NOTE: This must start with https:// OR http:// as that is how the script is determining which part is useful
* Value:
  * This is the output of the Text Input that the script sees. This can be used to troubleshoot or add new group entires
* Green +
  * Add the Value to the Groups table
* Red x
  * Add the Value to the Blacklist

## How_It_Works
> The content of this section is *technical* and requires a basic knowledge of order of operations and javascript

### Deriving_The_URL_Key
Example used for demonstration= "https://direct.example.com"
1. Tab information sent to checkConfig() function which contains the tabID, WindowID, and tab URL
2. Tab URL is converted to a string and then split on the '/' character
3. Script takes the items in position 3 (\[2\] for js). AKA everything after the "https://" but before any trailing "/"
    1. ie. "direct.example.com"
1. The base URL is then turned into a string and evaluated for if it contains a "."
    1. This is for when user is manually entering a URL that isn't complete or is part of chrome, it won't break the script
1. If it does have a ".", it will split on the "." and remove the last position.
    1. This will remove the trailing .com, .org, etc. from the URL
3. It will then return the baseURL value for further processing.
    1. ie. "direct.example"

### Making_The_Group
Example used for demonstration="https://direct.example.com"
1. Trigger is called:
    1. A tab completes loading
    2. The Groups object has been modified in Chrome Storage.
3. Dervices the URL Key
4. Checks the Blacklist
    1. Stops Script if found
5. Checks the defined Groups object
    1. It checks the URL to see if it contains the Groups Object key. This is why we have to be specific with the keys.
7. Checks if URL contains Service-Now OR ServiceNow
    1. Note: This is only called if the setting automateServiceNow is set to true
    2. Creates a new association on the Groups object if enabled.
7. If there is a valid value returned from above, either create the group OR add the tab to the existing gorup for that window.
