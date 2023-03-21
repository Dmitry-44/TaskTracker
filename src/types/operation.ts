interface Operation {
  id: number;
  name: string;
  params: { [key: string]: any };
}

export type { Operation };
