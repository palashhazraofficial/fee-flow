const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render('home');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})