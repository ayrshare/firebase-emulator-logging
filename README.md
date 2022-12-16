# Firebase Emulator Logging

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

Firebase emulator logging is, well, kind of messy. This node app helps clean up the logs with colors, pretty formatting, and quiet to remove data you don't care about.

1. When running the emulator, save the output to a file. For example: `npm run serve > save.txt`.
2. Run the Firebase Emulator Logging app with the file as input. `node index.js --file ./save.txt`

Enjoy the logging!

## Parameters

| Paremeter | Description                                                                     | Required |
| --------- | ------------------------------------------------------------------------------- | -------- |
| --file    | Location of the Firebase emulator saved output                                  | Yes      |
| --quiet   | Remove lines with "function, hosting, storage, and pubsub" to clean up the logs | No       |
| --pretty  | Turn off pretty formatting of the logs. Default 'true'                          | No       |
