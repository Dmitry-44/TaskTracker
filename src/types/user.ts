

interface User {
    id: number;
    fio: string;
    rights: {[key: string]: any};
}

export type { User }