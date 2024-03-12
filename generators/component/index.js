import Generator from 'yeoman-generator';

export default class ComponentGenerator extends Generator  {
    // Constructor
    constructor(args, opts) {
        super(args, opts);
    }

    // Prompting method
    async prompting() {
        // You can prompt for component name or other options here
        const answers = await this.prompt([
            {
                type: 'input',
                name: 'componentName',
                message: 'Enter the name of the component:',
                default: 'MyComponent'
            }
        ]);

        this.componentName = answers.componentName;
    }

    // Writing method
    writing() {
        // Generate the component files
        this.fs.copyTpl(
            this.templatePath('component.template.ts'),
            this.destinationPath(`src/app/components/${this.componentName}/${this.componentName}.component.ts`),
            { componentName: this.componentName }
        );

        // You can generate other files like HTML, CSS, tests, etc. here
    }
};
