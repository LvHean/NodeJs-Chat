import { useNavigate, useLocation } from "react-router-dom";
  
export const withRouter = WrappedComponent => props => {
    const navigate = useNavigate();
    const location = useLocation();
    // other hooks
  
    return (
      <WrappedComponent
        {...props}
        {...{ navigate, location }}
      />
    );
  };
  
