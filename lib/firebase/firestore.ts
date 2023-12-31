import { collection, query, getDocs, where } from 'firebase/firestore';

import { db } from './firebase';
import { Exercise } from '../../app/Exercise';
import { Set, Workout } from '../../app/workouts/[id]/page';
import firestore, { Timestamp } from '@google-cloud/firestore';

export const getAuthenticatedUserExercise = async (
  uid: string
): Promise<Exercise[]> => {
  const exercisesCollectionRef = collection(db, 'users', uid, 'exercises');

  const q = query(exercisesCollectionRef);

  const querySnapshot = await getDocs(q);

  const exercises = querySnapshot.docs.map((doc) => {
    const res: Exercise = {
      ...(doc.data() as Exercise),
      id: doc.id,
    };
    return res;
  });

  return exercises;
};

export const getAuthenticatedUserWorkouts = async (
  uid: string,
  exerciseId: string
): Promise<Workout[]> => {
  const workoutCollectionRef = collection(
    db,
    'users',
    uid,
    'exercises',
    exerciseId,
    'workout'
  );

  const q = query(workoutCollectionRef);

  const querySnapshot = await getDocs(q);

  const workouts = querySnapshot.docs.map((doc) => {
    const res: Workout = {
      ...(doc.data() as Workout),
      id: doc.id,
    };
    return res;
  });

  return workouts;
};

export const getAuthenticatedUserSets = async (
  uid: string,
  exerciseId: string,
  setId: string
): Promise<Set[]> => {
  const workoutCollectionRef = collection(
    db,
    'users',
    uid,
    'exercises',
    exerciseId,
    'workout',
    'sets',
    setId
  );

  const q = query(workoutCollectionRef);

  const querySnapshot = await getDocs(q);

  const sets = querySnapshot.docs.map((doc) => doc.data() as Set);

  return sets;
};
