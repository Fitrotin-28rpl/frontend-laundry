import React from "react";
import axios from "axios";
import { baseUrl } from "../config";
import gambar from "./login.png";
import avatar from "./avatar.png";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }

  loginProcess(event) {
    event.preventDefault();
    let endpoint = `${baseUrl}/api/auth`;
    let request = {
      username: this.state.username,
      password: this.state.password,
    };
    axios
      .post(endpoint, request)
      .then((result) => {
        if (result.data.logged) {
          //store token in local storage
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          let user = JSON.parse(localStorage.getItem("user")) 
          window.alert(`Selamat datang ${user.role} Rello`);
          window.location.href = "/";
        } else {
          window.alert("Whooops!, wrong username and password");
        }
      })
      .catch((error) => console.log(error));
  }
  render() {
    return (
      <div className="body-login">
        <div className="card-login">
          <div className="container-login">
            <div className="img-login">
              <img src={gambar} width="500"></img>
            </div>
            <div className="login-content">
              <form onSubmit={(ev) => this.loginProcess(ev)} className="form">
                <img src={avatar} width="80"></img>
                <h2>Sign In</h2>
                <div className="input-div one">
                  <div className="i">
                    <i class="fas fa-user"></i>
                  </div>
                  <div className="div">
                    <h5>Username</h5>
                    <input
                      type="text"
                      required
                      value={this.state.username}
                      onChange={(ev) =>
                        this.setState({ username: ev.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="input-div pass">
                  <div className="i">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="div">
                    <h5>Password</h5>
                    <input
                      type="password"
                      required
                      value={this.state.password}
                      onChange={(ev) =>
                        this.setState({ password: ev.target.value })
                      }
                    />
                  </div>
                </div>
                <input
                  type="submit"
                  className="btn-login"
                  value="Login"
                ></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
