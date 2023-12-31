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
}

export interface Set {
  number: Number;
  reps: Number;
  weight: Number;
}

export default function Workouts({ params }: { params: { id: string } }) {
  const user = getUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sets, setSets] = useState<Set[]>([]);

  const fetchWorkouts = async (userUid: string) => {
    try {
      const res = await getAuthenticatedUserWorkouts(userUid, params.id);
      setWorkouts(res);
    } catch (error) {
      // Handle error if necessary
      console.error('Error fetching data:', error);
    }
  };

  const fetchSets = async (userUid: string, workout: string) => {
    try {
      const res = await getAuthenticatedUserSets(userUid, params.id, workout);
      setSets(res);
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

  // useEffect(() => {
  //   if (user) {
  //     fetchSets(user.uid, workouts);
  //   }
  // }, [user, workouts]);

  return (
    <>
      {params.id}
      <ul>
        {workouts.map((workout) => {
          const epochMilliseconds = parseInt(workout.date, 10);
          return (
            <li>
              {new Date(epochMilliseconds * 1000).toLocaleDateString()}{' '}
              {new Date(epochMilliseconds * 1000).toLocaleTimeString()}
            </li>
          );
        })}
      </ul>
    </>
  );
}
