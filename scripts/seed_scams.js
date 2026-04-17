const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();
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

    try {
      await db.collection('scam_patterns').add({
        content: scam.content,
        embedding: admin.firestore.FieldValue.vector(embedding),
        metadata: scam.metadata
      });
      console.log(`✅ Seeded ${scam.metadata.type}`);
    } catch (error) {
      console.error(`❌ Error seeding ${scam.metadata.type}:`, error);
    }
  }
  console.log("Seeding complete!");
}

seed();
