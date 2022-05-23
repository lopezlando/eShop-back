const 
    db = require('_helpers/db'),
    ObjectId = require('mongodb').ObjectId,
    Order = db.Order,
    Cart = db.Cart,
    Product = db.Product,
    Bag = db.Bag,
    User = db.User,
    bagService = require('../bags/bag.service'),
    userService = require('../users/user.service');


module.exports = {
    create,
    openOrder,
    listOfOrders,
    getByStatus,
    changeStatus,
    cancelOrder,
    getAll,
    getById
};

async function create (token, userParam) {

    let userId = await userService.getUserId(token),
        orderId = '',
        productId = '',
        providerId = '',
        quantity,
        actualStock,
        name = '',
        img = '';

    try {

        let cart = await Cart.findOne({ userId: userId });

        if(cart){

            let cartProducts = cart.products,
                order = new Order,
                orderBags = order.bags,
                existingBag = Boolean,
                address = {};

            order.userId = userId;
            orderId = order._id;

            address.street = userParam.street;
            address.streetNumber = userParam.streetNumber;
            address.floor = userParam.floor;
            address.door = userParam.door;
            address.CP = userParam.CP;

            order.address = address;

            let total = 0,
                productSubtotal = 0;

            for (const cartProduct of cartProducts) {

                providerId = cartProduct.providerId;
                productId = cartProduct.productId;
                quantity = cartProduct.quantity;

                productSubtotal = cartProduct.price * cartProduct.quantity;
                total = total + productSubtotal;

                let product = await Product.findOne({_id : ObjectId(productId)});

                if (product) { 

                    if (product.stock < Number(quantity)) {

                        throw 'There is not enough stock to make this purchase.';

                    }

                    let user = await User.findById(userId);

                    if (user) {

                        let favorites = user.favorites,
                            favBool = false;

                        if (favorites.length > 0) {

                            for (const favorite of favorites) {

                                if (favorite.subcategory == product.subcategory) {

                                    favorite.count++;
                                    favBool = true;

                                    await user.save();

                                }

                            }

                            if (!favBool) {

                                user.favorites.push({

                                    subcategory : product.subcategory,
                                    count : 1
    
                                })

                                await user.save();

                            }

                        } else {

                            user.favorites.push({

                                subcategory : product.subcategory,
                                count : 1

                            })

                            await user.save();

                        }

                    } else {

                        throw 'The user could not be retrieved.';

                    }

                    if (product.stock == Number(quantity)) {

                        name = product.name;
                        img = product.img;

                        await Product.deleteOne({_id : ObjectId(productId)});

                    } else {

                        name = product.name;
                        img = product.img;

                        actualStock = Number(product.stock);
                        actualStock = actualStock - Number(quantity);
                        product.stock = actualStock;
                        await product.save();

                    }                    

                } else {

                    throw 'The products stock could not be updated.';

                }
                
                existingBag = false;

                let bag = await bagService.create(

                    orderId, 
                    providerId, 
                    productId, 
                    quantity, 
                    name, 
                    img
                    
                );

                let bagId = String(bag);

                for (const orderBag of orderBags) {

                    if (orderBag.bagId == bagId) {
                        existingBag = true;
                    }

                }

                if (!existingBag) order.bags.push({ bagId })    

            }

            order.total = total;

            await order.save();

            await Cart.deleteOne({_id : ObjectId(cart.id)});

            return order;

        } else {

            throw 'The cart is empty.';

        }
    } catch(err) {

        console.log(err);
        
    }
}

async function openOrder(id) {

    let order = await Order.findOne({ _id: id });

    if (order) {

        let bags = order.bags,
            productArray = [];

        for (const bag of bags) {

            let fetchBag = await Bag.findOne({ _id: bag.bagId });

            if (fetchBag) {

                let products = fetchBag.products;

                for (const product of products) {

                    productArray.push({ 
                        name : product.name,
                        quantity : product.quantity,
                        img : product.img
                    });

                }

            } else {

                throw 'The orders bags could not be retrieved.'

            }
        }

        let userAddress = order.address,
            orderId = order._id,
            status = order.status,
            total = order.total,
            date = order.date;

        return {

            orderId,
            date,
            status,
            productArray,
            total,
            userAddress

        };

    } else {

        throw 'There is no order with that ID.';

    }
}

async function listOfOrders(token) {

    let userId = await userService.getUserId(token),
        orderArray = [],
        order = {};

    const orders = await Order.find({ userId }).sort('-date');

    for (const item of orders) {

        order = await openOrder(item._id);

        orderArray.push({order});

    }

    return orderArray;
}

async function getByStatus(token, statusId) {

    let status = '';

    switch(statusId) {

        case '1':
            status = 'Pending'
            break;
        case '2':
            status = 'In Progress'
            break;
        case '3':
            status = 'Completed'
            break;
        default:
            throw 'Invalid status'

    }

    let userId = await userService.getUserId(token),
        orders = await Order.find({ status, userId });

    return orders;

}

async function changeStatus(userParam) {
    const order = await Order.findOne({_id : ObjectId(userParam.id)});
    const code = userParam.statusCode;

    if(order) {
        switch (code) {
            case '1':
                order.status = 'Pending'
                break;
            case '2':
                order.status = 'In Progress'
                break;
            case '3':
                order.status = 'Completed'
                break;
        }

        await order.save();
        return order;
    }
}

async function cancelOrder(id) {
    await Order.deleteOne(id);

    return;
}

async function getAll() {

    return await Order.find();

}

async function getById(id) {

    return await Order.findById(ObjectId(id));

}