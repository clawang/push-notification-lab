/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const webPush = require('web-push');

const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/dQwE1-EJSeM:APA91bFyGi2mDalXZ7VavLg8CNm4XcLfLsZNLrvsixmozfpkpCSr1WzGtCgLVOHOYE21M3_HPdAvhcb0IC8IV-as55D_WDXm47dO5Q4V-Gj6QTjSkQIfPG6T5OTq5tM-q9U7Gr5Xn6z1","expirationTime":null,"keys":{"p256dh":"BOqfzG1jDl1PbqFqIh46vnyKfrOpnkkf4DH5G9V2bFmwu7sqZYf9YGmFp3FJSxh9xXamV2OHn6OV4XowlcVDXtU","auth":"Y7goMnwom2WzUWz5Ln3jUw"}};

const vapidPublicKey = 'BD4Y_5CC-5oWwTg2cv7S9zZ51tXqvB4TmKYFltrQe_iHuRdz6BkmpucHyCQl_5hO7Uj928JJTcFu1oXJSjfn4rA';
const vapidPrivateKey = 'ogA9XChLz8fe_PdMhNaK5XOQPziszdUexgEp9X69Y6Q';

const payload = 'Here is a payload!';

const options = {
  // gcmAPIKey: 'YOUR_SERVER_KEY',
  TTL: 60,
  vapidDetails: {
    subject: 'mailto:cwang@fbbrands.com',
    publicKey: vapidPublicKey,
    privateKey: vapidPrivateKey
  }
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
);
