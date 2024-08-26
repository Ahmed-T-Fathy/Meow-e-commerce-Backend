import { Expose } from "class-transformer";


export class CategoryDTO{
    @Expose()
    id: string;
    
    @Expose()
    name:string;

    @Expose()
    description:string;

}