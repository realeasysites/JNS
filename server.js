require('dotenv').config();
const path = require('path');
const express = require('express');
const quote = require('./routes/quote');
const admin = require('./routes/admin');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

app.use('/api/quote', quote);
app.use('/admin', admin);
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'], maxAge: '1h' }));

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Jalbert n' Sons running on :${port}`));
