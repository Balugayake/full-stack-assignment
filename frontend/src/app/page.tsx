"use client"
import "./globals.css"
// import Modal from "react-bootstrap/Modal";
// import StudentModal from "./components/StudentModal";
import StudentModal from "./components/StudentModal";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import Swal from 'sweetalert2';
import StudentMarkModal, { Marks } from "./components/StudentMarkModal";
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";

export interface  Student {
  id: number;
  firstName: string;
  lastName: string;
  rollNumber: string;
  marks: Marks[];
}
export interface  StudentData {
  total: number;
  page: number;
  limit: number
  students: Student[];
}

export default function Home() {
const [isModalOpen, setIsModalOpen] = useState(false);
const [isModalMarkOpen, setIsModalMarkOpen] = useState(false);
const [selectedStudentId, setSelectedStudentId] = useState('');
const [currentPage, setCurrentPage] = useState<number>(1);
const [perPage, setPerPage] = useState<number>(10);
const [pageSize] = useState(10);
const [searchQuery, setSearchQuery] = useState<string>('');
const [studentsData, setStudents] = useState<StudentData>({ 
    total: 0,
    page: perPage,
    limit: pageSize,
    students: []
  });
  const apiUrl= process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchStudents();
  }, [currentPage, perPage]);
  const fetchStudents = async () => {
    try {
      const fetchData = await axios.get(`${apiUrl}/user?page=${currentPage}&limit=${pageSize}`);
      setStudents(fetchData.data);
    } catch (error) {
      console.log(error);
    }
  }
  const handleNextPage = () => {
    if (studentsData && currentPage < Math.ceil(studentsData.total / perPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

const handleModal = () => { 
  setSelectedStudentId('');
  setIsModalOpen(!isModalOpen);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
}
const handleMarkModal = (studentId:string) => {
  setSelectedStudentId(studentId);
  setIsModalMarkOpen(!isModalOpen);
};

const handleCloseMarkModal = () => {
  setIsModalMarkOpen(false);
}
const handleDelete = (studentId:number) => {
  // Show SweetAlert confirmation dialog
  const MySwal = withReactContent(Swal);;
  MySwal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this student!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  }).then(async (result: { isConfirmed: any; }) => {
    if (result.isConfirmed) {
      // Delete student
      await axios.delete(`${apiUrl}/user/${studentId}`);
      fetchStudents();
      console.log(`Deleting student with ID ${studentId}`);
      MySwal.fire('Deleted!', 'The student has been deleted.', 'success');
    }
  });
};

const editStudentData = (studentId:any) => {
  setSelectedStudentId(studentId);
  setIsModalOpen(!isModalOpen);
}
const handlePerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = parseInt(e.target.value, 10);
  if (!isNaN(value) && value > 0) {
    setPerPage(value);
    setCurrentPage(1); // Reset to first page when changing perPage
  }
};
const filteredStudents = useMemo(() => {
  if (!studentsData?.students) return {};
  const data= studentsData.students.filter(student =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return {
    total: studentsData.total ?? 0,
    page: studentsData.page ?? 1,
    limit: studentsData.limit ?? 10,
    students: data ?? [],
  };
}, [studentsData?.students, searchQuery]);
console.log(filteredStudents)
  return (
    <div className="container">
      <h1 className="text-danger">NadSoft Machine Test</h1>
      <div className="table-container">
        {/* //serach bar */}
        <div className="table-header">
          <div className="search">
           <span>Search</span> <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
          <div className="create-user">
          <button type="button" className="btn btn-primary"  onClick={handleModal}>
        Add Student
      </button>
      <StudentModal show={isModalOpen} handleClose={handleCloseModal}/>
          </div>
        </div>
        {/* //tabel thing here */}
        <div className="table-body">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">StudentID</th>
                <th scope="col">FirstName</th>
                <th scope="col">LastName</th>
                <th scope="col">RollNumber</th>
                <th scope="col">Pecentage</th>
                <th scope="col">View The Subject Marks</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>

              </tr>
            </thead>
            <tbody>
              {filteredStudents?.students?.map((student: Student) => (
                <tr key={student.id}>
                  <th scope="row">{student.id}</th>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.marks.reduce((a, b) => a + b.mark, 0) / student.marks.length}</td>
                  <td>
                    <a href="#" onClick={()=>handleMarkModal(student.rollNumber)}>View The Subject Marks</a>                  
                    <StudentMarkModal show={isModalMarkOpen} marks={student.marks} handleClose={handleCloseMarkModal}/>
                  </td>
                  <td>
                    <a href="#" onClick={() => editStudentData(student.id)}>Edit</a>
                  </td>
                  <td>
                    <a href="#" onClick={() => handleDelete(student.id)}>Delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* //pagination here */}
        <div className="table-footer">
          <div>
            show <input type="number" value={perPage} onChange={handlePerPageChange} min={10} max={studentsData?.total}/> entries Out of <b>{studentsData?.total}</b>
          </div>
          <div className="pagination">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handlePreviousPage}>Previous</button>
            </li>
            <li className={`page-item ${currentPage === Math.ceil(studentsData?.total / perPage) ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handleNextPage}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
        </div>
      </div>
      {selectedStudentId && (
        <StudentMarkModal
          show={isModalMarkOpen}
          marks={studentsData?.students.find(student => student.rollNumber === selectedStudentId)?.marks || []}
          handleClose={handleCloseMarkModal}
        />
      )}
        {selectedStudentId && (
          <StudentModal show={isModalOpen} handleClose={handleCloseModal} userData={studentsData?.students.find(student => student.id === parseInt(selectedStudentId))}/>
      )}
    </div>
  );
}


