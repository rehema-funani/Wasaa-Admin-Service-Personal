import React from 'react'
import { escrowService } from '../../../api/services/escrow';

const milestones = () => {
    const [milestones, setMilestones] = React.useState([]);
    
    React.useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const data = await escrowService.getMilestones();
                setMilestones(data);
            } catch (error) {
                console.error("Error fetching milestones:", error);
            }
        };

        fetchMilestones();
    }, []);

  return (
    <div>
      {milestones}
    </div>
  )
}

export default milestones
