const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://user:1NHR2v66opcEpcDd@allitems.durq4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log("DB Connected");
        const itemCollection = client.db("allitem").collection("inventory-item");

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });
        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });
        app.put('/item/:id', async (req, res) => {
            const qty = req.body;
            console.log(qty);
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const update = {
                $set: {
                    quantity: qty.newQuantity

                }
            }
            const result = await itemCollection.updateOne(filter, update);
            res.send(result);
            console.log(result);
        });

    }
    finally {

    }

}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(port, () => {
    console.log("Listening to Port", port)
})


//user
//1NHR2v66opcEpcDd