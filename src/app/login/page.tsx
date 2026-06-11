'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Eye, EyeOff } from 'lucide-react';
import { BRAND_COLORS } from '@/app/page';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas. Por favor intente de nuevo.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={180} height={55} priority />
          </Link>
          <div className={styles.title}>
            <h1>Bienvenido de nuevo</h1>
            <p>Ingresa a tu cuenta administrativa</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="nombre@empresa.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Contraseña</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles.input} ${styles.passwordInput}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleBtn}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
            style={{ 
              backgroundColor: BRAND_COLORS.SOLUCIONES,
              boxShadow: `0 10px 15px -3px ${BRAND_COLORS.SOLUCIONES}40`
            }}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
