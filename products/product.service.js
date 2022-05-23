const 
    db = require('_helpers/db'),
    Product = db.Product,
    Provider = db.Provider,
    Category = db.Category,
    userService = require('../users/user.service'),
    ObjectId = require('mongodb').ObjectId;

module.exports = {
    create,
    updateStock,
    partialMatch,
    getBySubcategory,
    getByProvider,
    getByProvSubcat,
    getByCategory,
    recommended,
    getAll,
    getById
};

async function create(userParam) {

    const product = new Product;

    let category = await Category.findOne({ 'subcategories._id': userParam.subcatId });

    if (category) {

        product.category = category.category;

        let subcategories = category.subcategories;

        for (const subcategory of subcategories) {

            if (subcategory._id == userParam.subcatId) product.subcategory = subcategory.subcategory;

        }

    } else {

        throw 'There is no subcategory with that ID.';

    }

    let provider = await Provider.findOne({ _id: userParam.providerId})

    if (provider) {

        product.providerId = provider._id;
        product.providerName = provider.name;
        product.providerImg = provider.img;

    } else {

        throw 'There is no provider with that ID.';
    }

    product.name = userParam.name;
    product.description = userParam.description;
    product.price = userParam.price;
    product.img = userParam.img;
    product.stock = userParam.stock;


    await product.save();

    return product;
}

async function updateStock (userParam) {

    const product = await Product.findOne({ _id : userParam.id });

    product.stock = userParam.newStock;

    await product.save();
    return product;

}

async function partialMatch(query) {

    let params = {
        name: { "$regex" : query.name, "$options" : "i" }
    }
    
    if(query.category){
        params.category = { "$regex" : query.category, "$options" : "i" };
    }
    
    if(query.subcategory){
        params.subcategory = { "$regex" : query.subcategory, "$options" : "i" };
    }
    
    if(query.providerId){
        params.providerId = query.providerId;
    }

    return await Product.find({
        $and: [params]
    }).sort({'expDate': -1})

}

async function getBySubcategory(subcat) {
    
    return await Product.find({ subcategory : subcat });
}

async function getByProvider(prov) {
    return await Product.find({ providerId : prov });
}

async function getByProvSubcat({provId, subcat}) {
    return await Product.find({providerId : provId, subcategory: subcat});
}

async function getByCategory(cat) {
    return await Product.find({ category : cat });
}

async function recommended(req){
    const user = await userService.retrieveUser(req);
    const favs = user.favorites;
    let favItems = [];
    let listOfFavs = [];
    favs.sort((a, b) => {
        return b.count - a.count;
    });

    if (favs.length == 0) {

        return await Product.find().limit(20);

    }

    return new Promise(function(resolve, reject) {
        favs.forEach((item, i) => {
            favItems = getBySubcategory(item.subcategory).then(function(result) {
                result.forEach( item2 => {
                    listOfFavs.push(item2);
                })
                i == favs.length-1 ? resolve(listOfFavs) : null;
            })

        });
    })
               
}

async function getAll() {
    return await Product.find();
}

async function getById(id) {
    return await Product.findById(ObjectId(id));
}