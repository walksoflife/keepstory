import { useState } from "react";
import { filterData } from "./filterData.js";
import FilterGroup from "./FilterGroup.js";

const FilterCustom = ({ filterOptions, setFilterOptions, setFilterClass }) => {
  const [isFilters, setIsFilters] = useState(true);
  const [isAdjust, setIsAdjust] = useState(false);
  const [classSelected, setClassSelected] = useState("");

  const handleCliked = (item) => {
    if (item === "filters") {
      setIsFilters(true);
      setIsAdjust(false);
    } else if (item === "adjustments") {
      setIsFilters(false);
      setIsAdjust(true);
    } else return;
  };

  const handleFilterClass = (item) => {
    setClassSelected(item);
    setFilterClass(item);
  };

  return (
    <div className="filter-custom">
      <div className="filter-options">
        <div
          className={isFilters ? "filter-select active" : "filter-select"}
          onClick={() => handleCliked("filters")}
        >
          <p>Filters</p>
        </div>
        <div
          className={isAdjust ? "filter-select active" : "filter-select"}
          onClick={() => handleCliked("adjustments")}
        >
          <p>Adjustments</p>
        </div>
      </div>
      <div className="filter-container">
        {isFilters && (
          <ul className="filter-list">
            {filterData.map((f) => (
              <li className="filter-item" key={f.id}>
                <figure
                  className={
                    classSelected === f.className
                      ? `filter-${f.className} active`
                      : `filter-${f.className}`
                  }
                  onClick={() => handleFilterClass(f.className)}
                >
                  <img
                    src="https://res.cloudinary.com/djqxdscwh/image/upload/v1689516738/social-app/filterimg_twtzdi.jpg"
                    alt=""
                    className="filter-img"
                  />
                </figure>
                <p className="filter-name">{f.name}</p>
              </li>
            ))}
          </ul>
        )}

        {isAdjust && (
          <form className="filter-form">
            {filterOptions.map((f, i) => (
              <FilterGroup
                field={f}
                key={i}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
              />
            ))}
          </form>
        )}
      </div>
    </div>
  );
};

export default FilterCustom;
