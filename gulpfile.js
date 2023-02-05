const { src, dest, watch, parallel, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const sync = require("browser-sync").create();
var rtlcss = require('gulp-rtlcss');

function generateRTL(cb){
    src('./src/assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rtlcss())
        .pipe(dest('./docs/css/rtl/'))
        .pipe(sync.stream());
    cb();
}

function generateImgs(cb) {
    src('./src/assets/imgs/**')
        .pipe(dest('./docs/imgs'))
        .pipe(sync.stream());
    cb();
}

function generateCSS(cb) {
    src('./src/assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./docs/css'))
        .pipe(sync.stream());
    cb();
}

function bootstrapCSS(cb) {
    src('node_modules/bootstrap/scss/bootstrap.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./docs/css'))
        .pipe(sync.stream());
    cb();
}

function fontawesomeCSS(cb) {
    src('node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./docs/css'))
        .pipe(sync.stream());
    cb();
}

function fontawesomeJS(cb) {
    src('node_modules/@fortawesome/fontawesome-free/js/fontawesome.min.js')
        .pipe(dest('./docs/js'))
        .pipe(sync.stream());
    cb();
}

function generateWebfonts(cb) {
    src('./src/assets/webfonts/**')
        .pipe(dest('./docs/webfonts'))
        .pipe(sync.stream());
    cb();
}

function bootstrapJS(cb) {
    src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('./docs/js'))
        .pipe(sync.stream());
    cb();
}


function generateHTML(cb) {
    src("./src/views/index.ejs")
        .pipe(ejs({
            title: "Hello Semaphore CI!",
        }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(dest("./docs"));
    cb();
}


function watchFiles(cb) {
    watch('./src/views/**.ejs', generateHTML);
    watch('./src/assets/sass/**.scss', generateCSS);
    watch('./src/assets/sass/**.scss', generateRTL);
    watch('node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss', fontawesomeCSS);
    watch('./src/assets/imgs/**', generateImgs);
    watch('./src/assets/webfonts/**', generateWebfonts);
    watch('./src/assets/js/**', fontawesomeJS);
}


function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./docs"
        }
    });

    watch('./src/views/**.ejs', generateHTML);
    watch('./src/assets/sass/**.scss', generateCSS);
    watch('./src/assets/sass/**.scss', fontawesomeCSS);
    watch('./src/assets/sass/**.scss', generateRTL);
    watch('./src/assets/imgs/**', generateImgs);
    watch('./src/assets/webfonts/**', generateWebfonts);
    watch('./src/assets/js/**', fontawesomeJS);
    watch("./docs/**.html").on('change', sync.reload);
}


exports.css = generateCSS;
exports.html = generateHTML;
exports.watch = watchFiles;
exports.sync = browserSync;
exports.bootstrapCSS = bootstrapCSS;
exports.rtlCSS = generateRTL;
exports.imgs = generateImgs;
exports.bootstrapJS = bootstrapJS;
exports.fontawesomeCSS = fontawesomeCSS;
exports.generateWebfonts = generateWebfonts;
exports.fontawesomeJS = fontawesomeJS;

exports.default = series(parallel(fontawesomeJS,generateWebfonts,fontawesomeCSS,generateCSS,generateRTL,generateHTML,browserSync,bootstrapCSS,generateImgs,bootstrapJS));