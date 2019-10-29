import React from 'react';

import './TagList.scss';

const TagList = props => {
  const tags = (typeof props.tags === 'string' ? props.tags.split(',') : props.tags) || [];
  return <ul className="tag-list">{tags.map((tag, index) => <li key={index}>{tag}</li>)}</ul>;
};

export default TagList;