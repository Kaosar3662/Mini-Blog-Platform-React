export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  isPro?: boolean;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  isPro?: boolean;
}

import { uniqueId } from 'lodash';
import { getAuth } from '../../../views/auth/Middleware/Authmiddleware';

const SidebarContent: MenuItem[] = [
  {
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/dashboard',
        isPro: false,
      },
      {
        name: 'Categories',
        id: uniqueId(),
        url: '/categories',
        icon: 'mdi:shape-outline',
      },
      {
        name: 'Users',
        id: uniqueId(),
        url: '/users',
        icon: 'mdi:account-group-outline',
      },
      {
        name: 'Contact Message',
        id: uniqueId(),
        url: '/cmessage',
        icon: 'mdi:email-outline',
      },
      {
        name: 'Comments',
        id: uniqueId(),
        url: '/comments',
        icon: 'mdi:comment-text-outline',
      },
    ],
  },
  {
    heading: 'Posts',
    children: [
      {
        name: 'All Blog',
        icon: 'mdi:file-document-multiple-outline',
        id: uniqueId(),
        url: '/posts',
        isPro: false,
      },
      {
        name: 'My Blogs',
        icon: 'mdi:clock-outline',
        id: uniqueId(),
        url: '/myposts',
        isPro: false,
      },
      {
        name: 'Create a Blog',
        icon: 'mdi:clock-outline',
        id: uniqueId(),
        url: '/newpost',
        isPro: false,
      },
    ],
  },
];

function getSidebarItems(): MenuItem[] {
  const auth = getAuth();
  const role = auth?.role?.toLowerCase() || '';

  function filterChildren(children: ChildItem[]): ChildItem[] {
    return children.filter((item) => {
      const name = item.name;

      // Admin gets everything
      if (role === 'admin') return true;

      // Moderator: Everything except Users
      if (role === 'moderator') {
        return name !== 'Users';
      }

      // Blogger: Only Dashboard, My Blogs, and Create a Blog
      if (role === 'blogger') {
        const bloggerAllowed = ['Dashboard', 'My Blogs', 'Create a Blog'];
        return bloggerAllowed.includes(name || '');
      }
      return false;
    });
  }
  return SidebarContent.map((menu) => {
    if (menu.children) {
      return { ...menu, children: filterChildren(menu.children) };
    }
    return menu;
  }).filter((menu) => menu.children && menu.children.length > 0);
}
export { getSidebarItems };
