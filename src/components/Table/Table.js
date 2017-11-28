import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '../Button';

const Table = ({list, onDismiss}) =>
  <div className={"table"}>
    { list.map(
      item =>
        <div key={item.objectID} className={"table-row"}>
            <span style={{ width: "40%"}}>
              <a href={item.url}>{item.title}</a>
            </span>
          <span style={{ width: "30%"}}>{item.author}</span>
          <span style={{ width: "10%"}}>{item.num_comments}</span>
          <span style={{ width: "10%"}}>{item.points}</span>
          <span style={{ width: "10%"}}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className={"button-inline"}
              >
                Dismiss
              </Button>
            </span>
        </div>
    )
    }
  </div>;

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func,
};

export default Table;