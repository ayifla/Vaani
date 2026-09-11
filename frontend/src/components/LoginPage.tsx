import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'otp';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // PLACEHOLDER LOGIC — no real auth yet.
    // TODO: Replace with actual Supabase auth call once wired up.
    if (mode === 'login' || mode === 'signup') {
      if (!email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      // Simulate moving to OTP step (matches OTP flow from signspeak_v3.html)
      setMode('otp');
      return;
    }

    if (mode === 'otp') {
      if (otp.length < 4) {
        setError('Please enter a valid code.');
        return;
      }
      // PLACEHOLDER: pretend OTP verified, let user in
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5EE] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-[#343832] mb-1 text-center">
          {mode === 'otp' ? 'Verify your code' : mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {mode === 'otp'
            ? `We sent a code to ${email || 'your email'}`
            : 'Sign in to continue to Vaani'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'otp' && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#343832] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#343832] mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          {mode === 'otp' && (
            <div>
              <label className="block text-sm font-medium text-[#343832] mb-1">Verification code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-[#B5654A]"
                placeholder="------"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#B5654A] text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition"
          >
            {mode === 'otp' ? 'Verify & Continue' : mode === 'signup' ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        {mode !== 'otp' && (
          <p className="text-sm text-center text-gray-500 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[#B5654A] font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};