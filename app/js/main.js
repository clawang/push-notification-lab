const app = (() => {
  'use strict';

  let isSubscribed = false;
  let swRegistration = null;

  const notifyButton = document.querySelector('.js-notify-btn');
  const pushButton = document.querySelector('.js-push-btn');

  $('.carousel').slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5
  });

  // TODO 2.1 - check for notification support
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications!');
    return;
  }

  // TODO 2.2 - request permission to show notifications
  Notification.requestPermission(status => {
    console.log('Notification permission status:', status);
  });

  function displayNotification() {

    // TODO 2.3 - display a Notification
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {
    
        // TODO 2.4 - Add 'options' object to configure the notification
        const options = {
          body: 'You have successfully subscribed to notifications from Jessica London.',
          icon: 'images/jl.jpg',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
        
          // TODO 2.5 - add actions to the notification
          actions: [
            {action: 'explore', title: 'Go to the site',
              icon: 'images/checkmark.png'},
            {action: 'close', title: 'Close the notification',
              icon: 'images/xmark.png'},
          ],
        
          // TODO 5.1 - add a tag to the notification
          tag: 'id1'
        };
    
        reg.showNotification('Congrats!', options);
      });
    }

  }

  function initializeUI() {

    // TODO 3.3b - add a click event listener to the "Enable Push" button
    // and get the subscription object
    pushButton.addEventListener('click', () => {
      pushButton.disabled = true;
      if (isSubscribed) {
        unsubscribeUser();
      } else {
        subscribeUser();
      }
    });
    
    swRegistration.pushManager.getSubscription()
    .then(subscription => {
      isSubscribed = (subscription !== null);
      updateSubscriptionOnServer(subscription);
      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }
      updateBtn();
    });

  }

  // TODO 4.2a - add VAPID public key
  const applicationServerPublicKey = 'BD4Y_5CC-5oWwTg2cv7S9zZ51tXqvB4TmKYFltrQe_iHuRdz6BkmpucHyCQl_5hO7Uj928JJTcFu1oXJSjfn4rA';

  function subscribeUser() {

    // TODO 3.4 - subscribe to the push service
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(subscription => {
      console.log('User is subscribed:', subscription);
      updateSubscriptionOnServer(subscription);
      isSubscribed = true;
      updateBtn();
      displayNotification();
    })
    .catch(err => {
      if (Notification.permission === 'denied') {
        console.warn('Permission for notifications was denied');
      } else {
        console.error('Failed to subscribe the user: ', err);
      }
      updateBtn();
    });

    }

  function unsubscribeUser() {

    // TODO 3.5 - unsubscribe from the push service
    swRegistration.pushManager.getSubscription()
    .then(subscription => {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(err => {
      console.log('Error unsubscribing', err);
    })
    .then(() => {
      updateSubscriptionOnServer(null);
      console.log('User is unsubscribed');
      isSubscribed = false;
      updateBtn();
    });

  }

  function updateSubscriptionOnServer(subscription) {
    // Here's where you would send the subscription to the application server

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const endpointURL = document.querySelector('.js-endpoint-url');
    const subAndEndpoint = document.querySelector('.js-sub-endpoint');

    if (subscription) {
      //subscriptionJson.textContent = JSON.stringify(subscription);
      //endpointURL.textContent = subscription.endpoint;
      //subAndEndpoint.style.display = 'block';
      $.ajax({
        type: 'POST',
        url: '/subscription',
        contentType: 'application/json',
        data: JSON.stringify(subscription)
      });
    } else {
      subAndEndpoint.style.display = 'none';
    }
  }

  function updateBtn() {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }

    if (isSubscribed) {
      pushButton.textContent = 'Unsubscribe';
    } else {
      pushButton.textContent = 'Sign Up';
    }

    pushButton.disabled = false;
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker.register('sw.js')
      .then(swReg => {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;

        // TODO 3.3a - call the initializeUI() function
        initializeUI();
      })
      .catch(err => {
        console.error('Service Worker Error', err);
      });
    });
  } else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
  }

})();
