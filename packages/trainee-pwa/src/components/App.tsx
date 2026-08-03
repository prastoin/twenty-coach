import { useEffect, useState } from 'react';

import { fetchCurrentUser, type CurrentUser } from '../services/user';
import {
  getStoredTokens,
  handleAuthorizationCallback,
  login,
  logout,
} from '../services/auth';
import { TrainingScreen } from './TrainingScreen';

type State =
  | { step: 'loading' }
  | { step: 'signedOut' }
  | { step: 'signedIn' }
  | { step: 'error'; message: string };

export const App = () => {
  const [state, setState] = useState<State>({ step: 'loading' });
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const tokens =
          (await handleAuthorizationCallback()) ?? getStoredTokens();
        if (!tokens) {
          setState({ step: 'signedOut' });
          return;
        }
        // Being signed in is decided by the stored tokens alone: who the user
        // is takes a request, and offline the app must still open.
        setState({ step: 'signedIn' });
        void fetchCurrentUser()
          .then(setUser)
          .catch(() => undefined);
      } catch (error) {
        setState({
          step: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
      }
    };
    void bootstrap();
  }, []);

  const signIn = () => {
    void login().catch((error) =>
      setState({ step: 'error', message: String(error) }),
    );
  };

  const signOut = () => {
    logout();
    setState({ step: 'signedOut' });
  };

  if (state.step === 'signedIn') {
    return (
      <div className="app">
        <header className="topbar">
          <span className="topbar-brand">🏋️ Coach</span>
          <button
            className="topbar-signout"
            onClick={signOut}
            title={user?.email ?? undefined}
          >
            {user ? `${user.firstName} · ` : ''}Sign out
          </button>
        </header>
        <main className="content">
          <TrainingScreen />
        </main>
      </div>
    );
  }

  return (
    <main className="screen">
      <h1 className="brand">🏋️ Coach</h1>
      {state.step === 'loading' && <p className="muted">Loading…</p>}
      {state.step === 'signedOut' && (
        <button className="primary" onClick={signIn}>
          Sign in with Twenty
        </button>
      )}
      {state.step === 'error' && (
        <>
          <p className="error">{state.message}</p>
          <button className="primary" onClick={signIn}>
            Try again
          </button>
        </>
      )}
    </main>
  );
};
