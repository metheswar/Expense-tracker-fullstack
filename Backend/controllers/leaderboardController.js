const { Op } = require('sequelize');
const User = require('../models/user');
const Expense = require('../models/Expense');
const sequelize = require('../models/sequelize')

const getLeaderboard = async (req, res) => {
  try {
  
    const results = await User.findAll({
      attributes: ['id', 'name','email', 'premiumUser', [sequelize.fn('SUM', sequelize.col('expenses.expenseamount')), 'totalExpense']],
      include: [{
        model: Expense,
        attributes: [],
        duplicating: false,
      }],
      group: ['User.id'],
    });

    const formattedResults = results.map(user => ({
      name: user.name,
      totalExpense: user.dataValues.totalExpense || 0,
      email: user.email,
      premium:user.premiumUser
    }));


    res.json(formattedResults);
  } catch (error) {
  
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getLeaderboard };
