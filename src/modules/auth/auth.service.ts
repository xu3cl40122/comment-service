import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) { }

  // signAccessToken(user: User) {
  //   const payload = { email: user.email, user_id: user.user_id, user_role: user.user_role };
  //   return this.jwtService.sign(payload)
  // }

}