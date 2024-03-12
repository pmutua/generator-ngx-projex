import { execSync } from 'child_process';

// Function to update configuration files
export function updateConfig(appName) {
    try {
        // Implement configuration file updates here
        // For example, updating angular.json or package.json
        console.log(chalk.green('Configuration files updated successfully.'));
    } catch (error) {
        console.log(chalk.red(`Error updating configuration files: ${error.message}`));
    }
    
}



export function karmafilesExist() {
    const karmaConfPath = this.destinationPath(`${this.answers.appName}/karma.conf.js`);
    const testPath = this.destinationPath(`${this.answers.appName}/src/test.ts`);
    return fs.existsSync(karmaConfPath) || fs.existsSync(testPath);
}

export function removeKarmaRelatedFiles() {
    const command = isWindows ? `del karma.conf.js src\\test.ts` : `rm ./karma.conf.js ./src/test.ts`;
    try {
        execSync(`cd ${this.answers.appName} && npm remove karma karma-chrome-launcher karma-coverage-istanbul-reporter karma-jasmine karma-jasmine-html-reporter`);
        execSync(`cd ${this.answers.appName} && ${command}`, { stdio: 'inherit' });
        if (!this.karmafilesExist()) {
            this.log(chalk.green('Karma related files removed successfully.'));
        } else {
            this.log(chalk.red('Error: Karma related files were not removed.'));
        }
    } catch (error) {
        this.log(chalk.red(`Error removing Karma related files: ${error.message}`));
    }
}





export function updateAngularJson() {
    const angularJsonPath = this.destinationPath(`${this.answers.appName}/angular.json`);
    const angularJson = this.fs.readJSON(angularJsonPath);
    try {
        angularJson.projects[this.answers.appName].architect.test.builder = '@angular-builders/jest:run';
        angularJson.projects[this.answers.appName].architect.test.options.inlineStyleLanguage = ["scss"];
        this.fs.writeJSON(angularJsonPath, angularJson);
        this.log(chalk.green('Updated angular.json'));
    } catch (error) {
        this.log(chalk.red(`Error updating angular.json: ${error.message}`));
    }
}


export function updateTsConfigSpec() {
    const tsConfigPath = this.destinationPath(`${this.answers.appName}/tsconfig.spec.json`);
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
        this.fs.write(tsConfigPath, tsConfigContent);
        this.log(chalk.green('Updated tsconfig.spec.json'));
    } catch (error) {
        this.log(chalk.red(`Error updating tsconfig.spec.json: ${error.message}`));
    }
}


export function installJest() {
    try {
        execSync(`cd ${this.answers.appName} && npm i -D jest @types/jest @angular-builders/jest`);
        this.log(chalk.green('Jest and related dependencies installed successfully.'));
    } catch (error) {
        this.log(chalk.red(`Error installing Jest: ${error.message}`));
    }
}

