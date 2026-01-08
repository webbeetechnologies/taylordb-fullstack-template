/**
 * Copyright (c) 2025 TaylorDB
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface FileInformation {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
  format: string;
  width: number;
  height: number;
}

interface UploadResponse {
  collectionName: string;
  fileInformation: FileInformation;
  metadata: {
    thumbnails: any[];
    clips: any[];
  };
  baseId: string;
  storageAdaptor: string;
  _id: string;
  __v: number;
}

export interface AttachmentColumnValue {
  url: string;
  fileType: string;
  size: number;
}

export class Attachment {
  public readonly collectionName: string;
  public readonly fileInformation: FileInformation;
  public readonly metadata: { thumbnails: any[]; clips: any[] };
  public readonly baseId: string;
  public readonly storageAdaptor: string;
  public readonly _id: string;

  constructor(data: UploadResponse) {
    this.collectionName = data.collectionName;
    this.fileInformation = data.fileInformation;
    this.metadata = data.metadata;
    this.baseId = data.baseId;
    this.storageAdaptor = data.storageAdaptor;
    this._id = data._id;
  }

  toColumnValue(): AttachmentColumnValue {
    return {
      url: this.fileInformation.path,
      fileType: this.fileInformation.mimetype,
      size: this.fileInformation.size,
    };
  }
}

type IsWithinOperatorValue =
  | 'pastWeek'
  | 'pastMonth'
  | 'pastYear'
  | 'nextWeek'
  | 'nextMonth'
  | 'nextYear'
  | 'daysFromNow'
  | 'daysAgo'
  | 'currentWeek'
  | 'currentMonth'
  | 'currentYear';

type DefaultDateFilterValue =
  | (
      | 'today'
      | 'tomorrow'
      | 'yesterday'
      | 'oneWeekAgo'
      | 'oneWeekFromNow'
      | 'oneMonthAgo'
      | 'oneMonthFromNow'
    )
  | ['exactDay' | 'exactTimestamp', string]
  | ['daysAgo' | 'daysFromNow', number];

type DateFilters = {
  '=': DefaultDateFilterValue;
  '!=': DefaultDateFilterValue;
  '<': DefaultDateFilterValue;
  '>': DefaultDateFilterValue;
  '<=': DefaultDateFilterValue;
  '>=': DefaultDateFilterValue;
  isWithIn:
    | IsWithinOperatorValue
    | { value: 'daysAgo' | 'daysFromNow'; date: number };
  isEmpty: boolean;
  isNotEmpty: boolean;
};

type DateAggregations = {
  empty: number;
  filled: number;
  unique: number;
  percentEmpty: number;
  percentFilled: number;
  percentUnique: number;
  min: number | null;
  max: number | null;
  daysRange: number | null;
  monthRange: number | null;
};

type TextFilters = {
  '=': string;
  '!=': string;
  caseEqual: string;
  hasAnyOf: string[];
  contains: string;
  startsWith: string;
  endsWith: string;
  doesNotContain: string;
  isEmpty: never;
  isNotEmpty: never;
};

type LinkFilters = {
  hasAnyOf: number[];
  hasAllOf: number[];
  isExactly: number[];
  '=': number;
  hasNoneOf: number[];
  contains: string;
  doesNotContain: string;
  isEmpty: never;
  isNotEmpty: never;
};

type SelectFilters<O extends readonly string[]> = {
  hasAnyOf: O[number][];
  hasAllOf: O[number][];
  isExactly: O[number][];
  '=': O[number];
  hasNoneOf: O[number][];
  contains: string;
  doesNotContain: string;
  isEmpty: never;
  isNotEmpty: never;
};

type LinkAggregations = {
  empty: number;
  filled: number;
  percentEmpty: number;
  percentFilled: number;
};

type NumberFilters = {
  '=': number;
  '!=': number;
  '>': number;
  '>=': number;
  '<': number;
  '<=': number;
  hasAnyOf: number[];
  hasNoneOf: number[];
  isEmpty: never;
  isNotEmpty: never;
};

type NumberAggregations = {
  sum: number;
  average: number;
  median: number;
  min: number | null;
  max: number | null;
  range: number;
  standardDeviation: number;
  histogram: Record<string, number>;
  empty: number;
  filled: number;
  unique: number;
  percentEmpty: number;
  percentFilled: number;
  percentUnique: number;
};

type CheckboxFilters = {
  '=': number;
};

/**
 *
 * Column types
 *
 */
