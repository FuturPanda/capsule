#!/usr/bin/env node
import { Command } from "commander";
import Docker from "dockerode";
import { launchCapsule } from "./launch-capsule";

export const docker = new Docker();
export const program = new Command();

program.name('Capsuler').description('CLI for Capsule').version('0.0.1');

program
  .command('launch')
  // .alias('')
  .description('Pull a Docker image')
  .action(async () => launchCapsule());

// program
//   .arguments("<numbers...>")
//   .action((numbers: number[], opts: { capitalize?: boolean }) => {
//     if (opts.capitalize) console.log(`CAPSULER IS THE WORST`);
//     else console.log(`Capsuler is the worst`);
//   })
//   .option("-c, --capitalize", "Capitalize the message");
//
// program
//   .command("print <string>")
//   .action((text: string) => {
//     console.log(`Capsuler is the best, ${text}`);
//   })
//   .description("Basic usage");
