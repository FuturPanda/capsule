import { docker } from "./command";
import { input } from "@inquirer/prompts";
import { z } from "zod";
import crypto from "crypto";
import { BASE64, CAPSULE_IMAGE } from "./_utils/constants";
import { checkApiKey } from "./check-api-key";

const emailSchema = z.string().email({
  message: "Invalid email address",
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

type CapsuleEnv = z.infer<typeof capsuleEnvSchema>;

const capsuleEnvSchema = z.object({
  OWNER_EMAIL: emailSchema,
  OWNER_PASSWORD: passwordSchema,
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  BASE_URL: z.string(),
});

export const launchCapsule = async () => {
  try {
    const isImageExisting = await checkImageExists(CAPSULE_IMAGE);
    console.log(`Pulling image: Capsule`);

    let validEmail: string;
    while (true) {
      const email = await input({
        message:
          "We will start by creating your capsule account.\nEnter your email",
      });

      const emailResult = emailSchema.safeParse(email);
      if (emailResult.success) {
        validEmail = emailResult.data;
        break;
      }
      console.error("❌ Error:", emailResult.error.errors[0]?.message);
    }

    let validPassword: string;
    while (true) {
      const password = await input({
        message: "Enter your password",
      });

      const passwordResult = passwordSchema.safeParse(password);
      if (passwordResult.success) {
        const confirmPassword = await input({
          message: "Confirm your password",
        });

        if (password === confirmPassword) {
          validPassword = passwordResult.data;
          break;
        }
        console.error("❌ Passwords do not match");
      } else {
        console.error("❌ Error:", passwordResult.error?.errors[0]?.message);
      }
    }

    const jwtSecret = crypto.randomBytes(32).toString(BASE64);
    const jwtRefreshSecret = crypto.randomBytes(32).toString(BASE64);

    const envVariables: CapsuleEnv = {
      OWNER_EMAIL: validEmail,
      OWNER_PASSWORD: validPassword,
      JWT_SECRET: jwtSecret,
      JWT_REFRESH_SECRET: jwtRefreshSecret,
      BASE_URL: "http://localhost:3000/api/v1",
    };

    if (!isImageExisting) {
      console.log("📦 Pulling Docker image...");
      const stream = await docker.pull("futurpanda/capsule");

      await new Promise((resolve, reject) => {
        docker.modem.followProgress(
          stream,
          (err: Error | null, output: any[]) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(output);
          },
          (event: any) => {
            console.log(event.status, event.progress || "");
          },
        );
      });

      console.log("✅ Image pulled successfully!");
    }

    console.log("🚀 Creating container...");
    const container = await docker.createContainer({
      Image: CAPSULE_IMAGE,
      ExposedPorts: {
        "80/tcp": {},
        "3000/tcp": {},
      },
      HostConfig: {
        PortBindings: {
          "80/tcp": [{ HostPort: "80" }],
          "3000/tcp": [{ HostPort: "3000" }],
        },
      },
      Env: Object.entries(envVariables).map(
        ([key, value]) => `${key}=${value}`,
      ),
      AttachStdout: false,
      AttachStderr: false,
    });

    await container.start();

    console.log("✅ Container started successfully!");

    let apiKey = await checkApiKey(container);

    console.log(`
🎉 Capsule is ready!
🔑 API Key: ${apiKey}
-- You can now use this key to connect to your Capsule.
🌐 Access your Capsule at: http://localhost:80
    `);
    process.exit(1);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

const checkImageExists = async (imageName: string): Promise<boolean> => {
  try {
    await docker.getImage(imageName).inspect();
    return true;
  } catch (error) {
    return false;
  }
};
