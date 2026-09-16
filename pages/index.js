export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: '' }} />
  );
}
// Redirect to static HTML served from public/
export async function getServerSideProps({ res }) {
  res.writeHead(302, { Location: '/app.html' });
  res.end();
  return { props: {} };
}
