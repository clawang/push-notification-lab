const webPush = require('web-push');

const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cmQ9zt4bedo:APA91bH32AUXhH_qqinvaDKL4aXcGiUBi67UbzTVGR69HquS9zJ97d9y51urj0ODc6DybYCi_FK8ZELX50GYJrZe5LlDNGYUyIvnzgUn4dE2axoVKkpJ3iV1iVlS8Di0f3bGUDKsJWfT","expirationTime":null,"keys":{"p256dh":"BE3OHtvmw6fRu-flqwMTGlnUS0KIsMhhIMGZusVAtoe7Ykiw2GcJyeMGMzLgDcRrvH-NeqaKW7roHvoQQO52dK8","auth":"2RmjFi2Qignxnj1dgftqEw"}};

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
