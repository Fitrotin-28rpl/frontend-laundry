import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";
import gambar from "./img-m.png";
import avatar from "./avatar.png";
import Navbar from "../Navbar";

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      id_user: "",
      nama: "",
      username: "",
      password: "",
      role: "",
      visible: true,
      fillPassword: true,
      masterPacks:[],
      search:""
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  tambahData() {
    //memunculkan modal
    this.modalUser = new Modal(document.getElementById("modal-user"));
    this.modalUser.show();

    //mengosongkan inputannya
    this.setState({
      nama: "",
      username: "",
      password: "",
      role: "",
      id_user: Math.random(1, 1000000),
      action: "tambah",
      fillPassword: true,
    });
  }

  ubahData(id_user) {
    this.modalUser = new Modal(document.getElementById("modal-user"));
    this.modalUser.show();

    //mencari posisi index dari data user berdasarkan id_user pada array users
    let index = this.state.users.findIndex((user) => user.id_user === id_user);

    this.setState({
      id_user: this.state.users[index].id_user,
      nama: this.state.users[index].nama,
      username: this.state.users[index].username,
      password: "",
      role: this.state.users[index].role,
      action: "ubah",
      fillPassword: false,
    });
  }

  simpanData(event) {
    event.preventDefault();
    //mencegah berjalannya aksi default
    //dari form submit

    //menghilangkan Modalnya
    this.modalUser.hide();
    //cek aksi tambah atau ubah
    if (this.state.action === "tambah") {
      let endpoint = `${baseUrl}/users`;
      //menampung data dari pengguna
      let newUser = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        password: this.state.password,
        role: this.state.role,
      };

      // let temp = this.state.users
      // temp.push(newUser)

      // this.setState({users : temp})
      axios
        .post(endpoint, newUser, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    } else if (this.state.action === "ubah") {
      this.modalUser.hide();
      let endpoint = `${baseUrl}/users/` + this.state.id_user;
      //mencari posisi index dari data user berdasarkan id_user pada array users
      // let index = this.state.users.findIndex(user => user.id_user === this.state.id_user)
      // this.setState({users: temp})
      let newUser = {
        id_user: this.state.id_user,
        nama: this.state.nama,
        username: this.state.username,
        role: this.state.role,
      };
      if (this.state.fillPassword === true) {
        newUser.password = this.state.password;
      }
      axios
        .put(endpoint, newUser, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }
  hapusData(id_user) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      let endpoint = `${baseUrl}/users/` + id_user;
      axios
        .delete(endpoint, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  getData() {
    let endpoint = `${baseUrl}/users`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ users: response.data });
        this.setState({ masterPacks: response.data });
      })
      .catch((error) => console.log(error));
  }
  searching(ev){
    let code = ev.keyCode;
    if (code === 13){
      let data = this.state.masterPacks;
      let found = data.filter(it =>
        it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
        this.setState({users: found});
    }
  }
  componentDidMount() {
    //fungsi ini dijalankan setelah fungsi render berjalan
    this.getData();
    let user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "Admin") {
      this.setState({
        visible: true,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  showPassword() {
    if (this.state.fillPassword === true) {
      return (
        <div>
          Password
          <input
            type="password"
            className="form-control mb-1"
            required
            value={this.state.password}
            onChange={(ev) => this.setState({ password: ev.target.value })}
          />
        </div>
      );
    } else {
      return (
        <button
          className="mb-1 btn btn-warning text-white" id="btn-pass"
          onClick={() => this.setState({ fillPassword: true })}
        >
          Change Password
        </button>
      );
    }
  }

  render() {
    return (
      <div className="background-user">
        <Navbar />
        <div className="card-body">
          <div className="container user">
            <div className="row">
              <div className="col-lg-7">
                <h1 className="header mt-5">
                  Selamat Datang!
                  <br />
                  <span className="header-blue">User </span>
                  <span className="header-black">Rello</span>
                </h1>
                <h1 className="header-2">Sehat Selalu</h1>
                <button
                  class={`btn btn-warning btn-add mt-4 text-white ${
                    this.state.visible ? `` : `d-none`
                  }`}
                  type="button"
                  onClick={() => this.tambahData()}
                >
                  {" "}
                  Tambah User
                </button>
              </div>
              <div className="col-lg-4 pt-2">
                <img src={gambar} width="500"></img>
              </div>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="container user">
          <div className="card-body mt-3">
            <div className="row">
              <div className="col-lg-9 mb-3 ">
                <h4 className="headers">
                  <i class="fa-solid fa-user-tag" id="icon-header"></i>Data
                  Petugas
                </h4>
              </div>
              <div className="col-lg-3 mb-3 d-grid d-md-flex justify-content-md-end ">
                <input type="text" placeholder = "Cari data User" value={this.state.search} onChange={ev => this.setState({search: ev.target.value})} onKeyUp={(ev)=>this.searching(ev)} id="search-bar" />
              </div>
            </div>

            <ul className="list-group">
              {this.state.users.map((user) => (
                <li className="list-group-item data-list py-3 card">
                  <div className="row">
                    {/* bagian untuk nama */}
                    <div className="col-lg-1">
                      <img src={avatar} width="60"></img>
                    </div>
                    <div className="col-lg-3">
                      <small className="title-user">Nama</small> <br />
                      {user.nama}
                    </div>
                    {/* bagian untuk  gender*/}
                    <div className="col-lg-3">
                      <small className="title-user">Username</small> <br />
                      {user.username}
                    </div>
                    {/* bagian untuk alamat */}
                    <div className="col-lg-3">
                      <small className="title-user">Role</small> <br />
                      {user.role}
                    </div>
                    {/* bagian untuk button */}
                    <div className="col-lg-2 px-5">
                      <button
                        className={`btn btn-warning btn-sm mt-1 mx-2 text-white ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.ubahData(user.id_user)}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className={`btn btn-danger btn-sm mt-1 ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.hapusData(user.id_user)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/*  */}
          {/* form modal User */}
          <div className="modal" id="modal-user">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-1">
                    <button
                      type="button"
                      class="btn btn-lg"
                      data-bs-dismiss="modal"
                    >
                      <i class="fa-solid fa-xmark text-white"></i>
                    </button>
                  </div>
                  <h4 className="modal-title">Hai kembali lagi!</h4>
                  <h3 className="modal-desc">
                    Buat User baru Rello<span className="dot">.</span>
                  </h3>
                  <form onSubmit={(ev) => this.simpanData(ev)}>
                    <h4 className="modal-title mb-2">Nama </h4>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={this.state.nama}
                      onChange={(ev) =>
                        this.setState({ nama: ev.target.value })
                      }
                      required
                    />
                    <h4 className="modal-title mb-2">Username </h4>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={this.state.username}
                      onChange={(ev) =>
                        this.setState({ username: ev.target.value })
                      }
                      required
                    />
                    {this.showPassword()}
                    <h4 className="modal-title mb-2">Role</h4>
                    <select
                      required
                      className="form-control mb-2"
                      value={this.state.role}
                      onChange={(ev) =>
                        this.setState({ role: ev.target.value })
                      }
                    >
                      <option value="">Pilih Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Kasir">Kasir</option>
                      <option value="Owner">Owner</option>
                    </select>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-1">
                      <button
                        type="submit"
                        className="btn btn-success btn-sm text-white" id="btn-sv"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default User;
