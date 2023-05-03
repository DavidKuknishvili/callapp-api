const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const PORT = 3001

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req,res)=>{
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");

    fs.readFile('db/callapp_db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.status(200).send(data.toString())
    });

})

app.post('/', (req,res)=>{
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");


    const newData = req.body
    fs.readFile('db/callapp_db.json', 'utf8', (err, fileData) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading file');
          return;
        }
        const jsonData = JSON.parse(fileData);
        jsonData.push(newData);

        fs.writeFile('db/callapp_db.json', JSON.stringify(jsonData), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error writing file');
            return;
          }
          res.status(200).json(jsonData);

        });
      });


    
})

app.delete('/:id', (req,res)=>{
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");

    const id = req.params.id

    fs.readFile('db/callapp_db.json', 'utf8', (err, fileData) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading file');
          return;
        }
        const jsonData = JSON.parse(fileData);
        const updatedData = jsonData.filter(obj => obj.id !== parseInt(id));
        fs.writeFile('db/callapp_db.json', JSON.stringify(updatedData), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error writing file');
            return;
          }
          res.status(200).json(jsonData);
        });
      });

})

app.put('/', (req,res)=>{
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");



    const updated_obj = req.body


    fs.readFile('db/callapp_db.json', 'utf8', (err, fileData) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error reading file');
          return;
        }
        const jsonData = JSON.parse(fileData);
        const index = jsonData.findIndex(obj => obj.id === updated_obj.id);
        if (index === -1) {
          res.status(404).send(`Object with ID ${id} not found`);
          return;
        }
        const updatedData = [
          ...jsonData.slice(0, index),
          { ...jsonData[index], ...updated_obj },
          ...jsonData.slice(index + 1)
        ];
        fs.writeFile('db/callapp_db.json', JSON.stringify(updatedData), 'utf8', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error writing file');
            return;
          }
          res.status(200).json(updatedData);
        });
      });
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})


