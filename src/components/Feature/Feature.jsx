import { Submenus } from "./Submenus";
import { Filtering } from "./Filtering";
import PropTypes from "prop-types";

function Feature({
  type = "all",
  classEl,
  submenus,
  activeSubmenu,
  setActiveSubmenu,
  onApplyFilter,
  onClearFilter,
  children = null,
}) {
  const components = {
    all: (
      <>
        <Submenus
          classEl={classEl}
          submenus={submenus}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        />
        <Filtering
          classEl={classEl}
          onApplyFilter={onApplyFilter}
          onClearFilter={onClearFilter}
        >
          {children}
        </Filtering>
      </>
    ),
    submenu: <Submenus classEl={classEl} submenus={submenus} />,
    filter: (
      <Filtering
        classEl={classEl}
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
      >
        {children}
      </Filtering>
    ),
  };

  return <div className={`${classEl}-feature`}>{components[type] || null}</div>;
}

Feature.propTypes = {
  type: PropTypes.oneOf(["all", "submenu", "filter"]),
  classEl: PropTypes.string.isRequired,
  submenus: PropTypes.array,
  activeSubmenu: PropTypes.number,
  setActiveSubmenu: PropTypes.func,
  onApplyFilter: PropTypes.func,
  onClearFilter: PropTypes.func,
  children: PropTypes.node,
};

export default Feature;
