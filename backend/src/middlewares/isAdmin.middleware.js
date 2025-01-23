const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };
  
  export default isAdmin;
  