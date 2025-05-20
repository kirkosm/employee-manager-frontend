import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeList.css';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Προβολή λεπτομερειών
    const [viewEmployee, setViewEmployee] = useState(null);

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setEditingId(null);
    };

    const handleAddEmployee = () => {
        const newEmployee = { firstName, lastName, email };

        if (editingId) {
            axios.put(`http://localhost:8080/employees/${editingId}`, newEmployee)
                .then(response => {
                    setEmployees(employees.map(emp =>
                        emp.id === editingId ? response.data : emp
                    ));
                    resetForm();
                })
                .catch(error => {
                    console.error('Error updating employee:', error);
                });
        } else {
            axios.post('http://localhost:8080/employees', newEmployee)
                .then(response => {
                    setEmployees([...employees, response.data]);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error adding employee:', error);
                });
        }
    };

    const handleDeleteEmployee = (id) => {
        const confirmDelete = window.confirm('Είσαι σίγουρος/η ότι θες να διαγράψεις τον εργαζόμενο;');

        if (!confirmDelete) return;

        axios.delete(`http://localhost:8080/employees/${id}`)
            .then(() => {
                setEmployees(employees.filter(emp => emp.id !== id));
                if (editingId === id) resetForm();
            })
            .catch(error => {
                console.error('Error deleting employee:', error);
            });
    };


    const handleEditEmployee = (emp) => {
        setFirstName(emp.firstName);
        setLastName(emp.lastName);
        setEmail(emp.email);
        setEditingId(emp.id);
    };

    const handleViewEmployee = (emp) => {
        setViewEmployee(emp);
    };

    const handleCloseView = () => {
        setViewEmployee(null);
    };

    useEffect(() => {
        axios.get('http://localhost:8080/employees')
            .then(response => {
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });

    }, []);

    const filteredEmployees = employees.filter(emp =>
        `${emp.firstName} ${emp.lastName} ${emp.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="employee-container">
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Αναζήτηση..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
                />
            </div>

            <h2>Λίστα Εργαζομένων</h2>

            <div className="employee-form">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button onClick={handleAddEmployee}>
                    {editingId ? 'Αποθήκευση αλλαγών' : 'Προσθήκη'}
                </button>
            </div>

            {filteredEmployees.map(emp => (
                <div className="employee-item" key={emp.id}>
                    <span>{emp.firstName} {emp.lastName} ({emp.email})</span>
                    <div>
                        <button
                            onClick={() => handleViewEmployee(emp)}
                            style={{ marginRight: '10px', backgroundColor: '#17a2b8' }}
                        >
                            Προβολή
                        </button>
                        <button
                            onClick={() => handleEditEmployee(emp)}
                            style={{ marginRight: '10px', backgroundColor: '#ffc107' }}
                        >
                            Επεξεργασία
                        </button>
                        <button onClick={() => handleDeleteEmployee(emp.id)}>
                            Διαγραφή
                        </button>
                    </div>
                </div>
            ))}

            {viewEmployee && (
                <div className="employee-view">
                    <h3>Λεπτομέρειες Εργαζομένου</h3>
                    <p><strong>ID:</strong> {viewEmployee.id}</p>
                    <p><strong>Όνομα:</strong> {viewEmployee.firstName}</p>
                    <p><strong>Επώνυμο:</strong> {viewEmployee.lastName}</p>
                    <p><strong>Email:</strong> {viewEmployee.email}</p>
                    <button onClick={handleCloseView}>Κλείσιμο</button>
                </div>
            )}
        </div>
    );
}

export default EmployeeList;
