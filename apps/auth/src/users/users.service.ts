import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log(hashedPassword, 'hashedPassword');

    return await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      email,
    });

    const isPAsswordValid = await bcrypt.compare(password, user.password);

    if (!isPAsswordValid) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return user;
  }
}
