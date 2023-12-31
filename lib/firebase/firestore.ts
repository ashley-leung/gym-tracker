import { collection, query, getDocs, where } from 'firebase/firestore';

import { db } from './firebase';

interface ExerciseDto {
  id: string;
  name: string;
}

export const getAuthenticatedUserExercise = async (
  uid: string
): Promise<ExerciseDto[]> => {
  const exercisesCollectionRef = collection(db, 'users', uid, 'exercises');

  const q = query(exercisesCollectionRef);

  const querySnapshot = await getDocs(q);

  const exercises = querySnapshot.docs.map((doc) => {
    const res: ExerciseDto = {
      ...(doc.data() as ExerciseDto),
      id: doc.id,
    };
    return res;
  });

  return exercises;
};
interface WorkoutDto {
  id: string;
  date: string;
}

export const getAuthenticatedUserWorkouts = async (
  uid: string,
  exerciseId: string
): Promise<WorkoutDto[]> => {
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
    const res: WorkoutDto = {
      ...(doc.data() as WorkoutDto),
      id: doc.id,
    };
    return res;
  });

  return workouts;
};

interface SetDto {
  id: string;
  number: Number;
  reps: Number;
  weight: Number;
}

export const getAuthenticatedUserSets = async (
  uid: string,
  exerciseId: string,
  workoutId: string
): Promise<SetDto[]> => {
  const workoutCollectionRef = collection(
    db,
    'users',
    uid,
    'exercises',
    exerciseId,
    'workout',
    workoutId,
    'sets'
  );

  const q = query(workoutCollectionRef);

  const querySnapshot = await getDocs(q);

  const sets = querySnapshot.docs.map((doc) => {
    const res: SetDto = {
      ...(doc.data() as SetDto),
      id: doc.id,
    };
    return res;
  });

  return sets;
};
