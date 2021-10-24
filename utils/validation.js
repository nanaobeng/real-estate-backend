module.exports = function(req, res, next) {
    const { email,  password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      
      if (![email,  password].every(Boolean)) {
        return res.json({error:"Missing Credentials"});
      } else if (!validEmail(email)) {
        return res.json({error:"Invalid Email"});
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.json({error:"Missing Credentials"});
      } else if (!validEmail(email)) {
        return res.json({error:"Invalid Email Format"});
      }
    }
  
    next();
  };