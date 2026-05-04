import { Request } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

//Расширение Request
export interface AuthorizedRequest extends Request {
  user?: User;
}
