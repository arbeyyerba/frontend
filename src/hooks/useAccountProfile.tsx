import { Contract } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import Profile from 'src/contracts/Profile.json';
import { RootState, useSelector } from 'src/redux/store';
import { useAccount } from 'wagmi';
import useWalletAddress from './useWallet';


export default function useAccountProfile(): { displayName: string; email: string; photoURL: string; } {
  const address = useWalletAddress();
  const [icon, setIcon] = useState();

  useEffect(()=>{
    if (address) {
      const addr = address.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = (<Jazzicon diameter={50} seed={seed} />);
      setIcon(icon)
    }
  }, [address]);

  return {
    address,
    icon,
  }
}
