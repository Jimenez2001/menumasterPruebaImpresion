import { useContext } from 'react'
import MenuMasterContext from '@/context/MenuMasterProvider';

const useMenuMaster = () => {
    return useContext(MenuMasterContext);
};

export default useMenuMaster;