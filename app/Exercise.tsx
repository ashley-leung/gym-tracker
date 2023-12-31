'use client';

import { getAuthenticatedUserExercise } from '../lib/firebase/firestore';
import { getUser } from '../lib/firebase/getUser';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface Exercise {
  id: string;
  name: string;
}

export default function Exercise() {
  const user = getUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchData = async (userUid: string) => {
    try {
      const res = await getAuthenticatedUserExercise(userUid);
      setExercises(res);
    } catch (error) {
      // Handle error if necessary
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData(user.uid);
    }
  }, [user]);

  return (
    <>
      <ul>
        {exercises.map((exercise) => (
          <>
            <Link key={exercise.id} href={`/workouts/${exercise.id}`}>
              {exercise.id}
              <>, </>
              {exercise.name}
            </Link>
            <br />
          </>
        ))}
      </ul>
    </>
  );
}
