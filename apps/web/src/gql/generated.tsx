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
  citext: { input: any; output: any; }
  date: { input: any; output: any; }
  float8: { input: any; output: any; }
  jsonb: { input: any; output: any; }
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

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
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

/** columns and relationships of "address" */
export type Address = {
  __typename?: 'address';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  line1: Scalars['String']['output'];
  line2?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  persons_billing: Array<Person>;
  /** An aggregate relationship */
  persons_billing_aggregate: Person_Aggregate;
  /** An array relationship */
  persons_mailing: Array<Person>;
  /** An aggregate relationship */
  persons_mailing_aggregate: Person_Aggregate;
  postal_code: Scalars['String']['output'];
  region: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "address" */
export type AddressPersons_BillingArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


/** columns and relationships of "address" */
export type AddressPersons_Billing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


/** columns and relationships of "address" */
export type AddressPersons_MailingArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


/** columns and relationships of "address" */
export type AddressPersons_Mailing_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};

/** aggregated selection of "address" */
export type Address_Aggregate = {
  __typename?: 'address_aggregate';
  aggregate?: Maybe<Address_Aggregate_Fields>;
  nodes: Array<Address>;
};

/** aggregate fields of "address" */
export type Address_Aggregate_Fields = {
  __typename?: 'address_aggregate_fields';
  avg?: Maybe<Address_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Address_Max_Fields>;
  min?: Maybe<Address_Min_Fields>;
  stddev?: Maybe<Address_Stddev_Fields>;
  stddev_pop?: Maybe<Address_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Address_Stddev_Samp_Fields>;
  sum?: Maybe<Address_Sum_Fields>;
  var_pop?: Maybe<Address_Var_Pop_Fields>;
  var_samp?: Maybe<Address_Var_Samp_Fields>;
  variance?: Maybe<Address_Variance_Fields>;
};


