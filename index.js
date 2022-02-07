require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

//app.get('/createDB', getCategories)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
