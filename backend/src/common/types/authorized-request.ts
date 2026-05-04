import type { Request } from 'express';
import { User } from '../../users/entities/user.entity';

//Расширение класса Request
export class AuthorizedRequest extends Request {
  user?: User;
}
