export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  logo: {
    src: '/Efilliks.jpeg',
    width: 50,
    height: 50,
  },
  navItems: [
    // {
    //   label: 'Blog',
    //   href: '/capgemini-cognitive-ability-games',
    // },
    // {
    //   label: 'Memory Games',
    //   href: '/games/memory',
    // },
    {
      label: 'All Games',
      href: '/games',
    },
    {
      label: 'Leaderboard',
      href: '/leaderboard',
    },
       {
      label: 'Profile',
      href: '/profile',
    },

    // {
    //   label: 'IQ Tests',
    //   href: '/iq-tests',
    // },
    //      {
    //   label: 'Contact',
    //   href: '/contact',
    // },
  ] as NavItem[],
};