import React from "react";
const Header = ({keycloak}) => {

   function logout(event: any) {
      keycloak.logout()
   }

   return (
      <>
         <div className="container-fluid">
            <ul className="navbar-nav">
               <li className="nav-item"> <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button"> <i className="bi bi-list"></i> </a> </li>
               <li className="nav-item d-none d-md-block"> <a href="#" className="nav-link">Home</a> </li>
               <li className="nav-item d-none d-md-block"> <a href="#" className="nav-link">Contact</a> </li>
            </ul>
            <div className="col-sm-6">
               <div className="float-sm-end dropdown" role="group">
                  <button type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                     <img src="/assets/img/user2-160x160.jpg" style={{ width: "40px" }} className="user-image rounded-circle shadow" />
                     <span className="d-none d-md-inline">{keycloak.tokenParsed.preferred_username}</span>
                  </button>
                  <ul className="dropdown-menu">
                     <li className="dropdown-item"> {keycloak.tokenParsed.name}</li>
                     <li className="dropdown-divider"></li>
                     <li> <a className="dropdown-item" href="#" onClick={(event) => logout(event)}>logout</a> </li>
                  </ul>
               </div>
            </div>
         </div>
      </>
   );
}
export default Header
