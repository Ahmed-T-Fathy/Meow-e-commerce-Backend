import { PartialType } from "@nestjs/mapped-types";
import { CreateTaxDTO } from "./create-tax.dto";
import { Exclude } from "class-transformer";

export class UpdateTaxDTO extends PartialType(CreateTaxDTO){
    @Exclude()
    title?: string;
}