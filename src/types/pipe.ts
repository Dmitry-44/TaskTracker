import type { Operation } from "@/types/operation";

interface Pipe {
    id: number
    name: string
    operation_entities: Operation[]
    value: number[]
}

export type { Pipe }