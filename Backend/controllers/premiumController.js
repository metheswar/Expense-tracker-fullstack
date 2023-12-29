const Razorpay = require("razorpay");
const { verifyToken, generateToken } = require("../helpers/jwtHelper");
const User = require("../models/user");
const Order = require("../models/orders");

const purchasePremium = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    const user = await User.findByPk(decodedToken.userId);

    const amount = 100*100;
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
      if (err) {
        console.error('Razorpay Order Creation Error:', err);
        throw new Error(JSON.stringify(err));
      }

      user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
        return res.status(201).json({
          order,
          key_id: rzp.key_id,
          message: 'Order created successfully',
        });
      }).catch((err) => {
        throw new Error(err);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Something went wrong', error: err });
  }
};

const updatePremiumStatus = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);
    const { paymentid, orderid } = req.body;

    const user = await User.findByPk(decodedToken.userId);
    const order = await Order.findOne({ where: { orderid: orderid } });

    await order.update({ paymentid: paymentid, status: 'SUCCESSFUL' });
    await user.update({ premiumUser: true });

    res.status(202).json({
      success: true,
      message: "Transaction Successful",
      token: generateToken(decodedToken.userId, user.name, user.premiumUser),
    });
  } catch (err) {
    res.status(403).json(err);
  }
};

module.exports = { purchasePremium, updatePremiumStatus };
