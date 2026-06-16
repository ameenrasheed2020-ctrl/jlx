import { useState } from 'react';
import { apiUrl } from '../../config/api';
import './Reg.css';

const Reg = () => {
  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [age, setage] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [password, setpassword] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Name === "" || email === "" || password === "") {
      alert("Please fill in Name, Email, and Password");
      return;
    }

    try {
      const payload = {
        Name,
        email,
        age,
        phonenumber,
        password
      };

      const response = await fetch(apiUrl("/auth/register"), {
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

          <button type="submit" className="custom-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reg;
