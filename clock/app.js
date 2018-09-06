'use strict';

let path = require('path');
let express = require('express');

let app = express();
app.listen(2020);

// host the static stuff out of express
app.use('/', express.static(path.join(__dirname, '.')));

// http://localhost:2020/seattle.html
