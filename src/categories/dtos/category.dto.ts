import { Expose } from "class-transformer";


export class CategoryDTO{

    @Expose()
    name:string;

    @Expose()
    description:string;

}