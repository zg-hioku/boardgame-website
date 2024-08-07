const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise'); // 使用 mysql2/promise 模块

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 连接 MySQL 数据库
const pool = mysql.createPool({
    host: 'localhost',
    user: 'myuser',
    password: 'Boardgame2024@jaist',
    database: 'mydatabase',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 注册端点
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 检查用户名是否已存在
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            // 用户名已存在
            res.json({ success: false, message: 'Username already exists' });
        } else {
            // 对密码进行加密
            const hashedPassword = await bcrypt.hash(password, 10);
            // 插入新用户
            await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
            res.json({ success: true });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 登录端点
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 查找用户
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            // 用户不存在
            res.json({ success: false, message: 'User does not exist' });
        } else {
            // 验证密码
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Incorrect password' });
            }
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
