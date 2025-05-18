import { CreateFollowDTO, DeleteFollowDTO } from "../dtos/follow.dto";
import { prisma } from "../libs/prisma";

class FollowService {
	async getFollowers(userId: string) {
		return await prisma.follow.findMany({
			where: { followerId: userId },
		});
	}

	async getFollowing(userId: string) {
		return await prisma.follow.findMany({
			where: { followingId: userId },
		});
	}

	async getFollowersCounts(userId: string) {
		return await prisma.follow.count({
			where: { followingId: userId },
		});
	}

	async getFollowingCounts(userId: string) {
		return await prisma.follow.count({
			where: { followerId: userId },
		});
	}

	async createFollow(userId: string, followingId: string) {
		return await prisma.follow.create({
			data: {
				followerId: userId,
				followingId: followingId,
			},
		});
	}

	async deleteFollow(id: string) {
		return await prisma.follow.delete({
			where: { id },
		});
	}
}
export default new FollowService();
