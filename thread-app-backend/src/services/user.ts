import JWT from "jsonwebtoken";
import { createHmac, randomBytes } from "node:crypto";
import { prismaClient } from "../lib/db";

const JWT_SECRET = "thisIs$2ljdfffrekaingk389dsljck";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  profileImageURL?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, profileImageURL, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = this.generateHash(salt, password);

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        profileImageURL,
        email,
        password: hashedPassword,
        salt,
      },
    });
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const userSalt = user.salt;
    const userHashedPassword = this.generateHash(userSalt, password);

    if (userHashedPassword !== user.password)
      throw new Error("Invalid password");

    // generate token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }

  public static async decodeJWTToken(token: string) {
    return JWT.verify(token, JWT_SECRET);
  }
}

export default UserService;
