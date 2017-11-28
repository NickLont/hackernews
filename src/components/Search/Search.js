import React from 'react';
import { PropTypes } from 'prop-types';

const Search = ({ value, onChange, children, onSubmit }) =>
  (
    <form onSubmit={onSubmit}>
      <input
        type={"text"}
        value={value}
        onChange={onChange}
      />
      <button type={"submit"}>
        {children}
      </button>
    </form>
  );

Search.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.node,
};

export default Search;
