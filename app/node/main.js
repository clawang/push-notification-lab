const webPush = require('web-push');

const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cgNvXrCiRA8:APA91bEcHi7NbjgCCTmaQPeCrd7G1oA7_X4oO5WeqKPuLIu36j0nKJkhjzMrxGEDYwGkMeLLqcsVOj2U4O2VgVw-SrghYqCHax9jkfla0cY7LYFogSmOWwBl-ofIpXsgTKq2HQtS9ooY","expirationTime":null,"keys":{"p256dh":"BFojl6UY46b3DxOzhbpy7g4nY_Wtk5EwIJhPGb2hAWM2pmA7-MA3cvE2qzlbTdI5b6LWdiJ4hvkOu4hnOQGzFu0","auth":"BXmghhR8YOPSGddSL76zZg"}};

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
