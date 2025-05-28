import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageTitle } from '../utils/pageTitles';

const PageTitle = () => {
    const location = useLocation();
    const title = getPageTitle(location.pathname);

    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
};

export default PageTitle;