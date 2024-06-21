"use client";

import axios, { AxiosResponse } from 'axios';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { StudentData,Student } from '../page';

export interface StudentModalProps {
  show: boolean;
  handleClose: () => void;
  userData?: Student;
  isUpdated?: boolean;
}

interface Mark {
  subject: string;
  mark: number;
}

const StudentModal: React.FC<StudentModalProps> = ({ show, handleClose ,userData,isUpdated}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<string>('');
  const [marks, setMarks] = useState<Mark[]>([
    { subject: 'Math', mark: 0 },
    { subject: 'Chemistry', mark: 0 },
    { subject: 'Physics', mark: 0 },
    { subject: 'Biology', mark: 0 },
  ]);
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setRollNumber(userData.rollNumber);
      setMarks(userData.marks);
    }
  }, [userData]);
  const handleMarkChange = (index: number, field: keyof Mark, value: string) => {
    const newMarks = [...marks];
    if (field === 'mark') {
      newMarks[index][field] = parseInt(value, 10); // Convert string to number
    } else {
      newMarks[index][field] = value;
    }
    setMarks(newMarks);
  };
  const apiUrl= process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();let response;
    
    if (userData) {
      // Update existing student
      response = await axios.put(`${apiUrl}/user/${userData.id}`, {
        firstName,
        lastName,
        rollNumber,
        marks,
      });
    } else {
      // Create new student
      response = await axios.post(`${apiUrl}/user`, {
        firstName,
        lastName,
        rollNumber,
        marks,
      });
    }
    if (response.status === 200 || response.status === 201) {
      const msg=userData ? 'Student updated successfully' : 'Student added successfully'
      alert(msg);
      setFirstName('');
      setLastName('');
      setRollNumber('');
      setMarks([
        { subject: 'Math', mark: 0 },
        { subject: 'Chemistry', mark: 0 },
        { subject: 'Physics', mark: 0 },
        { subject: 'Biology', mark: 0 },
      ]);
      handleClose();
    } else {
      alert('Failed to add student');
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rollNumber">Roll Number</label>
            <input
              type="text"
              className="form-control"
              id="rollNumber"
              value={rollNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRollNumber(e.target.value)}
              required
            />
          </div>
          {marks.map((mark, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`subject-${index}`}>{mark.subject}{" Mark"}</label>
              <input
                type="number"
                className="form-control"
                id={`mark-${index}`}
                value={mark.mark}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleMarkChange(index, 'mark', e.target.value)}
                required
                min={0}
                max={100}
              />
            </div>
          ))}
          <div className="d-flex" style={{justifyContent: "space-between"}}>
          <button type="submit" className="btn btn-primary mt-3">Submit</button>
          <button onClick={handleClose} className="btn btn-danger mt-3">Close</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default StudentModal;
