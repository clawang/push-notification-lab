## Lab: Integrating Web Push

## How to run

Run "npm install" in the app/ directory and app/node/ directories.

From the root directory, run "node app/server.js", then go to http://localhost:8081/

## How to use push notification functionality

Once page is running, click "Enable Push Messaging".

After Subscription Object is displayed on page, copy it. Go to app/node/main.js and replace the pushSubscription object with your copied subscription object.

Save and then in another command line, run "node app/node/server.js".

In a third command line, run "node app/node/main.js". You should see a notification pop up.