export type ColumnType<
  S,
  U,
  I,
  R extends boolean,
  F extends { [key: string]: any } = object,
  A extends { [key: string]: any } = object,
> = {
  raw: S;
  insert: I;
  update: U;
  filters: F;
  aggregations: A;
  isRequired: R;
};

export type DateColumnType<R extends boolean> = ColumnType<
  string,
  string,
  string,
  R,
  DateFilters,
  DateAggregations
>;

export type TextColumnType<R extends boolean> = ColumnType<
  string,
  string,
  string,
  R,
  TextFilters
>;

export type ALinkColumnType<
  T extends string,
  S,
  U,
  I,
  R extends boolean,
  F extends { [key: string]: any } = LinkFilters,
  A extends LinkAggregations = LinkAggregations,
> = ColumnType<S, U, I, R, F, A> & {
  linkedTo: T;
};

export type LinkColumnType<
  T extends string,
  R extends boolean,
> = ALinkColumnType<
  T,
  object,
  number[] | { newIds: number[]; deletedIds: number[] },
  number[],
  R
>;

export type AttachmentColumnType<R extends boolean> = ALinkColumnType<
  'attachmentTable',
  Attachment[],
  Attachment[] | { newIds: number[]; deletedIds: number[] } | number[],
  Attachment[] | number[],
  R
>;

export type SingleSelectColumnType<
  O extends readonly string[],
  R extends boolean,
> = ColumnType<O[number][], O[number][], O[number][], R, SelectFilters<O>>;

export type NumberColumnType<R extends boolean> = ColumnType<
  number,
  number,
  number,
  R,
  NumberFilters,
  NumberAggregations
>;

export type CheckboxColumnType<R extends boolean> = ColumnType<
  boolean,
  boolean,
  boolean,
  R,
  CheckboxFilters
>;

export type AutoGeneratedNumberColumnType = ColumnType<
  number,
  never,
  never,
  false,
  NumberFilters,
  NumberAggregations
>;

export type AutoGeneratedDateColumnType = ColumnType<
  string,
  never,
  never,
  false,
  DateFilters,
  DateAggregations
>;


export type TableRaws<T extends keyof TaylorDatabase> = {
  [K in keyof TaylorDatabase[T]]: TaylorDatabase[T][K] extends ColumnType<
    infer S,
    any,
    any,
    infer R,
    any,
    any
  >
    ? R extends true
      ? S
      : S | undefined
    : never;
};

export type TableInserts<T extends keyof TaylorDatabase> = {
  [K in keyof TaylorDatabase[T]]: TaylorDatabase[T][K] extends ColumnType<
    any,
    infer I,
    any,
    infer R,
    any,
    any
  >
    ? R extends true
      ? I
      : I | undefined
    : never;
};

export type TableUpdates<T extends keyof TaylorDatabase> = {
  [K in keyof TaylorDatabase[T]]: TaylorDatabase[T][K] extends ColumnType<
    any,
    any,
    infer U,
    any,
    any,
    any
  >
    ? U
    : never;
};

export type SelectTable = {
  id: AutoGeneratedNumberColumnType;
  name: TextColumnType<true>;
  color: TextColumnType<true>;
};

export type AttachmentTable = {
  id: AutoGeneratedNumberColumnType;
  name: TextColumnType<true>;
  metadata: TextColumnType<true>;
  size: NumberColumnType<true>;
  fileType: TextColumnType<true>;
  url: TextColumnType<true>;
};

export type CollaboratorsTable = {
  id: AutoGeneratedNumberColumnType;
  name: TextColumnType<true>;
  emailAddress: TextColumnType<true>;
  avatar: TextColumnType<true>;
};

