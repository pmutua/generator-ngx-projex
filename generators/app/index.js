import { exec, execSync } from "child_process";
import chalk from "chalk";
import Generator from "yeoman-generator";
import os from "os";
import fs from 'fs'
import path from "path";

import { generateComponents } from "./modules/component.js";
import { createFolders, generateInterceptors } from "./modules/folder.js";
import { createModules } from "./modules/module.js";

const isWindows = os.platform() === "win32";

export default class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "appName",
        message: "Enter your application name:",
        default: this.appname, // Default to the project's folder name
      },
    ]);
  }

  // async configuring() {

  // }

  async writing() {
    // Check if the Angular project already exists
    const projectPath = path.join(this.destinationRoot(), this.answers.appName);

    const projectExists = fs.existsSync(projectPath);

    if (!projectExists) {
      // Create the Angular project if it doesn't exist
      this.log("Generating Angular project...");
      execSync(
        `ng new ${this.answers.appName} --routing --style=scss --no-standalone`,
        { stdio: "inherit" }
      );
    } else {
      this.log("Angular project already exists, skipping project creation.");
    }

    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    await createFolders(this.answers.appName, this.log);
    await generateInterceptors(this.answers.appName, this.log);

    ///////////////////////////////CONFIGURATION
    await this._removeKarmaRelatedFiles(this.answers.appName);
    await this._installJest(this.answers.appName);
    await this._updateTsConfigSpec(this.answers.appName);
    await this._updateAngularJson(this.answers.appName);

    // Last thing to do (Any Angular related commands done Here ) and EXIT
    // Change directory to the Angular project directory
    process.chdir(this.answers.appName);

    // Create shared and pages modules if they don't exist
    // createModules(['shared', 'pages'], this.log);
    // Call Angular CLI to generate components
    // await generateComponents(['landing', '404', 'login', 'register'], 'pages', this.log);

    this.log("Angular project generated successfully.");
  }

  async _installJest(appName) {
    try {
      const installProcess = exec(
        `cd ${appName} && npm i -D jest @types/jest @angular-builders/jest`
      );
      await installProcess;
      this.log(
        chalk.green("Jest and related dependencies installed successfully.")
      );
    } catch (error) {
      this.log(chalk.red(`Error installing Jest: ${error.message}`));
    }
  }

  async _removeKarmaRelatedFiles(appName) {
    const command = isWindows
      ? `del karma.conf.js src\\test.ts`
      : `rm ./karma.conf.js ./src/test.ts`;
    const removeProcess = exec(
      `cd ${appName} && npm remove karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter`
    );
    const deleteProcess = exec(`cd ${appName} && ${command}`, {
      stdio: "inherit",
    });
    await Promise.all([removeProcess, deleteProcess]);

    if (!this.karmafilesExist(appName)) {
      this.log(chalk.green("Karma related files removed successfully."));
    } else {
      this.log(chalk.red("Error: Karma related files were not removed."));
    }
  }

  karmafilesExist(appName) {
    const karmaDir = this.destinationPath(`${appName}`);
    return fs.existsSync(karmaDir);
  }

  async _updateAngularJson(appName) {
    const angularJsonPath = this.destinationPath(
      `${this.answers.appName}/angular.json`
    );

    try {
      const angularJson = await fs.readJSON(angularJsonPath);
      angularJson.projects[appName].architect.test.builder =
        "@angular-builders/jest:run";
      angularJson.projects[appName].architect.test.options.inlineStyleLanguage =
        ["scss"];
      await fs.writeJSON(angularJsonPath, angularJson);
      this.log(chalk.green("Updated angular.json"));
    } catch (error) {
      this.log(chalk.red(`Error updating angular.json: ${error.message}`));
    }
  }

  async _updateTsConfigSpec(appName) {
    const tsConfigPath = this.destinationPath(`${appName}/tsconfig.spec.json`);
    const tsConfigContent = `/* To learn more about this file see: https://angular.io/config/tsconfig. */
      {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "./out-tsc/spec",
        "types": [
          "jest",
          "node"
        ]
      },
      "files": [
        "src/setup-jest.ts"
      ],
      "include": [
        "src/**/*.spec.ts",
        "src/**/*.d.ts"
      ]
      }`;

    try {
      await fs.write(tsConfigPath, tsConfigContent);
      this.log(chalk.green("Updated tsconfig.spec.json"));
    } catch (error) {
      this.log(
        chalk.red(`Error updating tsconfig.spec.json: ${error.message}`)
      );
    }
  }
}
