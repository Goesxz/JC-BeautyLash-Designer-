const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  const { email, password } = req.body;

  console.log("Email recebido:", JSON.stringify(email));
  console.log("Email esperado:", JSON.stringify(process.env.ADMIN_EMAIL));
  console.log(
    "Hash carregado do .env existe?",
    Boolean(process.env.ADMIN_PASSWORD_HASH),
  );

  // ... resto do código continua igual

  const isValidEmail = email === process.env.ADMIN_EMAIL;

  if (!isValidEmail) {
    return res.status(401).json({
      error: "E-mail ou senha inválidos.",
    });
  }

  const isValidPassword = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH,
  );

  if (!isValidPassword) {
    return res.status(401).json({
      error: "E-mail ou senha inválidos.",
    });
  }

  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  return res.json({
    message: "Login realizado com sucesso.",
    token,
    admin: {
      email,
    },
  });
}

module.exports = {
  login,
};
