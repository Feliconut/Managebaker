import { extend } from 'flarum/extend';
import app from 'flarum/app';
import LogInButtons from 'flarum/components/LogInButtons';
import LogInButton from 'flarum/components/LogInButton';

app.initializers.add('managebaker-oauth', () => {
  extend(LogInButtons.prototype, 'items', function(items) {
    items.add('managebaker-oauth',
      <LogInButton
        className="Button LogInButton--passport"
        icon="id-card-o"
        path="/auth/managebaker">
          {app.forum.attribute('managebaker.oauth.loginTitle')}
      </LogInButton>
    );
  });
});
