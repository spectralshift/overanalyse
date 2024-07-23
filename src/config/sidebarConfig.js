// config/sidebarConfig.js

import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GamesIcon from '@mui/icons-material/Games';
import ScienceIcon from '@mui/icons-material/Science';
import LinesIcon from '@mui/icons-material/FormatAlignJustify';
import RepeatIcon from '@mui/icons-material/Repeat';
import TimeIcon from '@mui/icons-material/AccessTime';

const homeConfig = [
  {
    header: 'Site',
    items: [
      { text: 'Home', path: '/', icon: HomeIcon },
    ]
  },
  {
    header: 'Games',
    items: [
      { text: 'CivIdle', path: '/cividle', icon: GamesIcon },
      { text: 'Terraforming Mars', path: '/terraforming-mars', icon: GamesIcon },
    ]
  }
];

const civIdleConfig = [
  {
    header: 'Site',
    items: [
      { text: 'Home', path: '/', icon: HomeIcon },
    ]
  },
  {
    header: 'CivIdle',
    items: [
      { text: 'GP Efficiency', path: '/cividle/gp-efficient', icon: DashboardIcon },
      { text: 'Science Time', path: '/cividle/science', icon: ScienceIcon },
      { text: 'Idle Era Time', path: '/CivIdle/eratime', icon: TimeIcon },
	  { text: 'EV Values', path: '/cividle/ev', icon: LinesIcon },
	  { text: 'Product Chain Calc', path: '/cividle/chaincalc', icon: RepeatIcon },
	  //{ text: 'Idle Era Time', path: '', icon: TrendingUpIcon },
	  
    ]
  }
];

export const sidebarConfig = {
  home: homeConfig,
  CivIdle: civIdleConfig,
};

