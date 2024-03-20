const express = require("express");
const app = express();
const fs = require("fs").promises;
let data = require("./data.json")

const PORT = 3005;

app.use(express.json())

app.get("/", (req, res) => res.send("<h1>Oscar Anillo</h1><p>Fullstack Developer</p>"))
app.get("/data", (req, res) =>  res.json(data))
app.get("/data/:id", (req, res) => {
    const id = req.params.id;
    try {
        const client = data.clients.find((client) => client.id === id);
        if(client) {
            res.status(201).json(client)
        } else {
            res.status(404).send(`Client under id #${id} was not found`)
        }
    } catch(err) {
        console.log(err)
    }
})

app.post("/data", (req, res) => {
    const body = req.body;
    try {
        const newClient = {
            id: body.id,
            name: body.name,
            city: body.city
        };
        let { clients } = data;
        clients.push(newClient)
        fs.writeFile("data.json", JSON.stringify(data, null, 2))
        res.status(200).json({ message: "New client successfully added"})
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error'})
    }
})

app.delete("/data/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let readData = await fs.readFile("data.json", 'utf-8')
        let items = JSON.parse(readData)
        
        const index = items.clients.findIndex((item) => item.id === id);
        if(index !== -1) {
            items.clients.splice(index, 1);
            await fs.writeFile("data.json", JSON.stringify(items, null, 2))
            res.status(200).json({ message: 'Item deleted successfully'})
        } else {
            res.status(404).json({ message: 'Item not found'})
        }
        
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error'})
    }
    
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))