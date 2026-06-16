import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
// import { login } from '../../../../../server/Controler/authController' 

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [whatsappOtp, setWhatsappOtp] = useState("");
    const [otpRequested, setOtpRequested] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.body.className = `${theme}-mode`;
    }, [theme]);

    const navigate = useNavigate();

    const saveLoginAndRedirect = (data) => {
        const userId = data.user?._id || data.userId || data._id;
        if (userId) {
            localStorage.setItem("userId", userId);
        }
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        navigate('/');
    };

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

            const response = await fetch("http://localhost:6500/auth/login", {
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
                    saveLoginAndRedirect(data);
                    console.log("Success:", data);
                    setemail("");
                    setpassword("");
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

    const requestWhatsappLoginOtp = async () => {
        if (phoneNumber === "") {
            alert("Please enter your phone number");
            return;
        }

        setLoadingOtp(true);

        try {
            const response = await fetch("http://localhost:6500/auth/request-whatsapp-login-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phonenumber: phoneNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpRequested(true);
                alert(`OTP generated. WhatsApp will open now. The code expires in ${data.expiresInMinutes} minutes.`);

                if (data.whatsappUrl) {
                    window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
                }
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("WhatsApp OTP request error:", error);
            alert("Failed to request WhatsApp OTP.");
        } finally {
            setLoadingOtp(false);
        }
    };

    const loginWithWhatsappOtp = async () => {
        if (phoneNumber === "" || whatsappOtp === "") {
            alert("Please enter phone number and OTP");
            return;
        }

        setVerifyingOtp(true);

        try {
            const response = await fetch("http://localhost:6500/auth/login-whatsapp-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phonenumber: phoneNumber, otp: whatsappOtp }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("WhatsApp OTP login successful");
                saveLoginAndRedirect(data);
                setPhoneNumber("");
                setWhatsappOtp("");
                setOtpRequested(false);
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("WhatsApp OTP login error:", error);
            alert("Failed to login with WhatsApp OTP.");
        } finally {
            setVerifyingOtp(false);
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

                <div className="otp-divider">or</div>

                <div className="custom-form-group">
                    <label className="custom-label">Phone Number</label>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="custom-btn whatsapp-btn"
                    onClick={requestWhatsappLoginOtp}
                    disabled={loadingOtp}
                >
                    {loadingOtp ? "Generating OTP..." : otpRequested ? "Resend WhatsApp OTP" : "Login With WhatsApp OTP"}
                </button>

                {otpRequested && (
                    <>
                        <p className="otp-hint">
                            Open WhatsApp, send the prefilled message, then enter the 6 digit OTP below.
                        </p>
                        <div className="custom-form-group">
                            <label className="custom-label">WhatsApp OTP</label>
                            <input
                                type="text"
                                className="custom-input"
                                placeholder="Enter 6 digit OTP"
                                value={whatsappOtp}
                                maxLength="6"
                                onChange={(e) => setWhatsappOtp(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                        <button
                            type="button"
                            className="custom-btn"
                            onClick={loginWithWhatsappOtp}
                            disabled={verifyingOtp}
                        >
                            {verifyingOtp ? "Verifying OTP..." : "Verify OTP & Login"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
