// controllers/expenseController.js
const Expense = require('../models/Expense');
const User = require('../models/user');
const { verifyToken } = require('../helpers/jwtHelper');
const sequelize = require('../models/sequelize');

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

module.exports = { postExpenses, getExpenses, deleteExpense, updateExpense };
