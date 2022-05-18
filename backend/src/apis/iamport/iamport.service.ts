import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  //iamport access token 발급
  async getToken() {
    try {
      const result = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IMP_APIKEY, // REST API키
          imp_secret: process.env.IMP_SECRET, // REST API Secret
        },
      });
      return result.data.response.access_token;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  //결제 정보 대조
  async checkPaid({ impUid, amount, accessToken }) {
    try {
      const getPaymentData = await axios({
        url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
      });

      const paymentData = getPaymentData.data.response; // 조회한 결제 정보
      if (paymentData.status !== 'paid')
        throw new BadRequestException('결제한 이력이 없습니다.');
      if (paymentData.amount !== amount)
        throw new BadRequestException('결제한 금액이 상이합니다.');
    } catch (err) {
      if (err?.response?.data) {
        throw new BadRequestException('존재하지 않는 결제정보입니다😅');
      } else {
        throw err;
      }
    }
  }
}
