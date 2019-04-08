import SettingsModal from 'flarum/components/SettingsModal';

export default class AuthSettingsModal extends SettingsModal {
  className() {
    return 'AuthSettingsModal Modal--small';
  }

  title() {
    return app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.title');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.redirect_url')}</label>
        {app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.redirect_url_instructions')}
        <input className="FormControl" bidi={this.setting('empewoow-flarum-auth-redirect.auth_redirect_url')}/>
        <br/>
        <label>{app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.logout_url')}</label>
        {app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.logout_url_instructions')}
        <input className="FormControl" bidi={this.setting('empewoow-flarum-auth-redirect.auth_logout_url')}/>
        <br/>
        <label className="checkbox"><input type="checkbox" bidi={this.setting('empewoow-flarum-auth-redirect.auth_disable_login')}/>{app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.disable_login')}</label>
        <br/>
        <label className="checkbox"><input type="checkbox" bidi={this.setting('empewoow-flarum-auth-redirect.auth_disable_signup')}/>{app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.disable_signup')}</label>
        <br/>
        <label className="checkbox"><input type="checkbox" bidi={this.setting('empewoow-flarum-auth-redirect.auth_disable_change_email')}/>{app.translator.trans('empewoow-flarum-auth-redirect.admin.auth_settings.disable_change_email')}</label>
      </div>
    ];
  }
}
