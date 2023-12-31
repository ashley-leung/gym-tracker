'use client';

import {
  addAuthenticatedUserExercise,
  getAuthenticatedUserExercise,
} from '../lib/firebase/firestore';
import { getUser } from '../lib/firebase/getUser';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface Exercise {
  id: string;
  name: string;
  addedTimestamp: string;
}

export default function Exercise() {
  const user = getUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchData = async (userUid: string) => {
    try {
      const res = await getAuthenticatedUserExercise(userUid);
      res.sort(
        (a, b) =>
          parseInt(b.addedTimestamp, 10) - parseInt(a.addedTimestamp, 10)
      );
      setExercises(res);
    } catch (error) {
      // Handle error if necessary
      console.error('Error fetching data:', error);
    }
  };

  const handleAddExercise = async () => {
    if (user) {
      const exerciseId = await addAuthenticatedUserExercise(user.uid);
      fetchData(user.uid);
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
              <>, </>
              {exercise.addedTimestamp}
            </Link>
            <br />
          </>
        ))}
      </ul>
      <button onClick={handleAddExercise}>Add exercise</button>
    </>
  );
}
