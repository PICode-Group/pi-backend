import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';

export class findAllCategoriaDto extends PartialType(CreateCategoriaDto) {
    
}
