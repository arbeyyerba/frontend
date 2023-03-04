
// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'ETHDenver 2023',
  '$SPORK Holders',
  'Rich MFers',
];
const PRODUCT_COLOR = ['#00AB55', '#000000', '#FFFFFF', '#FFC0CB', '#FF4842', '#1890FF', '#94D82D', '#FFC107'];

// ----------------------------------------------------------------------

interface AuthorizerContract{ 
  address: string;
  chainId: string;
  name: string;
  avatar: string;
  description: string;
}

// create a TS Record of chainId to Contracts


const authorizersMock: Record<number, AuthorizerContract[]> = {
  31337: [
    {
      address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      chainId: '31337',
      name: 'ETHDenver 2023',
      avatar: '/assets/images/contractImages/contract_1.jpg',
      description: 'ETHDenver 2023',
    },
    {
      address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      chainId: '31337',
      name: '$SPORK Holders',
      avatar: '/assets/images/contractImages/contract_2.jpg',
      description: '$SPORK Holders',
    },
    {
      address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      chainId: '31337',
      name: 'Rich MFers',
      avatar: '/assets/images/contractImages/contract_3.jpg',
      description: 'Rich MFers',
    },
  ],
  137: [
    {
      address: '0x1',
      chainId: '137',
      name: 'ETHDenver 2023',
      avatar: '/assets/images/contractImages/contract_1.jpg',
      description: 'ETHDenver 2023',
    },
    {
      address: '0x2',
      chainId: '137',
      name: '$SPORK Holders',
      avatar: '/assets/images/contractImages/contract_2.jpg',
      description: '$SPORK Holders',
    },
    {
      address: '0x3',
      chainId: '137',
      name: 'Rich MFers',
      avatar: '/assets/images/contractImages/contract_3.jpg',
      description: 'Rich MFers',
    },
  ],
  80001: [
    {
      address: '0x9ba33d0b160d8942c37cb2d34c6d7530e1853415',
      chainId: '80001',
      name: 'ETHDenver 2023',
      avatar: '/assets/images/contractImages/contract_1.jpg',
      description: 'ETHDenver 2023',
    },
    {
      address: '0x4C78feC1553009Fe35F390D0fC6c91bE3411c3A4',
      chainId: '80001',
      name: '$SPORK Holders',
      avatar: '/assets/images/contractImages/contract_2.jpg',
      description: '$SPORK Holders',
    },
    {
      address: '0x66b2984796a3af14ebc3df1feafb7ccb5f12cbef',
      chainId: '80001',
      name: 'Rich MFers',
      avatar: '/assets/images/contractImages/contract_3.jpg',
      description: 'Rich MFers',
    },
  ],
};

export default authorizersMock;
