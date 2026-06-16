import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../config/api";

function DeleteUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const Deletefunction = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                apiUrl(`/user/deleteuser/${id}`)
            );

            alert("User Deleted");
            navigate("/userlist");
        } catch (err) {
            console.error(err);
            alert("not deleted");
        }
    };

    return (
        <button onClick={Deletefunction}>
            Delete User
        </button>
    );
}

export default DeleteUser;
