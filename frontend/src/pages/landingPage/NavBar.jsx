import { useState } from 'react';
import lee from '../../assets/lee-holding-a-book.svg'
import MainButton from '../../components/ui/MainButton';
import SubButton from '../../components/ui/SubButton';

function NavBar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-20 w-full border-b border-black/10 bg-white/95 px-4 py-3 shadow-sm backdrop-blur md:px-8">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 font-poppins">
                <span className='flex items-center gap-2'>
                    <img src={lee} alt="Lee" className="h-9 w-9 object-contain md:h-10 md:w-10" />
                    <p className="text-lg font-bold text-primary md:text-xl">Examlee</p>
                </span>

                <span className='hidden items-center gap-5 text-sm font-semibold text-black/70 md:flex lg:gap-7 lg:text-base'>
                    <p>How it works</p>
                    <p>Campuses</p>
                    <p>Why us</p>
                </span>

                <span className='hidden items-center gap-3 md:flex lg:gap-4'>
                    <MainButton text="Sign up" onClick={() => alert('Sign up clicked!')} />
                    <SubButton text="Sign in" onClick={() => alert('Sign in clicked!')} />
                </span>

                <button
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation menu"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    className="inline-flex items-center rounded-md border border-primary/30 px-3 py-2 text-sm font-semibold text-primary md:hidden"
                >
                    Menu
                </button>
            </div>

            {isMenuOpen && (
                <div className="mx-auto mt-3 flex w-full max-w-7xl flex-col gap-4 border-t border-black/10 pt-4 font-poppins md:hidden">
                    <span className='flex flex-col gap-2 text-sm font-semibold text-black/70'>
                        <p>How it works</p>
                        <p>Campuses</p>
                        <p>Why us</p>
                    </span>

                    <span className='flex flex-col gap-2'>
                        <MainButton text="Sign up" onClick={() => alert('Sign up clicked!')} className="w-full justify-center" />
                        <SubButton text="Sign in" onClick={() => alert('Sign in clicked!')} className="w-full justify-center" />
                    </span>
                </div>
            )}
        </nav>
    )
}

export default NavBar;