const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o9jnfig.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const taskCollection = client.db('schedules').collection('tasks')
      
        app.post('/task', async (req, res) => {
            const task = req.body
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })

        app.get('/mytask/:email', async (req, res) => {
            const email = req.params.email
            const query = {email: email}
            const myTask = await taskCollection.find(query).toArray()
            res.send(myTask)
        })

        app.delete('/mytask/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/mytask/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updatedDoc = { $set: req.body }
            const result = await taskCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.put('/complete/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = { $set: req.body }
            const result = await taskCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.put('/notcomplete/:id', async (req, res) => {
           const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = { $set: req.body }
            const result = await taskCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
       })

    }
    
    finally {
        
    }
}

run().catch(console.log)

app.get('/', (req, res) => {
    res.send('task manager server is running')
})

app.listen(port, () => console.log(`task manager server is running on ${port}`))