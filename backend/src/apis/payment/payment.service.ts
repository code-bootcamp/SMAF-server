import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import {
  Payment,
  PAYMENT_TRANSACTION_STATUS_ENUM,
} from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  //결제 정보 중복 확인
  async checkDuplicate({ impUid }) {
    const result = await this.paymentRepository.findOne({
      where: {
        impUid: impUid,
      },
    });
    if (result)
      throw new BadRequestException('이미 결제가 처리 된 아이디 입니다.');
  }

  //결제정보 생성
  async create({
    impUid,
    amount,
    currentUser,
    status = PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
  }) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const result = this.paymentRepository.create({
        impUid,
        amount,
        user: currentUser.id,
        status,
      });
      console.log(result);
      await queryRunner.manager.save(result);

      const user = await queryRunner.manager.findOne(
        User,
        { userId: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );
      const updateUser = this.userRepository.create({
        ...user,
        projectTicket: user.projectTicket + 1,
      });
      await queryRunner.manager.save(updateUser);

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //결제 정보 조회 - create 에서 pessimistic_write lock이기 때문에 일반 조회
  async findAll({ CurrentUser }) {
    const result = await this.paymentRepository.find({
      where: { user: CurrentUser.id },
      relations: ['user'],
    });
    return result;
  }

  // 결제 1건만 찾기
  //   findOne({ paymentId }) {
  //     const result = this.paymentRepository
  //       .createQueryBuilder('payment')
  //       .leftJoinAndSelect('payment.user', 'userId')
  //       .where();
  //   }
}
