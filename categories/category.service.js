const 
    db = require('_helpers/db'),
    Category = db.Category;

module.exports = {
    create,
    getSubcat,
    getAll,
    getById
};

async function create(userParam) {
    if (await Category.findOne({ category: userParam.category })) {
        throw 'That category already exists';
    }

    const category = new Category(userParam);

    await category.save();
    return category;
}

async function getSubcat() {
    const allCats = await Category.find();
    const allSubcats = [];

    allCats.forEach((item) => {
        allSubcats.push(item.subcategories)
    });

    return allSubcats;
}

async function getAll() {
    return await Category.find();
}

async function getById(id) {
    return await Category.findById(id);
}

