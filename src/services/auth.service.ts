import { LoginDTO, RegisterDTO, ResetPasswordDTO } from "../dtos/auth.dto";
import prisma from "../libs/prisma";

class AuthService {
  async register(data: RegisterDTO) {
    const { fullName, ...userData } = data;

    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
  }

  async resetPassword(email: string, hashedNewPassword: string) {
    return await prisma.user.update({
      where: { email },
      data: {
        password: hashedNewPassword,
      },
    });
  }
}

export default new AuthService();
