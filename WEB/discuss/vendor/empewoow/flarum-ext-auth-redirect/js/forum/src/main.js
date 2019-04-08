import { extend } from 'flarum/extend';

import HeaderSecondary from 'flarum/components/HeaderSecondary';
import SessionDropdown from 'flarum/components/SessionDropdown';
import Button from 'flarum/components/Button';
import SettingsPage from 'flarum/components/SettingsPage';

// Initialize when app loads
app.initializers.add('empewoow-flarum-auth-redirect', () => {

  extend(HeaderSecondary.prototype, 'items', function(items) {
    if (items.has('session')) {
      //console.log('We have a session, do nothing!');
    } else {
      //console.log('Does not have a session!');

      // Remove some buttons
      //console.log(app.forum.attribute('auth_disable_login') + ' ' + app.forum.attribute('auth_disable_signup'));
      if (app.forum.attribute('auth_disable_login') == '1') {
        //console.log('Remove login button!');
        items.remove('logIn');
      }
      if (app.forum.attribute('auth_disable_signup') == '1') {
        //console.log('Remove signup button!');
        items.remove('signUp');
      }

      // If our redirect URL is not empty
      if (app.forum.attribute('auth_redirect_url') != '') {
        // Redirect to our login system!
        window.location = app.forum.attribute('auth_redirect_url');
      }
    }
  });

  // Change logout button URL
  extend(SessionDropdown.prototype, 'items', function(items){

    // If our logout URL is not empty
    if (app.forum.attribute('auth_logout_url') != '') {

      // Our logout and redirect function
      app.logoutWithRedirect = function(url) {
        //console.log(app.forum.attribute("baseUrl") + "/logout?token=" + this.csrfToken + "&return=" + url);
        window.location = app.forum.attribute("baseUrl") + "/logout?token=" + this.csrfToken + "&return=" + url;
      }

      // Remove existing button first
      items.remove('logOut');

      // Add our own button
      items.add('logOut',
        Button.component({
          icon: 'sign-out',
          children: app.translator.trans('core.forum.header.log_out_button'),
          onclick: app.logoutWithRedirect.bind(app.session, app.forum.attribute('auth_logout_url'))
        }),
        -100
      );

    }

  });

  // Remove change e-mail functionality
  extend(SettingsPage.prototype, 'accountItems', function(items) {
    if (app.forum.attribute('auth_disable_change_email') == '1') {
      items.remove('changeEmail');
    }
  });

});
