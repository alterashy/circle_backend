import { CreateThreadDTO, UpdateThreadDTO } from "../dtos/thread.dto";
import { prisma } from "../libs/prisma";

class ThreadService {
	async getThreads(pagination?: { limit: number; startIndex: number }) {
		return await prisma.thread.findMany({
			include: {
				user: {
					omit: {
						password: true,
					},
					include: {
						profile: true,
					},
				},
				likes: true,
				replies: true,
			},
			take: pagination?.limit,
			skip: pagination?.startIndex,
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async getThreadByUser(userId: string, pagination?: { limit: number; startIndex: number }) {
		return prisma.thread.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			include: {
				user: { include: { profile: true } },
				likes: true,
				replies: true,
			},
			take: pagination?.limit,
			skip: pagination?.startIndex,
		});
	}

	async getThreadById(id: string) {
		return await prisma.thread.findFirst({
			where: { id },
			include: {
				user: {
					omit: {
						password: true,
					},
					include: {
						profile: true,
					},
				},
				likes: true,
				replies: {
					include: {
						user: {
							include: {
								profile: true,
							},
						},
					},
				},
			},
		});
	}

	async createThread(userId: string, data: CreateThreadDTO) {
		const { content, images } = data;
		return await prisma.thread.create({
			data: {
				images,
				content,
				userId,
			},
		});
	}

	async update(threadId: string, userId: string, dto: UpdateThreadDTO) {
		const thread = await prisma.thread.findUnique({ where: { id: threadId } });
		if (!thread || thread.userId !== userId) {
			throw new Error("Thread not found or unauthorized");
		}

		return prisma.thread.update({
			where: { id: threadId },
			data: {
				...dto,
				isEdited: true,
			},
		});
	}

	async delete(threadId: string, userId: string) {
		const thread = await prisma.thread.findFirst({
			where: { id: threadId, userId },
		});

		if (!thread) {
			throw new Error("Thread not found or unauthorized");
		}

		// Hapus replies terlebih dahulu
		await prisma.reply.deleteMany({
			where: { threadId },
		});

		// Hapus likes terlebih dahulu
		await prisma.like.deleteMany({
			where: { threadId },
		});

		// Setelah semua relasi dihapus, baru hapus thread-nya
		return await prisma.thread.delete({
			where: { id: threadId },
		});
	}
}

export default new ThreadService();
