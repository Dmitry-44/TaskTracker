

export const lastFromArray = <T>(arr: T[]):T|undefined => {
    console.log('lastFromArray', arr)
    return arr.length>0 ? arr[arr.length - 1] : undefined
}