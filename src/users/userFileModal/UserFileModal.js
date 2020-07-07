import React from 'react';

import Modal from '../../components/modal/Modal';

import './UserFileModal.scss';


const UserFileModal = ({ onSelectFile, onSetDescription, onClickUpload, onClose }) => (
    <Modal
        header="Upload file to user records"
        onClose={onClose}
        open
    >
        <div className="form-group">
            <div className="grid-row">
                <div className="grid-col">
                    <div className="form-label">Please select a file: </div>
                    <input type="file" name="file" onChange={onSelectFile}/>
                </div>
            </div>
            <div className="grid-row">
                <div className="grid-col">
                    <div className="form-label">Please describe the file: </div>
                    <input className="input" type="text" name="fileLogDescription" onChange={onSetDescription} />
                </div>
            </div>
            <div className="grid-row">
                <button className="button" onClick={onClickUpload}>Upload</button>
            </div>
        </div>
    </Modal>
);

export default UserFileModal;