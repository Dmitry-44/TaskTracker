export interface Event {
  id: UniqueId;
  task_id?: UniqueId;
  operation_id?: number;
  created: DateTimeStamp;
  modified: DateTimeStamp;
  finished?: DateTimeStamp;
  u_id?: UniqueId;
  user_name?: string;
  status: number;
  selected_users: number[];
  selected_divisions: number[];
  result: string;
  params?: Record<string, unknown>
}