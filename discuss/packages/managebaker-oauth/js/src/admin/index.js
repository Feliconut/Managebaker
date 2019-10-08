import { extend } from 'flarum/extend';
import app from 'flarum/app';
import PassportSettingsModal from './components/PassportSettingsModal';

app.initializers.add('managebaker-oauth', app => {
    app.extensionSettings['managebaker-oauth'] = () => app.modal.show(new PassportSettingsModal());
});