/** aggregate fields of "address" */
export type Address_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Address_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Address_Avg_Fields = {
  __typename?: 'address_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "address". All fields are combined with a logical 'AND'. */
export type Address_Bool_Exp = {
  _and?: InputMaybe<Array<Address_Bool_Exp>>;
  _not?: InputMaybe<Address_Bool_Exp>;
  _or?: InputMaybe<Array<Address_Bool_Exp>>;
  city?: InputMaybe<String_Comparison_Exp>;
  country?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  line1?: InputMaybe<String_Comparison_Exp>;
  line2?: InputMaybe<String_Comparison_Exp>;
  persons_billing?: InputMaybe<Person_Bool_Exp>;
  persons_billing_aggregate?: InputMaybe<Person_Aggregate_Bool_Exp>;
  persons_mailing?: InputMaybe<Person_Bool_Exp>;
  persons_mailing_aggregate?: InputMaybe<Person_Aggregate_Bool_Exp>;
  postal_code?: InputMaybe<String_Comparison_Exp>;
  region?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "address" */
export type Address_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'address_pkey';

/** input type for incrementing numeric columns in table "address" */
export type Address_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "address" */
export type Address_Insert_Input = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  line1?: InputMaybe<Scalars['String']['input']>;
  line2?: InputMaybe<Scalars['String']['input']>;
  persons_billing?: InputMaybe<Person_Arr_Rel_Insert_Input>;
  persons_mailing?: InputMaybe<Person_Arr_Rel_Insert_Input>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Address_Max_Fields = {
  __typename?: 'address_max_fields';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Address_Min_Fields = {
  __typename?: 'address_min_fields';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "address" */
export type Address_Mutation_Response = {
  __typename?: 'address_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Address>;
};

/** input type for inserting object relation for remote table "address" */
export type Address_Obj_Rel_Insert_Input = {
  data: Address_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Address_On_Conflict>;
};

/** on_conflict condition type for table "address" */
export type Address_On_Conflict = {
  constraint: Address_Constraint;
  update_columns?: Array<Address_Update_Column>;
  where?: InputMaybe<Address_Bool_Exp>;
};

/** Ordering options when selecting data from "address". */
export type Address_Order_By = {
  city?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  line1?: InputMaybe<Order_By>;
  line2?: InputMaybe<Order_By>;
  persons_billing_aggregate?: InputMaybe<Person_Aggregate_Order_By>;
  persons_mailing_aggregate?: InputMaybe<Person_Aggregate_Order_By>;
  postal_code?: InputMaybe<Order_By>;
  region?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: address */
export type Address_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "address" */
export type Address_Select_Column =
  /** column name */
  | 'city'
  /** column name */
  | 'country'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'line1'
  /** column name */
  | 'line2'
  /** column name */
  | 'postal_code'
  /** column name */
  | 'region'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "address" */
export type Address_Set_Input = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  line1?: InputMaybe<Scalars['String']['input']>;
  line2?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Address_Stddev_Fields = {
  __typename?: 'address_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Address_Stddev_Pop_Fields = {
  __typename?: 'address_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Address_Stddev_Samp_Fields = {
  __typename?: 'address_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "address" */
export type Address_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Address_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Address_Stream_Cursor_Value_Input = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  line1?: InputMaybe<Scalars['String']['input']>;
  line2?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Address_Sum_Fields = {
  __typename?: 'address_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "address" */
export type Address_Update_Column =
  /** column name */
  | 'city'
  /** column name */
  | 'country'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'line1'
  /** column name */
  | 'line2'
  /** column name */
  | 'postal_code'
  /** column name */
  | 'region'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Address_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Address_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Address_Set_Input>;
  /** filter the rows which have to be updated */
  where: Address_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Address_Var_Pop_Fields = {
  __typename?: 'address_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Address_Var_Samp_Fields = {
  __typename?: 'address_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Address_Variance_Fields = {
  __typename?: 'address_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
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

/** columns and relationships of "audit.event" */
export type Audit_Event = {
  __typename?: 'audit_event';
  action: Scalars['String']['output'];
  actor_user_id?: Maybe<Scalars['uuid']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  entity_id?: Maybe<Scalars['String']['output']>;
  entity_type: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
  ip?: Maybe<Scalars['String']['output']>;
  occurred_at: Scalars['timestamptz']['output'];
  payload: Scalars['jsonb']['output'];
  request_id?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user_agent?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "audit.event" */
export type Audit_EventPayloadArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "audit.event" */
export type Audit_Event_Aggregate = {
  __typename?: 'audit_event_aggregate';
  aggregate?: Maybe<Audit_Event_Aggregate_Fields>;
  nodes: Array<Audit_Event>;
};

/** aggregate fields of "audit.event" */
export type Audit_Event_Aggregate_Fields = {
  __typename?: 'audit_event_aggregate_fields';
  avg?: Maybe<Audit_Event_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Audit_Event_Max_Fields>;
  min?: Maybe<Audit_Event_Min_Fields>;
  stddev?: Maybe<Audit_Event_Stddev_Fields>;
  stddev_pop?: Maybe<Audit_Event_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Audit_Event_Stddev_Samp_Fields>;
  sum?: Maybe<Audit_Event_Sum_Fields>;
  var_pop?: Maybe<Audit_Event_Var_Pop_Fields>;
  var_samp?: Maybe<Audit_Event_Var_Samp_Fields>;
  variance?: Maybe<Audit_Event_Variance_Fields>;
};


/** aggregate fields of "audit.event" */
export type Audit_Event_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Audit_Event_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Audit_Event_Append_Input = {
  payload?: InputMaybe<Scalars['jsonb']['input']>;
};

/** aggregate avg on columns */
export type Audit_Event_Avg_Fields = {
  __typename?: 'audit_event_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "audit.event". All fields are combined with a logical 'AND'. */
export type Audit_Event_Bool_Exp = {
  _and?: InputMaybe<Array<Audit_Event_Bool_Exp>>;
  _not?: InputMaybe<Audit_Event_Bool_Exp>;
  _or?: InputMaybe<Array<Audit_Event_Bool_Exp>>;
  action?: InputMaybe<String_Comparison_Exp>;
  actor_user_id?: InputMaybe<Uuid_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  entity_id?: InputMaybe<String_Comparison_Exp>;
  entity_type?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  ip?: InputMaybe<String_Comparison_Exp>;
  occurred_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  payload?: InputMaybe<Jsonb_Comparison_Exp>;
  request_id?: InputMaybe<String_Comparison_Exp>;
  success?: InputMaybe<Boolean_Comparison_Exp>;
  user_agent?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "audit.event" */
export type Audit_Event_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'event_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Audit_Event_Delete_At_Path_Input = {
  payload?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Audit_Event_Delete_Elem_Input = {
  payload?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Audit_Event_Delete_Key_Input = {
  payload?: InputMaybe<Scalars['String']['input']>;
};

/** input type for incrementing numeric columns in table "audit.event" */
export type Audit_Event_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "audit.event" */
export type Audit_Event_Insert_Input = {
  action?: InputMaybe<Scalars['String']['input']>;
  actor_user_id?: InputMaybe<Scalars['uuid']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  ip?: InputMaybe<Scalars['String']['input']>;
  occurred_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payload?: InputMaybe<Scalars['jsonb']['input']>;
  request_id?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Audit_Event_Max_Fields = {
  __typename?: 'audit_event_max_fields';
  action?: Maybe<Scalars['String']['output']>;
  actor_user_id?: Maybe<Scalars['uuid']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  entity_id?: Maybe<Scalars['String']['output']>;
  entity_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  occurred_at?: Maybe<Scalars['timestamptz']['output']>;
  request_id?: Maybe<Scalars['String']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Audit_Event_Min_Fields = {
  __typename?: 'audit_event_min_fields';
  action?: Maybe<Scalars['String']['output']>;
  actor_user_id?: Maybe<Scalars['uuid']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  entity_id?: Maybe<Scalars['String']['output']>;
  entity_type?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  occurred_at?: Maybe<Scalars['timestamptz']['output']>;
  request_id?: Maybe<Scalars['String']['output']>;
  user_agent?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "audit.event" */
export type Audit_Event_Mutation_Response = {
  __typename?: 'audit_event_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Audit_Event>;
};

/** on_conflict condition type for table "audit.event" */
export type Audit_Event_On_Conflict = {
  constraint: Audit_Event_Constraint;
  update_columns?: Array<Audit_Event_Update_Column>;
  where?: InputMaybe<Audit_Event_Bool_Exp>;
};

/** Ordering options when selecting data from "audit.event". */
export type Audit_Event_Order_By = {
  action?: InputMaybe<Order_By>;
  actor_user_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  entity_id?: InputMaybe<Order_By>;
  entity_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ip?: InputMaybe<Order_By>;
  occurred_at?: InputMaybe<Order_By>;
  payload?: InputMaybe<Order_By>;
  request_id?: InputMaybe<Order_By>;
  success?: InputMaybe<Order_By>;
  user_agent?: InputMaybe<Order_By>;
};

/** primary key columns input for table: audit.event */
export type Audit_Event_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Audit_Event_Prepend_Input = {
  payload?: InputMaybe<Scalars['jsonb']['input']>;
};

/** select columns of table "audit.event" */
export type Audit_Event_Select_Column =
  /** column name */
  | 'action'
  /** column name */
  | 'actor_user_id'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'entity_id'
  /** column name */
  | 'entity_type'
  /** column name */
  | 'id'
  /** column name */
  | 'ip'
  /** column name */
  | 'occurred_at'
  /** column name */
  | 'payload'
  /** column name */
  | 'request_id'
  /** column name */
  | 'success'
  /** column name */
  | 'user_agent';

/** input type for updating data in table "audit.event" */
export type Audit_Event_Set_Input = {
  action?: InputMaybe<Scalars['String']['input']>;
  actor_user_id?: InputMaybe<Scalars['uuid']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  ip?: InputMaybe<Scalars['String']['input']>;
  occurred_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payload?: InputMaybe<Scalars['jsonb']['input']>;
  request_id?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Audit_Event_Stddev_Fields = {
  __typename?: 'audit_event_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Audit_Event_Stddev_Pop_Fields = {
  __typename?: 'audit_event_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Audit_Event_Stddev_Samp_Fields = {
  __typename?: 'audit_event_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "audit_event" */
export type Audit_Event_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Audit_Event_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Audit_Event_Stream_Cursor_Value_Input = {
  action?: InputMaybe<Scalars['String']['input']>;
  actor_user_id?: InputMaybe<Scalars['uuid']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_type?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  ip?: InputMaybe<Scalars['String']['input']>;
  occurred_at?: InputMaybe<Scalars['timestamptz']['input']>;
  payload?: InputMaybe<Scalars['jsonb']['input']>;
  request_id?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  user_agent?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Audit_Event_Sum_Fields = {
  __typename?: 'audit_event_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "audit.event" */
export type Audit_Event_Update_Column =
  /** column name */
  | 'action'
  /** column name */
  | 'actor_user_id'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'entity_id'
  /** column name */
  | 'entity_type'
  /** column name */
  | 'id'
  /** column name */
  | 'ip'
  /** column name */
  | 'occurred_at'
  /** column name */
  | 'payload'
  /** column name */
  | 'request_id'
  /** column name */
  | 'success'
  /** column name */
  | 'user_agent';

export type Audit_Event_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Audit_Event_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Audit_Event_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Audit_Event_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Audit_Event_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Audit_Event_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Audit_Event_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Audit_Event_Set_Input>;
  /** filter the rows which have to be updated */
  where: Audit_Event_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Audit_Event_Var_Pop_Fields = {
  __typename?: 'audit_event_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Audit_Event_Var_Samp_Fields = {
  __typename?: 'audit_event_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Audit_Event_Variance_Fields = {
  __typename?: 'audit_event_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
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

/** columns and relationships of "capability" */
export type Capability = {
  __typename?: 'capability';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
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
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "capability" */
export type Capability_Constraint =
  /** unique or primary key constraint on columns "value" */
  | 'capability_pkey';

export type Capability_Enum =
  /** Export audit logs (CSV/JSONL) */
  | 'audit_export'
  /** Manage clinic settings */
  | 'clinic_manage'
  /** View and access imaging assets */
  | 'imaging_read'
  /** Upload, create, and delete imaging assets */
  | 'imaging_write'
  /** Manage patients and contacts */
  | 'patient_manage'
  /** Full administrative access */
  | 'system_admin'
  /** Manage users, roles, permissions */
  | 'users_manage';

/** Boolean expression to compare columns of type "capability_enum". All fields are combined with logical 'AND'. */
export type Capability_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Capability_Enum>;
  _in?: InputMaybe<Array<Capability_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Capability_Enum>;
  _nin?: InputMaybe<Array<Capability_Enum>>;
};

/** input type for inserting data into table "capability" */
export type Capability_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Capability_Max_Fields = {
  __typename?: 'capability_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Capability_Min_Fields = {
  __typename?: 'capability_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
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
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: capability */
export type Capability_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "capability" */
export type Capability_Select_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

/** input type for updating data in table "capability" */
export type Capability_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
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
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "capability" */
export type Capability_Update_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

export type Capability_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Capability_Set_Input>;
  /** filter the rows which have to be updated */
  where: Capability_Bool_Exp;
};

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['citext']['input']>;
  _gt?: InputMaybe<Scalars['citext']['input']>;
  _gte?: InputMaybe<Scalars['citext']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['citext']['input']>;
  _in?: InputMaybe<Array<Scalars['citext']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['citext']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['citext']['input']>;
  _lt?: InputMaybe<Scalars['citext']['input']>;
  _lte?: InputMaybe<Scalars['citext']['input']>;
  _neq?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['citext']['input']>;
  _nin?: InputMaybe<Array<Scalars['citext']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['citext']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['citext']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['citext']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['citext']['input']>;
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
};

/** Boolean expression to filter rows from the table "clinic_user_effective_capabilities_v". All fields are combined with a logical 'AND'. */
export type Clinic_User_Effective_Capabilities_V_Bool_Exp = {
  _and?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Bool_Exp>>;
  _not?: InputMaybe<Clinic_User_Effective_Capabilities_V_Bool_Exp>;
  _or?: InputMaybe<Array<Clinic_User_Effective_Capabilities_V_Bool_Exp>>;
  capability_key?: InputMaybe<String_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type Clinic_User_Effective_Capabilities_V_Max_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_max_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Clinic_User_Effective_Capabilities_V_Min_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_min_fields';
  capability_key?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** Ordering options when selecting data from "clinic_user_effective_capabilities_v". */
export type Clinic_User_Effective_Capabilities_V_Order_By = {
  capability_key?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** select columns of table "clinic_user_effective_capabilities_v" */
export type Clinic_User_Effective_Capabilities_V_Select_Column =
  /** column name */
  | 'capability_key'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'user_id';

/** aggregate stddev on columns */
export type Clinic_User_Effective_Capabilities_V_Stddev_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Clinic_User_Effective_Capabilities_V_Stddev_Pop_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Clinic_User_Effective_Capabilities_V_Stddev_Samp_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
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
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Clinic_User_Effective_Capabilities_V_Sum_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Clinic_User_Effective_Capabilities_V_Var_Pop_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Clinic_User_Effective_Capabilities_V_Var_Samp_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Clinic_User_Effective_Capabilities_V_Variance_Fields = {
  __typename?: 'clinic_user_effective_capabilities_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
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

/** columns and relationships of "family_group_v" */
export type Family_Group_V = {
  __typename?: 'family_group_v';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "family_group_v" */
export type Family_Group_V_Aggregate = {
  __typename?: 'family_group_v_aggregate';
  aggregate?: Maybe<Family_Group_V_Aggregate_Fields>;
  nodes: Array<Family_Group_V>;
};

/** aggregate fields of "family_group_v" */
export type Family_Group_V_Aggregate_Fields = {
  __typename?: 'family_group_v_aggregate_fields';
  avg?: Maybe<Family_Group_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Family_Group_V_Max_Fields>;
  min?: Maybe<Family_Group_V_Min_Fields>;
  stddev?: Maybe<Family_Group_V_Stddev_Fields>;
  stddev_pop?: Maybe<Family_Group_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Family_Group_V_Stddev_Samp_Fields>;
  sum?: Maybe<Family_Group_V_Sum_Fields>;
  var_pop?: Maybe<Family_Group_V_Var_Pop_Fields>;
  var_samp?: Maybe<Family_Group_V_Var_Samp_Fields>;
  variance?: Maybe<Family_Group_V_Variance_Fields>;
};


/** aggregate fields of "family_group_v" */
export type Family_Group_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Family_Group_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Family_Group_V_Avg_Fields = {
  __typename?: 'family_group_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "family_group_v". All fields are combined with a logical 'AND'. */
export type Family_Group_V_Bool_Exp = {
  _and?: InputMaybe<Array<Family_Group_V_Bool_Exp>>;
  _not?: InputMaybe<Family_Group_V_Bool_Exp>;
  _or?: InputMaybe<Array<Family_Group_V_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  family_root_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  person_id?: InputMaybe<Bigint_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "family_group_v" */
export type Family_Group_V_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  family_root_person_id?: InputMaybe<Scalars['bigint']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "family_group_v" */
export type Family_Group_V_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  family_root_person_id?: InputMaybe<Scalars['bigint']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Family_Group_V_Max_Fields = {
  __typename?: 'family_group_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Family_Group_V_Min_Fields = {
  __typename?: 'family_group_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
};

/** response of any mutation on the table "family_group_v" */
export type Family_Group_V_Mutation_Response = {
  __typename?: 'family_group_v_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Family_Group_V>;
};

/** Ordering options when selecting data from "family_group_v". */
export type Family_Group_V_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  family_root_person_id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** select columns of table "family_group_v" */
export type Family_Group_V_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'family_root_person_id'
  /** column name */
  | 'person_id';

/** input type for updating data in table "family_group_v" */
export type Family_Group_V_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  family_root_person_id?: InputMaybe<Scalars['bigint']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate stddev on columns */
export type Family_Group_V_Stddev_Fields = {
  __typename?: 'family_group_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Family_Group_V_Stddev_Pop_Fields = {
  __typename?: 'family_group_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Family_Group_V_Stddev_Samp_Fields = {
  __typename?: 'family_group_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "family_group_v" */
export type Family_Group_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Family_Group_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Family_Group_V_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  family_root_person_id?: InputMaybe<Scalars['bigint']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Family_Group_V_Sum_Fields = {
  __typename?: 'family_group_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
};

export type Family_Group_V_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Family_Group_V_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Family_Group_V_Set_Input>;
  /** filter the rows which have to be updated */
  where: Family_Group_V_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Family_Group_V_Var_Pop_Fields = {
  __typename?: 'family_group_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Family_Group_V_Var_Samp_Fields = {
  __typename?: 'family_group_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Family_Group_V_Variance_Fields = {
  __typename?: 'family_group_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** Given a person_id, returns all family members sharing the same root. */
export type Family_Members_V = {
  __typename?: 'family_members_v';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  is_patient?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "family_members_v" */
export type Family_Members_V_Aggregate = {
  __typename?: 'family_members_v_aggregate';
  aggregate?: Maybe<Family_Members_V_Aggregate_Fields>;
  nodes: Array<Family_Members_V>;
};

/** aggregate fields of "family_members_v" */
export type Family_Members_V_Aggregate_Fields = {
  __typename?: 'family_members_v_aggregate_fields';
  avg?: Maybe<Family_Members_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Family_Members_V_Max_Fields>;
  min?: Maybe<Family_Members_V_Min_Fields>;
  stddev?: Maybe<Family_Members_V_Stddev_Fields>;
  stddev_pop?: Maybe<Family_Members_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Family_Members_V_Stddev_Samp_Fields>;
  sum?: Maybe<Family_Members_V_Sum_Fields>;
  var_pop?: Maybe<Family_Members_V_Var_Pop_Fields>;
  var_samp?: Maybe<Family_Members_V_Var_Samp_Fields>;
  variance?: Maybe<Family_Members_V_Variance_Fields>;
};


/** aggregate fields of "family_members_v" */
export type Family_Members_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Family_Members_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Family_Members_V_Avg_Fields = {
  __typename?: 'family_members_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "family_members_v". All fields are combined with a logical 'AND'. */
export type Family_Members_V_Bool_Exp = {
  _and?: InputMaybe<Array<Family_Members_V_Bool_Exp>>;
  _not?: InputMaybe<Family_Members_V_Bool_Exp>;
  _or?: InputMaybe<Array<Family_Members_V_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  dob?: InputMaybe<Date_Comparison_Exp>;
  family_root_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  household_relationship?: InputMaybe<String_Comparison_Exp>;
  is_patient?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  person_id?: InputMaybe<Bigint_Comparison_Exp>;
  preferred_name?: InputMaybe<String_Comparison_Exp>;
  responsible_party_id?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Family_Members_V_Max_Fields = {
  __typename?: 'family_members_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Family_Members_V_Min_Fields = {
  __typename?: 'family_members_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "family_members_v". */
export type Family_Members_V_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  family_root_person_id?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  household_relationship?: InputMaybe<Order_By>;
  is_patient?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
  preferred_name?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** select columns of table "family_members_v" */
export type Family_Members_V_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'dob'
  /** column name */
  | 'family_root_person_id'
  /** column name */
  | 'first_name'
  /** column name */
  | 'household_relationship'
  /** column name */
  | 'is_patient'
  /** column name */
  | 'last_name'
  /** column name */
  | 'person_id'
  /** column name */
  | 'preferred_name'
  /** column name */
  | 'responsible_party_id';

/** aggregate stddev on columns */
export type Family_Members_V_Stddev_Fields = {
  __typename?: 'family_members_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Family_Members_V_Stddev_Pop_Fields = {
  __typename?: 'family_members_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Family_Members_V_Stddev_Samp_Fields = {
  __typename?: 'family_members_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "family_members_v" */
export type Family_Members_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Family_Members_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Family_Members_V_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  dob?: InputMaybe<Scalars['date']['input']>;
  family_root_person_id?: InputMaybe<Scalars['bigint']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  household_relationship?: InputMaybe<Scalars['String']['input']>;
  is_patient?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate sum on columns */
export type Family_Members_V_Sum_Fields = {
  __typename?: 'family_members_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  family_root_person_id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Family_Members_V_Var_Pop_Fields = {
  __typename?: 'family_members_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Family_Members_V_Var_Samp_Fields = {
  __typename?: 'family_members_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Family_Members_V_Variance_Fields = {
  __typename?: 'family_members_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  family_root_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['float8']['input']>;
  _gt?: InputMaybe<Scalars['float8']['input']>;
  _gte?: InputMaybe<Scalars['float8']['input']>;
  _in?: InputMaybe<Array<Scalars['float8']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['float8']['input']>;
  _lte?: InputMaybe<Scalars['float8']['input']>;
  _neq?: InputMaybe<Scalars['float8']['input']>;
  _nin?: InputMaybe<Array<Scalars['float8']['input']>>;
};

export type Fn_Search_Household_Heads_Args = {
  p_clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  p_limit?: InputMaybe<Scalars['Int']['input']>;
  p_query?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "gender_enum" */
export type Gender_Enum = {
  __typename?: 'gender_enum';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "gender_enum" */
export type Gender_Enum_Aggregate = {
  __typename?: 'gender_enum_aggregate';
  aggregate?: Maybe<Gender_Enum_Aggregate_Fields>;
  nodes: Array<Gender_Enum>;
};

/** aggregate fields of "gender_enum" */
export type Gender_Enum_Aggregate_Fields = {
  __typename?: 'gender_enum_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Gender_Enum_Max_Fields>;
  min?: Maybe<Gender_Enum_Min_Fields>;
};


/** aggregate fields of "gender_enum" */
export type Gender_Enum_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Gender_Enum_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "gender_enum". All fields are combined with a logical 'AND'. */
export type Gender_Enum_Bool_Exp = {
  _and?: InputMaybe<Array<Gender_Enum_Bool_Exp>>;
  _not?: InputMaybe<Gender_Enum_Bool_Exp>;
  _or?: InputMaybe<Array<Gender_Enum_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "gender_enum" */
export type Gender_Enum_Constraint =
  /** unique or primary key constraint on columns "value" */
  | 'gender_enum_pkey';

/** input type for inserting data into table "gender_enum" */
export type Gender_Enum_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Gender_Enum_Max_Fields = {
  __typename?: 'gender_enum_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Gender_Enum_Min_Fields = {
  __typename?: 'gender_enum_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "gender_enum" */
export type Gender_Enum_Mutation_Response = {
  __typename?: 'gender_enum_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Gender_Enum>;
};

/** on_conflict condition type for table "gender_enum" */
export type Gender_Enum_On_Conflict = {
  constraint: Gender_Enum_Constraint;
  update_columns?: Array<Gender_Enum_Update_Column>;
  where?: InputMaybe<Gender_Enum_Bool_Exp>;
};

/** Ordering options when selecting data from "gender_enum". */
export type Gender_Enum_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: gender_enum */
export type Gender_Enum_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "gender_enum" */
export type Gender_Enum_Select_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

/** input type for updating data in table "gender_enum" */
export type Gender_Enum_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "gender_enum" */
export type Gender_Enum_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gender_Enum_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Gender_Enum_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "gender_enum" */
export type Gender_Enum_Update_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

export type Gender_Enum_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Gender_Enum_Set_Input>;
  /** filter the rows which have to be updated */
  where: Gender_Enum_Bool_Exp;
};

/** columns and relationships of "insurance_subscriber" */
export type Insurance_Subscriber = {
  __typename?: 'insurance_subscriber';
  carrier?: Maybe<Scalars['String']['output']>;
  clinic_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  policy_no?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  subscriber: Person;
  subscriber_person_id: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "insurance_subscriber" */
export type Insurance_Subscriber_Aggregate = {
  __typename?: 'insurance_subscriber_aggregate';
  aggregate?: Maybe<Insurance_Subscriber_Aggregate_Fields>;
  nodes: Array<Insurance_Subscriber>;
};

/** aggregate fields of "insurance_subscriber" */
export type Insurance_Subscriber_Aggregate_Fields = {
  __typename?: 'insurance_subscriber_aggregate_fields';
  avg?: Maybe<Insurance_Subscriber_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Insurance_Subscriber_Max_Fields>;
  min?: Maybe<Insurance_Subscriber_Min_Fields>;
  stddev?: Maybe<Insurance_Subscriber_Stddev_Fields>;
  stddev_pop?: Maybe<Insurance_Subscriber_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Insurance_Subscriber_Stddev_Samp_Fields>;
  sum?: Maybe<Insurance_Subscriber_Sum_Fields>;
  var_pop?: Maybe<Insurance_Subscriber_Var_Pop_Fields>;
  var_samp?: Maybe<Insurance_Subscriber_Var_Samp_Fields>;
  variance?: Maybe<Insurance_Subscriber_Variance_Fields>;
};


/** aggregate fields of "insurance_subscriber" */
export type Insurance_Subscriber_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Insurance_Subscriber_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Insurance_Subscriber_Avg_Fields = {
  __typename?: 'insurance_subscriber_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  subscriber_person_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "insurance_subscriber". All fields are combined with a logical 'AND'. */
export type Insurance_Subscriber_Bool_Exp = {
  _and?: InputMaybe<Array<Insurance_Subscriber_Bool_Exp>>;
  _not?: InputMaybe<Insurance_Subscriber_Bool_Exp>;
  _or?: InputMaybe<Array<Insurance_Subscriber_Bool_Exp>>;
  carrier?: InputMaybe<String_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  policy_no?: InputMaybe<String_Comparison_Exp>;
  subscriber?: InputMaybe<Person_Bool_Exp>;
  subscriber_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "insurance_subscriber" */
export type Insurance_Subscriber_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'insurance_subscriber_pkey';

/** input type for incrementing numeric columns in table "insurance_subscriber" */
export type Insurance_Subscriber_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  subscriber_person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "insurance_subscriber" */
export type Insurance_Subscriber_Insert_Input = {
  carrier?: InputMaybe<Scalars['String']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  policy_no?: InputMaybe<Scalars['String']['input']>;
  subscriber?: InputMaybe<Person_Obj_Rel_Insert_Input>;
  subscriber_person_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Insurance_Subscriber_Max_Fields = {
  __typename?: 'insurance_subscriber_max_fields';
  carrier?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  policy_no?: Maybe<Scalars['String']['output']>;
  subscriber_person_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Insurance_Subscriber_Min_Fields = {
  __typename?: 'insurance_subscriber_min_fields';
  carrier?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  policy_no?: Maybe<Scalars['String']['output']>;
  subscriber_person_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "insurance_subscriber" */
export type Insurance_Subscriber_Mutation_Response = {
  __typename?: 'insurance_subscriber_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Insurance_Subscriber>;
};

/** on_conflict condition type for table "insurance_subscriber" */
export type Insurance_Subscriber_On_Conflict = {
  constraint: Insurance_Subscriber_Constraint;
  update_columns?: Array<Insurance_Subscriber_Update_Column>;
  where?: InputMaybe<Insurance_Subscriber_Bool_Exp>;
};

/** Ordering options when selecting data from "insurance_subscriber". */
export type Insurance_Subscriber_Order_By = {
  carrier?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  policy_no?: InputMaybe<Order_By>;
  subscriber?: InputMaybe<Person_Order_By>;
  subscriber_person_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: insurance_subscriber */
export type Insurance_Subscriber_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "insurance_subscriber" */
export type Insurance_Subscriber_Select_Column =
  /** column name */
  | 'carrier'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'policy_no'
  /** column name */
  | 'subscriber_person_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "insurance_subscriber" */
export type Insurance_Subscriber_Set_Input = {
  carrier?: InputMaybe<Scalars['String']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  policy_no?: InputMaybe<Scalars['String']['input']>;
  subscriber_person_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Insurance_Subscriber_Stddev_Fields = {
  __typename?: 'insurance_subscriber_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  subscriber_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Insurance_Subscriber_Stddev_Pop_Fields = {
  __typename?: 'insurance_subscriber_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  subscriber_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Insurance_Subscriber_Stddev_Samp_Fields = {
  __typename?: 'insurance_subscriber_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  subscriber_person_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "insurance_subscriber" */
export type Insurance_Subscriber_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Insurance_Subscriber_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Insurance_Subscriber_Stream_Cursor_Value_Input = {
  carrier?: InputMaybe<Scalars['String']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  policy_no?: InputMaybe<Scalars['String']['input']>;
  subscriber_person_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Insurance_Subscriber_Sum_Fields = {
  __typename?: 'insurance_subscriber_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  subscriber_person_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "insurance_subscriber" */
export type Insurance_Subscriber_Update_Column =
  /** column name */
  | 'carrier'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'policy_no'
  /** column name */
  | 'subscriber_person_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Insurance_Subscriber_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Insurance_Subscriber_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Insurance_Subscriber_Set_Input>;
  /** filter the rows which have to be updated */
  where: Insurance_Subscriber_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Insurance_Subscriber_Var_Pop_Fields = {
  __typename?: 'insurance_subscriber_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  subscriber_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Insurance_Subscriber_Var_Samp_Fields = {
  __typename?: 'insurance_subscriber_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  subscriber_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Insurance_Subscriber_Variance_Fields = {
  __typename?: 'insurance_subscriber_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  subscriber_person_id?: Maybe<Scalars['Float']['output']>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "address" */
  delete_address?: Maybe<Address_Mutation_Response>;
  /** delete single row from the table: "address" */
  delete_address_by_pk?: Maybe<Address>;
  /** delete data from the table: "app_user" */
  delete_app_user?: Maybe<App_User_Mutation_Response>;
  /** delete single row from the table: "app_user" */
  delete_app_user_by_pk?: Maybe<App_User>;
  /** delete data from the table: "app_user_v" */
  delete_app_user_v?: Maybe<App_User_V_Mutation_Response>;
  /** delete data from the table: "audit.event" */
  delete_audit_event?: Maybe<Audit_Event_Mutation_Response>;
  /** delete single row from the table: "audit.event" */
  delete_audit_event_by_pk?: Maybe<Audit_Event>;
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
  /** delete data from the table: "family_group_v" */
  delete_family_group_v?: Maybe<Family_Group_V_Mutation_Response>;
  /** delete data from the table: "gender_enum" */
  delete_gender_enum?: Maybe<Gender_Enum_Mutation_Response>;
  /** delete single row from the table: "gender_enum" */
  delete_gender_enum_by_pk?: Maybe<Gender_Enum>;
  /** delete data from the table: "insurance_subscriber" */
  delete_insurance_subscriber?: Maybe<Insurance_Subscriber_Mutation_Response>;
  /** delete single row from the table: "insurance_subscriber" */
  delete_insurance_subscriber_by_pk?: Maybe<Insurance_Subscriber>;
  /** delete data from the table: "operatory" */
  delete_operatory?: Maybe<Operatory_Mutation_Response>;
  /** delete single row from the table: "operatory" */
  delete_operatory_by_pk?: Maybe<Operatory>;
  /** delete data from the table: "operatory_v" */
  delete_operatory_v?: Maybe<Operatory_V_Mutation_Response>;
  /** delete data from the table: "patient" */
  delete_patient?: Maybe<Patient_Mutation_Response>;
  /** delete single row from the table: "patient" */
  delete_patient_by_pk?: Maybe<Patient>;
  /** delete data from the table: "patient_field_config" */
  delete_patient_field_config?: Maybe<Patient_Field_Config_Mutation_Response>;
  /** delete single row from the table: "patient_field_config" */
  delete_patient_field_config_by_pk?: Maybe<Patient_Field_Config>;
  /** delete data from the table: "patient_financial" */
  delete_patient_financial?: Maybe<Patient_Financial_Mutation_Response>;
  /** delete single row from the table: "patient_financial" */
  delete_patient_financial_by_pk?: Maybe<Patient_Financial>;
  /** delete data from the table: "patient_referral" */
  delete_patient_referral?: Maybe<Patient_Referral_Mutation_Response>;
  /** delete single row from the table: "patient_referral" */
  delete_patient_referral_by_pk?: Maybe<Patient_Referral>;
  /** delete data from the table: "patient_status_enum" */
  delete_patient_status_enum?: Maybe<Patient_Status_Enum_Mutation_Response>;
  /** delete single row from the table: "patient_status_enum" */
  delete_patient_status_enum_by_pk?: Maybe<Patient_Status_Enum>;
  /** delete data from the table: "person" */
  delete_person?: Maybe<Person_Mutation_Response>;
  /** delete single row from the table: "person" */
  delete_person_by_pk?: Maybe<Person>;
  /** delete data from the table: "person_contact_point" */
  delete_person_contact_point?: Maybe<Person_Contact_Point_Mutation_Response>;
  /** delete single row from the table: "person_contact_point" */
  delete_person_contact_point_by_pk?: Maybe<Person_Contact_Point>;
  /** delete data from the table: "referral_kind_enum" */
  delete_referral_kind_enum?: Maybe<Referral_Kind_Enum_Mutation_Response>;
  /** delete single row from the table: "referral_kind_enum" */
  delete_referral_kind_enum_by_pk?: Maybe<Referral_Kind_Enum>;
  /** delete data from the table: "referral_source" */
  delete_referral_source?: Maybe<Referral_Source_Mutation_Response>;
  /** delete single row from the table: "referral_source" */
  delete_referral_source_by_pk?: Maybe<Referral_Source>;
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
  /** delete data from the table: "search_household_heads_result" */
  delete_search_household_heads_result?: Maybe<Search_Household_Heads_Result_Mutation_Response>;
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
  /** insert data into the table: "address" */
  insert_address?: Maybe<Address_Mutation_Response>;
  /** insert a single row into the table: "address" */
  insert_address_one?: Maybe<Address>;
  /** insert data into the table: "app_user" */
  insert_app_user?: Maybe<App_User_Mutation_Response>;
  /** insert a single row into the table: "app_user" */
  insert_app_user_one?: Maybe<App_User>;
  /** insert data into the table: "app_user_v" */
  insert_app_user_v?: Maybe<App_User_V_Mutation_Response>;
  /** insert a single row into the table: "app_user_v" */
  insert_app_user_v_one?: Maybe<App_User_V>;
  /** insert data into the table: "audit.event" */
  insert_audit_event?: Maybe<Audit_Event_Mutation_Response>;
  /** insert a single row into the table: "audit.event" */
  insert_audit_event_one?: Maybe<Audit_Event>;
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
  /** insert data into the table: "family_group_v" */
  insert_family_group_v?: Maybe<Family_Group_V_Mutation_Response>;
  /** insert a single row into the table: "family_group_v" */
  insert_family_group_v_one?: Maybe<Family_Group_V>;
  /** insert data into the table: "gender_enum" */
  insert_gender_enum?: Maybe<Gender_Enum_Mutation_Response>;
  /** insert a single row into the table: "gender_enum" */
  insert_gender_enum_one?: Maybe<Gender_Enum>;
  /** insert data into the table: "insurance_subscriber" */
  insert_insurance_subscriber?: Maybe<Insurance_Subscriber_Mutation_Response>;
  /** insert a single row into the table: "insurance_subscriber" */
  insert_insurance_subscriber_one?: Maybe<Insurance_Subscriber>;
  /** insert data into the table: "operatory" */
  insert_operatory?: Maybe<Operatory_Mutation_Response>;
  /** insert a single row into the table: "operatory" */
  insert_operatory_one?: Maybe<Operatory>;
  /** insert data into the table: "operatory_v" */
  insert_operatory_v?: Maybe<Operatory_V_Mutation_Response>;
  /** insert a single row into the table: "operatory_v" */
  insert_operatory_v_one?: Maybe<Operatory_V>;
  /** insert data into the table: "patient" */
  insert_patient?: Maybe<Patient_Mutation_Response>;
  /** insert data into the table: "patient_field_config" */
  insert_patient_field_config?: Maybe<Patient_Field_Config_Mutation_Response>;
  /** insert a single row into the table: "patient_field_config" */
  insert_patient_field_config_one?: Maybe<Patient_Field_Config>;
  /** insert data into the table: "patient_financial" */
  insert_patient_financial?: Maybe<Patient_Financial_Mutation_Response>;
  /** insert a single row into the table: "patient_financial" */
  insert_patient_financial_one?: Maybe<Patient_Financial>;
  /** insert a single row into the table: "patient" */
  insert_patient_one?: Maybe<Patient>;
  /** insert data into the table: "patient_referral" */
  insert_patient_referral?: Maybe<Patient_Referral_Mutation_Response>;
  /** insert a single row into the table: "patient_referral" */
  insert_patient_referral_one?: Maybe<Patient_Referral>;
  /** insert data into the table: "patient_status_enum" */
  insert_patient_status_enum?: Maybe<Patient_Status_Enum_Mutation_Response>;
  /** insert a single row into the table: "patient_status_enum" */
  insert_patient_status_enum_one?: Maybe<Patient_Status_Enum>;
  /** insert data into the table: "person" */
  insert_person?: Maybe<Person_Mutation_Response>;
  /** insert data into the table: "person_contact_point" */
  insert_person_contact_point?: Maybe<Person_Contact_Point_Mutation_Response>;
  /** insert a single row into the table: "person_contact_point" */
  insert_person_contact_point_one?: Maybe<Person_Contact_Point>;
  /** insert a single row into the table: "person" */
  insert_person_one?: Maybe<Person>;
  /** insert data into the table: "referral_kind_enum" */
  insert_referral_kind_enum?: Maybe<Referral_Kind_Enum_Mutation_Response>;
  /** insert a single row into the table: "referral_kind_enum" */
  insert_referral_kind_enum_one?: Maybe<Referral_Kind_Enum>;
  /** insert data into the table: "referral_source" */
  insert_referral_source?: Maybe<Referral_Source_Mutation_Response>;
  /** insert a single row into the table: "referral_source" */
  insert_referral_source_one?: Maybe<Referral_Source>;
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
  /** insert data into the table: "search_household_heads_result" */
  insert_search_household_heads_result?: Maybe<Search_Household_Heads_Result_Mutation_Response>;
  /** insert a single row into the table: "search_household_heads_result" */
  insert_search_household_heads_result_one?: Maybe<Search_Household_Heads_Result>;
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
  /** update data of the table: "address" */
  update_address?: Maybe<Address_Mutation_Response>;
  /** update single row of the table: "address" */
  update_address_by_pk?: Maybe<Address>;
  /** update multiples rows of table: "address" */
  update_address_many?: Maybe<Array<Maybe<Address_Mutation_Response>>>;
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
  /** update data of the table: "audit.event" */
  update_audit_event?: Maybe<Audit_Event_Mutation_Response>;
  /** update single row of the table: "audit.event" */
  update_audit_event_by_pk?: Maybe<Audit_Event>;
  /** update multiples rows of table: "audit.event" */
  update_audit_event_many?: Maybe<Array<Maybe<Audit_Event_Mutation_Response>>>;
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
  /** update data of the table: "family_group_v" */
  update_family_group_v?: Maybe<Family_Group_V_Mutation_Response>;
  /** update multiples rows of table: "family_group_v" */
  update_family_group_v_many?: Maybe<Array<Maybe<Family_Group_V_Mutation_Response>>>;
  /** update data of the table: "gender_enum" */
  update_gender_enum?: Maybe<Gender_Enum_Mutation_Response>;
  /** update single row of the table: "gender_enum" */
  update_gender_enum_by_pk?: Maybe<Gender_Enum>;
  /** update multiples rows of table: "gender_enum" */
  update_gender_enum_many?: Maybe<Array<Maybe<Gender_Enum_Mutation_Response>>>;
  /** update data of the table: "insurance_subscriber" */
  update_insurance_subscriber?: Maybe<Insurance_Subscriber_Mutation_Response>;
  /** update single row of the table: "insurance_subscriber" */
  update_insurance_subscriber_by_pk?: Maybe<Insurance_Subscriber>;
  /** update multiples rows of table: "insurance_subscriber" */
  update_insurance_subscriber_many?: Maybe<Array<Maybe<Insurance_Subscriber_Mutation_Response>>>;
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
  /** update data of the table: "patient" */
  update_patient?: Maybe<Patient_Mutation_Response>;
  /** update single row of the table: "patient" */
  update_patient_by_pk?: Maybe<Patient>;
  /** update data of the table: "patient_field_config" */
  update_patient_field_config?: Maybe<Patient_Field_Config_Mutation_Response>;
  /** update single row of the table: "patient_field_config" */
  update_patient_field_config_by_pk?: Maybe<Patient_Field_Config>;
  /** update multiples rows of table: "patient_field_config" */
  update_patient_field_config_many?: Maybe<Array<Maybe<Patient_Field_Config_Mutation_Response>>>;
  /** update data of the table: "patient_financial" */
  update_patient_financial?: Maybe<Patient_Financial_Mutation_Response>;
  /** update single row of the table: "patient_financial" */
  update_patient_financial_by_pk?: Maybe<Patient_Financial>;
  /** update multiples rows of table: "patient_financial" */
  update_patient_financial_many?: Maybe<Array<Maybe<Patient_Financial_Mutation_Response>>>;
  /** update multiples rows of table: "patient" */
  update_patient_many?: Maybe<Array<Maybe<Patient_Mutation_Response>>>;
  /** update data of the table: "patient_referral" */
  update_patient_referral?: Maybe<Patient_Referral_Mutation_Response>;
  /** update single row of the table: "patient_referral" */
  update_patient_referral_by_pk?: Maybe<Patient_Referral>;
  /** update multiples rows of table: "patient_referral" */
  update_patient_referral_many?: Maybe<Array<Maybe<Patient_Referral_Mutation_Response>>>;
  /** update data of the table: "patient_status_enum" */
  update_patient_status_enum?: Maybe<Patient_Status_Enum_Mutation_Response>;
  /** update single row of the table: "patient_status_enum" */
  update_patient_status_enum_by_pk?: Maybe<Patient_Status_Enum>;
  /** update multiples rows of table: "patient_status_enum" */
  update_patient_status_enum_many?: Maybe<Array<Maybe<Patient_Status_Enum_Mutation_Response>>>;
  /** update data of the table: "person" */
  update_person?: Maybe<Person_Mutation_Response>;
  /** update single row of the table: "person" */
  update_person_by_pk?: Maybe<Person>;
  /** update data of the table: "person_contact_point" */
  update_person_contact_point?: Maybe<Person_Contact_Point_Mutation_Response>;
  /** update single row of the table: "person_contact_point" */
  update_person_contact_point_by_pk?: Maybe<Person_Contact_Point>;
  /** update multiples rows of table: "person_contact_point" */
  update_person_contact_point_many?: Maybe<Array<Maybe<Person_Contact_Point_Mutation_Response>>>;
  /** update multiples rows of table: "person" */
  update_person_many?: Maybe<Array<Maybe<Person_Mutation_Response>>>;
  /** update data of the table: "referral_kind_enum" */
  update_referral_kind_enum?: Maybe<Referral_Kind_Enum_Mutation_Response>;
  /** update single row of the table: "referral_kind_enum" */
  update_referral_kind_enum_by_pk?: Maybe<Referral_Kind_Enum>;
  /** update multiples rows of table: "referral_kind_enum" */
  update_referral_kind_enum_many?: Maybe<Array<Maybe<Referral_Kind_Enum_Mutation_Response>>>;
  /** update data of the table: "referral_source" */
  update_referral_source?: Maybe<Referral_Source_Mutation_Response>;
  /** update single row of the table: "referral_source" */
  update_referral_source_by_pk?: Maybe<Referral_Source>;
  /** update multiples rows of table: "referral_source" */
  update_referral_source_many?: Maybe<Array<Maybe<Referral_Source_Mutation_Response>>>;
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
  /** update data of the table: "search_household_heads_result" */
  update_search_household_heads_result?: Maybe<Search_Household_Heads_Result_Mutation_Response>;
  /** update multiples rows of table: "search_household_heads_result" */
  update_search_household_heads_result_many?: Maybe<Array<Maybe<Search_Household_Heads_Result_Mutation_Response>>>;
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
export type Mutation_RootDelete_AddressArgs = {
  where: Address_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Address_By_PkArgs = {
  id: Scalars['bigint']['input'];
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
export type Mutation_RootDelete_Audit_EventArgs = {
  where: Audit_Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Audit_Event_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CapabilityArgs = {
  where: Capability_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Capability_By_PkArgs = {
  value: Scalars['String']['input'];
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
export type Mutation_RootDelete_Family_Group_VArgs = {
  where: Family_Group_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Gender_EnumArgs = {
  where: Gender_Enum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Gender_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Insurance_SubscriberArgs = {
  where: Insurance_Subscriber_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Insurance_Subscriber_By_PkArgs = {
  id: Scalars['bigint']['input'];
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
export type Mutation_RootDelete_PatientArgs = {
  where: Patient_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Patient_By_PkArgs = {
  person_id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Patient_Field_ConfigArgs = {
  where: Patient_Field_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Patient_Field_Config_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Patient_FinancialArgs = {
  where: Patient_Financial_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Patient_Financial_By_PkArgs = {
  patient_person_id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Patient_ReferralArgs = {
  where: Patient_Referral_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Patient_Referral_By_PkArgs = {
  patient_person_id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Patient_Status_EnumArgs = {
  where: Patient_Status_Enum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Patient_Status_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_PersonArgs = {
  where: Person_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Person_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Person_Contact_PointArgs = {
  where: Person_Contact_Point_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Person_Contact_Point_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Referral_Kind_EnumArgs = {
  where: Referral_Kind_Enum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Referral_Kind_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Referral_SourceArgs = {
  where: Referral_Source_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Referral_Source_By_PkArgs = {
  id: Scalars['bigint']['input'];
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
  capability_key: Capability_Enum;
  role_id: Scalars['bigint']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Role_VArgs = {
  where: Role_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Search_Household_Heads_ResultArgs = {
  where: Search_Household_Heads_Result_Bool_Exp;
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
export type Mutation_RootInsert_AddressArgs = {
  objects: Array<Address_Insert_Input>;
  on_conflict?: InputMaybe<Address_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Address_OneArgs = {
  object: Address_Insert_Input;
  on_conflict?: InputMaybe<Address_On_Conflict>;
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
export type Mutation_RootInsert_Audit_EventArgs = {
  objects: Array<Audit_Event_Insert_Input>;
  on_conflict?: InputMaybe<Audit_Event_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Audit_Event_OneArgs = {
  object: Audit_Event_Insert_Input;
  on_conflict?: InputMaybe<Audit_Event_On_Conflict>;
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
export type Mutation_RootInsert_Family_Group_VArgs = {
  objects: Array<Family_Group_V_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Family_Group_V_OneArgs = {
  object: Family_Group_V_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Gender_EnumArgs = {
  objects: Array<Gender_Enum_Insert_Input>;
  on_conflict?: InputMaybe<Gender_Enum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Gender_Enum_OneArgs = {
  object: Gender_Enum_Insert_Input;
  on_conflict?: InputMaybe<Gender_Enum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Insurance_SubscriberArgs = {
  objects: Array<Insurance_Subscriber_Insert_Input>;
  on_conflict?: InputMaybe<Insurance_Subscriber_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Insurance_Subscriber_OneArgs = {
  object: Insurance_Subscriber_Insert_Input;
  on_conflict?: InputMaybe<Insurance_Subscriber_On_Conflict>;
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
export type Mutation_RootInsert_PatientArgs = {
  objects: Array<Patient_Insert_Input>;
  on_conflict?: InputMaybe<Patient_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_Field_ConfigArgs = {
  objects: Array<Patient_Field_Config_Insert_Input>;
  on_conflict?: InputMaybe<Patient_Field_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_Field_Config_OneArgs = {
  object: Patient_Field_Config_Insert_Input;
  on_conflict?: InputMaybe<Patient_Field_Config_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_FinancialArgs = {
  objects: Array<Patient_Financial_Insert_Input>;
  on_conflict?: InputMaybe<Patient_Financial_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_Financial_OneArgs = {
  object: Patient_Financial_Insert_Input;
  on_conflict?: InputMaybe<Patient_Financial_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_OneArgs = {
  object: Patient_Insert_Input;
  on_conflict?: InputMaybe<Patient_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_ReferralArgs = {
  objects: Array<Patient_Referral_Insert_Input>;
  on_conflict?: InputMaybe<Patient_Referral_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_Referral_OneArgs = {
  object: Patient_Referral_Insert_Input;
  on_conflict?: InputMaybe<Patient_Referral_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_Status_EnumArgs = {
  objects: Array<Patient_Status_Enum_Insert_Input>;
  on_conflict?: InputMaybe<Patient_Status_Enum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Patient_Status_Enum_OneArgs = {
  object: Patient_Status_Enum_Insert_Input;
  on_conflict?: InputMaybe<Patient_Status_Enum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_PersonArgs = {
  objects: Array<Person_Insert_Input>;
  on_conflict?: InputMaybe<Person_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Person_Contact_PointArgs = {
  objects: Array<Person_Contact_Point_Insert_Input>;
  on_conflict?: InputMaybe<Person_Contact_Point_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Person_Contact_Point_OneArgs = {
  object: Person_Contact_Point_Insert_Input;
  on_conflict?: InputMaybe<Person_Contact_Point_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Person_OneArgs = {
  object: Person_Insert_Input;
  on_conflict?: InputMaybe<Person_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Referral_Kind_EnumArgs = {
  objects: Array<Referral_Kind_Enum_Insert_Input>;
  on_conflict?: InputMaybe<Referral_Kind_Enum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Referral_Kind_Enum_OneArgs = {
  object: Referral_Kind_Enum_Insert_Input;
  on_conflict?: InputMaybe<Referral_Kind_Enum_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Referral_SourceArgs = {
  objects: Array<Referral_Source_Insert_Input>;
  on_conflict?: InputMaybe<Referral_Source_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Referral_Source_OneArgs = {
  object: Referral_Source_Insert_Input;
  on_conflict?: InputMaybe<Referral_Source_On_Conflict>;
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
export type Mutation_RootInsert_Search_Household_Heads_ResultArgs = {
  objects: Array<Search_Household_Heads_Result_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Search_Household_Heads_Result_OneArgs = {
  object: Search_Household_Heads_Result_Insert_Input;
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
export type Mutation_RootUpdate_AddressArgs = {
  _inc?: InputMaybe<Address_Inc_Input>;
  _set?: InputMaybe<Address_Set_Input>;
  where: Address_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Address_By_PkArgs = {
  _inc?: InputMaybe<Address_Inc_Input>;
  _set?: InputMaybe<Address_Set_Input>;
  pk_columns: Address_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Address_ManyArgs = {
  updates: Array<Address_Updates>;
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
export type Mutation_RootUpdate_Audit_EventArgs = {
  _append?: InputMaybe<Audit_Event_Append_Input>;
  _delete_at_path?: InputMaybe<Audit_Event_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Audit_Event_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Audit_Event_Delete_Key_Input>;
  _inc?: InputMaybe<Audit_Event_Inc_Input>;
  _prepend?: InputMaybe<Audit_Event_Prepend_Input>;
  _set?: InputMaybe<Audit_Event_Set_Input>;
  where: Audit_Event_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Audit_Event_By_PkArgs = {
  _append?: InputMaybe<Audit_Event_Append_Input>;
  _delete_at_path?: InputMaybe<Audit_Event_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Audit_Event_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Audit_Event_Delete_Key_Input>;
  _inc?: InputMaybe<Audit_Event_Inc_Input>;
  _prepend?: InputMaybe<Audit_Event_Prepend_Input>;
  _set?: InputMaybe<Audit_Event_Set_Input>;
  pk_columns: Audit_Event_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Audit_Event_ManyArgs = {
  updates: Array<Audit_Event_Updates>;
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
export type Mutation_RootUpdate_Family_Group_VArgs = {
  _inc?: InputMaybe<Family_Group_V_Inc_Input>;
  _set?: InputMaybe<Family_Group_V_Set_Input>;
  where: Family_Group_V_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Family_Group_V_ManyArgs = {
  updates: Array<Family_Group_V_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Gender_EnumArgs = {
  _set?: InputMaybe<Gender_Enum_Set_Input>;
  where: Gender_Enum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Gender_Enum_By_PkArgs = {
  _set?: InputMaybe<Gender_Enum_Set_Input>;
  pk_columns: Gender_Enum_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Gender_Enum_ManyArgs = {
  updates: Array<Gender_Enum_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Insurance_SubscriberArgs = {
  _inc?: InputMaybe<Insurance_Subscriber_Inc_Input>;
  _set?: InputMaybe<Insurance_Subscriber_Set_Input>;
  where: Insurance_Subscriber_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Insurance_Subscriber_By_PkArgs = {
  _inc?: InputMaybe<Insurance_Subscriber_Inc_Input>;
  _set?: InputMaybe<Insurance_Subscriber_Set_Input>;
  pk_columns: Insurance_Subscriber_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Insurance_Subscriber_ManyArgs = {
  updates: Array<Insurance_Subscriber_Updates>;
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
export type Mutation_RootUpdate_PatientArgs = {
  _inc?: InputMaybe<Patient_Inc_Input>;
  _set?: InputMaybe<Patient_Set_Input>;
  where: Patient_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_By_PkArgs = {
  _inc?: InputMaybe<Patient_Inc_Input>;
  _set?: InputMaybe<Patient_Set_Input>;
  pk_columns: Patient_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Field_ConfigArgs = {
  _inc?: InputMaybe<Patient_Field_Config_Inc_Input>;
  _set?: InputMaybe<Patient_Field_Config_Set_Input>;
  where: Patient_Field_Config_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Field_Config_By_PkArgs = {
  _inc?: InputMaybe<Patient_Field_Config_Inc_Input>;
  _set?: InputMaybe<Patient_Field_Config_Set_Input>;
  pk_columns: Patient_Field_Config_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Field_Config_ManyArgs = {
  updates: Array<Patient_Field_Config_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_FinancialArgs = {
  _inc?: InputMaybe<Patient_Financial_Inc_Input>;
  _set?: InputMaybe<Patient_Financial_Set_Input>;
  where: Patient_Financial_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Financial_By_PkArgs = {
  _inc?: InputMaybe<Patient_Financial_Inc_Input>;
  _set?: InputMaybe<Patient_Financial_Set_Input>;
  pk_columns: Patient_Financial_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Financial_ManyArgs = {
  updates: Array<Patient_Financial_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_ManyArgs = {
  updates: Array<Patient_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_ReferralArgs = {
  _inc?: InputMaybe<Patient_Referral_Inc_Input>;
  _set?: InputMaybe<Patient_Referral_Set_Input>;
  where: Patient_Referral_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Referral_By_PkArgs = {
  _inc?: InputMaybe<Patient_Referral_Inc_Input>;
  _set?: InputMaybe<Patient_Referral_Set_Input>;
  pk_columns: Patient_Referral_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Referral_ManyArgs = {
  updates: Array<Patient_Referral_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Status_EnumArgs = {
  _set?: InputMaybe<Patient_Status_Enum_Set_Input>;
  where: Patient_Status_Enum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Status_Enum_By_PkArgs = {
  _set?: InputMaybe<Patient_Status_Enum_Set_Input>;
  pk_columns: Patient_Status_Enum_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Patient_Status_Enum_ManyArgs = {
  updates: Array<Patient_Status_Enum_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_PersonArgs = {
  _inc?: InputMaybe<Person_Inc_Input>;
  _set?: InputMaybe<Person_Set_Input>;
  where: Person_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Person_By_PkArgs = {
  _inc?: InputMaybe<Person_Inc_Input>;
  _set?: InputMaybe<Person_Set_Input>;
  pk_columns: Person_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Person_Contact_PointArgs = {
  _inc?: InputMaybe<Person_Contact_Point_Inc_Input>;
  _set?: InputMaybe<Person_Contact_Point_Set_Input>;
  where: Person_Contact_Point_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Person_Contact_Point_By_PkArgs = {
  _inc?: InputMaybe<Person_Contact_Point_Inc_Input>;
  _set?: InputMaybe<Person_Contact_Point_Set_Input>;
  pk_columns: Person_Contact_Point_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Person_Contact_Point_ManyArgs = {
  updates: Array<Person_Contact_Point_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Person_ManyArgs = {
  updates: Array<Person_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Referral_Kind_EnumArgs = {
  _set?: InputMaybe<Referral_Kind_Enum_Set_Input>;
  where: Referral_Kind_Enum_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Referral_Kind_Enum_By_PkArgs = {
  _set?: InputMaybe<Referral_Kind_Enum_Set_Input>;
  pk_columns: Referral_Kind_Enum_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Referral_Kind_Enum_ManyArgs = {
  updates: Array<Referral_Kind_Enum_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Referral_SourceArgs = {
  _inc?: InputMaybe<Referral_Source_Inc_Input>;
  _set?: InputMaybe<Referral_Source_Set_Input>;
  where: Referral_Source_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Referral_Source_By_PkArgs = {
  _inc?: InputMaybe<Referral_Source_Inc_Input>;
  _set?: InputMaybe<Referral_Source_Set_Input>;
  pk_columns: Referral_Source_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Referral_Source_ManyArgs = {
  updates: Array<Referral_Source_Updates>;
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
export type Mutation_RootUpdate_Search_Household_Heads_ResultArgs = {
  _inc?: InputMaybe<Search_Household_Heads_Result_Inc_Input>;
  _set?: InputMaybe<Search_Household_Heads_Result_Set_Input>;
  where: Search_Household_Heads_Result_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Search_Household_Heads_Result_ManyArgs = {
  updates: Array<Search_Household_Heads_Result_Updates>;
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

/** columns and relationships of "patient" */
export type Patient = {
  __typename?: 'patient';
  chart_no?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  family_doctor_name?: Maybe<Scalars['String']['output']>;
  family_doctor_phone?: Maybe<Scalars['String']['output']>;
  imaging_id?: Maybe<Scalars['String']['output']>;
  is_active: Scalars['Boolean']['output'];
  /** An object relationship */
  patient_financial?: Maybe<Patient_Financial>;
  /** An array relationship */
  patient_referral: Array<Patient_Referral>;
  /** An aggregate relationship */
  patient_referral_aggregate: Patient_Referral_Aggregate;
  /** An object relationship */
  person: Person;
  person_id: Scalars['bigint']['output'];
  status: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "patient" */
export type PatientPatient_ReferralArgs = {
  distinct_on?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Referral_Order_By>>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};


/** columns and relationships of "patient" */
export type PatientPatient_Referral_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Referral_Order_By>>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};

/** aggregated selection of "patient" */
export type Patient_Aggregate = {
  __typename?: 'patient_aggregate';
  aggregate?: Maybe<Patient_Aggregate_Fields>;
  nodes: Array<Patient>;
};

/** aggregate fields of "patient" */
export type Patient_Aggregate_Fields = {
  __typename?: 'patient_aggregate_fields';
  avg?: Maybe<Patient_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Patient_Max_Fields>;
  min?: Maybe<Patient_Min_Fields>;
  stddev?: Maybe<Patient_Stddev_Fields>;
  stddev_pop?: Maybe<Patient_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Patient_Stddev_Samp_Fields>;
  sum?: Maybe<Patient_Sum_Fields>;
  var_pop?: Maybe<Patient_Var_Pop_Fields>;
  var_samp?: Maybe<Patient_Var_Samp_Fields>;
  variance?: Maybe<Patient_Variance_Fields>;
};


/** aggregate fields of "patient" */
export type Patient_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Patient_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Patient_Avg_Fields = {
  __typename?: 'patient_avg_fields';
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "patient". All fields are combined with a logical 'AND'. */
export type Patient_Bool_Exp = {
  _and?: InputMaybe<Array<Patient_Bool_Exp>>;
  _not?: InputMaybe<Patient_Bool_Exp>;
  _or?: InputMaybe<Array<Patient_Bool_Exp>>;
  chart_no?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  family_doctor_name?: InputMaybe<String_Comparison_Exp>;
  family_doctor_phone?: InputMaybe<String_Comparison_Exp>;
  imaging_id?: InputMaybe<String_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  patient_financial?: InputMaybe<Patient_Financial_Bool_Exp>;
  patient_referral?: InputMaybe<Patient_Referral_Bool_Exp>;
  patient_referral_aggregate?: InputMaybe<Patient_Referral_Aggregate_Bool_Exp>;
  person?: InputMaybe<Person_Bool_Exp>;
  person_id?: InputMaybe<Bigint_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "patient" */
export type Patient_Constraint =
  /** unique or primary key constraint on columns "person_id" */
  | 'patient_pkey';

/** columns and relationships of "patient_field_config" */
export type Patient_Field_Config = {
  __typename?: 'patient_field_config';
  clinic_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  display_order: Scalars['Int']['output'];
  field_key: Scalars['String']['output'];
  field_label: Scalars['String']['output'];
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  is_displayed: Scalars['Boolean']['output'];
  is_required: Scalars['Boolean']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "patient_field_config" */
export type Patient_Field_Config_Aggregate = {
  __typename?: 'patient_field_config_aggregate';
  aggregate?: Maybe<Patient_Field_Config_Aggregate_Fields>;
  nodes: Array<Patient_Field_Config>;
};

/** aggregate fields of "patient_field_config" */
export type Patient_Field_Config_Aggregate_Fields = {
  __typename?: 'patient_field_config_aggregate_fields';
  avg?: Maybe<Patient_Field_Config_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Patient_Field_Config_Max_Fields>;
  min?: Maybe<Patient_Field_Config_Min_Fields>;
  stddev?: Maybe<Patient_Field_Config_Stddev_Fields>;
  stddev_pop?: Maybe<Patient_Field_Config_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Patient_Field_Config_Stddev_Samp_Fields>;
  sum?: Maybe<Patient_Field_Config_Sum_Fields>;
  var_pop?: Maybe<Patient_Field_Config_Var_Pop_Fields>;
  var_samp?: Maybe<Patient_Field_Config_Var_Samp_Fields>;
  variance?: Maybe<Patient_Field_Config_Variance_Fields>;
};


/** aggregate fields of "patient_field_config" */
export type Patient_Field_Config_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Patient_Field_Config_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Patient_Field_Config_Avg_Fields = {
  __typename?: 'patient_field_config_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  display_order?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "patient_field_config". All fields are combined with a logical 'AND'. */
export type Patient_Field_Config_Bool_Exp = {
  _and?: InputMaybe<Array<Patient_Field_Config_Bool_Exp>>;
  _not?: InputMaybe<Patient_Field_Config_Bool_Exp>;
  _or?: InputMaybe<Array<Patient_Field_Config_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  display_order?: InputMaybe<Int_Comparison_Exp>;
  field_key?: InputMaybe<String_Comparison_Exp>;
  field_label?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_displayed?: InputMaybe<Boolean_Comparison_Exp>;
  is_required?: InputMaybe<Boolean_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "patient_field_config" */
export type Patient_Field_Config_Constraint =
  /** unique or primary key constraint on columns "clinic_id", "field_key" */
  | 'patient_field_config_clinic_id_field_key_key'
  /** unique or primary key constraint on columns "id" */
  | 'patient_field_config_pkey';

/** input type for incrementing numeric columns in table "patient_field_config" */
export type Patient_Field_Config_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "patient_field_config" */
export type Patient_Field_Config_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  field_key?: InputMaybe<Scalars['String']['input']>;
  field_label?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_displayed?: InputMaybe<Scalars['Boolean']['input']>;
  is_required?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Patient_Field_Config_Max_Fields = {
  __typename?: 'patient_field_config_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  field_key?: Maybe<Scalars['String']['output']>;
  field_label?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Patient_Field_Config_Min_Fields = {
  __typename?: 'patient_field_config_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  field_key?: Maybe<Scalars['String']['output']>;
  field_label?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "patient_field_config" */
export type Patient_Field_Config_Mutation_Response = {
  __typename?: 'patient_field_config_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Patient_Field_Config>;
};

/** on_conflict condition type for table "patient_field_config" */
export type Patient_Field_Config_On_Conflict = {
  constraint: Patient_Field_Config_Constraint;
  update_columns?: Array<Patient_Field_Config_Update_Column>;
  where?: InputMaybe<Patient_Field_Config_Bool_Exp>;
};

/** Ordering options when selecting data from "patient_field_config". */
export type Patient_Field_Config_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  display_order?: InputMaybe<Order_By>;
  field_key?: InputMaybe<Order_By>;
  field_label?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_displayed?: InputMaybe<Order_By>;
  is_required?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: patient_field_config */
export type Patient_Field_Config_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "patient_field_config" */
export type Patient_Field_Config_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'display_order'
  /** column name */
  | 'field_key'
  /** column name */
  | 'field_label'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_displayed'
  /** column name */
  | 'is_required'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "patient_field_config" */
export type Patient_Field_Config_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  field_key?: InputMaybe<Scalars['String']['input']>;
  field_label?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_displayed?: InputMaybe<Scalars['Boolean']['input']>;
  is_required?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Patient_Field_Config_Stddev_Fields = {
  __typename?: 'patient_field_config_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  display_order?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Patient_Field_Config_Stddev_Pop_Fields = {
  __typename?: 'patient_field_config_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  display_order?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Patient_Field_Config_Stddev_Samp_Fields = {
  __typename?: 'patient_field_config_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  display_order?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "patient_field_config" */
export type Patient_Field_Config_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Patient_Field_Config_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Patient_Field_Config_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  display_order?: InputMaybe<Scalars['Int']['input']>;
  field_key?: InputMaybe<Scalars['String']['input']>;
  field_label?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_displayed?: InputMaybe<Scalars['Boolean']['input']>;
  is_required?: InputMaybe<Scalars['Boolean']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Patient_Field_Config_Sum_Fields = {
  __typename?: 'patient_field_config_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  display_order?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "patient_field_config" */
export type Patient_Field_Config_Update_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'display_order'
  /** column name */
  | 'field_key'
  /** column name */
  | 'field_label'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_displayed'
  /** column name */
  | 'is_required'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Patient_Field_Config_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Patient_Field_Config_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Patient_Field_Config_Set_Input>;
  /** filter the rows which have to be updated */
  where: Patient_Field_Config_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Patient_Field_Config_Var_Pop_Fields = {
  __typename?: 'patient_field_config_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  display_order?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Patient_Field_Config_Var_Samp_Fields = {
  __typename?: 'patient_field_config_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  display_order?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Patient_Field_Config_Variance_Fields = {
  __typename?: 'patient_field_config_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  display_order?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "patient_financial" */
export type Patient_Financial = {
  __typename?: 'patient_financial';
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  is_active: Scalars['Boolean']['output'];
  /** An object relationship */
  patient: Patient;
  patient_person_id: Scalars['bigint']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "patient_financial" */
export type Patient_Financial_Aggregate = {
  __typename?: 'patient_financial_aggregate';
  aggregate?: Maybe<Patient_Financial_Aggregate_Fields>;
  nodes: Array<Patient_Financial>;
};

/** aggregate fields of "patient_financial" */
export type Patient_Financial_Aggregate_Fields = {
  __typename?: 'patient_financial_aggregate_fields';
  avg?: Maybe<Patient_Financial_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Patient_Financial_Max_Fields>;
  min?: Maybe<Patient_Financial_Min_Fields>;
  stddev?: Maybe<Patient_Financial_Stddev_Fields>;
  stddev_pop?: Maybe<Patient_Financial_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Patient_Financial_Stddev_Samp_Fields>;
  sum?: Maybe<Patient_Financial_Sum_Fields>;
  var_pop?: Maybe<Patient_Financial_Var_Pop_Fields>;
  var_samp?: Maybe<Patient_Financial_Var_Samp_Fields>;
  variance?: Maybe<Patient_Financial_Variance_Fields>;
};


/** aggregate fields of "patient_financial" */
export type Patient_Financial_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Patient_Financial_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Patient_Financial_Avg_Fields = {
  __typename?: 'patient_financial_avg_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "patient_financial". All fields are combined with a logical 'AND'. */
export type Patient_Financial_Bool_Exp = {
  _and?: InputMaybe<Array<Patient_Financial_Bool_Exp>>;
  _not?: InputMaybe<Patient_Financial_Bool_Exp>;
  _or?: InputMaybe<Array<Patient_Financial_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  patient?: InputMaybe<Patient_Bool_Exp>;
  patient_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "patient_financial" */
export type Patient_Financial_Constraint =
  /** unique or primary key constraint on columns "patient_person_id" */
  | 'patient_financial_pkey';

/** input type for incrementing numeric columns in table "patient_financial" */
export type Patient_Financial_Inc_Input = {
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "patient_financial" */
export type Patient_Financial_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient?: InputMaybe<Patient_Obj_Rel_Insert_Input>;
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Patient_Financial_Max_Fields = {
  __typename?: 'patient_financial_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Patient_Financial_Min_Fields = {
  __typename?: 'patient_financial_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "patient_financial" */
export type Patient_Financial_Mutation_Response = {
  __typename?: 'patient_financial_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Patient_Financial>;
};

/** input type for inserting object relation for remote table "patient_financial" */
export type Patient_Financial_Obj_Rel_Insert_Input = {
  data: Patient_Financial_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Patient_Financial_On_Conflict>;
};

/** on_conflict condition type for table "patient_financial" */
export type Patient_Financial_On_Conflict = {
  constraint: Patient_Financial_Constraint;
  update_columns?: Array<Patient_Financial_Update_Column>;
  where?: InputMaybe<Patient_Financial_Bool_Exp>;
};

/** Ordering options when selecting data from "patient_financial". */
export type Patient_Financial_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  patient?: InputMaybe<Patient_Order_By>;
  patient_person_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: patient_financial */
export type Patient_Financial_Pk_Columns_Input = {
  patient_person_id: Scalars['bigint']['input'];
};

/** select columns of table "patient_financial" */
export type Patient_Financial_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'is_active'
  /** column name */
  | 'patient_person_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "patient_financial" */
export type Patient_Financial_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Patient_Financial_Stddev_Fields = {
  __typename?: 'patient_financial_stddev_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Patient_Financial_Stddev_Pop_Fields = {
  __typename?: 'patient_financial_stddev_pop_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Patient_Financial_Stddev_Samp_Fields = {
  __typename?: 'patient_financial_stddev_samp_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "patient_financial" */
export type Patient_Financial_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Patient_Financial_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Patient_Financial_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Patient_Financial_Sum_Fields = {
  __typename?: 'patient_financial_sum_fields';
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "patient_financial" */
export type Patient_Financial_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'is_active'
  /** column name */
  | 'patient_person_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Patient_Financial_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Patient_Financial_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Patient_Financial_Set_Input>;
  /** filter the rows which have to be updated */
  where: Patient_Financial_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Patient_Financial_Var_Pop_Fields = {
  __typename?: 'patient_financial_var_pop_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Patient_Financial_Var_Samp_Fields = {
  __typename?: 'patient_financial_var_samp_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Patient_Financial_Variance_Fields = {
  __typename?: 'patient_financial_variance_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
};

/** input type for incrementing numeric columns in table "patient" */
export type Patient_Inc_Input = {
  person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "patient" */
export type Patient_Insert_Input = {
  chart_no?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  family_doctor_name?: InputMaybe<Scalars['String']['input']>;
  family_doctor_phone?: InputMaybe<Scalars['String']['input']>;
  imaging_id?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient_financial?: InputMaybe<Patient_Financial_Obj_Rel_Insert_Input>;
  patient_referral?: InputMaybe<Patient_Referral_Arr_Rel_Insert_Input>;
  person?: InputMaybe<Person_Obj_Rel_Insert_Input>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Patient_Max_Fields = {
  __typename?: 'patient_max_fields';
  chart_no?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  family_doctor_name?: Maybe<Scalars['String']['output']>;
  family_doctor_phone?: Maybe<Scalars['String']['output']>;
  imaging_id?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Patient_Min_Fields = {
  __typename?: 'patient_min_fields';
  chart_no?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  family_doctor_name?: Maybe<Scalars['String']['output']>;
  family_doctor_phone?: Maybe<Scalars['String']['output']>;
  imaging_id?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "patient" */
export type Patient_Mutation_Response = {
  __typename?: 'patient_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Patient>;
};

/** input type for inserting object relation for remote table "patient" */
export type Patient_Obj_Rel_Insert_Input = {
  data: Patient_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Patient_On_Conflict>;
};

/** on_conflict condition type for table "patient" */
export type Patient_On_Conflict = {
  constraint: Patient_Constraint;
  update_columns?: Array<Patient_Update_Column>;
  where?: InputMaybe<Patient_Bool_Exp>;
};

/** Ordering options when selecting data from "patient". */
export type Patient_Order_By = {
  chart_no?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  family_doctor_name?: InputMaybe<Order_By>;
  family_doctor_phone?: InputMaybe<Order_By>;
  imaging_id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  patient_financial?: InputMaybe<Patient_Financial_Order_By>;
  patient_referral_aggregate?: InputMaybe<Patient_Referral_Aggregate_Order_By>;
  person?: InputMaybe<Person_Order_By>;
  person_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: patient */
export type Patient_Pk_Columns_Input = {
  person_id: Scalars['bigint']['input'];
};

/** columns and relationships of "patient_profile_v" */
export type Patient_Profile_V = {
  __typename?: 'patient_profile_v';
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  billing_city?: Maybe<Scalars['String']['output']>;
  billing_country?: Maybe<Scalars['String']['output']>;
  billing_line1?: Maybe<Scalars['String']['output']>;
  billing_line2?: Maybe<Scalars['String']['output']>;
  billing_postal_code?: Maybe<Scalars['String']['output']>;
  billing_region?: Maybe<Scalars['String']['output']>;
  chart_no?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  contact_points?: Maybe<Scalars['jsonb']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['bigint']['output']>;
  family_doctor_name?: Maybe<Scalars['String']['output']>;
  family_doctor_phone?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  imaging_id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  mailing_city?: Maybe<Scalars['String']['output']>;
  mailing_country?: Maybe<Scalars['String']['output']>;
  mailing_line1?: Maybe<Scalars['String']['output']>;
  mailing_line2?: Maybe<Scalars['String']['output']>;
  mailing_postal_code?: Maybe<Scalars['String']['output']>;
  mailing_region?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  patient_is_active?: Maybe<Scalars['Boolean']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  patient_status?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  person_is_active?: Maybe<Scalars['Boolean']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_first_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_last_name?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "patient_profile_v" */
export type Patient_Profile_VContact_PointsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "patient_profile_v" */
export type Patient_Profile_V_Aggregate = {
  __typename?: 'patient_profile_v_aggregate';
  aggregate?: Maybe<Patient_Profile_V_Aggregate_Fields>;
  nodes: Array<Patient_Profile_V>;
};

/** aggregate fields of "patient_profile_v" */
export type Patient_Profile_V_Aggregate_Fields = {
  __typename?: 'patient_profile_v_aggregate_fields';
  avg?: Maybe<Patient_Profile_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Patient_Profile_V_Max_Fields>;
  min?: Maybe<Patient_Profile_V_Min_Fields>;
  stddev?: Maybe<Patient_Profile_V_Stddev_Fields>;
  stddev_pop?: Maybe<Patient_Profile_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Patient_Profile_V_Stddev_Samp_Fields>;
  sum?: Maybe<Patient_Profile_V_Sum_Fields>;
  var_pop?: Maybe<Patient_Profile_V_Var_Pop_Fields>;
  var_samp?: Maybe<Patient_Profile_V_Var_Samp_Fields>;
  variance?: Maybe<Patient_Profile_V_Variance_Fields>;
};


/** aggregate fields of "patient_profile_v" */
export type Patient_Profile_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Patient_Profile_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Patient_Profile_V_Avg_Fields = {
  __typename?: 'patient_profile_v_avg_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "patient_profile_v". All fields are combined with a logical 'AND'. */
export type Patient_Profile_V_Bool_Exp = {
  _and?: InputMaybe<Array<Patient_Profile_V_Bool_Exp>>;
  _not?: InputMaybe<Patient_Profile_V_Bool_Exp>;
  _or?: InputMaybe<Array<Patient_Profile_V_Bool_Exp>>;
  billing_address_id?: InputMaybe<Bigint_Comparison_Exp>;
  billing_city?: InputMaybe<String_Comparison_Exp>;
  billing_country?: InputMaybe<String_Comparison_Exp>;
  billing_line1?: InputMaybe<String_Comparison_Exp>;
  billing_line2?: InputMaybe<String_Comparison_Exp>;
  billing_postal_code?: InputMaybe<String_Comparison_Exp>;
  billing_region?: InputMaybe<String_Comparison_Exp>;
  chart_no?: InputMaybe<String_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  contact_points?: InputMaybe<Jsonb_Comparison_Exp>;
  dob?: InputMaybe<Date_Comparison_Exp>;
  effective_responsible_party_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  family_doctor_name?: InputMaybe<String_Comparison_Exp>;
  family_doctor_phone?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  gender?: InputMaybe<String_Comparison_Exp>;
  household_head_id?: InputMaybe<Bigint_Comparison_Exp>;
  household_relationship?: InputMaybe<String_Comparison_Exp>;
  imaging_id?: InputMaybe<String_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  mailing_address_id?: InputMaybe<Bigint_Comparison_Exp>;
  mailing_city?: InputMaybe<String_Comparison_Exp>;
  mailing_country?: InputMaybe<String_Comparison_Exp>;
  mailing_line1?: InputMaybe<String_Comparison_Exp>;
  mailing_line2?: InputMaybe<String_Comparison_Exp>;
  mailing_postal_code?: InputMaybe<String_Comparison_Exp>;
  mailing_region?: InputMaybe<String_Comparison_Exp>;
  middle_name?: InputMaybe<String_Comparison_Exp>;
  patient_is_active?: InputMaybe<Boolean_Comparison_Exp>;
  patient_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  patient_status?: InputMaybe<String_Comparison_Exp>;
  person_id?: InputMaybe<Bigint_Comparison_Exp>;
  person_is_active?: InputMaybe<Boolean_Comparison_Exp>;
  preferred_language?: InputMaybe<String_Comparison_Exp>;
  preferred_name?: InputMaybe<String_Comparison_Exp>;
  responsible_party_first_name?: InputMaybe<String_Comparison_Exp>;
  responsible_party_id?: InputMaybe<Bigint_Comparison_Exp>;
  responsible_party_last_name?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Patient_Profile_V_Max_Fields = {
  __typename?: 'patient_profile_v_max_fields';
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  billing_city?: Maybe<Scalars['String']['output']>;
  billing_country?: Maybe<Scalars['String']['output']>;
  billing_line1?: Maybe<Scalars['String']['output']>;
  billing_line2?: Maybe<Scalars['String']['output']>;
  billing_postal_code?: Maybe<Scalars['String']['output']>;
  billing_region?: Maybe<Scalars['String']['output']>;
  chart_no?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['bigint']['output']>;
  family_doctor_name?: Maybe<Scalars['String']['output']>;
  family_doctor_phone?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  imaging_id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  mailing_city?: Maybe<Scalars['String']['output']>;
  mailing_country?: Maybe<Scalars['String']['output']>;
  mailing_line1?: Maybe<Scalars['String']['output']>;
  mailing_line2?: Maybe<Scalars['String']['output']>;
  mailing_postal_code?: Maybe<Scalars['String']['output']>;
  mailing_region?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  patient_status?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_first_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_last_name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Patient_Profile_V_Min_Fields = {
  __typename?: 'patient_profile_v_min_fields';
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  billing_city?: Maybe<Scalars['String']['output']>;
  billing_country?: Maybe<Scalars['String']['output']>;
  billing_line1?: Maybe<Scalars['String']['output']>;
  billing_line2?: Maybe<Scalars['String']['output']>;
  billing_postal_code?: Maybe<Scalars['String']['output']>;
  billing_region?: Maybe<Scalars['String']['output']>;
  chart_no?: Maybe<Scalars['String']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['bigint']['output']>;
  family_doctor_name?: Maybe<Scalars['String']['output']>;
  family_doctor_phone?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  imaging_id?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  mailing_city?: Maybe<Scalars['String']['output']>;
  mailing_country?: Maybe<Scalars['String']['output']>;
  mailing_line1?: Maybe<Scalars['String']['output']>;
  mailing_line2?: Maybe<Scalars['String']['output']>;
  mailing_postal_code?: Maybe<Scalars['String']['output']>;
  mailing_region?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  patient_status?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_first_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_last_name?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "patient_profile_v". */
export type Patient_Profile_V_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  billing_city?: InputMaybe<Order_By>;
  billing_country?: InputMaybe<Order_By>;
  billing_line1?: InputMaybe<Order_By>;
  billing_line2?: InputMaybe<Order_By>;
  billing_postal_code?: InputMaybe<Order_By>;
  billing_region?: InputMaybe<Order_By>;
  chart_no?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  contact_points?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  effective_responsible_party_person_id?: InputMaybe<Order_By>;
  family_doctor_name?: InputMaybe<Order_By>;
  family_doctor_phone?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  household_relationship?: InputMaybe<Order_By>;
  imaging_id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  mailing_city?: InputMaybe<Order_By>;
  mailing_country?: InputMaybe<Order_By>;
  mailing_line1?: InputMaybe<Order_By>;
  mailing_line2?: InputMaybe<Order_By>;
  mailing_postal_code?: InputMaybe<Order_By>;
  mailing_region?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  patient_is_active?: InputMaybe<Order_By>;
  patient_person_id?: InputMaybe<Order_By>;
  patient_status?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
  person_is_active?: InputMaybe<Order_By>;
  preferred_language?: InputMaybe<Order_By>;
  preferred_name?: InputMaybe<Order_By>;
  responsible_party_first_name?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
  responsible_party_last_name?: InputMaybe<Order_By>;
};

/** select columns of table "patient_profile_v" */
export type Patient_Profile_V_Select_Column =
  /** column name */
  | 'billing_address_id'
  /** column name */
  | 'billing_city'
  /** column name */
  | 'billing_country'
  /** column name */
  | 'billing_line1'
  /** column name */
  | 'billing_line2'
  /** column name */
  | 'billing_postal_code'
  /** column name */
  | 'billing_region'
  /** column name */
  | 'chart_no'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'contact_points'
  /** column name */
  | 'dob'
  /** column name */
  | 'effective_responsible_party_person_id'
  /** column name */
  | 'family_doctor_name'
  /** column name */
  | 'family_doctor_phone'
  /** column name */
  | 'first_name'
  /** column name */
  | 'gender'
  /** column name */
  | 'household_head_id'
  /** column name */
  | 'household_relationship'
  /** column name */
  | 'imaging_id'
  /** column name */
  | 'last_name'
  /** column name */
  | 'mailing_address_id'
  /** column name */
  | 'mailing_city'
  /** column name */
  | 'mailing_country'
  /** column name */
  | 'mailing_line1'
  /** column name */
  | 'mailing_line2'
  /** column name */
  | 'mailing_postal_code'
  /** column name */
  | 'mailing_region'
  /** column name */
  | 'middle_name'
  /** column name */
  | 'patient_is_active'
  /** column name */
  | 'patient_person_id'
  /** column name */
  | 'patient_status'
  /** column name */
  | 'person_id'
  /** column name */
  | 'person_is_active'
  /** column name */
  | 'preferred_language'
  /** column name */
  | 'preferred_name'
  /** column name */
  | 'responsible_party_first_name'
  /** column name */
  | 'responsible_party_id'
  /** column name */
  | 'responsible_party_last_name';

/** aggregate stddev on columns */
export type Patient_Profile_V_Stddev_Fields = {
  __typename?: 'patient_profile_v_stddev_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Patient_Profile_V_Stddev_Pop_Fields = {
  __typename?: 'patient_profile_v_stddev_pop_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Patient_Profile_V_Stddev_Samp_Fields = {
  __typename?: 'patient_profile_v_stddev_samp_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "patient_profile_v" */
export type Patient_Profile_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Patient_Profile_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Patient_Profile_V_Stream_Cursor_Value_Input = {
  billing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  billing_city?: InputMaybe<Scalars['String']['input']>;
  billing_country?: InputMaybe<Scalars['String']['input']>;
  billing_line1?: InputMaybe<Scalars['String']['input']>;
  billing_line2?: InputMaybe<Scalars['String']['input']>;
  billing_postal_code?: InputMaybe<Scalars['String']['input']>;
  billing_region?: InputMaybe<Scalars['String']['input']>;
  chart_no?: InputMaybe<Scalars['String']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  contact_points?: InputMaybe<Scalars['jsonb']['input']>;
  dob?: InputMaybe<Scalars['date']['input']>;
  effective_responsible_party_person_id?: InputMaybe<Scalars['bigint']['input']>;
  family_doctor_name?: InputMaybe<Scalars['String']['input']>;
  family_doctor_phone?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  household_relationship?: InputMaybe<Scalars['String']['input']>;
  imaging_id?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  mailing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  mailing_city?: InputMaybe<Scalars['String']['input']>;
  mailing_country?: InputMaybe<Scalars['String']['input']>;
  mailing_line1?: InputMaybe<Scalars['String']['input']>;
  mailing_line2?: InputMaybe<Scalars['String']['input']>;
  mailing_postal_code?: InputMaybe<Scalars['String']['input']>;
  mailing_region?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  patient_is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  patient_status?: InputMaybe<Scalars['String']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  person_is_active?: InputMaybe<Scalars['Boolean']['input']>;
  preferred_language?: InputMaybe<Scalars['String']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_first_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_id?: InputMaybe<Scalars['bigint']['input']>;
  responsible_party_last_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Patient_Profile_V_Sum_Fields = {
  __typename?: 'patient_profile_v_sum_fields';
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['bigint']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Patient_Profile_V_Var_Pop_Fields = {
  __typename?: 'patient_profile_v_var_pop_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Patient_Profile_V_Var_Samp_Fields = {
  __typename?: 'patient_profile_v_var_samp_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Patient_Profile_V_Variance_Fields = {
  __typename?: 'patient_profile_v_variance_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  effective_responsible_party_person_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "patient_referral" */
export type Patient_Referral = {
  __typename?: 'patient_referral';
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  is_active: Scalars['Boolean']['output'];
  /** An object relationship */
  patient: Patient;
  patient_person_id: Scalars['bigint']['output'];
  /** An object relationship */
  referral_contact_person?: Maybe<Person>;
  referral_contact_person_id?: Maybe<Scalars['bigint']['output']>;
  referral_kind: Scalars['String']['output'];
  /** An object relationship */
  referral_kind_enum?: Maybe<Referral_Kind_Enum>;
  referral_other_text?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  referral_source?: Maybe<Referral_Source>;
  referral_source_id?: Maybe<Scalars['bigint']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "patient_referral" */
export type Patient_Referral_Aggregate = {
  __typename?: 'patient_referral_aggregate';
  aggregate?: Maybe<Patient_Referral_Aggregate_Fields>;
  nodes: Array<Patient_Referral>;
};

export type Patient_Referral_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Patient_Referral_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Patient_Referral_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Patient_Referral_Aggregate_Bool_Exp_Count>;
};

export type Patient_Referral_Aggregate_Bool_Exp_Bool_And = {
  arguments: Patient_Referral_Select_Column_Patient_Referral_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Patient_Referral_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Patient_Referral_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Patient_Referral_Select_Column_Patient_Referral_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Patient_Referral_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Patient_Referral_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Patient_Referral_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "patient_referral" */
export type Patient_Referral_Aggregate_Fields = {
  __typename?: 'patient_referral_aggregate_fields';
  avg?: Maybe<Patient_Referral_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Patient_Referral_Max_Fields>;
  min?: Maybe<Patient_Referral_Min_Fields>;
  stddev?: Maybe<Patient_Referral_Stddev_Fields>;
  stddev_pop?: Maybe<Patient_Referral_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Patient_Referral_Stddev_Samp_Fields>;
  sum?: Maybe<Patient_Referral_Sum_Fields>;
  var_pop?: Maybe<Patient_Referral_Var_Pop_Fields>;
  var_samp?: Maybe<Patient_Referral_Var_Samp_Fields>;
  variance?: Maybe<Patient_Referral_Variance_Fields>;
};


/** aggregate fields of "patient_referral" */
export type Patient_Referral_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "patient_referral" */
export type Patient_Referral_Aggregate_Order_By = {
  avg?: InputMaybe<Patient_Referral_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Patient_Referral_Max_Order_By>;
  min?: InputMaybe<Patient_Referral_Min_Order_By>;
  stddev?: InputMaybe<Patient_Referral_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Patient_Referral_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Patient_Referral_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Patient_Referral_Sum_Order_By>;
  var_pop?: InputMaybe<Patient_Referral_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Patient_Referral_Var_Samp_Order_By>;
  variance?: InputMaybe<Patient_Referral_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "patient_referral" */
export type Patient_Referral_Arr_Rel_Insert_Input = {
  data: Array<Patient_Referral_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Patient_Referral_On_Conflict>;
};

/** aggregate avg on columns */
export type Patient_Referral_Avg_Fields = {
  __typename?: 'patient_referral_avg_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  referral_contact_person_id?: Maybe<Scalars['Float']['output']>;
  referral_source_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "patient_referral" */
export type Patient_Referral_Avg_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "patient_referral". All fields are combined with a logical 'AND'. */
export type Patient_Referral_Bool_Exp = {
  _and?: InputMaybe<Array<Patient_Referral_Bool_Exp>>;
  _not?: InputMaybe<Patient_Referral_Bool_Exp>;
  _or?: InputMaybe<Array<Patient_Referral_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  patient?: InputMaybe<Patient_Bool_Exp>;
  patient_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  referral_contact_person?: InputMaybe<Person_Bool_Exp>;
  referral_contact_person_id?: InputMaybe<Bigint_Comparison_Exp>;
  referral_kind?: InputMaybe<String_Comparison_Exp>;
  referral_kind_enum?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
  referral_other_text?: InputMaybe<String_Comparison_Exp>;
  referral_source?: InputMaybe<Referral_Source_Bool_Exp>;
  referral_source_id?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "patient_referral" */
export type Patient_Referral_Constraint =
  /** unique or primary key constraint on columns "patient_person_id" */
  | 'patient_referral_pkey';

/** input type for incrementing numeric columns in table "patient_referral" */
export type Patient_Referral_Inc_Input = {
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_contact_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_source_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "patient_referral" */
export type Patient_Referral_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient?: InputMaybe<Patient_Obj_Rel_Insert_Input>;
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_contact_person?: InputMaybe<Person_Obj_Rel_Insert_Input>;
  referral_contact_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_kind?: InputMaybe<Scalars['String']['input']>;
  referral_kind_enum?: InputMaybe<Referral_Kind_Enum_Obj_Rel_Insert_Input>;
  referral_other_text?: InputMaybe<Scalars['String']['input']>;
  referral_source?: InputMaybe<Referral_Source_Obj_Rel_Insert_Input>;
  referral_source_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Patient_Referral_Max_Fields = {
  __typename?: 'patient_referral_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  referral_contact_person_id?: Maybe<Scalars['bigint']['output']>;
  referral_kind?: Maybe<Scalars['String']['output']>;
  referral_other_text?: Maybe<Scalars['String']['output']>;
  referral_source_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "patient_referral" */
export type Patient_Referral_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_kind?: InputMaybe<Order_By>;
  referral_other_text?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Patient_Referral_Min_Fields = {
  __typename?: 'patient_referral_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  referral_contact_person_id?: Maybe<Scalars['bigint']['output']>;
  referral_kind?: Maybe<Scalars['String']['output']>;
  referral_other_text?: Maybe<Scalars['String']['output']>;
  referral_source_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "patient_referral" */
export type Patient_Referral_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_kind?: InputMaybe<Order_By>;
  referral_other_text?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "patient_referral" */
export type Patient_Referral_Mutation_Response = {
  __typename?: 'patient_referral_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Patient_Referral>;
};

/** on_conflict condition type for table "patient_referral" */
export type Patient_Referral_On_Conflict = {
  constraint: Patient_Referral_Constraint;
  update_columns?: Array<Patient_Referral_Update_Column>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};

/** Ordering options when selecting data from "patient_referral". */
export type Patient_Referral_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  patient?: InputMaybe<Patient_Order_By>;
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person?: InputMaybe<Person_Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_kind?: InputMaybe<Order_By>;
  referral_kind_enum?: InputMaybe<Referral_Kind_Enum_Order_By>;
  referral_other_text?: InputMaybe<Order_By>;
  referral_source?: InputMaybe<Referral_Source_Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: patient_referral */
export type Patient_Referral_Pk_Columns_Input = {
  patient_person_id: Scalars['bigint']['input'];
};

/** select columns of table "patient_referral" */
export type Patient_Referral_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'is_active'
  /** column name */
  | 'patient_person_id'
  /** column name */
  | 'referral_contact_person_id'
  /** column name */
  | 'referral_kind'
  /** column name */
  | 'referral_other_text'
  /** column name */
  | 'referral_source_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** select "patient_referral_aggregate_bool_exp_bool_and_arguments_columns" columns of table "patient_referral" */
export type Patient_Referral_Select_Column_Patient_Referral_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | 'is_active';

/** select "patient_referral_aggregate_bool_exp_bool_or_arguments_columns" columns of table "patient_referral" */
export type Patient_Referral_Select_Column_Patient_Referral_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | 'is_active';

/** input type for updating data in table "patient_referral" */
export type Patient_Referral_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_contact_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_kind?: InputMaybe<Scalars['String']['input']>;
  referral_other_text?: InputMaybe<Scalars['String']['input']>;
  referral_source_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Patient_Referral_Stddev_Fields = {
  __typename?: 'patient_referral_stddev_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  referral_contact_person_id?: Maybe<Scalars['Float']['output']>;
  referral_source_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "patient_referral" */
export type Patient_Referral_Stddev_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Patient_Referral_Stddev_Pop_Fields = {
  __typename?: 'patient_referral_stddev_pop_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  referral_contact_person_id?: Maybe<Scalars['Float']['output']>;
  referral_source_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "patient_referral" */
export type Patient_Referral_Stddev_Pop_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Patient_Referral_Stddev_Samp_Fields = {
  __typename?: 'patient_referral_stddev_samp_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  referral_contact_person_id?: Maybe<Scalars['Float']['output']>;
  referral_source_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "patient_referral" */
export type Patient_Referral_Stddev_Samp_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "patient_referral" */
export type Patient_Referral_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Patient_Referral_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Patient_Referral_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  patient_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_contact_person_id?: InputMaybe<Scalars['bigint']['input']>;
  referral_kind?: InputMaybe<Scalars['String']['input']>;
  referral_other_text?: InputMaybe<Scalars['String']['input']>;
  referral_source_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Patient_Referral_Sum_Fields = {
  __typename?: 'patient_referral_sum_fields';
  patient_person_id?: Maybe<Scalars['bigint']['output']>;
  referral_contact_person_id?: Maybe<Scalars['bigint']['output']>;
  referral_source_id?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "patient_referral" */
export type Patient_Referral_Sum_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** update columns of table "patient_referral" */
export type Patient_Referral_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'is_active'
  /** column name */
  | 'patient_person_id'
  /** column name */
  | 'referral_contact_person_id'
  /** column name */
  | 'referral_kind'
  /** column name */
  | 'referral_other_text'
  /** column name */
  | 'referral_source_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Patient_Referral_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Patient_Referral_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Patient_Referral_Set_Input>;
  /** filter the rows which have to be updated */
  where: Patient_Referral_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Patient_Referral_Var_Pop_Fields = {
  __typename?: 'patient_referral_var_pop_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  referral_contact_person_id?: Maybe<Scalars['Float']['output']>;
  referral_source_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "patient_referral" */
export type Patient_Referral_Var_Pop_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Patient_Referral_Var_Samp_Fields = {
  __typename?: 'patient_referral_var_samp_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  referral_contact_person_id?: Maybe<Scalars['Float']['output']>;
  referral_source_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "patient_referral" */
export type Patient_Referral_Var_Samp_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Patient_Referral_Variance_Fields = {
  __typename?: 'patient_referral_variance_fields';
  patient_person_id?: Maybe<Scalars['Float']['output']>;
  referral_contact_person_id?: Maybe<Scalars['Float']['output']>;
  referral_source_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "patient_referral" */
export type Patient_Referral_Variance_Order_By = {
  patient_person_id?: InputMaybe<Order_By>;
  referral_contact_person_id?: InputMaybe<Order_By>;
  referral_source_id?: InputMaybe<Order_By>;
};

/** select columns of table "patient" */
export type Patient_Select_Column =
  /** column name */
  | 'chart_no'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'family_doctor_name'
  /** column name */
  | 'family_doctor_phone'
  /** column name */
  | 'imaging_id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'person_id'
  /** column name */
  | 'status'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "patient" */
export type Patient_Set_Input = {
  chart_no?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  family_doctor_name?: InputMaybe<Scalars['String']['input']>;
  family_doctor_phone?: InputMaybe<Scalars['String']['input']>;
  imaging_id?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** columns and relationships of "patient_status_enum" */
export type Patient_Status_Enum = {
  __typename?: 'patient_status_enum';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "patient_status_enum" */
export type Patient_Status_Enum_Aggregate = {
  __typename?: 'patient_status_enum_aggregate';
  aggregate?: Maybe<Patient_Status_Enum_Aggregate_Fields>;
  nodes: Array<Patient_Status_Enum>;
};

/** aggregate fields of "patient_status_enum" */
export type Patient_Status_Enum_Aggregate_Fields = {
  __typename?: 'patient_status_enum_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Patient_Status_Enum_Max_Fields>;
  min?: Maybe<Patient_Status_Enum_Min_Fields>;
};


/** aggregate fields of "patient_status_enum" */
export type Patient_Status_Enum_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Patient_Status_Enum_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "patient_status_enum". All fields are combined with a logical 'AND'. */
export type Patient_Status_Enum_Bool_Exp = {
  _and?: InputMaybe<Array<Patient_Status_Enum_Bool_Exp>>;
  _not?: InputMaybe<Patient_Status_Enum_Bool_Exp>;
  _or?: InputMaybe<Array<Patient_Status_Enum_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "patient_status_enum" */
export type Patient_Status_Enum_Constraint =
  /** unique or primary key constraint on columns "value" */
  | 'patient_status_enum_pkey';

/** input type for inserting data into table "patient_status_enum" */
export type Patient_Status_Enum_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Patient_Status_Enum_Max_Fields = {
  __typename?: 'patient_status_enum_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Patient_Status_Enum_Min_Fields = {
  __typename?: 'patient_status_enum_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "patient_status_enum" */
export type Patient_Status_Enum_Mutation_Response = {
  __typename?: 'patient_status_enum_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Patient_Status_Enum>;
};

/** on_conflict condition type for table "patient_status_enum" */
export type Patient_Status_Enum_On_Conflict = {
  constraint: Patient_Status_Enum_Constraint;
  update_columns?: Array<Patient_Status_Enum_Update_Column>;
  where?: InputMaybe<Patient_Status_Enum_Bool_Exp>;
};

/** Ordering options when selecting data from "patient_status_enum". */
export type Patient_Status_Enum_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: patient_status_enum */
export type Patient_Status_Enum_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "patient_status_enum" */
export type Patient_Status_Enum_Select_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

/** input type for updating data in table "patient_status_enum" */
export type Patient_Status_Enum_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "patient_status_enum" */
export type Patient_Status_Enum_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Patient_Status_Enum_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Patient_Status_Enum_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "patient_status_enum" */
export type Patient_Status_Enum_Update_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

export type Patient_Status_Enum_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Patient_Status_Enum_Set_Input>;
  /** filter the rows which have to be updated */
  where: Patient_Status_Enum_Bool_Exp;
};

/** aggregate stddev on columns */
export type Patient_Stddev_Fields = {
  __typename?: 'patient_stddev_fields';
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Patient_Stddev_Pop_Fields = {
  __typename?: 'patient_stddev_pop_fields';
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Patient_Stddev_Samp_Fields = {
  __typename?: 'patient_stddev_samp_fields';
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "patient" */
export type Patient_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Patient_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Patient_Stream_Cursor_Value_Input = {
  chart_no?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  family_doctor_name?: InputMaybe<Scalars['String']['input']>;
  family_doctor_phone?: InputMaybe<Scalars['String']['input']>;
  imaging_id?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Patient_Sum_Fields = {
  __typename?: 'patient_sum_fields';
  person_id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "patient" */
export type Patient_Update_Column =
  /** column name */
  | 'chart_no'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'family_doctor_name'
  /** column name */
  | 'family_doctor_phone'
  /** column name */
  | 'imaging_id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'person_id'
  /** column name */
  | 'status'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Patient_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Patient_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Patient_Set_Input>;
  /** filter the rows which have to be updated */
  where: Patient_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Patient_Var_Pop_Fields = {
  __typename?: 'patient_var_pop_fields';
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Patient_Var_Samp_Fields = {
  __typename?: 'patient_var_samp_fields';
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Patient_Variance_Fields = {
  __typename?: 'patient_variance_fields';
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "person" */
export type Person = {
  __typename?: 'person';
  /** An object relationship */
  billing_address?: Maybe<Address>;
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  clinic_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  /** An array relationship */
  dependents: Array<Person>;
  /** An aggregate relationship */
  dependents_aggregate: Person_Aggregate;
  dob?: Maybe<Scalars['date']['output']>;
  first_name: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  household_head?: Maybe<Person>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  /** An array relationship */
  household_members: Array<Person>;
  /** An aggregate relationship */
  household_members_aggregate: Person_Aggregate;
  household_relationship?: Maybe<Scalars['String']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  last_name: Scalars['String']['output'];
  /** An object relationship */
  mailing_address?: Maybe<Address>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  patient?: Maybe<Patient>;
  /** An array relationship */
  person_contact_point: Array<Person_Contact_Point>;
  /** An aggregate relationship */
  person_contact_point_aggregate: Person_Contact_Point_Aggregate;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  responsible_party?: Maybe<Person>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "person" */
export type PersonDependentsArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


/** columns and relationships of "person" */
export type PersonDependents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


/** columns and relationships of "person" */
export type PersonHousehold_MembersArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


/** columns and relationships of "person" */
export type PersonHousehold_Members_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


/** columns and relationships of "person" */
export type PersonPerson_Contact_PointArgs = {
  distinct_on?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Contact_Point_Order_By>>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};


/** columns and relationships of "person" */
export type PersonPerson_Contact_Point_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Contact_Point_Order_By>>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};

/** aggregated selection of "person" */
export type Person_Aggregate = {
  __typename?: 'person_aggregate';
  aggregate?: Maybe<Person_Aggregate_Fields>;
  nodes: Array<Person>;
};

export type Person_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Person_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Person_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Person_Aggregate_Bool_Exp_Count>;
};

export type Person_Aggregate_Bool_Exp_Bool_And = {
  arguments: Person_Select_Column_Person_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Person_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Person_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Person_Select_Column_Person_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Person_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Person_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Person_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Person_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "person" */
export type Person_Aggregate_Fields = {
  __typename?: 'person_aggregate_fields';
  avg?: Maybe<Person_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Person_Max_Fields>;
  min?: Maybe<Person_Min_Fields>;
  stddev?: Maybe<Person_Stddev_Fields>;
  stddev_pop?: Maybe<Person_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Person_Stddev_Samp_Fields>;
  sum?: Maybe<Person_Sum_Fields>;
  var_pop?: Maybe<Person_Var_Pop_Fields>;
  var_samp?: Maybe<Person_Var_Samp_Fields>;
  variance?: Maybe<Person_Variance_Fields>;
};


/** aggregate fields of "person" */
export type Person_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Person_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "person" */
export type Person_Aggregate_Order_By = {
  avg?: InputMaybe<Person_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Person_Max_Order_By>;
  min?: InputMaybe<Person_Min_Order_By>;
  stddev?: InputMaybe<Person_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Person_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Person_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Person_Sum_Order_By>;
  var_pop?: InputMaybe<Person_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Person_Var_Samp_Order_By>;
  variance?: InputMaybe<Person_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "person" */
export type Person_Arr_Rel_Insert_Input = {
  data: Array<Person_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Person_On_Conflict>;
};

/** aggregate avg on columns */
export type Person_Avg_Fields = {
  __typename?: 'person_avg_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "person" */
export type Person_Avg_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "person". All fields are combined with a logical 'AND'. */
export type Person_Bool_Exp = {
  _and?: InputMaybe<Array<Person_Bool_Exp>>;
  _not?: InputMaybe<Person_Bool_Exp>;
  _or?: InputMaybe<Array<Person_Bool_Exp>>;
  billing_address?: InputMaybe<Address_Bool_Exp>;
  billing_address_id?: InputMaybe<Bigint_Comparison_Exp>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  dependents?: InputMaybe<Person_Bool_Exp>;
  dependents_aggregate?: InputMaybe<Person_Aggregate_Bool_Exp>;
  dob?: InputMaybe<Date_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  gender?: InputMaybe<String_Comparison_Exp>;
  household_head?: InputMaybe<Person_Bool_Exp>;
  household_head_id?: InputMaybe<Bigint_Comparison_Exp>;
  household_members?: InputMaybe<Person_Bool_Exp>;
  household_members_aggregate?: InputMaybe<Person_Aggregate_Bool_Exp>;
  household_relationship?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  mailing_address?: InputMaybe<Address_Bool_Exp>;
  mailing_address_id?: InputMaybe<Bigint_Comparison_Exp>;
  middle_name?: InputMaybe<String_Comparison_Exp>;
  patient?: InputMaybe<Patient_Bool_Exp>;
  person_contact_point?: InputMaybe<Person_Contact_Point_Bool_Exp>;
  person_contact_point_aggregate?: InputMaybe<Person_Contact_Point_Aggregate_Bool_Exp>;
  preferred_language?: InputMaybe<String_Comparison_Exp>;
  preferred_name?: InputMaybe<String_Comparison_Exp>;
  responsible_party?: InputMaybe<Person_Bool_Exp>;
  responsible_party_id?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "person" */
export type Person_Constraint =
  /** unique or primary key constraint on columns "id" */
  | 'person_pkey';

/** columns and relationships of "person_contact_point" */
export type Person_Contact_Point = {
  __typename?: 'person_contact_point';
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  is_primary: Scalars['Boolean']['output'];
  kind: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  /** An object relationship */
  person: Person;
  person_id: Scalars['bigint']['output'];
  phone_e164?: Maybe<Scalars['String']['output']>;
  phone_last10?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
  value: Scalars['citext']['output'];
  value_norm?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "person_contact_point" */
export type Person_Contact_Point_Aggregate = {
  __typename?: 'person_contact_point_aggregate';
  aggregate?: Maybe<Person_Contact_Point_Aggregate_Fields>;
  nodes: Array<Person_Contact_Point>;
};

export type Person_Contact_Point_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Person_Contact_Point_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Person_Contact_Point_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Person_Contact_Point_Aggregate_Bool_Exp_Count>;
};

export type Person_Contact_Point_Aggregate_Bool_Exp_Bool_And = {
  arguments: Person_Contact_Point_Select_Column_Person_Contact_Point_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Person_Contact_Point_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Person_Contact_Point_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Person_Contact_Point_Select_Column_Person_Contact_Point_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Person_Contact_Point_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Person_Contact_Point_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Person_Contact_Point_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "person_contact_point" */
export type Person_Contact_Point_Aggregate_Fields = {
  __typename?: 'person_contact_point_aggregate_fields';
  avg?: Maybe<Person_Contact_Point_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Person_Contact_Point_Max_Fields>;
  min?: Maybe<Person_Contact_Point_Min_Fields>;
  stddev?: Maybe<Person_Contact_Point_Stddev_Fields>;
  stddev_pop?: Maybe<Person_Contact_Point_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Person_Contact_Point_Stddev_Samp_Fields>;
  sum?: Maybe<Person_Contact_Point_Sum_Fields>;
  var_pop?: Maybe<Person_Contact_Point_Var_Pop_Fields>;
  var_samp?: Maybe<Person_Contact_Point_Var_Samp_Fields>;
  variance?: Maybe<Person_Contact_Point_Variance_Fields>;
};


/** aggregate fields of "person_contact_point" */
export type Person_Contact_Point_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "person_contact_point" */
export type Person_Contact_Point_Aggregate_Order_By = {
  avg?: InputMaybe<Person_Contact_Point_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Person_Contact_Point_Max_Order_By>;
  min?: InputMaybe<Person_Contact_Point_Min_Order_By>;
  stddev?: InputMaybe<Person_Contact_Point_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Person_Contact_Point_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Person_Contact_Point_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Person_Contact_Point_Sum_Order_By>;
  var_pop?: InputMaybe<Person_Contact_Point_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Person_Contact_Point_Var_Samp_Order_By>;
  variance?: InputMaybe<Person_Contact_Point_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "person_contact_point" */
export type Person_Contact_Point_Arr_Rel_Insert_Input = {
  data: Array<Person_Contact_Point_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Person_Contact_Point_On_Conflict>;
};

/** aggregate avg on columns */
export type Person_Contact_Point_Avg_Fields = {
  __typename?: 'person_contact_point_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "person_contact_point" */
export type Person_Contact_Point_Avg_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "person_contact_point". All fields are combined with a logical 'AND'. */
export type Person_Contact_Point_Bool_Exp = {
  _and?: InputMaybe<Array<Person_Contact_Point_Bool_Exp>>;
  _not?: InputMaybe<Person_Contact_Point_Bool_Exp>;
  _or?: InputMaybe<Array<Person_Contact_Point_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_primary?: InputMaybe<Boolean_Comparison_Exp>;
  kind?: InputMaybe<String_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  person?: InputMaybe<Person_Bool_Exp>;
  person_id?: InputMaybe<Bigint_Comparison_Exp>;
  phone_e164?: InputMaybe<String_Comparison_Exp>;
  phone_last10?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  value?: InputMaybe<Citext_Comparison_Exp>;
  value_norm?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "person_contact_point" */
export type Person_Contact_Point_Constraint =
  /** unique or primary key constraint on columns "kind", "person_id" */
  | 'idx_person_contact_point_primary_unique'
  /** unique or primary key constraint on columns "id" */
  | 'person_contact_point_pkey';

/** input type for incrementing numeric columns in table "person_contact_point" */
export type Person_Contact_Point_Inc_Input = {
  id?: InputMaybe<Scalars['bigint']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "person_contact_point" */
export type Person_Contact_Point_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_primary?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  person?: InputMaybe<Person_Obj_Rel_Insert_Input>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  phone_e164?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  value?: InputMaybe<Scalars['citext']['input']>;
  value_norm?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Person_Contact_Point_Max_Fields = {
  __typename?: 'person_contact_point_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  kind?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  phone_e164?: Maybe<Scalars['String']['output']>;
  phone_last10?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  value?: Maybe<Scalars['citext']['output']>;
  value_norm?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "person_contact_point" */
export type Person_Contact_Point_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kind?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
  phone_e164?: InputMaybe<Order_By>;
  phone_last10?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
  value_norm?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Person_Contact_Point_Min_Fields = {
  __typename?: 'person_contact_point_min_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  kind?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  phone_e164?: Maybe<Scalars['String']['output']>;
  phone_last10?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
  value?: Maybe<Scalars['citext']['output']>;
  value_norm?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "person_contact_point" */
export type Person_Contact_Point_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  kind?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
  phone_e164?: InputMaybe<Order_By>;
  phone_last10?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
  value_norm?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "person_contact_point" */
export type Person_Contact_Point_Mutation_Response = {
  __typename?: 'person_contact_point_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Person_Contact_Point>;
};

/** on_conflict condition type for table "person_contact_point" */
export type Person_Contact_Point_On_Conflict = {
  constraint: Person_Contact_Point_Constraint;
  update_columns?: Array<Person_Contact_Point_Update_Column>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};

/** Ordering options when selecting data from "person_contact_point". */
export type Person_Contact_Point_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_primary?: InputMaybe<Order_By>;
  kind?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  person?: InputMaybe<Person_Order_By>;
  person_id?: InputMaybe<Order_By>;
  phone_e164?: InputMaybe<Order_By>;
  phone_last10?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
  value_norm?: InputMaybe<Order_By>;
};

/** primary key columns input for table: person_contact_point */
export type Person_Contact_Point_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "person_contact_point" */
export type Person_Contact_Point_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_primary'
  /** column name */
  | 'kind'
  /** column name */
  | 'label'
  /** column name */
  | 'person_id'
  /** column name */
  | 'phone_e164'
  /** column name */
  | 'phone_last10'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'value'
  /** column name */
  | 'value_norm';

/** select "person_contact_point_aggregate_bool_exp_bool_and_arguments_columns" columns of table "person_contact_point" */
export type Person_Contact_Point_Select_Column_Person_Contact_Point_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_primary';

/** select "person_contact_point_aggregate_bool_exp_bool_or_arguments_columns" columns of table "person_contact_point" */
export type Person_Contact_Point_Select_Column_Person_Contact_Point_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_primary';

/** input type for updating data in table "person_contact_point" */
export type Person_Contact_Point_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_primary?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  phone_e164?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  value?: InputMaybe<Scalars['citext']['input']>;
  value_norm?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Person_Contact_Point_Stddev_Fields = {
  __typename?: 'person_contact_point_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "person_contact_point" */
export type Person_Contact_Point_Stddev_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Person_Contact_Point_Stddev_Pop_Fields = {
  __typename?: 'person_contact_point_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "person_contact_point" */
export type Person_Contact_Point_Stddev_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Person_Contact_Point_Stddev_Samp_Fields = {
  __typename?: 'person_contact_point_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "person_contact_point" */
export type Person_Contact_Point_Stddev_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "person_contact_point" */
export type Person_Contact_Point_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Person_Contact_Point_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Person_Contact_Point_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  is_primary?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  phone_e164?: InputMaybe<Scalars['String']['input']>;
  phone_last10?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
  value?: InputMaybe<Scalars['citext']['input']>;
  value_norm?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Person_Contact_Point_Sum_Fields = {
  __typename?: 'person_contact_point_sum_fields';
  id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "person_contact_point" */
export type Person_Contact_Point_Sum_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** update columns of table "person_contact_point" */
export type Person_Contact_Point_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'is_primary'
  /** column name */
  | 'kind'
  /** column name */
  | 'label'
  /** column name */
  | 'person_id'
  /** column name */
  | 'phone_e164'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by'
  /** column name */
  | 'value'
  /** column name */
  | 'value_norm';

export type Person_Contact_Point_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Person_Contact_Point_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Person_Contact_Point_Set_Input>;
  /** filter the rows which have to be updated */
  where: Person_Contact_Point_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Person_Contact_Point_Var_Pop_Fields = {
  __typename?: 'person_contact_point_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "person_contact_point" */
export type Person_Contact_Point_Var_Pop_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Person_Contact_Point_Var_Samp_Fields = {
  __typename?: 'person_contact_point_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "person_contact_point" */
export type Person_Contact_Point_Var_Samp_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Person_Contact_Point_Variance_Fields = {
  __typename?: 'person_contact_point_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "person_contact_point" */
export type Person_Contact_Point_Variance_Order_By = {
  id?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
};

/** input type for incrementing numeric columns in table "person" */
export type Person_Inc_Input = {
  billing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  mailing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  responsible_party_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "person" */
export type Person_Insert_Input = {
  billing_address?: InputMaybe<Address_Obj_Rel_Insert_Input>;
  billing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  dependents?: InputMaybe<Person_Arr_Rel_Insert_Input>;
  dob?: InputMaybe<Scalars['date']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  household_head?: InputMaybe<Person_Obj_Rel_Insert_Input>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  household_members?: InputMaybe<Person_Arr_Rel_Insert_Input>;
  household_relationship?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  mailing_address?: InputMaybe<Address_Obj_Rel_Insert_Input>;
  mailing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  patient?: InputMaybe<Patient_Obj_Rel_Insert_Input>;
  person_contact_point?: InputMaybe<Person_Contact_Point_Arr_Rel_Insert_Input>;
  preferred_language?: InputMaybe<Scalars['String']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party?: InputMaybe<Person_Obj_Rel_Insert_Input>;
  responsible_party_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Person_Max_Fields = {
  __typename?: 'person_max_fields';
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "person" */
export type Person_Max_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  household_relationship?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  preferred_language?: InputMaybe<Order_By>;
  preferred_name?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Person_Min_Fields = {
  __typename?: 'person_min_fields';
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "person" */
export type Person_Min_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  household_relationship?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  preferred_language?: InputMaybe<Order_By>;
  preferred_name?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "person" */
export type Person_Mutation_Response = {
  __typename?: 'person_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Person>;
};

/** input type for inserting object relation for remote table "person" */
export type Person_Obj_Rel_Insert_Input = {
  data: Person_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Person_On_Conflict>;
};

/** on_conflict condition type for table "person" */
export type Person_On_Conflict = {
  constraint: Person_Constraint;
  update_columns?: Array<Person_Update_Column>;
  where?: InputMaybe<Person_Bool_Exp>;
};

/** Ordering options when selecting data from "person". */
export type Person_Order_By = {
  billing_address?: InputMaybe<Address_Order_By>;
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  dependents_aggregate?: InputMaybe<Person_Aggregate_Order_By>;
  dob?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  household_head?: InputMaybe<Person_Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  household_members_aggregate?: InputMaybe<Person_Aggregate_Order_By>;
  household_relationship?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  mailing_address?: InputMaybe<Address_Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  patient?: InputMaybe<Patient_Order_By>;
  person_contact_point_aggregate?: InputMaybe<Person_Contact_Point_Aggregate_Order_By>;
  preferred_language?: InputMaybe<Order_By>;
  preferred_name?: InputMaybe<Order_By>;
  responsible_party?: InputMaybe<Person_Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: person */
export type Person_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "person" */
export type Person_Select_Column =
  /** column name */
  | 'billing_address_id'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'dob'
  /** column name */
  | 'first_name'
  /** column name */
  | 'gender'
  /** column name */
  | 'household_head_id'
  /** column name */
  | 'household_relationship'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'last_name'
  /** column name */
  | 'mailing_address_id'
  /** column name */
  | 'middle_name'
  /** column name */
  | 'preferred_language'
  /** column name */
  | 'preferred_name'
  /** column name */
  | 'responsible_party_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** select "person_aggregate_bool_exp_bool_and_arguments_columns" columns of table "person" */
export type Person_Select_Column_Person_Aggregate_Bool_Exp_Bool_And_Arguments_Columns =
  /** column name */
  | 'is_active';

/** select "person_aggregate_bool_exp_bool_or_arguments_columns" columns of table "person" */
export type Person_Select_Column_Person_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns =
  /** column name */
  | 'is_active';

/** input type for updating data in table "person" */
export type Person_Set_Input = {
  billing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  dob?: InputMaybe<Scalars['date']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  household_relationship?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  mailing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  preferred_language?: InputMaybe<Scalars['String']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Person_Stddev_Fields = {
  __typename?: 'person_stddev_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "person" */
export type Person_Stddev_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Person_Stddev_Pop_Fields = {
  __typename?: 'person_stddev_pop_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "person" */
export type Person_Stddev_Pop_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Person_Stddev_Samp_Fields = {
  __typename?: 'person_stddev_samp_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "person" */
export type Person_Stddev_Samp_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "person" */
export type Person_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Person_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Person_Stream_Cursor_Value_Input = {
  billing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  dob?: InputMaybe<Scalars['date']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  household_relationship?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  mailing_address_id?: InputMaybe<Scalars['bigint']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  preferred_language?: InputMaybe<Scalars['String']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_id?: InputMaybe<Scalars['bigint']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Person_Sum_Fields = {
  __typename?: 'person_sum_fields';
  billing_address_id?: Maybe<Scalars['bigint']['output']>;
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  mailing_address_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "person" */
export type Person_Sum_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** update columns of table "person" */
export type Person_Update_Column =
  /** column name */
  | 'billing_address_id'
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'dob'
  /** column name */
  | 'first_name'
  /** column name */
  | 'gender'
  /** column name */
  | 'household_head_id'
  /** column name */
  | 'household_relationship'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'last_name'
  /** column name */
  | 'mailing_address_id'
  /** column name */
  | 'middle_name'
  /** column name */
  | 'preferred_language'
  /** column name */
  | 'preferred_name'
  /** column name */
  | 'responsible_party_id'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Person_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Person_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Person_Set_Input>;
  /** filter the rows which have to be updated */
  where: Person_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Person_Var_Pop_Fields = {
  __typename?: 'person_var_pop_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "person" */
export type Person_Var_Pop_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Person_Var_Samp_Fields = {
  __typename?: 'person_var_samp_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "person" */
export type Person_Var_Samp_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Person_Variance_Fields = {
  __typename?: 'person_variance_fields';
  billing_address_id?: Maybe<Scalars['Float']['output']>;
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  mailing_address_id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "person" */
export type Person_Variance_Order_By = {
  billing_address_id?: InputMaybe<Order_By>;
  clinic_id?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mailing_address_id?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
};

/** columns and relationships of "person_with_responsible_party_v" */
export type Person_With_Responsible_Party_V = {
  __typename?: 'person_with_responsible_party_v';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_first_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_last_name?: Maybe<Scalars['String']['output']>;
  responsible_party_preferred_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "person_with_responsible_party_v" */
export type Person_With_Responsible_Party_V_Aggregate = {
  __typename?: 'person_with_responsible_party_v_aggregate';
  aggregate?: Maybe<Person_With_Responsible_Party_V_Aggregate_Fields>;
  nodes: Array<Person_With_Responsible_Party_V>;
};

/** aggregate fields of "person_with_responsible_party_v" */
export type Person_With_Responsible_Party_V_Aggregate_Fields = {
  __typename?: 'person_with_responsible_party_v_aggregate_fields';
  avg?: Maybe<Person_With_Responsible_Party_V_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Person_With_Responsible_Party_V_Max_Fields>;
  min?: Maybe<Person_With_Responsible_Party_V_Min_Fields>;
  stddev?: Maybe<Person_With_Responsible_Party_V_Stddev_Fields>;
  stddev_pop?: Maybe<Person_With_Responsible_Party_V_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Person_With_Responsible_Party_V_Stddev_Samp_Fields>;
  sum?: Maybe<Person_With_Responsible_Party_V_Sum_Fields>;
  var_pop?: Maybe<Person_With_Responsible_Party_V_Var_Pop_Fields>;
  var_samp?: Maybe<Person_With_Responsible_Party_V_Var_Samp_Fields>;
  variance?: Maybe<Person_With_Responsible_Party_V_Variance_Fields>;
};


/** aggregate fields of "person_with_responsible_party_v" */
export type Person_With_Responsible_Party_V_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Person_With_Responsible_Party_V_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Person_With_Responsible_Party_V_Avg_Fields = {
  __typename?: 'person_with_responsible_party_v_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "person_with_responsible_party_v". All fields are combined with a logical 'AND'. */
export type Person_With_Responsible_Party_V_Bool_Exp = {
  _and?: InputMaybe<Array<Person_With_Responsible_Party_V_Bool_Exp>>;
  _not?: InputMaybe<Person_With_Responsible_Party_V_Bool_Exp>;
  _or?: InputMaybe<Array<Person_With_Responsible_Party_V_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  dob?: InputMaybe<Date_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  gender?: InputMaybe<String_Comparison_Exp>;
  household_relationship?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  preferred_language?: InputMaybe<String_Comparison_Exp>;
  preferred_name?: InputMaybe<String_Comparison_Exp>;
  responsible_party_first_name?: InputMaybe<String_Comparison_Exp>;
  responsible_party_id?: InputMaybe<Bigint_Comparison_Exp>;
  responsible_party_last_name?: InputMaybe<String_Comparison_Exp>;
  responsible_party_preferred_name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type Person_With_Responsible_Party_V_Max_Fields = {
  __typename?: 'person_with_responsible_party_v_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_first_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_last_name?: Maybe<Scalars['String']['output']>;
  responsible_party_preferred_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Person_With_Responsible_Party_V_Min_Fields = {
  __typename?: 'person_with_responsible_party_v_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  dob?: Maybe<Scalars['date']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  household_relationship?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  preferred_language?: Maybe<Scalars['String']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  responsible_party_first_name?: Maybe<Scalars['String']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_last_name?: Maybe<Scalars['String']['output']>;
  responsible_party_preferred_name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** Ordering options when selecting data from "person_with_responsible_party_v". */
export type Person_With_Responsible_Party_V_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  dob?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  gender?: InputMaybe<Order_By>;
  household_relationship?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  preferred_language?: InputMaybe<Order_By>;
  preferred_name?: InputMaybe<Order_By>;
  responsible_party_first_name?: InputMaybe<Order_By>;
  responsible_party_id?: InputMaybe<Order_By>;
  responsible_party_last_name?: InputMaybe<Order_By>;
  responsible_party_preferred_name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** select columns of table "person_with_responsible_party_v" */
export type Person_With_Responsible_Party_V_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'dob'
  /** column name */
  | 'first_name'
  /** column name */
  | 'gender'
  /** column name */
  | 'household_relationship'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'last_name'
  /** column name */
  | 'preferred_language'
  /** column name */
  | 'preferred_name'
  /** column name */
  | 'responsible_party_first_name'
  /** column name */
  | 'responsible_party_id'
  /** column name */
  | 'responsible_party_last_name'
  /** column name */
  | 'responsible_party_preferred_name'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** aggregate stddev on columns */
export type Person_With_Responsible_Party_V_Stddev_Fields = {
  __typename?: 'person_with_responsible_party_v_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Person_With_Responsible_Party_V_Stddev_Pop_Fields = {
  __typename?: 'person_with_responsible_party_v_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Person_With_Responsible_Party_V_Stddev_Samp_Fields = {
  __typename?: 'person_with_responsible_party_v_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "person_with_responsible_party_v" */
export type Person_With_Responsible_Party_V_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Person_With_Responsible_Party_V_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Person_With_Responsible_Party_V_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  dob?: InputMaybe<Scalars['date']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  household_relationship?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  preferred_language?: InputMaybe<Scalars['String']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_first_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_id?: InputMaybe<Scalars['bigint']['input']>;
  responsible_party_last_name?: InputMaybe<Scalars['String']['input']>;
  responsible_party_preferred_name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Person_With_Responsible_Party_V_Sum_Fields = {
  __typename?: 'person_with_responsible_party_v_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  responsible_party_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Person_With_Responsible_Party_V_Var_Pop_Fields = {
  __typename?: 'person_with_responsible_party_v_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Person_With_Responsible_Party_V_Var_Samp_Fields = {
  __typename?: 'person_with_responsible_party_v_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Person_With_Responsible_Party_V_Variance_Fields = {
  __typename?: 'person_with_responsible_party_v_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  responsible_party_id?: Maybe<Scalars['Float']['output']>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "address" */
  address: Array<Address>;
  /** fetch aggregated fields from the table: "address" */
  address_aggregate: Address_Aggregate;
  /** fetch data from the table: "address" using primary key columns */
  address_by_pk?: Maybe<Address>;
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
  /** fetch data from the table: "audit.event" */
  audit_event: Array<Audit_Event>;
  /** fetch aggregated fields from the table: "audit.event" */
  audit_event_aggregate: Audit_Event_Aggregate;
  /** fetch data from the table: "audit.event" using primary key columns */
  audit_event_by_pk?: Maybe<Audit_Event>;
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
  /** fetch data from the table: "family_group_v" */
  family_group_v: Array<Family_Group_V>;
  /** fetch aggregated fields from the table: "family_group_v" */
  family_group_v_aggregate: Family_Group_V_Aggregate;
  /** fetch data from the table: "family_members_v" */
  family_members_v: Array<Family_Members_V>;
  /** fetch aggregated fields from the table: "family_members_v" */
  family_members_v_aggregate: Family_Members_V_Aggregate;
  /** execute function "fn_search_household_heads" which returns "search_household_heads_result" */
  fn_search_household_heads: Array<Search_Household_Heads_Result>;
  /** execute function "fn_search_household_heads" and query aggregates on result of table type "search_household_heads_result" */
  fn_search_household_heads_aggregate: Search_Household_Heads_Result_Aggregate;
  /** fetch data from the table: "gender_enum" */
  gender_enum: Array<Gender_Enum>;
  /** fetch aggregated fields from the table: "gender_enum" */
  gender_enum_aggregate: Gender_Enum_Aggregate;
  /** fetch data from the table: "gender_enum" using primary key columns */
  gender_enum_by_pk?: Maybe<Gender_Enum>;
  /** fetch data from the table: "insurance_subscriber" */
  insurance_subscriber: Array<Insurance_Subscriber>;
  /** fetch aggregated fields from the table: "insurance_subscriber" */
  insurance_subscriber_aggregate: Insurance_Subscriber_Aggregate;
  /** fetch data from the table: "insurance_subscriber" using primary key columns */
  insurance_subscriber_by_pk?: Maybe<Insurance_Subscriber>;
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
  /** fetch data from the table: "patient" */
  patient: Array<Patient>;
  /** fetch aggregated fields from the table: "patient" */
  patient_aggregate: Patient_Aggregate;
  /** fetch data from the table: "patient" using primary key columns */
  patient_by_pk?: Maybe<Patient>;
  /** fetch data from the table: "patient_field_config" */
  patient_field_config: Array<Patient_Field_Config>;
  /** fetch aggregated fields from the table: "patient_field_config" */
  patient_field_config_aggregate: Patient_Field_Config_Aggregate;
  /** fetch data from the table: "patient_field_config" using primary key columns */
  patient_field_config_by_pk?: Maybe<Patient_Field_Config>;
  /** fetch data from the table: "patient_financial" */
  patient_financial: Array<Patient_Financial>;
  /** fetch aggregated fields from the table: "patient_financial" */
  patient_financial_aggregate: Patient_Financial_Aggregate;
  /** fetch data from the table: "patient_financial" using primary key columns */
  patient_financial_by_pk?: Maybe<Patient_Financial>;
  /** fetch data from the table: "patient_profile_v" */
  patient_profile_v: Array<Patient_Profile_V>;
  /** fetch aggregated fields from the table: "patient_profile_v" */
  patient_profile_v_aggregate: Patient_Profile_V_Aggregate;
  /** An array relationship */
  patient_referral: Array<Patient_Referral>;
  /** An aggregate relationship */
  patient_referral_aggregate: Patient_Referral_Aggregate;
  /** fetch data from the table: "patient_referral" using primary key columns */
  patient_referral_by_pk?: Maybe<Patient_Referral>;
  /** fetch data from the table: "patient_status_enum" */
  patient_status_enum: Array<Patient_Status_Enum>;
  /** fetch aggregated fields from the table: "patient_status_enum" */
  patient_status_enum_aggregate: Patient_Status_Enum_Aggregate;
  /** fetch data from the table: "patient_status_enum" using primary key columns */
  patient_status_enum_by_pk?: Maybe<Patient_Status_Enum>;
  /** fetch data from the table: "person" */
  person: Array<Person>;
  /** fetch aggregated fields from the table: "person" */
  person_aggregate: Person_Aggregate;
  /** fetch data from the table: "person" using primary key columns */
  person_by_pk?: Maybe<Person>;
  /** An array relationship */
  person_contact_point: Array<Person_Contact_Point>;
  /** An aggregate relationship */
  person_contact_point_aggregate: Person_Contact_Point_Aggregate;
  /** fetch data from the table: "person_contact_point" using primary key columns */
  person_contact_point_by_pk?: Maybe<Person_Contact_Point>;
  /** fetch data from the table: "person_with_responsible_party_v" */
  person_with_responsible_party_v: Array<Person_With_Responsible_Party_V>;
  /** fetch aggregated fields from the table: "person_with_responsible_party_v" */
  person_with_responsible_party_v_aggregate: Person_With_Responsible_Party_V_Aggregate;
  /** fetch data from the table: "referral_kind_enum" */
  referral_kind_enum: Array<Referral_Kind_Enum>;
  /** fetch aggregated fields from the table: "referral_kind_enum" */
  referral_kind_enum_aggregate: Referral_Kind_Enum_Aggregate;
  /** fetch data from the table: "referral_kind_enum" using primary key columns */
  referral_kind_enum_by_pk?: Maybe<Referral_Kind_Enum>;
  /** fetch data from the table: "referral_source" */
  referral_source: Array<Referral_Source>;
  /** fetch aggregated fields from the table: "referral_source" */
  referral_source_aggregate: Referral_Source_Aggregate;
  /** fetch data from the table: "referral_source" using primary key columns */
  referral_source_by_pk?: Maybe<Referral_Source>;
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
  /** fetch data from the table: "search_household_heads_result" */
  search_household_heads_result: Array<Search_Household_Heads_Result>;
  /** fetch aggregated fields from the table: "search_household_heads_result" */
  search_household_heads_result_aggregate: Search_Household_Heads_Result_Aggregate;
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


export type Query_RootAddressArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};


export type Query_RootAddress_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};


export type Query_RootAddress_By_PkArgs = {
  id: Scalars['bigint']['input'];
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


export type Query_RootAudit_EventArgs = {
  distinct_on?: InputMaybe<Array<Audit_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Event_Order_By>>;
  where?: InputMaybe<Audit_Event_Bool_Exp>;
};


export type Query_RootAudit_Event_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Audit_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Event_Order_By>>;
  where?: InputMaybe<Audit_Event_Bool_Exp>;
};


export type Query_RootAudit_Event_By_PkArgs = {
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
  value: Scalars['String']['input'];
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


export type Query_RootFamily_Group_VArgs = {
  distinct_on?: InputMaybe<Array<Family_Group_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Group_V_Order_By>>;
  where?: InputMaybe<Family_Group_V_Bool_Exp>;
};


export type Query_RootFamily_Group_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Family_Group_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Group_V_Order_By>>;
  where?: InputMaybe<Family_Group_V_Bool_Exp>;
};


export type Query_RootFamily_Members_VArgs = {
  distinct_on?: InputMaybe<Array<Family_Members_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Members_V_Order_By>>;
  where?: InputMaybe<Family_Members_V_Bool_Exp>;
};


export type Query_RootFamily_Members_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Family_Members_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Members_V_Order_By>>;
  where?: InputMaybe<Family_Members_V_Bool_Exp>;
};


export type Query_RootFn_Search_Household_HeadsArgs = {
  args: Fn_Search_Household_Heads_Args;
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
};


export type Query_RootFn_Search_Household_Heads_AggregateArgs = {
  args: Fn_Search_Household_Heads_Args;
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
};


export type Query_RootGender_EnumArgs = {
  distinct_on?: InputMaybe<Array<Gender_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Gender_Enum_Order_By>>;
  where?: InputMaybe<Gender_Enum_Bool_Exp>;
};


export type Query_RootGender_Enum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Gender_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Gender_Enum_Order_By>>;
  where?: InputMaybe<Gender_Enum_Bool_Exp>;
};


export type Query_RootGender_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootInsurance_SubscriberArgs = {
  distinct_on?: InputMaybe<Array<Insurance_Subscriber_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Insurance_Subscriber_Order_By>>;
  where?: InputMaybe<Insurance_Subscriber_Bool_Exp>;
};


export type Query_RootInsurance_Subscriber_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Insurance_Subscriber_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Insurance_Subscriber_Order_By>>;
  where?: InputMaybe<Insurance_Subscriber_Bool_Exp>;
};


export type Query_RootInsurance_Subscriber_By_PkArgs = {
  id: Scalars['bigint']['input'];
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


export type Query_RootPatientArgs = {
  distinct_on?: InputMaybe<Array<Patient_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Order_By>>;
  where?: InputMaybe<Patient_Bool_Exp>;
};


export type Query_RootPatient_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Order_By>>;
  where?: InputMaybe<Patient_Bool_Exp>;
};


export type Query_RootPatient_By_PkArgs = {
  person_id: Scalars['bigint']['input'];
};


export type Query_RootPatient_Field_ConfigArgs = {
  distinct_on?: InputMaybe<Array<Patient_Field_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Field_Config_Order_By>>;
  where?: InputMaybe<Patient_Field_Config_Bool_Exp>;
};


export type Query_RootPatient_Field_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Field_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Field_Config_Order_By>>;
  where?: InputMaybe<Patient_Field_Config_Bool_Exp>;
};


export type Query_RootPatient_Field_Config_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootPatient_FinancialArgs = {
  distinct_on?: InputMaybe<Array<Patient_Financial_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Financial_Order_By>>;
  where?: InputMaybe<Patient_Financial_Bool_Exp>;
};


export type Query_RootPatient_Financial_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Financial_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Financial_Order_By>>;
  where?: InputMaybe<Patient_Financial_Bool_Exp>;
};


export type Query_RootPatient_Financial_By_PkArgs = {
  patient_person_id: Scalars['bigint']['input'];
};


export type Query_RootPatient_Profile_VArgs = {
  distinct_on?: InputMaybe<Array<Patient_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Profile_V_Order_By>>;
  where?: InputMaybe<Patient_Profile_V_Bool_Exp>;
};


export type Query_RootPatient_Profile_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Profile_V_Order_By>>;
  where?: InputMaybe<Patient_Profile_V_Bool_Exp>;
};


export type Query_RootPatient_ReferralArgs = {
  distinct_on?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Referral_Order_By>>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};


export type Query_RootPatient_Referral_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Referral_Order_By>>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};


export type Query_RootPatient_Referral_By_PkArgs = {
  patient_person_id: Scalars['bigint']['input'];
};


export type Query_RootPatient_Status_EnumArgs = {
  distinct_on?: InputMaybe<Array<Patient_Status_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Status_Enum_Order_By>>;
  where?: InputMaybe<Patient_Status_Enum_Bool_Exp>;
};


export type Query_RootPatient_Status_Enum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Status_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Status_Enum_Order_By>>;
  where?: InputMaybe<Patient_Status_Enum_Bool_Exp>;
};


export type Query_RootPatient_Status_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootPersonArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


export type Query_RootPerson_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


export type Query_RootPerson_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootPerson_Contact_PointArgs = {
  distinct_on?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Contact_Point_Order_By>>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};


export type Query_RootPerson_Contact_Point_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Contact_Point_Order_By>>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};


export type Query_RootPerson_Contact_Point_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Query_RootPerson_With_Responsible_Party_VArgs = {
  distinct_on?: InputMaybe<Array<Person_With_Responsible_Party_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_With_Responsible_Party_V_Order_By>>;
  where?: InputMaybe<Person_With_Responsible_Party_V_Bool_Exp>;
};


export type Query_RootPerson_With_Responsible_Party_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_With_Responsible_Party_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_With_Responsible_Party_V_Order_By>>;
  where?: InputMaybe<Person_With_Responsible_Party_V_Bool_Exp>;
};


export type Query_RootReferral_Kind_EnumArgs = {
  distinct_on?: InputMaybe<Array<Referral_Kind_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Kind_Enum_Order_By>>;
  where?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
};


export type Query_RootReferral_Kind_Enum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Referral_Kind_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Kind_Enum_Order_By>>;
  where?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
};


export type Query_RootReferral_Kind_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Query_RootReferral_SourceArgs = {
  distinct_on?: InputMaybe<Array<Referral_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Source_Order_By>>;
  where?: InputMaybe<Referral_Source_Bool_Exp>;
};


export type Query_RootReferral_Source_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Referral_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Source_Order_By>>;
  where?: InputMaybe<Referral_Source_Bool_Exp>;
};


export type Query_RootReferral_Source_By_PkArgs = {
  id: Scalars['bigint']['input'];
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
  capability_key: Capability_Enum;
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


export type Query_RootSearch_Household_Heads_ResultArgs = {
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
};


export type Query_RootSearch_Household_Heads_Result_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
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

/** columns and relationships of "referral_kind_enum" */
export type Referral_Kind_Enum = {
  __typename?: 'referral_kind_enum';
  comment: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

/** aggregated selection of "referral_kind_enum" */
export type Referral_Kind_Enum_Aggregate = {
  __typename?: 'referral_kind_enum_aggregate';
  aggregate?: Maybe<Referral_Kind_Enum_Aggregate_Fields>;
  nodes: Array<Referral_Kind_Enum>;
};

/** aggregate fields of "referral_kind_enum" */
export type Referral_Kind_Enum_Aggregate_Fields = {
  __typename?: 'referral_kind_enum_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Referral_Kind_Enum_Max_Fields>;
  min?: Maybe<Referral_Kind_Enum_Min_Fields>;
};


/** aggregate fields of "referral_kind_enum" */
export type Referral_Kind_Enum_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Referral_Kind_Enum_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "referral_kind_enum". All fields are combined with a logical 'AND'. */
export type Referral_Kind_Enum_Bool_Exp = {
  _and?: InputMaybe<Array<Referral_Kind_Enum_Bool_Exp>>;
  _not?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
  _or?: InputMaybe<Array<Referral_Kind_Enum_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "referral_kind_enum" */
export type Referral_Kind_Enum_Constraint =
  /** unique or primary key constraint on columns "value" */
  | 'referral_kind_enum_pkey';

/** input type for inserting data into table "referral_kind_enum" */
export type Referral_Kind_Enum_Insert_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Referral_Kind_Enum_Max_Fields = {
  __typename?: 'referral_kind_enum_max_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Referral_Kind_Enum_Min_Fields = {
  __typename?: 'referral_kind_enum_min_fields';
  comment?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "referral_kind_enum" */
export type Referral_Kind_Enum_Mutation_Response = {
  __typename?: 'referral_kind_enum_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Referral_Kind_Enum>;
};

/** input type for inserting object relation for remote table "referral_kind_enum" */
export type Referral_Kind_Enum_Obj_Rel_Insert_Input = {
  data: Referral_Kind_Enum_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Referral_Kind_Enum_On_Conflict>;
};

/** on_conflict condition type for table "referral_kind_enum" */
export type Referral_Kind_Enum_On_Conflict = {
  constraint: Referral_Kind_Enum_Constraint;
  update_columns?: Array<Referral_Kind_Enum_Update_Column>;
  where?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
};

/** Ordering options when selecting data from "referral_kind_enum". */
export type Referral_Kind_Enum_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: referral_kind_enum */
export type Referral_Kind_Enum_Pk_Columns_Input = {
  value: Scalars['String']['input'];
};

/** select columns of table "referral_kind_enum" */
export type Referral_Kind_Enum_Select_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

/** input type for updating data in table "referral_kind_enum" */
export type Referral_Kind_Enum_Set_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "referral_kind_enum" */
export type Referral_Kind_Enum_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Referral_Kind_Enum_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Referral_Kind_Enum_Stream_Cursor_Value_Input = {
  comment?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "referral_kind_enum" */
export type Referral_Kind_Enum_Update_Column =
  /** column name */
  | 'comment'
  /** column name */
  | 'value';

export type Referral_Kind_Enum_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Referral_Kind_Enum_Set_Input>;
  /** filter the rows which have to be updated */
  where: Referral_Kind_Enum_Bool_Exp;
};

/** columns and relationships of "referral_source" */
export type Referral_Source = {
  __typename?: 'referral_source';
  clinic_id: Scalars['bigint']['output'];
  created_at: Scalars['timestamptz']['output'];
  created_by?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['bigint']['output'];
  is_active: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updated_at: Scalars['timestamptz']['output'];
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregated selection of "referral_source" */
export type Referral_Source_Aggregate = {
  __typename?: 'referral_source_aggregate';
  aggregate?: Maybe<Referral_Source_Aggregate_Fields>;
  nodes: Array<Referral_Source>;
};

/** aggregate fields of "referral_source" */
export type Referral_Source_Aggregate_Fields = {
  __typename?: 'referral_source_aggregate_fields';
  avg?: Maybe<Referral_Source_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Referral_Source_Max_Fields>;
  min?: Maybe<Referral_Source_Min_Fields>;
  stddev?: Maybe<Referral_Source_Stddev_Fields>;
  stddev_pop?: Maybe<Referral_Source_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Referral_Source_Stddev_Samp_Fields>;
  sum?: Maybe<Referral_Source_Sum_Fields>;
  var_pop?: Maybe<Referral_Source_Var_Pop_Fields>;
  var_samp?: Maybe<Referral_Source_Var_Samp_Fields>;
  variance?: Maybe<Referral_Source_Variance_Fields>;
};


/** aggregate fields of "referral_source" */
export type Referral_Source_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Referral_Source_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Referral_Source_Avg_Fields = {
  __typename?: 'referral_source_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "referral_source". All fields are combined with a logical 'AND'. */
export type Referral_Source_Bool_Exp = {
  _and?: InputMaybe<Array<Referral_Source_Bool_Exp>>;
  _not?: InputMaybe<Referral_Source_Bool_Exp>;
  _or?: InputMaybe<Array<Referral_Source_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_by?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Bigint_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "referral_source" */
export type Referral_Source_Constraint =
  /** unique or primary key constraint on columns "clinic_id", "name" */
  | 'idx_referral_source_clinic_name_unique'
  /** unique or primary key constraint on columns "id" */
  | 'referral_source_pkey';

/** input type for incrementing numeric columns in table "referral_source" */
export type Referral_Source_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
};

/** input type for inserting data into table "referral_source" */
export type Referral_Source_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Referral_Source_Max_Fields = {
  __typename?: 'referral_source_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Referral_Source_Min_Fields = {
  __typename?: 'referral_source_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  created_by?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  updated_at?: Maybe<Scalars['timestamptz']['output']>;
  updated_by?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "referral_source" */
export type Referral_Source_Mutation_Response = {
  __typename?: 'referral_source_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Referral_Source>;
};

/** input type for inserting object relation for remote table "referral_source" */
export type Referral_Source_Obj_Rel_Insert_Input = {
  data: Referral_Source_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Referral_Source_On_Conflict>;
};

/** on_conflict condition type for table "referral_source" */
export type Referral_Source_On_Conflict = {
  constraint: Referral_Source_Constraint;
  update_columns?: Array<Referral_Source_Update_Column>;
  where?: InputMaybe<Referral_Source_Bool_Exp>;
};

/** Ordering options when selecting data from "referral_source". */
export type Referral_Source_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_by?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
};

/** primary key columns input for table: referral_source */
export type Referral_Source_Pk_Columns_Input = {
  id: Scalars['bigint']['input'];
};

/** select columns of table "referral_source" */
export type Referral_Source_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

/** input type for updating data in table "referral_source" */
export type Referral_Source_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Referral_Source_Stddev_Fields = {
  __typename?: 'referral_source_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Referral_Source_Stddev_Pop_Fields = {
  __typename?: 'referral_source_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Referral_Source_Stddev_Samp_Fields = {
  __typename?: 'referral_source_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "referral_source" */
export type Referral_Source_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Referral_Source_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Referral_Source_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  created_by?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['bigint']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>;
  updated_by?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Referral_Source_Sum_Fields = {
  __typename?: 'referral_source_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['bigint']['output']>;
};

/** update columns of table "referral_source" */
export type Referral_Source_Update_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'created_at'
  /** column name */
  | 'created_by'
  /** column name */
  | 'id'
  /** column name */
  | 'is_active'
  /** column name */
  | 'name'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'updated_by';

export type Referral_Source_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Referral_Source_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Referral_Source_Set_Input>;
  /** filter the rows which have to be updated */
  where: Referral_Source_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Referral_Source_Var_Pop_Fields = {
  __typename?: 'referral_source_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Referral_Source_Var_Samp_Fields = {
  __typename?: 'referral_source_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Referral_Source_Variance_Fields = {
  __typename?: 'referral_source_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
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
  capability_key: Capability_Enum;
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
  capability_key?: InputMaybe<Capability_Enum_Comparison_Exp>;
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
  capability_key?: InputMaybe<Capability_Enum>;
  created_at?: InputMaybe<Scalars['timestamptz']['input']>;
  role_id?: InputMaybe<Scalars['bigint']['input']>;
};

/** aggregate max on columns */
export type Role_Capability_Max_Fields = {
  __typename?: 'role_capability_max_fields';
  created_at?: Maybe<Scalars['timestamptz']['output']>;
  role_id?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Role_Capability_Min_Fields = {
  __typename?: 'role_capability_min_fields';
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
  capability_key: Capability_Enum;
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
  capability_key?: InputMaybe<Capability_Enum>;
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
  capability_key?: InputMaybe<Capability_Enum>;
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

/** columns and relationships of "search_household_heads_result" */
export type Search_Household_Heads_Result = {
  __typename?: 'search_household_heads_result';
  clinic_id: Scalars['bigint']['output'];
  display_name: Scalars['String']['output'];
  first_name: Scalars['String']['output'];
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  last_name: Scalars['String']['output'];
  person_id: Scalars['bigint']['output'];
  preferred_name?: Maybe<Scalars['String']['output']>;
  rank_score: Scalars['float8']['output'];
};

export type Search_Household_Heads_Result_Aggregate = {
  __typename?: 'search_household_heads_result_aggregate';
  aggregate?: Maybe<Search_Household_Heads_Result_Aggregate_Fields>;
  nodes: Array<Search_Household_Heads_Result>;
};

/** aggregate fields of "search_household_heads_result" */
export type Search_Household_Heads_Result_Aggregate_Fields = {
  __typename?: 'search_household_heads_result_aggregate_fields';
  avg?: Maybe<Search_Household_Heads_Result_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Search_Household_Heads_Result_Max_Fields>;
  min?: Maybe<Search_Household_Heads_Result_Min_Fields>;
  stddev?: Maybe<Search_Household_Heads_Result_Stddev_Fields>;
  stddev_pop?: Maybe<Search_Household_Heads_Result_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Search_Household_Heads_Result_Stddev_Samp_Fields>;
  sum?: Maybe<Search_Household_Heads_Result_Sum_Fields>;
  var_pop?: Maybe<Search_Household_Heads_Result_Var_Pop_Fields>;
  var_samp?: Maybe<Search_Household_Heads_Result_Var_Samp_Fields>;
  variance?: Maybe<Search_Household_Heads_Result_Variance_Fields>;
};


/** aggregate fields of "search_household_heads_result" */
export type Search_Household_Heads_Result_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Search_Household_Heads_Result_Avg_Fields = {
  __typename?: 'search_household_heads_result_avg_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  rank_score?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "search_household_heads_result". All fields are combined with a logical 'AND'. */
export type Search_Household_Heads_Result_Bool_Exp = {
  _and?: InputMaybe<Array<Search_Household_Heads_Result_Bool_Exp>>;
  _not?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
  _or?: InputMaybe<Array<Search_Household_Heads_Result_Bool_Exp>>;
  clinic_id?: InputMaybe<Bigint_Comparison_Exp>;
  display_name?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  household_head_id?: InputMaybe<Bigint_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  person_id?: InputMaybe<Bigint_Comparison_Exp>;
  preferred_name?: InputMaybe<String_Comparison_Exp>;
  rank_score?: InputMaybe<Float8_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "search_household_heads_result" */
export type Search_Household_Heads_Result_Inc_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  rank_score?: InputMaybe<Scalars['float8']['input']>;
};

/** input type for inserting data into table "search_household_heads_result" */
export type Search_Household_Heads_Result_Insert_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  rank_score?: InputMaybe<Scalars['float8']['input']>;
};

/** aggregate max on columns */
export type Search_Household_Heads_Result_Max_Fields = {
  __typename?: 'search_household_heads_result_max_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  rank_score?: Maybe<Scalars['float8']['output']>;
};

/** aggregate min on columns */
export type Search_Household_Heads_Result_Min_Fields = {
  __typename?: 'search_household_heads_result_min_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  display_name?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  preferred_name?: Maybe<Scalars['String']['output']>;
  rank_score?: Maybe<Scalars['float8']['output']>;
};

/** response of any mutation on the table "search_household_heads_result" */
export type Search_Household_Heads_Result_Mutation_Response = {
  __typename?: 'search_household_heads_result_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Search_Household_Heads_Result>;
};

/** Ordering options when selecting data from "search_household_heads_result". */
export type Search_Household_Heads_Result_Order_By = {
  clinic_id?: InputMaybe<Order_By>;
  display_name?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  household_head_id?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  person_id?: InputMaybe<Order_By>;
  preferred_name?: InputMaybe<Order_By>;
  rank_score?: InputMaybe<Order_By>;
};

/** select columns of table "search_household_heads_result" */
export type Search_Household_Heads_Result_Select_Column =
  /** column name */
  | 'clinic_id'
  /** column name */
  | 'display_name'
  /** column name */
  | 'first_name'
  /** column name */
  | 'household_head_id'
  /** column name */
  | 'last_name'
  /** column name */
  | 'person_id'
  /** column name */
  | 'preferred_name'
  /** column name */
  | 'rank_score';

/** input type for updating data in table "search_household_heads_result" */
export type Search_Household_Heads_Result_Set_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  rank_score?: InputMaybe<Scalars['float8']['input']>;
};

/** aggregate stddev on columns */
export type Search_Household_Heads_Result_Stddev_Fields = {
  __typename?: 'search_household_heads_result_stddev_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  rank_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Search_Household_Heads_Result_Stddev_Pop_Fields = {
  __typename?: 'search_household_heads_result_stddev_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  rank_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Search_Household_Heads_Result_Stddev_Samp_Fields = {
  __typename?: 'search_household_heads_result_stddev_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  rank_score?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "search_household_heads_result" */
export type Search_Household_Heads_Result_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Search_Household_Heads_Result_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Search_Household_Heads_Result_Stream_Cursor_Value_Input = {
  clinic_id?: InputMaybe<Scalars['bigint']['input']>;
  display_name?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  household_head_id?: InputMaybe<Scalars['bigint']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  person_id?: InputMaybe<Scalars['bigint']['input']>;
  preferred_name?: InputMaybe<Scalars['String']['input']>;
  rank_score?: InputMaybe<Scalars['float8']['input']>;
};

/** aggregate sum on columns */
export type Search_Household_Heads_Result_Sum_Fields = {
  __typename?: 'search_household_heads_result_sum_fields';
  clinic_id?: Maybe<Scalars['bigint']['output']>;
  household_head_id?: Maybe<Scalars['bigint']['output']>;
  person_id?: Maybe<Scalars['bigint']['output']>;
  rank_score?: Maybe<Scalars['float8']['output']>;
};

export type Search_Household_Heads_Result_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Search_Household_Heads_Result_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Search_Household_Heads_Result_Set_Input>;
  /** filter the rows which have to be updated */
  where: Search_Household_Heads_Result_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Search_Household_Heads_Result_Var_Pop_Fields = {
  __typename?: 'search_household_heads_result_var_pop_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  rank_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Search_Household_Heads_Result_Var_Samp_Fields = {
  __typename?: 'search_household_heads_result_var_samp_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  rank_score?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Search_Household_Heads_Result_Variance_Fields = {
  __typename?: 'search_household_heads_result_variance_fields';
  clinic_id?: Maybe<Scalars['Float']['output']>;
  household_head_id?: Maybe<Scalars['Float']['output']>;
  person_id?: Maybe<Scalars['Float']['output']>;
  rank_score?: Maybe<Scalars['Float']['output']>;
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
  /** fetch data from the table: "address" */
  address: Array<Address>;
  /** fetch aggregated fields from the table: "address" */
  address_aggregate: Address_Aggregate;
  /** fetch data from the table: "address" using primary key columns */
  address_by_pk?: Maybe<Address>;
  /** fetch data from the table in a streaming manner: "address" */
  address_stream: Array<Address>;
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
  /** fetch data from the table: "audit.event" */
  audit_event: Array<Audit_Event>;
  /** fetch aggregated fields from the table: "audit.event" */
  audit_event_aggregate: Audit_Event_Aggregate;
  /** fetch data from the table: "audit.event" using primary key columns */
  audit_event_by_pk?: Maybe<Audit_Event>;
  /** fetch data from the table in a streaming manner: "audit.event" */
  audit_event_stream: Array<Audit_Event>;
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
  /** fetch data from the table: "family_group_v" */
  family_group_v: Array<Family_Group_V>;
  /** fetch aggregated fields from the table: "family_group_v" */
  family_group_v_aggregate: Family_Group_V_Aggregate;
  /** fetch data from the table in a streaming manner: "family_group_v" */
  family_group_v_stream: Array<Family_Group_V>;
  /** fetch data from the table: "family_members_v" */
  family_members_v: Array<Family_Members_V>;
  /** fetch aggregated fields from the table: "family_members_v" */
  family_members_v_aggregate: Family_Members_V_Aggregate;
  /** fetch data from the table in a streaming manner: "family_members_v" */
  family_members_v_stream: Array<Family_Members_V>;
  /** execute function "fn_search_household_heads" which returns "search_household_heads_result" */
  fn_search_household_heads: Array<Search_Household_Heads_Result>;
  /** execute function "fn_search_household_heads" and query aggregates on result of table type "search_household_heads_result" */
  fn_search_household_heads_aggregate: Search_Household_Heads_Result_Aggregate;
  /** fetch data from the table: "gender_enum" */
  gender_enum: Array<Gender_Enum>;
  /** fetch aggregated fields from the table: "gender_enum" */
  gender_enum_aggregate: Gender_Enum_Aggregate;
  /** fetch data from the table: "gender_enum" using primary key columns */
  gender_enum_by_pk?: Maybe<Gender_Enum>;
  /** fetch data from the table in a streaming manner: "gender_enum" */
  gender_enum_stream: Array<Gender_Enum>;
  /** fetch data from the table: "insurance_subscriber" */
  insurance_subscriber: Array<Insurance_Subscriber>;
  /** fetch aggregated fields from the table: "insurance_subscriber" */
  insurance_subscriber_aggregate: Insurance_Subscriber_Aggregate;
  /** fetch data from the table: "insurance_subscriber" using primary key columns */
  insurance_subscriber_by_pk?: Maybe<Insurance_Subscriber>;
  /** fetch data from the table in a streaming manner: "insurance_subscriber" */
  insurance_subscriber_stream: Array<Insurance_Subscriber>;
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
  /** fetch data from the table: "patient" */
  patient: Array<Patient>;
  /** fetch aggregated fields from the table: "patient" */
  patient_aggregate: Patient_Aggregate;
  /** fetch data from the table: "patient" using primary key columns */
  patient_by_pk?: Maybe<Patient>;
  /** fetch data from the table: "patient_field_config" */
  patient_field_config: Array<Patient_Field_Config>;
  /** fetch aggregated fields from the table: "patient_field_config" */
  patient_field_config_aggregate: Patient_Field_Config_Aggregate;
  /** fetch data from the table: "patient_field_config" using primary key columns */
  patient_field_config_by_pk?: Maybe<Patient_Field_Config>;
  /** fetch data from the table in a streaming manner: "patient_field_config" */
  patient_field_config_stream: Array<Patient_Field_Config>;
  /** fetch data from the table: "patient_financial" */
  patient_financial: Array<Patient_Financial>;
  /** fetch aggregated fields from the table: "patient_financial" */
  patient_financial_aggregate: Patient_Financial_Aggregate;
  /** fetch data from the table: "patient_financial" using primary key columns */
  patient_financial_by_pk?: Maybe<Patient_Financial>;
  /** fetch data from the table in a streaming manner: "patient_financial" */
  patient_financial_stream: Array<Patient_Financial>;
  /** fetch data from the table: "patient_profile_v" */
  patient_profile_v: Array<Patient_Profile_V>;
  /** fetch aggregated fields from the table: "patient_profile_v" */
  patient_profile_v_aggregate: Patient_Profile_V_Aggregate;
  /** fetch data from the table in a streaming manner: "patient_profile_v" */
  patient_profile_v_stream: Array<Patient_Profile_V>;
  /** An array relationship */
  patient_referral: Array<Patient_Referral>;
  /** An aggregate relationship */
  patient_referral_aggregate: Patient_Referral_Aggregate;
  /** fetch data from the table: "patient_referral" using primary key columns */
  patient_referral_by_pk?: Maybe<Patient_Referral>;
  /** fetch data from the table in a streaming manner: "patient_referral" */
  patient_referral_stream: Array<Patient_Referral>;
  /** fetch data from the table: "patient_status_enum" */
  patient_status_enum: Array<Patient_Status_Enum>;
  /** fetch aggregated fields from the table: "patient_status_enum" */
  patient_status_enum_aggregate: Patient_Status_Enum_Aggregate;
  /** fetch data from the table: "patient_status_enum" using primary key columns */
  patient_status_enum_by_pk?: Maybe<Patient_Status_Enum>;
  /** fetch data from the table in a streaming manner: "patient_status_enum" */
  patient_status_enum_stream: Array<Patient_Status_Enum>;
  /** fetch data from the table in a streaming manner: "patient" */
  patient_stream: Array<Patient>;
  /** fetch data from the table: "person" */
  person: Array<Person>;
  /** fetch aggregated fields from the table: "person" */
  person_aggregate: Person_Aggregate;
  /** fetch data from the table: "person" using primary key columns */
  person_by_pk?: Maybe<Person>;
  /** An array relationship */
  person_contact_point: Array<Person_Contact_Point>;
  /** An aggregate relationship */
  person_contact_point_aggregate: Person_Contact_Point_Aggregate;
  /** fetch data from the table: "person_contact_point" using primary key columns */
  person_contact_point_by_pk?: Maybe<Person_Contact_Point>;
  /** fetch data from the table in a streaming manner: "person_contact_point" */
  person_contact_point_stream: Array<Person_Contact_Point>;
  /** fetch data from the table in a streaming manner: "person" */
  person_stream: Array<Person>;
  /** fetch data from the table: "person_with_responsible_party_v" */
  person_with_responsible_party_v: Array<Person_With_Responsible_Party_V>;
  /** fetch aggregated fields from the table: "person_with_responsible_party_v" */
  person_with_responsible_party_v_aggregate: Person_With_Responsible_Party_V_Aggregate;
  /** fetch data from the table in a streaming manner: "person_with_responsible_party_v" */
  person_with_responsible_party_v_stream: Array<Person_With_Responsible_Party_V>;
  /** fetch data from the table: "referral_kind_enum" */
  referral_kind_enum: Array<Referral_Kind_Enum>;
  /** fetch aggregated fields from the table: "referral_kind_enum" */
  referral_kind_enum_aggregate: Referral_Kind_Enum_Aggregate;
  /** fetch data from the table: "referral_kind_enum" using primary key columns */
  referral_kind_enum_by_pk?: Maybe<Referral_Kind_Enum>;
  /** fetch data from the table in a streaming manner: "referral_kind_enum" */
  referral_kind_enum_stream: Array<Referral_Kind_Enum>;
  /** fetch data from the table: "referral_source" */
  referral_source: Array<Referral_Source>;
  /** fetch aggregated fields from the table: "referral_source" */
  referral_source_aggregate: Referral_Source_Aggregate;
  /** fetch data from the table: "referral_source" using primary key columns */
  referral_source_by_pk?: Maybe<Referral_Source>;
  /** fetch data from the table in a streaming manner: "referral_source" */
  referral_source_stream: Array<Referral_Source>;
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
  /** fetch data from the table: "search_household_heads_result" */
  search_household_heads_result: Array<Search_Household_Heads_Result>;
  /** fetch aggregated fields from the table: "search_household_heads_result" */
  search_household_heads_result_aggregate: Search_Household_Heads_Result_Aggregate;
  /** fetch data from the table in a streaming manner: "search_household_heads_result" */
  search_household_heads_result_stream: Array<Search_Household_Heads_Result>;
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
};


export type Subscription_RootAddressArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};


export type Subscription_RootAddress_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Address_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Address_Order_By>>;
  where?: InputMaybe<Address_Bool_Exp>;
};


export type Subscription_RootAddress_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootAddress_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Address_Stream_Cursor_Input>>;
  where?: InputMaybe<Address_Bool_Exp>;
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


export type Subscription_RootAudit_EventArgs = {
  distinct_on?: InputMaybe<Array<Audit_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Event_Order_By>>;
  where?: InputMaybe<Audit_Event_Bool_Exp>;
};


export type Subscription_RootAudit_Event_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Audit_Event_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Audit_Event_Order_By>>;
  where?: InputMaybe<Audit_Event_Bool_Exp>;
};


export type Subscription_RootAudit_Event_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootAudit_Event_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Audit_Event_Stream_Cursor_Input>>;
  where?: InputMaybe<Audit_Event_Bool_Exp>;
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
  value: Scalars['String']['input'];
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


export type Subscription_RootFamily_Group_VArgs = {
  distinct_on?: InputMaybe<Array<Family_Group_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Group_V_Order_By>>;
  where?: InputMaybe<Family_Group_V_Bool_Exp>;
};


export type Subscription_RootFamily_Group_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Family_Group_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Group_V_Order_By>>;
  where?: InputMaybe<Family_Group_V_Bool_Exp>;
};


export type Subscription_RootFamily_Group_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Family_Group_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Family_Group_V_Bool_Exp>;
};


export type Subscription_RootFamily_Members_VArgs = {
  distinct_on?: InputMaybe<Array<Family_Members_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Members_V_Order_By>>;
  where?: InputMaybe<Family_Members_V_Bool_Exp>;
};


export type Subscription_RootFamily_Members_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Family_Members_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Family_Members_V_Order_By>>;
  where?: InputMaybe<Family_Members_V_Bool_Exp>;
};


export type Subscription_RootFamily_Members_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Family_Members_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Family_Members_V_Bool_Exp>;
};


export type Subscription_RootFn_Search_Household_HeadsArgs = {
  args: Fn_Search_Household_Heads_Args;
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
};


export type Subscription_RootFn_Search_Household_Heads_AggregateArgs = {
  args: Fn_Search_Household_Heads_Args;
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
};


export type Subscription_RootGender_EnumArgs = {
  distinct_on?: InputMaybe<Array<Gender_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Gender_Enum_Order_By>>;
  where?: InputMaybe<Gender_Enum_Bool_Exp>;
};


export type Subscription_RootGender_Enum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Gender_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Gender_Enum_Order_By>>;
  where?: InputMaybe<Gender_Enum_Bool_Exp>;
};


export type Subscription_RootGender_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootGender_Enum_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Gender_Enum_Stream_Cursor_Input>>;
  where?: InputMaybe<Gender_Enum_Bool_Exp>;
};


export type Subscription_RootInsurance_SubscriberArgs = {
  distinct_on?: InputMaybe<Array<Insurance_Subscriber_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Insurance_Subscriber_Order_By>>;
  where?: InputMaybe<Insurance_Subscriber_Bool_Exp>;
};


export type Subscription_RootInsurance_Subscriber_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Insurance_Subscriber_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Insurance_Subscriber_Order_By>>;
  where?: InputMaybe<Insurance_Subscriber_Bool_Exp>;
};


export type Subscription_RootInsurance_Subscriber_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootInsurance_Subscriber_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Insurance_Subscriber_Stream_Cursor_Input>>;
  where?: InputMaybe<Insurance_Subscriber_Bool_Exp>;
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


export type Subscription_RootPatientArgs = {
  distinct_on?: InputMaybe<Array<Patient_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Order_By>>;
  where?: InputMaybe<Patient_Bool_Exp>;
};


export type Subscription_RootPatient_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Order_By>>;
  where?: InputMaybe<Patient_Bool_Exp>;
};


export type Subscription_RootPatient_By_PkArgs = {
  person_id: Scalars['bigint']['input'];
};


export type Subscription_RootPatient_Field_ConfigArgs = {
  distinct_on?: InputMaybe<Array<Patient_Field_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Field_Config_Order_By>>;
  where?: InputMaybe<Patient_Field_Config_Bool_Exp>;
};


export type Subscription_RootPatient_Field_Config_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Field_Config_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Field_Config_Order_By>>;
  where?: InputMaybe<Patient_Field_Config_Bool_Exp>;
};


export type Subscription_RootPatient_Field_Config_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootPatient_Field_Config_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Patient_Field_Config_Stream_Cursor_Input>>;
  where?: InputMaybe<Patient_Field_Config_Bool_Exp>;
};


export type Subscription_RootPatient_FinancialArgs = {
  distinct_on?: InputMaybe<Array<Patient_Financial_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Financial_Order_By>>;
  where?: InputMaybe<Patient_Financial_Bool_Exp>;
};


export type Subscription_RootPatient_Financial_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Financial_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Financial_Order_By>>;
  where?: InputMaybe<Patient_Financial_Bool_Exp>;
};


export type Subscription_RootPatient_Financial_By_PkArgs = {
  patient_person_id: Scalars['bigint']['input'];
};


export type Subscription_RootPatient_Financial_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Patient_Financial_Stream_Cursor_Input>>;
  where?: InputMaybe<Patient_Financial_Bool_Exp>;
};


export type Subscription_RootPatient_Profile_VArgs = {
  distinct_on?: InputMaybe<Array<Patient_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Profile_V_Order_By>>;
  where?: InputMaybe<Patient_Profile_V_Bool_Exp>;
};


export type Subscription_RootPatient_Profile_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Profile_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Profile_V_Order_By>>;
  where?: InputMaybe<Patient_Profile_V_Bool_Exp>;
};


export type Subscription_RootPatient_Profile_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Patient_Profile_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Patient_Profile_V_Bool_Exp>;
};


export type Subscription_RootPatient_ReferralArgs = {
  distinct_on?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Referral_Order_By>>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};


export type Subscription_RootPatient_Referral_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Referral_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Referral_Order_By>>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};


export type Subscription_RootPatient_Referral_By_PkArgs = {
  patient_person_id: Scalars['bigint']['input'];
};


export type Subscription_RootPatient_Referral_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Patient_Referral_Stream_Cursor_Input>>;
  where?: InputMaybe<Patient_Referral_Bool_Exp>;
};


export type Subscription_RootPatient_Status_EnumArgs = {
  distinct_on?: InputMaybe<Array<Patient_Status_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Status_Enum_Order_By>>;
  where?: InputMaybe<Patient_Status_Enum_Bool_Exp>;
};


export type Subscription_RootPatient_Status_Enum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Patient_Status_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Patient_Status_Enum_Order_By>>;
  where?: InputMaybe<Patient_Status_Enum_Bool_Exp>;
};


export type Subscription_RootPatient_Status_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootPatient_Status_Enum_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Patient_Status_Enum_Stream_Cursor_Input>>;
  where?: InputMaybe<Patient_Status_Enum_Bool_Exp>;
};


export type Subscription_RootPatient_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Patient_Stream_Cursor_Input>>;
  where?: InputMaybe<Patient_Bool_Exp>;
};


export type Subscription_RootPersonArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


export type Subscription_RootPerson_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Order_By>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


export type Subscription_RootPerson_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootPerson_Contact_PointArgs = {
  distinct_on?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Contact_Point_Order_By>>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};


export type Subscription_RootPerson_Contact_Point_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_Contact_Point_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_Contact_Point_Order_By>>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};


export type Subscription_RootPerson_Contact_Point_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootPerson_Contact_Point_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Person_Contact_Point_Stream_Cursor_Input>>;
  where?: InputMaybe<Person_Contact_Point_Bool_Exp>;
};


export type Subscription_RootPerson_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Person_Stream_Cursor_Input>>;
  where?: InputMaybe<Person_Bool_Exp>;
};


export type Subscription_RootPerson_With_Responsible_Party_VArgs = {
  distinct_on?: InputMaybe<Array<Person_With_Responsible_Party_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_With_Responsible_Party_V_Order_By>>;
  where?: InputMaybe<Person_With_Responsible_Party_V_Bool_Exp>;
};


export type Subscription_RootPerson_With_Responsible_Party_V_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Person_With_Responsible_Party_V_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Person_With_Responsible_Party_V_Order_By>>;
  where?: InputMaybe<Person_With_Responsible_Party_V_Bool_Exp>;
};


export type Subscription_RootPerson_With_Responsible_Party_V_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Person_With_Responsible_Party_V_Stream_Cursor_Input>>;
  where?: InputMaybe<Person_With_Responsible_Party_V_Bool_Exp>;
};


export type Subscription_RootReferral_Kind_EnumArgs = {
  distinct_on?: InputMaybe<Array<Referral_Kind_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Kind_Enum_Order_By>>;
  where?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
};


export type Subscription_RootReferral_Kind_Enum_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Referral_Kind_Enum_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Kind_Enum_Order_By>>;
  where?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
};


export type Subscription_RootReferral_Kind_Enum_By_PkArgs = {
  value: Scalars['String']['input'];
};


export type Subscription_RootReferral_Kind_Enum_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Referral_Kind_Enum_Stream_Cursor_Input>>;
  where?: InputMaybe<Referral_Kind_Enum_Bool_Exp>;
};


export type Subscription_RootReferral_SourceArgs = {
  distinct_on?: InputMaybe<Array<Referral_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Source_Order_By>>;
  where?: InputMaybe<Referral_Source_Bool_Exp>;
};


export type Subscription_RootReferral_Source_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Referral_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Referral_Source_Order_By>>;
  where?: InputMaybe<Referral_Source_Bool_Exp>;
};


export type Subscription_RootReferral_Source_By_PkArgs = {
  id: Scalars['bigint']['input'];
};


export type Subscription_RootReferral_Source_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Referral_Source_Stream_Cursor_Input>>;
  where?: InputMaybe<Referral_Source_Bool_Exp>;
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
  capability_key: Capability_Enum;
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


export type Subscription_RootSearch_Household_Heads_ResultArgs = {
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
};


export type Subscription_RootSearch_Household_Heads_Result_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Search_Household_Heads_Result_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Search_Household_Heads_Result_Order_By>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
};


export type Subscription_RootSearch_Household_Heads_Result_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Search_Household_Heads_Result_Stream_Cursor_Input>>;
  where?: InputMaybe<Search_Household_Heads_Result_Bool_Exp>;
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
  clinicId: Scalars['bigint']['input'];
  userId: Scalars['uuid']['input'];
}>;


export type GetUserEffectiveCapabilitiesQuery = { __typename?: 'query_root', clinic_user_effective_capabilities_v: Array<{ __typename?: 'clinic_user_effective_capabilities_v', capability_key?: string | null, clinic_id?: number | null, user_id?: string | null }> };

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

export type CreatePatientWithRelationsMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  preferredName?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['date']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
  householdHeadId?: InputMaybe<Scalars['bigint']['input']>;
  householdRelationship?: InputMaybe<Scalars['String']['input']>;
  responsiblePartyId?: InputMaybe<Scalars['bigint']['input']>;
  chartNo?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  familyDoctorName?: InputMaybe<Scalars['String']['input']>;
  familyDoctorPhone?: InputMaybe<Scalars['String']['input']>;
  imagingId?: InputMaybe<Scalars['String']['input']>;
  contactPoints: Array<Person_Contact_Point_Insert_Input> | Person_Contact_Point_Insert_Input;
  mailingAddressId?: InputMaybe<Scalars['bigint']['input']>;
  billingAddressId?: InputMaybe<Scalars['bigint']['input']>;
}>;


export type CreatePatientWithRelationsMutation = { __typename?: 'mutation_root', insert_person_one?: { __typename?: 'person', id: number, clinic_id: number, first_name: string, last_name: string, preferred_name?: string | null, household_head_id?: number | null, household_relationship?: string | null, responsible_party_id?: number | null, patient?: { __typename?: 'patient', person_id: number, chart_no?: string | null, status: string } | null, person_contact_point: Array<{ __typename?: 'person_contact_point', id: number, kind: string, value: any }>, mailing_address?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string } | null, billing_address?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string } | null } | null };

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

export type GetGenderEnumQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGenderEnumQuery = { __typename?: 'query_root', gender_enum: Array<{ __typename?: 'gender_enum', value: string, comment: string }> };

export type GetFamilyRootQueryVariables = Exact<{
  personId: Scalars['bigint']['input'];
}>;


export type GetFamilyRootQuery = { __typename?: 'query_root', family_group_v: Array<{ __typename?: 'family_group_v', family_root_person_id?: number | null }> };

export type GetFamilyMembersQueryVariables = Exact<{
  familyRootPersonId: Scalars['bigint']['input'];
  clinicId: Scalars['bigint']['input'];
}>;


export type GetFamilyMembersQuery = { __typename?: 'query_root', rootPerson: Array<{ __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null, dob?: any | null, household_relationship?: string | null, patient?: { __typename?: 'patient', person_id: number, chart_no?: string | null } | null }>, dependents: Array<{ __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null, dob?: any | null, household_relationship?: string | null, patient?: { __typename?: 'patient', person_id: number, chart_no?: string | null } | null }> };

export type GetHouseholdMembersQueryVariables = Exact<{
  householdHeadPersonId: Scalars['bigint']['input'];
  clinicId: Scalars['bigint']['input'];
}>;


export type GetHouseholdMembersQuery = { __typename?: 'query_root', householdHead: Array<{ __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null, dob?: any | null, household_relationship?: string | null, patient?: { __typename?: 'patient', person_id: number, chart_no?: string | null } | null }>, householdMembers: Array<{ __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null, dob?: any | null, household_relationship?: string | null, patient?: { __typename?: 'patient', person_id: number, chart_no?: string | null } | null }> };

export type UpdatePersonResponsiblePartyMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  responsiblePartyId?: InputMaybe<Scalars['bigint']['input']>;
  householdRelationship?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePersonResponsiblePartyMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, responsible_party_id?: number | null, household_relationship?: string | null } | null };

export type SearchFamilyRootsQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  searchTerm: Scalars['String']['input'];
}>;


export type SearchFamilyRootsQuery = { __typename?: 'query_root', person: Array<{ __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null, responsible_party_id?: number | null, person_contact_point: Array<{ __typename?: 'person_contact_point', value: any, kind: string }> }> };

export type UpsertPatientFinancialMutationVariables = Exact<{
  patientPersonId: Scalars['bigint']['input'];
}>;


export type UpsertPatientFinancialMutation = { __typename?: 'mutation_root', insert_patient_financial_one?: { __typename?: 'patient_financial', patient_person_id: number, is_active: boolean } | null };

export type UpdatePersonHouseholdHeadMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  householdHeadId?: InputMaybe<Scalars['bigint']['input']>;
  householdRelationship?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePersonHouseholdHeadMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, household_head_id?: number | null, household_relationship?: string | null, household_head?: { __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null } | null } | null };

export type SearchHouseholdHeadsQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  searchTerm: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchHouseholdHeadsQuery = { __typename?: 'query_root', fn_search_household_heads: Array<{ __typename?: 'search_household_heads_result', person_id: number, clinic_id: number, display_name: string, first_name: string, last_name: string, preferred_name?: string | null, household_head_id?: number | null, rank_score: any }> };

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

export type GetPatientFieldConfigQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetPatientFieldConfigQuery = { __typename?: 'query_root', patient_field_config: Array<{ __typename?: 'patient_field_config', id: number, clinic_id: number, field_key: string, field_label: string, display_order: number, is_displayed: boolean, is_required: boolean, is_active: boolean }> };

export type UpdatePatientFieldConfigMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  fieldLabel?: InputMaybe<Scalars['String']['input']>;
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  isDisplayed?: InputMaybe<Scalars['Boolean']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdatePatientFieldConfigMutation = { __typename?: 'mutation_root', update_patient_field_config_by_pk?: { __typename?: 'patient_field_config', id: number, field_key: string, field_label: string, display_order: number, is_displayed: boolean, is_required: boolean } | null };

export type UpdatePatientFieldConfigOrderMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  displayOrder: Scalars['Int']['input'];
}>;


export type UpdatePatientFieldConfigOrderMutation = { __typename?: 'mutation_root', update_patient_field_config_by_pk?: { __typename?: 'patient_field_config', id: number, display_order: number } | null };

export type UpdatePatientFieldConfigDisplayMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  isDisplayed: Scalars['Boolean']['input'];
}>;


export type UpdatePatientFieldConfigDisplayMutation = { __typename?: 'mutation_root', update_patient_field_config_by_pk?: { __typename?: 'patient_field_config', id: number, is_displayed: boolean } | null };

export type UpdatePatientFieldConfigRequiredMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  isRequired: Scalars['Boolean']['input'];
}>;


export type UpdatePatientFieldConfigRequiredMutation = { __typename?: 'mutation_root', update_patient_field_config_by_pk?: { __typename?: 'patient_field_config', id: number, is_required: boolean } | null };

export type CreatePersonMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  preferredName?: InputMaybe<Scalars['String']['input']>;
  dob?: InputMaybe<Scalars['date']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreatePersonMutation = { __typename?: 'mutation_root', insert_person_one?: { __typename?: 'person', id: number, clinic_id: number, first_name: string, last_name: string } | null };

export type CreatePatientMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  chartNo?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
  familyDoctorName?: InputMaybe<Scalars['String']['input']>;
  familyDoctorPhone?: InputMaybe<Scalars['String']['input']>;
  imagingId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreatePatientMutation = { __typename?: 'mutation_root', insert_patient_one?: { __typename?: 'patient', person_id: number, chart_no?: string | null, status: string } | null };

export type UpdatePersonFirstNameMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  firstName: Scalars['String']['input'];
}>;


export type UpdatePersonFirstNameMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, first_name: string } | null };

export type UpdatePersonLastNameMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  lastName: Scalars['String']['input'];
}>;


export type UpdatePersonLastNameMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, last_name: string } | null };

export type UpdatePersonPreferredNameMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  preferredName?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePersonPreferredNameMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, preferred_name?: string | null } | null };

export type UpdatePersonMiddleNameMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePersonMiddleNameMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, middle_name?: string | null } | null };

export type UpdatePersonDobMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  dob?: InputMaybe<Scalars['date']['input']>;
}>;


export type UpdatePersonDobMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, dob?: any | null } | null };

export type UpdatePersonPreferredLanguageMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  preferredLanguage?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePersonPreferredLanguageMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, preferred_language?: string | null } | null };

export type UpdatePatientChartNoMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  chartNo?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePatientChartNoMutation = { __typename?: 'mutation_root', update_patient_by_pk?: { __typename?: 'patient', person_id: number, chart_no?: string | null } | null };

export type UpdatePatientStatusMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  status: Scalars['String']['input'];
}>;


export type UpdatePatientStatusMutation = { __typename?: 'mutation_root', update_patient_by_pk?: { __typename?: 'patient', person_id: number, status: string } | null };

export type UpdatePatientFamilyDoctorNameMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  familyDoctorName?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePatientFamilyDoctorNameMutation = { __typename?: 'mutation_root', update_patient_by_pk?: { __typename?: 'patient', person_id: number, family_doctor_name?: string | null } | null };

export type UpdatePatientFamilyDoctorPhoneMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  familyDoctorPhone?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePatientFamilyDoctorPhoneMutation = { __typename?: 'mutation_root', update_patient_by_pk?: { __typename?: 'patient', person_id: number, family_doctor_phone?: string | null } | null };

export type UpdatePatientImagingIdMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  imagingId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePatientImagingIdMutation = { __typename?: 'mutation_root', update_patient_by_pk?: { __typename?: 'patient', person_id: number, imaging_id?: string | null } | null };

export type GetPatientStatusEnumQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPatientStatusEnumQuery = { __typename?: 'query_root', patient_status_enum: Array<{ __typename?: 'patient_status_enum', value: string, comment: string }> };

export type LegacySearchPatientsQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  searchText?: InputMaybe<Scalars['String']['input']>;
  phoneDigits?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
}>;


export type LegacySearchPatientsQuery = { __typename?: 'query_root', person: Array<{ __typename?: 'person', id: number, clinic_id: number, first_name: string, last_name: string, preferred_name?: string | null, dob?: any | null, patient?: { __typename?: 'patient', chart_no?: string | null, status: string } | null, person_contact_point: Array<{ __typename?: 'person_contact_point', value: any }> }> };

export type CreateAddressMutationVariables = Exact<{
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  region: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAddressMutation = { __typename?: 'mutation_root', insert_address_one?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string, country: string } | null };

export type UpdatePersonMailingAddressMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  addressId?: InputMaybe<Scalars['bigint']['input']>;
}>;


export type UpdatePersonMailingAddressMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, mailing_address_id?: number | null, mailing_address?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string, country: string } | null } | null };

export type UpdatePersonBillingAddressMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  addressId?: InputMaybe<Scalars['bigint']['input']>;
}>;


export type UpdatePersonBillingAddressMutation = { __typename?: 'mutation_root', update_person_by_pk?: { __typename?: 'person', id: number, billing_address_id?: number | null, billing_address?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string, country: string } | null } | null };

export type UpdateAddressMutationVariables = Exact<{
  addressId: Scalars['bigint']['input'];
  line1?: InputMaybe<Scalars['String']['input']>;
  line2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateAddressMutation = { __typename?: 'mutation_root', update_address_by_pk?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string, country: string } | null };

export type GetPersonAddressIdsQueryVariables = Exact<{
  personId: Scalars['bigint']['input'];
  clinicId: Scalars['bigint']['input'];
}>;


export type GetPersonAddressIdsQuery = { __typename?: 'query_root', person: Array<{ __typename?: 'person', id: number, mailing_address_id?: number | null, billing_address_id?: number | null, mailing_address?: { __typename?: 'address', line1: string, line2?: string | null, city: string, region: string, postal_code: string, country: string } | null, person_contact_point: Array<{ __typename?: 'person_contact_point', id: number, kind: string, value: any, is_primary: boolean }> }> };

export type CreatePersonContactPointMutationVariables = Exact<{
  personId: Scalars['bigint']['input'];
  kind: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['citext']['input'];
  phoneE164?: InputMaybe<Scalars['String']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreatePersonContactPointMutation = { __typename?: 'mutation_root', insert_person_contact_point_one?: { __typename?: 'person_contact_point', id: number, person_id: number, kind: string, label?: string | null, value: any, phone_e164?: string | null, is_primary: boolean, is_active: boolean } | null };

export type UpdatePersonContactPointMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['citext']['input']>;
  phoneE164?: InputMaybe<Scalars['String']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdatePersonContactPointMutation = { __typename?: 'mutation_root', update_person_contact_point_by_pk?: { __typename?: 'person_contact_point', id: number, kind: string, label?: string | null, value: any, phone_e164?: string | null, is_primary: boolean } | null };

export type DeletePersonContactPointMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
}>;


export type DeletePersonContactPointMutation = { __typename?: 'mutation_root', update_person_contact_point_by_pk?: { __typename?: 'person_contact_point', id: number } | null };

export type GetPersonProfileQueryVariables = Exact<{
  personId: Scalars['bigint']['input'];
  clinicId: Scalars['bigint']['input'];
}>;


export type GetPersonProfileQuery = { __typename?: 'query_root', person: Array<{ __typename?: 'person', id: number, clinic_id: number, first_name: string, middle_name?: string | null, last_name: string, preferred_name?: string | null, dob?: any | null, gender?: string | null, preferred_language?: string | null, is_active: boolean, responsible_party_id?: number | null, household_relationship?: string | null, household_head_id?: number | null, created_at: string, created_by?: string | null, updated_at: string, updated_by?: string | null, household_head?: { __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null } | null, household_members: Array<{ __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null }>, responsible_party?: { __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null } | null, dependents: Array<{ __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null, household_relationship?: string | null, patient?: { __typename?: 'patient', person_id: number, chart_no?: string | null } | null }>, patient?: { __typename?: 'patient', person_id: number, chart_no?: string | null, status: string, family_doctor_name?: string | null, family_doctor_phone?: string | null, imaging_id?: string | null, is_active: boolean, patient_referral: Array<{ __typename?: 'patient_referral', referral_kind: string, referral_other_text?: string | null, referral_source?: { __typename?: 'referral_source', id: number, name: string } | null, referral_contact_person?: { __typename?: 'person', id: number, first_name: string, last_name: string } | null }> } | null, person_contact_point: Array<{ __typename?: 'person_contact_point', id: number, kind: string, label?: string | null, value: any, is_primary: boolean }>, mailing_address?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string, country: string } | null, billing_address?: { __typename?: 'address', id: number, line1: string, line2?: string | null, city: string, region: string, postal_code: string, country: string } | null }>, patient_financial: Array<{ __typename?: 'patient_financial', patient_person_id: number }> };

export type SearchPatientsQueryVariables = Exact<{
  where: Person_Bool_Exp;
  limit: Scalars['Int']['input'];
}>;


export type SearchPatientsQuery = { __typename?: 'query_root', person: Array<{ __typename?: 'person', id: number, household_head_id?: number | null, responsible_party_id?: number | null, first_name: string, last_name: string, preferred_name?: string | null, dob?: any | null, household_head?: { __typename?: 'person', id: number, first_name: string, last_name: string, preferred_name?: string | null } | null, patient?: { __typename?: 'patient', status: string, chart_no?: string | null } | null, person_contact_point: Array<{ __typename?: 'person_contact_point', value: any }> }> };

export type GetPersonsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Person_Order_By> | Person_Order_By>;
  where: Person_Bool_Exp;
}>;


export type GetPersonsQuery = { __typename?: 'query_root', person: Array<{ __typename?: 'person', id: number, clinic_id: number, first_name: string, last_name: string, preferred_name?: string | null, dob?: any | null, gender?: string | null, preferred_language?: string | null, is_active: boolean, created_at: string, created_by?: string | null, updated_at: string, updated_by?: string | null, patient?: { __typename?: 'patient', patient_referral: Array<{ __typename?: 'patient_referral', referral_kind: string, referral_other_text?: string | null, referral_source?: { __typename?: 'referral_source', name: string } | null, referral_contact_person?: { __typename?: 'person', id: number, first_name: string, last_name: string } | null }> } | null }>, person_aggregate: { __typename?: 'person_aggregate', aggregate?: { __typename?: 'person_aggregate_fields', count: number } | null } };

export type GetReferralKindEnumQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReferralKindEnumQuery = { __typename?: 'query_root', referral_kind_enum: Array<{ __typename?: 'referral_kind_enum', value: string, comment: string }> };

export type GetReferralSourcesQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetReferralSourcesQuery = { __typename?: 'query_root', referral_source: Array<{ __typename?: 'referral_source', id: number, name: string, clinic_id: number, is_active: boolean }> };

export type GetPatientReferralQueryVariables = Exact<{
  patientPersonId: Scalars['bigint']['input'];
}>;


export type GetPatientReferralQuery = { __typename?: 'query_root', patient_referral: Array<{ __typename?: 'patient_referral', patient_person_id: number, referral_kind: string, referral_source_id?: number | null, referral_contact_person_id?: number | null, referral_other_text?: string | null, referral_source?: { __typename?: 'referral_source', id: number, name: string } | null, referral_contact_person?: { __typename?: 'person', id: number, first_name: string, last_name: string } | null }> };

export type CreateReferralSourceMutationVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateReferralSourceMutation = { __typename?: 'mutation_root', insert_referral_source_one?: { __typename?: 'referral_source', id: number, name: string, clinic_id: number } | null };

export type UpdateReferralSourceMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateReferralSourceMutation = { __typename?: 'mutation_root', update_referral_source_by_pk?: { __typename?: 'referral_source', id: number, name: string, is_active: boolean } | null };

export type DeleteReferralSourceMutationVariables = Exact<{
  id: Scalars['bigint']['input'];
}>;


export type DeleteReferralSourceMutation = { __typename?: 'mutation_root', update_referral_source_by_pk?: { __typename?: 'referral_source', id: number, is_active: boolean } | null };

export type UpsertPatientReferralMutationVariables = Exact<{
  patientPersonId: Scalars['bigint']['input'];
  referralKind: Scalars['String']['input'];
  referralSourceId?: InputMaybe<Scalars['bigint']['input']>;
  referralContactPersonId?: InputMaybe<Scalars['bigint']['input']>;
  referralOtherText?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpsertPatientReferralMutation = { __typename?: 'mutation_root', insert_patient_referral_one?: { __typename?: 'patient_referral', patient_person_id: number, referral_kind: string, referral_source_id?: number | null, referral_contact_person_id?: number | null, referral_other_text?: string | null } | null };

export type DeletePatientReferralMutationVariables = Exact<{
  patientPersonId: Scalars['bigint']['input'];
}>;


export type DeletePatientReferralMutation = { __typename?: 'mutation_root', delete_patient_referral_by_pk?: { __typename?: 'patient_referral', patient_person_id: number } | null };

export type GetRolesQueryVariables = Exact<{
  clinicId: Scalars['bigint']['input'];
}>;


export type GetRolesQuery = { __typename?: 'query_root', role_v: Array<{ __typename?: 'role_v', id?: number | null, name?: string | null, description?: string | null, clinic_id?: number | null, is_active?: boolean | null }> };

export type GetCapabilitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCapabilitiesQuery = { __typename?: 'query_root', capability: Array<{ __typename?: 'capability', value: string, comment: string }> };

export type GetRoleCapabilitiesQueryVariables = Exact<{
  roleId: Scalars['bigint']['input'];
}>;


export type GetRoleCapabilitiesQuery = { __typename?: 'query_root', role_capability: Array<{ __typename?: 'role_capability', capability_key: Capability_Enum, role_id: number }> };

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
  capabilityKey: Capability_Enum;
}>;


export type AddCapabilityToRoleMutation = { __typename?: 'mutation_root', insert_role_capability_one?: { __typename?: 'role_capability', role_id: number, capability_key: Capability_Enum } | null };

export type RemoveCapabilityFromRoleMutationVariables = Exact<{
  roleId: Scalars['bigint']['input'];
  capabilityKey: Capability_Enum;
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
    query GetUserEffectiveCapabilities($clinicId: bigint!, $userId: uuid!) {
  clinic_user_effective_capabilities_v(
    where: {clinic_id: {_eq: $clinicId}, user_id: {_eq: $userId}}
  ) {
    capability_key
    clinic_id
    user_id
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
 *      clinicId: // value for 'clinicId'
 *      userId: // value for 'userId'
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
export const CreatePatientWithRelationsDocument = gql`
    mutation CreatePatientWithRelations($clinicId: bigint!, $firstName: String!, $lastName: String!, $preferredName: String, $dob: date, $gender: String, $preferredLanguage: String, $householdHeadId: bigint, $householdRelationship: String, $responsiblePartyId: bigint, $chartNo: String, $status: String!, $familyDoctorName: String, $familyDoctorPhone: String, $imagingId: String, $contactPoints: [person_contact_point_insert_input!]!, $mailingAddressId: bigint, $billingAddressId: bigint) {
  insert_person_one(
    object: {clinic_id: $clinicId, first_name: $firstName, last_name: $lastName, preferred_name: $preferredName, dob: $dob, gender: $gender, preferred_language: $preferredLanguage, household_head_id: $householdHeadId, household_relationship: $householdRelationship, responsible_party_id: $responsiblePartyId, mailing_address_id: $mailingAddressId, billing_address_id: $billingAddressId, patient: {data: {chart_no: $chartNo, status: $status, family_doctor_name: $familyDoctorName, family_doctor_phone: $familyDoctorPhone, imaging_id: $imagingId}}, person_contact_point: {data: $contactPoints}}
  ) {
    id
    clinic_id
    first_name
    last_name
    preferred_name
    household_head_id
    household_relationship
    responsible_party_id
    patient {
      person_id
      chart_no
      status
    }
    person_contact_point {
      id
      kind
      value
    }
    mailing_address {
      id
      line1
      line2
      city
      region
      postal_code
    }
    billing_address {
      id
      line1
      line2
      city
      region
      postal_code
    }
  }
}
    `;
export type CreatePatientWithRelationsMutationFn = ApolloReactCommon.MutationFunction<CreatePatientWithRelationsMutation, CreatePatientWithRelationsMutationVariables>;

/**
 * __useCreatePatientWithRelationsMutation__
 *
 * To run a mutation, you first call `useCreatePatientWithRelationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePatientWithRelationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPatientWithRelationsMutation, { data, loading, error }] = useCreatePatientWithRelationsMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      preferredName: // value for 'preferredName'
 *      dob: // value for 'dob'
 *      gender: // value for 'gender'
 *      preferredLanguage: // value for 'preferredLanguage'
 *      householdHeadId: // value for 'householdHeadId'
 *      householdRelationship: // value for 'householdRelationship'
 *      responsiblePartyId: // value for 'responsiblePartyId'
 *      chartNo: // value for 'chartNo'
 *      status: // value for 'status'
 *      familyDoctorName: // value for 'familyDoctorName'
 *      familyDoctorPhone: // value for 'familyDoctorPhone'
 *      imagingId: // value for 'imagingId'
 *      contactPoints: // value for 'contactPoints'
 *      mailingAddressId: // value for 'mailingAddressId'
 *      billingAddressId: // value for 'billingAddressId'
 *   },
 * });
 */
export function useCreatePatientWithRelationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePatientWithRelationsMutation, CreatePatientWithRelationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePatientWithRelationsMutation, CreatePatientWithRelationsMutationVariables>(CreatePatientWithRelationsDocument, options);
      }
export type CreatePatientWithRelationsMutationHookResult = ReturnType<typeof useCreatePatientWithRelationsMutation>;
export type CreatePatientWithRelationsMutationResult = ApolloReactCommon.MutationResult<CreatePatientWithRelationsMutation>;
export type CreatePatientWithRelationsMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePatientWithRelationsMutation, CreatePatientWithRelationsMutationVariables>;
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
export const GetGenderEnumDocument = gql`
    query GetGenderEnum {
  gender_enum(order_by: {value: asc}) {
    value
    comment
  }
}
    `;

/**
 * __useGetGenderEnumQuery__
 *
 * To run a query within a React component, call `useGetGenderEnumQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGenderEnumQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGenderEnumQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGenderEnumQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetGenderEnumQuery, GetGenderEnumQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGenderEnumQuery, GetGenderEnumQueryVariables>(GetGenderEnumDocument, options);
      }
export function useGetGenderEnumLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGenderEnumQuery, GetGenderEnumQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGenderEnumQuery, GetGenderEnumQueryVariables>(GetGenderEnumDocument, options);
        }
// @ts-ignore
export function useGetGenderEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetGenderEnumQuery, GetGenderEnumQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetGenderEnumQuery, GetGenderEnumQueryVariables>;
export function useGetGenderEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetGenderEnumQuery, GetGenderEnumQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetGenderEnumQuery | undefined, GetGenderEnumQueryVariables>;
export function useGetGenderEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetGenderEnumQuery, GetGenderEnumQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetGenderEnumQuery, GetGenderEnumQueryVariables>(GetGenderEnumDocument, options);
        }
export type GetGenderEnumQueryHookResult = ReturnType<typeof useGetGenderEnumQuery>;
export type GetGenderEnumLazyQueryHookResult = ReturnType<typeof useGetGenderEnumLazyQuery>;
export type GetGenderEnumSuspenseQueryHookResult = ReturnType<typeof useGetGenderEnumSuspenseQuery>;
export type GetGenderEnumQueryResult = ApolloReactCommon.QueryResult<GetGenderEnumQuery, GetGenderEnumQueryVariables>;
export const GetFamilyRootDocument = gql`
    query GetFamilyRoot($personId: bigint!) {
  family_group_v(where: {person_id: {_eq: $personId}}, limit: 1) {
    family_root_person_id
  }
}
    `;

/**
 * __useGetFamilyRootQuery__
 *
 * To run a query within a React component, call `useGetFamilyRootQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFamilyRootQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFamilyRootQuery({
 *   variables: {
 *      personId: // value for 'personId'
 *   },
 * });
 */
export function useGetFamilyRootQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetFamilyRootQuery, GetFamilyRootQueryVariables> & ({ variables: GetFamilyRootQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFamilyRootQuery, GetFamilyRootQueryVariables>(GetFamilyRootDocument, options);
      }
export function useGetFamilyRootLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFamilyRootQuery, GetFamilyRootQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFamilyRootQuery, GetFamilyRootQueryVariables>(GetFamilyRootDocument, options);
        }
// @ts-ignore
export function useGetFamilyRootSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetFamilyRootQuery, GetFamilyRootQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetFamilyRootQuery, GetFamilyRootQueryVariables>;
export function useGetFamilyRootSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFamilyRootQuery, GetFamilyRootQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetFamilyRootQuery | undefined, GetFamilyRootQueryVariables>;
export function useGetFamilyRootSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFamilyRootQuery, GetFamilyRootQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetFamilyRootQuery, GetFamilyRootQueryVariables>(GetFamilyRootDocument, options);
        }
export type GetFamilyRootQueryHookResult = ReturnType<typeof useGetFamilyRootQuery>;
export type GetFamilyRootLazyQueryHookResult = ReturnType<typeof useGetFamilyRootLazyQuery>;
export type GetFamilyRootSuspenseQueryHookResult = ReturnType<typeof useGetFamilyRootSuspenseQuery>;
export type GetFamilyRootQueryResult = ApolloReactCommon.QueryResult<GetFamilyRootQuery, GetFamilyRootQueryVariables>;
export const GetFamilyMembersDocument = gql`
    query GetFamilyMembers($familyRootPersonId: bigint!, $clinicId: bigint!) {
  rootPerson: person(
    where: {id: {_eq: $familyRootPersonId}, clinic_id: {_eq: $clinicId}}
  ) {
    id
    first_name
    last_name
    preferred_name
    dob
    household_relationship
    patient {
      person_id
      chart_no
    }
  }
  dependents: person(
    where: {responsible_party_id: {_eq: $familyRootPersonId}, clinic_id: {_eq: $clinicId}, is_active: {_eq: true}}
  ) {
    id
    first_name
    last_name
    preferred_name
    dob
    household_relationship
    patient {
      person_id
      chart_no
    }
  }
}
    `;

/**
 * __useGetFamilyMembersQuery__
 *
 * To run a query within a React component, call `useGetFamilyMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFamilyMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFamilyMembersQuery({
 *   variables: {
 *      familyRootPersonId: // value for 'familyRootPersonId'
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetFamilyMembersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables> & ({ variables: GetFamilyMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>(GetFamilyMembersDocument, options);
      }
export function useGetFamilyMembersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>(GetFamilyMembersDocument, options);
        }
// @ts-ignore
export function useGetFamilyMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>;
export function useGetFamilyMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetFamilyMembersQuery | undefined, GetFamilyMembersQueryVariables>;
export function useGetFamilyMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>(GetFamilyMembersDocument, options);
        }
export type GetFamilyMembersQueryHookResult = ReturnType<typeof useGetFamilyMembersQuery>;
export type GetFamilyMembersLazyQueryHookResult = ReturnType<typeof useGetFamilyMembersLazyQuery>;
export type GetFamilyMembersSuspenseQueryHookResult = ReturnType<typeof useGetFamilyMembersSuspenseQuery>;
export type GetFamilyMembersQueryResult = ApolloReactCommon.QueryResult<GetFamilyMembersQuery, GetFamilyMembersQueryVariables>;
export const GetHouseholdMembersDocument = gql`
    query GetHouseholdMembers($householdHeadPersonId: bigint!, $clinicId: bigint!) {
  householdHead: person(
    where: {id: {_eq: $householdHeadPersonId}, clinic_id: {_eq: $clinicId}}
  ) {
    id
    first_name
    last_name
    preferred_name
    dob
    household_relationship
    patient {
      person_id
      chart_no
    }
  }
  householdMembers: person(
    where: {household_head_id: {_eq: $householdHeadPersonId}, clinic_id: {_eq: $clinicId}, is_active: {_eq: true}}
  ) {
    id
    first_name
    last_name
    preferred_name
    dob
    household_relationship
    patient {
      person_id
      chart_no
    }
  }
}
    `;

/**
 * __useGetHouseholdMembersQuery__
 *
 * To run a query within a React component, call `useGetHouseholdMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHouseholdMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHouseholdMembersQuery({
 *   variables: {
 *      householdHeadPersonId: // value for 'householdHeadPersonId'
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetHouseholdMembersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables> & ({ variables: GetHouseholdMembersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>(GetHouseholdMembersDocument, options);
      }
export function useGetHouseholdMembersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>(GetHouseholdMembersDocument, options);
        }
// @ts-ignore
export function useGetHouseholdMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>;
export function useGetHouseholdMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetHouseholdMembersQuery | undefined, GetHouseholdMembersQueryVariables>;
export function useGetHouseholdMembersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>(GetHouseholdMembersDocument, options);
        }
export type GetHouseholdMembersQueryHookResult = ReturnType<typeof useGetHouseholdMembersQuery>;
export type GetHouseholdMembersLazyQueryHookResult = ReturnType<typeof useGetHouseholdMembersLazyQuery>;
export type GetHouseholdMembersSuspenseQueryHookResult = ReturnType<typeof useGetHouseholdMembersSuspenseQuery>;
export type GetHouseholdMembersQueryResult = ApolloReactCommon.QueryResult<GetHouseholdMembersQuery, GetHouseholdMembersQueryVariables>;
export const UpdatePersonResponsiblePartyDocument = gql`
    mutation UpdatePersonResponsibleParty($personId: bigint!, $responsiblePartyId: bigint, $householdRelationship: String) {
  update_person_by_pk(
    pk_columns: {id: $personId}
    _set: {responsible_party_id: $responsiblePartyId, household_relationship: $householdRelationship}
  ) {
    id
    responsible_party_id
    household_relationship
  }
}
    `;
export type UpdatePersonResponsiblePartyMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonResponsiblePartyMutation, UpdatePersonResponsiblePartyMutationVariables>;

/**
 * __useUpdatePersonResponsiblePartyMutation__
 *
 * To run a mutation, you first call `useUpdatePersonResponsiblePartyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonResponsiblePartyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonResponsiblePartyMutation, { data, loading, error }] = useUpdatePersonResponsiblePartyMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      responsiblePartyId: // value for 'responsiblePartyId'
 *      householdRelationship: // value for 'householdRelationship'
 *   },
 * });
 */
export function useUpdatePersonResponsiblePartyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonResponsiblePartyMutation, UpdatePersonResponsiblePartyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonResponsiblePartyMutation, UpdatePersonResponsiblePartyMutationVariables>(UpdatePersonResponsiblePartyDocument, options);
      }
export type UpdatePersonResponsiblePartyMutationHookResult = ReturnType<typeof useUpdatePersonResponsiblePartyMutation>;
export type UpdatePersonResponsiblePartyMutationResult = ApolloReactCommon.MutationResult<UpdatePersonResponsiblePartyMutation>;
export type UpdatePersonResponsiblePartyMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonResponsiblePartyMutation, UpdatePersonResponsiblePartyMutationVariables>;
export const SearchFamilyRootsDocument = gql`
    query SearchFamilyRoots($clinicId: bigint!, $searchTerm: String!) {
  person(
    where: {clinic_id: {_eq: $clinicId}, is_active: {_eq: true}, responsible_party_id: {_is_null: true}, _or: [{first_name: {_ilike: $searchTerm}}, {last_name: {_ilike: $searchTerm}}, {preferred_name: {_ilike: $searchTerm}}]}
    limit: 10
    order_by: {last_name: asc, first_name: asc}
  ) {
    id
    first_name
    last_name
    preferred_name
    responsible_party_id
    person_contact_point(
      where: {is_primary: {_eq: true}, is_active: {_eq: true}}
      limit: 1
    ) {
      value
      kind
    }
  }
}
    `;

/**
 * __useSearchFamilyRootsQuery__
 *
 * To run a query within a React component, call `useSearchFamilyRootsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchFamilyRootsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchFamilyRootsQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useSearchFamilyRootsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables> & ({ variables: SearchFamilyRootsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>(SearchFamilyRootsDocument, options);
      }
export function useSearchFamilyRootsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>(SearchFamilyRootsDocument, options);
        }
// @ts-ignore
export function useSearchFamilyRootsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>;
export function useSearchFamilyRootsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchFamilyRootsQuery | undefined, SearchFamilyRootsQueryVariables>;
export function useSearchFamilyRootsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>(SearchFamilyRootsDocument, options);
        }
export type SearchFamilyRootsQueryHookResult = ReturnType<typeof useSearchFamilyRootsQuery>;
export type SearchFamilyRootsLazyQueryHookResult = ReturnType<typeof useSearchFamilyRootsLazyQuery>;
export type SearchFamilyRootsSuspenseQueryHookResult = ReturnType<typeof useSearchFamilyRootsSuspenseQuery>;
export type SearchFamilyRootsQueryResult = ApolloReactCommon.QueryResult<SearchFamilyRootsQuery, SearchFamilyRootsQueryVariables>;
export const UpsertPatientFinancialDocument = gql`
    mutation UpsertPatientFinancial($patientPersonId: bigint!) {
  insert_patient_financial_one(
    object: {patient_person_id: $patientPersonId, is_active: true}
    on_conflict: {constraint: patient_financial_pkey, update_columns: [is_active]}
  ) {
    patient_person_id
    is_active
  }
}
    `;
export type UpsertPatientFinancialMutationFn = ApolloReactCommon.MutationFunction<UpsertPatientFinancialMutation, UpsertPatientFinancialMutationVariables>;

/**
 * __useUpsertPatientFinancialMutation__
 *
 * To run a mutation, you first call `useUpsertPatientFinancialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPatientFinancialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPatientFinancialMutation, { data, loading, error }] = useUpsertPatientFinancialMutation({
 *   variables: {
 *      patientPersonId: // value for 'patientPersonId'
 *   },
 * });
 */
export function useUpsertPatientFinancialMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpsertPatientFinancialMutation, UpsertPatientFinancialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpsertPatientFinancialMutation, UpsertPatientFinancialMutationVariables>(UpsertPatientFinancialDocument, options);
      }
export type UpsertPatientFinancialMutationHookResult = ReturnType<typeof useUpsertPatientFinancialMutation>;
export type UpsertPatientFinancialMutationResult = ApolloReactCommon.MutationResult<UpsertPatientFinancialMutation>;
export type UpsertPatientFinancialMutationOptions = ApolloReactCommon.BaseMutationOptions<UpsertPatientFinancialMutation, UpsertPatientFinancialMutationVariables>;
export const UpdatePersonHouseholdHeadDocument = gql`
    mutation UpdatePersonHouseholdHead($personId: bigint!, $householdHeadId: bigint, $householdRelationship: String) {
  update_person_by_pk(
    pk_columns: {id: $personId}
    _set: {household_head_id: $householdHeadId, household_relationship: $householdRelationship}
  ) {
    id
    household_head_id
    household_relationship
    household_head {
      id
      first_name
      last_name
      preferred_name
    }
  }
}
    `;
export type UpdatePersonHouseholdHeadMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonHouseholdHeadMutation, UpdatePersonHouseholdHeadMutationVariables>;

/**
 * __useUpdatePersonHouseholdHeadMutation__
 *
 * To run a mutation, you first call `useUpdatePersonHouseholdHeadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonHouseholdHeadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonHouseholdHeadMutation, { data, loading, error }] = useUpdatePersonHouseholdHeadMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      householdHeadId: // value for 'householdHeadId'
 *      householdRelationship: // value for 'householdRelationship'
 *   },
 * });
 */
export function useUpdatePersonHouseholdHeadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonHouseholdHeadMutation, UpdatePersonHouseholdHeadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonHouseholdHeadMutation, UpdatePersonHouseholdHeadMutationVariables>(UpdatePersonHouseholdHeadDocument, options);
      }
export type UpdatePersonHouseholdHeadMutationHookResult = ReturnType<typeof useUpdatePersonHouseholdHeadMutation>;
export type UpdatePersonHouseholdHeadMutationResult = ApolloReactCommon.MutationResult<UpdatePersonHouseholdHeadMutation>;
export type UpdatePersonHouseholdHeadMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonHouseholdHeadMutation, UpdatePersonHouseholdHeadMutationVariables>;
export const SearchHouseholdHeadsDocument = gql`
    query SearchHouseholdHeads($clinicId: bigint!, $searchTerm: String!, $limit: Int) {
  fn_search_household_heads(
    args: {p_clinic_id: $clinicId, p_query: $searchTerm, p_limit: $limit}
  ) {
    person_id
    clinic_id
    display_name
    first_name
    last_name
    preferred_name
    household_head_id
    rank_score
  }
}
    `;

/**
 * __useSearchHouseholdHeadsQuery__
 *
 * To run a query within a React component, call `useSearchHouseholdHeadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchHouseholdHeadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchHouseholdHeadsQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      searchTerm: // value for 'searchTerm'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchHouseholdHeadsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables> & ({ variables: SearchHouseholdHeadsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>(SearchHouseholdHeadsDocument, options);
      }
export function useSearchHouseholdHeadsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>(SearchHouseholdHeadsDocument, options);
        }
// @ts-ignore
export function useSearchHouseholdHeadsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>;
export function useSearchHouseholdHeadsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchHouseholdHeadsQuery | undefined, SearchHouseholdHeadsQueryVariables>;
export function useSearchHouseholdHeadsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>(SearchHouseholdHeadsDocument, options);
        }
export type SearchHouseholdHeadsQueryHookResult = ReturnType<typeof useSearchHouseholdHeadsQuery>;
export type SearchHouseholdHeadsLazyQueryHookResult = ReturnType<typeof useSearchHouseholdHeadsLazyQuery>;
export type SearchHouseholdHeadsSuspenseQueryHookResult = ReturnType<typeof useSearchHouseholdHeadsSuspenseQuery>;
export type SearchHouseholdHeadsQueryResult = ApolloReactCommon.QueryResult<SearchHouseholdHeadsQuery, SearchHouseholdHeadsQueryVariables>;
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
export const GetPatientFieldConfigDocument = gql`
    query GetPatientFieldConfig($clinicId: bigint!) {
  patient_field_config(
    where: {clinic_id: {_eq: $clinicId}, is_active: {_eq: true}}
    order_by: {display_order: asc}
  ) {
    id
    clinic_id
    field_key
    field_label
    display_order
    is_displayed
    is_required
    is_active
  }
}
    `;

/**
 * __useGetPatientFieldConfigQuery__
 *
 * To run a query within a React component, call `useGetPatientFieldConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientFieldConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientFieldConfigQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetPatientFieldConfigQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables> & ({ variables: GetPatientFieldConfigQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>(GetPatientFieldConfigDocument, options);
      }
export function useGetPatientFieldConfigLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>(GetPatientFieldConfigDocument, options);
        }
// @ts-ignore
export function useGetPatientFieldConfigSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>;
export function useGetPatientFieldConfigSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPatientFieldConfigQuery | undefined, GetPatientFieldConfigQueryVariables>;
export function useGetPatientFieldConfigSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>(GetPatientFieldConfigDocument, options);
        }
export type GetPatientFieldConfigQueryHookResult = ReturnType<typeof useGetPatientFieldConfigQuery>;
export type GetPatientFieldConfigLazyQueryHookResult = ReturnType<typeof useGetPatientFieldConfigLazyQuery>;
export type GetPatientFieldConfigSuspenseQueryHookResult = ReturnType<typeof useGetPatientFieldConfigSuspenseQuery>;
export type GetPatientFieldConfigQueryResult = ApolloReactCommon.QueryResult<GetPatientFieldConfigQuery, GetPatientFieldConfigQueryVariables>;
export const UpdatePatientFieldConfigDocument = gql`
    mutation UpdatePatientFieldConfig($id: bigint!, $fieldLabel: String, $displayOrder: Int, $isDisplayed: Boolean, $isRequired: Boolean) {
  update_patient_field_config_by_pk(
    pk_columns: {id: $id}
    _set: {field_label: $fieldLabel, display_order: $displayOrder, is_displayed: $isDisplayed, is_required: $isRequired}
  ) {
    id
    field_key
    field_label
    display_order
    is_displayed
    is_required
  }
}
    `;
export type UpdatePatientFieldConfigMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientFieldConfigMutation, UpdatePatientFieldConfigMutationVariables>;

/**
 * __useUpdatePatientFieldConfigMutation__
 *
 * To run a mutation, you first call `useUpdatePatientFieldConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientFieldConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientFieldConfigMutation, { data, loading, error }] = useUpdatePatientFieldConfigMutation({
 *   variables: {
 *      id: // value for 'id'
 *      fieldLabel: // value for 'fieldLabel'
 *      displayOrder: // value for 'displayOrder'
 *      isDisplayed: // value for 'isDisplayed'
 *      isRequired: // value for 'isRequired'
 *   },
 * });
 */
export function useUpdatePatientFieldConfigMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientFieldConfigMutation, UpdatePatientFieldConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientFieldConfigMutation, UpdatePatientFieldConfigMutationVariables>(UpdatePatientFieldConfigDocument, options);
      }
export type UpdatePatientFieldConfigMutationHookResult = ReturnType<typeof useUpdatePatientFieldConfigMutation>;
export type UpdatePatientFieldConfigMutationResult = ApolloReactCommon.MutationResult<UpdatePatientFieldConfigMutation>;
export type UpdatePatientFieldConfigMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientFieldConfigMutation, UpdatePatientFieldConfigMutationVariables>;
export const UpdatePatientFieldConfigOrderDocument = gql`
    mutation UpdatePatientFieldConfigOrder($id: bigint!, $displayOrder: Int!) {
  update_patient_field_config_by_pk(
    pk_columns: {id: $id}
    _set: {display_order: $displayOrder}
  ) {
    id
    display_order
  }
}
    `;
export type UpdatePatientFieldConfigOrderMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientFieldConfigOrderMutation, UpdatePatientFieldConfigOrderMutationVariables>;

/**
 * __useUpdatePatientFieldConfigOrderMutation__
 *
 * To run a mutation, you first call `useUpdatePatientFieldConfigOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientFieldConfigOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientFieldConfigOrderMutation, { data, loading, error }] = useUpdatePatientFieldConfigOrderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      displayOrder: // value for 'displayOrder'
 *   },
 * });
 */
export function useUpdatePatientFieldConfigOrderMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientFieldConfigOrderMutation, UpdatePatientFieldConfigOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientFieldConfigOrderMutation, UpdatePatientFieldConfigOrderMutationVariables>(UpdatePatientFieldConfigOrderDocument, options);
      }
export type UpdatePatientFieldConfigOrderMutationHookResult = ReturnType<typeof useUpdatePatientFieldConfigOrderMutation>;
export type UpdatePatientFieldConfigOrderMutationResult = ApolloReactCommon.MutationResult<UpdatePatientFieldConfigOrderMutation>;
export type UpdatePatientFieldConfigOrderMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientFieldConfigOrderMutation, UpdatePatientFieldConfigOrderMutationVariables>;
export const UpdatePatientFieldConfigDisplayDocument = gql`
    mutation UpdatePatientFieldConfigDisplay($id: bigint!, $isDisplayed: Boolean!) {
  update_patient_field_config_by_pk(
    pk_columns: {id: $id}
    _set: {is_displayed: $isDisplayed}
  ) {
    id
    is_displayed
  }
}
    `;
export type UpdatePatientFieldConfigDisplayMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientFieldConfigDisplayMutation, UpdatePatientFieldConfigDisplayMutationVariables>;

/**
 * __useUpdatePatientFieldConfigDisplayMutation__
 *
 * To run a mutation, you first call `useUpdatePatientFieldConfigDisplayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientFieldConfigDisplayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientFieldConfigDisplayMutation, { data, loading, error }] = useUpdatePatientFieldConfigDisplayMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isDisplayed: // value for 'isDisplayed'
 *   },
 * });
 */
export function useUpdatePatientFieldConfigDisplayMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientFieldConfigDisplayMutation, UpdatePatientFieldConfigDisplayMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientFieldConfigDisplayMutation, UpdatePatientFieldConfigDisplayMutationVariables>(UpdatePatientFieldConfigDisplayDocument, options);
      }
export type UpdatePatientFieldConfigDisplayMutationHookResult = ReturnType<typeof useUpdatePatientFieldConfigDisplayMutation>;
export type UpdatePatientFieldConfigDisplayMutationResult = ApolloReactCommon.MutationResult<UpdatePatientFieldConfigDisplayMutation>;
export type UpdatePatientFieldConfigDisplayMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientFieldConfigDisplayMutation, UpdatePatientFieldConfigDisplayMutationVariables>;
export const UpdatePatientFieldConfigRequiredDocument = gql`
    mutation UpdatePatientFieldConfigRequired($id: bigint!, $isRequired: Boolean!) {
  update_patient_field_config_by_pk(
    pk_columns: {id: $id}
    _set: {is_required: $isRequired}
  ) {
    id
    is_required
  }
}
    `;
export type UpdatePatientFieldConfigRequiredMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientFieldConfigRequiredMutation, UpdatePatientFieldConfigRequiredMutationVariables>;

/**
 * __useUpdatePatientFieldConfigRequiredMutation__
 *
 * To run a mutation, you first call `useUpdatePatientFieldConfigRequiredMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientFieldConfigRequiredMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientFieldConfigRequiredMutation, { data, loading, error }] = useUpdatePatientFieldConfigRequiredMutation({
 *   variables: {
 *      id: // value for 'id'
 *      isRequired: // value for 'isRequired'
 *   },
 * });
 */
export function useUpdatePatientFieldConfigRequiredMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientFieldConfigRequiredMutation, UpdatePatientFieldConfigRequiredMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientFieldConfigRequiredMutation, UpdatePatientFieldConfigRequiredMutationVariables>(UpdatePatientFieldConfigRequiredDocument, options);
      }
export type UpdatePatientFieldConfigRequiredMutationHookResult = ReturnType<typeof useUpdatePatientFieldConfigRequiredMutation>;
export type UpdatePatientFieldConfigRequiredMutationResult = ApolloReactCommon.MutationResult<UpdatePatientFieldConfigRequiredMutation>;
export type UpdatePatientFieldConfigRequiredMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientFieldConfigRequiredMutation, UpdatePatientFieldConfigRequiredMutationVariables>;
export const CreatePersonDocument = gql`
    mutation CreatePerson($clinicId: bigint!, $firstName: String!, $lastName: String!, $preferredName: String, $dob: date, $gender: String, $preferredLanguage: String) {
  insert_person_one(
    object: {clinic_id: $clinicId, first_name: $firstName, last_name: $lastName, preferred_name: $preferredName, dob: $dob, gender: $gender, preferred_language: $preferredLanguage}
  ) {
    id
    clinic_id
    first_name
    last_name
  }
}
    `;
export type CreatePersonMutationFn = ApolloReactCommon.MutationFunction<CreatePersonMutation, CreatePersonMutationVariables>;

/**
 * __useCreatePersonMutation__
 *
 * To run a mutation, you first call `useCreatePersonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePersonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPersonMutation, { data, loading, error }] = useCreatePersonMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      preferredName: // value for 'preferredName'
 *      dob: // value for 'dob'
 *      gender: // value for 'gender'
 *      preferredLanguage: // value for 'preferredLanguage'
 *   },
 * });
 */
export function useCreatePersonMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePersonMutation, CreatePersonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePersonMutation, CreatePersonMutationVariables>(CreatePersonDocument, options);
      }
export type CreatePersonMutationHookResult = ReturnType<typeof useCreatePersonMutation>;
export type CreatePersonMutationResult = ApolloReactCommon.MutationResult<CreatePersonMutation>;
export type CreatePersonMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePersonMutation, CreatePersonMutationVariables>;
export const CreatePatientDocument = gql`
    mutation CreatePatient($personId: bigint!, $chartNo: String, $status: String!, $familyDoctorName: String, $familyDoctorPhone: String, $imagingId: String) {
  insert_patient_one(
    object: {person_id: $personId, chart_no: $chartNo, status: $status, family_doctor_name: $familyDoctorName, family_doctor_phone: $familyDoctorPhone, imaging_id: $imagingId}
  ) {
    person_id
    chart_no
    status
  }
}
    `;
export type CreatePatientMutationFn = ApolloReactCommon.MutationFunction<CreatePatientMutation, CreatePatientMutationVariables>;

/**
 * __useCreatePatientMutation__
 *
 * To run a mutation, you first call `useCreatePatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPatientMutation, { data, loading, error }] = useCreatePatientMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      chartNo: // value for 'chartNo'
 *      status: // value for 'status'
 *      familyDoctorName: // value for 'familyDoctorName'
 *      familyDoctorPhone: // value for 'familyDoctorPhone'
 *      imagingId: // value for 'imagingId'
 *   },
 * });
 */
export function useCreatePatientMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePatientMutation, CreatePatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePatientMutation, CreatePatientMutationVariables>(CreatePatientDocument, options);
      }
export type CreatePatientMutationHookResult = ReturnType<typeof useCreatePatientMutation>;
export type CreatePatientMutationResult = ApolloReactCommon.MutationResult<CreatePatientMutation>;
export type CreatePatientMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePatientMutation, CreatePatientMutationVariables>;
export const UpdatePersonFirstNameDocument = gql`
    mutation UpdatePersonFirstName($id: bigint!, $firstName: String!) {
  update_person_by_pk(pk_columns: {id: $id}, _set: {first_name: $firstName}) {
    id
    first_name
  }
}
    `;
export type UpdatePersonFirstNameMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonFirstNameMutation, UpdatePersonFirstNameMutationVariables>;

/**
 * __useUpdatePersonFirstNameMutation__
 *
 * To run a mutation, you first call `useUpdatePersonFirstNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonFirstNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonFirstNameMutation, { data, loading, error }] = useUpdatePersonFirstNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      firstName: // value for 'firstName'
 *   },
 * });
 */
export function useUpdatePersonFirstNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonFirstNameMutation, UpdatePersonFirstNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonFirstNameMutation, UpdatePersonFirstNameMutationVariables>(UpdatePersonFirstNameDocument, options);
      }
export type UpdatePersonFirstNameMutationHookResult = ReturnType<typeof useUpdatePersonFirstNameMutation>;
export type UpdatePersonFirstNameMutationResult = ApolloReactCommon.MutationResult<UpdatePersonFirstNameMutation>;
export type UpdatePersonFirstNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonFirstNameMutation, UpdatePersonFirstNameMutationVariables>;
export const UpdatePersonLastNameDocument = gql`
    mutation UpdatePersonLastName($id: bigint!, $lastName: String!) {
  update_person_by_pk(pk_columns: {id: $id}, _set: {last_name: $lastName}) {
    id
    last_name
  }
}
    `;
export type UpdatePersonLastNameMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonLastNameMutation, UpdatePersonLastNameMutationVariables>;

/**
 * __useUpdatePersonLastNameMutation__
 *
 * To run a mutation, you first call `useUpdatePersonLastNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonLastNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonLastNameMutation, { data, loading, error }] = useUpdatePersonLastNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useUpdatePersonLastNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonLastNameMutation, UpdatePersonLastNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonLastNameMutation, UpdatePersonLastNameMutationVariables>(UpdatePersonLastNameDocument, options);
      }
export type UpdatePersonLastNameMutationHookResult = ReturnType<typeof useUpdatePersonLastNameMutation>;
export type UpdatePersonLastNameMutationResult = ApolloReactCommon.MutationResult<UpdatePersonLastNameMutation>;
export type UpdatePersonLastNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonLastNameMutation, UpdatePersonLastNameMutationVariables>;
export const UpdatePersonPreferredNameDocument = gql`
    mutation UpdatePersonPreferredName($id: bigint!, $preferredName: String) {
  update_person_by_pk(
    pk_columns: {id: $id}
    _set: {preferred_name: $preferredName}
  ) {
    id
    preferred_name
  }
}
    `;
export type UpdatePersonPreferredNameMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonPreferredNameMutation, UpdatePersonPreferredNameMutationVariables>;

/**
 * __useUpdatePersonPreferredNameMutation__
 *
 * To run a mutation, you first call `useUpdatePersonPreferredNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonPreferredNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonPreferredNameMutation, { data, loading, error }] = useUpdatePersonPreferredNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      preferredName: // value for 'preferredName'
 *   },
 * });
 */
export function useUpdatePersonPreferredNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonPreferredNameMutation, UpdatePersonPreferredNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonPreferredNameMutation, UpdatePersonPreferredNameMutationVariables>(UpdatePersonPreferredNameDocument, options);
      }
export type UpdatePersonPreferredNameMutationHookResult = ReturnType<typeof useUpdatePersonPreferredNameMutation>;
export type UpdatePersonPreferredNameMutationResult = ApolloReactCommon.MutationResult<UpdatePersonPreferredNameMutation>;
export type UpdatePersonPreferredNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonPreferredNameMutation, UpdatePersonPreferredNameMutationVariables>;
export const UpdatePersonMiddleNameDocument = gql`
    mutation UpdatePersonMiddleName($id: bigint!, $middleName: String) {
  update_person_by_pk(pk_columns: {id: $id}, _set: {middle_name: $middleName}) {
    id
    middle_name
  }
}
    `;
export type UpdatePersonMiddleNameMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonMiddleNameMutation, UpdatePersonMiddleNameMutationVariables>;

/**
 * __useUpdatePersonMiddleNameMutation__
 *
 * To run a mutation, you first call `useUpdatePersonMiddleNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonMiddleNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonMiddleNameMutation, { data, loading, error }] = useUpdatePersonMiddleNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      middleName: // value for 'middleName'
 *   },
 * });
 */
export function useUpdatePersonMiddleNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonMiddleNameMutation, UpdatePersonMiddleNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonMiddleNameMutation, UpdatePersonMiddleNameMutationVariables>(UpdatePersonMiddleNameDocument, options);
      }
export type UpdatePersonMiddleNameMutationHookResult = ReturnType<typeof useUpdatePersonMiddleNameMutation>;
export type UpdatePersonMiddleNameMutationResult = ApolloReactCommon.MutationResult<UpdatePersonMiddleNameMutation>;
export type UpdatePersonMiddleNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonMiddleNameMutation, UpdatePersonMiddleNameMutationVariables>;
export const UpdatePersonDobDocument = gql`
    mutation UpdatePersonDob($id: bigint!, $dob: date) {
  update_person_by_pk(pk_columns: {id: $id}, _set: {dob: $dob}) {
    id
    dob
  }
}
    `;
export type UpdatePersonDobMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonDobMutation, UpdatePersonDobMutationVariables>;

/**
 * __useUpdatePersonDobMutation__
 *
 * To run a mutation, you first call `useUpdatePersonDobMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonDobMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonDobMutation, { data, loading, error }] = useUpdatePersonDobMutation({
 *   variables: {
 *      id: // value for 'id'
 *      dob: // value for 'dob'
 *   },
 * });
 */
export function useUpdatePersonDobMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonDobMutation, UpdatePersonDobMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonDobMutation, UpdatePersonDobMutationVariables>(UpdatePersonDobDocument, options);
      }
export type UpdatePersonDobMutationHookResult = ReturnType<typeof useUpdatePersonDobMutation>;
export type UpdatePersonDobMutationResult = ApolloReactCommon.MutationResult<UpdatePersonDobMutation>;
export type UpdatePersonDobMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonDobMutation, UpdatePersonDobMutationVariables>;
export const UpdatePersonPreferredLanguageDocument = gql`
    mutation UpdatePersonPreferredLanguage($id: bigint!, $preferredLanguage: String) {
  update_person_by_pk(
    pk_columns: {id: $id}
    _set: {preferred_language: $preferredLanguage}
  ) {
    id
    preferred_language
  }
}
    `;
export type UpdatePersonPreferredLanguageMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonPreferredLanguageMutation, UpdatePersonPreferredLanguageMutationVariables>;

/**
 * __useUpdatePersonPreferredLanguageMutation__
 *
 * To run a mutation, you first call `useUpdatePersonPreferredLanguageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonPreferredLanguageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonPreferredLanguageMutation, { data, loading, error }] = useUpdatePersonPreferredLanguageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      preferredLanguage: // value for 'preferredLanguage'
 *   },
 * });
 */
export function useUpdatePersonPreferredLanguageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonPreferredLanguageMutation, UpdatePersonPreferredLanguageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonPreferredLanguageMutation, UpdatePersonPreferredLanguageMutationVariables>(UpdatePersonPreferredLanguageDocument, options);
      }
export type UpdatePersonPreferredLanguageMutationHookResult = ReturnType<typeof useUpdatePersonPreferredLanguageMutation>;
export type UpdatePersonPreferredLanguageMutationResult = ApolloReactCommon.MutationResult<UpdatePersonPreferredLanguageMutation>;
export type UpdatePersonPreferredLanguageMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonPreferredLanguageMutation, UpdatePersonPreferredLanguageMutationVariables>;
export const UpdatePatientChartNoDocument = gql`
    mutation UpdatePatientChartNo($personId: bigint!, $chartNo: String) {
  update_patient_by_pk(
    pk_columns: {person_id: $personId}
    _set: {chart_no: $chartNo}
  ) {
    person_id
    chart_no
  }
}
    `;
export type UpdatePatientChartNoMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientChartNoMutation, UpdatePatientChartNoMutationVariables>;

/**
 * __useUpdatePatientChartNoMutation__
 *
 * To run a mutation, you first call `useUpdatePatientChartNoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientChartNoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientChartNoMutation, { data, loading, error }] = useUpdatePatientChartNoMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      chartNo: // value for 'chartNo'
 *   },
 * });
 */
export function useUpdatePatientChartNoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientChartNoMutation, UpdatePatientChartNoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientChartNoMutation, UpdatePatientChartNoMutationVariables>(UpdatePatientChartNoDocument, options);
      }
export type UpdatePatientChartNoMutationHookResult = ReturnType<typeof useUpdatePatientChartNoMutation>;
export type UpdatePatientChartNoMutationResult = ApolloReactCommon.MutationResult<UpdatePatientChartNoMutation>;
export type UpdatePatientChartNoMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientChartNoMutation, UpdatePatientChartNoMutationVariables>;
export const UpdatePatientStatusDocument = gql`
    mutation UpdatePatientStatus($personId: bigint!, $status: String!) {
  update_patient_by_pk(
    pk_columns: {person_id: $personId}
    _set: {status: $status}
  ) {
    person_id
    status
  }
}
    `;
export type UpdatePatientStatusMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientStatusMutation, UpdatePatientStatusMutationVariables>;

/**
 * __useUpdatePatientStatusMutation__
 *
 * To run a mutation, you first call `useUpdatePatientStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientStatusMutation, { data, loading, error }] = useUpdatePatientStatusMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useUpdatePatientStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientStatusMutation, UpdatePatientStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientStatusMutation, UpdatePatientStatusMutationVariables>(UpdatePatientStatusDocument, options);
      }
export type UpdatePatientStatusMutationHookResult = ReturnType<typeof useUpdatePatientStatusMutation>;
export type UpdatePatientStatusMutationResult = ApolloReactCommon.MutationResult<UpdatePatientStatusMutation>;
export type UpdatePatientStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientStatusMutation, UpdatePatientStatusMutationVariables>;
export const UpdatePatientFamilyDoctorNameDocument = gql`
    mutation UpdatePatientFamilyDoctorName($personId: bigint!, $familyDoctorName: String) {
  update_patient_by_pk(
    pk_columns: {person_id: $personId}
    _set: {family_doctor_name: $familyDoctorName}
  ) {
    person_id
    family_doctor_name
  }
}
    `;
export type UpdatePatientFamilyDoctorNameMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientFamilyDoctorNameMutation, UpdatePatientFamilyDoctorNameMutationVariables>;

/**
 * __useUpdatePatientFamilyDoctorNameMutation__
 *
 * To run a mutation, you first call `useUpdatePatientFamilyDoctorNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientFamilyDoctorNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientFamilyDoctorNameMutation, { data, loading, error }] = useUpdatePatientFamilyDoctorNameMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      familyDoctorName: // value for 'familyDoctorName'
 *   },
 * });
 */
export function useUpdatePatientFamilyDoctorNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientFamilyDoctorNameMutation, UpdatePatientFamilyDoctorNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientFamilyDoctorNameMutation, UpdatePatientFamilyDoctorNameMutationVariables>(UpdatePatientFamilyDoctorNameDocument, options);
      }
export type UpdatePatientFamilyDoctorNameMutationHookResult = ReturnType<typeof useUpdatePatientFamilyDoctorNameMutation>;
export type UpdatePatientFamilyDoctorNameMutationResult = ApolloReactCommon.MutationResult<UpdatePatientFamilyDoctorNameMutation>;
export type UpdatePatientFamilyDoctorNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientFamilyDoctorNameMutation, UpdatePatientFamilyDoctorNameMutationVariables>;
export const UpdatePatientFamilyDoctorPhoneDocument = gql`
    mutation UpdatePatientFamilyDoctorPhone($personId: bigint!, $familyDoctorPhone: String) {
  update_patient_by_pk(
    pk_columns: {person_id: $personId}
    _set: {family_doctor_phone: $familyDoctorPhone}
  ) {
    person_id
    family_doctor_phone
  }
}
    `;
export type UpdatePatientFamilyDoctorPhoneMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientFamilyDoctorPhoneMutation, UpdatePatientFamilyDoctorPhoneMutationVariables>;

/**
 * __useUpdatePatientFamilyDoctorPhoneMutation__
 *
 * To run a mutation, you first call `useUpdatePatientFamilyDoctorPhoneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientFamilyDoctorPhoneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientFamilyDoctorPhoneMutation, { data, loading, error }] = useUpdatePatientFamilyDoctorPhoneMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      familyDoctorPhone: // value for 'familyDoctorPhone'
 *   },
 * });
 */
export function useUpdatePatientFamilyDoctorPhoneMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientFamilyDoctorPhoneMutation, UpdatePatientFamilyDoctorPhoneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientFamilyDoctorPhoneMutation, UpdatePatientFamilyDoctorPhoneMutationVariables>(UpdatePatientFamilyDoctorPhoneDocument, options);
      }
export type UpdatePatientFamilyDoctorPhoneMutationHookResult = ReturnType<typeof useUpdatePatientFamilyDoctorPhoneMutation>;
export type UpdatePatientFamilyDoctorPhoneMutationResult = ApolloReactCommon.MutationResult<UpdatePatientFamilyDoctorPhoneMutation>;
export type UpdatePatientFamilyDoctorPhoneMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientFamilyDoctorPhoneMutation, UpdatePatientFamilyDoctorPhoneMutationVariables>;
export const UpdatePatientImagingIdDocument = gql`
    mutation UpdatePatientImagingId($personId: bigint!, $imagingId: String) {
  update_patient_by_pk(
    pk_columns: {person_id: $personId}
    _set: {imaging_id: $imagingId}
  ) {
    person_id
    imaging_id
  }
}
    `;
export type UpdatePatientImagingIdMutationFn = ApolloReactCommon.MutationFunction<UpdatePatientImagingIdMutation, UpdatePatientImagingIdMutationVariables>;

/**
 * __useUpdatePatientImagingIdMutation__
 *
 * To run a mutation, you first call `useUpdatePatientImagingIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePatientImagingIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePatientImagingIdMutation, { data, loading, error }] = useUpdatePatientImagingIdMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      imagingId: // value for 'imagingId'
 *   },
 * });
 */
export function useUpdatePatientImagingIdMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePatientImagingIdMutation, UpdatePatientImagingIdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePatientImagingIdMutation, UpdatePatientImagingIdMutationVariables>(UpdatePatientImagingIdDocument, options);
      }
export type UpdatePatientImagingIdMutationHookResult = ReturnType<typeof useUpdatePatientImagingIdMutation>;
export type UpdatePatientImagingIdMutationResult = ApolloReactCommon.MutationResult<UpdatePatientImagingIdMutation>;
export type UpdatePatientImagingIdMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePatientImagingIdMutation, UpdatePatientImagingIdMutationVariables>;
export const GetPatientStatusEnumDocument = gql`
    query GetPatientStatusEnum {
  patient_status_enum(order_by: {value: asc}) {
    value
    comment
  }
}
    `;

/**
 * __useGetPatientStatusEnumQuery__
 *
 * To run a query within a React component, call `useGetPatientStatusEnumQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientStatusEnumQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientStatusEnumQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPatientStatusEnumQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>(GetPatientStatusEnumDocument, options);
      }
export function useGetPatientStatusEnumLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>(GetPatientStatusEnumDocument, options);
        }
// @ts-ignore
export function useGetPatientStatusEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>;
export function useGetPatientStatusEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPatientStatusEnumQuery | undefined, GetPatientStatusEnumQueryVariables>;
export function useGetPatientStatusEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>(GetPatientStatusEnumDocument, options);
        }
export type GetPatientStatusEnumQueryHookResult = ReturnType<typeof useGetPatientStatusEnumQuery>;
export type GetPatientStatusEnumLazyQueryHookResult = ReturnType<typeof useGetPatientStatusEnumLazyQuery>;
export type GetPatientStatusEnumSuspenseQueryHookResult = ReturnType<typeof useGetPatientStatusEnumSuspenseQuery>;
export type GetPatientStatusEnumQueryResult = ApolloReactCommon.QueryResult<GetPatientStatusEnumQuery, GetPatientStatusEnumQueryVariables>;
export const LegacySearchPatientsDocument = gql`
    query LegacySearchPatients($clinicId: bigint!, $searchText: String, $phoneDigits: String, $limit: Int!) {
  person(
    where: {clinic_id: {_eq: $clinicId}, is_active: {_eq: true}, _or: [{first_name: {_ilike: $searchText}}, {last_name: {_ilike: $searchText}}, {middle_name: {_ilike: $searchText}}, {preferred_name: {_ilike: $searchText}}, {patient: {chart_no: {_ilike: $searchText}}}]}
    limit: $limit
    order_by: [{last_name: asc}, {first_name: asc}]
  ) {
    id
    clinic_id
    first_name
    last_name
    preferred_name
    dob
    patient {
      chart_no
      status
    }
    person_contact_point(
      where: {kind: {_eq: "phone"}, is_active: {_eq: true}}
      order_by: {is_primary: desc}
      limit: 1
    ) {
      value
    }
  }
}
    `;

/**
 * __useLegacySearchPatientsQuery__
 *
 * To run a query within a React component, call `useLegacySearchPatientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLegacySearchPatientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLegacySearchPatientsQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      searchText: // value for 'searchText'
 *      phoneDigits: // value for 'phoneDigits'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useLegacySearchPatientsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables> & ({ variables: LegacySearchPatientsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>(LegacySearchPatientsDocument, options);
      }
export function useLegacySearchPatientsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>(LegacySearchPatientsDocument, options);
        }
// @ts-ignore
export function useLegacySearchPatientsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>;
export function useLegacySearchPatientsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<LegacySearchPatientsQuery | undefined, LegacySearchPatientsQueryVariables>;
export function useLegacySearchPatientsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>(LegacySearchPatientsDocument, options);
        }
export type LegacySearchPatientsQueryHookResult = ReturnType<typeof useLegacySearchPatientsQuery>;
export type LegacySearchPatientsLazyQueryHookResult = ReturnType<typeof useLegacySearchPatientsLazyQuery>;
export type LegacySearchPatientsSuspenseQueryHookResult = ReturnType<typeof useLegacySearchPatientsSuspenseQuery>;
export type LegacySearchPatientsQueryResult = ApolloReactCommon.QueryResult<LegacySearchPatientsQuery, LegacySearchPatientsQueryVariables>;
export const CreateAddressDocument = gql`
    mutation CreateAddress($line1: String!, $line2: String, $city: String!, $region: String!, $postalCode: String!, $country: String) {
  insert_address_one(
    object: {line1: $line1, line2: $line2, city: $city, region: $region, postal_code: $postalCode, country: $country, is_active: true}
  ) {
    id
    line1
    line2
    city
    region
    postal_code
    country
  }
}
    `;
export type CreateAddressMutationFn = ApolloReactCommon.MutationFunction<CreateAddressMutation, CreateAddressMutationVariables>;

/**
 * __useCreateAddressMutation__
 *
 * To run a mutation, you first call `useCreateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAddressMutation, { data, loading, error }] = useCreateAddressMutation({
 *   variables: {
 *      line1: // value for 'line1'
 *      line2: // value for 'line2'
 *      city: // value for 'city'
 *      region: // value for 'region'
 *      postalCode: // value for 'postalCode'
 *      country: // value for 'country'
 *   },
 * });
 */
export function useCreateAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAddressMutation, CreateAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateAddressMutation, CreateAddressMutationVariables>(CreateAddressDocument, options);
      }
export type CreateAddressMutationHookResult = ReturnType<typeof useCreateAddressMutation>;
export type CreateAddressMutationResult = ApolloReactCommon.MutationResult<CreateAddressMutation>;
export type CreateAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateAddressMutation, CreateAddressMutationVariables>;
export const UpdatePersonMailingAddressDocument = gql`
    mutation UpdatePersonMailingAddress($personId: bigint!, $addressId: bigint) {
  update_person_by_pk(
    pk_columns: {id: $personId}
    _set: {mailing_address_id: $addressId}
  ) {
    id
    mailing_address_id
    mailing_address {
      id
      line1
      line2
      city
      region
      postal_code
      country
    }
  }
}
    `;
export type UpdatePersonMailingAddressMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonMailingAddressMutation, UpdatePersonMailingAddressMutationVariables>;

/**
 * __useUpdatePersonMailingAddressMutation__
 *
 * To run a mutation, you first call `useUpdatePersonMailingAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonMailingAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonMailingAddressMutation, { data, loading, error }] = useUpdatePersonMailingAddressMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      addressId: // value for 'addressId'
 *   },
 * });
 */
export function useUpdatePersonMailingAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonMailingAddressMutation, UpdatePersonMailingAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonMailingAddressMutation, UpdatePersonMailingAddressMutationVariables>(UpdatePersonMailingAddressDocument, options);
      }
export type UpdatePersonMailingAddressMutationHookResult = ReturnType<typeof useUpdatePersonMailingAddressMutation>;
export type UpdatePersonMailingAddressMutationResult = ApolloReactCommon.MutationResult<UpdatePersonMailingAddressMutation>;
export type UpdatePersonMailingAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonMailingAddressMutation, UpdatePersonMailingAddressMutationVariables>;
export const UpdatePersonBillingAddressDocument = gql`
    mutation UpdatePersonBillingAddress($personId: bigint!, $addressId: bigint) {
  update_person_by_pk(
    pk_columns: {id: $personId}
    _set: {billing_address_id: $addressId}
  ) {
    id
    billing_address_id
    billing_address {
      id
      line1
      line2
      city
      region
      postal_code
      country
    }
  }
}
    `;
export type UpdatePersonBillingAddressMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonBillingAddressMutation, UpdatePersonBillingAddressMutationVariables>;

/**
 * __useUpdatePersonBillingAddressMutation__
 *
 * To run a mutation, you first call `useUpdatePersonBillingAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonBillingAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonBillingAddressMutation, { data, loading, error }] = useUpdatePersonBillingAddressMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      addressId: // value for 'addressId'
 *   },
 * });
 */
export function useUpdatePersonBillingAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonBillingAddressMutation, UpdatePersonBillingAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonBillingAddressMutation, UpdatePersonBillingAddressMutationVariables>(UpdatePersonBillingAddressDocument, options);
      }
export type UpdatePersonBillingAddressMutationHookResult = ReturnType<typeof useUpdatePersonBillingAddressMutation>;
export type UpdatePersonBillingAddressMutationResult = ApolloReactCommon.MutationResult<UpdatePersonBillingAddressMutation>;
export type UpdatePersonBillingAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonBillingAddressMutation, UpdatePersonBillingAddressMutationVariables>;
export const UpdateAddressDocument = gql`
    mutation UpdateAddress($addressId: bigint!, $line1: String, $line2: String, $city: String, $region: String, $postalCode: String, $country: String) {
  update_address_by_pk(
    pk_columns: {id: $addressId}
    _set: {line1: $line1, line2: $line2, city: $city, region: $region, postal_code: $postalCode, country: $country}
  ) {
    id
    line1
    line2
    city
    region
    postal_code
    country
  }
}
    `;
export type UpdateAddressMutationFn = ApolloReactCommon.MutationFunction<UpdateAddressMutation, UpdateAddressMutationVariables>;

/**
 * __useUpdateAddressMutation__
 *
 * To run a mutation, you first call `useUpdateAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAddressMutation, { data, loading, error }] = useUpdateAddressMutation({
 *   variables: {
 *      addressId: // value for 'addressId'
 *      line1: // value for 'line1'
 *      line2: // value for 'line2'
 *      city: // value for 'city'
 *      region: // value for 'region'
 *      postalCode: // value for 'postalCode'
 *      country: // value for 'country'
 *   },
 * });
 */
export function useUpdateAddressMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAddressMutation, UpdateAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateAddressMutation, UpdateAddressMutationVariables>(UpdateAddressDocument, options);
      }
export type UpdateAddressMutationHookResult = ReturnType<typeof useUpdateAddressMutation>;
export type UpdateAddressMutationResult = ApolloReactCommon.MutationResult<UpdateAddressMutation>;
export type UpdateAddressMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAddressMutation, UpdateAddressMutationVariables>;
export const GetPersonAddressIdsDocument = gql`
    query GetPersonAddressIds($personId: bigint!, $clinicId: bigint!) {
  person(where: {id: {_eq: $personId}, clinic_id: {_eq: $clinicId}}, limit: 1) {
    id
    mailing_address_id
    billing_address_id
    mailing_address {
      line1
      line2
      city
      region
      postal_code
      country
    }
    person_contact_point(where: {is_active: {_eq: true}}) {
      id
      kind
      value
      is_primary
    }
  }
}
    `;

/**
 * __useGetPersonAddressIdsQuery__
 *
 * To run a query within a React component, call `useGetPersonAddressIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonAddressIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonAddressIdsQuery({
 *   variables: {
 *      personId: // value for 'personId'
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetPersonAddressIdsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables> & ({ variables: GetPersonAddressIdsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>(GetPersonAddressIdsDocument, options);
      }
export function useGetPersonAddressIdsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>(GetPersonAddressIdsDocument, options);
        }
// @ts-ignore
export function useGetPersonAddressIdsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>;
export function useGetPersonAddressIdsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPersonAddressIdsQuery | undefined, GetPersonAddressIdsQueryVariables>;
export function useGetPersonAddressIdsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>(GetPersonAddressIdsDocument, options);
        }
export type GetPersonAddressIdsQueryHookResult = ReturnType<typeof useGetPersonAddressIdsQuery>;
export type GetPersonAddressIdsLazyQueryHookResult = ReturnType<typeof useGetPersonAddressIdsLazyQuery>;
export type GetPersonAddressIdsSuspenseQueryHookResult = ReturnType<typeof useGetPersonAddressIdsSuspenseQuery>;
export type GetPersonAddressIdsQueryResult = ApolloReactCommon.QueryResult<GetPersonAddressIdsQuery, GetPersonAddressIdsQueryVariables>;
export const CreatePersonContactPointDocument = gql`
    mutation CreatePersonContactPoint($personId: bigint!, $kind: String!, $label: String, $value: citext!, $phoneE164: String, $isPrimary: Boolean) {
  insert_person_contact_point_one(
    object: {person_id: $personId, kind: $kind, label: $label, value: $value, phone_e164: $phoneE164, is_primary: $isPrimary, is_active: true}
  ) {
    id
    person_id
    kind
    label
    value
    phone_e164
    is_primary
    is_active
  }
}
    `;
export type CreatePersonContactPointMutationFn = ApolloReactCommon.MutationFunction<CreatePersonContactPointMutation, CreatePersonContactPointMutationVariables>;

/**
 * __useCreatePersonContactPointMutation__
 *
 * To run a mutation, you first call `useCreatePersonContactPointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePersonContactPointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPersonContactPointMutation, { data, loading, error }] = useCreatePersonContactPointMutation({
 *   variables: {
 *      personId: // value for 'personId'
 *      kind: // value for 'kind'
 *      label: // value for 'label'
 *      value: // value for 'value'
 *      phoneE164: // value for 'phoneE164'
 *      isPrimary: // value for 'isPrimary'
 *   },
 * });
 */
export function useCreatePersonContactPointMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreatePersonContactPointMutation, CreatePersonContactPointMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreatePersonContactPointMutation, CreatePersonContactPointMutationVariables>(CreatePersonContactPointDocument, options);
      }
export type CreatePersonContactPointMutationHookResult = ReturnType<typeof useCreatePersonContactPointMutation>;
export type CreatePersonContactPointMutationResult = ApolloReactCommon.MutationResult<CreatePersonContactPointMutation>;
export type CreatePersonContactPointMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePersonContactPointMutation, CreatePersonContactPointMutationVariables>;
export const UpdatePersonContactPointDocument = gql`
    mutation UpdatePersonContactPoint($id: bigint!, $label: String, $value: citext, $phoneE164: String, $isPrimary: Boolean) {
  update_person_contact_point_by_pk(
    pk_columns: {id: $id}
    _set: {label: $label, value: $value, phone_e164: $phoneE164, is_primary: $isPrimary}
  ) {
    id
    kind
    label
    value
    phone_e164
    is_primary
  }
}
    `;
export type UpdatePersonContactPointMutationFn = ApolloReactCommon.MutationFunction<UpdatePersonContactPointMutation, UpdatePersonContactPointMutationVariables>;

/**
 * __useUpdatePersonContactPointMutation__
 *
 * To run a mutation, you first call `useUpdatePersonContactPointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonContactPointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonContactPointMutation, { data, loading, error }] = useUpdatePersonContactPointMutation({
 *   variables: {
 *      id: // value for 'id'
 *      label: // value for 'label'
 *      value: // value for 'value'
 *      phoneE164: // value for 'phoneE164'
 *      isPrimary: // value for 'isPrimary'
 *   },
 * });
 */
export function useUpdatePersonContactPointMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePersonContactPointMutation, UpdatePersonContactPointMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePersonContactPointMutation, UpdatePersonContactPointMutationVariables>(UpdatePersonContactPointDocument, options);
      }
export type UpdatePersonContactPointMutationHookResult = ReturnType<typeof useUpdatePersonContactPointMutation>;
export type UpdatePersonContactPointMutationResult = ApolloReactCommon.MutationResult<UpdatePersonContactPointMutation>;
export type UpdatePersonContactPointMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePersonContactPointMutation, UpdatePersonContactPointMutationVariables>;
export const DeletePersonContactPointDocument = gql`
    mutation DeletePersonContactPoint($id: bigint!) {
  update_person_contact_point_by_pk(
    pk_columns: {id: $id}
    _set: {is_active: false}
  ) {
    id
  }
}
    `;
export type DeletePersonContactPointMutationFn = ApolloReactCommon.MutationFunction<DeletePersonContactPointMutation, DeletePersonContactPointMutationVariables>;

/**
 * __useDeletePersonContactPointMutation__
 *
 * To run a mutation, you first call `useDeletePersonContactPointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePersonContactPointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePersonContactPointMutation, { data, loading, error }] = useDeletePersonContactPointMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePersonContactPointMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeletePersonContactPointMutation, DeletePersonContactPointMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeletePersonContactPointMutation, DeletePersonContactPointMutationVariables>(DeletePersonContactPointDocument, options);
      }
export type DeletePersonContactPointMutationHookResult = ReturnType<typeof useDeletePersonContactPointMutation>;
export type DeletePersonContactPointMutationResult = ApolloReactCommon.MutationResult<DeletePersonContactPointMutation>;
export type DeletePersonContactPointMutationOptions = ApolloReactCommon.BaseMutationOptions<DeletePersonContactPointMutation, DeletePersonContactPointMutationVariables>;
export const GetPersonProfileDocument = gql`
    query GetPersonProfile($personId: bigint!, $clinicId: bigint!) {
  person(where: {id: {_eq: $personId}, clinic_id: {_eq: $clinicId}}) {
    id
    clinic_id
    first_name
    middle_name
    last_name
    preferred_name
    dob
    gender
    preferred_language
    is_active
    responsible_party_id
    household_relationship
    household_head_id
    household_head {
      id
      first_name
      last_name
      preferred_name
    }
    household_members(where: {is_active: {_eq: true}}) {
      id
      first_name
      last_name
      preferred_name
    }
    responsible_party {
      id
      first_name
      last_name
      preferred_name
    }
    dependents(where: {is_active: {_eq: true}}) {
      id
      first_name
      last_name
      preferred_name
      household_relationship
      patient {
        person_id
        chart_no
      }
    }
    created_at
    created_by
    updated_at
    updated_by
    patient {
      person_id
      chart_no
      status
      family_doctor_name
      family_doctor_phone
      imaging_id
      is_active
      patient_referral {
        referral_kind
        referral_source {
          id
          name
        }
        referral_contact_person {
          id
          first_name
          last_name
        }
        referral_other_text
      }
    }
    person_contact_point(where: {is_active: {_eq: true}}) {
      id
      kind
      label
      value
      is_primary
    }
    mailing_address {
      id
      line1
      line2
      city
      region
      postal_code
      country
    }
    billing_address {
      id
      line1
      line2
      city
      region
      postal_code
      country
    }
  }
  patient_financial(where: {patient_person_id: {_eq: $personId}}) {
    patient_person_id
  }
}
    `;

/**
 * __useGetPersonProfileQuery__
 *
 * To run a query within a React component, call `useGetPersonProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonProfileQuery({
 *   variables: {
 *      personId: // value for 'personId'
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetPersonProfileQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPersonProfileQuery, GetPersonProfileQueryVariables> & ({ variables: GetPersonProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPersonProfileQuery, GetPersonProfileQueryVariables>(GetPersonProfileDocument, options);
      }
export function useGetPersonProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPersonProfileQuery, GetPersonProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPersonProfileQuery, GetPersonProfileQueryVariables>(GetPersonProfileDocument, options);
        }
// @ts-ignore
export function useGetPersonProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPersonProfileQuery, GetPersonProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPersonProfileQuery, GetPersonProfileQueryVariables>;
export function useGetPersonProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPersonProfileQuery, GetPersonProfileQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPersonProfileQuery | undefined, GetPersonProfileQueryVariables>;
export function useGetPersonProfileSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPersonProfileQuery, GetPersonProfileQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPersonProfileQuery, GetPersonProfileQueryVariables>(GetPersonProfileDocument, options);
        }
export type GetPersonProfileQueryHookResult = ReturnType<typeof useGetPersonProfileQuery>;
export type GetPersonProfileLazyQueryHookResult = ReturnType<typeof useGetPersonProfileLazyQuery>;
export type GetPersonProfileSuspenseQueryHookResult = ReturnType<typeof useGetPersonProfileSuspenseQuery>;
export type GetPersonProfileQueryResult = ApolloReactCommon.QueryResult<GetPersonProfileQuery, GetPersonProfileQueryVariables>;
export const SearchPatientsDocument = gql`
    query SearchPatients($where: person_bool_exp!, $limit: Int!) {
  person(
    where: $where
    limit: $limit
    order_by: [{last_name: asc}, {first_name: asc}]
  ) {
    id
    household_head_id
    household_head {
      id
      first_name
      last_name
      preferred_name
    }
    responsible_party_id
    first_name
    last_name
    preferred_name
    dob
    patient {
      status
      chart_no
    }
    person_contact_point(
      where: {kind: {_eq: "phone"}, is_active: {_eq: true}}
      order_by: {is_primary: desc}
      limit: 1
    ) {
      value
    }
  }
}
    `;

/**
 * __useSearchPatientsQuery__
 *
 * To run a query within a React component, call `useSearchPatientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPatientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPatientsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchPatientsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<SearchPatientsQuery, SearchPatientsQueryVariables> & ({ variables: SearchPatientsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SearchPatientsQuery, SearchPatientsQueryVariables>(SearchPatientsDocument, options);
      }
export function useSearchPatientsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SearchPatientsQuery, SearchPatientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SearchPatientsQuery, SearchPatientsQueryVariables>(SearchPatientsDocument, options);
        }
// @ts-ignore
export function useSearchPatientsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<SearchPatientsQuery, SearchPatientsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchPatientsQuery, SearchPatientsQueryVariables>;
export function useSearchPatientsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchPatientsQuery, SearchPatientsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<SearchPatientsQuery | undefined, SearchPatientsQueryVariables>;
export function useSearchPatientsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SearchPatientsQuery, SearchPatientsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SearchPatientsQuery, SearchPatientsQueryVariables>(SearchPatientsDocument, options);
        }
export type SearchPatientsQueryHookResult = ReturnType<typeof useSearchPatientsQuery>;
export type SearchPatientsLazyQueryHookResult = ReturnType<typeof useSearchPatientsLazyQuery>;
export type SearchPatientsSuspenseQueryHookResult = ReturnType<typeof useSearchPatientsSuspenseQuery>;
export type SearchPatientsQueryResult = ApolloReactCommon.QueryResult<SearchPatientsQuery, SearchPatientsQueryVariables>;
export const GetPersonsDocument = gql`
    query GetPersons($limit: Int, $offset: Int, $orderBy: [person_order_by!], $where: person_bool_exp!) {
  person(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {
    id
    clinic_id
    first_name
    last_name
    preferred_name
    dob
    gender
    preferred_language
    is_active
    created_at
    created_by
    updated_at
    updated_by
    patient {
      patient_referral {
        referral_kind
        referral_source {
          name
        }
        referral_contact_person {
          id
          first_name
          last_name
        }
        referral_other_text
      }
    }
  }
  person_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useGetPersonsQuery__
 *
 * To run a query within a React component, call `useGetPersonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPersonsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPersonsQuery, GetPersonsQueryVariables> & ({ variables: GetPersonsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPersonsQuery, GetPersonsQueryVariables>(GetPersonsDocument, options);
      }
export function useGetPersonsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPersonsQuery, GetPersonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPersonsQuery, GetPersonsQueryVariables>(GetPersonsDocument, options);
        }
// @ts-ignore
export function useGetPersonsSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPersonsQuery, GetPersonsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPersonsQuery, GetPersonsQueryVariables>;
export function useGetPersonsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPersonsQuery, GetPersonsQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPersonsQuery | undefined, GetPersonsQueryVariables>;
export function useGetPersonsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPersonsQuery, GetPersonsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPersonsQuery, GetPersonsQueryVariables>(GetPersonsDocument, options);
        }
export type GetPersonsQueryHookResult = ReturnType<typeof useGetPersonsQuery>;
export type GetPersonsLazyQueryHookResult = ReturnType<typeof useGetPersonsLazyQuery>;
export type GetPersonsSuspenseQueryHookResult = ReturnType<typeof useGetPersonsSuspenseQuery>;
export type GetPersonsQueryResult = ApolloReactCommon.QueryResult<GetPersonsQuery, GetPersonsQueryVariables>;
export const GetReferralKindEnumDocument = gql`
    query GetReferralKindEnum {
  referral_kind_enum(order_by: {value: asc}) {
    value
    comment
  }
}
    `;

/**
 * __useGetReferralKindEnumQuery__
 *
 * To run a query within a React component, call `useGetReferralKindEnumQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReferralKindEnumQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReferralKindEnumQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetReferralKindEnumQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>(GetReferralKindEnumDocument, options);
      }
export function useGetReferralKindEnumLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>(GetReferralKindEnumDocument, options);
        }
// @ts-ignore
export function useGetReferralKindEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>;
export function useGetReferralKindEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetReferralKindEnumQuery | undefined, GetReferralKindEnumQueryVariables>;
export function useGetReferralKindEnumSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>(GetReferralKindEnumDocument, options);
        }
export type GetReferralKindEnumQueryHookResult = ReturnType<typeof useGetReferralKindEnumQuery>;
export type GetReferralKindEnumLazyQueryHookResult = ReturnType<typeof useGetReferralKindEnumLazyQuery>;
export type GetReferralKindEnumSuspenseQueryHookResult = ReturnType<typeof useGetReferralKindEnumSuspenseQuery>;
export type GetReferralKindEnumQueryResult = ApolloReactCommon.QueryResult<GetReferralKindEnumQuery, GetReferralKindEnumQueryVariables>;
export const GetReferralSourcesDocument = gql`
    query GetReferralSources($clinicId: bigint!) {
  referral_source(
    where: {clinic_id: {_eq: $clinicId}, is_active: {_eq: true}}
    order_by: {name: asc}
  ) {
    id
    name
    clinic_id
    is_active
  }
}
    `;

/**
 * __useGetReferralSourcesQuery__
 *
 * To run a query within a React component, call `useGetReferralSourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReferralSourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReferralSourcesQuery({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *   },
 * });
 */
export function useGetReferralSourcesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetReferralSourcesQuery, GetReferralSourcesQueryVariables> & ({ variables: GetReferralSourcesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>(GetReferralSourcesDocument, options);
      }
export function useGetReferralSourcesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>(GetReferralSourcesDocument, options);
        }
// @ts-ignore
export function useGetReferralSourcesSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>;
export function useGetReferralSourcesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetReferralSourcesQuery | undefined, GetReferralSourcesQueryVariables>;
export function useGetReferralSourcesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>(GetReferralSourcesDocument, options);
        }
export type GetReferralSourcesQueryHookResult = ReturnType<typeof useGetReferralSourcesQuery>;
export type GetReferralSourcesLazyQueryHookResult = ReturnType<typeof useGetReferralSourcesLazyQuery>;
export type GetReferralSourcesSuspenseQueryHookResult = ReturnType<typeof useGetReferralSourcesSuspenseQuery>;
export type GetReferralSourcesQueryResult = ApolloReactCommon.QueryResult<GetReferralSourcesQuery, GetReferralSourcesQueryVariables>;
export const GetPatientReferralDocument = gql`
    query GetPatientReferral($patientPersonId: bigint!) {
  patient_referral(where: {patient_person_id: {_eq: $patientPersonId}}, limit: 1) {
    patient_person_id
    referral_kind
    referral_source_id
    referral_contact_person_id
    referral_other_text
    referral_source {
      id
      name
    }
    referral_contact_person {
      id
      first_name
      last_name
    }
  }
}
    `;

/**
 * __useGetPatientReferralQuery__
 *
 * To run a query within a React component, call `useGetPatientReferralQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientReferralQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientReferralQuery({
 *   variables: {
 *      patientPersonId: // value for 'patientPersonId'
 *   },
 * });
 */
export function useGetPatientReferralQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPatientReferralQuery, GetPatientReferralQueryVariables> & ({ variables: GetPatientReferralQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPatientReferralQuery, GetPatientReferralQueryVariables>(GetPatientReferralDocument, options);
      }
export function useGetPatientReferralLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPatientReferralQuery, GetPatientReferralQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPatientReferralQuery, GetPatientReferralQueryVariables>(GetPatientReferralDocument, options);
        }
// @ts-ignore
export function useGetPatientReferralSuspenseQuery(baseOptions?: ApolloReactHooks.SuspenseQueryHookOptions<GetPatientReferralQuery, GetPatientReferralQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPatientReferralQuery, GetPatientReferralQueryVariables>;
export function useGetPatientReferralSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPatientReferralQuery, GetPatientReferralQueryVariables>): ApolloReactHooks.UseSuspenseQueryResult<GetPatientReferralQuery | undefined, GetPatientReferralQueryVariables>;
export function useGetPatientReferralSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPatientReferralQuery, GetPatientReferralQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPatientReferralQuery, GetPatientReferralQueryVariables>(GetPatientReferralDocument, options);
        }
export type GetPatientReferralQueryHookResult = ReturnType<typeof useGetPatientReferralQuery>;
export type GetPatientReferralLazyQueryHookResult = ReturnType<typeof useGetPatientReferralLazyQuery>;
export type GetPatientReferralSuspenseQueryHookResult = ReturnType<typeof useGetPatientReferralSuspenseQuery>;
export type GetPatientReferralQueryResult = ApolloReactCommon.QueryResult<GetPatientReferralQuery, GetPatientReferralQueryVariables>;
export const CreateReferralSourceDocument = gql`
    mutation CreateReferralSource($clinicId: bigint!, $name: String!) {
  insert_referral_source_one(
    object: {clinic_id: $clinicId, name: $name, is_active: true}
  ) {
    id
    name
    clinic_id
  }
}
    `;
export type CreateReferralSourceMutationFn = ApolloReactCommon.MutationFunction<CreateReferralSourceMutation, CreateReferralSourceMutationVariables>;

/**
 * __useCreateReferralSourceMutation__
 *
 * To run a mutation, you first call `useCreateReferralSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReferralSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReferralSourceMutation, { data, loading, error }] = useCreateReferralSourceMutation({
 *   variables: {
 *      clinicId: // value for 'clinicId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateReferralSourceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateReferralSourceMutation, CreateReferralSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateReferralSourceMutation, CreateReferralSourceMutationVariables>(CreateReferralSourceDocument, options);
      }
export type CreateReferralSourceMutationHookResult = ReturnType<typeof useCreateReferralSourceMutation>;
export type CreateReferralSourceMutationResult = ApolloReactCommon.MutationResult<CreateReferralSourceMutation>;
export type CreateReferralSourceMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateReferralSourceMutation, CreateReferralSourceMutationVariables>;
export const UpdateReferralSourceDocument = gql`
    mutation UpdateReferralSource($id: bigint!, $name: String, $isActive: Boolean) {
  update_referral_source_by_pk(
    pk_columns: {id: $id}
    _set: {name: $name, is_active: $isActive}
  ) {
    id
    name
    is_active
  }
}
    `;
export type UpdateReferralSourceMutationFn = ApolloReactCommon.MutationFunction<UpdateReferralSourceMutation, UpdateReferralSourceMutationVariables>;

/**
 * __useUpdateReferralSourceMutation__
 *
 * To run a mutation, you first call `useUpdateReferralSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReferralSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReferralSourceMutation, { data, loading, error }] = useUpdateReferralSourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      isActive: // value for 'isActive'
 *   },
 * });
 */
export function useUpdateReferralSourceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateReferralSourceMutation, UpdateReferralSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateReferralSourceMutation, UpdateReferralSourceMutationVariables>(UpdateReferralSourceDocument, options);
      }
export type UpdateReferralSourceMutationHookResult = ReturnType<typeof useUpdateReferralSourceMutation>;
export type UpdateReferralSourceMutationResult = ApolloReactCommon.MutationResult<UpdateReferralSourceMutation>;
export type UpdateReferralSourceMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateReferralSourceMutation, UpdateReferralSourceMutationVariables>;
export const DeleteReferralSourceDocument = gql`
    mutation DeleteReferralSource($id: bigint!) {
  update_referral_source_by_pk(pk_columns: {id: $id}, _set: {is_active: false}) {
    id
    is_active
  }
}
    `;
export type DeleteReferralSourceMutationFn = ApolloReactCommon.MutationFunction<DeleteReferralSourceMutation, DeleteReferralSourceMutationVariables>;

/**
 * __useDeleteReferralSourceMutation__
 *
 * To run a mutation, you first call `useDeleteReferralSourceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReferralSourceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReferralSourceMutation, { data, loading, error }] = useDeleteReferralSourceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteReferralSourceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteReferralSourceMutation, DeleteReferralSourceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteReferralSourceMutation, DeleteReferralSourceMutationVariables>(DeleteReferralSourceDocument, options);
      }
export type DeleteReferralSourceMutationHookResult = ReturnType<typeof useDeleteReferralSourceMutation>;
export type DeleteReferralSourceMutationResult = ApolloReactCommon.MutationResult<DeleteReferralSourceMutation>;
export type DeleteReferralSourceMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteReferralSourceMutation, DeleteReferralSourceMutationVariables>;
export const UpsertPatientReferralDocument = gql`
    mutation UpsertPatientReferral($patientPersonId: bigint!, $referralKind: String!, $referralSourceId: bigint, $referralContactPersonId: bigint, $referralOtherText: String) {
  insert_patient_referral_one(
    object: {patient_person_id: $patientPersonId, referral_kind: $referralKind, referral_source_id: $referralSourceId, referral_contact_person_id: $referralContactPersonId, referral_other_text: $referralOtherText, is_active: true}
    on_conflict: {constraint: patient_referral_pkey, update_columns: [referral_kind, referral_source_id, referral_contact_person_id, referral_other_text, is_active]}
  ) {
    patient_person_id
    referral_kind
    referral_source_id
    referral_contact_person_id
    referral_other_text
  }
}
    `;
export type UpsertPatientReferralMutationFn = ApolloReactCommon.MutationFunction<UpsertPatientReferralMutation, UpsertPatientReferralMutationVariables>;

/**
 * __useUpsertPatientReferralMutation__
 *
 * To run a mutation, you first call `useUpsertPatientReferralMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPatientReferralMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPatientReferralMutation, { data, loading, error }] = useUpsertPatientReferralMutation({
 *   variables: {
 *      patientPersonId: // value for 'patientPersonId'
 *      referralKind: // value for 'referralKind'
 *      referralSourceId: // value for 'referralSourceId'
 *      referralContactPersonId: // value for 'referralContactPersonId'
 *      referralOtherText: // value for 'referralOtherText'
 *   },
 * });
 */
export function useUpsertPatientReferralMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpsertPatientReferralMutation, UpsertPatientReferralMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpsertPatientReferralMutation, UpsertPatientReferralMutationVariables>(UpsertPatientReferralDocument, options);
      }
export type UpsertPatientReferralMutationHookResult = ReturnType<typeof useUpsertPatientReferralMutation>;
export type UpsertPatientReferralMutationResult = ApolloReactCommon.MutationResult<UpsertPatientReferralMutation>;
export type UpsertPatientReferralMutationOptions = ApolloReactCommon.BaseMutationOptions<UpsertPatientReferralMutation, UpsertPatientReferralMutationVariables>;
export const DeletePatientReferralDocument = gql`
    mutation DeletePatientReferral($patientPersonId: bigint!) {
  delete_patient_referral_by_pk(patient_person_id: $patientPersonId) {
    patient_person_id
  }
}
    `;
export type DeletePatientReferralMutationFn = ApolloReactCommon.MutationFunction<DeletePatientReferralMutation, DeletePatientReferralMutationVariables>;

/**
 * __useDeletePatientReferralMutation__
 *
 * To run a mutation, you first call `useDeletePatientReferralMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePatientReferralMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePatientReferralMutation, { data, loading, error }] = useDeletePatientReferralMutation({
 *   variables: {
 *      patientPersonId: // value for 'patientPersonId'
 *   },
 * });
 */
export function useDeletePatientReferralMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeletePatientReferralMutation, DeletePatientReferralMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeletePatientReferralMutation, DeletePatientReferralMutationVariables>(DeletePatientReferralDocument, options);
      }
export type DeletePatientReferralMutationHookResult = ReturnType<typeof useDeletePatientReferralMutation>;
export type DeletePatientReferralMutationResult = ApolloReactCommon.MutationResult<DeletePatientReferralMutation>;
export type DeletePatientReferralMutationOptions = ApolloReactCommon.BaseMutationOptions<DeletePatientReferralMutation, DeletePatientReferralMutationVariables>;
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
  capability(order_by: {value: asc}) {
    value
    comment
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
    mutation AddCapabilityToRole($roleId: bigint!, $capabilityKey: capability_enum!) {
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
    mutation RemoveCapabilityFromRole($roleId: bigint!, $capabilityKey: capability_enum!) {
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