import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
// Function to create Angular modules
export function createModules(modules, logger) {
    try {
        for (const module of modules) {
            const modulePath = `src/app/${module}/${module}.module.ts`;
            if (!fs.existsSync(modulePath)) {
                // If the module file doesn't exist, create it
                const moduleContent = `import { NgModule } from '@angular/core';\n\n@NgModule({\n  declarations: [],\n  imports: [],\n  exports: [],\n})\nexport class ${module}Module {}\n`;
                this.fs.write(modulePath, moduleContent);
                logger(chalk.green(`Module ${module} created successfully.`));
            } else {
                logger(chalk.yellow(`Module ${module} already exists.`));
            }
        }
    } catch (error) {
        logger(chalk.red(`Error creating modules: ${error.message}`));
    }
}