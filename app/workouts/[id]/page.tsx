'use client';

import { useState, useEffect } from 'react';
import {
  addAuthenticatedUserWorkouts,
  getAuthenticatedUserSets,
  getAuthenticatedUserWorkouts,
} from '../../../lib/firebase/firestore';
import { getUser } from '../../../lib/firebase/getUser';
import moment from 'moment';

export interface Workout {
  id: string;
  addedTimestamp: string;
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
      res.sort(
        (a, b) =>
          parseInt(b.addedTimestamp, 10) - parseInt(a.addedTimestamp, 10)
      );

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

  const handleAddWorkout = async () => {
    if (user) {
      await addAuthenticatedUserWorkouts(user.uid, params.id);
      fetchWorkouts(user.uid);
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
          const addedTimestamp = parseInt(workout.addedTimestamp, 10);
          return (
            <li key={workout.id}>
              {moment(addedTimestamp).format('Do MMM, YYYY HH:mm:ss')}{' '}
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
      <button onClick={handleAddWorkout}>Add workout</button>
    </>
  );
}
