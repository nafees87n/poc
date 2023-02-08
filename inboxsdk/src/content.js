// Load the InboxSDK library
import * as InboxSDK from "@inboxsdk/core";
// var gapi = Window.gapi;
// Initialize the InboxSDK with your API key
// InboxSDK.load(2, "gmail-snooze").then(function (sdk) {
//   // Create a button in the Gmail interface to snooze mails
//   sdk.Toolbars.addToolbarButtonForApp({
//     title: "Snooze",
//     iconUrl: "icon.png",
//     onClick: function (event) {
//       var selectedEmail = sdk.Widgets.getSelectedEmails()[0];
//       var emailId = selectedEmail.getMessageID();
//       var snoozetime = new Date();
//       snoozetime.setHours(snoozetime.getHours() + 1);
//       console.log("!!!debug","event",)

//       // gapi.client.gmail.users.threads
//       //   .modify({
//       //     userId: "me",
//       //     id: emailId,
//       //     addLabelIds: ["SNOOZE"],
//       //     removeLabelIds: ["INBOX"],
//       //     resources: {
//       //       addLabelIds: ["SNOOZE"],
//       //       removeLabelIds: ["INBOX"],
//       //     },
//       //   })
//       //   .then(function (response) {
//       //     console.log("Email has been snoozed successfully");
//       //   });
//     },
//   });
// });

InboxSDK.load(2, "snoozegmail").then((sdk) => {
  // the SDK has been loaded, now do something with it!
  sdk.Compose.registerComposeViewHandler((composeView) => {
    // a compose view has come into existence, do something with it!
    composeView.addButton({
      title: "My Nifty Button!",
      iconUrl:
        "https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
      onClick(event) {
        event.composeView.insertTextIntoBodyAtCursor("Hello World!");
      },
    });
  });
  sdk.Toolbars.addToolbarButtonForApp({
    title: "Snooze",
    iconUrl: "icon.png",
    onClick: function (event) {
      var selectedEmail = sdk.Widgets.getSelectedEmails()[0];
      var emailId = selectedEmail.getMessageID();
      var snoozetime = new Date();
      snoozetime.setHours(snoozetime.getHours() + 1);
      console.log("!!!debug", "event in ");
    },
  });
});
