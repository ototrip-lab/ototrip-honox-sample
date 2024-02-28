import { Ai } from '@cloudflare/ai';
import { css } from 'hono/css';
import type { FC } from 'hono/jsx';
import { createRoute } from 'honox/factory';

import BaseLayout from '../components/layout';

type Data = {
  text?: string;
};

const pageStyles = {
  form: css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `,
  input: css`
    padding: 0.5rem;
  `,
};

const Page: FC<Data> = ({ text }) => {
  return (
    <BaseLayout title='search'>
      <p>関連キーワードを入力してください。postsの中から検索します。</p>
      <form method='POST' class={pageStyles.form}>
        <input
          type='text'
          class={pageStyles.input}
          name='content'
          placeholder='キーワード'
        />
        <button type='submit'>検索</button>
      </form>
      <p>{text}</p>
    </BaseLayout>
  );
};

type LlamaAnswer = {
  response: string;
};

type M2mAnswer = {
  translated_text: string;
};

export const POST = createRoute(async (c) => {
  const { content } = await c.req.parseBody<{ content: string }>();
  const ai = new Ai(c.env.AI);

  // @ts-ignore
  const posts = import.meta.glob<{ frontmatter: Meta }>('./posts/*.mdx', {
    eager: true,
  });
  const contents = Object.entries(posts).map(([id, module]) => {
    // @ts-ignore
    return {
      // @ts-ignore
      title: module.frontmatter.title,
      // @ts-ignore
      description: module.frontmatter.description,
    };
  });
  const descriptions = contents
    .map((item) => `${item.title}: ${item.description}`)
    .join(', ');

  const preAnswer: LlamaAnswer = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: [
      {
        role: 'user',
        content: `\
        There are ${contents.length} arrays here. Let's play a game to guess which array has the closest contents to ${content}.\
        What is the closest content to ${content} in the ${descriptions}?\
        `,
      },
    ],
  });
  const answer: LlamaAnswer = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
    messages: [
      {
        role: 'user',
        content: `\
        There are ${contents.length} arrays here. Let's play a game to guess which array has the closest contents to ${content}.\
        What is the closest content to ${content} in the ${descriptions}?\
        `,
      },
      {
        role: 'assistant',
        content: preAnswer.response,
      },
      {
        role: 'user',
        content:
          'Output only what you think is the best answer in the original text and title.',
      },
    ],
  });

  const response: M2mAnswer = await ai.run('@cf/meta/m2m100-1.2b', {
    text: answer.response,
    source_lang: 'english',
    target_lang: 'japanese',
  });

  return c.render(<Page text={response.translated_text} />);
});

export default createRoute((c) => {
  return c.render(<Page />);
});
