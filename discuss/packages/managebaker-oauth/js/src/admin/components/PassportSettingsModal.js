import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';

export default class PassportSettingsModal extends SettingsModal {

    title() {
        return app.translator.trans('managebaker-oauth.admin.popup.title');
    }

    form() {
        return [
            
            m('div', {
                className: 'Form-group'
            }, [
                m('label', {
                    for: 'oauth-app-auth-url'
                }, app.translator.trans('managebaker-oauth.admin.popup.field.app-auth-url')),
                m('input', {
                    id: 'oauth-app-auth-url',
                    className: 'FormControl',
                    bidi: this.setting('managebaker.oauth.app_auth_url')
                })
            ]),
            m('div', {
                className: 'Form-group'
            }, [
                m('label', {
                    for: 'oauth-app-token-url'
                }, app.translator.trans('managebaker-oauth.admin.popup.field.app-token-url')),
                m('input', {
                    id: 'oauth-app-token-url',
                    className: 'FormControl',
                    bidi: this.setting('managebaker.oauth.app_token_url')
                })
            ]),
            m('div', {
                className: 'Form-group'
            }, [
                m('label', {
                    for: 'oauth-app-user-url'
                }, app.translator.trans('managebaker-oauth.admin.popup.field.app-user-url')),
                m('input', {
                    id: 'oauth-app-user-url',
                    className: 'FormControl',
                    bidi: this.setting('managebaker.oauth.app_user_url')
                })
            ]),
            m('div', {
                className: 'Form-group'
            }, [
                m('label', {
                    for: 'oauth-app-id'
                }, app.translator.trans('managebaker-oauth.admin.popup.field.app-id')),
                m('input', {
                    id: 'oauth-app-key',
                    className: 'FormControl',
                    bidi: this.setting('managebaker.oauth.app_id')
                })
            ]),
            m('div', {
                className: 'Form-group'
            }, [
                m('label', {
                    for: 'oauth-app-secret'
                }, app.translator.trans('managebaker-oauth.admin.popup.field.app-secret')),
                m('input', {
                    id: 'oauth-app-secret',
                    className: 'FormControl',
                    bidi: this.setting('managebaker.oauth.app_secret')
                })
            ]),

            m('div', {
                className: 'Form-group'
            }, [
                m('label', {
                    for: 'oauth-app-scopes'
                }, app.translator.trans('managebaker-oauth.admin.popup.field.app-scopes')),
                m('input', {
                    id: 'oauth-app-scopes',
                    className: 'FormControl',
                    bidi: this.setting('managebaker.oauth.app_oauth_scopes')
                })
            ]),

            m('div', {
                className: 'Form-group'
            }, [
                m('label', {
                    for: 'oauth-button-title'
                }, app.translator.trans('managebaker-oauth.admin.popup.field.button-title')),
                m('input', {
                    id: 'oauth-button-title',
                    className: 'FormControl',
                    bidi: this.setting('managebaker.oauth.button_title')
                })
            ]),
        ];
    }
}
