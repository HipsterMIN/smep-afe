// ============================================
// Dynamic Route Component
// ============================================
import { Navigate,useParams } from 'react-router-dom';

import ContentBox from '../components/ui/Contentbox';
import { componentMapForDynamicRoute } from './componentMapForDynamicRoute.js';

export default function DynamicRoute() {
    const { menuCode } = useParams();
    const PageComponent = componentMapForDynamicRoute[menuCode];

    if (!PageComponent) {
        return <Navigate to="/" replace />;
    }

    return (
        <ContentBox>
           <PageComponent />
        </ContentBox>
    );
}