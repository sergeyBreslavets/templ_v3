'use strict';


var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    stripDebug = require("gulp-strip-debug"),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gulpsync = require('gulp-sync')(gulp),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync');

var path = {
    build: {
        html: 'www/',
        js: 'www/assets/js/',
        css: 'www/assets/css/',
        images: 'www/assets/images/',
        fonts: 'www/assets/fonts/',
        fontBs: 'www/assets/fonts/bootstrap/',
        sprite: 'www/assets/images/sprite/',
        spriteScss: 'src/style/'
    },
    src: {
        html: 'src/html/*.html',
        js: [
            // 'bower_components/modernizr/modernizr.js',
            'src/js/modernizr.js',
            'bower_components/jquery/dist/jquery.js',


            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
            'bower_components/wow/dist/wow.min.js',
            'bower_components/jquery-bar-rating/dist/jquery.barrating.min.js',
            'src/js/main.js',

        ],
        style: 'src/style/styles.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        fontsBs: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*.*',
        fontsAwesome: 'bower_components/components-font-awesome/fonts/*.*',
        sprite: 'src/sprite/*.*'
    },
    watch: {
        html: 'src/html/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprite: 'src/sprite/*.*'
    },
    clean: './www/assets'
};

var configweb = {
    server: {
        baseDir: "./www"
    },
    tunnel: true,
    host: 'templ',
    port: 8080,
    logPrefix: "Frontend"
};

// Очистка папок и файлов
gulp.task('clean:build', function() {
    return gulp.src(path.clean, { read: false })
        .pipe(clean());
});

gulp.task('html:build', function() {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));
});


// Компиляция sass, сборка стилей
gulp.task('sass:build', function() {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(notify({
            title: 'SASS',
            message: 'COMPLITE'
        }))
        .pipe(browserSync.reload({ stream: true }));
});

// Компиляция sass, сборка стилей без карты
gulp.task('sass:prod', function() {
    return gulp.src(path.src.style)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));
});


gulp.task('js:build', function() {
    return gulp.src(path.src.js)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js:prod', function() {
    return gulp.src(path.src.js)
        .pipe(concat('main.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('img:build', function() {
    gulp.src(path.src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.images))
        .pipe(browserSync.reload({ stream: true }));
});


gulp.task('webserver', function() {
    browserSync(configweb);
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(notify({
            title: 'fonts',
            message: 'fonts copy Complite'

        }));
});

gulp.task('fontsbs:build', function() {
    return gulp.src([path.src.fontsBs, path.src.fontsAwesome])
        .pipe(gulp.dest(path.build.fontBs))
        .pipe(notify({
            title: 'fonts bs',
            message: 'fonts bs copy Complite'

        }));
});

// Режим разработки

gulp.task('dev', gulpsync.sync([
    ['html:build',
        'img:build',
        'js:build',
        'sass:build',
        'fonts:build',
        'fontsbs:build'
    ],


    'watch',
    'webserver'
]));

// Режим production

gulp.task('prod', gulpsync.sync([
    'html:build',
    'img:build',
    'js:prod',
    'sass:prod',
    'fonts:build',
    'fontsbs:build'
]));


// watch-таска
gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.images], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('sass:build');
    });
});