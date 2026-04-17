import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaLinkedinIn, FaTelegram, FaXTwitter } from 'react-icons/fa6';
import SubButton from '../ui/SubButton';

const socialLinks = [
	{ name: 'Telegram', href: 'https://t.me/', icon: FaTelegram },
	{ name: 'Instagram', href: 'https://instagram.com/', icon: FaInstagram },
	{ name: 'LinkedIn', href: 'https://linkedin.com/', icon: FaLinkedinIn },
	{ name: 'X', href: 'https://x.com/', icon: FaXTwitter },
];

function Fotter() {
	const navigate = useNavigate();

	return (
		<footer className="relative mt-12 overflow-hidden border-t-2 border-dashed border-primary/40 bg-gradient-to-br from-secondary via-white to-secondary/70 px-4 py-10 sm:px-8 sm:py-12">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-7 rounded-3xl sm:gap-8 sm:p-8">
				<div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div className="max-w-xl space-y-2">
						<p className="font-poppins text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
							Examlee
						</p>
						<h3 className="font-poppins text-2xl font-extrabold text-primary sm:text-3xl">
							Study smarter with a student-powered exam community.
						</h3>
						<p className="font-poppins text-sm text-slate-600 sm:text-base">
							Get campus-specific past exams, connect with peers, and prepare with confidence.
						</p>
					</div>

					<div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-wrap">
						<SubButton
							text="Sign Up"
							onClick={() => navigate('/signup')}
							className="w-full justify-center !px-6 !py-2 sm:w-auto"
						/>
						<SubButton
							text="Browse Exams"
							onClick={() => navigate('/exams')}
							className="w-full justify-center !px-6 !py-2 sm:w-auto"
						/>
					</div>
				</div>

				<div className="flex flex-col items-start justify-between gap-5 border-t border-primary/20 pt-5 sm:flex-row sm:items-center">
					<div className="flex flex-wrap items-center gap-3">
						{socialLinks.map((social) => {
							const Icon = social.icon;

							return (
							<a
								key={social.name}
								href={social.href}
								target="_blank"
								rel="noreferrer"
								aria-label={social.name}
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-primary/60 bg-white text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-solid hover:bg-primary hover:text-white"
							>
								<Icon className="text-base" aria-hidden="true" />
							</a>
							);
						})}
					</div>

					<p className="font-poppins text-sm text-slate-600">
						{new Date().getFullYear()} Examlee. Built for students, by students.
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Fotter;
