const { src, dest, watch, parallel, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const sync = require("browser-sync").create();


function generateCSS(cb) {
    src('./src/assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('public/css'))
        .pipe(sync.stream());
    cb();
}

function bootstrapCSS(cb) {
    src('node_modules/bootstrap/scss/bootstrap.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('public/css'))
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
        .pipe(dest("public"));
    cb();
}


function watchFiles(cb) {
    watch('./src/views/**.ejs', generateHTML);
    watch('./src/assets/sass/**.scss', generateCSS);
}


function browserSync(cb) {
    sync.init({
        server: {
            baseDir: "./public"
        }
    });

    watch('./src/views/**.ejs', generateHTML);
    watch('./src/assets/sass/**.scss', generateCSS);
    watch("./public/**.html").on('change', sync.reload);
}


exports.css = generateCSS;
exports.html = generateHTML;
exports.watch = watchFiles;
exports.sync = browserSync;
exports.bootstrap = bootstrapCSS;

exports.default = series(parallel(generateCSS,generateHTML,browserSync,bootstrapCSS));