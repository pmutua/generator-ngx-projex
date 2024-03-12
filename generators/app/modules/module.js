import { execSync } from 'child_process';

// Function to create Angular modules
export function createModules(modules) {
    try {
        for (const module of modules) {
            const modulePath = `src/app/${module}/${module}.module.ts`;
            if (!fs.existsSync(modulePath)) {
                // If the module file doesn't exist, create it
                const moduleContent = `import { NgModule } from '@angular/core';\n\n@NgModule({\n  declarations: [],\n  imports: [],\n  exports: [],\n})\nexport class ${module}Module {}\n`;
                this.fs.write(modulePath, moduleContent);
                this.log(chalk.green(`Module ${module} created successfully.`));
            } else {
                this.log(chalk.yellow(`Module ${module} already exists.`));
            }
        }
    } catch (error) {
        this.log(chalk.red(`Error creating modules: ${error.message}`));
    }
}