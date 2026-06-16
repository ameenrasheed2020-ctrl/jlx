import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserList.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { apiUrl } from '../../config/api';





const UserList = () => {
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                apiUrl("/user/getuser")
            );

            setUsers(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const NavigateViewID = (id) => {
        navigate(`/user/${id}`);
    };

    const EditbyID = (id) => {
        navigate(`/edituser/${id}`);
    };
    const DeletUser = (id) => {
        navigate(`/deleteuser/${id}`)
    }

    return (
        <div className="user-list-container">
            <h2 className="title">Registered Users</h2>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((item) => (
                        <tr key={item._id}>
                            <td>{item.Name}</td>
                            <td>{item.email}</td>
                            <td>{item.age}</td>
                            <td>{item.phonenumber}</td>

                            <td>
                                <FaEye
                                    onClick={() =>
                                        NavigateViewID(item._id)
                                    }

                                />

                                <MdModeEditOutline
                                    onClick={() =>
                                        EditbyID(item._id)
                                    }
                                />



                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default UserList
