import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const ASSISTANT_ID = "asst_kBVsMCL9yVNcBhjmB1n87tqb";

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { shortPrompt } = JSON.parse(req.body);

  const assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID);
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: shortPrompt,
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  let result = "";

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);

    result = messages.data[0]?.content?.[0]?.text?.value ?? "";
  } else {
    console.log(run.status);
  }

  return res.json({ result });
}
