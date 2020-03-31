import React from 'react';

import Modal from 'src/components/modal/Modal';

import './MessageSentResult.scss';

class MessageEvents extends React.Component {
  render() {
    return this.renderMessageEvents()
  }

  // Trying to get this simple modal to display, then adapt it
  renderMessageEvents() {
    return <Modal className="info-modal" open header="Available message events">
      <div className="info-text" dangerouslySetInnerHTML={{__html: "Test Item"}}></div>
      <button className="button">Ok</button>
    </Modal>;
  }

// To be modified into above
//   renderTable() {
//     const state = this.state;

//     const rows = this.itemsConfig.map(item => {
//       return <tr key={item.name}>
//         <td>{item.title}</td>
//         <td>
//           {state.edit ?
//             <><Input type="number" name={item.name}
//                 value={state.data[item.name]} onChange={this.inputChange}/> {item.unit}</> :
//             `${state.data[item.name]}${item.unit}`}
//         </td>
//       </tr>;
//     });

//     const className = classNames('table', { edit: state.edit });

//     return <table className={className}>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th style={{width: 200}}>Value</th>
//         </tr>
//       </thead>
//       <tbody>{rows}</tbody>
//     </table>;
//   }

}

export default MessageEvents;
