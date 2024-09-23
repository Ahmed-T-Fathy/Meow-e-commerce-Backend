import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from 'src/users/users.service';



@ValidatorConstraint({ name: 'isPhoneExist', async: true })
@Injectable()
export class PhoneExistRole implements ValidatorConstraintInterface {
  constructor(private readonly userService:UsersService) {}

  async validate(value: string): Promise<boolean> {
    console.log(value);
    console.log(this.userService);
    
    let user = await this.userService.getUserByPhoneNumber(value)
    
    return !!user ;
  }
}

export function isPhoneExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: PhoneExistRole,
      });
    };
  }
