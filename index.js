const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://{process.env.DB_USER}:{DB_PASS}@allitems.durq4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");

    console.log("Database Connected");
    // perform actions on the collection object
    client.close();
});




app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(port, () => {
    console.log("Listening to Port", port)
})


//user
//1NHR2v66opcEpcDd