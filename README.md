# Meteor Stylus Autoprefixer

![Version](https://img.shields.io/badge/meteor-2.x%20|%203.x-brightgreen?logo=meteor&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

A custom Meteor build plugin for compiling Stylus (`.styl`) files into CSS, automatically adding vendor prefixes with Autoprefixer, and supporting Hot Module Replacement (HMR) for an enhanced development experience.

---

## Installation

To add the plugin to your Meteor project, use the following command:

```bash
meteor add chatra:stylus-autoprefixer
```

Ensure that the `standard-minifier-css` package is installed to handle CSS minification in production:

```bash
meteor add standard-minifier-css
```

---

## Usage

Once installed, the plugin automatically processes all `.styl` files in your Meteor project. No additional configuration is required for basic usage.

---

## Configuration

For advanced configurations, you can create a `stylus.config.js` file in the root of your Meteor project. This file allows you to customize paths, global imports, and additional Stylus compilation options.

### Example `stylus.config.js`

```javascript
const path = require('path');

module.exports = {
    // Paths to search for files when using @import
    includePaths: [
        path.join(process.cwd(), 'client/styles/stylus/'),
        path.join(process.cwd(), 'shared/styles/'),
    ],

    // Files to automatically import in every Stylus file
    importFiles: ['vars', 'mixins'],

    // Additional Stylus compilation options
    stylusOptions: {
        'include css': true, // Allow importing plain CSS files
    },
};
```

---

## License

This package is licensed under the MIT License.

