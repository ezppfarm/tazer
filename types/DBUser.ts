export type DBUser = {
  id: number;
  name: string;
  safe_name: string;
  email: string;
  password: string;
  country: string;
  join_date: Date;
  last_activity: Date;
}