interface ResultWithMessage {
  message: string;
  result: unknown;
}

interface FilterPayload {
  select: string[];
  filter: { [key: string]: any };
  options: {
    onlyLimit: boolean;
    page?: number;
    itemsPerPage: number;
    sortBy?: string[];
    sortDesc?: boolean[];
    groupBy?: string[];
    groupDesc?: boolean[];
    mustSort?: boolean;
    multiSort?: boolean;
    allCount?: number;
    maxPages?: number;
  };
}

export type { FilterPayload, ResultWithMessage };
