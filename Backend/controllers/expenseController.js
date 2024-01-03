// controllers/expenseController.js
const Expense = require('../models/Expense');
const User = require('../models/user');
const { verifyToken } = require('../helpers/jwtHelper');
const sequelize = require('../models/sequelize');
const AWS = require('aws-sdk');
const { v1: uuidv1 } = require('uuid');

const downloadExpenses = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    if (!decodedToken.premiumUser) {
      return res.status(401).json({ success: false, message: 'User is not a premium User' });
    }

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const s3 = new AWS.S3();
    const bucketName = process.env.bucketName;

    const params = {
      Bucket: bucketName,
      Key: `expenses${uuidv1()}.txt`,
      Body: JSON.stringify(await getExpensesForUser(decodedToken.userId)),
    };

    const uploadResult = await s3.upload(params).promise();

    const fileUrl = uploadResult.Location;
    res.status(201).json({ fileUrl, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, success: false, message: 'Something went wrong' });
  }
};

const getExpensesForUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user.getExpenses();
};

const postExpenses = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transaction = await sequelize.transaction();
    let newExpense;

    try {
      newExpense = await user.createExpense({
        expenseamount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return res.status(200).json(newExpense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expenses = await Expense.findAll({
      where: {
        UserId: user.id,
      },
    });

    return res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    const expense = await Expense.findByPk(req.params.expenseId);

    if (!expense || decodedToken.userId !== expense.UserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transaction = await sequelize.transaction();

    try {
      await expense.destroy({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateExpense = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    const expense = await Expense.findByPk(req.params.expenseId);

    if (!expense || decodedToken.userId !== expense.UserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transaction = await sequelize.transaction();

    try {
      expense.expenseamount = req.body.amount;
      expense.description = req.body.description;
      expense.category = req.body.category;

      await expense.save({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { postExpenses, getExpenses, deleteExpense, updateExpense,downloadExpenses };
