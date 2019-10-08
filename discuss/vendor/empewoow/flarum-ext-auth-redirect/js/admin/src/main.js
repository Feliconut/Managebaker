import { extend } from 'flarum/extend';

import AuthSettingsModal from 'empewoow/flarum-auth-redirect/components/AuthSettingsModal';
import SessionDropdown from 'flarum/components/SessionDropdown';
import Button from 'flarum/components/Button';

// Initialize when app loads
app.initializers.add('empewoow-flarum-auth-redirect', () => {

  // I have no idea why this should be called "empewoow-auth-redirect"...
  app.extensionSettings['empewoow-auth-redirect'] = () => app.modal.show(new AuthSettingsModal());

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
          children: app.translator.trans('core.admin.header.log_out_button'),
          onclick: app.logoutWithRedirect.bind(app.session, app.forum.attribute('auth_logout_url'))
        }),
        -100
      );

    }

  });

});
