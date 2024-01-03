const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./models/sequelize');
const User = require('./models/user');
const expense = require('./models/Expense');
const orders = require('./models/orders');
const forgotpassword = require('./models/forgotpassword');
const { signupController, loginController } = require('./controllers/userController');
const { postExpenses, getExpenses, deleteExpense, updateExpense } = require('./controllers/expenseController');
const { purchasePremium, updatePremiumStatus } = require('./controllers/premiumController');
const { getLeaderboard } = require('./controllers/leaderboardController');
const { resetPassword, newPassword, passwordUpdate } = require('./controllers/forgotController');

dotenv.config();

User.hasMany(expense);
expense.belongsTo(User);
User.hasMany(forgotpassword);
forgotpassword.belongsTo(User);
User.hasMany(orders, { foreignKey: 'userId' });
orders.belongsTo(User, { foreignKey: 'userId' });

app.use(cors());
sequelize.sync();
app.use(express.json());

app.post('/postExpense', postExpenses);
app.get('/getExpense', getExpenses);
app.delete('/deleteExpense/:expenseId', deleteExpense);
app.patch('/updateExpense/:expenseId', updateExpense);

app.post('/signup', signupController);
app.post('/login', loginController);
app.post('/purchasePremium', purchasePremium);
app.post('/updatePremiumStatus', updatePremiumStatus);
app.get('/leaderBoard', getLeaderboard);
app.post('/password/reset', resetPassword);
app.get('/password/new/:id', newPassword);
app.post('/password/update/:id', passwordUpdate);

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
