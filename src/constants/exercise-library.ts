import { EquipmentType, MuscleGroup } from 'src/objects/exercise.object';

export type ExerciseSeed = {
  name: string;
  muscleGroups: MuscleGroup[];
  equipmentType: EquipmentType;
};

export const EXERCISE_LIBRARY: ExerciseSeed[] = [
  // Quads
  {
    name: 'Back Squat',
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.CORE],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Front Squat',
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.CORE],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Leg Press',
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Bulgarian Split Squat',
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Walking Lunge',
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Leg Extension',
    muscleGroups: [MuscleGroup.QUADS],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Goblet Squat',
    muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES],
    equipmentType: EquipmentType.KETTLEBELL,
  },
  // Hamstrings & glutes
  {
    name: 'Deadlift',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Romanian Deadlift',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Lying Leg Curl',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Seated Leg Curl',
    muscleGroups: [MuscleGroup.HAMSTRINGS],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Hip Thrust',
    muscleGroups: [MuscleGroup.GLUTES],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Glute Ham Raise',
    muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  {
    name: 'Kettlebell Swing',
    muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
    equipmentType: EquipmentType.KETTLEBELL,
  },
  // Calves
  {
    name: 'Standing Calf Raise',
    muscleGroups: [MuscleGroup.CALVES],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Seated Calf Raise',
    muscleGroups: [MuscleGroup.CALVES],
    equipmentType: EquipmentType.MACHINE,
  },
  // Chest
  {
    name: 'Bench Press',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Incline Bench Press',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Dumbbell Bench Press',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Incline Dumbbell Press',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Dumbbell Fly',
    muscleGroups: [MuscleGroup.CHEST],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Cable Fly',
    muscleGroups: [MuscleGroup.CHEST],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'Pec Deck',
    muscleGroups: [MuscleGroup.CHEST],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Dip',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  {
    name: 'Push-Up',
    muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.CORE],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  // Shoulders
  {
    name: 'Overhead Press',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Lateral Raise',
    muscleGroups: [MuscleGroup.SHOULDERS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Cable Lateral Raise',
    muscleGroups: [MuscleGroup.SHOULDERS],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'Rear Delt Fly',
    muscleGroups: [MuscleGroup.SHOULDERS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Face Pull',
    muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'Upright Row',
    muscleGroups: [MuscleGroup.SHOULDERS],
    equipmentType: EquipmentType.BARBELL,
  },
  // Back
  {
    name: 'Pull-Up',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  {
    name: 'Chin-Up',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  {
    name: 'Lat Pulldown',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'Barbell Row',
    muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Dumbbell Row',
    muscleGroups: [MuscleGroup.BACK],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Seated Cable Row',
    muscleGroups: [MuscleGroup.BACK],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'T-Bar Row',
    muscleGroups: [MuscleGroup.BACK],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Straight-Arm Pulldown',
    muscleGroups: [MuscleGroup.BACK],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'Barbell Shrug',
    muscleGroups: [MuscleGroup.BACK],
    equipmentType: EquipmentType.BARBELL,
  },
  // Biceps
  {
    name: 'Barbell Curl',
    muscleGroups: [MuscleGroup.BICEPS],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Dumbbell Curl',
    muscleGroups: [MuscleGroup.BICEPS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Hammer Curl',
    muscleGroups: [MuscleGroup.BICEPS, MuscleGroup.FOREARMS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Preacher Curl',
    muscleGroups: [MuscleGroup.BICEPS],
    equipmentType: EquipmentType.MACHINE,
  },
  {
    name: 'Incline Dumbbell Curl',
    muscleGroups: [MuscleGroup.BICEPS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Cable Curl',
    muscleGroups: [MuscleGroup.BICEPS],
    equipmentType: EquipmentType.CABLE,
  },
  // Triceps
  {
    name: 'Close-Grip Bench Press',
    muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    equipmentType: EquipmentType.BARBELL,
  },
  {
    name: 'Triceps Pushdown',
    muscleGroups: [MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'Overhead Triceps Extension',
    muscleGroups: [MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: 'Skull Crusher',
    muscleGroups: [MuscleGroup.TRICEPS],
    equipmentType: EquipmentType.BARBELL,
  },
  // Core
  {
    name: 'Plank',
    muscleGroups: [MuscleGroup.CORE],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  {
    name: 'Hanging Leg Raise',
    muscleGroups: [MuscleGroup.CORE],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  {
    name: 'Cable Crunch',
    muscleGroups: [MuscleGroup.CORE],
    equipmentType: EquipmentType.CABLE,
  },
  {
    name: 'Ab Wheel Rollout',
    muscleGroups: [MuscleGroup.CORE],
    equipmentType: EquipmentType.BODYWEIGHT,
  },
  // Forearms
  {
    name: 'Wrist Curl',
    muscleGroups: [MuscleGroup.FOREARMS],
    equipmentType: EquipmentType.DUMBBELL,
  },
  {
    name: "Farmer's Carry",
    muscleGroups: [MuscleGroup.FOREARMS, MuscleGroup.CORE],
    equipmentType: EquipmentType.DUMBBELL,
  },
];
