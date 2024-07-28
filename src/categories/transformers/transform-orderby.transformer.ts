import { TransformFnParams } from "class-transformer";

export function transformerOrderBy({value}:TransformFnParams){
    if(typeof value !== 'string') return value;

    return value.split(',').map(field=>{
        const direction=field.startsWith('-')?'DESC':'ASC';
        const fieldName=field.startsWith('-')?field.slice(1):field;
        return {field:fieldName,direction};
    })
}