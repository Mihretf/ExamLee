import lee from '../../assets/lee-holding-a-book.svg'
import MainButton from '../../components/ui/MainButton';
import SubButton from '../../components/ui/SubButton';

function NavBar(){
    return (
        <nav className="flex items-center w-full justify-between font-poppins border sticky bg-white px-4 py-3 shadow-sm">
            <span className='flex items-center gap-2'>
               <img src={lee} alt="Lee" className="h-10 w-10 object-contain" />
            <p className="text-xl font-poppins text-primary font-bold">Examlee</p>   
            </span>
            <span className='flex font-semibold text-black/70 gap-7'>
                <p>How it works</p>
                <p>Campuses</p>
                <p>Why us</p>
            </span>

            <span className='flex gap-4'>
                <MainButton text="Sign up" onClick={() => alert('Sign up clicked!')} />
                <SubButton text="Sign in" onClick={() => alert('Sign in clicked!')} />
            </span>
          
        </nav>
    )
}

export default NavBar;