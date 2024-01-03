const process = require('process');
process.setMaxListeners(15);

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const forgotPassword = require('../models/forgotpassword');
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user) {
            const id = uuid.v4();
            await forgotPassword.create({ UserId: user.id, id, active: true });

            sgMail.setApiKey(process.env.SENGRID_API_KEY);

            const msg = {
                to: email,
                from: 'metheswar2002@gmail.com',
                subject: 'Reset Password',
                text: 'Click the link below to reset your password:',
                html: `<p>Click the link below to reset your password:</p><a href="http://localhost:3001/password/new/${id}">Click here</a>`,
            };

            await sgMail.send(msg);

            return res.status(200).json({ message: 'Link to reset password sent to your email', success: true });
        } else {
            throw new Error('User does not exist');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const newPassword = async (req, res) => {
    const id = req.params.id;

    try {
        const forgotPasswordRequest = await forgotPassword.findOne({ where: { id } });

        if (forgotPasswordRequest && forgotPasswordRequest.active === true) {
            await forgotPasswordRequest.update({ active: false });

            res.status(200).send(`
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                            }

                            form {
                                background-color: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                width: 300px;
                                text-align: center;
                            }

                            label {
                                display: block;
                                margin-bottom: 8px;
                                text-align: left;
                            }

                            input {
                                width: 100%;
                                padding: 8px;
                                margin-bottom: 16px;
                                box-sizing: border-box;
                            }

                            button {
                                background-color: #007bff;
                                color: #fff;
                                padding: 10px 15px;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            }

                            button:hover {
                                background-color: #0056b3;
                            }

                            .password-container {
                                position: relative;
                            }

                            .show-password {
                                position: absolute;
                                right: 8px;
                                top: 50%;
                                transform: translateY(-50%);
                                cursor: pointer;
                            }
                        </style>
                    </head>
                    <body>
                        <script>
                            function formSubmitted(e){
                                e.preventDefault();
                                const newPassword = document.getElementById('newpassword').value;
                                const confirmPassword = document.getElementById('confirmpassword').value;

                                if (newPassword !== confirmPassword) {
                                    alert('Passwords do not match');
                                    return;
                                }

                                // Add your password validation logic here

                                fetch('/password/update/${id}', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ newpassword: newPassword })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data);
                                    if (data.success === true) {
                                        alert('Password changed successfully');
                                    } else {
                                        alert('Internal server Error');
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                    // Handle error as needed
                                });
                            }

                            function togglePasswordVisibility(inputId) {
                                const passwordInput = document.getElementById(inputId);
                                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                                passwordInput.setAttribute('type', type);
                            }
                        </script>

                        <form onsubmit="formSubmitted(event)">
                            <label for="newpassword">New Password:</label>
                            <div class="password-container">
                                <input id="newpassword" name="newpassword" type="password" required>
                                <span class="show-password" onclick="togglePasswordVisibility('newpassword')">👁️</span>
                            </div>
                            
                            <label for="confirmpassword">Confirm Password:</label>
                            <div class="password-container">
                                <input id="confirmpassword" name="confirmpassword" type="password" required>
                                <span class="show-password" onclick="togglePasswordVisibility('confirmpassword')">👁️</span>
                            </div>
                            
                            <button type="submit">Reset Password</button>
                        </form>
                    </body>
                </html>
            `);
        } else {
            throw new Error('Invalid reset password request');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const passwordUpdate = async (req, res) => {
    try {
        const { newpassword } = req.body;
        const { id } = req.params;
        const forgotPasswordRequest = await forgotPassword.findOne({ where: { id } });

        if (forgotPasswordRequest) {
            const user = await User.findByPk(forgotPasswordRequest.UserId);

            if (user) {
                const saltRounds = 10;

                bcrypt.genSalt(saltRounds, function (err, salt) {
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }
                    bcrypt.hash(newpassword, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        user.update({ password: hash }).then(() => {
                            forgotPasswordRequest.destroy()
                            res.status(201).json({ success: true });
                        });
                    });
                });
            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            return res.status(404).json({ error: 'Invalid reset password request', success: false });
        }
    } catch (error) {
        return res.status(403).json({ error, success: false });
    }
};

module.exports = { resetPassword, passwordUpdate, newPassword };
