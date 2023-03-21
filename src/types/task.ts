import type { Event } from "@/types/event";

interface Task {
  id: number;
  title: string;
  text: string;
  created_at: number;
  priority?: number;
  status?: number;
  pipe_id?: number;
  event_id?: number;
  division_id?: number;
  created_by?: number;
  events?: number[];
  event_entities?: Event[];
  child_tasks?: Task[];
  smi_direction?: number;
}

export type { Task };
