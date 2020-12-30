const mongoose = require('mongoose');
// const cities = require('./cities');
const finland = require('./finland');
const { descriptors } = require('./seed-helpers');
const Playground = require('../models/playground');

mongoose.connect('mongodb://localhost:27017/playgrounds-on-map', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Playground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const randomIndex = Math.floor(Math.random() * finland.length);
        const playground = new Playground({
            author: '5fe9bbb4aac7031ed0b827a6',
            location: `${finland[randomIndex].properties.name}`,
            title: `${sample(descriptors)}puisto`,
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic repellendus eos vero, provident dolorum id esse sint vitae maxime natus expedita delectus, placeat magnam eum sed dolor ratione exercitationem temporibus.Quam sed error quod placeat quidem ipsa suscipit quibusdam odit tempore explicabo! Vero eius, hic dolorem ad dolorum qui nulla suscipit inventore consectetur maiores labore tenetur debitis laborum facere. Cupiditate!',
            geometry: finland[randomIndex].geometry,
            // geometry: {
            //     type: 'Point',
            //     coordinates: [
            //         cities[randomIndex].longitude,
            //         cities[randomIndex].latitude,
            //     ],
            // },
            images: [
                {
                    url:
                        'https://res.cloudinary.com/dzmcq4kiz/image/upload/v1609147256/Playgrounds/image1.jpg',
                    filename: 'Playgrounds/image1',
                },
                {
                    url:
                        'https://res.cloudinary.com/dzmcq4kiz/image/upload/v1609147256/Playgrounds/image2.jpg',
                    filename: 'Playgrounds/image2',
                },
            ],
        });
        await playground.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
