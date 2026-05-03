import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds = 10;

  async hash(textForHash: string): Promise<string> {
    return bcrypt.hash(textForHash, this.saltRounds);
  }

  async compare(textToCompare: string, hash: string): Promise<boolean> {
    return bcrypt.compare(textToCompare, hash);
  }
}
