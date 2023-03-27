import type { Task } from '@/types/task';


const topPriority = <U extends Task>(a: U, b: U) => a.priority! - b.priority!;
const lowPriority = <U extends Task>(a: U, b: U) => b.priority! - a.priority!;
const topStatus = <U extends Task>(a: U, b: U) => a.status! - b.status!;
const lowStatus = <U extends Task>(a: U, b: U) => b.status! - a.status!;

export const sortOptions = [
    {
      icon: "Top",
      name: "Приоритет",
      filter: topPriority,
    },
    {
      icon: "Bottom",
      name: "Приоритет",
      filter: lowPriority,
    },
    {
      icon: "Top",
      name: "Статус",
      filter: topStatus,
    },
    {
      icon: "Bottom",
      name: "Статус",
      filter: lowStatus,
    },
];
