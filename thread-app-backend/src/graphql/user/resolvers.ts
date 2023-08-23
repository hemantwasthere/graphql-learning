import { prismaClient } from "../../lib/db";

const queries = {
  getUsers: async () => {
    const users = await prismaClient.user.findMany();
    return users;
  },
};

const mutations = {
  createUser: async (
    _: any,
    {
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }
  ) => {
    await prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        salt: "random_salt",
      },
    });
    return "user created succesfully";
  },
};

export const resolvers = { queries, mutations };
