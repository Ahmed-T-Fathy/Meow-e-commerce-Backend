import { IsArray, IsUUID } from "class-validator";

export class AddCategoriesDTO{
    @IsArray()
    @IsUUID('4',{each:true})
    categoryIds:string[];
}