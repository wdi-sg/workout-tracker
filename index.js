#!/usr/bin/env node


const pckg = require("./package.json");
const program = require("commander");


const {client} = require("./lib/config");
const add = require("./lib/add");
const show = require("./lib/show");
const edit = require("./lib/edit");
// const remove = require("./lib/remove");


program.version(pckg.version); // todo --version => display version

client.connect();

program
  .command("add <distance> <name>")
  .alias("a")
  .description("Set distance of difficulty type.")
  .action((distance, name) => {
    add(distance, name);
  });

program
  .command("show")
  .alias("s")
  .description("Lists all workouts.")
  .action(() => {
    show();
  });

program
  .command("complete <id> <time>")
  .alias("c")
  .description("Modify database when a workout is completed.")
  .action((id, time) => {
    edit(id, time);
  });

// program
//   .command("remove <id>")
//   .alias("r")
//   .description("Remove todo from list.")
//   .action((id) => {
//     remove(id);
//   });

program.parse(process.argv); // get arv
