import * as dotenv from "dotenv";

dotenv.config();

const environments = {
  dbPassword: process.env.DATABASE_PASSWORD ?? "",
  dbHost: process.env.DATABASE_HOST ?? "",
  dbUser: process.env.DATABASE_USER ?? "",
  dbName: process.env.DATABASE_NAME ?? "",
  jwtAccessToken: process.env.JWT_ACCESS_TOKEN ?? "",
  jwtRefreshToken: process.env.JWT_REFRESH_TOKEN ?? "",
};

export default environments;
