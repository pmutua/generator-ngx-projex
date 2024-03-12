import { execSync } from 'child_process';
import chalk from 'chalk';
import Generator from 'yeoman-generator';
import os from 'os';
import fs from 'fs';
import ComponentGenerator from '../component/index.js';


// import { generateComponents } from './modules/component.js';
import { createFolders, copyInterceptors , generateInterceptors} from './modules/folder.js';
// import { createModule } from './modules/module.js';
// import { updateConfig } from './modules/updater.js';

// Determine the operating system
const isWindows = os.platform() === 'win32';

export default class extends Generator {
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'appName',
                message: 'Enter your application name:',
                default: this.appname // Default to the project's folder name
            }
        ]);
    }

    async writing() {
        this.log('Generating Angular project...');
        // this.removeKarmaRelatedFiles();
        // this.installJest();
        // this.updateTsConfigSpec();
        // this.updateAngularJson();
        // this.createFolders();

        // Last thing to do (Any Angular related commands done Heere ) and EXIT
        // Change directory to the Angular project directory
        process.chdir(this.answers.appName);

        // Create shared and pages modules if they don't exist
        // await this.createModules(['shared', 'pages']);
        // Call Angular CLI to generate components
        // await this.generateComponents(['landing', '404', 'login', 'register'], 'pages');
        // this.generatePagesModule();



        // Create necessary folders
        await createFolders(this.log);

        await generateInterceptors(this.log)

        // Create Angular modules
        // createModule('shared');
        // createModule('pages');
        // createModule('modules');
        
        // Update configuration files
        // updateConfig(this.answers.appName);





        this.log('Angular project generated successfully.');
    }









    


    
    


}
