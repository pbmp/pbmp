import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import useClickOutside from "@/hooks/useClickOutside";
import { Filter } from "lucide-react";

export function Filtering({ classEl, onApplyFilter, onClearFilter, children }) {
  const [openFilter, setOpenFilter] = useState(false);
  const filterModal = useRef(null);

  useClickOutside(filterModal, () => setOpenFilter(false), openFilter);

  const handleApply = useCallback(
    (e) => {
      e.stopPropagation();
      setOpenFilter(false);

      if (onApplyFilter) {
        onApplyFilter();
      }
    },
    [onApplyFilter]
  );

  const handleClear = useCallback(() => {
    if (onClearFilter) {
      onClearFilter();
    }
  }, [onClearFilter]);

  return (
    <div className={`${classEl}-feature-filter`}>
      <div className="add-filters" onClick={() => setOpenFilter(true)}>
        <Filter className="icon" strokeWidth={1.75} />
        <div className="text">Add Filters</div>
        {openFilter ? (
          <div className="filter-modal" ref={filterModal}>
            {children}
            <div className="filter-modal-button">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenFilter(false);
                }}
              >
                Cancel
              </span>
              <span onClick={handleApply}>Apply</span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="clear-filter" onClick={handleClear}>
        <div className="text">
          Clear <span>Filter</span>
        </div>
      </div>
    </div>
  );
}

Filtering.propTypes = {
  classEl: PropTypes.string.isRequired,
  onApplyFilter: PropTypes.func,
  onClearFilter: PropTypes.func,
  children: PropTypes.node,
};
