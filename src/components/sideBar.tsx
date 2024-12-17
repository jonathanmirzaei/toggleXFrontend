import Menu from "./menu";

const SideBar = ({ message, onClick }) => {

    const handleClick = (event, value) => {
        event.preventDefault();
        onClick(value);
        // PageContext.Provider.value = feature.id;
        // React.useContext(feature.id);
    };

    return <div className="app-sidebar">
        <div className="sidebar-brand">
            <a href="./index.html" className="brand-link">
                <img src="/assets/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image opacity-75 shadow" />
                <span className="brand-text fw-light">ToggleX.io</span>
            </a>
        </div>
        <Menu message="menu" onClick={onClick} />
    </div>
}
export default SideBar