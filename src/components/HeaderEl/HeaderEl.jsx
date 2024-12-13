import React from "react";

function HeaderEl({ classEl, titleEl, descEl, Icon, children }) {
  return (
    <div className={`${classEl}-header`}>
      <div className="menu">
        <div className="icon">
          {Icon && <Icon strokeWidth={1.5} size={28} />}
        </div>
        <div className="title">{titleEl}</div>
        <div className="desc">{descEl}</div>
      </div>
      {children}
    </div>
  );
}

export default HeaderEl;
