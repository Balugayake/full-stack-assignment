"use client";
import React from 'react';
import { Modal } from 'react-bootstrap';

export interface Marks {
  id: number;
  mark: number;
  studentId: number;
  subject: string;
}

export interface StudentMarkModalProps {
  marks: Marks[];
  show: boolean;
  handleClose: () => void;
}

const StudentMarkModal: React.FC<StudentMarkModalProps> = ({ show,marks, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Student Subject Marks</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Subject</th>
            <th scope="col">Mark</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((mark, index) => (
            <tr key={mark.id}>
              <th scope="row">{index + 1}</th>
              <td>{mark.subject}</td>
              <td>{mark.mark}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleClose} className="btn btn-secondary mt-3 ">Close</button>
    </div>
    </Modal.Body>
  </Modal>
  );
}

export default StudentMarkModal;
