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

const SidebarContent: MenuItem[] = [
  {
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        id: uniqueId(),
        url: '/',
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
    heading: 'Post',
    children: [
      {
        name: 'All Post',
        icon: 'mdi:file-document-multiple-outline',
        id: uniqueId(),
        url: '/posts',
        isPro: false,
      },
      {
        name: 'Pending Post',
        icon: 'mdi:clock-outline',
        id: uniqueId(),
        url: '/pposts',
        isPro: false,
      },
    ],
  },
];

export default SidebarContent;
