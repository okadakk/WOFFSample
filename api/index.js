const express = require('express')
const cors = require('cors');
const fetch = require('node-fetch');
const app = express()
const port = 3000

app.use(cors());

app.get('/', async (req, res) => {
  const headers = req.headers;
  console.log(headers);
  if (!headers.authorization) {
    res.status(401).send('Unauthorized');
    return;
  }
  const token = headers.authorization.split(' ')[1];
  console.log(token);

  try {
    const r = await fetch('https://www.worksapis.com/v1.0/contacts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const body = await r.json();
    console.log(body);
    const url = process.env.FOLLOW_URL || 'http://localhost:3000/follow';
    res.send(body.contacts.map(c => {
      return {
        name: c.contactName.lastName + c.contactName.firstName,
        code: c.contactId,
        url: `${url}&code=${c.contactId}`
      }
    }));
  } catch (e) {
    console.error(e);
    res.status(400).send('Bad Request');
  }
})

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("listening server")
})
