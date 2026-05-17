import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForgotPassword } from '../../features/auth/hooks';

export default function ForgotPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const mutation = useForgotPassword();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) {
			toast.error('Please enter your email');
			return;
		}
		mutation.mutate({ email: email.trim() }, {
			onSuccess: () => navigate('/signin')
		});
	};

	return (
		<div className="min-h-screen bg-white flex" style={{ fontFamily: "'Inter', sans-serif" }}>
			<div className="w-full flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12">
				<div className="max-w-md w-full mx-auto">
					<Link to="/" className="text-sm text-[#717171] hover:text-[#222222] mb-6 inline-block">Back to Home</Link>
					<h1 className="text-[#222222] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 700 }}>Forgot Password</h1>
					<p className="text-[#717171] text-sm mb-8">Enter your account email and we'll send a password reset link.</p>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label className="block text-[#222222] text-sm font-semibold mb-2">Email Address</label>
							<input
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder="your@email.com"
								className="w-full px-4 py-3.5 rounded-xl border border-[#DDDDDD] bg-white text-[#222222] text-sm outline-none focus:border-[#FF5A5F] transition-colors placeholder:text-[#AAAAAA]"
								required
							/>
						</div>

						<button type="submit" disabled={mutation.isPending} className="w-full bg-[#FF5A5F] hover:bg-[#E74C55] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-sm transition-colors">
							{mutation.isPending ? 'Sending…' : 'Send Reset Link'}
						</button>
					</form>

					<p className="text-center text-[#717171] text-sm mt-6">Remembered your password? <Link to="/signin" className="text-[#FF5A5F] font-semibold hover:underline">Sign in</Link></p>
				</div>
			</div>
		</div>
	);
}
