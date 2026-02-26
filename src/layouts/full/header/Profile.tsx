import { Button, Dropdown } from 'flowbite-react';
import { Icon } from '@iconify/react';
import user1 from '/src/assets/images/profile/user-1.jpg';
import { useNavigate } from 'react-router-dom';
import { apiService, useUI } from 'src/Api/Axios';
import { useState } from 'react';

const Profile = () => {
  const { setLoader, setAlert } = useUI();
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  const fetchUser = async () => {
    const response = await apiService.request('get', `user`, {}, {}, setLoader, setAlert);
    setName(response.name);
    setMail(response.email);
  };
  const handleProfileOpen = () => {
    fetchUser();
  };
  return (
    <div className="relative group/menu" onClick={handleProfileOpen}>
      <Dropdown
        label=""
        className="rounded-sm w-fit"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img src={user1} alt="logo" height="35" width="35" className="rounded-full" />
          </span>
        )}
      >
        <div className="px-3 pt-3 flex items-center w-full gap-3 text-dark">
          <Icon icon="solar:user-outline" height={20} />
          <span>{name}</span>
        </div>
        <div className="px-3 py-3 flex items-center w-full gap-3 text-dark">
          <Icon icon="solar:letter-outline" height={20} />
          <span>{mail}</span>
        </div>

        <div className="p-3 pt-0">
          <Button
            size={'sm'}
            onClick={handleLogout}
            className="mt-2 border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none"
          >
            Logout
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