export type TaylorDatabase = {
  /**
   *
   *
   * Internal tables, these tables can not be queried directly.
   *
   */
  selectTable: SelectTable;
  attachmentTable: AttachmentTable;
  collaboratorsTable: CollaboratorsTable;
  calories: CaloriesTable;
  strength: StrengthTable;
  cardio: CardioTable;
  weight: WeightTable;
  goals: GoalsTable;
  settings: SettingsTable;
};

export const CaloriesTimeOfDayOptions = ['Breakfast', 'Lunch', 'Dinner', 'Supper', 'Snack'] as const;
export const CaloriesUnitOptions = ['1 tsp = 5 mL ≈ 0.17 fl oz', '1 tbsp = 15 mL ≈ 0.5 fl oz', '1 cup = 240 mL = 8 fl oz', '1 fl oz ≈ 29.57 mL', '1 mL ≈ 0.034 fl oz', '1 L ≈ 33.814 fl oz', '1 g ≈ 0.035 oz', '1 oz ≈ 28.35 g', '1 kg ≈ 2.205 lb', '1 lb ≈ 453.59 g'] as const;

type CaloriesTable = {
  id: NumberColumnType<false>;
  createdAt: AutoGeneratedDateColumnType;
  updatedAt: AutoGeneratedDateColumnType;
  date: DateColumnType<false>;
  timeOfDay: SingleSelectColumnType<typeof CaloriesTimeOfDayOptions, false>;
  proteinPer100G: NumberColumnType<false>;
  carbsPer100G: NumberColumnType<false>;
  fatsPer100G: NumberColumnType<false>;
  totalCalories: NumberColumnType<false>;
  totalCarbs: NumberColumnType<false>;
  totalFats: NumberColumnType<false>;
  totalProtein: NumberColumnType<false>;
  mealName: TextColumnType<false>;
  name: TextColumnType<false>;
  mealIngredient: TextColumnType<false>;
  quantity: NumberColumnType<false>;
  unit: SingleSelectColumnType<typeof CaloriesUnitOptions, false>;
  quantityInGramsmL: NumberColumnType<false>;
  quantityInFlOzozlb: NumberColumnType<false>;
  };

export const StrengthExerciseOptions = ['Push-ups', 'Pull-ups', 'Pistol Squat', 'Deadlifts', 'Bench Press', 'Sit-ups', 'Lunges', 'Squats', 'Cable Pull-downs', 'Diamond Push-ups', 'Biceps Curls'] as const;

type StrengthTable = {
  id: NumberColumnType<false>;
  createdAt: AutoGeneratedDateColumnType;
  updatedAt: AutoGeneratedDateColumnType;
  reps: NumberColumnType<false>;
  weight: NumberColumnType<false>;
  date: DateColumnType<false>;
  name: TextColumnType<false>;
  exercise: SingleSelectColumnType<typeof StrengthExerciseOptions, false>;
  };

export const CardioExerciseOptions = ['Running', 'Cycling', 'Swimming'] as const;

type CardioTable = {
  id: NumberColumnType<false>;
  createdAt: AutoGeneratedDateColumnType;
  updatedAt: AutoGeneratedDateColumnType;
  date: DateColumnType<false>;
  duration: NumberColumnType<false>;
  distance: NumberColumnType<false>;
  exercise: SingleSelectColumnType<typeof CardioExerciseOptions, false>;
  name: TextColumnType<false>;
  speed: NumberColumnType<false>;
  };
type WeightTable = {
  id: NumberColumnType<false>;
  createdAt: AutoGeneratedDateColumnType;
  updatedAt: AutoGeneratedDateColumnType;
  date: DateColumnType<false>;
  weight: NumberColumnType<false>;
  name: TextColumnType<false>;
  };
type GoalsTable = {
  id: NumberColumnType<false>;
  createdAt: AutoGeneratedDateColumnType;
  updatedAt: AutoGeneratedDateColumnType;
  name: TextColumnType<false>;
  value: TextColumnType<false>;
  description: TextColumnType<false>;
  };
type SettingsTable = {
  id: NumberColumnType<false>;
  createdAt: AutoGeneratedDateColumnType;
  updatedAt: AutoGeneratedDateColumnType;
  name: TextColumnType<false>;
  value: TextColumnType<false>;
  description: TextColumnType<false>;
  };
