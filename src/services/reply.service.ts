import { CreateReplyDTO } from "../dtos/reply.dto";
import { prisma } from "../libs/prisma";

class ReplyService {
  async getRepliesByThreadId(threadId: string) {
    return await prisma.reply.findMany({
      where: { threadId },
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createReply(userId: string, threadId: string, data: CreateReplyDTO) {
    const { content } = data;
    return await prisma.reply.create({
      data: {
        threadId,
        content,
        userId,
      },
    });
  }

  async updateReply(id: string, data: CreateReplyDTO) {
    const { content } = data;
    return await prisma.reply.update({ where: { id }, data: { content } });
  }

  async deleteReply(id: string) {
    return await prisma.reply.delete({ where: { id } });
  }
}

export default new ReplyService();
