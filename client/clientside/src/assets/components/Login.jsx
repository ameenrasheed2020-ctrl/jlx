import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import './Login.css';
// import { login } from '../../../../../server/Controler/authController' 

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.body.className = `${theme}-mode`;
    }, [theme]);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
            alert("Please fill in Email and Password");
            return;
        }

        try {
            const payload = {
                email,
                password
            };

            const response = await fetch(apiUrl("/auth/login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();

                if (response.ok) {
                    alert("Login successful");
                    // Flexible ID extraction
                    const userId = data.user?._id || data.userId || data._id;
                    if (userId) {
                        localStorage.setItem("userId", userId);
                    }
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }
                    console.log("Success:", data);
                    setemail("");
                    setpassword("");
                    navigate('/'); // Navigate to homepage after successful login
                } else {
                    alert("Error: " + data.message);
                    console.error("Error:", data);
                }
            } else {
                const textError = await response.text();
                console.error("Received non-JSON response:", textError);
                alert("Server error: Received unexpected response format.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Failed to connect to the server.");
        }
    };

    return (
        <div className="login-container">
            <div className="glass-card">
                <h2 className="login-title">jlx</h2>
                <form onSubmit={handleSubmit}>

                    <div className="custom-form-group">
                        <label className="custom-label">Email Address</label>
                        <input
                            type="email"
                            className="custom-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                        />
                    </div>

                    <div className="custom-form-group">
                        <label className="custom-label">Password</label>
                        <input
                            type="password"
                            className="custom-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="custom-btn">
                        Login
                    </button>
                </form>
                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
