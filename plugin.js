import {createRequire} from 'node:module';
import path from 'path';
import stylus from 'stylus';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';


/**
 * Compiler class that handles the compilation of Stylus files,
 * applies Autoprefixer, and integrates with Meteor's build system.
 */
class StylusAutoprefixerCompiler {
    constructor() {
        this.cache = new Map();
        this.config = void 0;
        try {
            const require = createRequire(process.cwd());
            this.config = require(path.join(process.cwd(), 'stylus.config.js'));
        } catch (err) {}
    }

    /**
     * Processes Stylus files and compiles them into CSS.
     * Applies Autoprefixer for vendor prefixing.
     *
     * @param {Array} files - Array of file objects to process.
     */
    async processFilesForTarget(files) {
        const promises = files.map(file => this.processFile(file));
        // Wait for all files to be processed
        return Promise.all(promises);
    }

    /**
     * Processes a single Stylus file: compiles to CSS and applies Autoprefixer.
     *
     * @param {Object} file - The Stylus file to process.
     * @returns {Promise} - Resolves when processing is complete.
     */
    async processFile(file) {
        const filePath = file.getPathInPackage(); // Get the file path within the package
        const source = file.getContentsAsString(); // Read the file contents
        try {
            // Check cache to see if file has changed
            const cacheKey = `${filePath}-${file.getSourceHash()}`;
            if (this.cache.has(cacheKey)) {
                // Retrieve cached result
                const cachedResult = this.cache.get(cacheKey);
                file.addStylesheet({
                    path: filePath.replace('.styl', '.css'),
                    data: cachedResult.css,
                });
                return;
            }

            // Compile Stylus to CSS
            const {css, sourcemap} = await this.compileStylus(source, filePath);

            // Apply Autoprefixer
            const prefixed = await this.applyAutoprefixer(css, sourcemap, filePath);

            // Cache the result for future builds
            this.cache.set(cacheKey, {
                css: prefixed.css,
            });

            // Add the compiled CSS to Meteor's build system
            file.addStylesheet({
                path: filePath.replace('.styl', '.css'),
                data: prefixed.css,
            });
        } catch (error) {
            // Handle and report errors gracefully
            file.error({
                message: error.message,
                line: error.line || null,
                column: error.column || null,
            });
        }
    }

    /**
     * Compiles Stylus source code to CSS.
     *
     * @param {string} source - Stylus source code.
     * @param {string} filePath - Name of the Stylus file.
     * @returns {Promise<string>} - Compiled CSS and source map.
     */
    async compileStylus(source, filePath) {
        return new Promise((resolve, reject) => {
            const processor = stylus(source)
                .set('filename', filePath)
                .set('sourcemap', { inline: false });

            this.config?.includePaths?.forEach((includePath) => {
                processor.include(includePath);
            });

            this.config?.importFiles?.forEach((importFile) => {
                processor.import(importFile);
            });

            Object.entries(this.config?.stylusOptions || {}).forEach(([key, value]) => {
                processor.set(key, value);
            });

            processor.render((err, css) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({css, sourcemap: processor.sourcemap});
                }
            });
        });
    }

    /**
     * Applies Autoprefixer to the compiled CSS.
     *
     * @param {string} css - Compiled CSS from Stylus.
     * @param {string} sourcemap - Sourcemap from Stylus.
     * @param {string} filePath - Name of the Stylus file.
     * @returns {Promise<Object>} - Object containing prefixed CSS.
     */
    async applyAutoprefixer(css, sourcemap, filePath) {
        return postcss([autoprefixer])
            .process(css, {
                from: filePath,
                to: filePath.replace('.styl', '.css'),
                map: {
                    prev: sourcemap,
                    inline: true,
                },
            })
            .then(result => ({
                css: result.css
            }));
    }
}

/**
 * Registers a new compiler for '.styl' files.
 */
Plugin.registerCompiler({
    extensions: ['styl'],
}, () => new StylusAutoprefixerCompiler());
