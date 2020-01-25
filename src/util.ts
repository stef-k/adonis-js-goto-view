'use strict';

import { workspace, TextDocument, Uri, ExtensionContext } from 'vscode';
import * as fs from "fs";
import * as path from "path";

export function getFilePath(text: string, document: TextDocument) {
  let paths = getFilePaths(text, document);
  return paths.length > 0 ? paths[0] : null;
}

export function getFilePaths(text: string, document: TextDocument) {
  // @ts-ignore
  let workspaceFolder = workspace.getWorkspaceFolder(document.uri).uri.fsPath;
  let config = workspace.getConfiguration('adonis_js_goto_view');
  let paths = scanViewPaths(workspaceFolder, config);
  let file = text.replace(/\"|\'/g, '').replace(/\./g, '/').split('::');
  let result = [];

  for (let item in paths) {
    let showPath = paths[item] + `/${file[0]}`;

    if (file.length > 1) {
      if (item !== file[0]) {
        continue;
      } else {
        showPath = paths[item] + `/${file[1]}`;
      }
    }
    for (let extension of config.extensions) {
      showPath = showPath + extension;
      let filePath = workspaceFolder + showPath;

      if (fs.existsSync(filePath)) {
        result.push({
          "name": item,
          "showPath": showPath,
          "fileUri": Uri.file(filePath)
        });
      }
    }
  }

  return result;
}

// @ts-ignore
function scanViewPaths(workspaceFolder, config) {
  let folders = Object.assign({}, config.folders);

  return folders;
}
