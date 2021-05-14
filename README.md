# Jamesloon's Auto Chrome Grouping Extension:
#### Welcome to Jamesloon's Auto Chrome Grouping Extension!
* This chrome extension is designed to help users automate chrome tab groups by implementing automation around URL keys.
#### This extension can be installed from the Chrome Web Store [HERE](https://chrome.google.com/webstore?hl=en)
> **Disclaimer:** This project is released *as is* and does not have any implied warenties or garentees of any kind. Please adhere to google's terms of use and all local laws.

# Table of Contents
1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Interface](#interface)
    - [Welcome](#welcome)
    - [Groups](#groups)
    - [BlackList](#blacklist)
    - [Settings](#settings)
    - [URL Parser](#url_parser)

# Getting Started:
1. Ensure the extention is installed into Chrome
   1. The extention can be installed from the Chrome Web Store [HERE](https://chrome.google.com/webstore?hl=en)
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
URL Parser:
* Please see [URL Parser](#url_parser) for how this works
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
URL Parser: Please see [HERE](#url_parser) for how this should be used. This *only* supports adding to the blacklist.
Table:
* Group Name
  * The Key to blacklist
* Remove
  * Remove item from the blacklist
## Settings
> This page controls how the widget acts as well as provides basic developer tools for troubleshooting.
## URL Parser
