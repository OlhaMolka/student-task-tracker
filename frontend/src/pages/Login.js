import React from "react";

const Login = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Login</h2>
      <input type="text" placeholder="Username" className="border p-2 mt-2 w-full" />
      <input type="password" placeholder="Password" className="border p-2 mt-2 w-full" />
      <button className="bg-blue-500 text-white p-2 mt-2 w-full">Sign In</button>
    </div>
  );
};
export default Login;