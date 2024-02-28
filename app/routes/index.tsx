import BaseLayout from '../components/layout';
import type { Meta } from '../types';

export default function Top() {
  // @ts-ignore
  const posts = import.meta.glob<{ frontmatter: Meta }>('./posts/*.mdx', {
    eager: true,
  });
  return (
    <BaseLayout title='posts'>
      <ul>
        {Object.entries(posts).map(([id, module]) => {
          // @ts-ignore
          if (module.frontmatter) {
            return (
              <li>
                <a href={`${id.replace(/\.mdx$/, '')}`}>
                  {/* @ts-ignore */}
                  {module.frontmatter.title}
                </a>
              </li>
            );
          }
        })}
      </ul>
    </BaseLayout>
  );
}
