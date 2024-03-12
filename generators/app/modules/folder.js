import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Function to create folders
export async function createFolders(appName, logger) {
    logger('++++++++++++++++++++++++++++++++++++++++++++++++')
    logger(appName)
    const folders = [`${appName}/app/state`, `${appName}/app/services`, `${appName}/app/core`, `${appName}/app/shared`, `${appName}/app/pages`];
    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
            logger(chalk.green(`Created folder: ${folder}`));
        } else {
            logger(chalk.yellow(`Folder already exists: ${folder}`));
        }
    });
}


// Function to copy interceptors to the core/interceptors folder
// Function to copy interceptors to the core/interceptors folder
// Function to copy interceptors to the destination directory
export async function copyInterceptors(logger) {
    try {
        // Get the directory path of the current module
        const __dirname = path.dirname(new URL(import.meta.url).pathname);

        // Navigate up one level to the parent directory
        const parentDir = path.dirname(__dirname);

        // Define source and destination directories
        const interceptorsDir = path.join(parentDir, 'files');
        const coreInterceptorsDir = 'app/core/interceptors';

        // Check if source directory exists
        if (!fs.existsSync(interceptorsDir)) {
            throw new Error(`Source directory '${interceptorsDir}' does not exist.`);
        }

        // Check if destination directory exists, create it if not
        if (!fs.existsSync(coreInterceptorsDir)) {
            fs.mkdirSync(coreInterceptorsDir, { recursive: true });
            logger(chalk.green(`Created directory: ${coreInterceptorsDir}`));
        }

        // Copy interceptor files
        const files = fs.readdirSync(interceptorsDir);
        files.forEach(file => {
            const srcPath = path.join(interceptorsDir, file);
            const destPath = path.join(coreInterceptorsDir, file);
            fs.copyFileSync(srcPath, destPath);
            logger(chalk.green(`Copied interceptor '${file}' to '${coreInterceptorsDir}'.`));
        });
    } catch (error) {
        logger(chalk.red(`Error copying interceptors: ${error.message}`));
    }
}





// Function to generate a logging interceptor
function generateLoggingInterceptor() {
    const interceptorContent = `
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Logging interceptor activated.');
        return next.handle(req);
    }
}
`;
    return interceptorContent;
}

// Function to generate an authentication interceptor
function generateAuthInterceptor() {
    const interceptorContent = `
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Auth interceptor activated.');
        return next.handle(req);
    }
}
`;
    return interceptorContent;
}

// Function to generate an error interceptor
function generateErrorInterceptor() {
    const interceptorContent = `
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Error interceptor activated.');
        return next.handle(req).pipe(
            catchError(error => {
                console.error('Error occurred:', error);
                return throwError(error);
            })
        );
    }
}
`;
    return interceptorContent;
}

// Function to save interceptor content to a file
function saveInterceptorToFile(appName, interceptorName, interceptorContent) {
    const interceptorsDir = `${appName}/app/core/interceptors`;
    const interceptorFileName = `${interceptorName}.interceptor.ts`;
    const interceptorFilePath = path.join(interceptorsDir, interceptorFileName);

    // Create the interceptors directory if it doesn't exist
    if (!fs.existsSync(interceptorsDir)) {
        fs.mkdirSync(interceptorsDir, { recursive: true });
    }

    // Write interceptor content to the file
    fs.writeFileSync(interceptorFilePath, interceptorContent);

    return interceptorFilePath;
}

// Function to generate all interceptors
export async function generateInterceptors(appName, logger) {
    try {
        const loggingInterceptorContent = generateLoggingInterceptor();
        const authInterceptorContent = generateAuthInterceptor();
        const errorInterceptorContent = generateErrorInterceptor();

        const loggingInterceptorPath = saveInterceptorToFile(appName, 'logging', loggingInterceptorContent);
        const authInterceptorPath = saveInterceptorToFile(appName, 'auth', authInterceptorContent);
        const errorInterceptorPath = saveInterceptorToFile(appName, 'error', errorInterceptorContent);

        logger(chalk.green(`Logging interceptor generated and saved to: ${loggingInterceptorPath}`));
        logger(chalk.green(`Auth interceptor generated and saved to: ${authInterceptorPath}`));
        logger(chalk.green(`Error interceptor generated and saved to: ${errorInterceptorPath}`));
    } catch (error) {
        logger(chalk.red(`Error generating interceptors: ${error.message}`));
    }
}
