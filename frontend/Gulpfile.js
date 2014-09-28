var gulp = require('gulp'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat');

gulp.task('jade', function() {
  gulp.src(['./**/*.jade', '!./node_modules/**'])
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('bower', function() {
  gulp.src('./bower_components/**').pipe(gulp.dest('./dist/bower_components/'));
});

gulp.task('js', function() {
  gulp.src('./js/*').pipe(gulp.dest('./dist/js/'));
});

gulp.task('css', function() {
  gulp.src('./css/*').pipe(gulp.dest('./dist/css/'));
});

gulp.task('watch', function() {
  gulp.watch('./js/*', 'js')
})

gulp.task('default', ['jade', 'bower', 'js', 'css']);
