# Extension Collect Feedback

## Summary

The feedback extensions allows the end user to add feedback for the site where this extension has been installed. It will add a button to all pages in the site. Clicking the button will open a panel that show the Site URL, Page URL, textbox for entering feedback for the current page and a feedback category. 

### Why do you need this extension

When you deliver a new application within SharePoint Online, you want to collect feedback. The most simple way to do that is creating a list and allow all people in the site to enter information. However, you want to know the site and/or page people are visiting and providing feedback on. This web part assembles this information and stores it in the list together with the feedback. Easy, no rocket science, everybody understands it...

![Feedback](./images/FeedbackExtension.gif)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.13-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Feedback List

The list is a straightforward SharePoint list that is automatically created after the first time the feedback button is clicked. Make sure that when you install the extension, you click once (as an admin) on the button to create the list. Visitors will not be allowed to create lists on the site. They will receive a nice error message when the list does not exist.

As you can see in the image below the list contains the following columns. They must exist, you can change whatever you want on the (for instance) `Status` field, sort order or grouping, as long as the following fields exists.

| Field | Type | Remarks |
| ----- | ---- | ------- |
| Title | Single line of Text | Default title field in the list |
| Body | Multiline Textfield | You can change this to plain text or full HTML if you like after the list is created
| SiteUrl | Hyperlink |
| PageUrl | Hyperlink |
| Category | Choice | Enter your own categories here, the feedback form will retrieve and shows these categories on the feedback form |
| Status | Choice | At least status `New` should be present |

![List Example](./images/ListSample.png)

## Using alternate `Category` or `Status` choices

The information below is applicable to both the `Category` and `Status` field, the sample will focus on the `Category` field.

When creating the list at first time use, the `Category` choice field will be created with a single choice in the list: **Other**. You can add extra categories in the list itself. You can even remove the category **Other** if you like. The order in which the categories appear in the list choice field is the same as the order on the feedback form.

## Creating the list

There are not special needs for the extension. If the Feedback list does not exist, it will be created. 

![Create Feedback List](./images/FeedbackCreateList.gif)

However the permissions for the list will not be changed. You have to do this by hand after the list is created. Be sure to login as a site admin
1. Open the list
2. Choose Gear Icon > Library Settings > Library Permissions
3. Break the role inheritance
4. Add persmission level `Contribute` to the Visitors group

## Feedback Settings

As from V3.0 you're able to modify the settings of the feedback button. You can use a JSON file for this that is stored in `Site Assets` > `Folder: Feedback` > `feedback.json`. You can change the following settings.

| Setting | Type | Remarks |
| ------- | ---- | ------- |
| defaultText | string | Change the label on the feedback button |
| backgroundColor | string | Color code, default = `#1e3c82` |
| textColor | string | Color code, default = `#ffffff` |
| disableHover | boolean | Disable hover button and shows the entire button without hover effect. Default = `false` |
| disableFeedbackButton | boolean | Do not show the button at all, default = `false` |

### Example 01 - `feedback.json` file

In the following example the `feedback.json` only changes the default button label **Give Feedback** to **Your Feedback!**

```
{
  "defaultText": "Your feedback!"
}
```

### Example 02 - `feedback.json` file

In the following example the `feedback.json` the default button label **Give Feedback** changed to **Your Feedback!** and we disabled the hover effect on the button. Note: since `disableHover` is a boolean variable, you do not need to use the quotes!

```
{
  "defaultText": "Your feedback!",
  "disableHover": true
}
```

### Example 03 - `feedback.json` file

In the following example the `feedback.json` we disabled the hover effect on the button and changed the background color to yellow and the label color to black. As you can see, the color coding you use is arbitrary and can be standaard HTML or HEX codes or whatever color code you want to use.

```
{
  "disableHover": true,
  "backgroundColor": "yellow",
  "textColor": "black"
}
```

## Solution

| Solution | Author(s) |
| -------- | ---------
| CollectFeedback | Maarten van den Dungen, Rapid Circle |

## Version history

| Version | Date | Comments |
| ------- | ---- | -------- |
| 1.0 | January 10, 2022 | Initial release
| 2.0 | July 14, 2022 | Updated version; semi hide the button until mouse over |
| 3.0 | July 23, 2022 | Updated version, see Feedback Settings section |

### Version History Change List

**Version V3.0**
- Added Category Choice field shown on the feedback form (thanks @JoeAyre)
- Implemented settings to control the solution a bit more per site collection
- Localization added voor the Netherlands


## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- change the `serve.json`, update the `pageUrl` to your environment 
- in the command-line run:
  - **npm install**
  - **gulp serve**

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development