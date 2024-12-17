const Menu = ({ message, onClick }) => {

    const handleClick = (event, value) => {
        event.preventDefault();
        onClick(value);
        // PageContext.Provider.value = feature.id;
        // React.useContext(feature.id);
    };

    return <div className="sidebar-wrapper">
        {/* {message} */}
        <nav className="mt-2">
            <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu" data-accordion="false">
                <li className="nav-header">
                    Development Tools
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Flag List")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-pencil-square"></i>
                        <p>Featurs</p>
                    </a>
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Experiment List")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-ui-checks-grid"></i>
                        <p>Experiements</p>
                    </a>
                </li>
                <li className="nav-header">
                    Team Tools
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Project List")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-clipboard-fill"></i>
                        <p>Projects</p>
                    </a>
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Users")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-box-arrow-in-right"></i>
                        <p>Users & Groups</p>
                    </a>
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Environment List")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-palette"></i>
                        <p>Environments</p>
                    </a>
                </li>
                <li className="nav-header">
                    Tracking
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Analytics")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-table"></i>
                        <p>Analytics</p>
                    </a>
                </li>
                <li className="nav-header">
                    Documents
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Flag List")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-question-circle-fill"></i>
                        <p>FAQ</p>
                    </a>
                </li>
                <li className="nav-item" onClick={(event) => handleClick(event, "Flag List")}>
                    <a href="./generate/theme.html" className="nav-link" >
                        <i className="nav-icon bi bi-patch-check-fill"></i>
                        <p>How To</p>
                    </a>
                </li>
            </ul>
        </nav>
        {/* 
        <li className="item" onClick={(event) => handleClick(event, "flagList")}><a>Featurs</a></li>
            <li className="item" onClick={(event) => handleClick(event, "expList")}><a>Experiements</a></li>
        </ul> */}
    </div>
}

export default Menu