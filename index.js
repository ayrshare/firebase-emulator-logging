import readline from "readline";
import TailFile from "@logdna/tail-file";
import colorizer from "json-colorizer";

const QUIET_STRING = ["functions", "hosting", "storage", "pubsub"];

const quiet = process.argv.indexOf("--quiet");
const prettyOff = process.argv.indexOf("--pretty-off");
const fileIndex = process.argv.indexOf("--file");

if (fileIndex <= -1 || !process.argv[fileIndex + 1]) {
  console.error(
    "You seem to be missing the --file argument. Please provide a file to tail."
  );
  process.exit(1);
}

const options = {
  pretty: prettyOff <= -1 ? true : false,
  colors: { STRING_LITERAL: "white" },
};

async function startTail() {
  const tail = new TailFile(process.argv[fileIndex + 1]).on(
    "tail_error",
    (err) => {
      console.error("TailFile had an error!", err);
    }
  );

  try {
    await tail.start();
    const linesplitter = readline.createInterface({
      input: tail,
    });

    linesplitter.on("line", (line) => {
      if (
        quiet &&
        QUIET_STRING.some((str) =>
          new RegExp(`(?<=^...)(.*)${str}`, "gm").test(line)
        )
      )
        return;

      let newLine = line;
      if (newLine.startsWith(">") && newLine.endsWith("}")) {
        const overrideOptions = { ...options };

        try {
          const json = JSON.parse(newLine.slice(3));
          switch (json?.severity) {
            case "INFO":
              overrideOptions.colors.STRING_KEY = "blue";
              overrideOptions.colors.BRACE = "blue";
              break;
            case "WARNING":
              overrideOptions.colors.STRING_KEY = "yellow";
              overrideOptions.colors.BRACE = "yellow";
              break;
            case "ERROR":
              overrideOptions.colors.STRING_KEY = "red";
              overrideOptions.colors.BRACE = "red";
              break;
            default:
              break;
          }

          newLine = colorizer(newLine.slice(3), overrideOptions);
        } catch (err) {
          // ignore
        }
      }
      
      console.log(newLine);
    });
  } catch (err) {
    console.error("Cannot start. Does the file exist?", err);
  }
}

startTail().catch((err) => {
  process.nextTick(() => {
    throw err;
  });
});
