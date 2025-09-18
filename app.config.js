import 'dotenv/config';

export default {
  expo: {
    name: "NutriTakes",
    slug: "nutritakes",
    version: "1.0.0",
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
};
