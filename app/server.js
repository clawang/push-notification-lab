const express = require('express');
const app = express();

const notifications = [
  {
      title: 'Clearance: Up to 80% Off!',
      message: 'Shop now!',
      icon: 'images/jl.jpg',
      tag: 'clearance',
      url: 'samples/page1.html'
  },
  {
      title: 'New Arrivals!',
      message: 'Check out the latest fall pieces.',
      icon: 'images/jl.jpg',
      tag: 'newarrival',
      url: 'samples/page2.html'
  },
  {
      title: 'Remember to check out!',
      message: "Don't forget about the items you added to your cart.",
      icon: 'images/jl.jpg',
      tag: 'cart',
      url: 'samples/page3.html'
  }
];

// This serves static files from the specified directory
app.use(express.static(__dirname));

let index = 0;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get("/notif", (req, res, next) => {
    res.json(notifications[index]);
    index = (index + 1) % 3;
});

const server = app.listen(8081, () => {

  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
