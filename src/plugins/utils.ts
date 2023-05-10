
export const lastFromArray = <T>(arr: T[]):T|undefined => {
    if(!Array.isArray(arr))return undefined;
    return arr.length>0 ? arr[arr.length - 1] : undefined;
} 