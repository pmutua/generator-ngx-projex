import { execSync } from 'child_process';
import chalk from 'chalk';

// Function to generate Angular components
export async function generateComponents(components, module) {
    try {
        if (!Array.isArray(components)) {
            throw new Error('Components must be an array.');
        }

        for (const component of components) {
            const command = `ng generate component ${component} --module=${module}`;
            execSync(command, { stdio: 'inherit' });
            console.log(chalk.green(`Component ${component} generated successfully and added to module ${module}.`));
        }
    } catch (error) {
        console.log(chalk.red(`Error generating components: ${error.message}`));
    }
}


