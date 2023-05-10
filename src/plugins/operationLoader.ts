import type { Component } from "vue";
import { defineAsyncComponent } from "vue";
import operationComponents from '../../operationComponents.json';

const componentNamesList: Record<string, string> = operationComponents

export const operationLoader = async(id: number): Promise<Component> => 
    defineAsyncComponent(
        () => import(`@/components/operations/${componentNamesList[id]}.vue`)
    );