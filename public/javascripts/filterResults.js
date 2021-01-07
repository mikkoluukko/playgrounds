function moi() {
    // alert('moi');
    ('use strict');

    let equipment = document.getElementsByClassName('equipmentFilter');

    for (value of equipment) {
        if (value.checked) {
            filters.push(value.value);
        }
    }
    console.log(equipment);
    console.log(filters);
    // (async () => {
    // const playgrounds = Playground.find({});
    //     .limit(limit * 1)
    //     .skip((page - 1) * limit)
    //     .exec();

    // alert(playgrounds);
    // })();

    // const count = await Playground.countDocuments();
    // const totalPages = Math.ceil(count / limit);
    // const currentPage = page;
    // res.render('playgrounds/list', { playgrounds, totalPages, currentPage, filters });

    //     async (req, res) => {
    //         res.render('playgrounds/index');
    //     }
    // )();
}
