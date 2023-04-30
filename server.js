const express = require('express')
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()
const PORT = 8000;
const OPENAI_API_KEY=process.env.OPENAI_API_KEY;

app.get('/', (req,res)=>{
    res.send('Home');
})
app.post('/completions', async (req, res)=>{
    // console.log(req.body);
    try {
        
        let response = await fetch('https://api.openai.com/v1/chat/completions', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${OPENAI_API_KEY}`
            },
            body : JSON.stringify({
                model : 'gpt-3.5-turbo',
                messages : [{role : 'user', content : req.body.prompt||'Hello!'}],
                max_tokens : 100,
            })
        });
        let data = await response.json();
        res.send(data);

    } catch (error) {
        console.log(error);
    }
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`App listening on port ${PORT}`)
  })