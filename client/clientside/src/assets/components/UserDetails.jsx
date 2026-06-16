// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const Edituserbyid=()=> {
//     const { id } = useParams();

//     const [user, setUser] = useState({});


//     const fetchuser = async () => {
//         try {
//             const response = await axios.get(apiUrl(`/user/getuser/${id}`));
//             console.log(response.data);
//             setUser(response.data)



//             // setUser(response.data.data);
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     };

//     useEffect(() => {
//         getUser();
//     }, [id]);

//     return (
//         <div>
//             <h2>{user.Name}</h2>
//             <p>{user.email}</p>
//             <p>{user.age}</p>
//             <p>{user.phonenumber}</p>
//         </div>
//     );
// }

// export default Edituserbyid;










// import React from 'react'

// const UserDetails = () => {

//     const [first, setfirst] = useState("sajid")

//     const sample = () => {
//         const response = { data: "ameen" }
//         console.log(response.data);
//         setfirst(response.data)


//     }

//     useEffect(() => {
//         sample()
//     }, [])


//     return (
//         <div>{first}</div>
//     )
// }

// export default UserDetails
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiUrl } from "../../config/api";

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState();

    const fetchUser = async () => {
        try {
            const response = await axios.get(
                apiUrl(`/user/getuser/${id}`)
            );

            console.log(response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);





    return (
        <div>
            <h2>{user?.Name}</h2>
            <p>{user?.email}</p>
            <p>{user?.age}</p>
            <p>{user?.phonenumber}</p>
        </div>
    );
};

export default UserDetails;
