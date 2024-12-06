Package.describe({
    name: 'chatra:stylus-autoprefixer',
    version: '1.0.2',
    summary: 'Meteor build plugin to compile Stylus files with Autoprefixer',
    documentation: 'README.md',
    git: 'https://github.com/chatr/stylus-autoprefixer'
});

Package.registerBuildPlugin({
    name: 'chatra:stylus-autoprefixer',
    use: ['ecmascript@0.16.3'],
    sources: ['plugin.js'],
    npmDependencies: {
        stylus: '0.64.0',
        postcss: '8.4.49',
        autoprefixer: '10.4.20'
    }
});

Package.onUse((api) => {
    api.versionsFrom(['METEOR@2.8.0', '3.0']);
    api.use(['isobuild:compiler-plugin@1.0.0']);
});
