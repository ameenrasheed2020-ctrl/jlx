import { useState } from 'react';
import './Reg.css';

const Reg = () => {
  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [age, setage] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [password, setpassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);

  const requestWhatsappOtp = async () => {
    if (email === "" || phonenumber === "") {
      alert("Please enter Email and Phone Number first");
      return;
    }

    setLoadingOtp(true);

    try {
      const response = await fetch("http://localhost:6500/auth/request-whatsapp-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phonenumber }),
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
      console.error("OTP request error:", error);
      alert("Failed to request WhatsApp OTP.");
    } finally {
      setLoadingOtp(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Name === "" || email === "" || password === "" || phonenumber === "" || otp === "") {
      alert("Please fill in Name, Email, Phone Number, Password, and OTP");
      return;
    }

    setRegistering(true);

    try {
      const payload = {
        Name,
        email,
        age,
        phonenumber,
        password,
        otp
      };

      const response = await fetch("http://localhost:6500/auth/register", {
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
          alert("Registration successful!");
          console.log("Success:", data);
          setName("");
          setemail("");
          setage("");
          setphonenumber("");
          setpassword("");
          setOtp("");
          setOtpRequested(false);

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
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2 className="login-title">welcome to JLX</h2>
        <h2 className="product-name">where you find yor stuffs</h2>
        <form onSubmit={handleSubmit}>

          <div className="custom-form-group">
            <label className="custom-label">Name</label>
            <input
              type="text"
              className="custom-input"
              placeholder="Enter your name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            <label className="custom-label">Age</label>
            <input
              type="number"
              className="custom-input"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setage(e.target.value)}
            />
          </div>

          <div className="custom-form-group">
            <label className="custom-label">Phone Number</label>
            <input
              type="text"
              className="custom-input"
              placeholder="Enter phone number"
              value={phonenumber}
              onChange={(e) => setphonenumber(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="custom-btn secondary-btn"
            onClick={requestWhatsappOtp}
            disabled={loadingOtp}
          >
            {loadingOtp ? "Generating OTP..." : otpRequested ? "Resend WhatsApp OTP" : "Send WhatsApp OTP"}
          </button>

          {otpRequested && (
            <p className="otp-hint">
              Open WhatsApp, send the prefilled message, then enter the 6 digit OTP below.
            </p>
          )}

          <div className="custom-form-group">
            <label className="custom-label">WhatsApp OTP</label>
            <input
              type="text"
              className="custom-input"
              placeholder="Enter 6 digit OTP"
              value={otp}
              maxLength="6"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>


          <div className="custom-form-group">
            <label className="custom-label">Password</label>
            <input
              type="password"
              className="custom-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>

          <button type="submit" className="custom-btn" disabled={registering}>
            {registering ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reg;
