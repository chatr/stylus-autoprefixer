Package.describe({
    name: 'chatra:stylus-autoprefixer',
    version: '1.0.4',
    summary: 'Meteor build plugin to compile Stylus files with Autoprefixer',
    documentation: 'README.md',
    git: 'https://github.com/chatr/stylus-autoprefixer'
});

Package.registerBuildPlugin({
    name: 'chatra:stylus-autoprefixer',
    use: ['ecmascript@0.16.10'],
    sources: ['plugin.js'],
    npmDependencies: {
        stylus: '0.64.0',
        postcss: '8.5.1',
        autoprefixer: '10.4.20'
    }
});

Package.onUse((api) => {
    api.versionsFrom('3.0');
    api.use(['isobuild:compiler-plugin@1.0.0']);
});
