var express = require("express");
var app = express();

const notifications = [
    {
        title: 'Clearance: Up to 80% Off!',
        message: 'Shop now!',
        icon: 'images/jl.jpg',
        tag: 'clearance',
        url: 'https://www.jessicalondon.com/j/clearance/?ICID=NB|clearance|CTA1|10-6-2020'
    },
    {
        title: 'New Arrivals!',
        message: 'Check out the latest fall pieces.',
        icon: 'images/jl.jpg',
        tag: 'newarrival',
        url: 'https://www.jessicalondon.com/j/featured/new-arrivals/'
    }
];

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get("/notif", (req, res, next) => {
    res.json(notifications[Math.round(Math.random())]);
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});