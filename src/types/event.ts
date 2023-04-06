export interface Event {
  id: number;
  task_id?: number;
  operation_id?: number;
  created: number;
  modified: number | null;
  finished?: number | null;
  u_id?: number | null;
  user_name?: string | null;
  status: number;
  selected_users: number[];
  selected_divisions: number[];
  result: string | null;
  params?: Record<string, unknown>
}