import React from 'react'
import { escrowService } from '../../../api/services/escrow';

const systemescrows = () => {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const fetchSystemEscrows = async () => {
            try {
                const response = await escrowService.getsystemEscrowAgreements();
                setData(response);
            } catch (error) {
                console.error("Error fetching system escrows:", error);
            }
        };

        fetchSystemEscrows();
    }, [])
  return (
    <div>
      
    </div>
  )
}

export default systemescrows
