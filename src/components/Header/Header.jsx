import PropTypes from "prop-types";

function Header({ classEl, titleEl, descEl, Icon, children }) {
  return (
    <div className={`${classEl}-header`}>
      <div className="menu">
        <div className="icon">
          {Icon && <Icon strokeWidth={1.25} size={28} />}
        </div>
        <div className="title">{titleEl}</div>
        <div className="desc">{descEl}</div>
      </div>
      {children}
    </div>
  );
}

Header.propTypes = {
  classEl: PropTypes.string,
  titleEl: PropTypes.string,
  descEl: PropTypes.string,
  Icon: PropTypes.object,
  children: PropTypes.node,
};

export default Header;
