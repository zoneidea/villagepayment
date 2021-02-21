const express = require('express');
const bodyParser = require('body-parser');
const sendemail = require('./routes/sendemail');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/sendemail', sendemail);


const port = process.env.PORT || 4200
app.listen(port, () => console.log(`Listening on port${port}...`));