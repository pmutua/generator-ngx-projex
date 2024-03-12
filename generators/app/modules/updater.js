import { exec } from 'child_process'; // Using child_process.exec for asynchronous execution
import chalk from 'chalk';
import Generator from 'yeoman-generator';

import os from 'os';

const isWindows = os.platform() === 'win32';

export default class BoilerplateConfig extends Generator {
  async updateConfig(appName) {
    try {
      await this._removeKarmaRelatedFiles(appName);
      await this._installJest(appName);
      await this._updateTsConfigSpec(appName);
      await this._updateAngularJson(appName);
      this.log(chalk.green('Configuration files updated successfully.'));
    } catch (error) {
      this.log(chalk.red(`Error updating configuration files: ${error.message}`));
    }
  }

