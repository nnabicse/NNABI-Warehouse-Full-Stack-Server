const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized Access' })
    }
    console.log(authHeader);
    next();

}


const uri = `mongodb+srv://user:1NHR2v66opcEpcDd@allitems.durq4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log("DB Connected");
        const itemCollection = client.db("allitem").collection("inventory-item");
        const purchaseCollection = client.db("allitem").collection("incoming-purchase");
        const orderCollection = client.db("allitem").collection("outgoing-order");

        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '365d'
            });
            res.send({ accessToken });


        })

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


        //incoming purchases
        app.get('/purchase', async (req, res) => {
            const query = {};
            const cursor = purchaseCollection.find(query);
            const purchases = await cursor.toArray();
            res.send(purchases);
        });

        app.post('/item', async (req, res) => {
            const item = req.body;
            const items = await itemCollection.insertOne(item);
            res.send(items);
            console.log(item);
        });

        app.delete('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await purchaseCollection.deleteOne(query);
            res.send(result);

        });

        //outgoing orders
        app.get('/order', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.get('/items', verifyJWT, async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = itemCollection.find(query)
            const myItems = await cursor.toArray();
            res.send(myItems);
        })


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