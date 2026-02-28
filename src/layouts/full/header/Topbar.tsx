import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';

const Topbar = () => {
  return (
    <div className="py-3.75 px-6 z-40 sticky top-0 bg-[linear-gradient(90deg,#0f0533_0%,#1b0a5c_100%)]">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="md:flex hidden items-center gap-5">
          <Link target="_black" to="http://localhost:5173/">
            <h1 className="text-white text-xl">FrontEnd</h1>
          </Link>
          <div className="xl:flex items-center gap-4 pl-5 border-l border-opacity-20 border-white hidden"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <Link
              target="_black"
              to="mailto:kaosar3662@gmail.com"
              className="flex items-center px-4 py-2.75 rounded-sm gap-2 text-black bg-[#b3f143] hover:bg-[#90de03]"
            >
              <Icon icon="solar:question-circle-linear" width={18} />
              <h4 className="text-base font-normal leading-none">Emergency Help</h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
