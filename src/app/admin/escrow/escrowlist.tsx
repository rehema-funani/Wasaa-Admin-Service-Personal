import React from 'react'
import { escrowService } from '../../../api/services/escrow';

const escrowlist = () => {
    const [escrows, setEscrows] = React.useState(null);

    const fectchEscrowList = async () => {
        try {
            const res = await escrowService.getEscrowAgreements();
            setEscrows(res);
        } catch (error) {
            console.error("Error fetching escrow list:", error);
            setEscrows(null);
        }
    }

    React.useEffect(() => {
        fectchEscrowList();
    }, []);
    
  return (
    <div>
      
    </div>
  )
}

export default escrowlist
