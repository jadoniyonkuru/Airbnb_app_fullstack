import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useResetPassword } from '../../features/auth/hooks';

export default function ResetPassword() {
  const { token } = useParams() as { token?: string };
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const mutation = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error('Invalid reset token');
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (newPassword !== confirm) return toast.error('Passwords do not match');

    mutation.mutate({ token, newPassword }, {
      onSuccess: () => navigate('/signin')
    });
  };

  return (
    <div className="min-h-screen bg-white flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="text-sm text-[#717171] hover:text-[#222222] mb-6 inline-block">Back to Home</Link>
          <h1 className="text-[#222222] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Reset Password</h1>
          <p className="text-[#717171] text-sm mb-8">Create a new password for your account.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Create a strong new password"
                className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]"
                required
              />
            </div>

            <div>
              <label className="block text-[#222222] text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]"
                required
              />
            </div>

            <button type="submit" disabled={mutation.isPending} className="w-full bg-[#FF5A5F] hover:bg-[#E74C55] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-sm transition-colors">
              {mutation.isPending ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-[#717171] text-sm mt-6">Remembered your password? <Link to="/signin" className="text-[#FF5A5F] font-semibold hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
