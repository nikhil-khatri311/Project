import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Request received for DALL-E generation');
    console.log('Prompt:', prompt);

    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    console.log('Response from OpenAI:', aiResponse.data);

    const image = aiResponse.data.data[0].b64_json;
    console.log('Base64 image generated successfully');

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error('Error occurred during DALL-E generation:');
    console.error('Error response data:', error.response?.data);
    console.error('Error message:', error.message);

    res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
  }
});

export default router;
