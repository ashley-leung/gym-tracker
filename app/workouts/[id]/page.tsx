'use client';

import { useState, useEffect } from 'react';
import {
  getAuthenticatedUserSets,
  getAuthenticatedUserWorkouts,
} from '../../../lib/firebase/firestore';
import { getUser } from '../../../lib/firebase/getUser';

export interface Workout {
  id: string;
  date: string;
  sets: Set[];
}

export interface Set {
  id: string;
  number: Number;
  reps: Number;
  weight: Number;
}

export default function Workouts({ params }: { params: { id: string } }) {
  const user = getUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const fetchWorkouts = async (userUid: string) => {
    try {
      const res = await getAuthenticatedUserWorkouts(userUid, params.id);

      // Fetch sets for each workout
      const workoutsWithSets = await Promise.all(
        res.map(async (workout) => {
          const sets = await getAuthenticatedUserSets(
            userUid,
            params.id,
            workout.id
          );
          return { ...workout, sets };
        })
      );

      setWorkouts(workoutsWithSets);
    } catch (error) {
      // Handle error if necessary
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkouts(user.uid);
    }
  }, [user]);

  return (
    <>
      {params.id}
      <ul>
        {workouts.map((workout) => {
          const epochMilliseconds = parseInt(workout.date, 10);
          return (
            <li key={workout.id}>
              {new Date(epochMilliseconds * 1000).toLocaleDateString()}{' '}
              {new Date(epochMilliseconds * 1000).toLocaleTimeString()}{' '}
              {workout.sets.map((set) => (
                <>
                  <p key={set.id}>
                    Set {set.number.toString()}: {set.weight.toString()}kg for{' '}
                    {set.reps.toString()} reps
                  </p>
                </>
              ))}
            </li>
          );
        })}
      </ul>
    </>
  );
}
