import { prismaClient } from "../../lib/db";
import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/user";

const queries = {
  getUsers: async () => {
    const users = await prismaClient.user.findMany();
    return users;
  },

  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const token = await UserService.getUserToken(payload);
    return token;
  },

  getCurrentLoggedInUser: async (_: any, parameteres: any, context: any) => {
    if (context && context.user) {
      const user = await UserService.getUserById(context.user.id);
      return user;
    } else {
      throw new Error("Unauthorized");
    }
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
