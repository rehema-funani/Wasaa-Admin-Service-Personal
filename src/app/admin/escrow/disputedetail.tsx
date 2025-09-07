import React from 'react'
import { escrowService } from '../../../api/services/escrow';
import { useParams } from 'react-router-dom';

const disputedetail = () => {
    const [dispute, setDispute] = React.useState(null);
    const { id } = useParams();

    const fectchDisputeDetails = async () => {
        try {
            const res = await escrowService.getDisputeById(id);
            setDispute(res);
        } catch (error) {
            console.error("Error fetching dispute details:", error);
            setDispute(null);
        }
    }

    React.useEffect(() => {
        fectchDisputeDetails();
    }, [id]);
    
  return (
    <div>
      
    </div>
  )
}

export default disputedetail
