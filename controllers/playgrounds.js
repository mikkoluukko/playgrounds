const Playground = require('../models/playground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const playgrounds = await Playground.find({});
    res.render('playgrounds/index', { playgrounds });
};

// module.exports.list = async (req, res) => {
//     const equipment = [
//         'Swing',
//         'Slide',
//         'Sandbox',
//         'Baby Swing',
//         'Seesaw',
//         'Carousel',
//         'Climbing',
//         'Bench',
//         'Web Swing',
//     ];
//     let filters = [];
//     const playgrounds = await Playground.find({});
//     res.render('playgrounds/list', { playgrounds, equipment, filters });
// };

module.exports.list = async (req, res) => {
    const equipment = [
        'Swing',
        'Slide',
        'Sandbox',
        'Baby Swing',
        'Seesaw',
        'Carousel',
        'Climbing',
        'Bench',
        'Web Swing',
    ];
    let filters = [];
    let query;
    if (req.query.filters) {
        filters = req.query.filters;
        // query = `equipment: { $all: [${filters.toString()}] }`;
        query = "equipment: { $all: ['Swing']}";
    }
    console.log('filters: ' + filters + ' query: ' + query);
    const limit = 10;
    const page = req.params.page || 1;
    const playgrounds = await Playground.find({})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
    const count = await Playground.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const currentPage = page;
    res.render('playgrounds/list', {
        playgrounds,
        totalPages,
        currentPage,
        equipment,
        filters,
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render('playgrounds/new');
};

module.exports.createPlayground = async (req, res, next) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.playground.location,
            limit: 1,
        })
        .send();
    console.log(req.body.playground.equipment);
    if (!Array.isArray(req.body.playground.equipment)) {
        req.body.playground.equipment = [req.body.playground.equipment];
    }
    console.log(req.body.playground.equipment);
    const playground = new Playground(req.body.playground);
    playground.geometry = geoData.body.features[0].geometry;
    playground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    playground.author = req.user._id;
    await playground.save();
    req.flash('success', 'Succesfully created!');
    res.redirect(`/playgrounds/${playground._id}`);
};

module.exports.showPlayground = async (req, res) => {
    const playground = await await Playground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('author');
    if (!playground) {
        req.flash('error', 'Cannot find playground');
        return res.redirect('/playgrounds');
    }
    res.render('playgrounds/show', { playground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(id);
    if (!playground) {
        req.flash('error', 'Cannot find playground');
        return res.redirect('/playgrounds');
    }
    res.render('playgrounds/edit', { playground });
};

module.exports.updatePlayground = async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findByIdAndUpdate(id, {
        ...req.body.playground,
    });
    if (req.body.playground.location != playground.location) {
        const geoData = await geocoder
            .forwardGeocode({
                query: req.body.playground.location,
                limit: 1,
            })
            .send();
        playground.geometry = geoData.body.features[0].geometry;
    }
    const images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    playground.images.push(...images);
    await playground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await playground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash('success', 'Succesfully updated!');
    res.redirect(`/playgrounds/${playground._id}`);
};

module.exports.deletePlayground = async (req, res) => {
    await Playground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Succesfully deleted');
    res.redirect('/playgrounds');
};
