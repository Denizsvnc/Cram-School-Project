import { useState } from 'react';
import { useNavigate } from 'react-router';
import { girisYap } from '../services/authApi';
import './AuthPages.css';

function AuthPages() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const resetMessages = () => {
    setError('');
  };

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      await girisYap(loginForm);
      navigate('/panel', { replace: true });
    } catch (apiError: unknown) {
      const message = apiError instanceof Error ? apiError.message : 'Giris basarisiz.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='auth-shell'>
      <section className='auth-card'>
        <header className='auth-header'>
          <p className='auth-kicker'>DERSHANE PANELI</p>
          <h1>Hesabina Giris Yap</h1>
          <p className='auth-subtitle'>
            Devam etmek icin e-posta ve sifrenizi girin. Kayit islemleri panel tarafinda yapilacak.
          </p>
        </header>

        {error ? <p className='auth-message auth-error'>{error}</p> : null}
        <form className='auth-form' onSubmit={onLogin}>
          <label>
            E-posta
            <input
              type='email'
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>

          <label>
            Sifre
            <input
              type='password'
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
              required
            />
          </label>

          <button type='submit' disabled={loading}>
            {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthPages;
