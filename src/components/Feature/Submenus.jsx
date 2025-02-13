import PropTypes from "prop-types";

export function Submenus({
  classEl,
  submenus,
  activeSubmenu,
  setActiveSubmenu,
}) {
  const handleActiveSubmenu = (id) => {
    setActiveSubmenu(id);
  };

  return (
    <div className={`${classEl}-feature-submenu`}>
      {submenus.map((item) => (
        <div
          key={item.id}
          className={`${classEl}-feature-submenu-link ${
            activeSubmenu === item.id ? "active" : ""
          }`}
          onClick={() => handleActiveSubmenu(item.id)}
        >
          {item.icon}
          <div className="text">{item.text}</div>
        </div>
      ))}
    </div>
  );
}

Submenus.propTypes = {
  classEl: PropTypes.string.isRequired,
  submenus: PropTypes.array,
  activeSubmenu: PropTypes.number,
  setActiveSubmenu: PropTypes.func,
};
