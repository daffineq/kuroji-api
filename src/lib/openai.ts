import OpenAI from 'openai';
import { Config } from 'src/config';

let openai: OpenAI | null = null;

if (Config.has_openai_api_key) {
  openai = new OpenAI({ apiKey: Config.openai_api_key });
}

async function getEmbedding(text?: string) {
  if (openai && text) {
    const res = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    return res.data[0]?.embedding;
  }

  return null;
}

export { openai, getEmbedding };
