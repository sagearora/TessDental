import { gql } from '@apollo/client';
import type * as ApolloReactCommon from '@apollo/client/react';
import * as ApolloReactHooks from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  bigint: { input: number; output: number; }
  date: { input: any; output: any; }
  override_effect: { input: any; output: any; }
  smallint: { input: any; output: any; }
  time: { input: any; output: any; }
  timestamptz: { input: string; output: string; }
  uuid: { input: string; output: string; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "app_user" */
export type App_User = {
  __typename?: 'app_user';
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  is_active: Scalars['Boolean']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  password_hash: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "app_user" */
export type App_User_Aggregate = {
  __typename?: 'app_user_aggregate';
  aggregate?: Maybe<App_User_Aggregate_Fields>;
  nodes: Array<App_User>;
};

/** aggregate fields of "app_user" */
export type App_User_Aggregate_Fields = {
  __typename?: 'app_user_aggregate_fields';
  avg?: Maybe<App_User_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<App_User_Max_Fields>;
  min?: Maybe<App_User_Min_Fields>;
  stddev?: Maybe<App_User_Stddev_Fields>;
  stddev_pop?: Maybe<App_User_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<App_User_Stddev_Samp_Fields>;
  sum?: Maybe<App_User_Sum_Fields>;
  var_pop?: Maybe<App_User_Var_Pop_Fields>;
  var_samp?: Maybe<App_User_Var_Samp_Fields>;
  variance?: Maybe<App_User_Variance_Fields>;
};


/** aggregate fields of "app_user" */
export type App_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type App_User_Avg_Fields = {
  __typename?: 'app_user_avg_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "app_user". All fields are combined with a logical 'AND'. */
export type App_User_Bool_Exp = {
  _and?: InputMaybe<Array<App_User_Bool_Exp>>;
  _not?: InputMaybe<App_User_Bool_Exp>;
  _or?: InputMaybe<Array<App_User_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  current_clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  password_hash?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "app_user" */
export type App_User_Constraint =
  /** unique or primary key constraint on columns "email" */
  | 'app_user_email_key'
  /** unique or primary key constraint on columns "id" */
  | 'app_user_pkey';

/** input type for incrementing numeric columns in table "app_user" */
export type App_User_Inc_Input = {
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "app_user" */
export type App_User_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type App_User_Max_Fields = {
  __typename?: 'app_user_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  password_hash?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type App_User_Min_Fields = {
  __typename?: 'app_user_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  password_hash?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "app_user" */
export type App_User_Mutation_Response = {
  __typename?: 'app_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<App_User>;
};

/** on_conflict condition type for table "app_user" */
export type App_User_On_Conflict = {
  constraint: App_User_Constraint;
  update_columns?: Array<App_User_Update_Column>;
  where?: InputMaybe<App_User_Bool_Exp>;
};

/** Ordering options when selecting data from "app_user". */
export type App_User_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  current_clinic_id?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  password_hash?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_user */
export type App_User_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "app_user" */
export type App_User_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'current_clinic_id'
  /** column name */
  | 'email'
  /** column name */
  | 'first_name'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'last_name'
  /** column name */
  | 'password_hash'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "app_user" */
export type App_User_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type App_User_Stddev_Fields = {
  __typename?: 'app_user_stddev_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type App_User_Stddev_Pop_Fields = {
  __typename?: 'app_user_stddev_pop_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type App_User_Stddev_Samp_Fields = {
  __typename?: 'app_user_stddev_samp_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "app_user" */
export type App_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: App_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type App_User_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type App_User_Sum_Fields = {
  __typename?: 'app_user_sum_fields';
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "app_user" */
export type App_User_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'current_clinic_id'
  /** column name */
  | 'email'
  /** column name */
  | 'first_name'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'last_name'
  /** column name */
  | 'password_hash'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type App_User_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<App_User_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<App_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: App_User_Bool_Exp;
};

/** columns and relationships of "app_user_v" */
export type App_User_V = {
  __typename?: 'app_user_v';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "app_user_v" */
export type App_User_V_Aggregate = {
  __typename?: 'app_user_v_aggregate';
  aggregate?: Maybe<App_User_V_Aggregate_Fields>;
  nodes: Array<App_User_V>;
};

/** aggregate fields of "app_user_v" */
export type App_User_V_Aggregate_Fields = {
  __typename?: 'app_user_v_aggregate_fields';
  avg?: Maybe<App_User_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<App_User_V_Max_Fields>;
  min?: Maybe<App_User_V_Min_Fields>;
  stddev?: Maybe<App_User_V_Stddev_Fields>;
  stddev_pop?: Maybe<App_User_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<App_User_V_Stddev_Samp_Fields>;
  sum?: Maybe<App_User_V_Sum_Fields>;
  var_pop?: Maybe<App_User_V_Var_Pop_Fields>;
  var_samp?: Maybe<App_User_V_Var_Samp_Fields>;
  variance?: Maybe<App_User_V_Variance_Fields>;
};


/** aggregate fields of "app_user_v" */
export type App_User_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_User_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type App_User_V_Avg_Fields = {
  __typename?: 'app_user_v_avg_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "app_user_v". All fields are combined with a logical 'AND'. */
export type App_User_V_Bool_Exp = {
  _and?: InputMaybe<Array<App_User_V_Bool_Exp>>;
  _not?: InputMaybe<App_User_V_Bool_Exp>;
  _or?: InputMaybe<Array<App_User_V_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  current_clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "app_user_v" */
export type App_User_V_Inc_Input = {
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "app_user_v" */
export type App_User_V_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type App_User_V_Max_Fields = {
  __typename?: 'app_user_v_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type App_User_V_Min_Fields = {
  __typename?: 'app_user_v_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "app_user_v" */
export type App_User_V_Mutation_Response = {
  __typename?: 'app_user_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<App_User_V>;
};

/** Ordering options when selecting data from "app_user_v". */
export type App_User_V_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  current_clinic_id?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** select columns of table "app_user_v" */
export type App_User_V_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'current_clinic_id'
  /** column name */
  | 'email'
  /** column name */
  | 'first_name'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'last_name'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "app_user_v" */
export type App_User_V_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type App_User_V_Stddev_Fields = {
  __typename?: 'app_user_v_stddev_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type App_User_V_Stddev_Pop_Fields = {
  __typename?: 'app_user_v_stddev_pop_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type App_User_V_Stddev_Samp_Fields = {
  __typename?: 'app_user_v_stddev_samp_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "app_user_v" */
export type App_User_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: App_User_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type App_User_V_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  current_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type App_User_V_Sum_Fields = {
  __typename?: 'app_user_v_sum_fields';
  current_clinic_id?: Maybe<Scalars['bigint']['output']>;
};

export type App_User_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<App_User_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<App_User_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: App_User_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type App_User_V_Var_Pop_Fields = {
  __typename?: 'app_user_v_var_pop_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type App_User_V_Var_Samp_Fields = {
  __typename?: 'app_user_v_var_samp_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type App_User_V_Variance_Fields = {
  __typename?: 'app_user_v_variance_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_pop on columns */
export type App_User_Var_Pop_Fields = {
  __typename?: 'app_user_var_pop_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type App_User_Var_Samp_Fields = {
  __typename?: 'app_user_var_samp_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type App_User_Variance_Fields = {
  __typename?: 'app_user_variance_fields';
  current_clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** columns and relationships of "bootstrap_event" */
export type Bootstrap_Event = {
  __typename?: 'bootstrap_event';
  admin_user_id: Scalars['uuid']['output'];
  clinic_id: Scalars['bigint']['output'];
  clinic_user_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  id: Scalars['bigint']['output'];
  role_id: Scalars['bigint']['output'];
  success: Scalars['Boolean']['output'];
};

/** aggregated selection of "bootstrap_event" */
export type Bootstrap_Event_Aggregate = {
  __typename?: 'bootstrap_event_aggregate';
  aggregate?: Maybe<Bootstrap_Event_Aggregate_Fields>;
  nodes: Array<Bootstrap_Event>;
};

/** aggregate fields of "bootstrap_event" */
export type Bootstrap_Event_Aggregate_Fields = {
  __typename?: 'bootstrap_event_aggregate_fields';
  avg?: Maybe<Bootstrap_Event_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Bootstrap_Event_Max_Fields>;
  min?: Maybe<Bootstrap_Event_Min_Fields>;
  stddev?: Maybe<Bootstrap_Event_Stddev_Fields>;
  stddev_pop?: Maybe<Bootstrap_Event_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Bootstrap_Event_Stddev_Samp_Fields>;
  sum?: Maybe<Bootstrap_Event_Sum_Fields>;
  var_pop?: Maybe<Bootstrap_Event_Var_Pop_Fields>;
  var_samp?: Maybe<Bootstrap_Event_Var_Samp_Fields>;
  variance?: Maybe<Bootstrap_Event_Variance_Fields>;
};


/** aggregate fields of "bootstrap_event" */
export type Bootstrap_Event_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Bootstrap_Event_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Bootstrap_Event_Avg_Fields = {
  __typename?: 'bootstrap_event_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "bootstrap_event". All fields are combined with a logical 'AND'. */
export type Bootstrap_Event_Bool_Exp = {
  _and?: InputMaybe<Array<Bootstrap_Event_Bool_Exp>>;
  _not?: InputMaybe<Bootstrap_Event_Bool_Exp>;
  _or?: InputMaybe<Array<Bootstrap_Event_Bool_Exp>>;
  admin_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  clinic_user_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  role_id?: InputMaybe<Bigint_Comparison_Exp>;
  success?: InputMaybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "bootstrap_event" */
export type Bootstrap_Event_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'bootstrap_event_pkey'
  /** unique or primary key constraint on columns  */
  | 'bootstrap_event_singleton';

/** input type for incrementing numeric columns in table "bootstrap_event" */
export type Bootstrap_Event_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "bootstrap_event" */
export type Bootstrap_Event_Insert_Input = {
  admin_user_id?: InputMaybe<Scalars['uuid']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate max on columns */
export type Bootstrap_Event_Max_Fields = {
  __typename?: 'bootstrap_event_max_fields';
  admin_user_id?: Maybe<Scalars['uuid']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Bootstrap_Event_Min_Fields = {
  __typename?: 'bootstrap_event_min_fields';
  admin_user_id?: Maybe<Scalars['uuid']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** response of any mutation on the table "bootstrap_event" */
export type Bootstrap_Event_Mutation_Response = {
  __typename?: 'bootstrap_event_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Bootstrap_Event>;
};

/** on_conflict condition type for table "bootstrap_event" */
export type Bootstrap_Event_On_Conflict = {
  constraint: Bootstrap_Event_Constraint;
  update_columns?: Array<Bootstrap_Event_Update_Column>;
  where?: InputMaybe<Bootstrap_Event_Bool_Exp>;
};

/** Ordering options when selecting data from "bootstrap_event". */
export type Bootstrap_Event_Order_By = {
  admin_user_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  clinic_user_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  success?: InputMaybe<Order_By>;
};

/** primary key columns input for table: bootstrap_event */
export type Bootstrap_Event_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "bootstrap_event" */
export type Bootstrap_Event_Select_Column =
  /** column name */
  | 'admin_user_id'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'role_id'
  /** column name */
  | 'success';

/** input type for updating data in table "bootstrap_event" */
export type Bootstrap_Event_Set_Input = {
  admin_user_id?: InputMaybe<Scalars['uuid']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate stddev on columns */
export type Bootstrap_Event_Stddev_Fields = {
  __typename?: 'bootstrap_event_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Bootstrap_Event_Stddev_Pop_Fields = {
  __typename?: 'bootstrap_event_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Bootstrap_Event_Stddev_Samp_Fields = {
  __typename?: 'bootstrap_event_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "bootstrap_event" */
export type Bootstrap_Event_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Bootstrap_Event_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Bootstrap_Event_Stream_Cursor_Value_Input = {
  admin_user_id?: InputMaybe<Scalars['uuid']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate sum on columns */
export type Bootstrap_Event_Sum_Fields = {
  __typename?: 'bootstrap_event_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "bootstrap_event" */
export type Bootstrap_Event_Update_Column =
  /** column name */
  | 'admin_user_id'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'role_id'
  /** column name */
  | 'success';

export type Bootstrap_Event_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Bootstrap_Event_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Bootstrap_Event_Set_Input>;
  /** filter the rows which have to be updated */
  where: Bootstrap_Event_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Bootstrap_Event_Var_Pop_Fields = {
  __typename?: 'bootstrap_event_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Bootstrap_Event_Var_Samp_Fields = {
  __typename?: 'bootstrap_event_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Bootstrap_Event_Variance_Fields = {
  __typename?: 'bootstrap_event_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "capability" */
export type Capability = {
  __typename?: 'capability';
  created_at: Scalars['timestamptz']['output'];
  description: Scalars['String']['output'];
  is_deprecated: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  module: Scalars['String']['output'];
};

/** aggregated selection of "capability" */
export type Capability_Aggregate = {
  __typename?: 'capability_aggregate';
  aggregate?: Maybe<Capability_Aggregate_Fields>;
  nodes: Array<Capability>;
};

/** aggregate fields of "capability" */
export type Capability_Aggregate_Fields = {
  __typename?: 'capability_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Capability_Max_Fields>;
  min?: Maybe<Capability_Min_Fields>;
};


/** aggregate fields of "capability" */
export type Capability_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Capability_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "capability". All fields are combined with a logical 'AND'. */
export type Capability_Bool_Exp = {
  _and?: InputMaybe<Array<Capability_Bool_Exp>>;
  _not?: InputMaybe<Capability_Bool_Exp>;
  _or?: InputMaybe<Array<Capability_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  is_deprecated?: InputMaybe<Boolean_Comparison_Exp>;
  key?: InputMaybe<String_Comparison_Exp>;
  module?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "capability" */
export type Capability_Constraint =
  /** unique or primary key constraint on columns "key" */
  | 'capability_pkey';

/** input type for inserting data into table "capability" */
export type Capability_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  is_deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  module?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Capability_Max_Fields = {
  __typename?: 'capability_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  module?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Capability_Min_Fields = {
  __typename?: 'capability_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  module?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "capability" */
export type Capability_Mutation_Response = {
  __typename?: 'capability_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Capability>;
};

/** on_conflict condition type for table "capability" */
export type Capability_On_Conflict = {
  constraint: Capability_Constraint;
  update_columns?: Array<Capability_Update_Column>;
  where?: InputMaybe<Capability_Bool_Exp>;
};

/** Ordering options when selecting data from "capability". */
export type Capability_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  is_deprecated?: InputMaybe<Order_By>;
  key?: InputMaybe<Order_By>;
  module?: InputMaybe<Order_By>;
};

/** primary key columns input for table: capability */
export type Capability_Pk_Columns_Input = {
  key: Scalars['String']['input'];
};

/** select columns of table "capability" */
export type Capability_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'description'
  /** column name */
  | 'is_deprecated'
  /** column name */
  | 'key'
  /** column name */
  | 'module';

/** input type for updating data in table "capability" */
export type Capability_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  is_deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  module?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "capability" */
export type Capability_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Capability_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Capability_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  is_deprecated?: InputMaybe<Scalars['Boolean']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  module?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "capability" */
export type Capability_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'description'
  /** column name */
  | 'is_deprecated'
  /** column name */
  | 'key'
  /** column name */
  | 'module';

export type Capability_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Capability_Set_Input>;
  /** filter the rows which have to be updated */
  where: Capability_Bool_Exp;
};

/** columns and relationships of "clinic" */
export type Clinic = {
  __typename?: 'clinic';
  address_city?: Maybe<Scalars['String']['output']>;
  address_postal?: Maybe<Scalars['String']['output']>;
  address_province?: Maybe<Scalars['String']['output']>;
  address_street?: Maybe<Scalars['String']['output']>;
  address_unit?: Maybe<Scalars['String']['output']>;
  billing_number?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "clinic" */
export type Clinic_Aggregate = {
  __typename?: 'clinic_aggregate';
  aggregate?: Maybe<Clinic_Aggregate_Fields>;
  nodes: Array<Clinic>;
};

/** aggregate fields of "clinic" */
export type Clinic_Aggregate_Fields = {
  __typename?: 'clinic_aggregate_fields';
  avg?: Maybe<Clinic_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_Max_Fields>;
  min?: Maybe<Clinic_Min_Fields>;
  stddev?: Maybe<Clinic_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_Sum_Fields>;
  var_pop?: Maybe<Clinic_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_Var_Samp_Fields>;
  variance?: Maybe<Clinic_Variance_Fields>;
};


/** aggregate fields of "clinic" */
export type Clinic_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_Avg_Fields = {
  __typename?: 'clinic_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic". All fields are combined with a logical 'AND'. */
export type Clinic_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_Bool_Exp>>;
  _not?: InputMaybe<Clinic_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_Bool_Exp>>;
  address_city?: InputMaybe<String_Comparison_Exp>;
  address_postal?: InputMaybe<String_Comparison_Exp>;
  address_province?: InputMaybe<String_Comparison_Exp>;
  address_street?: InputMaybe<String_Comparison_Exp>;
  address_unit?: InputMaybe<String_Comparison_Exp>;
  billing_number?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  fax?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  timezone?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  website?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "clinic" */
export type Clinic_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'clinic_pkey';

/** columns and relationships of "clinic_hours" */
export type Clinic_Hours = {
  __typename?: 'clinic_hours';
  appointment_end?: Maybe<Scalars['time']['output']>;
  appointment_start?: Maybe<Scalars['time']['output']>;
  clinic_id: Scalars['bigint']['output'];
  close_time?: Maybe<Scalars['time']['output']>;
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  day_of_week: Scalars['smallint']['output'];
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  is_closed: Scalars['Boolean']['output'];
  open_time?: Maybe<Scalars['time']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "clinic_hours" */
export type Clinic_Hours_Aggregate = {
  __typename?: 'clinic_hours_aggregate';
  aggregate?: Maybe<Clinic_Hours_Aggregate_Fields>;
  nodes: Array<Clinic_Hours>;
};

/** aggregate fields of "clinic_hours" */
export type Clinic_Hours_Aggregate_Fields = {
  __typename?: 'clinic_hours_aggregate_fields';
  avg?: Maybe<Clinic_Hours_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_Hours_Max_Fields>;
  min?: Maybe<Clinic_Hours_Min_Fields>;
  stddev?: Maybe<Clinic_Hours_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_Hours_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_Hours_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_Hours_Sum_Fields>;
  var_pop?: Maybe<Clinic_Hours_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_Hours_Var_Samp_Fields>;
  variance?: Maybe<Clinic_Hours_Variance_Fields>;
};


/** aggregate fields of "clinic_hours" */
export type Clinic_Hours_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_Hours_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_Hours_Avg_Fields = {
  __typename?: 'clinic_hours_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_hours". All fields are combined with a logical 'AND'. */
export type Clinic_Hours_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_Hours_Bool_Exp>>;
  _not?: InputMaybe<Clinic_Hours_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_Hours_Bool_Exp>>;
  appointment_end?: InputMaybe<Time_Comparison_Exp>;
  appointment_start?: InputMaybe<Time_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  close_time?: InputMaybe<Time_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  day_of_week?: InputMaybe<Smallint_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_closed?: InputMaybe<Boolean_Comparison_Exp>;
  open_time?: InputMaybe<Time_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "clinic_hours" */
export type Clinic_Hours_Constraint =
  /** unique or primary key constraint on columns "clinic_id", "day_of_week" */
  | 'clinic_hours_clinic_id_day_of_week_key'
  /** unique or primary key constraint on columns "id" */
  | 'clinic_hours_pkey';

/** input type for incrementing numeric columns in table "clinic_hours" */
export type Clinic_Hours_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "clinic_hours" */
export type Clinic_Hours_Insert_Input = {
  appointment_end?: InputMaybe<Scalars['time']['input']>;
  appointment_start?: InputMaybe<Scalars['time']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  close_time?: InputMaybe<Scalars['time']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_closed?: InputMaybe<Scalars['Boolean']['input']>;
  open_time?: InputMaybe<Scalars['time']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Clinic_Hours_Max_Fields = {
  __typename?: 'clinic_hours_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  day_of_week?: Maybe<Scalars['smallint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Clinic_Hours_Min_Fields = {
  __typename?: 'clinic_hours_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  day_of_week?: Maybe<Scalars['smallint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "clinic_hours" */
export type Clinic_Hours_Mutation_Response = {
  __typename?: 'clinic_hours_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clinic_Hours>;
};

/** on_conflict condition type for table "clinic_hours" */
export type Clinic_Hours_On_Conflict = {
  constraint: Clinic_Hours_Constraint;
  update_columns?: Array<Clinic_Hours_Update_Column>;
  where?: InputMaybe<Clinic_Hours_Bool_Exp>;
};

/** Ordering options when selecting data from "clinic_hours". */
export type Clinic_Hours_Order_By = {
  appointment_end?: InputMaybe<Order_By>;
  appointment_start?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  close_time?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  day_of_week?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_closed?: InputMaybe<Order_By>;
  open_time?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: clinic_hours */
export type Clinic_Hours_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "clinic_hours" */
export type Clinic_Hours_Select_Column =
  /** column name */
  | 'appointment_end'
  /** column name */
  | 'appointment_start'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'close_time'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'day_of_week'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_closed'
  /** column name */
  | 'open_time'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "clinic_hours" */
export type Clinic_Hours_Set_Input = {
  appointment_end?: InputMaybe<Scalars['time']['input']>;
  appointment_start?: InputMaybe<Scalars['time']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  close_time?: InputMaybe<Scalars['time']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_closed?: InputMaybe<Scalars['Boolean']['input']>;
  open_time?: InputMaybe<Scalars['time']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Clinic_Hours_Stddev_Fields = {
  __typename?: 'clinic_hours_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_Hours_Stddev_Pop_Fields = {
  __typename?: 'clinic_hours_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_Hours_Stddev_Samp_Fields = {
  __typename?: 'clinic_hours_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_hours" */
export type Clinic_Hours_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_Hours_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_Hours_Stream_Cursor_Value_Input = {
  appointment_end?: InputMaybe<Scalars['time']['input']>;
  appointment_start?: InputMaybe<Scalars['time']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  close_time?: InputMaybe<Scalars['time']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_closed?: InputMaybe<Scalars['Boolean']['input']>;
  open_time?: InputMaybe<Scalars['time']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Clinic_Hours_Sum_Fields = {
  __typename?: 'clinic_hours_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  day_of_week?: Maybe<Scalars['smallint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "clinic_hours" */
export type Clinic_Hours_Update_Column =
  /** column name */
  | 'appointment_end'
  /** column name */
  | 'appointment_start'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'close_time'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'day_of_week'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_closed'
  /** column name */
  | 'open_time'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Clinic_Hours_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Clinic_Hours_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clinic_Hours_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clinic_Hours_Bool_Exp;
};

/** columns and relationships of "clinic_hours_v" */
export type Clinic_Hours_V = {
  __typename?: 'clinic_hours_v';
  appointment_end?: Maybe<Scalars['time']['output']>;
  appointment_start?: Maybe<Scalars['time']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  close_time?: Maybe<Scalars['time']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  day_of_week?: Maybe<Scalars['smallint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  is_closed?: Maybe<Scalars['Boolean']['output']>;
  open_time?: Maybe<Scalars['time']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "clinic_hours_v" */
export type Clinic_Hours_V_Aggregate = {
  __typename?: 'clinic_hours_v_aggregate';
  aggregate?: Maybe<Clinic_Hours_V_Aggregate_Fields>;
  nodes: Array<Clinic_Hours_V>;
};

/** aggregate fields of "clinic_hours_v" */
export type Clinic_Hours_V_Aggregate_Fields = {
  __typename?: 'clinic_hours_v_aggregate_fields';
  avg?: Maybe<Clinic_Hours_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_Hours_V_Max_Fields>;
  min?: Maybe<Clinic_Hours_V_Min_Fields>;
  stddev?: Maybe<Clinic_Hours_V_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_Hours_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_Hours_V_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_Hours_V_Sum_Fields>;
  var_pop?: Maybe<Clinic_Hours_V_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_Hours_V_Var_Samp_Fields>;
  variance?: Maybe<Clinic_Hours_V_Variance_Fields>;
};


/** aggregate fields of "clinic_hours_v" */
export type Clinic_Hours_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_Hours_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_Hours_V_Avg_Fields = {
  __typename?: 'clinic_hours_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_hours_v". All fields are combined with a logical 'AND'. */
export type Clinic_Hours_V_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_Hours_V_Bool_Exp>>;
  _not?: InputMaybe<Clinic_Hours_V_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_Hours_V_Bool_Exp>>;
  appointment_end?: InputMaybe<Time_Comparison_Exp>;
  appointment_start?: InputMaybe<Time_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  close_time?: InputMaybe<Time_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  day_of_week?: InputMaybe<Smallint_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_closed?: InputMaybe<Boolean_Comparison_Exp>;
  open_time?: InputMaybe<Time_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "clinic_hours_v" */
export type Clinic_Hours_V_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "clinic_hours_v" */
export type Clinic_Hours_V_Insert_Input = {
  appointment_end?: InputMaybe<Scalars['time']['input']>;
  appointment_start?: InputMaybe<Scalars['time']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  close_time?: InputMaybe<Scalars['time']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_closed?: InputMaybe<Scalars['Boolean']['input']>;
  open_time?: InputMaybe<Scalars['time']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Clinic_Hours_V_Max_Fields = {
  __typename?: 'clinic_hours_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  day_of_week?: Maybe<Scalars['smallint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Clinic_Hours_V_Min_Fields = {
  __typename?: 'clinic_hours_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  day_of_week?: Maybe<Scalars['smallint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "clinic_hours_v" */
export type Clinic_Hours_V_Mutation_Response = {
  __typename?: 'clinic_hours_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clinic_Hours_V>;
};

/** Ordering options when selecting data from "clinic_hours_v". */
export type Clinic_Hours_V_Order_By = {
  appointment_end?: InputMaybe<Order_By>;
  appointment_start?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  close_time?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  day_of_week?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_closed?: InputMaybe<Order_By>;
  open_time?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** select columns of table "clinic_hours_v" */
export type Clinic_Hours_V_Select_Column =
  /** column name */
  | 'appointment_end'
  /** column name */
  | 'appointment_start'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'close_time'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'day_of_week'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_closed'
  /** column name */
  | 'open_time'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "clinic_hours_v" */
export type Clinic_Hours_V_Set_Input = {
  appointment_end?: InputMaybe<Scalars['time']['input']>;
  appointment_start?: InputMaybe<Scalars['time']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  close_time?: InputMaybe<Scalars['time']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_closed?: InputMaybe<Scalars['Boolean']['input']>;
  open_time?: InputMaybe<Scalars['time']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Clinic_Hours_V_Stddev_Fields = {
  __typename?: 'clinic_hours_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_Hours_V_Stddev_Pop_Fields = {
  __typename?: 'clinic_hours_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_Hours_V_Stddev_Samp_Fields = {
  __typename?: 'clinic_hours_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_hours_v" */
export type Clinic_Hours_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_Hours_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_Hours_V_Stream_Cursor_Value_Input = {
  appointment_end?: InputMaybe<Scalars['time']['input']>;
  appointment_start?: InputMaybe<Scalars['time']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  close_time?: InputMaybe<Scalars['time']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  day_of_week?: InputMaybe<Scalars['smallint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_closed?: InputMaybe<Scalars['Boolean']['input']>;
  open_time?: InputMaybe<Scalars['time']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Clinic_Hours_V_Sum_Fields = {
  __typename?: 'clinic_hours_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  day_of_week?: Maybe<Scalars['smallint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

export type Clinic_Hours_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Clinic_Hours_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clinic_Hours_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clinic_Hours_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Clinic_Hours_V_Var_Pop_Fields = {
  __typename?: 'clinic_hours_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_Hours_V_Var_Samp_Fields = {
  __typename?: 'clinic_hours_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_Hours_V_Variance_Fields = {
  __typename?: 'clinic_hours_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_pop on columns */
export type Clinic_Hours_Var_Pop_Fields = {
  __typename?: 'clinic_hours_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_Hours_Var_Samp_Fields = {
  __typename?: 'clinic_hours_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_Hours_Variance_Fields = {
  __typename?: 'clinic_hours_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  day_of_week?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** input type for incrementing numeric columns in table "clinic" */
export type Clinic_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "clinic" */
export type Clinic_Insert_Input = {
  address_city?: InputMaybe<Scalars['String']['input']>;
  address_postal?: InputMaybe<Scalars['String']['input']>;
  address_province?: InputMaybe<Scalars['String']['input']>;
  address_street?: InputMaybe<Scalars['String']['input']>;
  address_unit?: InputMaybe<Scalars['String']['input']>;
  billing_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Clinic_Max_Fields = {
  __typename?: 'clinic_max_fields';
  address_city?: Maybe<Scalars['String']['output']>;
  address_postal?: Maybe<Scalars['String']['output']>;
  address_province?: Maybe<Scalars['String']['output']>;
  address_street?: Maybe<Scalars['String']['output']>;
  address_unit?: Maybe<Scalars['String']['output']>;
  billing_number?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Clinic_Min_Fields = {
  __typename?: 'clinic_min_fields';
  address_city?: Maybe<Scalars['String']['output']>;
  address_postal?: Maybe<Scalars['String']['output']>;
  address_province?: Maybe<Scalars['String']['output']>;
  address_street?: Maybe<Scalars['String']['output']>;
  address_unit?: Maybe<Scalars['String']['output']>;
  billing_number?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "clinic" */
export type Clinic_Mutation_Response = {
  __typename?: 'clinic_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clinic>;
};

/** on_conflict condition type for table "clinic" */
export type Clinic_On_Conflict = {
  constraint: Clinic_Constraint;
  update_columns?: Array<Clinic_Update_Column>;
  where?: InputMaybe<Clinic_Bool_Exp>;
};

/** Ordering options when selecting data from "clinic". */
export type Clinic_Order_By = {
  address_city?: InputMaybe<Order_By>;
  address_postal?: InputMaybe<Order_By>;
  address_province?: InputMaybe<Order_By>;
  address_street?: InputMaybe<Order_By>;
  address_unit?: InputMaybe<Order_By>;
  billing_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  fax?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  timezone?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  website?: InputMaybe<Order_By>;
};

/** primary key columns input for table: clinic */
export type Clinic_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "clinic" */
export type Clinic_Select_Column =
  /** column name */
  | 'address_city'
  /** column name */
  | 'address_postal'
  /** column name */
  | 'address_province'
  /** column name */
  | 'address_street'
  /** column name */
  | 'address_unit'
  /** column name */
  | 'billing_number'
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'fax'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name'
  /** column name */
  | 'phone'
  /** column name */
  | 'timezone'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'website';

/** input type for updating data in table "clinic" */
export type Clinic_Set_Input = {
  address_city?: InputMaybe<Scalars['String']['input']>;
  address_postal?: InputMaybe<Scalars['String']['input']>;
  address_province?: InputMaybe<Scalars['String']['input']>;
  address_street?: InputMaybe<Scalars['String']['input']>;
  address_unit?: InputMaybe<Scalars['String']['input']>;
  billing_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Clinic_Stddev_Fields = {
  __typename?: 'clinic_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_Stddev_Pop_Fields = {
  __typename?: 'clinic_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_Stddev_Samp_Fields = {
  __typename?: 'clinic_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic" */
export type Clinic_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_Stream_Cursor_Value_Input = {
  address_city?: InputMaybe<Scalars['String']['input']>;
  address_postal?: InputMaybe<Scalars['String']['input']>;
  address_province?: InputMaybe<Scalars['String']['input']>;
  address_street?: InputMaybe<Scalars['String']['input']>;
  address_unit?: InputMaybe<Scalars['String']['input']>;
  billing_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Clinic_Sum_Fields = {
  __typename?: 'clinic_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "clinic" */
export type Clinic_Update_Column =
  /** column name */
  | 'address_city'
  /** column name */
  | 'address_postal'
  /** column name */
  | 'address_province'
  /** column name */
  | 'address_street'
  /** column name */
  | 'address_unit'
  /** column name */
  | 'billing_number'
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'fax'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name'
  /** column name */
  | 'phone'
  /** column name */
  | 'timezone'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'website';

export type Clinic_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Clinic_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clinic_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clinic_Bool_Exp;
};

/** columns and relationships of "clinic_user" */
export type Clinic_User = {
  __typename?: 'clinic_user';
  clinic_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  is_schedulable: Scalars['Boolean']['output'];
  job_title?: Maybe<Scalars['String']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  provider_kind?: Maybe<Scalars['String']['output']>;
  scheduler_color?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "clinic_user" */
export type Clinic_User_Aggregate = {
  __typename?: 'clinic_user_aggregate';
  aggregate?: Maybe<Clinic_User_Aggregate_Fields>;
  nodes: Array<Clinic_User>;
};

/** aggregate fields of "clinic_user" */
export type Clinic_User_Aggregate_Fields = {
  __typename?: 'clinic_user_aggregate_fields';
  avg?: Maybe<Clinic_User_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_User_Max_Fields>;
  min?: Maybe<Clinic_User_Min_Fields>;
  stddev?: Maybe<Clinic_User_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_User_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_User_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_User_Sum_Fields>;
  var_pop?: Maybe<Clinic_User_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_User_Var_Samp_Fields>;
  variance?: Maybe<Clinic_User_Variance_Fields>;
};


/** aggregate fields of "clinic_user" */
export type Clinic_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_User_Avg_Fields = {
  __typename?: 'clinic_user_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_user". All fields are combined with a logical 'AND'. */
export type Clinic_User_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_User_Bool_Exp>>;
  _not?: InputMaybe<Clinic_User_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_User_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  default_operatory_id?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_schedulable?: InputMaybe<Boolean_Comparison_Exp>;
  job_title?: InputMaybe<String_Comparison_Exp>;
  joined_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  provider_kind?: InputMaybe<String_Comparison_Exp>;
  scheduler_color?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "clinic_user" */
export type Clinic_User_Constraint =
  /** unique or primary key constraint on columns "user_id", "clinic_id" */
  | 'clinic_user_clinic_id_user_id_key'
  /** unique or primary key constraint on columns "id" */
  | 'clinic_user_pkey';

/** columns and relationships of "clinic_user_effective_capabilities_v" */
export type Clinic_User_Effective_Capabilities_V = {
  __typename?: 'clinic_user_effective_capabilities_v';
  capability_key?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "clinic_user_effective_capabilities_v" */
export type Clinic_User_Effective_Capabilities_V_Aggregate = {
  __typename?: 'clinic_user_effective_capabilities_v_aggregate';
  aggregate?: Maybe<Clinic_User_Effective_Capabilities_V_Aggregate_Fields>;
  nodes: Array<Clinic_User_Effective_Capabilities_V>;
};

/** aggregate fields of "clinic_user_effective_capabilities_v" */
export type Clinic_User_Effective_Capabilities_V_Aggregate_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_aggregate_fields';
  avg?: Maybe<Clinic_User_Effective_Capabilities_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_User_Effective_Capabilities_V_Max_Fields>;
  min?: Maybe<Clinic_User_Effective_Capabilities_V_Min_Fields>;
  stddev?: Maybe<Clinic_User_Effective_Capabilities_V_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_User_Effective_Capabilities_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_User_Effective_Capabilities_V_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_User_Effective_Capabilities_V_Sum_Fields>;
  var_pop?: Maybe<Clinic_User_Effective_Capabilities_V_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_User_Effective_Capabilities_V_Var_Samp_Fields>;
  variance?: Maybe<Clinic_User_Effective_Capabilities_V_Variance_Fields>;
};


/** aggregate fields of "clinic_user_effective_capabilities_v" */
export type Clinic_User_Effective_Capabilities_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_User_Effective_Capabilities_V_Avg_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_user_effective_capabilities_v". All fields are combined with a logical 'AND'. */
export type Clinic_User_Effective_Capabilities_V_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Bool_Exp>>;
  _not?: InputMaybe<Clinic_User_Effective_Capabilities_V_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Bool_Exp>>;
  capability_key?: InputMaybe<String_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  clinic_user_id?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type Clinic_User_Effective_Capabilities_V_Max_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_max_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Clinic_User_Effective_Capabilities_V_Min_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_min_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** Ordering options when selecting data from "clinic_user_effective_capabilities_v". */
export type Clinic_User_Effective_Capabilities_V_Order_By = {
  capability_key?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  clinic_user_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** select columns of table "clinic_user_effective_capabilities_v" */
export type Clinic_User_Effective_Capabilities_V_Select_Column =
  /** column name */
  | 'capability_key'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'user_id';

/** aggregate stddev on columns */
export type Clinic_User_Effective_Capabilities_V_Stddev_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_User_Effective_Capabilities_V_Stddev_Pop_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_User_Effective_Capabilities_V_Stddev_Samp_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_user_effective_capabilities_v" */
export type Clinic_User_Effective_Capabilities_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_User_Effective_Capabilities_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_User_Effective_Capabilities_V_Stream_Cursor_Value_Input = {
  capability_key?: InputMaybe<Scalars['String']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Clinic_User_Effective_Capabilities_V_Sum_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Clinic_User_Effective_Capabilities_V_Var_Pop_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_User_Effective_Capabilities_V_Var_Samp_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_User_Effective_Capabilities_V_Variance_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** input type for incrementing numeric columns in table "clinic_user" */
export type Clinic_User_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  default_operatory_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "clinic_user" */
export type Clinic_User_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  default_operatory_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_schedulable?: InputMaybe<Scalars['Boolean']['input']>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  joined_at?: InputMaybe<Scalars['timestamptz']['input']>;
  provider_kind?: InputMaybe<Scalars['String']['input']>;
  scheduler_color?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Clinic_User_Max_Fields = {
  __typename?: 'clinic_user_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  provider_kind?: Maybe<Scalars['String']['output']>;
  scheduler_color?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Clinic_User_Min_Fields = {
  __typename?: 'clinic_user_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  provider_kind?: Maybe<Scalars['String']['output']>;
  scheduler_color?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "clinic_user" */
export type Clinic_User_Mutation_Response = {
  __typename?: 'clinic_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clinic_User>;
};

/** input type for inserting object relation for remote table "clinic_user" */
export type Clinic_User_Obj_Rel_Insert_Input = {
  data: Clinic_User_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Clinic_User_On_Conflict>;
};

/** on_conflict condition type for table "clinic_user" */
export type Clinic_User_On_Conflict = {
  constraint: Clinic_User_Constraint;
  update_columns?: Array<Clinic_User_Update_Column>;
  where?: InputMaybe<Clinic_User_Bool_Exp>;
};

/** Ordering options when selecting data from "clinic_user". */
export type Clinic_User_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  default_operatory_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_schedulable?: InputMaybe<Order_By>;
  job_title?: InputMaybe<Order_By>;
  joined_at?: InputMaybe<Order_By>;
  provider_kind?: InputMaybe<Order_By>;
  scheduler_color?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: clinic_user */
export type Clinic_User_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** columns and relationships of "clinic_user_role" */
export type Clinic_User_Role = {
  __typename?: 'clinic_user_role';
  clinic_user_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  role_id: Scalars['bigint']['output'];
};

/** aggregated selection of "clinic_user_role" */
export type Clinic_User_Role_Aggregate = {
  __typename?: 'clinic_user_role_aggregate';
  aggregate?: Maybe<Clinic_User_Role_Aggregate_Fields>;
  nodes: Array<Clinic_User_Role>;
};

/** aggregate fields of "clinic_user_role" */
export type Clinic_User_Role_Aggregate_Fields = {
  __typename?: 'clinic_user_role_aggregate_fields';
  avg?: Maybe<Clinic_User_Role_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_User_Role_Max_Fields>;
  min?: Maybe<Clinic_User_Role_Min_Fields>;
  stddev?: Maybe<Clinic_User_Role_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_User_Role_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_User_Role_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_User_Role_Sum_Fields>;
  var_pop?: Maybe<Clinic_User_Role_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_User_Role_Var_Samp_Fields>;
  variance?: Maybe<Clinic_User_Role_Variance_Fields>;
};


/** aggregate fields of "clinic_user_role" */
export type Clinic_User_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_User_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_User_Role_Avg_Fields = {
  __typename?: 'clinic_user_role_avg_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_user_role". All fields are combined with a logical 'AND'. */
export type Clinic_User_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_User_Role_Bool_Exp>>;
  _not?: InputMaybe<Clinic_User_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_User_Role_Bool_Exp>>;
  clinic_user_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  role_id?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "clinic_user_role" */
export type Clinic_User_Role_Constraint =
  /** unique or primary key constraint on columns "clinic_user_id", "role_id" */
  | 'clinic_user_role_pkey';

/** input type for incrementing numeric columns in table "clinic_user_role" */
export type Clinic_User_Role_Inc_Input = {
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "clinic_user_role" */
export type Clinic_User_Role_Insert_Input = {
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Clinic_User_Role_Max_Fields = {
  __typename?: 'clinic_user_role_max_fields';
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Clinic_User_Role_Min_Fields = {
  __typename?: 'clinic_user_role_min_fields';
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** response of any mutation on the table "clinic_user_role" */
export type Clinic_User_Role_Mutation_Response = {
  __typename?: 'clinic_user_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clinic_User_Role>;
};

/** on_conflict condition type for table "clinic_user_role" */
export type Clinic_User_Role_On_Conflict = {
  constraint: Clinic_User_Role_Constraint;
  update_columns?: Array<Clinic_User_Role_Update_Column>;
  where?: InputMaybe<Clinic_User_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "clinic_user_role". */
export type Clinic_User_Role_Order_By = {
  clinic_user_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: clinic_user_role */
export type Clinic_User_Role_Pk_Columns_Input = {
  clinic_user_id: Scalars['bigint']['input'];
  role_id: Scalars['bigint']['input'];
};

/** select columns of table "clinic_user_role" */
export type Clinic_User_Role_Select_Column =
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'role_id';

/** input type for updating data in table "clinic_user_role" */
export type Clinic_User_Role_Set_Input = {
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Clinic_User_Role_Stddev_Fields = {
  __typename?: 'clinic_user_role_stddev_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_User_Role_Stddev_Pop_Fields = {
  __typename?: 'clinic_user_role_stddev_pop_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_User_Role_Stddev_Samp_Fields = {
  __typename?: 'clinic_user_role_stddev_samp_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_user_role" */
export type Clinic_User_Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_User_Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_User_Role_Stream_Cursor_Value_Input = {
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Clinic_User_Role_Sum_Fields = {
  __typename?: 'clinic_user_role_sum_fields';
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "clinic_user_role" */
export type Clinic_User_Role_Update_Column =
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'role_id';

export type Clinic_User_Role_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Clinic_User_Role_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clinic_User_Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clinic_User_Role_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Clinic_User_Role_Var_Pop_Fields = {
  __typename?: 'clinic_user_role_var_pop_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_User_Role_Var_Samp_Fields = {
  __typename?: 'clinic_user_role_var_samp_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_User_Role_Variance_Fields = {
  __typename?: 'clinic_user_role_variance_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** select columns of table "clinic_user" */
export type Clinic_User_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'default_operatory_id'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_schedulable'
  /** column name */
  | 'job_title'
  /** column name */
  | 'joined_at'
  /** column name */
  | 'provider_kind'
  /** column name */
  | 'scheduler_color'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'user_id';

/** input type for updating data in table "clinic_user" */
export type Clinic_User_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  default_operatory_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_schedulable?: InputMaybe<Scalars['Boolean']['input']>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  joined_at?: InputMaybe<Scalars['timestamptz']['input']>;
  provider_kind?: InputMaybe<Scalars['String']['input']>;
  scheduler_color?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Clinic_User_Stddev_Fields = {
  __typename?: 'clinic_user_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_User_Stddev_Pop_Fields = {
  __typename?: 'clinic_user_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_User_Stddev_Samp_Fields = {
  __typename?: 'clinic_user_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_user" */
export type Clinic_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_User_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  default_operatory_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_schedulable?: InputMaybe<Scalars['Boolean']['input']>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  joined_at?: InputMaybe<Scalars['timestamptz']['input']>;
  provider_kind?: InputMaybe<Scalars['String']['input']>;
  scheduler_color?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Clinic_User_Sum_Fields = {
  __typename?: 'clinic_user_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "clinic_user" */
export type Clinic_User_Update_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'default_operatory_id'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_schedulable'
  /** column name */
  | 'job_title'
  /** column name */
  | 'joined_at'
  /** column name */
  | 'provider_kind'
  /** column name */
  | 'scheduler_color'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'user_id';

export type Clinic_User_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Clinic_User_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clinic_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clinic_User_Bool_Exp;
};

/** columns and relationships of "clinic_user_v" */
export type Clinic_User_V = {
  __typename?: 'clinic_user_v';
  /** An object relationship */
  clinic?: Maybe<Clinic_V>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "clinic_user_v" */
export type Clinic_User_V_Aggregate = {
  __typename?: 'clinic_user_v_aggregate';
  aggregate?: Maybe<Clinic_User_V_Aggregate_Fields>;
  nodes: Array<Clinic_User_V>;
};

/** aggregate fields of "clinic_user_v" */
export type Clinic_User_V_Aggregate_Fields = {
  __typename?: 'clinic_user_v_aggregate_fields';
  avg?: Maybe<Clinic_User_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_User_V_Max_Fields>;
  min?: Maybe<Clinic_User_V_Min_Fields>;
  stddev?: Maybe<Clinic_User_V_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_User_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_User_V_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_User_V_Sum_Fields>;
  var_pop?: Maybe<Clinic_User_V_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_User_V_Var_Samp_Fields>;
  variance?: Maybe<Clinic_User_V_Variance_Fields>;
};


/** aggregate fields of "clinic_user_v" */
export type Clinic_User_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_User_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_User_V_Avg_Fields = {
  __typename?: 'clinic_user_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_user_v". All fields are combined with a logical 'AND'. */
export type Clinic_User_V_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_User_V_Bool_Exp>>;
  _not?: InputMaybe<Clinic_User_V_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_User_V_Bool_Exp>>;
  clinic?: InputMaybe<Clinic_V_Bool_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  joined_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "clinic_user_v" */
export type Clinic_User_V_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "clinic_user_v" */
export type Clinic_User_V_Insert_Input = {
  clinic?: InputMaybe<Clinic_V_Obj_Rel_Insert_Input>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  joined_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Clinic_User_V_Max_Fields = {
  __typename?: 'clinic_user_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Clinic_User_V_Min_Fields = {
  __typename?: 'clinic_user_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "clinic_user_v" */
export type Clinic_User_V_Mutation_Response = {
  __typename?: 'clinic_user_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clinic_User_V>;
};

/** Ordering options when selecting data from "clinic_user_v". */
export type Clinic_User_V_Order_By = {
  clinic?: InputMaybe<Clinic_V_Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  joined_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** select columns of table "clinic_user_v" */
export type Clinic_User_V_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'joined_at'
  /** column name */
  | 'user_id';

/** input type for updating data in table "clinic_user_v" */
export type Clinic_User_V_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  joined_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Clinic_User_V_Stddev_Fields = {
  __typename?: 'clinic_user_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_User_V_Stddev_Pop_Fields = {
  __typename?: 'clinic_user_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_User_V_Stddev_Samp_Fields = {
  __typename?: 'clinic_user_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_user_v" */
export type Clinic_User_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_User_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_User_V_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  joined_at?: InputMaybe<Scalars['timestamptz']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Clinic_User_V_Sum_Fields = {
  __typename?: 'clinic_user_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

export type Clinic_User_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Clinic_User_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clinic_User_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clinic_User_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Clinic_User_V_Var_Pop_Fields = {
  __typename?: 'clinic_user_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_User_V_Var_Samp_Fields = {
  __typename?: 'clinic_user_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_User_V_Variance_Fields = {
  __typename?: 'clinic_user_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_pop on columns */
export type Clinic_User_Var_Pop_Fields = {
  __typename?: 'clinic_user_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_User_Var_Samp_Fields = {
  __typename?: 'clinic_user_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_User_Variance_Fields = {
  __typename?: 'clinic_user_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "clinic_user_with_profile_v" */
export type Clinic_User_With_Profile_V = {
  __typename?: 'clinic_user_with_profile_v';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_membership_active?: Maybe<Scalars['Boolean']['output']>;
  clinic_scheduler_color?: Maybe<Scalars['String']['output']>;
  clinic_user_created_at?: Maybe<Scalars['timestamptz']['output']>;
  clinic_user_created_by?: Maybe<Scalars['uuid']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  clinic_user_updated_by?: Maybe<Scalars['uuid']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  global_scheduler_color?: Maybe<Scalars['String']['output']>;
  is_schedulable?: Maybe<Scalars['Boolean']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  license_no?: Maybe<Scalars['String']['output']>;
  profile_active?: Maybe<Scalars['Boolean']['output']>;
  provider_kind?: Maybe<Scalars['String']['output']>;
  user_account_active?: Maybe<Scalars['Boolean']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  user_kind?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "clinic_user_with_profile_v" */
export type Clinic_User_With_Profile_V_Aggregate = {
  __typename?: 'clinic_user_with_profile_v_aggregate';
  aggregate?: Maybe<Clinic_User_With_Profile_V_Aggregate_Fields>;
  nodes: Array<Clinic_User_With_Profile_V>;
};

/** aggregate fields of "clinic_user_with_profile_v" */
export type Clinic_User_With_Profile_V_Aggregate_Fields = {
  __typename?: 'clinic_user_with_profile_v_aggregate_fields';
  avg?: Maybe<Clinic_User_With_Profile_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_User_With_Profile_V_Max_Fields>;
  min?: Maybe<Clinic_User_With_Profile_V_Min_Fields>;
  stddev?: Maybe<Clinic_User_With_Profile_V_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_User_With_Profile_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_User_With_Profile_V_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_User_With_Profile_V_Sum_Fields>;
  var_pop?: Maybe<Clinic_User_With_Profile_V_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_User_With_Profile_V_Var_Samp_Fields>;
  variance?: Maybe<Clinic_User_With_Profile_V_Variance_Fields>;
};


/** aggregate fields of "clinic_user_with_profile_v" */
export type Clinic_User_With_Profile_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_User_With_Profile_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_User_With_Profile_V_Avg_Fields = {
  __typename?: 'clinic_user_with_profile_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_user_with_profile_v". All fields are combined with a logical 'AND'. */
export type Clinic_User_With_Profile_V_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_User_With_Profile_V_Bool_Exp>>;
  _not?: InputMaybe<Clinic_User_With_Profile_V_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_User_With_Profile_V_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  clinic_membership_active?: InputMaybe<Boolean_Comparison_Exp>;
  clinic_scheduler_color?: InputMaybe<String_Comparison_Exp>;
  clinic_user_created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  clinic_user_created_by?: InputMaybe<Uuid_Comparison_Exp>;
  clinic_user_id?: InputMaybe<Bigint_Comparison_Exp>;
  clinic_user_updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  clinic_user_updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  default_operatory_id?: InputMaybe<Bigint_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  global_scheduler_color?: InputMaybe<String_Comparison_Exp>;
  is_schedulable?: InputMaybe<Boolean_Comparison_Exp>;
  job_title?: InputMaybe<String_Comparison_Exp>;
  joined_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  license_no?: InputMaybe<String_Comparison_Exp>;
  profile_active?: InputMaybe<Boolean_Comparison_Exp>;
  provider_kind?: InputMaybe<String_Comparison_Exp>;
  user_account_active?: InputMaybe<Boolean_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_kind?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Clinic_User_With_Profile_V_Max_Fields = {
  __typename?: 'clinic_user_with_profile_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_scheduler_color?: Maybe<Scalars['String']['output']>;
  clinic_user_created_at?: Maybe<Scalars['timestamptz']['output']>;
  clinic_user_created_by?: Maybe<Scalars['uuid']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  clinic_user_updated_by?: Maybe<Scalars['uuid']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  global_scheduler_color?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  license_no?: Maybe<Scalars['String']['output']>;
  provider_kind?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  user_kind?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Clinic_User_With_Profile_V_Min_Fields = {
  __typename?: 'clinic_user_with_profile_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_scheduler_color?: Maybe<Scalars['String']['output']>;
  clinic_user_created_at?: Maybe<Scalars['timestamptz']['output']>;
  clinic_user_created_by?: Maybe<Scalars['uuid']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_updated_at?: Maybe<Scalars['timestamptz']['output']>;
  clinic_user_updated_by?: Maybe<Scalars['uuid']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  global_scheduler_color?: Maybe<Scalars['String']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  joined_at?: Maybe<Scalars['timestamptz']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  license_no?: Maybe<Scalars['String']['output']>;
  provider_kind?: Maybe<Scalars['String']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  user_kind?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "clinic_user_with_profile_v". */
export type Clinic_User_With_Profile_V_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  clinic_membership_active?: InputMaybe<Order_By>;
  clinic_scheduler_color?: InputMaybe<Order_By>;
  clinic_user_created_at?: InputMaybe<Order_By>;
  clinic_user_created_by?: InputMaybe<Order_By>;
  clinic_user_id?: InputMaybe<Order_By>;
  clinic_user_updated_at?: InputMaybe<Order_By>;
  clinic_user_updated_by?: InputMaybe<Order_By>;
  default_operatory_id?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  global_scheduler_color?: InputMaybe<Order_By>;
  is_schedulable?: InputMaybe<Order_By>;
  job_title?: InputMaybe<Order_By>;
  joined_at?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  license_no?: InputMaybe<Order_By>;
  profile_active?: InputMaybe<Order_By>;
  provider_kind?: InputMaybe<Order_By>;
  user_account_active?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  user_kind?: InputMaybe<Order_By>;
};

/** select columns of table "clinic_user_with_profile_v" */
export type Clinic_User_With_Profile_V_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'clinic_membership_active'
  /** column name */
  | 'clinic_scheduler_color'
  /** column name */
  | 'clinic_user_created_at'
  /** column name */
  | 'clinic_user_created_by'
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'clinic_user_updated_at'
  /** column name */
  | 'clinic_user_updated_by'
  /** column name */
  | 'default_operatory_id'
  /** column name */
  | 'email'
  /** column name */
  | 'first_name'
  /** column name */
  | 'global_scheduler_color'
  /** column name */
  | 'is_schedulable'
  /** column name */
  | 'job_title'
  /** column name */
  | 'joined_at'
  /** column name */
  | 'last_name'
  /** column name */
  | 'license_no'
  /** column name */
  | 'profile_active'
  /** column name */
  | 'provider_kind'
  /** column name */
  | 'user_account_active'
  /** column name */
  | 'user_id'
  /** column name */
  | 'user_kind';

/** aggregate stddev on columns */
export type Clinic_User_With_Profile_V_Stddev_Fields = {
  __typename?: 'clinic_user_with_profile_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_User_With_Profile_V_Stddev_Pop_Fields = {
  __typename?: 'clinic_user_with_profile_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_User_With_Profile_V_Stddev_Samp_Fields = {
  __typename?: 'clinic_user_with_profile_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_user_with_profile_v" */
export type Clinic_User_With_Profile_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_User_With_Profile_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_User_With_Profile_V_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_membership_active?: InputMaybe<Scalars['Boolean']['input']>;
  clinic_scheduler_color?: InputMaybe<Scalars['String']['input']>;
  clinic_user_created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  clinic_user_created_by?: InputMaybe<Scalars['uuid']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_user_updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  clinic_user_updated_by?: InputMaybe<Scalars['uuid']['input']>;
  default_operatory_id?: InputMaybe<Scalars['bigint']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  global_scheduler_color?: InputMaybe<Scalars['String']['input']>;
  is_schedulable?: InputMaybe<Scalars['Boolean']['input']>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  joined_at?: InputMaybe<Scalars['timestamptz']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  license_no?: InputMaybe<Scalars['String']['input']>;
  profile_active?: InputMaybe<Scalars['Boolean']['input']>;
  provider_kind?: InputMaybe<Scalars['String']['input']>;
  user_account_active?: InputMaybe<Scalars['Boolean']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  user_kind?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Clinic_User_With_Profile_V_Sum_Fields = {
  __typename?: 'clinic_user_with_profile_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  default_operatory_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Clinic_User_With_Profile_V_Var_Pop_Fields = {
  __typename?: 'clinic_user_with_profile_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_User_With_Profile_V_Var_Samp_Fields = {
  __typename?: 'clinic_user_with_profile_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_User_With_Profile_V_Variance_Fields = {
  __typename?: 'clinic_user_with_profile_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
  default_operatory_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "clinic_v" */
export type Clinic_V = {
  __typename?: 'clinic_v';
  address_city?: Maybe<Scalars['String']['output']>;
  address_postal?: Maybe<Scalars['String']['output']>;
  address_province?: Maybe<Scalars['String']['output']>;
  address_street?: Maybe<Scalars['String']['output']>;
  address_unit?: Maybe<Scalars['String']['output']>;
  billing_number?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "clinic_v" */
export type Clinic_V_Aggregate = {
  __typename?: 'clinic_v_aggregate';
  aggregate?: Maybe<Clinic_V_Aggregate_Fields>;
  nodes: Array<Clinic_V>;
};

/** aggregate fields of "clinic_v" */
export type Clinic_V_Aggregate_Fields = {
  __typename?: 'clinic_v_aggregate_fields';
  avg?: Maybe<Clinic_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Clinic_V_Max_Fields>;
  min?: Maybe<Clinic_V_Min_Fields>;
  stddev?: Maybe<Clinic_V_Stddev_Fields>;
  stddev_pop?: Maybe<Clinic_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Clinic_V_Stddev_Samp_Fields>;
  sum?: Maybe<Clinic_V_Sum_Fields>;
  var_pop?: Maybe<Clinic_V_Var_Pop_Fields>;
  var_samp?: Maybe<Clinic_V_Var_Samp_Fields>;
  variance?: Maybe<Clinic_V_Variance_Fields>;
};


/** aggregate fields of "clinic_v" */
export type Clinic_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Clinic_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Clinic_V_Avg_Fields = {
  __typename?: 'clinic_v_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "clinic_v". All fields are combined with a logical 'AND'. */
export type Clinic_V_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_V_Bool_Exp>>;
  _not?: InputMaybe<Clinic_V_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_V_Bool_Exp>>;
  address_city?: InputMaybe<String_Comparison_Exp>;
  address_postal?: InputMaybe<String_Comparison_Exp>;
  address_province?: InputMaybe<String_Comparison_Exp>;
  address_street?: InputMaybe<String_Comparison_Exp>;
  address_unit?: InputMaybe<String_Comparison_Exp>;
  billing_number?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  fax?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  timezone?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  website?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "clinic_v" */
export type Clinic_V_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "clinic_v" */
export type Clinic_V_Insert_Input = {
  address_city?: InputMaybe<Scalars['String']['input']>;
  address_postal?: InputMaybe<Scalars['String']['input']>;
  address_province?: InputMaybe<Scalars['String']['input']>;
  address_street?: InputMaybe<Scalars['String']['input']>;
  address_unit?: InputMaybe<Scalars['String']['input']>;
  billing_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Clinic_V_Max_Fields = {
  __typename?: 'clinic_v_max_fields';
  address_city?: Maybe<Scalars['String']['output']>;
  address_postal?: Maybe<Scalars['String']['output']>;
  address_province?: Maybe<Scalars['String']['output']>;
  address_street?: Maybe<Scalars['String']['output']>;
  address_unit?: Maybe<Scalars['String']['output']>;
  billing_number?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Clinic_V_Min_Fields = {
  __typename?: 'clinic_v_min_fields';
  address_city?: Maybe<Scalars['String']['output']>;
  address_postal?: Maybe<Scalars['String']['output']>;
  address_province?: Maybe<Scalars['String']['output']>;
  address_street?: Maybe<Scalars['String']['output']>;
  address_unit?: Maybe<Scalars['String']['output']>;
  billing_number?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "clinic_v" */
export type Clinic_V_Mutation_Response = {
  __typename?: 'clinic_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Clinic_V>;
};

/** input type for inserting object relation for remote table "clinic_v" */
export type Clinic_V_Obj_Rel_Insert_Input = {
  data: Clinic_V_Insert_Input;
};

/** Ordering options when selecting data from "clinic_v". */
export type Clinic_V_Order_By = {
  address_city?: InputMaybe<Order_By>;
  address_postal?: InputMaybe<Order_By>;
  address_province?: InputMaybe<Order_By>;
  address_street?: InputMaybe<Order_By>;
  address_unit?: InputMaybe<Order_By>;
  billing_number?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  fax?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  timezone?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  website?: InputMaybe<Order_By>;
};

/** select columns of table "clinic_v" */
export type Clinic_V_Select_Column =
  /** column name */
  | 'address_city'
  /** column name */
  | 'address_postal'
  /** column name */
  | 'address_province'
  /** column name */
  | 'address_street'
  /** column name */
  | 'address_unit'
  /** column name */
  | 'billing_number'
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'fax'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name'
  /** column name */
  | 'phone'
  /** column name */
  | 'timezone'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'website';

/** input type for updating data in table "clinic_v" */
export type Clinic_V_Set_Input = {
  address_city?: InputMaybe<Scalars['String']['input']>;
  address_postal?: InputMaybe<Scalars['String']['input']>;
  address_province?: InputMaybe<Scalars['String']['input']>;
  address_street?: InputMaybe<Scalars['String']['input']>;
  address_unit?: InputMaybe<Scalars['String']['input']>;
  billing_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Clinic_V_Stddev_Fields = {
  __typename?: 'clinic_v_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_V_Stddev_Pop_Fields = {
  __typename?: 'clinic_v_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_V_Stddev_Samp_Fields = {
  __typename?: 'clinic_v_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "clinic_v" */
export type Clinic_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Clinic_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Clinic_V_Stream_Cursor_Value_Input = {
  address_city?: InputMaybe<Scalars['String']['input']>;
  address_postal?: InputMaybe<Scalars['String']['input']>;
  address_province?: InputMaybe<Scalars['String']['input']>;
  address_street?: InputMaybe<Scalars['String']['input']>;
  address_unit?: InputMaybe<Scalars['String']['input']>;
  billing_number?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Clinic_V_Sum_Fields = {
  __typename?: 'clinic_v_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

export type Clinic_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Clinic_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Clinic_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: Clinic_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Clinic_V_Var_Pop_Fields = {
  __typename?: 'clinic_v_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_V_Var_Samp_Fields = {
  __typename?: 'clinic_v_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_V_Variance_Fields = {
  __typename?: 'clinic_v_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_pop on columns */
export type Clinic_Var_Pop_Fields = {
  __typename?: 'clinic_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_Var_Samp_Fields = {
  __typename?: 'clinic_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_Variance_Fields = {
  __typename?: 'clinic_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** ordering argument of a cursor */
export type Cursor_Ordering =
  /** ascending ordering of the cursor */
  | 'ASC'
  /** descending ordering of the cursor */
  | 'DESC';

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

export type Fn_Bootstrap_System_Args = {
  p_admin_email?: InputMaybe<Scalars['String']['input']>;
  p_admin_first_name?: InputMaybe<Scalars['String']['input']>;
  p_admin_last_name?: InputMaybe<Scalars['String']['input']>;
  p_admin_password_hash?: InputMaybe<Scalars['String']['input']>;
  p_clinic_name?: InputMaybe<Scalars['String']['input']>;
  p_clinic_timezone?: InputMaybe<Scalars['String']['input']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "app_user" */
  delete_app_user?: Maybe<App_User_Mutation_Response>;
  /** delete single row from the table: "app_user" */
  delete_app_user_by_pk?: Maybe<App_User>;
  /** delete data from the table: "app_user_v" */
  delete_app_user_v?: Maybe<App_User_V_Mutation_Response>;
  /** delete data from the table: "bootstrap_event" */
  delete_bootstrap_event?: Maybe<Bootstrap_Event_Mutation_Response>;
  /** delete single row from the table: "bootstrap_event" */
  delete_bootstrap_event_by_pk?: Maybe<Bootstrap_Event>;
  /** delete data from the table: "capability" */
  delete_capability?: Maybe<Capability_Mutation_Response>;
  /** delete single row from the table: "capability" */
  delete_capability_by_pk?: Maybe<Capability>;
  /** delete data from the table: "clinic" */
  delete_clinic?: Maybe<Clinic_Mutation_Response>;
  /** delete single row from the table: "clinic" */
  delete_clinic_by_pk?: Maybe<Clinic>;
  /** delete data from the table: "clinic_hours" */
  delete_clinic_hours?: Maybe<Clinic_Hours_Mutation_Response>;
  /** delete single row from the table: "clinic_hours" */
  delete_clinic_hours_by_pk?: Maybe<Clinic_Hours>;
  /** delete data from the table: "clinic_hours_v" */
  delete_clinic_hours_v?: Maybe<Clinic_Hours_V_Mutation_Response>;
  /** delete data from the table: "clinic_user" */
  delete_clinic_user?: Maybe<Clinic_User_Mutation_Response>;
  /** delete single row from the table: "clinic_user" */
  delete_clinic_user_by_pk?: Maybe<Clinic_User>;
  /** delete data from the table: "clinic_user_role" */
  delete_clinic_user_role?: Maybe<Clinic_User_Role_Mutation_Response>;
  /** delete single row from the table: "clinic_user_role" */
  delete_clinic_user_role_by_pk?: Maybe<Clinic_User_Role>;
  /** delete data from the table: "clinic_user_v" */
  delete_clinic_user_v?: Maybe<Clinic_User_V_Mutation_Response>;
  /** delete data from the table: "clinic_v" */
  delete_clinic_v?: Maybe<Clinic_V_Mutation_Response>;
  /** delete data from the table: "operatory" */
  delete_operatory?: Maybe<Operatory_Mutation_Response>;
  /** delete single row from the table: "operatory" */
  delete_operatory_by_pk?: Maybe<Operatory>;
  /** delete data from the table: "operatory_v" */
  delete_operatory_v?: Maybe<Operatory_V_Mutation_Response>;
  /** delete data from the table: "role" */
  delete_role?: Maybe<Role_Mutation_Response>;
  /** delete single row from the table: "role" */
  delete_role_by_pk?: Maybe<Role>;
  /** delete data from the table: "role_capability" */
  delete_role_capability?: Maybe<Role_Capability_Mutation_Response>;
  /** delete single row from the table: "role_capability" */
  delete_role_capability_by_pk?: Maybe<Role_Capability>;
  /** delete data from the table: "role_v" */
  delete_role_v?: Maybe<Role_V_Mutation_Response>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** delete data from the table: "user_capability_override" */
  delete_user_capability_override?: Maybe<User_Capability_Override_Mutation_Response>;
  /** delete single row from the table: "user_capability_override" */
  delete_user_capability_override_by_pk?: Maybe<User_Capability_Override>;
  /** delete data from the table: "user_profile" */
  delete_user_profile?: Maybe<User_Profile_Mutation_Response>;
  /** delete single row from the table: "user_profile" */
  delete_user_profile_by_pk?: Maybe<User_Profile>;
  /** delete data from the table: "user_provider_identifier" */
  delete_user_provider_identifier?: Maybe<User_Provider_Identifier_Mutation_Response>;
  /** delete single row from the table: "user_provider_identifier" */
  delete_user_provider_identifier_by_pk?: Maybe<User_Provider_Identifier>;
  /** delete data from the table: "user_provider_identifier_v" */
  delete_user_provider_identifier_v?: Maybe<User_Provider_Identifier_V_Mutation_Response>;
  /** execute VOLATILE function "fn_bootstrap_system" which returns "bootstrap_event" */
  fn_bootstrap_system: Array<Bootstrap_Event>;
  /** insert data into the table: "app_user" */
  insert_app_user?: Maybe<App_User_Mutation_Response>;
  /** insert a single row into the table: "app_user" */
  insert_app_user_one?: Maybe<App_User>;
  /** insert data into the table: "app_user_v" */
  insert_app_user_v?: Maybe<App_User_V_Mutation_Response>;
  /** insert a single row into the table: "app_user_v" */
  insert_app_user_v_one?: Maybe<App_User_V>;
  /** insert data into the table: "bootstrap_event" */
  insert_bootstrap_event?: Maybe<Bootstrap_Event_Mutation_Response>;
  /** insert a single row into the table: "bootstrap_event" */
  insert_bootstrap_event_one?: Maybe<Bootstrap_Event>;
  /** insert data into the table: "capability" */
  insert_capability?: Maybe<Capability_Mutation_Response>;
  /** insert a single row into the table: "capability" */
  insert_capability_one?: Maybe<Capability>;
  /** insert data into the table: "clinic" */
  insert_clinic?: Maybe<Clinic_Mutation_Response>;
  /** insert data into the table: "clinic_hours" */
  insert_clinic_hours?: Maybe<Clinic_Hours_Mutation_Response>;
  /** insert a single row into the table: "clinic_hours" */
  insert_clinic_hours_one?: Maybe<Clinic_Hours>;
  /** insert data into the table: "clinic_hours_v" */
  insert_clinic_hours_v?: Maybe<Clinic_Hours_V_Mutation_Response>;
  /** insert a single row into the table: "clinic_hours_v" */
  insert_clinic_hours_v_one?: Maybe<Clinic_Hours_V>;
  /** insert a single row into the table: "clinic" */
  insert_clinic_one?: Maybe<Clinic>;
  /** insert data into the table: "clinic_user" */
  insert_clinic_user?: Maybe<Clinic_User_Mutation_Response>;
  /** insert a single row into the table: "clinic_user" */
  insert_clinic_user_one?: Maybe<Clinic_User>;
  /** insert data into the table: "clinic_user_role" */
  insert_clinic_user_role?: Maybe<Clinic_User_Role_Mutation_Response>;
  /** insert a single row into the table: "clinic_user_role" */
  insert_clinic_user_role_one?: Maybe<Clinic_User_Role>;
  /** insert data into the table: "clinic_user_v" */
  insert_clinic_user_v?: Maybe<Clinic_User_V_Mutation_Response>;
  /** insert a single row into the table: "clinic_user_v" */
  insert_clinic_user_v_one?: Maybe<Clinic_User_V>;
  /** insert data into the table: "clinic_v" */
  insert_clinic_v?: Maybe<Clinic_V_Mutation_Response>;
  /** insert a single row into the table: "clinic_v" */
  insert_clinic_v_one?: Maybe<Clinic_V>;
  /** insert data into the table: "operatory" */
  insert_operatory?: Maybe<Operatory_Mutation_Response>;
  /** insert a single row into the table: "operatory" */
  insert_operatory_one?: Maybe<Operatory>;
  /** insert data into the table: "operatory_v" */
  insert_operatory_v?: Maybe<Operatory_V_Mutation_Response>;
  /** insert a single row into the table: "operatory_v" */
  insert_operatory_v_one?: Maybe<Operatory_V>;
  /** insert data into the table: "role" */
  insert_role?: Maybe<Role_Mutation_Response>;
  /** insert data into the table: "role_capability" */
  insert_role_capability?: Maybe<Role_Capability_Mutation_Response>;
  /** insert a single row into the table: "role_capability" */
  insert_role_capability_one?: Maybe<Role_Capability>;
  /** insert a single row into the table: "role" */
  insert_role_one?: Maybe<Role>;
  /** insert data into the table: "role_v" */
  insert_role_v?: Maybe<Role_V_Mutation_Response>;
  /** insert a single row into the table: "role_v" */
  insert_role_v_one?: Maybe<Role_V>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert data into the table: "user_capability_override" */
  insert_user_capability_override?: Maybe<User_Capability_Override_Mutation_Response>;
  /** insert a single row into the table: "user_capability_override" */
  insert_user_capability_override_one?: Maybe<User_Capability_Override>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** insert data into the table: "user_profile" */
  insert_user_profile?: Maybe<User_Profile_Mutation_Response>;
  /** insert a single row into the table: "user_profile" */
  insert_user_profile_one?: Maybe<User_Profile>;
  /** insert data into the table: "user_provider_identifier" */
  insert_user_provider_identifier?: Maybe<User_Provider_Identifier_Mutation_Response>;
  /** insert a single row into the table: "user_provider_identifier" */
  insert_user_provider_identifier_one?: Maybe<User_Provider_Identifier>;
  /** insert data into the table: "user_provider_identifier_v" */
  insert_user_provider_identifier_v?: Maybe<User_Provider_Identifier_V_Mutation_Response>;
  /** insert a single row into the table: "user_provider_identifier_v" */
  insert_user_provider_identifier_v_one?: Maybe<User_Provider_Identifier_V>;
  /** update data of the table: "app_user" */
  update_app_user?: Maybe<App_User_Mutation_Response>;
  /** update single row of the table: "app_user" */
  update_app_user_by_pk?: Maybe<App_User>;
  /** update multiples rows of table: "app_user" */
  update_app_user_many?: Maybe<Array<Maybe<App_User_Mutation_Response>>>;
  /** update data of the table: "app_user_v" */
  update_app_user_v?: Maybe<App_User_V_Mutation_Response>;
  /** update multiples rows of table: "app_user_v" */
  update_app_user_v_many?: Maybe<Array<Maybe<App_User_V_Mutation_Response>>>;
  /** update data of the table: "bootstrap_event" */
  update_bootstrap_event?: Maybe<Bootstrap_Event_Mutation_Response>;
  /** update single row of the table: "bootstrap_event" */
  update_bootstrap_event_by_pk?: Maybe<Bootstrap_Event>;
  /** update multiples rows of table: "bootstrap_event" */
  update_bootstrap_event_many?: Maybe<Array<Maybe<Bootstrap_Event_Mutation_Response>>>;
  /** update data of the table: "capability" */
  update_capability?: Maybe<Capability_Mutation_Response>;
  /** update single row of the table: "capability" */
  update_capability_by_pk?: Maybe<Capability>;
  /** update multiples rows of table: "capability" */
  update_capability_many?: Maybe<Array<Maybe<Capability_Mutation_Response>>>;
  /** update data of the table: "clinic" */
  update_clinic?: Maybe<Clinic_Mutation_Response>;
  /** update single row of the table: "clinic" */
  update_clinic_by_pk?: Maybe<Clinic>;
  /** update data of the table: "clinic_hours" */
  update_clinic_hours?: Maybe<Clinic_Hours_Mutation_Response>;
  /** update single row of the table: "clinic_hours" */
  update_clinic_hours_by_pk?: Maybe<Clinic_Hours>;
  /** update multiples rows of table: "clinic_hours" */
  update_clinic_hours_many?: Maybe<Array<Maybe<Clinic_Hours_Mutation_Response>>>;
  /** update data of the table: "clinic_hours_v" */
  update_clinic_hours_v?: Maybe<Clinic_Hours_V_Mutation_Response>;
  /** update multiples rows of table: "clinic_hours_v" */
  update_clinic_hours_v_many?: Maybe<Array<Maybe<Clinic_Hours_V_Mutation_Response>>>;
  /** update multiples rows of table: "clinic" */
  update_clinic_many?: Maybe<Array<Maybe<Clinic_Mutation_Response>>>;
  /** update data of the table: "clinic_user" */
  update_clinic_user?: Maybe<Clinic_User_Mutation_Response>;
  /** update single row of the table: "clinic_user" */
  update_clinic_user_by_pk?: Maybe<Clinic_User>;
  /** update multiples rows of table: "clinic_user" */
  update_clinic_user_many?: Maybe<Array<Maybe<Clinic_User_Mutation_Response>>>;
  /** update data of the table: "clinic_user_role" */
  update_clinic_user_role?: Maybe<Clinic_User_Role_Mutation_Response>;
  /** update single row of the table: "clinic_user_role" */
  update_clinic_user_role_by_pk?: Maybe<Clinic_User_Role>;
  /** update multiples rows of table: "clinic_user_role" */
  update_clinic_user_role_many?: Maybe<Array<Maybe<Clinic_User_Role_Mutation_Response>>>;
  /** update data of the table: "clinic_user_v" */
  update_clinic_user_v?: Maybe<Clinic_User_V_Mutation_Response>;
  /** update multiples rows of table: "clinic_user_v" */
  update_clinic_user_v_many?: Maybe<Array<Maybe<Clinic_User_V_Mutation_Response>>>;
  /** update data of the table: "clinic_v" */
  update_clinic_v?: Maybe<Clinic_V_Mutation_Response>;
  /** update multiples rows of table: "clinic_v" */
  update_clinic_v_many?: Maybe<Array<Maybe<Clinic_V_Mutation_Response>>>;
  /** update data of the table: "operatory" */
  update_operatory?: Maybe<Operatory_Mutation_Response>;
  /** update single row of the table: "operatory" */
  update_operatory_by_pk?: Maybe<Operatory>;
  /** update multiples rows of table: "operatory" */
  update_operatory_many?: Maybe<Array<Maybe<Operatory_Mutation_Response>>>;
  /** update data of the table: "operatory_v" */
  update_operatory_v?: Maybe<Operatory_V_Mutation_Response>;
  /** update multiples rows of table: "operatory_v" */
  update_operatory_v_many?: Maybe<Array<Maybe<Operatory_V_Mutation_Response>>>;
  /** update data of the table: "role" */
  update_role?: Maybe<Role_Mutation_Response>;
  /** update single row of the table: "role" */
  update_role_by_pk?: Maybe<Role>;
  /** update data of the table: "role_capability" */
  update_role_capability?: Maybe<Role_Capability_Mutation_Response>;
  /** update single row of the table: "role_capability" */
  update_role_capability_by_pk?: Maybe<Role_Capability>;
  /** update multiples rows of table: "role_capability" */
  update_role_capability_many?: Maybe<Array<Maybe<Role_Capability_Mutation_Response>>>;
  /** update multiples rows of table: "role" */
  update_role_many?: Maybe<Array<Maybe<Role_Mutation_Response>>>;
  /** update data of the table: "role_v" */
  update_role_v?: Maybe<Role_V_Mutation_Response>;
  /** update multiples rows of table: "role_v" */
  update_role_v_many?: Maybe<Array<Maybe<Role_V_Mutation_Response>>>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** update data of the table: "user_capability_override" */
  update_user_capability_override?: Maybe<User_Capability_Override_Mutation_Response>;
  /** update single row of the table: "user_capability_override" */
  update_user_capability_override_by_pk?: Maybe<User_Capability_Override>;
  /** update multiples rows of table: "user_capability_override" */
  update_user_capability_override_many?: Maybe<Array<Maybe<User_Capability_Override_Mutation_Response>>>;
  /** update multiples rows of table: "user" */
  update_user_many?: Maybe<Array<Maybe<User_Mutation_Response>>>;
  /** update data of the table: "user_profile" */
  update_user_profile?: Maybe<User_Profile_Mutation_Response>;
  /** update single row of the table: "user_profile" */
  update_user_profile_by_pk?: Maybe<User_Profile>;
  /** update multiples rows of table: "user_profile" */
  update_user_profile_many?: Maybe<Array<Maybe<User_Profile_Mutation_Response>>>;
  /** update data of the table: "user_provider_identifier" */
  update_user_provider_identifier?: Maybe<User_Provider_Identifier_Mutation_Response>;
  /** update single row of the table: "user_provider_identifier" */
  update_user_provider_identifier_by_pk?: Maybe<User_Provider_Identifier>;
  /** update multiples rows of table: "user_provider_identifier" */
  update_user_provider_identifier_many?: Maybe<Array<Maybe<User_Provider_Identifier_Mutation_Response>>>;
  /** update data of the table: "user_provider_identifier_v" */
  update_user_provider_identifier_v?: Maybe<User_Provider_Identifier_V_Mutation_Response>;
  /** update multiples rows of table: "user_provider_identifier_v" */
  update_user_provider_identifier_v_many?: Maybe<Array<Maybe<User_Provider_Identifier_V_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_App_UserArgs = {
  where: App_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_App_User_VArgs = {
  where: App_User_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bootstrap_EventArgs = {
  where: Bootstrap_Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Bootstrap_Event_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CapabilityArgs = {
  where: Capability_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Capability_By_PkArgs = {
  key: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ClinicArgs = {
  where: Clinic_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clinic_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Clinic_HoursArgs = {
  where: Clinic_Hours_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clinic_Hours_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Clinic_Hours_VArgs = {
  where: Clinic_Hours_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clinic_UserArgs = {
  where: Clinic_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clinic_User_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Clinic_User_RoleArgs = {
  where: Clinic_User_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clinic_User_Role_By_PkArgs = {
  clinic_user_id: Scalars['bigint']['input'];
  role_id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Clinic_User_VArgs = {
  where: Clinic_User_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Clinic_VArgs = {
  where: Clinic_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_OperatoryArgs = {
  where: Operatory_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Operatory_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Operatory_VArgs = {
  where: Operatory_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_RoleArgs = {
  where: Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Role_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Role_CapabilityArgs = {
  where: Role_Capability_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Role_Capability_By_PkArgs = {
  capability_key: Scalars['String']['input'];
  role_id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Role_VArgs = {
  where: Role_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_User_Capability_OverrideArgs = {
  where: User_Capability_Override_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Capability_Override_By_PkArgs = {
  capability_key: Scalars['String']['input'];
  clinic_user_id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_User_ProfileArgs = {
  where: User_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Profile_By_PkArgs = {
  user_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_User_Provider_IdentifierArgs = {
  where: User_Provider_Identifier_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Provider_Identifier_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_User_Provider_Identifier_VArgs = {
  where: User_Provider_Identifier_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootFn_Bootstrap_SystemArgs = {
  args: Fn_Bootstrap_System_Args;
  distinct_on?: InputMaybe<Array<Bootstrap_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Bootstrap_Event_Order_By>>;
  where?: InputMaybe<Bootstrap_Event_Bool_Exp>;
};


/** mutation root */
export type Mutation_RootInsert_App_UserArgs = {
  objects: Array<App_User_Insert_Input>;
  on_conflict?: InputMaybe<App_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_User_OneArgs = {
  object: App_User_Insert_Input;
  on_conflict?: InputMaybe<App_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_User_VArgs = {
  objects: Array<App_User_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_App_User_V_OneArgs = {
  object: App_User_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Bootstrap_EventArgs = {
  objects: Array<Bootstrap_Event_Insert_Input>;
  on_conflict?: InputMaybe<Bootstrap_Event_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Bootstrap_Event_OneArgs = {
  object: Bootstrap_Event_Insert_Input;
  on_conflict?: InputMaybe<Bootstrap_Event_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CapabilityArgs = {
  objects: Array<Capability_Insert_Input>;
  on_conflict?: InputMaybe<Capability_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Capability_OneArgs = {
  object: Capability_Insert_Input;
  on_conflict?: InputMaybe<Capability_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ClinicArgs = {
  objects: Array<Clinic_Insert_Input>;
  on_conflict?: InputMaybe<Clinic_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_HoursArgs = {
  objects: Array<Clinic_Hours_Insert_Input>;
  on_conflict?: InputMaybe<Clinic_Hours_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_Hours_OneArgs = {
  object: Clinic_Hours_Insert_Input;
  on_conflict?: InputMaybe<Clinic_Hours_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_Hours_VArgs = {
  objects: Array<Clinic_Hours_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_Hours_V_OneArgs = {
  object: Clinic_Hours_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_OneArgs = {
  object: Clinic_Insert_Input;
  on_conflict?: InputMaybe<Clinic_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_UserArgs = {
  objects: Array<Clinic_User_Insert_Input>;
  on_conflict?: InputMaybe<Clinic_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_User_OneArgs = {
  object: Clinic_User_Insert_Input;
  on_conflict?: InputMaybe<Clinic_User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_User_RoleArgs = {
  objects: Array<Clinic_User_Role_Insert_Input>;
  on_conflict?: InputMaybe<Clinic_User_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_User_Role_OneArgs = {
  object: Clinic_User_Role_Insert_Input;
  on_conflict?: InputMaybe<Clinic_User_Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_User_VArgs = {
  objects: Array<Clinic_User_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_User_V_OneArgs = {
  object: Clinic_User_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_VArgs = {
  objects: Array<Clinic_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Clinic_V_OneArgs = {
  object: Clinic_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_OperatoryArgs = {
  objects: Array<Operatory_Insert_Input>;
  on_conflict?: InputMaybe<Operatory_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Operatory_OneArgs = {
  object: Operatory_Insert_Input;
  on_conflict?: InputMaybe<Operatory_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Operatory_VArgs = {
  objects: Array<Operatory_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Operatory_V_OneArgs = {
  object: Operatory_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_RoleArgs = {
  objects: Array<Role_Insert_Input>;
  on_conflict?: InputMaybe<Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Role_CapabilityArgs = {
  objects: Array<Role_Capability_Insert_Input>;
  on_conflict?: InputMaybe<Role_Capability_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Role_Capability_OneArgs = {
  object: Role_Capability_Insert_Input;
  on_conflict?: InputMaybe<Role_Capability_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Role_OneArgs = {
  object: Role_Insert_Input;
  on_conflict?: InputMaybe<Role_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Role_VArgs = {
  objects: Array<Role_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Role_V_OneArgs = {
  object: Role_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Capability_OverrideArgs = {
  objects: Array<User_Capability_Override_Insert_Input>;
  on_conflict?: InputMaybe<User_Capability_Override_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Capability_Override_OneArgs = {
  object: User_Capability_Override_Insert_Input;
  on_conflict?: InputMaybe<User_Capability_Override_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_ProfileArgs = {
  objects: Array<User_Profile_Insert_Input>;
  on_conflict?: InputMaybe<User_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Profile_OneArgs = {
  object: User_Profile_Insert_Input;
  on_conflict?: InputMaybe<User_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Provider_IdentifierArgs = {
  objects: Array<User_Provider_Identifier_Insert_Input>;
  on_conflict?: InputMaybe<User_Provider_Identifier_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Provider_Identifier_OneArgs = {
  object: User_Provider_Identifier_Insert_Input;
  on_conflict?: InputMaybe<User_Provider_Identifier_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Provider_Identifier_VArgs = {
  objects: Array<User_Provider_Identifier_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_User_Provider_Identifier_V_OneArgs = {
  object: User_Provider_Identifier_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_UserArgs = {
  _inc?: InputMaybe<App_User_Inc_Input>;
  _set?: InputMaybe<App_User_Set_Input>;
  where: App_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_User_By_PkArgs = {
  _inc?: InputMaybe<App_User_Inc_Input>;
  _set?: InputMaybe<App_User_Set_Input>;
  pk_columns: App_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_App_User_ManyArgs = {
  updates: Array<App_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_App_User_VArgs = {
  _inc?: InputMaybe<App_User_V_Inc_Input>;
  _set?: InputMaybe<App_User_V_Set_Input>;
  where: App_User_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_User_V_ManyArgs = {
  updates: Array<App_User_V_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Bootstrap_EventArgs = {
  _inc?: InputMaybe<Bootstrap_Event_Inc_Input>;
  _set?: InputMaybe<Bootstrap_Event_Set_Input>;
  where: Bootstrap_Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Bootstrap_Event_By_PkArgs = {
  _inc?: InputMaybe<Bootstrap_Event_Inc_Input>;
  _set?: InputMaybe<Bootstrap_Event_Set_Input>;
  pk_columns: Bootstrap_Event_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Bootstrap_Event_ManyArgs = {
  updates: Array<Bootstrap_Event_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CapabilityArgs = {
  _set?: InputMaybe<Capability_Set_Input>;
  where: Capability_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Capability_By_PkArgs = {
  _set?: InputMaybe<Capability_Set_Input>;
  pk_columns: Capability_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Capability_ManyArgs = {
  updates: Array<Capability_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ClinicArgs = {
  _inc?: InputMaybe<Clinic_Inc_Input>;
  _set?: InputMaybe<Clinic_Set_Input>;
  where: Clinic_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_By_PkArgs = {
  _inc?: InputMaybe<Clinic_Inc_Input>;
  _set?: InputMaybe<Clinic_Set_Input>;
  pk_columns: Clinic_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_HoursArgs = {
  _inc?: InputMaybe<Clinic_Hours_Inc_Input>;
  _set?: InputMaybe<Clinic_Hours_Set_Input>;
  where: Clinic_Hours_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_Hours_By_PkArgs = {
  _inc?: InputMaybe<Clinic_Hours_Inc_Input>;
  _set?: InputMaybe<Clinic_Hours_Set_Input>;
  pk_columns: Clinic_Hours_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_Hours_ManyArgs = {
  updates: Array<Clinic_Hours_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_Hours_VArgs = {
  _inc?: InputMaybe<Clinic_Hours_V_Inc_Input>;
  _set?: InputMaybe<Clinic_Hours_V_Set_Input>;
  where: Clinic_Hours_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_Hours_V_ManyArgs = {
  updates: Array<Clinic_Hours_V_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_ManyArgs = {
  updates: Array<Clinic_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_UserArgs = {
  _inc?: InputMaybe<Clinic_User_Inc_Input>;
  _set?: InputMaybe<Clinic_User_Set_Input>;
  where: Clinic_User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_User_By_PkArgs = {
  _inc?: InputMaybe<Clinic_User_Inc_Input>;
  _set?: InputMaybe<Clinic_User_Set_Input>;
  pk_columns: Clinic_User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_User_ManyArgs = {
  updates: Array<Clinic_User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_User_RoleArgs = {
  _inc?: InputMaybe<Clinic_User_Role_Inc_Input>;
  _set?: InputMaybe<Clinic_User_Role_Set_Input>;
  where: Clinic_User_Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_User_Role_By_PkArgs = {
  _inc?: InputMaybe<Clinic_User_Role_Inc_Input>;
  _set?: InputMaybe<Clinic_User_Role_Set_Input>;
  pk_columns: Clinic_User_Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_User_Role_ManyArgs = {
  updates: Array<Clinic_User_Role_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_User_VArgs = {
  _inc?: InputMaybe<Clinic_User_V_Inc_Input>;
  _set?: InputMaybe<Clinic_User_V_Set_Input>;
  where: Clinic_User_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_User_V_ManyArgs = {
  updates: Array<Clinic_User_V_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_VArgs = {
  _inc?: InputMaybe<Clinic_V_Inc_Input>;
  _set?: InputMaybe<Clinic_V_Set_Input>;
  where: Clinic_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Clinic_V_ManyArgs = {
  updates: Array<Clinic_V_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_OperatoryArgs = {
  _inc?: InputMaybe<Operatory_Inc_Input>;
  _set?: InputMaybe<Operatory_Set_Input>;
  where: Operatory_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Operatory_By_PkArgs = {
  _inc?: InputMaybe<Operatory_Inc_Input>;
  _set?: InputMaybe<Operatory_Set_Input>;
  pk_columns: Operatory_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Operatory_ManyArgs = {
  updates: Array<Operatory_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Operatory_VArgs = {
  _inc?: InputMaybe<Operatory_V_Inc_Input>;
  _set?: InputMaybe<Operatory_V_Set_Input>;
  where: Operatory_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Operatory_V_ManyArgs = {
  updates: Array<Operatory_V_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_RoleArgs = {
  _inc?: InputMaybe<Role_Inc_Input>;
  _set?: InputMaybe<Role_Set_Input>;
  where: Role_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Role_By_PkArgs = {
  _inc?: InputMaybe<Role_Inc_Input>;
  _set?: InputMaybe<Role_Set_Input>;
  pk_columns: Role_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Role_CapabilityArgs = {
  _inc?: InputMaybe<Role_Capability_Inc_Input>;
  _set?: InputMaybe<Role_Capability_Set_Input>;
  where: Role_Capability_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Role_Capability_By_PkArgs = {
  _inc?: InputMaybe<Role_Capability_Inc_Input>;
  _set?: InputMaybe<Role_Capability_Set_Input>;
  pk_columns: Role_Capability_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Role_Capability_ManyArgs = {
  updates: Array<Role_Capability_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Role_ManyArgs = {
  updates: Array<Role_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Role_VArgs = {
  _inc?: InputMaybe<Role_V_Inc_Input>;
  _set?: InputMaybe<Role_V_Set_Input>;
  where: Role_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Role_V_ManyArgs = {
  updates: Array<Role_V_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Capability_OverrideArgs = {
  _inc?: InputMaybe<User_Capability_Override_Inc_Input>;
  _set?: InputMaybe<User_Capability_Override_Set_Input>;
  where: User_Capability_Override_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Capability_Override_By_PkArgs = {
  _inc?: InputMaybe<User_Capability_Override_Inc_Input>;
  _set?: InputMaybe<User_Capability_Override_Set_Input>;
  pk_columns: User_Capability_Override_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Capability_Override_ManyArgs = {
  updates: Array<User_Capability_Override_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_User_ManyArgs = {
  updates: Array<User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_User_ProfileArgs = {
  _set?: InputMaybe<User_Profile_Set_Input>;
  where: User_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Profile_By_PkArgs = {
  _set?: InputMaybe<User_Profile_Set_Input>;
  pk_columns: User_Profile_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Profile_ManyArgs = {
  updates: Array<User_Profile_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_User_Provider_IdentifierArgs = {
  _inc?: InputMaybe<User_Provider_Identifier_Inc_Input>;
  _set?: InputMaybe<User_Provider_Identifier_Set_Input>;
  where: User_Provider_Identifier_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Provider_Identifier_By_PkArgs = {
  _inc?: InputMaybe<User_Provider_Identifier_Inc_Input>;
  _set?: InputMaybe<User_Provider_Identifier_Set_Input>;
  pk_columns: User_Provider_Identifier_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Provider_Identifier_ManyArgs = {
  updates: Array<User_Provider_Identifier_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_User_Provider_Identifier_VArgs = {
  _inc?: InputMaybe<User_Provider_Identifier_V_Inc_Input>;
  _set?: InputMaybe<User_Provider_Identifier_V_Set_Input>;
  where: User_Provider_Identifier_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Provider_Identifier_V_ManyArgs = {
  updates: Array<User_Provider_Identifier_V_Updates>;
};

/** columns and relationships of "operatory" */
export type Operatory = {
  __typename?: 'operatory';
  clinic_id: Scalars['bigint']['output'];
  color: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  is_bookable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "operatory" */
export type Operatory_Aggregate = {
  __typename?: 'operatory_aggregate';
  aggregate?: Maybe<Operatory_Aggregate_Fields>;
  nodes: Array<Operatory>;
};

/** aggregate fields of "operatory" */
export type Operatory_Aggregate_Fields = {
  __typename?: 'operatory_aggregate_fields';
  avg?: Maybe<Operatory_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Operatory_Max_Fields>;
  min?: Maybe<Operatory_Min_Fields>;
  stddev?: Maybe<Operatory_Stddev_Fields>;
  stddev_pop?: Maybe<Operatory_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Operatory_Stddev_Samp_Fields>;
  sum?: Maybe<Operatory_Sum_Fields>;
  var_pop?: Maybe<Operatory_Var_Pop_Fields>;
  var_samp?: Maybe<Operatory_Var_Samp_Fields>;
  variance?: Maybe<Operatory_Variance_Fields>;
};


/** aggregate fields of "operatory" */
export type Operatory_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Operatory_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Operatory_Avg_Fields = {
  __typename?: 'operatory_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "operatory". All fields are combined with a logical 'AND'. */
export type Operatory_Bool_Exp = {
  _and?: InputMaybe<Array<Operatory_Bool_Exp>>;
  _not?: InputMaybe<Operatory_Bool_Exp>;
  _or?: InputMaybe<Array<Operatory_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  color?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_bookable?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "operatory" */
export type Operatory_Constraint =
  /** unique or primary key constraint on columns "clinic_id", "name" */
  | 'operatory_clinic_id_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'operatory_pkey';

/** input type for incrementing numeric columns in table "operatory" */
export type Operatory_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "operatory" */
export type Operatory_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_bookable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Operatory_Max_Fields = {
  __typename?: 'operatory_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Operatory_Min_Fields = {
  __typename?: 'operatory_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "operatory" */
export type Operatory_Mutation_Response = {
  __typename?: 'operatory_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Operatory>;
};

/** on_conflict condition type for table "operatory" */
export type Operatory_On_Conflict = {
  constraint: Operatory_Constraint;
  update_columns?: Array<Operatory_Update_Column>;
  where?: InputMaybe<Operatory_Bool_Exp>;
};

/** Ordering options when selecting data from "operatory". */
export type Operatory_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  color?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_bookable?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: operatory */
export type Operatory_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "operatory" */
export type Operatory_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'color'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_bookable'
  /** column name */
  | 'name'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "operatory" */
export type Operatory_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_bookable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Operatory_Stddev_Fields = {
  __typename?: 'operatory_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Operatory_Stddev_Pop_Fields = {
  __typename?: 'operatory_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Operatory_Stddev_Samp_Fields = {
  __typename?: 'operatory_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "operatory" */
export type Operatory_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Operatory_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Operatory_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_bookable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Operatory_Sum_Fields = {
  __typename?: 'operatory_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "operatory" */
export type Operatory_Update_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'color'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_bookable'
  /** column name */
  | 'name'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Operatory_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Operatory_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Operatory_Set_Input>;
  /** filter the rows which have to be updated */
  where: Operatory_Bool_Exp;
};

/** columns and relationships of "operatory_v" */
export type Operatory_V = {
  __typename?: 'operatory_v';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  is_bookable?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "operatory_v" */
export type Operatory_V_Aggregate = {
  __typename?: 'operatory_v_aggregate';
  aggregate?: Maybe<Operatory_V_Aggregate_Fields>;
  nodes: Array<Operatory_V>;
};

/** aggregate fields of "operatory_v" */
export type Operatory_V_Aggregate_Fields = {
  __typename?: 'operatory_v_aggregate_fields';
  avg?: Maybe<Operatory_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Operatory_V_Max_Fields>;
  min?: Maybe<Operatory_V_Min_Fields>;
  stddev?: Maybe<Operatory_V_Stddev_Fields>;
  stddev_pop?: Maybe<Operatory_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Operatory_V_Stddev_Samp_Fields>;
  sum?: Maybe<Operatory_V_Sum_Fields>;
  var_pop?: Maybe<Operatory_V_Var_Pop_Fields>;
  var_samp?: Maybe<Operatory_V_Var_Samp_Fields>;
  variance?: Maybe<Operatory_V_Variance_Fields>;
};


/** aggregate fields of "operatory_v" */
export type Operatory_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Operatory_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Operatory_V_Avg_Fields = {
  __typename?: 'operatory_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "operatory_v". All fields are combined with a logical 'AND'. */
export type Operatory_V_Bool_Exp = {
  _and?: InputMaybe<Array<Operatory_V_Bool_Exp>>;
  _not?: InputMaybe<Operatory_V_Bool_Exp>;
  _or?: InputMaybe<Array<Operatory_V_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  color?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_bookable?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "operatory_v" */
export type Operatory_V_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "operatory_v" */
export type Operatory_V_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_bookable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Operatory_V_Max_Fields = {
  __typename?: 'operatory_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Operatory_V_Min_Fields = {
  __typename?: 'operatory_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "operatory_v" */
export type Operatory_V_Mutation_Response = {
  __typename?: 'operatory_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Operatory_V>;
};

/** Ordering options when selecting data from "operatory_v". */
export type Operatory_V_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  color?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_bookable?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** select columns of table "operatory_v" */
export type Operatory_V_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'color'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_bookable'
  /** column name */
  | 'name'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "operatory_v" */
export type Operatory_V_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_bookable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Operatory_V_Stddev_Fields = {
  __typename?: 'operatory_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Operatory_V_Stddev_Pop_Fields = {
  __typename?: 'operatory_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Operatory_V_Stddev_Samp_Fields = {
  __typename?: 'operatory_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "operatory_v" */
export type Operatory_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Operatory_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Operatory_V_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_bookable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Operatory_V_Sum_Fields = {
  __typename?: 'operatory_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

export type Operatory_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Operatory_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Operatory_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: Operatory_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Operatory_V_Var_Pop_Fields = {
  __typename?: 'operatory_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Operatory_V_Var_Samp_Fields = {
  __typename?: 'operatory_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Operatory_V_Variance_Fields = {
  __typename?: 'operatory_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_pop on columns */
export type Operatory_Var_Pop_Fields = {
  __typename?: 'operatory_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Operatory_Var_Samp_Fields = {
  __typename?: 'operatory_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Operatory_Variance_Fields = {
  __typename?: 'operatory_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | 'asc'
  /** in ascending order, nulls first */
  | 'asc_nulls_first'
  /** in ascending order, nulls last */
  | 'asc_nulls_last'
  /** in descending order, nulls first */
  | 'desc'
  /** in descending order, nulls first */
  | 'desc_nulls_first'
  /** in descending order, nulls last */
  | 'desc_nulls_last';

/** Boolean expression to compare columns of type "override_effect". All fields are combined with logical 'AND'. */
export type Override_Effect_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['override_effect']['input']>;
  _gt?: InputMaybe<Scalars['override_effect']['input']>;
  _gte?: InputMaybe<Scalars['override_effect']['input']>;
  _in?: InputMaybe<Array<Scalars['override_effect']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['override_effect']['input']>;
  _lte?: InputMaybe<Scalars['override_effect']['input']>;
  _neq?: InputMaybe<Scalars['override_effect']['input']>;
  _nin?: InputMaybe<Array<Scalars['override_effect']['input']>>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "app_user" */
  app_user: Array<App_User>;
  /** fetch aggregated fields from the table: "app_user" */
  app_user_aggregate: App_User_Aggregate;
  /** fetch data from the table: "app_user" using primary key columns */
  app_user_by_pk?: Maybe<App_User>;
  /** fetch data from the table: "app_user_v" */
  app_user_v: Array<App_User_V>;
  /** fetch aggregated fields from the table: "app_user_v" */
  app_user_v_aggregate: App_User_V_Aggregate;
  /** fetch data from the table: "bootstrap_event" */
  bootstrap_event: Array<Bootstrap_Event>;
  /** fetch aggregated fields from the table: "bootstrap_event" */
  bootstrap_event_aggregate: Bootstrap_Event_Aggregate;
  /** fetch data from the table: "bootstrap_event" using primary key columns */
  bootstrap_event_by_pk?: Maybe<Bootstrap_Event>;
  /** fetch data from the table: "capability" */
  capability: Array<Capability>;
  /** fetch aggregated fields from the table: "capability" */
  capability_aggregate: Capability_Aggregate;
  /** fetch data from the table: "capability" using primary key columns */
  capability_by_pk?: Maybe<Capability>;
  /** fetch data from the table: "clinic" */
  clinic: Array<Clinic>;
  /** fetch aggregated fields from the table: "clinic" */
  clinic_aggregate: Clinic_Aggregate;
  /** fetch data from the table: "clinic" using primary key columns */
  clinic_by_pk?: Maybe<Clinic>;
  /** fetch data from the table: "clinic_hours" */
  clinic_hours: Array<Clinic_Hours>;
  /** fetch aggregated fields from the table: "clinic_hours" */
  clinic_hours_aggregate: Clinic_Hours_Aggregate;
  /** fetch data from the table: "clinic_hours" using primary key columns */
  clinic_hours_by_pk?: Maybe<Clinic_Hours>;
  /** fetch data from the table: "clinic_hours_v" */
  clinic_hours_v: Array<Clinic_Hours_V>;
  /** fetch aggregated fields from the table: "clinic_hours_v" */
  clinic_hours_v_aggregate: Clinic_Hours_V_Aggregate;
  /** fetch data from the table: "clinic_user" */
  clinic_user: Array<Clinic_User>;
  /** fetch aggregated fields from the table: "clinic_user" */
  clinic_user_aggregate: Clinic_User_Aggregate;
  /** fetch data from the table: "clinic_user" using primary key columns */
  clinic_user_by_pk?: Maybe<Clinic_User>;
  /** fetch data from the table: "clinic_user_effective_capabilities_v" */
  clinic_user_effective_capabilities_v: Array<Clinic_User_Effective_Capabilities_V>;
  /** fetch aggregated fields from the table: "clinic_user_effective_capabilities_v" */
  clinic_user_effective_capabilities_v_aggregate: Clinic_User_Effective_Capabilities_V_Aggregate;
  /** fetch data from the table: "clinic_user_role" */
  clinic_user_role: Array<Clinic_User_Role>;
  /** fetch aggregated fields from the table: "clinic_user_role" */
  clinic_user_role_aggregate: Clinic_User_Role_Aggregate;
  /** fetch data from the table: "clinic_user_role" using primary key columns */
  clinic_user_role_by_pk?: Maybe<Clinic_User_Role>;
  /** fetch data from the table: "clinic_user_v" */
  clinic_user_v: Array<Clinic_User_V>;
  /** fetch aggregated fields from the table: "clinic_user_v" */
  clinic_user_v_aggregate: Clinic_User_V_Aggregate;
  /** fetch data from the table: "clinic_user_with_profile_v" */
  clinic_user_with_profile_v: Array<Clinic_User_With_Profile_V>;
  /** fetch aggregated fields from the table: "clinic_user_with_profile_v" */
  clinic_user_with_profile_v_aggregate: Clinic_User_With_Profile_V_Aggregate;
  /** fetch data from the table: "clinic_v" */
  clinic_v: Array<Clinic_V>;
  /** fetch aggregated fields from the table: "clinic_v" */
  clinic_v_aggregate: Clinic_V_Aggregate;
  /** fetch data from the table: "operatory" */
  operatory: Array<Operatory>;
  /** fetch aggregated fields from the table: "operatory" */
  operatory_aggregate: Operatory_Aggregate;
  /** fetch data from the table: "operatory" using primary key columns */
  operatory_by_pk?: Maybe<Operatory>;
  /** fetch data from the table: "operatory_v" */
  operatory_v: Array<Operatory_V>;
  /** fetch aggregated fields from the table: "operatory_v" */
  operatory_v_aggregate: Operatory_V_Aggregate;
  /** fetch data from the table: "role" */
  role: Array<Role>;
  /** fetch aggregated fields from the table: "role" */
  role_aggregate: Role_Aggregate;
  /** fetch data from the table: "role" using primary key columns */
  role_by_pk?: Maybe<Role>;
  /** fetch data from the table: "role_capability" */
  role_capability: Array<Role_Capability>;
  /** fetch aggregated fields from the table: "role_capability" */
  role_capability_aggregate: Role_Capability_Aggregate;
  /** fetch data from the table: "role_capability" using primary key columns */
  role_capability_by_pk?: Maybe<Role_Capability>;
  /** fetch data from the table: "role_v" */
  role_v: Array<Role_V>;
  /** fetch aggregated fields from the table: "role_v" */
  role_v_aggregate: Role_V_Aggregate;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "user_capability_override" */
  user_capability_override: Array<User_Capability_Override>;
  /** fetch aggregated fields from the table: "user_capability_override" */
  user_capability_override_aggregate: User_Capability_Override_Aggregate;
  /** fetch data from the table: "user_capability_override" using primary key columns */
  user_capability_override_by_pk?: Maybe<User_Capability_Override>;
  /** fetch data from the table: "user_profile" */
  user_profile: Array<User_Profile>;
  /** fetch aggregated fields from the table: "user_profile" */
  user_profile_aggregate: User_Profile_Aggregate;
  /** fetch data from the table: "user_profile" using primary key columns */
  user_profile_by_pk?: Maybe<User_Profile>;
  /** fetch data from the table: "user_provider_identifier" */
  user_provider_identifier: Array<User_Provider_Identifier>;
  /** fetch aggregated fields from the table: "user_provider_identifier" */
  user_provider_identifier_aggregate: User_Provider_Identifier_Aggregate;
  /** fetch data from the table: "user_provider_identifier" using primary key columns */
  user_provider_identifier_by_pk?: Maybe<User_Provider_Identifier>;
  /** fetch data from the table: "user_provider_identifier_v" */
  user_provider_identifier_v: Array<User_Provider_Identifier_V>;
  /** fetch aggregated fields from the table: "user_provider_identifier_v" */
  user_provider_identifier_v_aggregate: User_Provider_Identifier_V_Aggregate;
};


export type Query_RootApp_UserArgs = {
  distinct_on?: InputMaybe<Array<App_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_Order_By>>;
  where?: InputMaybe<App_User_Bool_Exp>;
};


export type Query_RootApp_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_Order_By>>;
  where?: InputMaybe<App_User_Bool_Exp>;
};


export type Query_RootApp_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootApp_User_VArgs = {
  distinct_on?: InputMaybe<Array<App_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_V_Order_By>>;
  where?: InputMaybe<App_User_V_Bool_Exp>;
};


export type Query_RootApp_User_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_V_Order_By>>;
  where?: InputMaybe<App_User_V_Bool_Exp>;
};


export type Query_RootBootstrap_EventArgs = {
  distinct_on?: InputMaybe<Array<Bootstrap_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Bootstrap_Event_Order_By>>;
  where?: InputMaybe<Bootstrap_Event_Bool_Exp>;
};


export type Query_RootBootstrap_Event_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bootstrap_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Bootstrap_Event_Order_By>>;
  where?: InputMaybe<Bootstrap_Event_Bool_Exp>;
};


export type Query_RootBootstrap_Event_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootCapabilityArgs = {
  distinct_on?: InputMaybe<Array<Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Capability_Order_By>>;
  where?: InputMaybe<Capability_Bool_Exp>;
};


export type Query_RootCapability_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Capability_Order_By>>;
  where?: InputMaybe<Capability_Bool_Exp>;
};


export type Query_RootCapability_By_PkArgs = {
  key: Scalars['String']['input'];
};


export type Query_RootClinicArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Order_By>>;
  where?: InputMaybe<Clinic_Bool_Exp>;
};


export type Query_RootClinic_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Order_By>>;
  where?: InputMaybe<Clinic_Bool_Exp>;
};


export type Query_RootClinic_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootClinic_HoursArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_Order_By>>;
  where?: InputMaybe<Clinic_Hours_Bool_Exp>;
};


export type Query_RootClinic_Hours_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_Order_By>>;
  where?: InputMaybe<Clinic_Hours_Bool_Exp>;
};


export type Query_RootClinic_Hours_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootClinic_Hours_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_V_Order_By>>;
  where?: InputMaybe<Clinic_Hours_V_Bool_Exp>;
};


export type Query_RootClinic_Hours_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_V_Order_By>>;
  where?: InputMaybe<Clinic_Hours_V_Bool_Exp>;
};


export type Query_RootClinic_UserArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Order_By>>;
  where?: InputMaybe<Clinic_User_Bool_Exp>;
};


export type Query_RootClinic_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Order_By>>;
  where?: InputMaybe<Clinic_User_Bool_Exp>;
};


export type Query_RootClinic_User_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootClinic_User_Effective_Capabilities_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Order_By>>;
  where?: InputMaybe<Clinic_User_Effective_Capabilities_V_Bool_Exp>;
};


export type Query_RootClinic_User_Effective_Capabilities_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Order_By>>;
  where?: InputMaybe<Clinic_User_Effective_Capabilities_V_Bool_Exp>;
};


export type Query_RootClinic_User_RoleArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Role_Order_By>>;
  where?: InputMaybe<Clinic_User_Role_Bool_Exp>;
};


export type Query_RootClinic_User_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Role_Order_By>>;
  where?: InputMaybe<Clinic_User_Role_Bool_Exp>;
};


export type Query_RootClinic_User_Role_By_PkArgs = {
  clinic_user_id: Scalars['bigint']['input'];
  role_id: Scalars['bigint']['input'];
};


export type Query_RootClinic_User_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_V_Order_By>>;
  where?: InputMaybe<Clinic_User_V_Bool_Exp>;
};


export type Query_RootClinic_User_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_V_Order_By>>;
  where?: InputMaybe<Clinic_User_V_Bool_Exp>;
};


export type Query_RootClinic_User_With_Profile_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_With_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_With_Profile_V_Order_By>>;
  where?: InputMaybe<Clinic_User_With_Profile_V_Bool_Exp>;
};


export type Query_RootClinic_User_With_Profile_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_With_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_With_Profile_V_Order_By>>;
  where?: InputMaybe<Clinic_User_With_Profile_V_Bool_Exp>;
};


export type Query_RootClinic_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_V_Order_By>>;
  where?: InputMaybe<Clinic_V_Bool_Exp>;
};


export type Query_RootClinic_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_V_Order_By>>;
  where?: InputMaybe<Clinic_V_Bool_Exp>;
};


export type Query_RootOperatoryArgs = {
  distinct_on?: InputMaybe<Array<Operatory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_Order_By>>;
  where?: InputMaybe<Operatory_Bool_Exp>;
};


export type Query_RootOperatory_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Operatory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_Order_By>>;
  where?: InputMaybe<Operatory_Bool_Exp>;
};


export type Query_RootOperatory_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootOperatory_VArgs = {
  distinct_on?: InputMaybe<Array<Operatory_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_V_Order_By>>;
  where?: InputMaybe<Operatory_V_Bool_Exp>;
};


export type Query_RootOperatory_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Operatory_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_V_Order_By>>;
  where?: InputMaybe<Operatory_V_Bool_Exp>;
};


export type Query_RootRoleArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Query_RootRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Query_RootRole_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootRole_CapabilityArgs = {
  distinct_on?: InputMaybe<Array<Role_Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Capability_Order_By>>;
  where?: InputMaybe<Role_Capability_Bool_Exp>;
};


export type Query_RootRole_Capability_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Capability_Order_By>>;
  where?: InputMaybe<Role_Capability_Bool_Exp>;
};


export type Query_RootRole_Capability_By_PkArgs = {
  capability_key: Scalars['String']['input'];
  role_id: Scalars['bigint']['input'];
};


export type Query_RootRole_VArgs = {
  distinct_on?: InputMaybe<Array<Role_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_V_Order_By>>;
  where?: InputMaybe<Role_V_Bool_Exp>;
};


export type Query_RootRole_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_V_Order_By>>;
  where?: InputMaybe<Role_V_Bool_Exp>;
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUser_Capability_OverrideArgs = {
  distinct_on?: InputMaybe<Array<User_Capability_Override_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Capability_Override_Order_By>>;
  where?: InputMaybe<User_Capability_Override_Bool_Exp>;
};


export type Query_RootUser_Capability_Override_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Capability_Override_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Capability_Override_Order_By>>;
  where?: InputMaybe<User_Capability_Override_Bool_Exp>;
};


export type Query_RootUser_Capability_Override_By_PkArgs = {
  capability_key: Scalars['String']['input'];
  clinic_user_id: Scalars['bigint']['input'];
};


export type Query_RootUser_ProfileArgs = {
  distinct_on?: InputMaybe<Array<User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Profile_Order_By>>;
  where?: InputMaybe<User_Profile_Bool_Exp>;
};


export type Query_RootUser_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Profile_Order_By>>;
  where?: InputMaybe<User_Profile_Bool_Exp>;
};


export type Query_RootUser_Profile_By_PkArgs = {
  user_id: Scalars['uuid']['input'];
};


export type Query_RootUser_Provider_IdentifierArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_Bool_Exp>;
};


export type Query_RootUser_Provider_Identifier_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_Bool_Exp>;
};


export type Query_RootUser_Provider_Identifier_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootUser_Provider_Identifier_VArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_V_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_V_Bool_Exp>;
};


export type Query_RootUser_Provider_Identifier_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_V_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_V_Bool_Exp>;
};

/** columns and relationships of "role" */
export type Role = {
  __typename?: 'role';
  clinic_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "role" */
export type Role_Aggregate = {
  __typename?: 'role_aggregate';
  aggregate?: Maybe<Role_Aggregate_Fields>;
  nodes: Array<Role>;
};

/** aggregate fields of "role" */
export type Role_Aggregate_Fields = {
  __typename?: 'role_aggregate_fields';
  avg?: Maybe<Role_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Role_Max_Fields>;
  min?: Maybe<Role_Min_Fields>;
  stddev?: Maybe<Role_Stddev_Fields>;
  stddev_pop?: Maybe<Role_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Role_Stddev_Samp_Fields>;
  sum?: Maybe<Role_Sum_Fields>;
  var_pop?: Maybe<Role_Var_Pop_Fields>;
  var_samp?: Maybe<Role_Var_Samp_Fields>;
  variance?: Maybe<Role_Variance_Fields>;
};


/** aggregate fields of "role" */
export type Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Role_Avg_Fields = {
  __typename?: 'role_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "role". All fields are combined with a logical 'AND'. */
export type Role_Bool_Exp = {
  _and?: InputMaybe<Array<Role_Bool_Exp>>;
  _not?: InputMaybe<Role_Bool_Exp>;
  _or?: InputMaybe<Array<Role_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** columns and relationships of "role_capability" */
export type Role_Capability = {
  __typename?: 'role_capability';
  capability_key: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  role_id: Scalars['bigint']['output'];
};

/** aggregated selection of "role_capability" */
export type Role_Capability_Aggregate = {
  __typename?: 'role_capability_aggregate';
  aggregate?: Maybe<Role_Capability_Aggregate_Fields>;
  nodes: Array<Role_Capability>;
};

/** aggregate fields of "role_capability" */
export type Role_Capability_Aggregate_Fields = {
  __typename?: 'role_capability_aggregate_fields';
  avg?: Maybe<Role_Capability_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Role_Capability_Max_Fields>;
  min?: Maybe<Role_Capability_Min_Fields>;
  stddev?: Maybe<Role_Capability_Stddev_Fields>;
  stddev_pop?: Maybe<Role_Capability_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Role_Capability_Stddev_Samp_Fields>;
  sum?: Maybe<Role_Capability_Sum_Fields>;
  var_pop?: Maybe<Role_Capability_Var_Pop_Fields>;
  var_samp?: Maybe<Role_Capability_Var_Samp_Fields>;
  variance?: Maybe<Role_Capability_Variance_Fields>;
};


/** aggregate fields of "role_capability" */
export type Role_Capability_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Role_Capability_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Role_Capability_Avg_Fields = {
  __typename?: 'role_capability_avg_fields';
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "role_capability". All fields are combined with a logical 'AND'. */
export type Role_Capability_Bool_Exp = {
  _and?: InputMaybe<Array<Role_Capability_Bool_Exp>>;
  _not?: InputMaybe<Role_Capability_Bool_Exp>;
  _or?: InputMaybe<Array<Role_Capability_Bool_Exp>>;
  capability_key?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  role_id?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "role_capability" */
export type Role_Capability_Constraint =
  /** unique or primary key constraint on columns "role_id", "capability_key" */
  | 'role_capability_pkey';

/** input type for incrementing numeric columns in table "role_capability" */
export type Role_Capability_Inc_Input = {
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "role_capability" */
export type Role_Capability_Insert_Input = {
  capability_key?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Role_Capability_Max_Fields = {
  __typename?: 'role_capability_max_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Role_Capability_Min_Fields = {
  __typename?: 'role_capability_min_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** response of any mutation on the table "role_capability" */
export type Role_Capability_Mutation_Response = {
  __typename?: 'role_capability_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Role_Capability>;
};

/** on_conflict condition type for table "role_capability" */
export type Role_Capability_On_Conflict = {
  constraint: Role_Capability_Constraint;
  update_columns?: Array<Role_Capability_Update_Column>;
  where?: InputMaybe<Role_Capability_Bool_Exp>;
};

/** Ordering options when selecting data from "role_capability". */
export type Role_Capability_Order_By = {
  capability_key?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: role_capability */
export type Role_Capability_Pk_Columns_Input = {
  capability_key: Scalars['String']['input'];
  role_id: Scalars['bigint']['input'];
};

/** select columns of table "role_capability" */
export type Role_Capability_Select_Column =
  /** column name */
  | 'capability_key'
  /** column name */
  | 'created_at'
  /** column name */
  | 'role_id';

/** input type for updating data in table "role_capability" */
export type Role_Capability_Set_Input = {
  capability_key?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Role_Capability_Stddev_Fields = {
  __typename?: 'role_capability_stddev_fields';
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Role_Capability_Stddev_Pop_Fields = {
  __typename?: 'role_capability_stddev_pop_fields';
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Role_Capability_Stddev_Samp_Fields = {
  __typename?: 'role_capability_stddev_samp_fields';
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "role_capability" */
export type Role_Capability_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Role_Capability_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Role_Capability_Stream_Cursor_Value_Input = {
  capability_key?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Role_Capability_Sum_Fields = {
  __typename?: 'role_capability_sum_fields';
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "role_capability" */
export type Role_Capability_Update_Column =
  /** column name */
  | 'capability_key'
  /** column name */
  | 'created_at'
  /** column name */
  | 'role_id';

export type Role_Capability_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Role_Capability_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Role_Capability_Set_Input>;
  /** filter the rows which have to be updated */
  where: Role_Capability_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Role_Capability_Var_Pop_Fields = {
  __typename?: 'role_capability_var_pop_fields';
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Role_Capability_Var_Samp_Fields = {
  __typename?: 'role_capability_var_samp_fields';
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Role_Capability_Variance_Fields = {
  __typename?: 'role_capability_variance_fields';
  role_id?: Maybe<Scalars['Float']['output']>;
};

/** unique or primary key constraints on table "role" */
export type Role_Constraint =
  /** unique or primary key constraint on columns "clinic_id", "name" */
  | 'role_clinic_id_name_key'
  /** unique or primary key constraint on columns "id" */
  | 'role_pkey';

/** input type for incrementing numeric columns in table "role" */
export type Role_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "role" */
export type Role_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Role_Max_Fields = {
  __typename?: 'role_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Role_Min_Fields = {
  __typename?: 'role_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "role" */
export type Role_Mutation_Response = {
  __typename?: 'role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Role>;
};

/** on_conflict condition type for table "role" */
export type Role_On_Conflict = {
  constraint: Role_Constraint;
  update_columns?: Array<Role_Update_Column>;
  where?: InputMaybe<Role_Bool_Exp>;
};

/** Ordering options when selecting data from "role". */
export type Role_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: role */
export type Role_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "role" */
export type Role_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name'
  /** column name */
  | 'updated_at';

/** input type for updating data in table "role" */
export type Role_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type Role_Stddev_Fields = {
  __typename?: 'role_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Role_Stddev_Pop_Fields = {
  __typename?: 'role_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Role_Stddev_Samp_Fields = {
  __typename?: 'role_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "role" */
export type Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Role_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type Role_Sum_Fields = {
  __typename?: 'role_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "role" */
export type Role_Update_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name'
  /** column name */
  | 'updated_at';

export type Role_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Role_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Role_Bool_Exp;
};

/** columns and relationships of "role_v" */
export type Role_V = {
  __typename?: 'role_v';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "role_v" */
export type Role_V_Aggregate = {
  __typename?: 'role_v_aggregate';
  aggregate?: Maybe<Role_V_Aggregate_Fields>;
  nodes: Array<Role_V>;
};

/** aggregate fields of "role_v" */
export type Role_V_Aggregate_Fields = {
  __typename?: 'role_v_aggregate_fields';
  avg?: Maybe<Role_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Role_V_Max_Fields>;
  min?: Maybe<Role_V_Min_Fields>;
  stddev?: Maybe<Role_V_Stddev_Fields>;
  stddev_pop?: Maybe<Role_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Role_V_Stddev_Samp_Fields>;
  sum?: Maybe<Role_V_Sum_Fields>;
  var_pop?: Maybe<Role_V_Var_Pop_Fields>;
  var_samp?: Maybe<Role_V_Var_Samp_Fields>;
  variance?: Maybe<Role_V_Variance_Fields>;
};


/** aggregate fields of "role_v" */
export type Role_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Role_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Role_V_Avg_Fields = {
  __typename?: 'role_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "role_v". All fields are combined with a logical 'AND'. */
export type Role_V_Bool_Exp = {
  _and?: InputMaybe<Array<Role_V_Bool_Exp>>;
  _not?: InputMaybe<Role_V_Bool_Exp>;
  _or?: InputMaybe<Array<Role_V_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "role_v" */
export type Role_V_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "role_v" */
export type Role_V_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Role_V_Max_Fields = {
  __typename?: 'role_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Role_V_Min_Fields = {
  __typename?: 'role_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "role_v" */
export type Role_V_Mutation_Response = {
  __typename?: 'role_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Role_V>;
};

/** Ordering options when selecting data from "role_v". */
export type Role_V_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** select columns of table "role_v" */
export type Role_V_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'description'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name';

/** input type for updating data in table "role_v" */
export type Role_V_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Role_V_Stddev_Fields = {
  __typename?: 'role_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Role_V_Stddev_Pop_Fields = {
  __typename?: 'role_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Role_V_Stddev_Samp_Fields = {
  __typename?: 'role_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "role_v" */
export type Role_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Role_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Role_V_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Role_V_Sum_Fields = {
  __typename?: 'role_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

export type Role_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Role_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Role_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: Role_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Role_V_Var_Pop_Fields = {
  __typename?: 'role_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Role_V_Var_Samp_Fields = {
  __typename?: 'role_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Role_V_Variance_Fields = {
  __typename?: 'role_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_pop on columns */
export type Role_Var_Pop_Fields = {
  __typename?: 'role_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Role_Var_Samp_Fields = {
  __typename?: 'role_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Role_Variance_Fields = {
  __typename?: 'role_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['smallint']['input']>;
  _gt?: InputMaybe<Scalars['smallint']['input']>;
  _gte?: InputMaybe<Scalars['smallint']['input']>;
  _in?: InputMaybe<Array<Scalars['smallint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['smallint']['input']>;
  _lte?: InputMaybe<Scalars['smallint']['input']>;
  _neq?: InputMaybe<Scalars['smallint']['input']>;
  _nin?: InputMaybe<Array<Scalars['smallint']['input']>>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "app_user" */
  app_user: Array<App_User>;
  /** fetch aggregated fields from the table: "app_user" */
  app_user_aggregate: App_User_Aggregate;
  /** fetch data from the table: "app_user" using primary key columns */
  app_user_by_pk?: Maybe<App_User>;
  /** fetch data from the table in a streaming manner: "app_user" */
  app_user_stream: Array<App_User>;
  /** fetch data from the table: "app_user_v" */
  app_user_v: Array<App_User_V>;
  /** fetch aggregated fields from the table: "app_user_v" */
  app_user_v_aggregate: App_User_V_Aggregate;
  /** fetch data from the table in a streaming manner: "app_user_v" */
  app_user_v_stream: Array<App_User_V>;
  /** fetch data from the table: "bootstrap_event" */
  bootstrap_event: Array<Bootstrap_Event>;
  /** fetch aggregated fields from the table: "bootstrap_event" */
  bootstrap_event_aggregate: Bootstrap_Event_Aggregate;
  /** fetch data from the table: "bootstrap_event" using primary key columns */
  bootstrap_event_by_pk?: Maybe<Bootstrap_Event>;
  /** fetch data from the table in a streaming manner: "bootstrap_event" */
  bootstrap_event_stream: Array<Bootstrap_Event>;
  /** fetch data from the table: "capability" */
  capability: Array<Capability>;
  /** fetch aggregated fields from the table: "capability" */
  capability_aggregate: Capability_Aggregate;
  /** fetch data from the table: "capability" using primary key columns */
  capability_by_pk?: Maybe<Capability>;
  /** fetch data from the table in a streaming manner: "capability" */
  capability_stream: Array<Capability>;
  /** fetch data from the table: "clinic" */
  clinic: Array<Clinic>;
  /** fetch aggregated fields from the table: "clinic" */
  clinic_aggregate: Clinic_Aggregate;
  /** fetch data from the table: "clinic" using primary key columns */
  clinic_by_pk?: Maybe<Clinic>;
  /** fetch data from the table: "clinic_hours" */
  clinic_hours: Array<Clinic_Hours>;
  /** fetch aggregated fields from the table: "clinic_hours" */
  clinic_hours_aggregate: Clinic_Hours_Aggregate;
  /** fetch data from the table: "clinic_hours" using primary key columns */
  clinic_hours_by_pk?: Maybe<Clinic_Hours>;
  /** fetch data from the table in a streaming manner: "clinic_hours" */
  clinic_hours_stream: Array<Clinic_Hours>;
  /** fetch data from the table: "clinic_hours_v" */
  clinic_hours_v: Array<Clinic_Hours_V>;
  /** fetch aggregated fields from the table: "clinic_hours_v" */
  clinic_hours_v_aggregate: Clinic_Hours_V_Aggregate;
  /** fetch data from the table in a streaming manner: "clinic_hours_v" */
  clinic_hours_v_stream: Array<Clinic_Hours_V>;
  /** fetch data from the table in a streaming manner: "clinic" */
  clinic_stream: Array<Clinic>;
  /** fetch data from the table: "clinic_user" */
  clinic_user: Array<Clinic_User>;
  /** fetch aggregated fields from the table: "clinic_user" */
  clinic_user_aggregate: Clinic_User_Aggregate;
  /** fetch data from the table: "clinic_user" using primary key columns */
  clinic_user_by_pk?: Maybe<Clinic_User>;
  /** fetch data from the table: "clinic_user_effective_capabilities_v" */
  clinic_user_effective_capabilities_v: Array<Clinic_User_Effective_Capabilities_V>;
  /** fetch aggregated fields from the table: "clinic_user_effective_capabilities_v" */
  clinic_user_effective_capabilities_v_aggregate: Clinic_User_Effective_Capabilities_V_Aggregate;
  /** fetch data from the table in a streaming manner: "clinic_user_effective_capabilities_v" */
  clinic_user_effective_capabilities_v_stream: Array<Clinic_User_Effective_Capabilities_V>;
  /** fetch data from the table: "clinic_user_role" */
  clinic_user_role: Array<Clinic_User_Role>;
  /** fetch aggregated fields from the table: "clinic_user_role" */
  clinic_user_role_aggregate: Clinic_User_Role_Aggregate;
  /** fetch data from the table: "clinic_user_role" using primary key columns */
  clinic_user_role_by_pk?: Maybe<Clinic_User_Role>;
  /** fetch data from the table in a streaming manner: "clinic_user_role" */
  clinic_user_role_stream: Array<Clinic_User_Role>;
  /** fetch data from the table in a streaming manner: "clinic_user" */
  clinic_user_stream: Array<Clinic_User>;
  /** fetch data from the table: "clinic_user_v" */
  clinic_user_v: Array<Clinic_User_V>;
  /** fetch aggregated fields from the table: "clinic_user_v" */
  clinic_user_v_aggregate: Clinic_User_V_Aggregate;
  /** fetch data from the table in a streaming manner: "clinic_user_v" */
  clinic_user_v_stream: Array<Clinic_User_V>;
  /** fetch data from the table: "clinic_user_with_profile_v" */
  clinic_user_with_profile_v: Array<Clinic_User_With_Profile_V>;
  /** fetch aggregated fields from the table: "clinic_user_with_profile_v" */
  clinic_user_with_profile_v_aggregate: Clinic_User_With_Profile_V_Aggregate;
  /** fetch data from the table in a streaming manner: "clinic_user_with_profile_v" */
  clinic_user_with_profile_v_stream: Array<Clinic_User_With_Profile_V>;
  /** fetch data from the table: "clinic_v" */
  clinic_v: Array<Clinic_V>;
  /** fetch aggregated fields from the table: "clinic_v" */
  clinic_v_aggregate: Clinic_V_Aggregate;
  /** fetch data from the table in a streaming manner: "clinic_v" */
  clinic_v_stream: Array<Clinic_V>;
  /** fetch data from the table: "operatory" */
  operatory: Array<Operatory>;
  /** fetch aggregated fields from the table: "operatory" */
  operatory_aggregate: Operatory_Aggregate;
  /** fetch data from the table: "operatory" using primary key columns */
  operatory_by_pk?: Maybe<Operatory>;
  /** fetch data from the table in a streaming manner: "operatory" */
  operatory_stream: Array<Operatory>;
  /** fetch data from the table: "operatory_v" */
  operatory_v: Array<Operatory_V>;
  /** fetch aggregated fields from the table: "operatory_v" */
  operatory_v_aggregate: Operatory_V_Aggregate;
  /** fetch data from the table in a streaming manner: "operatory_v" */
  operatory_v_stream: Array<Operatory_V>;
  /** fetch data from the table: "role" */
  role: Array<Role>;
  /** fetch aggregated fields from the table: "role" */
  role_aggregate: Role_Aggregate;
  /** fetch data from the table: "role" using primary key columns */
  role_by_pk?: Maybe<Role>;
  /** fetch data from the table: "role_capability" */
  role_capability: Array<Role_Capability>;
  /** fetch aggregated fields from the table: "role_capability" */
  role_capability_aggregate: Role_Capability_Aggregate;
  /** fetch data from the table: "role_capability" using primary key columns */
  role_capability_by_pk?: Maybe<Role_Capability>;
  /** fetch data from the table in a streaming manner: "role_capability" */
  role_capability_stream: Array<Role_Capability>;
  /** fetch data from the table in a streaming manner: "role" */
  role_stream: Array<Role>;
  /** fetch data from the table: "role_v" */
  role_v: Array<Role_V>;
  /** fetch aggregated fields from the table: "role_v" */
  role_v_aggregate: Role_V_Aggregate;
  /** fetch data from the table in a streaming manner: "role_v" */
  role_v_stream: Array<Role_V>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "user_capability_override" */
  user_capability_override: Array<User_Capability_Override>;
  /** fetch aggregated fields from the table: "user_capability_override" */
  user_capability_override_aggregate: User_Capability_Override_Aggregate;
  /** fetch data from the table: "user_capability_override" using primary key columns */
  user_capability_override_by_pk?: Maybe<User_Capability_Override>;
  /** fetch data from the table in a streaming manner: "user_capability_override" */
  user_capability_override_stream: Array<User_Capability_Override>;
  /** fetch data from the table: "user_profile" */
  user_profile: Array<User_Profile>;
  /** fetch aggregated fields from the table: "user_profile" */
  user_profile_aggregate: User_Profile_Aggregate;
  /** fetch data from the table: "user_profile" using primary key columns */
  user_profile_by_pk?: Maybe<User_Profile>;
  /** fetch data from the table in a streaming manner: "user_profile" */
  user_profile_stream: Array<User_Profile>;
  /** fetch data from the table: "user_provider_identifier" */
  user_provider_identifier: Array<User_Provider_Identifier>;
  /** fetch aggregated fields from the table: "user_provider_identifier" */
  user_provider_identifier_aggregate: User_Provider_Identifier_Aggregate;
  /** fetch data from the table: "user_provider_identifier" using primary key columns */
  user_provider_identifier_by_pk?: Maybe<User_Provider_Identifier>;
  /** fetch data from the table in a streaming manner: "user_provider_identifier" */
  user_provider_identifier_stream: Array<User_Provider_Identifier>;
  /** fetch data from the table: "user_provider_identifier_v" */
  user_provider_identifier_v: Array<User_Provider_Identifier_V>;
  /** fetch aggregated fields from the table: "user_provider_identifier_v" */
  user_provider_identifier_v_aggregate: User_Provider_Identifier_V_Aggregate;
  /** fetch data from the table in a streaming manner: "user_provider_identifier_v" */
  user_provider_identifier_v_stream: Array<User_Provider_Identifier_V>;
  /** fetch data from the table in a streaming manner: "user" */
  user_stream: Array<User>;
};


export type Subscription_RootApp_UserArgs = {
  distinct_on?: InputMaybe<Array<App_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_Order_By>>;
  where?: InputMaybe<App_User_Bool_Exp>;
};


export type Subscription_RootApp_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_Order_By>>;
  where?: InputMaybe<App_User_Bool_Exp>;
};


export type Subscription_RootApp_User_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootApp_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<App_User_Stream_Cursor_Input>>;
  where?: InputMaybe<App_User_Bool_Exp>;
};


export type Subscription_RootApp_User_VArgs = {
  distinct_on?: InputMaybe<Array<App_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_V_Order_By>>;
  where?: InputMaybe<App_User_V_Bool_Exp>;
};


export type Subscription_RootApp_User_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<App_User_V_Order_By>>;
  where?: InputMaybe<App_User_V_Bool_Exp>;
};


export type Subscription_RootApp_User_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<App_User_V_Stream_Cursor_Input>>;
  where?: InputMaybe<App_User_V_Bool_Exp>;
};


export type Subscription_RootBootstrap_EventArgs = {
  distinct_on?: InputMaybe<Array<Bootstrap_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Bootstrap_Event_Order_By>>;
  where?: InputMaybe<Bootstrap_Event_Bool_Exp>;
};


export type Subscription_RootBootstrap_Event_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Bootstrap_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Bootstrap_Event_Order_By>>;
  where?: InputMaybe<Bootstrap_Event_Bool_Exp>;
};


export type Subscription_RootBootstrap_Event_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootBootstrap_Event_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Bootstrap_Event_Stream_Cursor_Input>>;
  where?: InputMaybe<Bootstrap_Event_Bool_Exp>;
};


export type Subscription_RootCapabilityArgs = {
  distinct_on?: InputMaybe<Array<Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Capability_Order_By>>;
  where?: InputMaybe<Capability_Bool_Exp>;
};


export type Subscription_RootCapability_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Capability_Order_By>>;
  where?: InputMaybe<Capability_Bool_Exp>;
};


export type Subscription_RootCapability_By_PkArgs = {
  key: Scalars['String']['input'];
};


export type Subscription_RootCapability_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Capability_Stream_Cursor_Input>>;
  where?: InputMaybe<Capability_Bool_Exp>;
};


export type Subscription_RootClinicArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Order_By>>;
  where?: InputMaybe<Clinic_Bool_Exp>;
};


export type Subscription_RootClinic_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Order_By>>;
  where?: InputMaybe<Clinic_Bool_Exp>;
};


export type Subscription_RootClinic_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootClinic_HoursArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_Order_By>>;
  where?: InputMaybe<Clinic_Hours_Bool_Exp>;
};


export type Subscription_RootClinic_Hours_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_Order_By>>;
  where?: InputMaybe<Clinic_Hours_Bool_Exp>;
};


export type Subscription_RootClinic_Hours_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootClinic_Hours_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_Hours_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_Hours_Bool_Exp>;
};


export type Subscription_RootClinic_Hours_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_V_Order_By>>;
  where?: InputMaybe<Clinic_Hours_V_Bool_Exp>;
};


export type Subscription_RootClinic_Hours_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_Hours_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_Hours_V_Order_By>>;
  where?: InputMaybe<Clinic_Hours_V_Bool_Exp>;
};


export type Subscription_RootClinic_Hours_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_Hours_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_Hours_V_Bool_Exp>;
};


export type Subscription_RootClinic_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_Bool_Exp>;
};


export type Subscription_RootClinic_UserArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Order_By>>;
  where?: InputMaybe<Clinic_User_Bool_Exp>;
};


export type Subscription_RootClinic_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Order_By>>;
  where?: InputMaybe<Clinic_User_Bool_Exp>;
};


export type Subscription_RootClinic_User_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootClinic_User_Effective_Capabilities_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Order_By>>;
  where?: InputMaybe<Clinic_User_Effective_Capabilities_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_Effective_Capabilities_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Order_By>>;
  where?: InputMaybe<Clinic_User_Effective_Capabilities_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_Effective_Capabilities_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_User_Effective_Capabilities_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_User_Effective_Capabilities_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_RoleArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Role_Order_By>>;
  where?: InputMaybe<Clinic_User_Role_Bool_Exp>;
};


export type Subscription_RootClinic_User_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_Role_Order_By>>;
  where?: InputMaybe<Clinic_User_Role_Bool_Exp>;
};


export type Subscription_RootClinic_User_Role_By_PkArgs = {
  clinic_user_id: Scalars['bigint']['input'];
  role_id: Scalars['bigint']['input'];
};


export type Subscription_RootClinic_User_Role_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_User_Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_User_Role_Bool_Exp>;
};


export type Subscription_RootClinic_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_User_Bool_Exp>;
};


export type Subscription_RootClinic_User_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_V_Order_By>>;
  where?: InputMaybe<Clinic_User_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_V_Order_By>>;
  where?: InputMaybe<Clinic_User_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_User_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_User_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_With_Profile_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_With_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_With_Profile_V_Order_By>>;
  where?: InputMaybe<Clinic_User_With_Profile_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_With_Profile_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_User_With_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_User_With_Profile_V_Order_By>>;
  where?: InputMaybe<Clinic_User_With_Profile_V_Bool_Exp>;
};


export type Subscription_RootClinic_User_With_Profile_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_User_With_Profile_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_User_With_Profile_V_Bool_Exp>;
};


export type Subscription_RootClinic_VArgs = {
  distinct_on?: InputMaybe<Array<Clinic_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_V_Order_By>>;
  where?: InputMaybe<Clinic_V_Bool_Exp>;
};


export type Subscription_RootClinic_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Clinic_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Clinic_V_Order_By>>;
  where?: InputMaybe<Clinic_V_Bool_Exp>;
};


export type Subscription_RootClinic_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Clinic_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Clinic_V_Bool_Exp>;
};


export type Subscription_RootOperatoryArgs = {
  distinct_on?: InputMaybe<Array<Operatory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_Order_By>>;
  where?: InputMaybe<Operatory_Bool_Exp>;
};


export type Subscription_RootOperatory_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Operatory_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_Order_By>>;
  where?: InputMaybe<Operatory_Bool_Exp>;
};


export type Subscription_RootOperatory_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootOperatory_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Operatory_Stream_Cursor_Input>>;
  where?: InputMaybe<Operatory_Bool_Exp>;
};


export type Subscription_RootOperatory_VArgs = {
  distinct_on?: InputMaybe<Array<Operatory_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_V_Order_By>>;
  where?: InputMaybe<Operatory_V_Bool_Exp>;
};


export type Subscription_RootOperatory_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Operatory_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Operatory_V_Order_By>>;
  where?: InputMaybe<Operatory_V_Bool_Exp>;
};


export type Subscription_RootOperatory_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Operatory_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Operatory_V_Bool_Exp>;
};


export type Subscription_RootRoleArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Subscription_RootRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Order_By>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Subscription_RootRole_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootRole_CapabilityArgs = {
  distinct_on?: InputMaybe<Array<Role_Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Capability_Order_By>>;
  where?: InputMaybe<Role_Capability_Bool_Exp>;
};


export type Subscription_RootRole_Capability_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_Capability_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_Capability_Order_By>>;
  where?: InputMaybe<Role_Capability_Bool_Exp>;
};


export type Subscription_RootRole_Capability_By_PkArgs = {
  capability_key: Scalars['String']['input'];
  role_id: Scalars['bigint']['input'];
};


export type Subscription_RootRole_Capability_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Role_Capability_Stream_Cursor_Input>>;
  where?: InputMaybe<Role_Capability_Bool_Exp>;
};


export type Subscription_RootRole_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Role_Bool_Exp>;
};


export type Subscription_RootRole_VArgs = {
  distinct_on?: InputMaybe<Array<Role_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_V_Order_By>>;
  where?: InputMaybe<Role_V_Bool_Exp>;
};


export type Subscription_RootRole_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Role_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Role_V_Order_By>>;
  where?: InputMaybe<Role_V_Bool_Exp>;
};


export type Subscription_RootRole_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Role_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Role_V_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUser_Capability_OverrideArgs = {
  distinct_on?: InputMaybe<Array<User_Capability_Override_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Capability_Override_Order_By>>;
  where?: InputMaybe<User_Capability_Override_Bool_Exp>;
};


export type Subscription_RootUser_Capability_Override_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Capability_Override_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Capability_Override_Order_By>>;
  where?: InputMaybe<User_Capability_Override_Bool_Exp>;
};


export type Subscription_RootUser_Capability_Override_By_PkArgs = {
  capability_key: Scalars['String']['input'];
  clinic_user_id: Scalars['bigint']['input'];
};


export type Subscription_RootUser_Capability_Override_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Capability_Override_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Capability_Override_Bool_Exp>;
};


export type Subscription_RootUser_ProfileArgs = {
  distinct_on?: InputMaybe<Array<User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Profile_Order_By>>;
  where?: InputMaybe<User_Profile_Bool_Exp>;
};


export type Subscription_RootUser_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Profile_Order_By>>;
  where?: InputMaybe<User_Profile_Bool_Exp>;
};


export type Subscription_RootUser_Profile_By_PkArgs = {
  user_id: Scalars['uuid']['input'];
};


export type Subscription_RootUser_Profile_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Profile_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Profile_Bool_Exp>;
};


export type Subscription_RootUser_Provider_IdentifierArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_Bool_Exp>;
};


export type Subscription_RootUser_Provider_Identifier_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_Bool_Exp>;
};


export type Subscription_RootUser_Provider_Identifier_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootUser_Provider_Identifier_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Provider_Identifier_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Provider_Identifier_Bool_Exp>;
};


export type Subscription_RootUser_Provider_Identifier_VArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_V_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_V_Bool_Exp>;
};


export type Subscription_RootUser_Provider_Identifier_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Provider_Identifier_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Provider_Identifier_V_Order_By>>;
  where?: InputMaybe<User_Provider_Identifier_V_Bool_Exp>;
};


export type Subscription_RootUser_Provider_Identifier_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Provider_Identifier_V_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Provider_Identifier_V_Bool_Exp>;
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['time']['input']>;
  _gt?: InputMaybe<Scalars['time']['input']>;
  _gte?: InputMaybe<Scalars['time']['input']>;
  _in?: InputMaybe<Array<Scalars['time']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['time']['input']>;
  _lte?: InputMaybe<Scalars['time']['input']>;
  _neq?: InputMaybe<Scalars['time']['input']>;
  _nin?: InputMaybe<Array<Scalars['time']['input']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  created_at: Scalars['timestamptz']['output'];
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  password_hash: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  password_hash?: InputMaybe<String_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** columns and relationships of "user_capability_override" */
export type User_Capability_Override = {
  __typename?: 'user_capability_override';
  capability_key: Scalars['String']['output'];
  clinic_user_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  effect: Scalars['override_effect']['output'];
  reason?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "user_capability_override" */
export type User_Capability_Override_Aggregate = {
  __typename?: 'user_capability_override_aggregate';
  aggregate?: Maybe<User_Capability_Override_Aggregate_Fields>;
  nodes: Array<User_Capability_Override>;
};

/** aggregate fields of "user_capability_override" */
export type User_Capability_Override_Aggregate_Fields = {
  __typename?: 'user_capability_override_aggregate_fields';
  avg?: Maybe<User_Capability_Override_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<User_Capability_Override_Max_Fields>;
  min?: Maybe<User_Capability_Override_Min_Fields>;
  stddev?: Maybe<User_Capability_Override_Stddev_Fields>;
  stddev_pop?: Maybe<User_Capability_Override_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Capability_Override_Stddev_Samp_Fields>;
  sum?: Maybe<User_Capability_Override_Sum_Fields>;
  var_pop?: Maybe<User_Capability_Override_Var_Pop_Fields>;
  var_samp?: Maybe<User_Capability_Override_Var_Samp_Fields>;
  variance?: Maybe<User_Capability_Override_Variance_Fields>;
};


/** aggregate fields of "user_capability_override" */
export type User_Capability_Override_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Capability_Override_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type User_Capability_Override_Avg_Fields = {
  __typename?: 'user_capability_override_avg_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "user_capability_override". All fields are combined with a logical 'AND'. */
export type User_Capability_Override_Bool_Exp = {
  _and?: InputMaybe<Array<User_Capability_Override_Bool_Exp>>;
  _not?: InputMaybe<User_Capability_Override_Bool_Exp>;
  _or?: InputMaybe<Array<User_Capability_Override_Bool_Exp>>;
  capability_key?: InputMaybe<String_Comparison_Exp>;
  clinic_user_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  effect?: InputMaybe<Override_Effect_Comparison_Exp>;
  reason?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_capability_override" */
export type User_Capability_Override_Constraint =
  /** unique or primary key constraint on columns "clinic_user_id", "capability_key" */
  | 'user_capability_override_pkey';

/** input type for incrementing numeric columns in table "user_capability_override" */
export type User_Capability_Override_Inc_Input = {
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "user_capability_override" */
export type User_Capability_Override_Insert_Input = {
  capability_key?: InputMaybe<Scalars['String']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  effect?: InputMaybe<Scalars['override_effect']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type User_Capability_Override_Max_Fields = {
  __typename?: 'user_capability_override_max_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  effect?: Maybe<Scalars['override_effect']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type User_Capability_Override_Min_Fields = {
  __typename?: 'user_capability_override_min_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  effect?: Maybe<Scalars['override_effect']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "user_capability_override" */
export type User_Capability_Override_Mutation_Response = {
  __typename?: 'user_capability_override_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Capability_Override>;
};

/** on_conflict condition type for table "user_capability_override" */
export type User_Capability_Override_On_Conflict = {
  constraint: User_Capability_Override_Constraint;
  update_columns?: Array<User_Capability_Override_Update_Column>;
  where?: InputMaybe<User_Capability_Override_Bool_Exp>;
};

/** Ordering options when selecting data from "user_capability_override". */
export type User_Capability_Override_Order_By = {
  capability_key?: InputMaybe<Order_By>;
  clinic_user_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  effect?: InputMaybe<Order_By>;
  reason?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_capability_override */
export type User_Capability_Override_Pk_Columns_Input = {
  capability_key: Scalars['String']['input'];
  clinic_user_id: Scalars['bigint']['input'];
};

/** select columns of table "user_capability_override" */
export type User_Capability_Override_Select_Column =
  /** column name */
  | 'capability_key'
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'effect'
  /** column name */
  | 'reason';

/** input type for updating data in table "user_capability_override" */
export type User_Capability_Override_Set_Input = {
  capability_key?: InputMaybe<Scalars['String']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  effect?: InputMaybe<Scalars['override_effect']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type User_Capability_Override_Stddev_Fields = {
  __typename?: 'user_capability_override_stddev_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type User_Capability_Override_Stddev_Pop_Fields = {
  __typename?: 'user_capability_override_stddev_pop_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type User_Capability_Override_Stddev_Samp_Fields = {
  __typename?: 'user_capability_override_stddev_samp_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "user_capability_override" */
export type User_Capability_Override_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Capability_Override_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Capability_Override_Stream_Cursor_Value_Input = {
  capability_key?: InputMaybe<Scalars['String']['input']>;
  clinic_user_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  effect?: InputMaybe<Scalars['override_effect']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type User_Capability_Override_Sum_Fields = {
  __typename?: 'user_capability_override_sum_fields';
  clinic_user_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "user_capability_override" */
export type User_Capability_Override_Update_Column =
  /** column name */
  | 'capability_key'
  /** column name */
  | 'clinic_user_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'effect'
  /** column name */
  | 'reason';

export type User_Capability_Override_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<User_Capability_Override_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Capability_Override_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Capability_Override_Bool_Exp;
};

/** aggregate var_pop on columns */
export type User_Capability_Override_Var_Pop_Fields = {
  __typename?: 'user_capability_override_var_pop_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type User_Capability_Override_Var_Samp_Fields = {
  __typename?: 'user_capability_override_var_samp_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type User_Capability_Override_Variance_Fields = {
  __typename?: 'user_capability_override_variance_fields';
  clinic_user_id?: Maybe<Scalars['Float']['output']>;
};

/** unique or primary key constraints on table "user" */
export type User_Constraint =
  /** unique or primary key constraint on columns "email" */
  | 'user_email_key'
  /** unique or primary key constraint on columns "id" */
  | 'user_pkey';

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  password_hash?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  password_hash?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** on_conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password_hash?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** columns and relationships of "user_profile" */
export type User_Profile = {
  __typename?: 'user_profile';
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  is_active: Scalars['Boolean']['output'];
  license_no?: Maybe<Scalars['String']['output']>;
  scheduler_color?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id: Scalars['uuid']['output'];
  user_kind: Scalars['String']['output'];
};

/** aggregated selection of "user_profile" */
export type User_Profile_Aggregate = {
  __typename?: 'user_profile_aggregate';
  aggregate?: Maybe<User_Profile_Aggregate_Fields>;
  nodes: Array<User_Profile>;
};

/** aggregate fields of "user_profile" */
export type User_Profile_Aggregate_Fields = {
  __typename?: 'user_profile_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Profile_Max_Fields>;
  min?: Maybe<User_Profile_Min_Fields>;
};


/** aggregate fields of "user_profile" */
export type User_Profile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "user_profile". All fields are combined with a logical 'AND'. */
export type User_Profile_Bool_Exp = {
  _and?: InputMaybe<Array<User_Profile_Bool_Exp>>;
  _not?: InputMaybe<User_Profile_Bool_Exp>;
  _or?: InputMaybe<Array<User_Profile_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  license_no?: InputMaybe<String_Comparison_Exp>;
  scheduler_color?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_kind?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_profile" */
export type User_Profile_Constraint =
  /** unique or primary key constraint on columns "user_id" */
  | 'user_profile_pkey';

/** input type for inserting data into table "user_profile" */
export type User_Profile_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_no?: InputMaybe<Scalars['String']['input']>;
  scheduler_color?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  user_kind?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type User_Profile_Max_Fields = {
  __typename?: 'user_profile_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  license_no?: Maybe<Scalars['String']['output']>;
  scheduler_color?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  user_kind?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type User_Profile_Min_Fields = {
  __typename?: 'user_profile_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  license_no?: Maybe<Scalars['String']['output']>;
  scheduler_color?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
  user_kind?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "user_profile" */
export type User_Profile_Mutation_Response = {
  __typename?: 'user_profile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Profile>;
};

/** on_conflict condition type for table "user_profile" */
export type User_Profile_On_Conflict = {
  constraint: User_Profile_Constraint;
  update_columns?: Array<User_Profile_Update_Column>;
  where?: InputMaybe<User_Profile_Bool_Exp>;
};

/** Ordering options when selecting data from "user_profile". */
export type User_Profile_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  license_no?: InputMaybe<Order_By>;
  scheduler_color?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  user_kind?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_profile */
export type User_Profile_Pk_Columns_Input = {
  user_id: Scalars['uuid']['input'];
};

/** select columns of table "user_profile" */
export type User_Profile_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'is_active'
  /** column name */
  | 'license_no'
  /** column name */
  | 'scheduler_color'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'user_id'
  /** column name */
  | 'user_kind';

/** input type for updating data in table "user_profile" */
export type User_Profile_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_no?: InputMaybe<Scalars['String']['input']>;
  scheduler_color?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  user_kind?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "user_profile" */
export type User_Profile_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Profile_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Profile_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_no?: InputMaybe<Scalars['String']['input']>;
  scheduler_color?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
  user_kind?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "user_profile" */
export type User_Profile_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'is_active'
  /** column name */
  | 'license_no'
  /** column name */
  | 'scheduler_color'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'user_id'
  /** column name */
  | 'user_kind';

export type User_Profile_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Profile_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Profile_Bool_Exp;
};

/** columns and relationships of "user_provider_identifier" */
export type User_Provider_Identifier = {
  __typename?: 'user_provider_identifier';
  /** An object relationship */
  clinic_user?: Maybe<Clinic_User>;
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  effective_from?: Maybe<Scalars['date']['output']>;
  effective_to?: Maybe<Scalars['date']['output']>;
  id: Scalars['bigint']['output'];
  identifier_kind: Scalars['String']['output'];
  identifier_value: Scalars['String']['output'];
  is_active: Scalars['Boolean']['output'];
  license_type: Scalars['String']['output'];
  province_code: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "user_provider_identifier" */
export type User_Provider_Identifier_Aggregate = {
  __typename?: 'user_provider_identifier_aggregate';
  aggregate?: Maybe<User_Provider_Identifier_Aggregate_Fields>;
  nodes: Array<User_Provider_Identifier>;
};

/** aggregate fields of "user_provider_identifier" */
export type User_Provider_Identifier_Aggregate_Fields = {
  __typename?: 'user_provider_identifier_aggregate_fields';
  avg?: Maybe<User_Provider_Identifier_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<User_Provider_Identifier_Max_Fields>;
  min?: Maybe<User_Provider_Identifier_Min_Fields>;
  stddev?: Maybe<User_Provider_Identifier_Stddev_Fields>;
  stddev_pop?: Maybe<User_Provider_Identifier_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Provider_Identifier_Stddev_Samp_Fields>;
  sum?: Maybe<User_Provider_Identifier_Sum_Fields>;
  var_pop?: Maybe<User_Provider_Identifier_Var_Pop_Fields>;
  var_samp?: Maybe<User_Provider_Identifier_Var_Samp_Fields>;
  variance?: Maybe<User_Provider_Identifier_Variance_Fields>;
};


/** aggregate fields of "user_provider_identifier" */
export type User_Provider_Identifier_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Provider_Identifier_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type User_Provider_Identifier_Avg_Fields = {
  __typename?: 'user_provider_identifier_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "user_provider_identifier". All fields are combined with a logical 'AND'. */
export type User_Provider_Identifier_Bool_Exp = {
  _and?: InputMaybe<Array<User_Provider_Identifier_Bool_Exp>>;
  _not?: InputMaybe<User_Provider_Identifier_Bool_Exp>;
  _or?: InputMaybe<Array<User_Provider_Identifier_Bool_Exp>>;
  clinic_user?: InputMaybe<Clinic_User_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  effective_from?: InputMaybe<Date_Comparison_Exp>;
  effective_to?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  identifier_kind?: InputMaybe<String_Comparison_Exp>;
  identifier_value?: InputMaybe<String_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  license_type?: InputMaybe<String_Comparison_Exp>;
  province_code?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_provider_identifier" */
export type User_Provider_Identifier_Constraint =
  /** unique or primary key constraint on columns "license_type", "user_id", "identifier_kind", "province_code" */
  | 'idx_user_provider_identifier_unique_active'
  /** unique or primary key constraint on columns "id" */
  | 'user_provider_identifier_pkey';

/** input type for incrementing numeric columns in table "user_provider_identifier" */
export type User_Provider_Identifier_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "user_provider_identifier" */
export type User_Provider_Identifier_Insert_Input = {
  clinic_user?: InputMaybe<Clinic_User_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  effective_from?: InputMaybe<Scalars['date']['input']>;
  effective_to?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  identifier_kind?: InputMaybe<Scalars['String']['input']>;
  identifier_value?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_type?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type User_Provider_Identifier_Max_Fields = {
  __typename?: 'user_provider_identifier_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  effective_from?: Maybe<Scalars['date']['output']>;
  effective_to?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  identifier_kind?: Maybe<Scalars['String']['output']>;
  identifier_value?: Maybe<Scalars['String']['output']>;
  license_type?: Maybe<Scalars['String']['output']>;
  province_code?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type User_Provider_Identifier_Min_Fields = {
  __typename?: 'user_provider_identifier_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  effective_from?: Maybe<Scalars['date']['output']>;
  effective_to?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  identifier_kind?: Maybe<Scalars['String']['output']>;
  identifier_value?: Maybe<Scalars['String']['output']>;
  license_type?: Maybe<Scalars['String']['output']>;
  province_code?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "user_provider_identifier" */
export type User_Provider_Identifier_Mutation_Response = {
  __typename?: 'user_provider_identifier_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Provider_Identifier>;
};

/** on_conflict condition type for table "user_provider_identifier" */
export type User_Provider_Identifier_On_Conflict = {
  constraint: User_Provider_Identifier_Constraint;
  update_columns?: Array<User_Provider_Identifier_Update_Column>;
  where?: InputMaybe<User_Provider_Identifier_Bool_Exp>;
};

/** Ordering options when selecting data from "user_provider_identifier". */
export type User_Provider_Identifier_Order_By = {
  clinic_user?: InputMaybe<Clinic_User_Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  effective_from?: InputMaybe<Order_By>;
  effective_to?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identifier_kind?: InputMaybe<Order_By>;
  identifier_value?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  license_type?: InputMaybe<Order_By>;
  province_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_provider_identifier */
export type User_Provider_Identifier_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "user_provider_identifier" */
export type User_Provider_Identifier_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'effective_from'
  /** column name */
  | 'effective_to'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier_kind'
  /** column name */
  | 'identifier_value'
  /** column name */
  | 'is_active'
  /** column name */
  | 'license_type'
  /** column name */
  | 'province_code'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'user_id';

/** input type for updating data in table "user_provider_identifier" */
export type User_Provider_Identifier_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  effective_from?: InputMaybe<Scalars['date']['input']>;
  effective_to?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  identifier_kind?: InputMaybe<Scalars['String']['input']>;
  identifier_value?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_type?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type User_Provider_Identifier_Stddev_Fields = {
  __typename?: 'user_provider_identifier_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type User_Provider_Identifier_Stddev_Pop_Fields = {
  __typename?: 'user_provider_identifier_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type User_Provider_Identifier_Stddev_Samp_Fields = {
  __typename?: 'user_provider_identifier_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "user_provider_identifier" */
export type User_Provider_Identifier_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Provider_Identifier_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Provider_Identifier_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  effective_from?: InputMaybe<Scalars['date']['input']>;
  effective_to?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  identifier_kind?: InputMaybe<Scalars['String']['input']>;
  identifier_value?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_type?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type User_Provider_Identifier_Sum_Fields = {
  __typename?: 'user_provider_identifier_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "user_provider_identifier" */
export type User_Provider_Identifier_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'effective_from'
  /** column name */
  | 'effective_to'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier_kind'
  /** column name */
  | 'identifier_value'
  /** column name */
  | 'is_active'
  /** column name */
  | 'license_type'
  /** column name */
  | 'province_code'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'user_id';

export type User_Provider_Identifier_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<User_Provider_Identifier_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Provider_Identifier_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Provider_Identifier_Bool_Exp;
};

/** columns and relationships of "user_provider_identifier_v" */
export type User_Provider_Identifier_V = {
  __typename?: 'user_provider_identifier_v';
  /** An object relationship */
  clinic_user?: Maybe<Clinic_User>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  effective_from?: Maybe<Scalars['date']['output']>;
  effective_to?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  identifier_kind?: Maybe<Scalars['String']['output']>;
  identifier_value?: Maybe<Scalars['String']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  license_type?: Maybe<Scalars['String']['output']>;
  province_code?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Aggregate = {
  __typename?: 'user_provider_identifier_v_aggregate';
  aggregate?: Maybe<User_Provider_Identifier_V_Aggregate_Fields>;
  nodes: Array<User_Provider_Identifier_V>;
};

/** aggregate fields of "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Aggregate_Fields = {
  __typename?: 'user_provider_identifier_v_aggregate_fields';
  avg?: Maybe<User_Provider_Identifier_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<User_Provider_Identifier_V_Max_Fields>;
  min?: Maybe<User_Provider_Identifier_V_Min_Fields>;
  stddev?: Maybe<User_Provider_Identifier_V_Stddev_Fields>;
  stddev_pop?: Maybe<User_Provider_Identifier_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Provider_Identifier_V_Stddev_Samp_Fields>;
  sum?: Maybe<User_Provider_Identifier_V_Sum_Fields>;
  var_pop?: Maybe<User_Provider_Identifier_V_Var_Pop_Fields>;
  var_samp?: Maybe<User_Provider_Identifier_V_Var_Samp_Fields>;
  variance?: Maybe<User_Provider_Identifier_V_Variance_Fields>;
};


/** aggregate fields of "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Provider_Identifier_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type User_Provider_Identifier_V_Avg_Fields = {
  __typename?: 'user_provider_identifier_v_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "user_provider_identifier_v". All fields are combined with a logical 'AND'. */
export type User_Provider_Identifier_V_Bool_Exp = {
  _and?: InputMaybe<Array<User_Provider_Identifier_V_Bool_Exp>>;
  _not?: InputMaybe<User_Provider_Identifier_V_Bool_Exp>;
  _or?: InputMaybe<Array<User_Provider_Identifier_V_Bool_Exp>>;
  clinic_user?: InputMaybe<Clinic_User_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  effective_from?: InputMaybe<Date_Comparison_Exp>;
  effective_to?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  identifier_kind?: InputMaybe<String_Comparison_Exp>;
  identifier_value?: InputMaybe<String_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  license_type?: InputMaybe<String_Comparison_Exp>;
  province_code?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Insert_Input = {
  clinic_user?: InputMaybe<Clinic_User_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  effective_from?: InputMaybe<Scalars['date']['input']>;
  effective_to?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  identifier_kind?: InputMaybe<Scalars['String']['input']>;
  identifier_value?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_type?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type User_Provider_Identifier_V_Max_Fields = {
  __typename?: 'user_provider_identifier_v_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  effective_from?: Maybe<Scalars['date']['output']>;
  effective_to?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  identifier_kind?: Maybe<Scalars['String']['output']>;
  identifier_value?: Maybe<Scalars['String']['output']>;
  license_type?: Maybe<Scalars['String']['output']>;
  province_code?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type User_Provider_Identifier_V_Min_Fields = {
  __typename?: 'user_provider_identifier_v_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  effective_from?: Maybe<Scalars['date']['output']>;
  effective_to?: Maybe<Scalars['date']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  identifier_kind?: Maybe<Scalars['String']['output']>;
  identifier_value?: Maybe<Scalars['String']['output']>;
  license_type?: Maybe<Scalars['String']['output']>;
  province_code?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Mutation_Response = {
  __typename?: 'user_provider_identifier_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Provider_Identifier_V>;
};

/** Ordering options when selecting data from "user_provider_identifier_v". */
export type User_Provider_Identifier_V_Order_By = {
  clinic_user?: InputMaybe<Clinic_User_Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  effective_from?: InputMaybe<Order_By>;
  effective_to?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identifier_kind?: InputMaybe<Order_By>;
  identifier_value?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  license_type?: InputMaybe<Order_By>;
  province_code?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** select columns of table "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'effective_from'
  /** column name */
  | 'effective_to'
  /** column name */
  | 'id'
  /** column name */
  | 'identifier_kind'
  /** column name */
  | 'identifier_value'
  /** column name */
  | 'is_active'
  /** column name */
  | 'license_type'
  /** column name */
  | 'province_code'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'user_id';

/** input type for updating data in table "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  effective_from?: InputMaybe<Scalars['date']['input']>;
  effective_to?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  identifier_kind?: InputMaybe<Scalars['String']['input']>;
  identifier_value?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_type?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type User_Provider_Identifier_V_Stddev_Fields = {
  __typename?: 'user_provider_identifier_v_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type User_Provider_Identifier_V_Stddev_Pop_Fields = {
  __typename?: 'user_provider_identifier_v_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type User_Provider_Identifier_V_Stddev_Samp_Fields = {
  __typename?: 'user_provider_identifier_v_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "user_provider_identifier_v" */
export type User_Provider_Identifier_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Provider_Identifier_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Provider_Identifier_V_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  effective_from?: InputMaybe<Scalars['date']['input']>;
  effective_to?: InputMaybe<Scalars['date']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  identifier_kind?: InputMaybe<Scalars['String']['input']>;
  identifier_value?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  license_type?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type User_Provider_Identifier_V_Sum_Fields = {
  __typename?: 'user_provider_identifier_v_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

export type User_Provider_Identifier_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<User_Provider_Identifier_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Provider_Identifier_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Provider_Identifier_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type User_Provider_Identifier_V_Var_Pop_Fields = {
  __typename?: 'user_provider_identifier_v_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type User_Provider_Identifier_V_Var_Samp_Fields = {
  __typename?: 'user_provider_identifier_v_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type User_Provider_Identifier_V_Variance_Fields = {
  __typename?: 'user_provider_identifier_v_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_pop on columns */
export type User_Provider_Identifier_Var_Pop_Fields = {
  __typename?: 'user_provider_identifier_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type User_Provider_Identifier_Var_Samp_Fields = {
  __typename?: 'user_provider_identifier_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type User_Provider_Identifier_Variance_Fields = {
  __typename?: 'user_provider_identifier_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** select columns of table "user" */
export type User_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'password_hash'
  /** column name */
  | 'role';

/** input type for updating data in table "user" */
export type User_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "user" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  password_hash?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "user" */
export type User_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'password_hash'
  /** column name */
  | 'role';

export type User_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type GetUserEffectiveCapabilitiesQueryVariables = Exact<{
  clinicUserId: Scalars['bigint']['input'];
}>;


export type GetUserEffectiveCapabilitiesQuery = { __typename?: 'query_root', clinic_user_effective_capabilities_v: Array<{ __typename?: 'clinic_user_effective_capabilities_v', capability_key?: string | null, clinic_user_id?: number | null }> };

export type GetClinicQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetClinicQuery = { __typename?: 'query_root', clinic_v: Array<{ __typename?: 'clinic_v', id?: number | null, name?: string | null, timezone?: string | null, phone?: string | null, fax?: string | null, website?: string | null, email?: string | null, address_street?: string | null, address_unit?: string | null, address_city?: string | null, address_province?: string | null, address_postal?: string | null, billing_number?: string | null, is_active?: boolean | null, created_at?: string | null, updated_at?: string | null }> };

export type UpdateClinicMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  addressStreet?: InputMaybe<Scalars['String']['input']>;
  addressUnit?: InputMaybe<Scalars['String']['input']>;
  addressCity?: InputMaybe<Scalars['String']['input']>;
  addressProvince?: InputMaybe<Scalars['String']['input']>;
  addressPostal?: InputMaybe<Scalars['String']['input']>;
  billingNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateClinicMutation = { __typename?: 'mutation_root', update_clinic?: { __typename?: 'clinic_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'clinic', id: number, name: string, timezone: string, phone?: string | null, fax?: string | null, website?: string | null, email?: string | null, address_street?: string | null, address_unit?: string | null, address_city?: string | null, address_province?: string | null, address_postal?: string | null, billing_number?: string | null, is_active: boolean, updated_at: string }> } | null };

export type GetClinicHoursQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetClinicHoursQuery = { __typename?: 'query_root', clinic_hours: Array<{ __typename?: 'clinic_hours', id: number, clinic_id: number, day_of_week: any, is_closed: boolean, open_time?: any | null, close_time?: any | null, appointment_start?: any | null, appointment_end?: any | null, is_active: boolean }> };

export type UpsertClinicHoursMutationVariables = Exact<{
  hours: Array<Clinic_Hours_Insert_Input> | Clinic_Hours_Insert_Input;
}>;


export type UpsertClinicHoursMutation = { __typename?: 'mutation_root', insert_clinic_hours?: { __typename?: 'clinic_hours_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'clinic_hours', id: number, clinic_id: number, day_of_week: any, is_closed: boolean, open_time?: any | null, close_time?: any | null, appointment_start?: any | null, appointment_end?: any | null, is_active: boolean }> } | null };

export type DeleteClinicHoursMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type DeleteClinicHoursMutation = { __typename?: 'mutation_root', delete_clinic_hours?: { __typename?: 'clinic_hours_mutation_response', affected_rows: number } | null };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'query_root', app_user_v: Array<{ __typename?: 'app_user_v', id?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null, is_active?: boolean | null, created_at?: string | null, updated_at?: string | null }> };

export type GetCurrentUserWithClinicQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserWithClinicQuery = { __typename?: 'query_root', app_user_v: Array<{ __typename?: 'app_user_v', id?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null, is_active?: boolean | null, created_at?: string | null, updated_at?: string | null, current_clinic_id?: number | null }>, clinic_user_v: Array<{ __typename?: 'clinic_user_v', id?: number | null, clinic_id?: number | null, user_id?: string | null, joined_at?: string | null }>, clinic_v: Array<{ __typename?: 'clinic_v', id?: number | null, name?: string | null, timezone?: string | null, phone?: string | null, fax?: string | null, website?: string | null, email?: string | null, address_street?: string | null, address_unit?: string | null, address_city?: string | null, address_province?: string | null, address_postal?: string | null, billing_number?: string | null, is_active?: boolean | null }> };

export type UpdateCurrentClinicMutationVariables = Exact<{
  userId: Scalars['uuid']['input'];
  clinicId: Scalars['bigint']['input'];
}>;


export type UpdateCurrentClinicMutation = { __typename?: 'mutation_root', update_app_user_v?: { __typename?: 'app_user_v_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'app_user_v', id?: string | null, current_clinic_id?: number | null }> } | null };

export type GetUserClinicsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserClinicsQuery = { __typename?: 'query_root', clinic_user_v: Array<{ __typename?: 'clinic_user_v', id?: number | null, clinic_id?: number | null, user_id?: string | null, is_active?: boolean | null, joined_at?: string | null, clinic?: { __typename?: 'clinic_v', id?: number | null, name?: string | null, timezone?: string | null, phone?: string | null, fax?: string | null, website?: string | null, email?: string | null, address_street?: string | null, address_unit?: string | null, address_city?: string | null, address_province?: string | null, address_postal?: string | null, billing_number?: string | null, is_active?: boolean | null } | null }> };

export type GetOperatoriesQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetOperatoriesQuery = { __typename?: 'query_root', operatory_v: Array<{ __typename?: 'operatory_v', id?: number | null, clinic_id?: number | null, name?: string | null, is_bookable?: boolean | null, is_active?: boolean | null, color?: string | null, created_at?: string | null, updated_at?: string | null }> };

export type CreateOperatoryMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  name: Scalars['String']['input'];
  isBookable: Scalars['Boolean']['input'];
  isActive: Scalars['Boolean']['input'];
  color: Scalars['String']['input'];
}>;


export type CreateOperatoryMutation = { __typename?: 'mutation_root', insert_operatory_one?: { __typename?: 'operatory', id: number, clinic_id: number, name: string, is_bookable: boolean, is_active: boolean, color: string, created_at: string, updated_at: string } | null };

export type UpdateOperatoryMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  isBookable?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateOperatoryMutation = { __typename?: 'mutation_root', update_operatory_by_pk?: { __typename?: 'operatory', id: number, clinic_id: number, name: string, is_bookable: boolean, is_active: boolean, color: string, updated_at: string } | null };

export type DeleteOperatoryMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
}>;


export type DeleteOperatoryMutation = { __typename?: 'mutation_root', delete_operatory_by_pk?: { __typename?: 'operatory', id: number } | null };

export type GetRolesQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetRolesQuery = { __typename?: 'query_root', role_v: Array<{ __typename?: 'role_v', id?: number | null, name?: string | null, description?: string | null, clinic_id?: number | null, is_active?: boolean | null }> };

export type GetCapabilitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCapabilitiesQuery = { __typename?: 'query_root', capability: Array<{ __typename?: 'capability', key: string, description: string, module: string }> };

export type GetRoleCapabilitiesQueryVariables = Exact<{
  roleId: Scalars['bigint']['input'];
}>;


export type GetRoleCapabilitiesQuery = { __typename?: 'query_root', role_capability: Array<{ __typename?: 'role_capability', capability_key: string, role_id: number }> };

export type GetUserRolesQueryVariables = Exact<{
  clinicUserId: Scalars['bigint']['input'];
}>;


export type GetUserRolesQuery = { __typename?: 'query_root', clinic_user_role: Array<{ __typename?: 'clinic_user_role', role_id: number, clinic_user_id: number }> };

export type GetAppUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAppUsersQuery = { __typename?: 'query_root', app_user_v: Array<{ __typename?: 'app_user_v', id?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null, is_active?: boolean | null }> };

export type GetAppUserQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetAppUserQuery = { __typename?: 'query_root', app_user_v: Array<{ __typename?: 'app_user_v', id?: string | null, email?: string | null, first_name?: string | null, last_name?: string | null, is_active?: boolean | null }> };

export type UpdateUserProfileMutationVariables = Exact<{
  userId: Scalars['uuid']['input'];
  userKind?: InputMaybe<Scalars['String']['input']>;
  licenseNo?: InputMaybe<Scalars['String']['input']>;
  schedulerColor?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateUserProfileMutation = { __typename?: 'mutation_root', update_user_profile?: { __typename?: 'user_profile_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'user_profile', user_id: string, user_kind: string, license_no?: string | null, scheduler_color?: string | null, is_active: boolean }> } | null };

export type UpdateClinicUserMembershipMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  userId: Scalars['uuid']['input'];
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  isSchedulable?: InputMaybe<Scalars['Boolean']['input']>;
  providerKind?: InputMaybe<Scalars['String']['input']>;
  defaultOperatoryId?: InputMaybe<Scalars['bigint']['input']>;
  schedulerColor?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateClinicUserMembershipMutation = { __typename?: 'mutation_root', update_clinic_user?: { __typename?: 'clinic_user_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'clinic_user', id: number, clinic_id: number, user_id: string, job_title?: string | null, is_schedulable: boolean, provider_kind?: string | null, default_operatory_id?: number | null, scheduler_color?: string | null, is_active: boolean }> } | null };

export type CreateRoleMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateRoleMutation = { __typename?: 'mutation_root', insert_role_one?: { __typename?: 'role', id: number, clinic_id: number, name: string, description?: string | null, is_active: boolean } | null };

export type UpdateRoleMutationVariables = Exact<{
  roleId: Scalars['bigint']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateRoleMutation = { __typename?: 'mutation_root', update_role_by_pk?: { __typename?: 'role', id: number, name: string, description?: string | null, is_active: boolean } | null };

export type AddCapabilityToRoleMutationVariables = Exact<{
  roleId: Scalars['bigint']['input'];
  capabilityKey: Scalars['String']['input'];
}>;


export type AddCapabilityToRoleMutation = { __typename?: 'mutation_root', insert_role_capability_one?: { __typename?: 'role_capability', role_id: number, capability_key: string } | null };

export type RemoveCapabilityFromRoleMutationVariables = Exact<{
  roleId: Scalars['bigint']['input'];
  capabilityKey: Scalars['String']['input'];
}>;


export type RemoveCapabilityFromRoleMutation = { __typename?: 'mutation_root', delete_role_capability?: { __typename?: 'role_capability_mutation_response', affected_rows: number } | null };

export type AssignRoleToUserMutationVariables = Exact<{
  clinicUserId: Scalars['bigint']['input'];
  roleId: Scalars['bigint']['input'];
}>;


export type AssignRoleToUserMutation = { __typename?: 'mutation_root', insert_clinic_user_role_one?: { __typename?: 'clinic_user_role', clinic_user_id: number, role_id: number } | null };

export type RemoveRoleFromUserMutationVariables = Exact<{
  clinicUserId: Scalars['bigint']['input'];
  roleId: Scalars['bigint']['input'];
}>;


export type RemoveRoleFromUserMutation = { __typename?: 'mutation_root', delete_clinic_user_role?: { __typename?: 'clinic_user_role_mutation_response', affected_rows: number } | null };

export type CreateProviderIdentifierMutationVariables = Exact<{
  userId: Scalars['uuid']['input'];
  identifierKind: Scalars['String']['input'];
  provinceCode: Scalars['String']['input'];
  licenseType: Scalars['String']['input'];
  identifierValue: Scalars['String']['input'];
  effectiveFrom?: InputMaybe<Scalars['date']['input']>;
  effectiveTo?: InputMaybe<Scalars['date']['input']>;
  isActive: Scalars['Boolean']['input'];
}>;


export type CreateProviderIdentifierMutation = { __typename?: 'mutation_root', insert_user_provider_identifier_one?: { __typename?: 'user_provider_identifier', id: number, user_id: string, identifier_kind: string, province_code: string, license_type: string, identifier_value: string, effective_from?: any | null, effective_to?: any | null, is_active: boolean } | null };

export type UpdateProviderIdentifierMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  provinceCode?: InputMaybe<Scalars['String']['input']>;
  licenseType?: InputMaybe<Scalars['String']['input']>;
  identifierValue?: InputMaybe<Scalars['String']['input']>;
  effectiveFrom?: InputMaybe<Scalars['date']['input']>;
  effectiveTo?: InputMaybe<Scalars['date']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateProviderIdentifierMutation = { __typename?: 'mutation_root', update_user_provider_identifier_by_pk?: { __typename?: 'user_provider_identifier', id: number, province_code: string, license_type: string, identifier_value: string, effective_from?: any | null, effective_to?: any | null, is_active: boolean } | null };

export type DeleteProviderIdentifierMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
}>;


export type DeleteProviderIdentifierMutation = { __typename?: 'mutation_root', delete_user_provider_identifier_by_pk?: { __typename?: 'user_provider_identifier', id: number } | null };

export type GetUserProfileQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'query_root', user_profile: Array<{ __typename?: 'user_profile', user_id: string, user_kind: string, license_no?: string | null, scheduler_color?: string | null, is_active: boolean }> };

export type GetClinicUserWithProfileQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetClinicUserWithProfileQuery = { __typename?: 'query_root', clinic_user_with_profile_v: Array<{ __typename?: 'clinic_user_with_profile_v', clinic_user_id?: number | null, clinic_id?: number | null, user_id?: string | null, job_title?: string | null, is_schedulable?: boolean | null, provider_kind?: string | null, default_operatory_id?: number | null, clinic_scheduler_color?: string | null, joined_at?: string | null, clinic_membership_active?: boolean | null, email?: string | null, first_name?: string | null, last_name?: string | null, user_account_active?: boolean | null, user_kind?: string | null, license_no?: string | null, global_scheduler_color?: string | null, profile_active?: boolean | null }> };

export type GetClinicUserWithProfileByUserIdQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  userId: Scalars['uuid']['input'];
}>;


export type GetClinicUserWithProfileByUserIdQuery = { __typename?: 'query_root', clinic_user_with_profile_v: Array<{ __typename?: 'clinic_user_with_profile_v', clinic_user_id?: number | null, clinic_id?: number | null, user_id?: string | null, job_title?: string | null, is_schedulable?: boolean | null, provider_kind?: string | null, default_operatory_id?: number | null, clinic_scheduler_color?: string | null, joined_at?: string | null, clinic_membership_active?: boolean | null, email?: string | null, first_name?: string | null, last_name?: string | null, user_account_active?: boolean | null, user_kind?: string | null, license_no?: string | null, global_scheduler_color?: string | null, profile_active?: boolean | null }> };

export type GetUserProviderIdentifiersQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetUserProviderIdentifiersQuery = { __typename?: 'query_root', user_provider_identifier_v: Array<{ __typename?: 'user_provider_identifier_v', id?: number | null, user_id?: string | null, identifier_kind?: string | null, province_code?: string | null, license_type?: string | null, identifier_value?: string | null, effective_from?: any | null, effective_to?: any | null, is_active?: boolean | null, created_at?: string | null, updated_at?: string | null }> };


export const GetUserEffectiveCapabilitiesDocument = gql`
    query GetUserEffectiveCapabilities($clinicUserId: bigint!) {
  clinic_user_effective_capabilities_v(
    where: {clinic_user_id: {_eq: $clinicUserId}}
  ) {
    capability_key
    clinic_user_id
  }
}
    `;

/**
 * __useGetUserEffectiveCapabilitiesQuery__
 *
 * To run a query within a React component, call `useGetUserEffectiveCapabilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserEffectiveCapabilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserEffectiveCapabilitiesQuery({
 *   variables: {
 *      clinicUserId: // value for 'clinicUserId'
 *   },
 * });
 */
export function useGetUserEffectiveCapabilitiesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables> & ({ variables: GetUserEffectiveCapabilitiesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>(GetUserEffectiveCapabilitiesDocument, options);
      }
export function useGetUserEffectiveCapabilitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>(GetUserEffectiveCapabilitiesDocument, options);
        }
// @ts-ignore
export function useGetUserEffectiveCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>;
export function useGetUserEffectiveCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserEffectiveCapabilitiesQuery | undefined, GetUserEffectiveCapabilitiesQueryVariables>;
export function useGetUserEffectiveCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>(GetUserEffectiveCapabilitiesDocument, options);
        }
export type GetUserEffectiveCapabilitiesQueryHookResult = ReturnType<typeof useGetUserEffectiveCapabilitiesQuery>;
export type GetUserEffectiveCapabilitiesLazyQueryHookResult = ReturnType<typeof useGetUserEffectiveCapabilitiesLazyQuery>;
export type GetUserEffectiveCapabilitiesSuspenseQueryHookResult = ReturnType<typeof useGetUserEffectiveCapabilitiesSuspenseQuery>;
export type GetUserEffectiveCapabilitiesQueryResult = ApolloReactCommon.QueryResult<GetUserEffectiveCapabilitiesQuery, GetUserEffectiveCapabilitiesQueryVariables>;
export const GetClinicDocument = gql`
    query GetClinic($clinicId: bigint!) {
  clinic_v(where: {id: {_eq: $clinicId}}) {
    id
    name
    timezone
    phone
    fax
    website
    email
    address_street
    address_unit
    address_city
    address_province
    address_postal
    billing_number
    is_active
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetClinicQuery__
 *
 * To run a query within a React component, call `useGetClinicQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClinicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClinicQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetClinicQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetClinicQuery, GetClinicQueryVariables> & ({ variables: GetClinicQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetClinicQuery, GetClinicQueryVariables>(GetClinicDocument, options);
      }
export function useGetClinicLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClinicQuery, GetClinicQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetClinicQuery, GetClinicQueryVariables>(GetClinicDocument, options);
        }
// @ts-ignore
export function useGetClinicSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetClinicQuery, GetClinicQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicQuery, GetClinicQueryVariables>;
export function useGetClinicSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicQuery, GetClinicQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicQuery | undefined, GetClinicQueryVariables>;
export function useGetClinicSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicQuery, GetClinicQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetClinicQuery, GetClinicQueryVariables>(GetClinicDocument, options);
        }
export type GetClinicQueryHookResult = ReturnType<typeof useGetClinicQuery>;
export type GetClinicLazyQueryHookResult = ReturnType<typeof useGetClinicLazyQuery>;
export type GetClinicSuspenseQueryHookResult = ReturnType<typeof useGetClinicSuspenseQuery>;
export type GetClinicQueryResult = ApolloReactCommon.QueryResult<GetClinicQuery, GetClinicQueryVariables>;
export const UpdateClinicDocument = gql`
    mutation UpdateClinic($clinicId: bigint!, $name: String, $timezone: String, $phone: String, $fax: String, $website: String, $email: String, $addressStreet: String, $addressUnit: String, $addressCity: String, $addressProvince: String, $addressPostal: String, $billingNumber: String) {
  update_clinic(
    where: {id: {_eq: $clinicId}}
    _set: {name: $name, timezone: $timezone, phone: $phone, fax: $fax, website: $website, email: $email, address_street: $addressStreet, address_unit: $addressUnit, address_city: $addressCity, address_province: $addressProvince, address_postal: $addressPostal, billing_number: $billingNumber}
  ) {
    affected_rows
    returning {
      id
      name
      timezone
      phone
      fax
      website
      email
      address_street
      address_unit
      address_city
      address_province
      address_postal
      billing_number
      is_active
      updated_at
    }
  }
}
    `;
export type UpdateClinicMutationFn = ApolloReactCommon.MutationFunction<UpdateClinicMutation, UpdateClinicMutationVariables>;

/**
 * __useUpdateClinicMutation__
 *
 * To run a mutation, you first call `useUpdateClinicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClinicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClinicMutation, { data, loading, error }] = useUpdateClinicMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      name: // value for 'name'
 *      timezone: // value for 'timezone'
 *      phone: // value for 'phone'
 *      fax: // value for 'fax'
 *      website: // value for 'website'
 *      email: // value for 'email'
 *      addressStreet: // value for 'addressStreet'
 *      addressUnit: // value for 'addressUnit'
 *      addressCity: // value for 'addressCity'
 *      addressProvince: // value for 'addressProvince'
 *      addressPostal: // value for 'addressPostal'
 *      billingNumber: // value for 'billingNumber'
 *   },
 * });
 */
export function useUpdateClinicMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateClinicMutation, UpdateClinicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateClinicMutation, UpdateClinicMutationVariables>(UpdateClinicDocument, options);
      }
export type UpdateClinicMutationHookResult = ReturnType<typeof useUpdateClinicMutation>;
export type UpdateClinicMutationResult = ApolloReactCommon.MutationResult<UpdateClinicMutation>;
export type UpdateClinicMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateClinicMutation, UpdateClinicMutationVariables>;
export const GetClinicHoursDocument = gql`
    query GetClinicHours($clinicId: bigint!) {
  clinic_hours(
    where: {clinic_id: {_eq: $clinicId}, is_active: {_eq: true}}
    order_by: {day_of_week: asc}
  ) {
    id
    clinic_id
    day_of_week
    is_closed
    open_time
    close_time
    appointment_start
    appointment_end
    is_active
  }
}
    `;

/**
 * __useGetClinicHoursQuery__
 *
 * To run a query within a React component, call `useGetClinicHoursQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClinicHoursQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClinicHoursQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetClinicHoursQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetClinicHoursQuery, GetClinicHoursQueryVariables> & ({ variables: GetClinicHoursQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetClinicHoursQuery, GetClinicHoursQueryVariables>(GetClinicHoursDocument, options);
      }
export function useGetClinicHoursLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClinicHoursQuery, GetClinicHoursQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetClinicHoursQuery, GetClinicHoursQueryVariables>(GetClinicHoursDocument, options);
        }
// @ts-ignore
export function useGetClinicHoursSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetClinicHoursQuery, GetClinicHoursQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicHoursQuery, GetClinicHoursQueryVariables>;
export function useGetClinicHoursSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicHoursQuery, GetClinicHoursQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicHoursQuery | undefined, GetClinicHoursQueryVariables>;
export function useGetClinicHoursSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicHoursQuery, GetClinicHoursQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetClinicHoursQuery, GetClinicHoursQueryVariables>(GetClinicHoursDocument, options);
        }
export type GetClinicHoursQueryHookResult = ReturnType<typeof useGetClinicHoursQuery>;
export type GetClinicHoursLazyQueryHookResult = ReturnType<typeof useGetClinicHoursLazyQuery>;
export type GetClinicHoursSuspenseQueryHookResult = ReturnType<typeof useGetClinicHoursSuspenseQuery>;
export type GetClinicHoursQueryResult = ApolloReactCommon.QueryResult<GetClinicHoursQuery, GetClinicHoursQueryVariables>;
export const UpsertClinicHoursDocument = gql`
    mutation UpsertClinicHours($hours: [clinic_hours_insert_input!]!) {
  insert_clinic_hours(
    objects: $hours
    on_conflict: {constraint: clinic_hours_clinic_id_day_of_week_key, update_columns: [is_closed, open_time, close_time, appointment_start, appointment_end, is_active]}
  ) {
    affected_rows
    returning {
      id
      clinic_id
      day_of_week
      is_closed
      open_time
      close_time
      appointment_start
      appointment_end
      is_active
    }
  }
}
    `;
export type UpsertClinicHoursMutationFn = ApolloReactCommon.MutationFunction<UpsertClinicHoursMutation, UpsertClinicHoursMutationVariables>;

/**
 * __useUpsertClinicHoursMutation__
 *
 * To run a mutation, you first call `useUpsertClinicHoursMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertClinicHoursMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertClinicHoursMutation, { data, loading, error }] = useUpsertClinicHoursMutation({
 *   variables: {
 *      hours: // value for 'hours'
 *   },
 * });
 */
export function useUpsertClinicHoursMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpsertClinicHoursMutation, UpsertClinicHoursMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpsertClinicHoursMutation, UpsertClinicHoursMutationVariables>(UpsertClinicHoursDocument, options);
      }
export type UpsertClinicHoursMutationHookResult = ReturnType<typeof useUpsertClinicHoursMutation>;
export type UpsertClinicHoursMutationResult = ApolloReactCommon.MutationResult<UpsertClinicHoursMutation>;
export type UpsertClinicHoursMutationOptions = ApolloReactCommon.BaseMutationOptions<UpsertClinicHoursMutation, UpsertClinicHoursMutationVariables>;
export const DeleteClinicHoursDocument = gql`
    mutation DeleteClinicHours($clinicId: bigint!) {
  delete_clinic_hours(where: {clinic_id: {_eq: $clinicId}}) {
    affected_rows
  }
}
    `;
export type DeleteClinicHoursMutationFn = ApolloReactCommon.MutationFunction<DeleteClinicHoursMutation, DeleteClinicHoursMutationVariables>;

/**
 * __useDeleteClinicHoursMutation__
 *
 * To run a mutation, you first call `useDeleteClinicHoursMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClinicHoursMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClinicHoursMutation, { data, loading, error }] = useDeleteClinicHoursMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useDeleteClinicHoursMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteClinicHoursMutation, DeleteClinicHoursMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteClinicHoursMutation, DeleteClinicHoursMutationVariables>(DeleteClinicHoursDocument, options);
      }
export type DeleteClinicHoursMutationHookResult = ReturnType<typeof useDeleteClinicHoursMutation>;
export type DeleteClinicHoursMutationResult = ApolloReactCommon.MutationResult<DeleteClinicHoursMutation>;
export type DeleteClinicHoursMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteClinicHoursMutation, DeleteClinicHoursMutationVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  app_user_v {
    id
    email
    first_name
    last_name
    is_active
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
// @ts-ignore
export function useGetCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export function useGetCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetCurrentUserQuery | undefined, GetCurrentUserQueryVariables>;
export function useGetCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = ApolloReactCommon.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetCurrentUserWithClinicDocument = gql`
    query GetCurrentUserWithClinic {
  app_user_v {
    id
    email
    first_name
    last_name
    is_active
    created_at
    updated_at
    current_clinic_id
  }
  clinic_user_v(where: {is_active: {_eq: true}}) {
    id
    clinic_id
    user_id
    joined_at
  }
  clinic_v {
    id
    name
    timezone
    phone
    fax
    website
    email
    address_street
    address_unit
    address_city
    address_province
    address_postal
    billing_number
    is_active
  }
}
    `;

/**
 * __useGetCurrentUserWithClinicQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserWithClinicQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserWithClinicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserWithClinicQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserWithClinicQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>(GetCurrentUserWithClinicDocument, options);
      }
export function useGetCurrentUserWithClinicLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>(GetCurrentUserWithClinicDocument, options);
        }
// @ts-ignore
export function useGetCurrentUserWithClinicSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>;
export function useGetCurrentUserWithClinicSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetCurrentUserWithClinicQuery | undefined, GetCurrentUserWithClinicQueryVariables>;
export function useGetCurrentUserWithClinicSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>(GetCurrentUserWithClinicDocument, options);
        }
export type GetCurrentUserWithClinicQueryHookResult = ReturnType<typeof useGetCurrentUserWithClinicQuery>;
export type GetCurrentUserWithClinicLazyQueryHookResult = ReturnType<typeof useGetCurrentUserWithClinicLazyQuery>;
export type GetCurrentUserWithClinicSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserWithClinicSuspenseQuery>;
export type GetCurrentUserWithClinicQueryResult = ApolloReactCommon.QueryResult<GetCurrentUserWithClinicQuery, GetCurrentUserWithClinicQueryVariables>;
export const UpdateCurrentClinicDocument = gql`
    mutation UpdateCurrentClinic($userId: uuid!, $clinicId: bigint!) {
  update_app_user_v(
    where: {id: {_eq: $userId}}
    _set: {current_clinic_id: $clinicId}
  ) {
    affected_rows
    returning {
      id
      current_clinic_id
    }
  }
}
    `;
export type UpdateCurrentClinicMutationFn = ApolloReactCommon.MutationFunction<UpdateCurrentClinicMutation, UpdateCurrentClinicMutationVariables>;

/**
 * __useUpdateCurrentClinicMutation__
 *
 * To run a mutation, you first call `useUpdateCurrentClinicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCurrentClinicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCurrentClinicMutation, { data, loading, error }] = useUpdateCurrentClinicMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useUpdateCurrentClinicMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCurrentClinicMutation, UpdateCurrentClinicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateCurrentClinicMutation, UpdateCurrentClinicMutationVariables>(UpdateCurrentClinicDocument, options);
      }
export type UpdateCurrentClinicMutationHookResult = ReturnType<typeof useUpdateCurrentClinicMutation>;
export type UpdateCurrentClinicMutationResult = ApolloReactCommon.MutationResult<UpdateCurrentClinicMutation>;
export type UpdateCurrentClinicMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCurrentClinicMutation, UpdateCurrentClinicMutationVariables>;
export const GetUserClinicsDocument = gql`
    query GetUserClinics {
  clinic_user_v(where: {is_active: {_eq: true}}) {
    id
    clinic_id
    user_id
    is_active
    joined_at
    clinic {
      id
      name
      timezone
      phone
      fax
      website
      email
      address_street
      address_unit
      address_city
      address_province
      address_postal
      billing_number
      is_active
    }
  }
}
    `;

/**
 * __useGetUserClinicsQuery__
 *
 * To run a query within a React component, call `useGetUserClinicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserClinicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserClinicsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserClinicsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserClinicsQuery, GetUserClinicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserClinicsQuery, GetUserClinicsQueryVariables>(GetUserClinicsDocument, options);
      }
export function useGetUserClinicsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserClinicsQuery, GetUserClinicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserClinicsQuery, GetUserClinicsQueryVariables>(GetUserClinicsDocument, options);
        }
// @ts-ignore
export function useGetUserClinicsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUserClinicsQuery, GetUserClinicsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserClinicsQuery, GetUserClinicsQueryVariables>;
export function useGetUserClinicsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserClinicsQuery, GetUserClinicsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserClinicsQuery | undefined, GetUserClinicsQueryVariables>;
export function useGetUserClinicsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserClinicsQuery, GetUserClinicsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserClinicsQuery, GetUserClinicsQueryVariables>(GetUserClinicsDocument, options);
        }
export type GetUserClinicsQueryHookResult = ReturnType<typeof useGetUserClinicsQuery>;
export type GetUserClinicsLazyQueryHookResult = ReturnType<typeof useGetUserClinicsLazyQuery>;
export type GetUserClinicsSuspenseQueryHookResult = ReturnType<typeof useGetUserClinicsSuspenseQuery>;
export type GetUserClinicsQueryResult = ApolloReactCommon.QueryResult<GetUserClinicsQuery, GetUserClinicsQueryVariables>;
export const GetOperatoriesDocument = gql`
    query GetOperatories($clinicId: bigint!) {
  operatory_v(where: {clinic_id: {_eq: $clinicId}}, order_by: {name: asc}) {
    id
    clinic_id
    name
    is_bookable
    is_active
    color
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetOperatoriesQuery__
 *
 * To run a query within a React component, call `useGetOperatoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOperatoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOperatoriesQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetOperatoriesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetOperatoriesQuery, GetOperatoriesQueryVariables> & ({ variables: GetOperatoriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetOperatoriesQuery, GetOperatoriesQueryVariables>(GetOperatoriesDocument, options);
      }
export function useGetOperatoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOperatoriesQuery, GetOperatoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetOperatoriesQuery, GetOperatoriesQueryVariables>(GetOperatoriesDocument, options);
        }
// @ts-ignore
export function useGetOperatoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetOperatoriesQuery, GetOperatoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetOperatoriesQuery, GetOperatoriesQueryVariables>;
export function useGetOperatoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOperatoriesQuery, GetOperatoriesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetOperatoriesQuery | undefined, GetOperatoriesQueryVariables>;
export function useGetOperatoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetOperatoriesQuery, GetOperatoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetOperatoriesQuery, GetOperatoriesQueryVariables>(GetOperatoriesDocument, options);
        }
export type GetOperatoriesQueryHookResult = ReturnType<typeof useGetOperatoriesQuery>;
export type GetOperatoriesLazyQueryHookResult = ReturnType<typeof useGetOperatoriesLazyQuery>;
export type GetOperatoriesSuspenseQueryHookResult = ReturnType<typeof useGetOperatoriesSuspenseQuery>;
export type GetOperatoriesQueryResult = ApolloReactCommon.QueryResult<GetOperatoriesQuery, GetOperatoriesQueryVariables>;
export const CreateOperatoryDocument = gql`
    mutation CreateOperatory($clinicId: bigint!, $name: String!, $isBookable: Boolean!, $isActive: Boolean!, $color: String!) {
  insert_operatory_one(
    object: {clinic_id: $clinicId, name: $name, is_bookable: $isBookable, is_active: $isActive, color: $color}
  ) {
    id
    clinic_id
    name
    is_bookable
    is_active
    color
    created_at
    updated_at
  }
}
    `;
export type CreateOperatoryMutationFn = ApolloReactCommon.MutationFunction<CreateOperatoryMutation, CreateOperatoryMutationVariables>;

/**
 * __useCreateOperatoryMutation__
 *
 * To run a mutation, you first call `useCreateOperatoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOperatoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOperatoryMutation, { data, loading, error }] = useCreateOperatoryMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      name: // value for 'name'
 *      isBookable: // value for 'isBookable'
 *      isActive: // value for 'isActive'
 *      color: // value for 'color'
 *   },
 * });
 */
export function useCreateOperatoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateOperatoryMutation, CreateOperatoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateOperatoryMutation, CreateOperatoryMutationVariables>(CreateOperatoryDocument, options);
      }
export type CreateOperatoryMutationHookResult = ReturnType<typeof useCreateOperatoryMutation>;
export type CreateOperatoryMutationResult = ApolloReactCommon.MutationResult<CreateOperatoryMutation>;
export type CreateOperatoryMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateOperatoryMutation, CreateOperatoryMutationVariables>;
export const UpdateOperatoryDocument = gql`
    mutation UpdateOperatory($id: bigint!, $name: String, $isBookable: Boolean, $isActive: Boolean, $color: String) {
  update_operatory_by_pk(
    pk_columns: {id: $id}
    _set: {name: $name, is_bookable: $isBookable, is_active: $isActive, color: $color}
  ) {
    id
    clinic_id
    name
    is_bookable
    is_active
    color
    updated_at
  }
}
    `;
export type UpdateOperatoryMutationFn = ApolloReactCommon.MutationFunction<UpdateOperatoryMutation, UpdateOperatoryMutationVariables>;

/**
 * __useUpdateOperatoryMutation__
 *
 * To run a mutation, you first call `useUpdateOperatoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOperatoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOperatoryMutation, { data, loading, error }] = useUpdateOperatoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      isBookable: // value for 'isBookable'
 *      isActive: // value for 'isActive'
 *      color: // value for 'color'
 *   },
 * });
 */
export function useUpdateOperatoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOperatoryMutation, UpdateOperatoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateOperatoryMutation, UpdateOperatoryMutationVariables>(UpdateOperatoryDocument, options);
      }
export type UpdateOperatoryMutationHookResult = ReturnType<typeof useUpdateOperatoryMutation>;
export type UpdateOperatoryMutationResult = ApolloReactCommon.MutationResult<UpdateOperatoryMutation>;
export type UpdateOperatoryMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateOperatoryMutation, UpdateOperatoryMutationVariables>;
export const DeleteOperatoryDocument = gql`
    mutation DeleteOperatory($id: bigint!) {
  delete_operatory_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteOperatoryMutationFn = ApolloReactCommon.MutationFunction<DeleteOperatoryMutation, DeleteOperatoryMutationVariables>;

/**
 * __useDeleteOperatoryMutation__
 *
 * To run a mutation, you first call `useDeleteOperatoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOperatoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOperatoryMutation, { data, loading, error }] = useDeleteOperatoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOperatoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteOperatoryMutation, DeleteOperatoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteOperatoryMutation, DeleteOperatoryMutationVariables>(DeleteOperatoryDocument, options);
      }
export type DeleteOperatoryMutationHookResult = ReturnType<typeof useDeleteOperatoryMutation>;
export type DeleteOperatoryMutationResult = ApolloReactCommon.MutationResult<DeleteOperatoryMutation>;
export type DeleteOperatoryMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteOperatoryMutation, DeleteOperatoryMutationVariables>;
export const GetRolesDocument = gql`
    query GetRoles($clinicId: bigint!) {
  role_v(where: {clinic_id: {_eq: $clinicId}, is_active: {_eq: true}}) {
    id
    name
    description
    clinic_id
    is_active
  }
}
    `;

/**
 * __useGetRolesQuery__
 *
 * To run a query within a React component, call `useGetRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolesQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetRolesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRolesQuery, GetRolesQueryVariables> & ({ variables: GetRolesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
      }
export function useGetRolesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
// @ts-ignore
export function useGetRolesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRolesQuery, GetRolesQueryVariables>;
export function useGetRolesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRolesQuery | undefined, GetRolesQueryVariables>;
export function useGetRolesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRolesQuery, GetRolesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRolesQuery, GetRolesQueryVariables>(GetRolesDocument, options);
        }
export type GetRolesQueryHookResult = ReturnType<typeof useGetRolesQuery>;
export type GetRolesLazyQueryHookResult = ReturnType<typeof useGetRolesLazyQuery>;
export type GetRolesSuspenseQueryHookResult = ReturnType<typeof useGetRolesSuspenseQuery>;
export type GetRolesQueryResult = ApolloReactCommon.QueryResult<GetRolesQuery, GetRolesQueryVariables>;
export const GetCapabilitiesDocument = gql`
    query GetCapabilities {
  capability(where: {is_deprecated: {_eq: false}}) {
    key
    description
    module
  }
}
    `;

/**
 * __useGetCapabilitiesQuery__
 *
 * To run a query within a React component, call `useGetCapabilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCapabilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCapabilitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCapabilitiesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>(GetCapabilitiesDocument, options);
      }
export function useGetCapabilitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>(GetCapabilitiesDocument, options);
        }
// @ts-ignore
export function useGetCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>;
export function useGetCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetCapabilitiesQuery | undefined, GetCapabilitiesQueryVariables>;
export function useGetCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>(GetCapabilitiesDocument, options);
        }
export type GetCapabilitiesQueryHookResult = ReturnType<typeof useGetCapabilitiesQuery>;
export type GetCapabilitiesLazyQueryHookResult = ReturnType<typeof useGetCapabilitiesLazyQuery>;
export type GetCapabilitiesSuspenseQueryHookResult = ReturnType<typeof useGetCapabilitiesSuspenseQuery>;
export type GetCapabilitiesQueryResult = ApolloReactCommon.QueryResult<GetCapabilitiesQuery, GetCapabilitiesQueryVariables>;
export const GetRoleCapabilitiesDocument = gql`
    query GetRoleCapabilities($roleId: bigint!) {
  role_capability(where: {role_id: {_eq: $roleId}}) {
    capability_key
    role_id
  }
}
    `;

/**
 * __useGetRoleCapabilitiesQuery__
 *
 * To run a query within a React component, call `useGetRoleCapabilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoleCapabilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoleCapabilitiesQuery({
 *   variables: {
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useGetRoleCapabilitiesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables> & ({ variables: GetRoleCapabilitiesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>(GetRoleCapabilitiesDocument, options);
      }
export function useGetRoleCapabilitiesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>(GetRoleCapabilitiesDocument, options);
        }
// @ts-ignore
export function useGetRoleCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>;
export function useGetRoleCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetRoleCapabilitiesQuery | undefined, GetRoleCapabilitiesQueryVariables>;
export function useGetRoleCapabilitiesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>(GetRoleCapabilitiesDocument, options);
        }
export type GetRoleCapabilitiesQueryHookResult = ReturnType<typeof useGetRoleCapabilitiesQuery>;
export type GetRoleCapabilitiesLazyQueryHookResult = ReturnType<typeof useGetRoleCapabilitiesLazyQuery>;
export type GetRoleCapabilitiesSuspenseQueryHookResult = ReturnType<typeof useGetRoleCapabilitiesSuspenseQuery>;
export type GetRoleCapabilitiesQueryResult = ApolloReactCommon.QueryResult<GetRoleCapabilitiesQuery, GetRoleCapabilitiesQueryVariables>;
export const GetUserRolesDocument = gql`
    query GetUserRoles($clinicUserId: bigint!) {
  clinic_user_role(where: {clinic_user_id: {_eq: $clinicUserId}}) {
    role_id
    clinic_user_id
  }
}
    `;

/**
 * __useGetUserRolesQuery__
 *
 * To run a query within a React component, call `useGetUserRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserRolesQuery({
 *   variables: {
 *      clinicUserId: // value for 'clinicUserId'
 *   },
 * });
 */
export function useGetUserRolesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserRolesQuery, GetUserRolesQueryVariables> & ({ variables: GetUserRolesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserRolesQuery, GetUserRolesQueryVariables>(GetUserRolesDocument, options);
      }
export function useGetUserRolesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserRolesQuery, GetUserRolesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserRolesQuery, GetUserRolesQueryVariables>(GetUserRolesDocument, options);
        }
// @ts-ignore
export function useGetUserRolesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUserRolesQuery, GetUserRolesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserRolesQuery, GetUserRolesQueryVariables>;
export function useGetUserRolesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserRolesQuery, GetUserRolesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserRolesQuery | undefined, GetUserRolesQueryVariables>;
export function useGetUserRolesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserRolesQuery, GetUserRolesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserRolesQuery, GetUserRolesQueryVariables>(GetUserRolesDocument, options);
        }
export type GetUserRolesQueryHookResult = ReturnType<typeof useGetUserRolesQuery>;
export type GetUserRolesLazyQueryHookResult = ReturnType<typeof useGetUserRolesLazyQuery>;
export type GetUserRolesSuspenseQueryHookResult = ReturnType<typeof useGetUserRolesSuspenseQuery>;
export type GetUserRolesQueryResult = ApolloReactCommon.QueryResult<GetUserRolesQuery, GetUserRolesQueryVariables>;
export const GetAppUsersDocument = gql`
    query GetAppUsers {
  app_user_v {
    id
    email
    first_name
    last_name
    is_active
  }
}
    `;

/**
 * __useGetAppUsersQuery__
 *
 * To run a query within a React component, call `useGetAppUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAppUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAppUsersQuery, GetAppUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAppUsersQuery, GetAppUsersQueryVariables>(GetAppUsersDocument, options);
      }
export function useGetAppUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAppUsersQuery, GetAppUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAppUsersQuery, GetAppUsersQueryVariables>(GetAppUsersDocument, options);
        }
// @ts-ignore
export function useGetAppUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetAppUsersQuery, GetAppUsersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetAppUsersQuery, GetAppUsersQueryVariables>;
export function useGetAppUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAppUsersQuery, GetAppUsersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetAppUsersQuery | undefined, GetAppUsersQueryVariables>;
export function useGetAppUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAppUsersQuery, GetAppUsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAppUsersQuery, GetAppUsersQueryVariables>(GetAppUsersDocument, options);
        }
export type GetAppUsersQueryHookResult = ReturnType<typeof useGetAppUsersQuery>;
export type GetAppUsersLazyQueryHookResult = ReturnType<typeof useGetAppUsersLazyQuery>;
export type GetAppUsersSuspenseQueryHookResult = ReturnType<typeof useGetAppUsersSuspenseQuery>;
export type GetAppUsersQueryResult = ApolloReactCommon.QueryResult<GetAppUsersQuery, GetAppUsersQueryVariables>;
export const GetAppUserDocument = gql`
    query GetAppUser($userId: uuid!) {
  app_user_v(where: {id: {_eq: $userId}}) {
    id
    email
    first_name
    last_name
    is_active
  }
}
    `;

/**
 * __useGetAppUserQuery__
 *
 * To run a query within a React component, call `useGetAppUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetAppUserQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAppUserQuery, GetAppUserQueryVariables> & ({ variables: GetAppUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAppUserQuery, GetAppUserQueryVariables>(GetAppUserDocument, options);
      }
export function useGetAppUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAppUserQuery, GetAppUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAppUserQuery, GetAppUserQueryVariables>(GetAppUserDocument, options);
        }
// @ts-ignore
export function useGetAppUserSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetAppUserQuery, GetAppUserQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetAppUserQuery, GetAppUserQueryVariables>;
export function useGetAppUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAppUserQuery, GetAppUserQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetAppUserQuery | undefined, GetAppUserQueryVariables>;
export function useGetAppUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAppUserQuery, GetAppUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAppUserQuery, GetAppUserQueryVariables>(GetAppUserDocument, options);
        }
export type GetAppUserQueryHookResult = ReturnType<typeof useGetAppUserQuery>;
export type GetAppUserLazyQueryHookResult = ReturnType<typeof useGetAppUserLazyQuery>;
export type GetAppUserSuspenseQueryHookResult = ReturnType<typeof useGetAppUserSuspenseQuery>;
export type GetAppUserQueryResult = ApolloReactCommon.QueryResult<GetAppUserQuery, GetAppUserQueryVariables>;
export const UpdateUserProfileDocument = gql`
    mutation UpdateUserProfile($userId: uuid!, $userKind: String, $licenseNo: String, $schedulerColor: String, $isActive: Boolean) {
  update_user_profile(
    where: {user_id: {_eq: $userId}}
    _set: {user_kind: $userKind, license_no: $licenseNo, scheduler_color: $schedulerColor, is_active: $isActive}
  ) {
    affected_rows
    returning {
      user_id
      user_kind
      license_no
      scheduler_color
      is_active
    }
  }
}
    `;
export type UpdateUserProfileMutationFn = ApolloReactCommon.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      userKind: // value for 'userKind'
 *      licenseNo: // value for 'licenseNo'
 *      schedulerColor: // value for 'schedulerColor'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = ApolloReactCommon.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const UpdateClinicUserMembershipDocument = gql`
    mutation UpdateClinicUserMembership($clinicId: bigint!, $userId: uuid!, $jobTitle: String, $isSchedulable: Boolean, $providerKind: String, $defaultOperatoryId: bigint, $schedulerColor: String, $isActive: Boolean) {
  update_clinic_user(
    where: {clinic_id: {_eq: $clinicId}, user_id: {_eq: $userId}}
    _set: {job_title: $jobTitle, is_schedulable: $isSchedulable, provider_kind: $providerKind, default_operatory_id: $defaultOperatoryId, scheduler_color: $schedulerColor, is_active: $isActive}
  ) {
    affected_rows
    returning {
      id
      clinic_id
      user_id
      job_title
      is_schedulable
      provider_kind
      default_operatory_id
      scheduler_color
      is_active
    }
  }
}
    `;
export type UpdateClinicUserMembershipMutationFn = ApolloReactCommon.MutationFunction<UpdateClinicUserMembershipMutation, UpdateClinicUserMembershipMutationVariables>;

/**
 * __useUpdateClinicUserMembershipMutation__
 *
 * To run a mutation, you first call `useUpdateClinicUserMembershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClinicUserMembershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClinicUserMembershipMutation, { data, loading, error }] = useUpdateClinicUserMembershipMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      userId: // value for 'userId'
 *      jobTitle: // value for 'jobTitle'
 *      isSchedulable: // value for 'isSchedulable'
 *      providerKind: // value for 'providerKind'
 *      defaultOperatoryId: // value for 'defaultOperatoryId'
 *      schedulerColor: // value for 'schedulerColor'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useUpdateClinicUserMembershipMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateClinicUserMembershipMutation, UpdateClinicUserMembershipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateClinicUserMembershipMutation, UpdateClinicUserMembershipMutationVariables>(UpdateClinicUserMembershipDocument, options);
      }
export type UpdateClinicUserMembershipMutationHookResult = ReturnType<typeof useUpdateClinicUserMembershipMutation>;
export type UpdateClinicUserMembershipMutationResult = ApolloReactCommon.MutationResult<UpdateClinicUserMembershipMutation>;
export type UpdateClinicUserMembershipMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateClinicUserMembershipMutation, UpdateClinicUserMembershipMutationVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($clinicId: bigint!, $name: String!, $description: String, $isActive: Boolean) {
  insert_role_one(
    object: {clinic_id: $clinicId, name: $name, description: $description, is_active: $isActive}
  ) {
    id
    clinic_id
    name
    description
    is_active
  }
}
    `;
export type CreateRoleMutationFn = ApolloReactCommon.MutationFunction<CreateRoleMutation, CreateRoleMutationVariables>;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoleMutation, { data, loading, error }] = useCreateRoleMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useCreateRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRoleMutation, CreateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
      }
export type CreateRoleMutationHookResult = ReturnType<typeof useCreateRoleMutation>;
export type CreateRoleMutationResult = ApolloReactCommon.MutationResult<CreateRoleMutation>;
export type CreateRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($roleId: bigint!, $name: String, $description: String, $isActive: Boolean) {
  update_role_by_pk(
    pk_columns: {id: $roleId}
    _set: {name: $name, description: $description, is_active: $isActive}
  ) {
    id
    name
    description
    is_active
  }
}
    `;
export type UpdateRoleMutationFn = ApolloReactCommon.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useUpdateRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, options);
      }
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = ApolloReactCommon.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const AddCapabilityToRoleDocument = gql`
    mutation AddCapabilityToRole($roleId: bigint!, $capabilityKey: String!) {
  insert_role_capability_one(
    object: {role_id: $roleId, capability_key: $capabilityKey}
  ) {
    role_id
    capability_key
  }
}
    `;
export type AddCapabilityToRoleMutationFn = ApolloReactCommon.MutationFunction<AddCapabilityToRoleMutation, AddCapabilityToRoleMutationVariables>;

/**
 * __useAddCapabilityToRoleMutation__
 *
 * To run a mutation, you first call `useAddCapabilityToRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCapabilityToRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCapabilityToRoleMutation, { data, loading, error }] = useAddCapabilityToRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *      capabilityKey: // value for 'capabilityKey'
 *   },
 * });
 */
export function useAddCapabilityToRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddCapabilityToRoleMutation, AddCapabilityToRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddCapabilityToRoleMutation, AddCapabilityToRoleMutationVariables>(AddCapabilityToRoleDocument, options);
      }
export type AddCapabilityToRoleMutationHookResult = ReturnType<typeof useAddCapabilityToRoleMutation>;
export type AddCapabilityToRoleMutationResult = ApolloReactCommon.MutationResult<AddCapabilityToRoleMutation>;
export type AddCapabilityToRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<AddCapabilityToRoleMutation, AddCapabilityToRoleMutationVariables>;
export const RemoveCapabilityFromRoleDocument = gql`
    mutation RemoveCapabilityFromRole($roleId: bigint!, $capabilityKey: String!) {
  delete_role_capability(
    where: {role_id: {_eq: $roleId}, capability_key: {_eq: $capabilityKey}}
  ) {
    affected_rows
  }
}
    `;
export type RemoveCapabilityFromRoleMutationFn = ApolloReactCommon.MutationFunction<RemoveCapabilityFromRoleMutation, RemoveCapabilityFromRoleMutationVariables>;

/**
 * __useRemoveCapabilityFromRoleMutation__
 *
 * To run a mutation, you first call `useRemoveCapabilityFromRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCapabilityFromRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCapabilityFromRoleMutation, { data, loading, error }] = useRemoveCapabilityFromRoleMutation({
 *   variables: {
 *      roleId: // value for 'roleId'
 *      capabilityKey: // value for 'capabilityKey'
 *   },
 * });
 */
export function useRemoveCapabilityFromRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveCapabilityFromRoleMutation, RemoveCapabilityFromRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveCapabilityFromRoleMutation, RemoveCapabilityFromRoleMutationVariables>(RemoveCapabilityFromRoleDocument, options);
      }
export type RemoveCapabilityFromRoleMutationHookResult = ReturnType<typeof useRemoveCapabilityFromRoleMutation>;
export type RemoveCapabilityFromRoleMutationResult = ApolloReactCommon.MutationResult<RemoveCapabilityFromRoleMutation>;
export type RemoveCapabilityFromRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveCapabilityFromRoleMutation, RemoveCapabilityFromRoleMutationVariables>;
export const AssignRoleToUserDocument = gql`
    mutation AssignRoleToUser($clinicUserId: bigint!, $roleId: bigint!) {
  insert_clinic_user_role_one(
    object: {clinic_user_id: $clinicUserId, role_id: $roleId}
  ) {
    clinic_user_id
    role_id
  }
}
    `;
export type AssignRoleToUserMutationFn = ApolloReactCommon.MutationFunction<AssignRoleToUserMutation, AssignRoleToUserMutationVariables>;

/**
 * __useAssignRoleToUserMutation__
 *
 * To run a mutation, you first call `useAssignRoleToUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignRoleToUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignRoleToUserMutation, { data, loading, error }] = useAssignRoleToUserMutation({
 *   variables: {
 *      clinicUserId: // value for 'clinicUserId'
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useAssignRoleToUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AssignRoleToUserMutation, AssignRoleToUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AssignRoleToUserMutation, AssignRoleToUserMutationVariables>(AssignRoleToUserDocument, options);
      }
export type AssignRoleToUserMutationHookResult = ReturnType<typeof useAssignRoleToUserMutation>;
export type AssignRoleToUserMutationResult = ApolloReactCommon.MutationResult<AssignRoleToUserMutation>;
export type AssignRoleToUserMutationOptions = ApolloReactCommon.BaseMutationOptions<AssignRoleToUserMutation, AssignRoleToUserMutationVariables>;
export const RemoveRoleFromUserDocument = gql`
    mutation RemoveRoleFromUser($clinicUserId: bigint!, $roleId: bigint!) {
  delete_clinic_user_role(
    where: {clinic_user_id: {_eq: $clinicUserId}, role_id: {_eq: $roleId}}
  ) {
    affected_rows
  }
}
    `;
export type RemoveRoleFromUserMutationFn = ApolloReactCommon.MutationFunction<RemoveRoleFromUserMutation, RemoveRoleFromUserMutationVariables>;

/**
 * __useRemoveRoleFromUserMutation__
 *
 * To run a mutation, you first call `useRemoveRoleFromUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveRoleFromUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeRoleFromUserMutation, { data, loading, error }] = useRemoveRoleFromUserMutation({
 *   variables: {
 *      clinicUserId: // value for 'clinicUserId'
 *      roleId: // value for 'roleId'
 *   },
 * });
 */
export function useRemoveRoleFromUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveRoleFromUserMutation, RemoveRoleFromUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveRoleFromUserMutation, RemoveRoleFromUserMutationVariables>(RemoveRoleFromUserDocument, options);
      }
export type RemoveRoleFromUserMutationHookResult = ReturnType<typeof useRemoveRoleFromUserMutation>;
export type RemoveRoleFromUserMutationResult = ApolloReactCommon.MutationResult<RemoveRoleFromUserMutation>;
export type RemoveRoleFromUserMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveRoleFromUserMutation, RemoveRoleFromUserMutationVariables>;
export const CreateProviderIdentifierDocument = gql`
    mutation CreateProviderIdentifier($userId: uuid!, $identifierKind: String!, $provinceCode: String!, $licenseType: String!, $identifierValue: String!, $effectiveFrom: date, $effectiveTo: date, $isActive: Boolean!) {
  insert_user_provider_identifier_one(
    object: {user_id: $userId, identifier_kind: $identifierKind, province_code: $provinceCode, license_type: $licenseType, identifier_value: $identifierValue, effective_from: $effectiveFrom, effective_to: $effectiveTo, is_active: $isActive}
  ) {
    id
    user_id
    identifier_kind
    province_code
    license_type
    identifier_value
    effective_from
    effective_to
    is_active
  }
}
    `;
export type CreateProviderIdentifierMutationFn = ApolloReactCommon.MutationFunction<CreateProviderIdentifierMutation, CreateProviderIdentifierMutationVariables>;

/**
 * __useCreateProviderIdentifierMutation__
 *
 * To run a mutation, you first call `useCreateProviderIdentifierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProviderIdentifierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProviderIdentifierMutation, { data, loading, error }] = useCreateProviderIdentifierMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      identifierKind: // value for 'identifierKind'
 *      provinceCode: // value for 'provinceCode'
 *      licenseType: // value for 'licenseType'
 *      identifierValue: // value for 'identifierValue'
 *      effectiveFrom: // value for 'effectiveFrom'
 *      effectiveTo: // value for 'effectiveTo'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useCreateProviderIdentifierMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProviderIdentifierMutation, CreateProviderIdentifierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateProviderIdentifierMutation, CreateProviderIdentifierMutationVariables>(CreateProviderIdentifierDocument, options);
      }
export type CreateProviderIdentifierMutationHookResult = ReturnType<typeof useCreateProviderIdentifierMutation>;
export type CreateProviderIdentifierMutationResult = ApolloReactCommon.MutationResult<CreateProviderIdentifierMutation>;
export type CreateProviderIdentifierMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProviderIdentifierMutation, CreateProviderIdentifierMutationVariables>;
export const UpdateProviderIdentifierDocument = gql`
    mutation UpdateProviderIdentifier($id: bigint!, $provinceCode: String, $licenseType: String, $identifierValue: String, $effectiveFrom: date, $effectiveTo: date, $isActive: Boolean) {
  update_user_provider_identifier_by_pk(
    pk_columns: {id: $id}
    _set: {province_code: $provinceCode, license_type: $licenseType, identifier_value: $identifierValue, effective_from: $effectiveFrom, effective_to: $effectiveTo, is_active: $isActive}
  ) {
    id
    province_code
    license_type
    identifier_value
    effective_from
    effective_to
    is_active
  }
}
    `;
export type UpdateProviderIdentifierMutationFn = ApolloReactCommon.MutationFunction<UpdateProviderIdentifierMutation, UpdateProviderIdentifierMutationVariables>;

/**
 * __useUpdateProviderIdentifierMutation__
 *
 * To run a mutation, you first call `useUpdateProviderIdentifierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProviderIdentifierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProviderIdentifierMutation, { data, loading, error }] = useUpdateProviderIdentifierMutation({
 *   variables: {
 *      id: // value for 'id'
 *      provinceCode: // value for 'provinceCode'
 *      licenseType: // value for 'licenseType'
 *      identifierValue: // value for 'identifierValue'
 *      effectiveFrom: // value for 'effectiveFrom'
 *      effectiveTo: // value for 'effectiveTo'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useUpdateProviderIdentifierMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProviderIdentifierMutation, UpdateProviderIdentifierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateProviderIdentifierMutation, UpdateProviderIdentifierMutationVariables>(UpdateProviderIdentifierDocument, options);
      }
export type UpdateProviderIdentifierMutationHookResult = ReturnType<typeof useUpdateProviderIdentifierMutation>;
export type UpdateProviderIdentifierMutationResult = ApolloReactCommon.MutationResult<UpdateProviderIdentifierMutation>;
export type UpdateProviderIdentifierMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProviderIdentifierMutation, UpdateProviderIdentifierMutationVariables>;
export const DeleteProviderIdentifierDocument = gql`
    mutation DeleteProviderIdentifier($id: bigint!) {
  delete_user_provider_identifier_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteProviderIdentifierMutationFn = ApolloReactCommon.MutationFunction<DeleteProviderIdentifierMutation, DeleteProviderIdentifierMutationVariables>;

/**
 * __useDeleteProviderIdentifierMutation__
 *
 * To run a mutation, you first call `useDeleteProviderIdentifierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProviderIdentifierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProviderIdentifierMutation, { data, loading, error }] = useDeleteProviderIdentifierMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProviderIdentifierMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProviderIdentifierMutation, DeleteProviderIdentifierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteProviderIdentifierMutation, DeleteProviderIdentifierMutationVariables>(DeleteProviderIdentifierDocument, options);
      }
export type DeleteProviderIdentifierMutationHookResult = ReturnType<typeof useDeleteProviderIdentifierMutation>;
export type DeleteProviderIdentifierMutationResult = ApolloReactCommon.MutationResult<DeleteProviderIdentifierMutation>;
export type DeleteProviderIdentifierMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteProviderIdentifierMutation, DeleteProviderIdentifierMutationVariables>;
export const GetUserProfileDocument = gql`
    query GetUserProfile($userId: uuid!) {
  user_profile(where: {user_id: {_eq: $userId}}) {
    user_id
    user_kind
    license_no
    scheduler_color
    is_active
  }
}
    `;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserProfileQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables> & ({ variables: GetUserProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
      }
export function useGetUserProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
// @ts-ignore
export function useGetUserProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export function useGetUserProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserProfileQuery | undefined, GetUserProfileQueryVariables>;
export function useGetUserProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
export type GetUserProfileSuspenseQueryHookResult = ReturnType<typeof useGetUserProfileSuspenseQuery>;
export type GetUserProfileQueryResult = ApolloReactCommon.QueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetClinicUserWithProfileDocument = gql`
    query GetClinicUserWithProfile($clinicId: bigint!) {
  clinic_user_with_profile_v(where: {clinic_id: {_eq: $clinicId}}) {
    clinic_user_id
    clinic_id
    user_id
    job_title
    is_schedulable
    provider_kind
    default_operatory_id
    clinic_scheduler_color
    joined_at
    clinic_membership_active
    email
    first_name
    last_name
    user_account_active
    user_kind
    license_no
    global_scheduler_color
    profile_active
  }
}
    `;

/**
 * __useGetClinicUserWithProfileQuery__
 *
 * To run a query within a React component, call `useGetClinicUserWithProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClinicUserWithProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClinicUserWithProfileQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetClinicUserWithProfileQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables> & ({ variables: GetClinicUserWithProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>(GetClinicUserWithProfileDocument, options);
      }
export function useGetClinicUserWithProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>(GetClinicUserWithProfileDocument, options);
        }
// @ts-ignore
export function useGetClinicUserWithProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>;
export function useGetClinicUserWithProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicUserWithProfileQuery | undefined, GetClinicUserWithProfileQueryVariables>;
export function useGetClinicUserWithProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>(GetClinicUserWithProfileDocument, options);
        }
export type GetClinicUserWithProfileQueryHookResult = ReturnType<typeof useGetClinicUserWithProfileQuery>;
export type GetClinicUserWithProfileLazyQueryHookResult = ReturnType<typeof useGetClinicUserWithProfileLazyQuery>;
export type GetClinicUserWithProfileSuspenseQueryHookResult = ReturnType<typeof useGetClinicUserWithProfileSuspenseQuery>;
export type GetClinicUserWithProfileQueryResult = ApolloReactCommon.QueryResult<GetClinicUserWithProfileQuery, GetClinicUserWithProfileQueryVariables>;
export const GetClinicUserWithProfileByUserIdDocument = gql`
    query GetClinicUserWithProfileByUserId($clinicId: bigint!, $userId: uuid!) {
  clinic_user_with_profile_v(
    where: {clinic_id: {_eq: $clinicId}, user_id: {_eq: $userId}}
  ) {
    clinic_user_id
    clinic_id
    user_id
    job_title
    is_schedulable
    provider_kind
    default_operatory_id
    clinic_scheduler_color
    joined_at
    clinic_membership_active
    email
    first_name
    last_name
    user_account_active
    user_kind
    license_no
    global_scheduler_color
    profile_active
  }
}
    `;

/**
 * __useGetClinicUserWithProfileByUserIdQuery__
 *
 * To run a query within a React component, call `useGetClinicUserWithProfileByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClinicUserWithProfileByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClinicUserWithProfileByUserIdQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetClinicUserWithProfileByUserIdQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables> & ({ variables: GetClinicUserWithProfileByUserIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>(GetClinicUserWithProfileByUserIdDocument, options);
      }
export function useGetClinicUserWithProfileByUserIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>(GetClinicUserWithProfileByUserIdDocument, options);
        }
// @ts-ignore
export function useGetClinicUserWithProfileByUserIdSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>;
export function useGetClinicUserWithProfileByUserIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetClinicUserWithProfileByUserIdQuery | undefined, GetClinicUserWithProfileByUserIdQueryVariables>;
export function useGetClinicUserWithProfileByUserIdSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>(GetClinicUserWithProfileByUserIdDocument, options);
        }
export type GetClinicUserWithProfileByUserIdQueryHookResult = ReturnType<typeof useGetClinicUserWithProfileByUserIdQuery>;
export type GetClinicUserWithProfileByUserIdLazyQueryHookResult = ReturnType<typeof useGetClinicUserWithProfileByUserIdLazyQuery>;
export type GetClinicUserWithProfileByUserIdSuspenseQueryHookResult = ReturnType<typeof useGetClinicUserWithProfileByUserIdSuspenseQuery>;
export type GetClinicUserWithProfileByUserIdQueryResult = ApolloReactCommon.QueryResult<GetClinicUserWithProfileByUserIdQuery, GetClinicUserWithProfileByUserIdQueryVariables>;
export const GetUserProviderIdentifiersDocument = gql`
    query GetUserProviderIdentifiers($userId: uuid!) {
  user_provider_identifier_v(
    where: {user_id: {_eq: $userId}}
    order_by: {created_at: desc}
  ) {
    id
    user_id
    identifier_kind
    province_code
    license_type
    identifier_value
    effective_from
    effective_to
    is_active
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetUserProviderIdentifiersQuery__
 *
 * To run a query within a React component, call `useGetUserProviderIdentifiersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProviderIdentifiersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProviderIdentifiersQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserProviderIdentifiersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables> & ({ variables: GetUserProviderIdentifiersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>(GetUserProviderIdentifiersDocument, options);
      }
export function useGetUserProviderIdentifiersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>(GetUserProviderIdentifiersDocument, options);
        }
// @ts-ignore
export function useGetUserProviderIdentifiersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>;
export function useGetUserProviderIdentifiersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetUserProviderIdentifiersQuery | undefined, GetUserProviderIdentifiersQueryVariables>;
export function useGetUserProviderIdentifiersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>(GetUserProviderIdentifiersDocument, options);
        }
export type GetUserProviderIdentifiersQueryHookResult = ReturnType<typeof useGetUserProviderIdentifiersQuery>;
export type GetUserProviderIdentifiersLazyQueryHookResult = ReturnType<typeof useGetUserProviderIdentifiersLazyQuery>;
export type GetUserProviderIdentifiersSuspenseQueryHookResult = ReturnType<typeof useGetUserProviderIdentifiersSuspenseQuery>;
export type GetUserProviderIdentifiersQueryResult = ApolloReactCommon.QueryResult<GetUserProviderIdentifiersQuery, GetUserProviderIdentifiersQueryVariables>;