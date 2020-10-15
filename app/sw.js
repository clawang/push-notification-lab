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

const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  //'index.html',
  //'styles/main.css',
  'images/jessicaldn.png',
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});


// TODO 2.6 - Handle the notificationclose event
self.addEventListener('notificationclose', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
  
    console.log('Closed notification: ' + primaryKey);
  });

// TODO 2.7 - Handle the notificationclick event
self.addEventListener('notificationclick', event => {

    // TODO 2.8 - change the code to open a custom page
    const notification = event.notification;
    const url = notification.data.url;
    const action = event.action;
   
    if (action === 'close') {
      notification.close();
    } else {
      clients.openWindow(url);
      notification.close();
    }
  });

// TODO 3.1 - add push event listener
self.addEventListener('push', event => {
  // const options = {
  //   body: 'This notification was generated from a push!',
  //   icon: 'images/jl.jpg',
  //   vibrate: [100, 50, 100],
  //   data: {
  //     dateOfArrival: Date.now(),
  //     primaryKey: 1
  //   },
  //   actions: [
  //     {action: 'explore', title: 'Go to the site',
  //       icon: 'images/checkmark.png'},
  //     {action: 'close', title: 'Close the notification',
  //       icon: 'images/xmark.png'},
  //   ]
  // };

  // event.waitUntil(
  //   self.registration.showNotification('Push Notification', options)
  // );
    const api_url = 'http://localhost:3000/notif';
    event.waitUntil(
      fetch(api_url).then(function(response) {
        if (response.status !== 200) {
          // Either show a message to the user explaining the error
          // or enter a generic message and handle the
          // onnotificationclick event to direct the user to a web page
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          throw new Error();
        }

        // Examine the text in the response
        return response.json().then(function(data) {
          if (data.error) {
            console.error('The API returned an error.', data.error);
            throw new Error();
          }
          var title = data.title;
          var message = data.message;
          var icon = data.icon;
          var notificationTag = data.tag;
          var url = data.url;
          return self.registration.showNotification(title, {
            body: message,
            icon: icon,
            tag: notificationTag,
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1,
              url: url
            },
            actions: [
              {action: 'explore', title: 'Go to the site',
                icon: 'images/checkmark.png'},
              {action: 'close', title: 'Close the notification',
                icon: 'images/xmark.png'},
            ]
          });
        });
      }).catch(function(err) {
        console.error('Unable to retrieve data', err);

        var title = 'An error occurred';
        var message = 'We were unable to get the information for this push message';
        var icon ='images/jl.jpg';
        var notificationTag = 'notification-error';
        return self.registration.showNotification(title, {
            body: message,
            icon: icon,
            tag: notificationTag
          });
      })
    );
});
