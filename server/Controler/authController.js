const userModel = require("../Models/user")
const whatsappOtpModel = require("../Models/whatsappOtp")
const argon2 = require('argon2')
const crypto = require("crypto")
const jwt = require('jsonwebtoken')

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;

const normalizePhoneNumber = (phoneNumber) => {
    const digits = String(phoneNumber || "").replace(/\D/g, "");
    const defaultCountryCode = process.env.OTP_DEFAULT_COUNTRY_CODE || "91";

    if (digits.length === 10) {
        return `${defaultCountryCode}${digits}`;
    }

    return digits;
};

const hashOtp = (phoneNumber, otp) => {
    const secret = process.env.secret_key || "dev-otp-secret";

    return crypto
        .createHmac("sha256", secret)
        .update(`${phoneNumber}:${otp}`)
        .digest("hex");
};

const createWhatsappUrl = (phoneNumber, otp, purpose = "registration") => {
    const message = `Your JLX ${purpose} OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

const createOtp = async (phoneNumber, purpose) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await whatsappOtpModel.deleteMany({ phoneNumber, purpose });
    await whatsappOtpModel.create({
        phoneNumber,
        purpose,
        otpHash: hashOtp(phoneNumber, otp),
        expiresAt
    });

    return otp;
};

const findUserByPhoneNumber = async (phoneNumber) => {
    const localPhoneNumber = phoneNumber.length > 10 ? phoneNumber.slice(-10) : phoneNumber;
    const phoneCandidates = [phoneNumber, localPhoneNumber];
    const numericPhone = Number(phoneNumber);
    const numericLocalPhone = Number(localPhoneNumber);

    if (!Number.isNaN(numericPhone)) {
        phoneCandidates.push(numericPhone);
    }

    if (!Number.isNaN(numericLocalPhone)) {
        phoneCandidates.push(numericLocalPhone);
    }

    return userModel.findOne({ phonenumber: { $in: phoneCandidates } });
};

const requestWhatsappOtp = async (req, res) => {
    try {
        const { phonenumber, email } = req.body;
        const phoneNumber = normalizePhoneNumber(phonenumber);

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return res.status(400).json({ message: "Valid phone number is required" });
        }

        if (email) {
            const existingUser = await userModel.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: "user is already existed...." });
            }
        }

        const otp = await createOtp(phoneNumber, "register");

        res.json({
            message: "OTP generated. Open WhatsApp to send the OTP message for free.",
            whatsappUrl: createWhatsappUrl(phoneNumber, otp, "registration"),
            expiresInMinutes: OTP_EXPIRY_MINUTES
        });
    } catch (error) {
        console.error("WhatsApp OTP request error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const requestWhatsappLoginOtp = async (req, res) => {
    try {
        const { phonenumber } = req.body;
        const phoneNumber = normalizePhoneNumber(phonenumber);

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return res.status(400).json({ message: "Valid phone number is required" });
        }

        const user = await findUserByPhoneNumber(phoneNumber);

        if (!user) {
            return res.status(400).json({ message: "No account found with this phone number" });
        }

        const otp = await createOtp(phoneNumber, "login");

        res.json({
            message: "Login OTP generated. Open WhatsApp to send the OTP message for free.",
            whatsappUrl: createWhatsappUrl(phoneNumber, otp, "login"),
            expiresInMinutes: OTP_EXPIRY_MINUTES
        });
    } catch (error) {
        console.error("WhatsApp login OTP request error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const verifyWhatsappOtp = async (phoneNumber, otp, purpose = "register") => {
    const otpRecord = await whatsappOtpModel.findOne({ phoneNumber, purpose });

    if (!otpRecord) {
        return { ok: false, message: "Please request WhatsApp OTP first" };
    }

    if (otpRecord.verified) {
        return { ok: true };
    }

    if (otpRecord.expiresAt < new Date()) {
        await whatsappOtpModel.deleteOne({ _id: otpRecord._id });
        return { ok: false, message: "OTP expired. Please request a new OTP" };
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
        await whatsappOtpModel.deleteOne({ _id: otpRecord._id });
        return { ok: false, message: "Too many wrong OTP attempts. Please request a new OTP" };
    }

    const isValid = otpRecord.otpHash === hashOtp(phoneNumber, String(otp || ""));

    if (!isValid) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        return { ok: false, message: "Invalid OTP" };
    }

    otpRecord.verified = true;
    await otpRecord.save();

    return { ok: true };
};

const register = async (req, res) => {
    let { Name, email, password, age, phonenumber, profilephoto, otp } = req.body;
    const phoneNumber = normalizePhoneNumber(phonenumber);

    if (req.file && req.file.filename) {
        profilephoto = req.file.filename;
    }

    if (!Name || !email || !password || !phoneNumber || !otp) {
        return res.status(400).json({ message: "Name, email, password, phone number, and OTP are required" });
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
        return res.status(400).json({ message: "user is already existed...." })
    } else {
        const otpStatus = await verifyWhatsappOtp(phoneNumber, otp, "register");

        if (!otpStatus.ok) {
            return res.status(400).json({ message: otpStatus.message });
        }

        const hashedpasswrd = await argon2.hash(password);
        const userr = await userModel.create
            ({
                Name,
                email,
                password: hashedpasswrd,
                age,
                phonenumber: phoneNumber,
                profilephoto
            })
        console.log("User created successfully:", userr.email);

        await whatsappOtpModel.deleteMany({ phoneNumber, purpose: "register" });

        res.json({ data: userr, message: "user succesfully added" })
    }




}







const loginWithWhatsappOtp = async (req, res) => {
    try {
        const { phonenumber, otp } = req.body;
        const phoneNumber = normalizePhoneNumber(phonenumber);

        if (!phoneNumber || !otp) {
            return res.status(400).json({
                message: "Phone number and OTP required"
            });
        }

        const user = await findUserByPhoneNumber(phoneNumber);

        if (!user) {
            return res.status(400).json({
                message: "No account found with this phone number"
            });
        }

        const otpStatus = await verifyWhatsappOtp(phoneNumber, otp, "login");

        if (!otpStatus.ok) {
            return res.status(400).json({ message: otpStatus.message });
        }

        await whatsappOtpModel.deleteMany({ phoneNumber, purpose: "login" });

        const token = jwt.sign(
            { userId: user._id },
            process.env.secret_key,
            { expiresIn: "1h" },
        );

        res.json({ token: token, userId: user._id });
    } catch (error) {
        console.error("WhatsApp OTP login error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }


        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        const isValid = await argon2.verify(user.password, password);

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign(
            { userId: user._id },
            process.env.secret_key,
            { expiresIn: "1h" },
        );
        res.json({ token: token, userId: user._id });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};





module.exports = { register, login, requestWhatsappOtp, requestWhatsappLoginOtp, loginWithWhatsappOtp };
