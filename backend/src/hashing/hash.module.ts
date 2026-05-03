import { Module } from '@nestjs/common';
import { HashService } from './hash.service';

@Module({
  providers: [HashService],
  exports: [HashService], // экспортируем для использования в других модулях
})
export class HashModule {}
