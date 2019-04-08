var gulp = require('flarum-gulp');

gulp({
  modules: {
    'empewoow/flarum-auth-redirect': [
      'src/**/*.js'
    ]
  }
});
