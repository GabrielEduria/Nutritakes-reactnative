import 'dotenv/config';

export default {
  expo: {
    name: "NutriTakes",
    slug: "nutritakes",
    version: "1.0.0",
    scheme: "nutritakes", 
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
};
