'use strict';

const gulp = require('gulp'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass');

gulp.task('sass', () => {
	return gulp.src('sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('style'));
});

gulp.task('sass:watch', () => {
	gulp.watch('sass/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'sass:watch']);