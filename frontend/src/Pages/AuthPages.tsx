import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { girisYap } from '../services/authApi';
import './AuthPages.css';
import './panda.css';
// import BackgroundImg from "../../public/background.jpeg";
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
  useEffect(() => {
    const usernameRef = document.getElementById('username');
    const passwordRef = document.getElementById('password');
    const eyeL = document.querySelector<HTMLElement>('.eyeball-l');
    const eyeR = document.querySelector<HTMLElement>('.eyeball-r');
    const handL = document.querySelector<HTMLElement>('.hand-l');
    const handR = document.querySelector<HTMLElement>('.hand-r');

    if (!usernameRef || !passwordRef || !eyeL || !eyeR || !handL || !handR) {
      return;
    }

    const normalEyeStyle = () => {
      eyeL.style.cssText = 'left: 0.6em; top: 0.6em;';
      eyeR.style.cssText = 'right: 0.6em; top: 0.6em;';
    };

    const normalHandStyle = () => {
      handL.style.cssText =
        'height: 2.81em; top: 8.4em; left: 7.5em; transform: rotate(0deg);';
      handR.style.cssText =
        'height: 2.81em; top: 8.4em; right: 7.5em; transform: rotate(0deg);';
    };

    const onUsernameFocus = () => {
      eyeL.style.cssText = 'left: 0.75em; top: 1.12em;';
      eyeR.style.cssText = 'right: 0.75em; top: 1.12em;';
      normalHandStyle();
    };

    const onPasswordFocus = () => {
      handL.style.cssText =
        'height: 6.56em; top: 3.87em; left: 11.75em; transform: rotate(-155deg);';
      handR.style.cssText =
        'height: 6.56em; top: 3.87em; right: 11.75em; transform: rotate(155deg);';
      normalEyeStyle();
    };

    const onDocumentClick = (event: MouseEvent) => {
      const clickedElem = event.target;
      if (clickedElem !== usernameRef && clickedElem !== passwordRef) {
        normalEyeStyle();
        normalHandStyle();
      }
    };

    usernameRef.addEventListener('focus', onUsernameFocus);
    passwordRef.addEventListener('focus', onPasswordFocus);
    document.addEventListener('click', onDocumentClick);

    return () => {
      usernameRef.removeEventListener('focus', onUsernameFocus);
      passwordRef.removeEventListener('focus', onPasswordFocus);
      document.removeEventListener('click', onDocumentClick);
    };
  }, []);

  return (
    <main style={{
      backgroundImage: "url('background.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
    }}>

      <div className='container'>
        <form onSubmit={onLogin}>
          <label htmlFor='username'>Mail Adresiniz:</label>
          <input
            id='username'
            type='email'
            placeholder='ornek@mail.com'
            value={loginForm.email}
            onChange={(event) =>
              setLoginForm((current) => ({ ...current, email: event.target.value }))
            }
            required
          />

          <label htmlFor='password'>Sifreniz:</label>
          <input
            id='password'
            type='password'
            placeholder='Sifrenizi girin'
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((current) => ({ ...current, password: event.target.value }))
            }
            required
          />

          {error ? <p className='auth-message auth-error'>{error}</p> : null}

          <button type='submit' disabled={loading}>
            {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </button>
        </form>

        <div className='ear-l'></div>
        <div className='ear-r'></div>
        <div className='panda-face'>
          <div className='blush-l'></div>
          <div className='blush-r'></div>
          <div className='eye-l'>
            <div className='eyeball-l'></div>
          </div>
          <div className='eye-r'>
            <div className='eyeball-r'></div>
          </div>
          <div className='nose'></div>
          <div className='mouth'></div>
        </div>
        <div className='hand-l'></div>
        <div className='hand-r'></div>
        <div className='paw-l'></div>
        <div className='paw-r'></div>
      </div>
    </main>
  );
}

export default AuthPages;
