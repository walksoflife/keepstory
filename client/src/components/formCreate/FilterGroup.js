import { useEffect, useState } from "react";

const FilterGroup = ({
  field,
  // customFilter,
  setCustomFilter,
  filterOptions,
  setFilterOptions,
}) => {
  const { value, name } = field;
  const [valueFilter, setValueFilter] = useState(value);

  const handleFilterValue = (e) => setValueFilter(e.target.value);

  useEffect(() => {
    const customFilter = filterOptions.map((option) => {
      if (option.name === name) {
        return { ...option, value: parseInt(valueFilter) };
      }
      return option;
    });
    setFilterOptions(customFilter);
  }, [valueFilter]);
  
  return (
    <div className="filter-form-group">
      <label htmlFor="brightness">{name}</label>
      <div className="filter-form-wrapper">
        <input
          type="range"
          value={valueFilter}
          className="filter-form-input"
          onChange={handleFilterValue}
        />
        {/* <p className="filter-form-value">{f.value}</p> */}
      </div>
    </div>
  );
};

export default FilterGroup;
