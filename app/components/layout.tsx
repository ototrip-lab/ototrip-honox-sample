import { css } from 'hono/css';

const styles = {
  main: css`
    display: grid;
    grid-template-columns: auto 980px auto;
    grid-template-rows: 90px 1fr 90px;
  `,
  header: css`
    margin-left: 12px;
    margin-right: 12px;
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  headerBorder: css`
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 1;
    border-bottom: 1px solid #000;
  `,
  headerLink: css`
    cursor: pointer;
    margin-left: 12px;
  `,
  section: css`
    margin-left: 12px;
    margin-right: 12px;
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
  `,
};

export default function Layout({
  children,
  title = 'My App',
}: {
  children: any;
  title?: string;
}) {
  return (
    <main class={styles.main}>
      <div class={styles.headerBorder}></div>
      <header class={styles.header}>
        <h1>{title}</h1>
        <div>
          <a href='/' class={styles.headerLink}>
            Home
          </a>
        </div>
      </header>
      <section class={styles.section}>{children}</section>
    </main>
  );
}
