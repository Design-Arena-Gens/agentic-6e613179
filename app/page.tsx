import { UploadForm } from '@/components/UploadForm';

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '64px 24px 120px'
      }}
    >
      <UploadForm />
    </main>
  );
}
