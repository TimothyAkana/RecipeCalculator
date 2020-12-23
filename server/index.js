const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = 3000;
const PATH = path.join(__dirname, '/../client/dist');
const app = express();

app.use(morgan('dev'));
app.use('/', express.static(PATH));
app.use(bodyParser.json());

app.listen(PORT, () => console.log('server is listening on port ', PORT));
