const Cart = require('../models/Cart');
const { sendResponseError } = require('../middleware/middleware');

const getCartProducts = async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.user._id }).populate('productId');
    // console.log(carts)
    res.status(200).send({ status: 'ok', carts })
  } catch (err) {
    console.log(err);
    sendResponseError(500, `Error ${err}`, res)
  }
};

const addProductInCart = async (req, res) => {
  const productId = req.body.productId.toString();
  const count = req.body.count.toString();
  try {
    let cart = await Cart.findOneAndUpdate(
      { productId },
      { productId, count, userId: req.user._id },
      { upsert: true },
    );

    if (!cart) {
      cart = await Cart.create({
        productId,
        count,
        userId: req.user._id,
      });
      await cart.save();
    }

    res.status(201).send({ status: 'ok', cart })
  } catch (err) {
    console.log(err);
    sendResponseError(500, `Error ${err}`, res)
  }
};
const deleteProductInCart = async (req, res) => {
  try {
    await Cart.findByIdAndRemove(req.params.id);
    res.status(200).send({ status: 'ok' })
  } catch (err) {
    console.log(err);
    sendResponseError(500, `Error ${err}`, res)
  }
};
module.exports = { addProductInCart, deleteProductInCart, getCartProducts };
