import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string, metadata: ArgumentMetadata): bigint {
    if (!/^\d+$/.test(value)) {
      throw new BadRequestException(
        `${metadata.data ?? 'parameter'}이(가) 유효한 숫자 형식이 아닙니다.`,
      );
    }

    return BigInt(value);
  }
}
