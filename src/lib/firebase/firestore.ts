import { collection, query, getDocs } from 'firebase/firestore';

import { db } from './firebase';

export async function getExercise() {
  let q = query(collection(db, 'exercise'));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}
