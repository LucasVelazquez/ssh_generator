const childProcess = require("child_process");

let email = "test@test.com";
let passphrase = "12345";
let fileName = "my_key";

const filePath = "~/.ssh";

function main() {
  const command = `ssh-keygen -f ${filePath}/${fileName} -t ed25519 -C "${email}" -N "${passphrase}";
  eval "$(ssh-agent -s)";
  ssh-add ${filePath}/${fileName}
  `;
  let result = childProcess.spawn(command, {
    env: {
      SSH_AUTH_SOCK: process.env.SSH_AUTH_SOCK,
      SSH_AGENT_PID: process.env.SSH_AGENT_PID,
    },
    shell: "C:\\Program Files\\Git\\bin\\bash.exe",
  });

  result.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  result.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
    if (data.includes("Enter passphrase")) {
      result.stdin.write(passphrase);
      result.stdin.end();
    }
  });

  result.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  result.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

main();
