import type { Component } from "vue";


export const lastFromArray = <T>(arr: T[]):T|undefined => {
    if(!Array.isArray(arr))return undefined;
    return arr.length>0 ? arr[arr.length - 1] : undefined;
}

export const operationResolver = (id: number): Promise<Component> => {
    
    return import(/* @vite-ignore */ `../components/operations/${id}.*.vue`)
            .then(module => module.default ?? module)
            .catch(err=>{
                console.log('err: ', err)
            })
}

// interface Component {
//     default: any,
//     [key: string]: any,
//   }
  