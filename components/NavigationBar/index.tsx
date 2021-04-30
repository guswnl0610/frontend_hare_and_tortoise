import { useState, memo, useRef } from 'react';
import { useRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import { ROUTES } from 'constants/index';
import { CreateOutline, PersonCircleOutline, ChevronBackOutline } from 'react-ionicons';
import { useClickOutside } from 'hooks/useClickOutside';
import { useLogout } from 'apollo/mutations/logoutFromAllDevices';

interface NavProps {
  title: string;
  receiver?: string;
  setIsCreateModalOn?: (isModalOn: boolean) => void;
  children?: React.ReactNode;
  sticky?: boolean;
}

function NavigationBar({ title, receiver, setIsCreateModalOn, children, sticky = true }: NavProps) {
  const router = useRouter();
  const [mode, setMode] = useState<string>(router.pathname.startsWith(ROUTES.map) ? 'map' : 'chat');
  const [isUserMenuOn, setIsUserMenuOn] = useState<boolean>(false);
  const { logout, data, error } = useLogout();
  const userMenuRef = useRef(null);
  const userbtnRef = useRef(null);

  const linkToPage = () => {
    mode === 'map' ? router.back() : router.push('/list');
  };

  const handleEditClick = () => {
    setIsCreateModalOn && setIsCreateModalOn(true);
  };

  const closeUserMenu = () => {
    setIsUserMenuOn(false);
  };

  useClickOutside(userMenuRef, closeUserMenu, userbtnRef);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className={`${sticky && 'sticky top-0'} bg-white z-20`}>
        <div className="relative flex items-center justify-between py-3 px-7">
          <div className="cursor-pointer w-4">
            {router.pathname !== '/list' && (
              <ChevronBackOutline
                color={'#00000'}
                height="27px"
                width="27px"
                onClick={linkToPage}
              />
            )}
          </div>
          <Typography variant="h6">{title}</Typography>
          <div className="cursor-pointer w-4">
            {router.pathname.startsWith('/chat') && (
              <CreateOutline
                color={'#00000'}
                height="25px"
                width="25px"
                onClick={handleEditClick}
              />
            )}
            {router.pathname === '/list' && (
              <span ref={userbtnRef}>
                <PersonCircleOutline
                  color="#ffcdd2"
                  height="30px"
                  width="30px"
                  onClick={() => setIsUserMenuOn(prev => !prev)}
                />
              </span>
            )}
          </div>
          <div
            className={`absolute top-12 right-2 py-3 px-5 bg-white shadow-lg z-100 transition-opacity cursor-pointer ${
              isUserMenuOn ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            ref={userMenuRef}
          >
            <p onClick={handleLogout}>로그아웃</p>
          </div>
        </div>
        {children}
      </nav>
    </>
  );
}

export default memo(NavigationBar);
