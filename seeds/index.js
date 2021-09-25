const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '61457bce2b531a0ac81814c2',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam sit voluptas impedit maiores possimus repellendus quam, error ut qui quaerat quia corporis corrupti quae dicta, vel quas eaque natus illum?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dkmz68shi/image/upload/v1631654344/YelpCamp/tdu0w5z2vgpfdhqwltjf.jpg',
                    filename: 'YelpCamp/tdu0w5z2vgpfdhqwltjf'
                }
            ]
        });
        await camp.save();
    }
};

seedDB()
    .then(() => {
        mongoose.connection.close();
    })