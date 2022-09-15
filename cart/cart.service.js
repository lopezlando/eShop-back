const db = require("_helpers/db"),
  ObjectId = require("mongodb").ObjectId,
  userService = require("../users/user.service"),
  Cart = db.Cart,
  Product = db.Product;

module.exports = {
  create,
  addToCart,
  deleteItem,
  deleteCart,
  openCart,
  cartLength,
  productLength,
  concat,
  getAll,
  getById,
};

async function create(userParam) {
  const cart = new Cart(userParam);

  await cart.save();
}

async function addToCart(token, userParam) {
  let userId = await userService.getUserId(token),
    productId = userParam.productId,
    quantity = userParam.quantity,
    providerId = "",
    name = "",
    price = Number,
    product = await Product.findOne({ _id: productId });

  if (product) {
    providerId = product.providerId;
    name = product.title;
    price = product.price;
  } else {
    throw "The selected product does not exist.";
  }

  try {
    let cart = await Cart.findOne({ userId: userId });

    //If the user already has an existing cart with products and
    //the product is not present in the cart, it is added to it.
    //if the product is already in the cart, its quantity is updated.

    if (cart) {
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);

      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        cart.products.push({ productId, providerId, quantity, name, price });
      }
      cart = await cart.save();

      return cart;
    } else {
      //If there was no existing cart, a new cart is created
      //and the product is added to it.

      const newCart = await Cart.create({
        userId,
        products: [{ productId, providerId, quantity, name, price }],
      });

      return newCart;
    }
  } catch (err) {
    console.log(err);
  }
}

//delete a single item from the cart

async function deleteItem(token, id) {
  let userId = await userService.getUserId(token),
    cart = await Cart.findOne({ userId });

  cart.products.pull({ _id: ObjectId(id) });

  await cart.save();

  return cart;
}

//delete the whole cart

async function deleteCart(token) {
  let userId = await userService.getUserId(token);

  await Cart.deleteOne({ userId: userId });

  return;
}

async function openCart(token) {
  let userId = await userService.getUserId(token);

  const cart = await Cart.findOne({ userId }, ["products", "-_id"]);

  //since the cart only stores product IDs and quantities,
  //this function formats the response properly as to
  //visualize the product details.

  if (!cart) return;

  let products = cart.products,
    productArray = [];

  for (const cartProduct of products) {
    let product = await Product.findOne({ _id: cartProduct.productId });

    productArray.push({
      cartId: cartProduct._id,
      id: product._id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: cartProduct.quantity,
      stock: product.stock,
    });
  }

  return productArray;
}

async function cartLength(token) {
  let userId = await userService.getUserId(token);

  const cart = await Cart.findOne({ userId }, ["products", "-_id"]);

  let products = cart.products;

  return { cartLength: products.length };
}

async function productLength(token, productId) {
  const userId = await userService.getUserId(token);

  const cart = await Cart.findOne({ userId }, ["products", "-_id"]);

  const products = cart.products;

  for (const product of products) {
    if (product.productId == productId)
      return { productLength: product.quantity };
  }

  return { productLength: 0 };
}

async function concat(product) {
  let fetchData = await Product.findOne({ _id: ObjectId(product.productId) }, [
    "img",
    "expDate",
    "-_id",
  ]);

  let concat = {
    img: fetchData.img,
    name: product.name,
    quantity: product.quantity,
    price: product.price,
    date: fetchData.expDate,
  };

  return concat;
}

async function getAll() {
  return await Cart.find();
}

async function getById(id) {
  return await Cart.findById(ObjectId(id));
}
