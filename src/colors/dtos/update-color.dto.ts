import { CreateColorDTO } from "./create-color.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateColorDTO extends PartialType(CreateColorDTO){}