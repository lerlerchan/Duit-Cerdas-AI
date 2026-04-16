const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const scams = [
  {
    content: "LHDN Macau Scam: Scammers call pretending to be tax officers claiming you have arrears and threatening travel bans or arrest warrants unless immediate payment is made to a personal account.",
    metadata: { source: "PDRM", type: "Macau Scam" }
  },
  {
    content: "Fake Shopee Job: Offers high daily commission for simple tasks like 'liking' products. Requires initial deposit which is then stolen.",
    metadata: { source: "BNM", type: "Job Scam" }
  },
  {
    content: "Telegram Crypto Pump: Invitations to private groups promising 500% returns on new coins. Users are urged to buy fast before the 'pump' ends.",
    metadata: { source: "SC", type: "Investment Scam" }
  },
  {
    content: "Romance Scam: Scammers build long-term emotional trust on social media before requesting emergency funds for medical or customs 'problems'.",
    metadata: { source: "PDRM", type: "Love Scam" }
  }
];

async function seed() {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  for (const scam of scams) {
    console.log(`Embedding: ${scam.metadata.type}...`);
    const result = await model.embedContent(scam.content);
    const embedding = result.embedding.values;

    const { error } = await supabase
      .from('scam_patterns')
      .insert({
        content: scam.content,
        embedding: embedding,
        metadata: scam.metadata
      });

    if (error) console.error(error);
  }
  console.log("Seeding complete!");
}

seed();
