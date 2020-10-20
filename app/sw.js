const cacheString = 'cache-v';
const precacheResources = [
  '/',
  'index.html',
  'styles/main.css',
  'images/jessicaLondon_UC.svg',
  'images/shirt1.jpg',
  'images/shirt2.jpg',
  'images/shirt3.jpg',
  'images/shirt4.jpg',
  'images/shirt5.jpg',
  'images/account-icon.png',
  'images/bag-icon.png',
  'images/card-icon.png',
  'images/catalog-icon.png',
  'images/search-icon.png',
  'samples/page1.html',
  'samples/page2.html',
  'samples/page3.html'
];

let cacheNumber = 0;
let cacheName;

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  cacheNumber += 1;
  cacheName = cacheString.concat(cacheNumber);
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log(cacheNames);
      return Promise.all(
        cacheNames.filter(function(name) {
          return name.charAt(name.length - 1) !== cacheNumber;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
    event.waitUntil(
      update(event.request)
      .then(refresh)
    );
});

function update(request) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}
 
function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
 
      var message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag')
      };
 
      client.postMessage(JSON.stringify(message));
      console.log('service worker refreshed');
    });
  });
}


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
  
    const api_url = 'http://localhost:8081/notif';
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
