import React from 'react'
import { escrowService } from '../../../api/services/escrow';
import { useParams } from 'react-router-dom';

const escrowdetail = () => {
    const [escrow, setEscrow] = React.useState(null);
    const { id } = useParams();

    const fectchEscrowDetails = async () => {
        try {
            const res = await escrowService.getEscrowAgreementById(id);
            setEscrow(res);
        } catch (error) {
            console.error("Error fetching escrow details:", error);
            setEscrow(null);
        }
    }

    React.useEffect(() => {
        fectchEscrowDetails();
    }, [id]);

  return (
    <div>
      
    </div>
  )
}

export default escrowdetail
