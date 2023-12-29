// controllers/expenseController.js
const Expense = require('../models/Expense');
const User = require('../models/user');
const { verifyToken } = require('../helpers/jwtHelper');

const postExpenses = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);


    const user = await User.findByPk(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newExpense = await user.createExpense({
      expenseamount: amount,
      category: category,
      description: description,
    });

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
  const { expenseId } = req.params;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    const expense = await Expense.findByPk(expenseId);

    if (!expense || decodedToken.userId !== expense.UserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await expense.destroy();

    return res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { amount, description, category } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verifyToken(token);

    const expense = await Expense.findByPk(expenseId);

    if (!expense || decodedToken.userId !== expense.UserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    expense.expenseamount = amount;
    expense.description = description;
    expense.category = category;

    await expense.save();

    return res.status(200).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { postExpenses, getExpenses, deleteExpense, updateExpense };
