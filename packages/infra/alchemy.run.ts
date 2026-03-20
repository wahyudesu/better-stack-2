import alchemy from "alchemy";
import { Nextjs } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("better-stack-2");

export const web = await Nextjs("web", {
  cwd: "../../apps/web",
  vars: {
    NEXT_PUBLIC_SERVER_URL: "", // Empty for relative URLs, auto-detected by Cloudflare
  },
  bindings: {
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN,
  },
  dev: {
    env: {
      PORT: "3001",
    },
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
