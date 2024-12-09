// @ts-ignore
import Docker from "dockerode";

export const checkApiKey = async (
  container: Docker.Container,
  timeout = 30000,
) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Timeout waiting for API key"));
    }, timeout);

    container.logs(
      {
        follow: true,
        stdout: true,
        stderr: true,
      },
      (err, stream) => {
        if (err) {
          clearTimeout(timeoutId);
          reject(err);
          return;
        }

        if (stream) {
          stream.on("data", (chunk: Buffer) => {
            const log = chunk.toString("utf8");
            if (log.includes("API Key")) {
              const apiKey = log.split("API Key:")[1]?.trim();

              if (apiKey) {
                try {
                  const decoded = JSON.parse(
                    Buffer.from(apiKey, "base64").toString(),
                  );
                  if (decoded.baseUrl && decoded.email && decoded.password) {
                    clearTimeout(timeoutId);
                    resolve(apiKey);
                  }
                } catch (error) {
                  console.log(
                    "Invalid API key format, continuing to listen...",
                  );
                }
              }
            }
          });

          stream.on("error", (err) => {
            clearTimeout(timeoutId);
            reject(err);
          });

          stream.on("end", () => {
            clearTimeout(timeoutId);
            reject(new Error("Stream ended without finding API key"));
          });
        } else {
          clearTimeout(timeoutId);
          reject(new Error("No stream available"));
        }
      },
    );
  });
};
