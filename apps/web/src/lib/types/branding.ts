export interface BrandingInput {
  // Section 1: Identitas Dasar
  nama: string;
  halYangSuka: string;
  halYangBisa: string;

  // Section 2: Analisis Pasar
  kenapaDibutuhkan: string;
  peluangPenghasilan: string;
  niche: string;
  kategori: string;
  microNiche: string;

  // Section 3: SWOT
  profileSosmed: string;
  kelebihan: string;
  kelemahan: string;
  peluang: string;
  tantangan: string;

  // Section 4: Positioning
  premis: string;
  toneOfVoice: string;
  targetAudiens: string;
}

export const nicheOptions = [
  { value: "tech", label: "💻 Tech", description: "Technology, software, gadgets, programming" },
  { value: "business", label: "💼 Business", description: "Entrepreneurship, startup, marketing" },
  { value: "lifestyle", label: "✨ Lifestyle", description: "Daily life, travel, wellness" },
  { value: "fitness", label: "💪 Fitness", description: "Health, workout, nutrition" },
  { value: "education", label: "📚 Education", description: "Learning, skills, tutorials" },
  { value: "finance", label: "💰 Finance", description: "Investing, money management, crypto" },
  { value: "creative", label: "🎨 Creative", description: "Design, art, photography, content creation" },
  { value: "food", label: "🍕 Food", description: "Cooking, recipes, restaurant reviews" },
  { value: "gaming", label: "🎮 Gaming", description: "Games, esports, streaming" },
  { value: "beauty", label: "💄 Beauty", description: "Makeup, skincare, fashion" },
  { value: "motivation", label: "🔥 Motivation", description: "Self-improvement, mindset, success" },
  { value: "entertainment", label: "🎬 Entertainment", description: "Comedy, reviews, pop culture" },
] as const;

export const toneOptions = [
  { value: "professional", label: "💼 Professional", description: "Formal, authoritative, knowledgeable" },
  { value: "casual", label: "😊 Casual", description: "Friendly, relaxed, approachable" },
  { value: "friendly", label: "🤗 Friendly", description: "Warm, welcoming, supportive" },
  { value: "humor", label: "😂 Humor", description: "Funny, witty, entertaining" },
  { value: "serious", label: "😐 Serious", description: "Thoughtful, deep, meaningful" },
  { value: "inspirational", label: "✨ Inspirational", description: "Motivating, uplifting, empowering" },
  { value: "bold", label: "🔥 Bold", description: "Confident, provocative, daring" },
  { value: "authentic", label: "🌟 Authentic", description: "Genuine, vulnerable, real" },
] as const;

export type NicheValue = (typeof nicheOptions)[number]["value"];
export type ToneValue = (typeof toneOptions)[number]["value"];
