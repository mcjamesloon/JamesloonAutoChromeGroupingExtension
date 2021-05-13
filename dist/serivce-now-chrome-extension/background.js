/* Created by Jamesloon. No warrenty or support. V1.0 Alpha */

//Global Storage Keys
/*
  theGroups = {title:colorValue};//The groups/entires to include for grouping
  settings = {automateSNOW:true};//The extension settings. By default, tab grouping for SerivceNow is enabled.
  activeExtension = true;//The value if the extension should be running group automation or not.
  theBlacklist = [];//List of black-list values to exclude from the extension. Used for automatic associations only.
*/
//Define Global Vars
let theGroups = {};
//Start Core variables:
let settings = {automateSNOW:true,activeExtension:true};
let theBlacklist = {"www":true};

//Start Listeners <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
chrome.runtime.onStartup.addListener(() => {
  //Ensure integrity of each storage object. Will save me another 5 hour headache.
  chrome.storage.sync.get(['theGroups','settings','theBlacklist'], (data) => {
    syncVars(data);
  });
});
chrome.storage.onChanged.addListener(function (changes, namespace){
  if (namespace == 'sync'){
    for (let [key, { oldValue, newValue }] of Object.entries(changes)){
      if (key == 'theGroups'){
        chrome.storage.sync.get(['settings','theBlacklist'], (data) => {
          data.theGroups = newValue;
          syncVars(data);
          updateAllGroups(oldValue,newValue);
        })
      }
    }//end for
  }//end if namespace
});
//console.log(theBlacklist);
chrome.runtime.onInstalled.addListener((reason) => {
  if (reason.reason == "install") {//Initialize all variables
    //chrome.tabs.create({url: 'index.html'}); //< Here for de-bug and testing.
    //console.log('First Install');
    chrome.storage.sync.set({ 'theGroups': {}});
    chrome.storage.sync.set({ 'settings': {automateSNOW:true,activeExtension:true}});
    chrome.storage.sync.set({ 'theBlacklist':{"www":true}});
  } else {
    chrome.storage.sync.get(['theGroups','settings','theBlacklist'], (data) => {
      syncVars(data);
    });
  }
});
chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    //console.log(changeInfo);
    // read changeInfo data and do something with it (like read the url)
    if ((changeInfo.status && changeInfo.status=='complete')&&(tab.groupId<0 && tab.url)) {//Filter out existing tab groups. Filter out anything other than Service-Now.
      chrome.storage.sync.get(['theGroups','settings','theBlacklist'], (data) => {
        if (settings.activeExtension){
          syncVars(data);
          var check = checkConfig(tab);
          if (check){groupTabs(tab,check);}
        }
      });
    }
  }
);
chrome.tabs.onAttached.addListener(function
  (tabId,attachInfo){
    chrome.tabs.get(tabId).then(function(onAttachedReturn){
      if ((onAttachedReturn.groupId<0) && onAttachedReturn.url) {//Filter out existing tab groups. Filter out anything other than Service-Now.
        chrome.storage.sync.get(['theGroups','settings','theBlacklist'], (data) => {
          syncVars(data);
          var attachCheck = checkConfig(onAttachedReturn);
          if (attachCheck){groupTabs(onAttachedReturn,attachCheck);}
        });
      }
    });
  }
);

//VAR SYNC FUNCTION!
function syncVars(data){
  if (!data.theGroups){chrome.storage.sync.set({ 'theGroups': theGroups});} else {Object.assign(theGroups,data.theGroups);}
  if (!data.settings){chrome.storage.sync.set({ 'settings': settings});} else {Object.assign(settings,data.settings);}
  if (!data.theBlacklist){chrome.storage.sync.set({ 'theBlacklist':theBlacklist});} else {theBlacklist = data.theBlacklist;}
}

//Start Supporting Functions <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function checkConfig(tab){
  //This function will check the existing "groups" object for an existing association to group or if it is from service-now
  var baseURL = tab.url.toString().split('/')[2];//Define the var to be used accross multiple sub-functions
  if (!baseURL){return false;} else {
    baseURL = baseURL.toString();
    //console.log(baseURL)
    if (baseURL.includes('.')){
      var tempURL = baseURL.split('.');
      tempURL.length = tempURL.length-1;//Cut off the .com, .org, etc.
      baseURL=tempURL.toString().replace(',','.');
      //console.log("tempURL="+tempURL.toString());
    }
  }

  //Start theBlacklist check
  if (checktheBlacklist(baseURL)){return false;}

  //Start Manual check
  var objKeys = Object.keys(theGroups);
  if (!objKeys.length){console.log('No Defined entries in "theGroups". This could be due to no defined object keys OR a failed sync of "theGroups" on startup');}
  //Take the third object in the array. This should ALWAYS be the distinct URL. Exceptions are custome chrome URLS such as chrome://newtab/
  for (var x=0;x<objKeys.length;x++){
    //console.log(objKeys);
    if (baseURL.includes(objKeys[x])){return objKeys[x];}
  }
  //Start ServiceNow check
  if (settings.automateSNOW && (tab.url.toString().includes('.service-now') || tab.url.toString().includes('.servicenow.com'))){
    return parseSNOW(baseURL);
  }//End ServiceNow check
}//end cehckConfig

function checktheBlacklist(title){
  if (theBlacklist[title]){return false;}
}

function parseSNOW(baseURL){
  //console.log('Found ServiceNow Address');
  var theTitle = baseURL.toString();
//  var theTitle = theURL.replace('https://','');
  if (!theGroups[theTitle]){
    //console.log("Adding new value "+theTitle);
    theGroups[theTitle]="grey";
    chrome.storage.sync.set({theGroups:theGroups});
    //return false;
  }
  return theTitle.toString();
}
function updateAllGroups(oldValue,newValue){
  var objKeys = Object.keys(newValue);
  for (var y=0;y<objKeys.length;y++){
    if (oldValue[objKeys[y]] && newValue[objKeys[y]] !== oldValue[objKeys[y]]){
      //console.log("Entered query and update");
      chrome.tabGroups.query({
        title:objKeys[y]
      }).then(function(idList){
        //console.log(idList);
        for (var x=0;x<idList.length;x++){
          updateGroup(idList[x].id,idList[x].title);
        }
      });
    }//end if
  }//end for
}//end updateAllGroups
function groupTabs(tabObj,theTitle){
  /* API REFERENCE:
    tabObj = The returned object from the onUpdated.Listener when a tab completes loading
    theTitle = the title of the tabs. This should come from the user-defined table or the automated service-now environment finder
  */
  var tabGroup = chrome.tabGroups.query({
    title: theTitle,
    windowId: tabObj.windowId
  }).then(
    function(response){
      if (response[0]){
        //console.log('Entered response[0] code');
        chrome.tabs.group({groupId:response[0].id,tabIds:tabObj.id});
      } else {
        chrome.tabs.group({tabIds:tabObj.id}).then(
          function(r){
            updateGroup(r,theTitle);
          }//end function(r)
      );}//end else
    });//end then
}//end groupTabs

function updateGroup(id,title){
  //console.log(id+"="+title);
  if (!title){console.error("NO TITLE SENT!");return;}
  if (!id){console.error("NO TAB ID SENT!");return;}
  var updateObj = {title:title};
  if (theGroups[title]){
    //console.log(theGroups[title]);
    updateObj.color=theGroups[title];
  }
  else {
    console.log("No value for "+id+"="+title);
  }
  chrome.tabGroups.update(id,updateObj);
}//end updateGroup
