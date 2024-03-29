let gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
uglify = require('gulp-uglify'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
del = require('del'),
autoprefixer = require('gulp-autoprefixer');
fileinclude = require('gulp-file-include');

// Этот таск служит для проверки изменений и перезагрузки браузера при изменении основного файла html
// но по факту не требуется - все изменения в основной файл вносит таск 'html'

// gulp.task('html-origignal', function(){
//     return gulp.src('app/*.html')
//     .pipe(browserSync.reload({stream: true}))
// });

gulp.task('html', function(){
    return gulp.src('app/html/*.html')
    .pipe(fileinclude({
		prefix: '@@'
	}))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css', function(){
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/choices.js/public/assets/styles/choices.css',
        'node_modules/flatpickr/dist/flatpickr.css',
        'node_modules/glightbox/dist/css/glightbox.css',
        'node_modules/swiper/css/swiper.css'
        
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss/'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('scss', function(){
    return gulp.src('app/scss/**/*.scss')
    // expanded - на выходе будет красивая классическая запись css стилей
    // compressed - на выходе будет сжатая запись (минифицированная)
    .pipe(sass({outputStyle: 'compressed'}))
    //мы задействуем плагин gulp-rename для переименования сжатого файла
    // он из стандартного имени файла style.css сделает style.min.css
    // при этом стандартный файл (style.css) обновлён не будет, 
    //только если вначале для него это явно не указать:
    // .pipe(sass({outputStyle: 'expanded'}))
    // .pipe(gulp.dest('app/css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 8 versions']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function() {
    return gulp.src([
// собирает js скрипты всех используемых библиотек, в отдельный минифицированный файл
// если нужно найти несколько файлов, расположенных по разным путям
// или просто в определённом порядке
// тогда добавляем квадратные скобки и в них через запятую перечисляем пути
        'node_modules/imask/dist/imask.min.js',
        'node_modules/choices.js/public/assets/scripts/choices.js',
        'node_modules/flatpickr/dist/flatpickr.js',
        'node_modules/glightbox/dist/js/glightbox.js',
        'node_modules/smooth-scroll/dist/smooth-scroll.polyfills.js',
        'node_modules/swiper/js/swiper.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('script', function(){
    return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('export', function(){
    let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

    let buildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

    let buildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));

    let buildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

    let buildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});

// async - выполнится первой
gulp.task('clean', async function(){
    del.sync('dist')
});

gulp.task('watch', function(){
    // gulp.watch('app/*.html', gulp.parallel('html-origignal'))
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
    gulp.watch('app/html/**/*.html', gulp.parallel('html'))
    gulp.watch('app/js/*.js', gulp.parallel('script'))
});

gulp.task('build', gulp.series('clean', 'export'));

gulp.task('default', gulp.parallel('scss', 'browser-sync', 'watch'))

// 'css', 'js'
// убрал таск css из default. Ни к чему каждый раз записывать одно и то же в _libs
// если не добавляются css файлы от других библиотек
// по этой же причине из default убран таск js - их всегда можно позже запустить вручную
// это задачи которые запускаются по дефолту в начале работы
// Таск js собирает все библиотеки в один файл и помещает их в папку app/js 
// а уже потом за изменением всех файлов js в папке app/js следит таск script 'он прописан watch'
// и обновляет браузер

// !!! ВАЖНО !!! 
// В начале нового проекта, после установки gulp и плагинов из package.json
// нужно вручную запустить таски CSS, SCSS и JS, чтобы выполнить необходимые слияния
// предварительно в тасках нужно изменить пути, добавить новые или удалить старые
// в зависимости от используемых библиотек

// таск BUILD всегда запускается вручную, на выходе только необходимые файлы для прода