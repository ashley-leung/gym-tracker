import { collection, query, getDocs, addDoc } from 'firebase/firestore';

import { db } from './firebase';
import moment from 'moment';

interface ExerciseDto {
  id: string;
  name: string;
  addedTimestamp: string;
}

export const addAuthenticatedUserExercise = async (uid: string) => {
  const exercisesCollectionRef = collection(db, 'users', uid, 'exercises');
  const baseExerciseName = 'New exercise';

  // Get existing exercise names
  const existingExercises = await getDocs(exercisesCollectionRef);
  const existingNames = existingExercises.docs.map(
    (doc) => (doc.data() as { name: string }).name
  );

  let newExerciseName = baseExerciseName;
  let counter = 1;

  // Check for duplicates and increment counter
  while (existingNames.includes(newExerciseName)) {
    counter++;
    newExerciseName = `${baseExerciseName} ${counter}`;
  }

  const exerciseRef = await addDoc(exercisesCollectionRef, {
    name: newExerciseName,
    addedTimestamp: moment().valueOf(),
  });

  return exerciseRef.id;
};

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
  addedTimestamp: string;
}

export const addAuthenticatedUserWorkouts = async (
  uid: string,
  exerciseId: string
) => {
  const workoutCollectionRef = collection(
    db,
    'users',
    uid,
    'exercises',
    exerciseId,
    'workout'
  );

  await addDoc(workoutCollectionRef, {
    addedTimestamp: moment().valueOf(),
  });
};

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
