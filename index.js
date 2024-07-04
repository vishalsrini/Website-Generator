const express = require('express');
const fetch = require('node-fetch');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const OpenAI = require('openai');
const openai = new OpenAI();

app.use(new cors());

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false, limit: '50mb' }))

// parse application/json
app.use(bodyparser.json())

// app.use(express.json());

app.get('/hello', async (req, res) => {
    res.json({message: "I am good"})
});

app.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt;

  const openAIPrompt = `
  Create a beautiful website using Tailwind CSS based on the following description:
  "${userPrompt}"
  
  Provide the output in JSON format with "html", "css", and "js" keys.
  `;

  try {
      console.log(openAIPrompt);

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [{ role: 'user', content:openAIPrompt }],
    });
    console.log('Response - ', response)

    const data = await response.choices[0].message;

    console.log(data);
    
    const completion = data.content;

    console.log('Data - ', completion);

    const result = JSON.parse(completion);

    res.json({
      html: result.html,
      css: result.css,
      js: result.js
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ error: 'Failed to generate website' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});