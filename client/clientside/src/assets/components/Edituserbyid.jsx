import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { apiUrl } from "../../config/api";

function EditUserById() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    useEffect(() => {
        axios
            .get(apiUrl(`/user/getuser/${id}`))
            .then((res) => setUser(res.data))
            .catch(console.error);
    }, [id]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const updateUser = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                apiUrl(`/user/updateuser/${id}`),
                user
            );
            alert("Updated Successfully");
            navigate("/userlist");
        } catch (err) {
            alert("Update Failed");
        }
    };

    return (
        <form onSubmit={updateUser}>
            <h2>Edit User</h2>

            <input
                type="text"
                name="Name"
                value={user.Name || ""}
                onChange={handleChange}
                placeholder="Name"
            />

            <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                placeholder="Email"
            />

            <input
                type="number"
                name="age"
                value={user.age || ""}
                onChange={handleChange}
                placeholder="Age"
            />

            <input
                type="text"
                name="phonenumber"
                value={user.phonenumber || ""}
                onChange={handleChange}
                placeholder="Phone Number"
            />

            <button type="submit">Update</button>
        </form>
    );
}

export default EditUserById;
