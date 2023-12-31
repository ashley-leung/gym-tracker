import Header from '@/components/Header';
import { getAuthenticatedAppForUser } from '@/lib/firebase/auth';

export default async function Home() {
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <main>
      <Header initialUser={currentUser} />
    </main>
  );
}
