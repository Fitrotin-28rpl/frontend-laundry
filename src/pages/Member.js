import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";
import gambar from "./rumpi.png";
import Navbar from "../Navbar";
import avatar from "./avatar.png";

class Member extends React.Component {
  constructor() {
    super();
    this.state = {
      id_member: "",
      nama: "",
      alamat: "",
      jenis_kelamin: "",
      telepon: "",
      action: "",
      role: "",
      visible: "",
      members: [],
      masterPacks:[],
      search:""
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  tambahData() {
    //memunculkan modal
    this.modalMember = new Modal(document.getElementById("modal-member"));
    this.modalMember.show();

    //mengosongkan inputannya
    this.setState({
      nama: "",
      alamat: "",
      telepon: "",
      jenis_kelamin: "",
      id_member: Math.random(1, 1000000),
      action: "tambah",
    });
  }

  ubahData(id_member) {
    this.modalMember = new Modal(document.getElementById("modal-member"));
    this.modalMember.show();

    //mencari posisi index dari data member berdasarkan id_member pada array members
    let index = this.state.members.findIndex(
      (member) => member.id_member === id_member
    );

    this.setState({
      id_member: this.state.members[index].id_member,
      nama: this.state.members[index].nama,
      alamat: this.state.members[index].alamat,
      telepon: this.state.members[index].telepon,
      jenis_kelamin: this.state.members[index].jenis_kelamin,
      action: "ubah",
    });
  }

  simpanData(event) {
    event.preventDefault();
    //mencegah berjalannya aksi default
    //dari form submit
    //cek aksi tambah atau ubah
    if (this.state.action === "tambah") {
      let endpoint = `${baseUrl}/member`;
      //menampung data dari pengguna
      let newMember = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        telepon: this.state.telepon,
        jenis_kelamin: this.state.jenis_kelamin,
      };
      axios
        .post(endpoint, newMember, authorization) //validasi token
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
      this.modalMember.hide();
    } else if (this.state.action === "ubah") {
      let endpoint = `${baseUrl}/member/` + this.state.id_member;

      let newMember = {
        id_member: this.state.id_member,
        nama: this.state.nama,
        alamat: this.state.alamat,
        telepon: this.state.telepon,
        jenis_kelamin: this.state.jenis_kelamin,
      };
      axios
        .put(endpoint, newMember, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
      this.modalMember.hide();
    }
  }
  hapusData(id_member) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      let endpoint = `${baseUrl}/member/` + id_member;
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
    let endpoint = `${baseUrl}/member`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ members: response.data });
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
        this.setState({members: found});
    }
  }
  componentDidMount() {
    //fungsi ini dijalankan setelah fungsi render berjalan
    this.getData();
    let user = JSON.parse(localStorage.getItem("user"));

    this.setState({
      role: user.role,
    });
    //cara kedua
    if (user.role === "Admin" || user.role === "Kasir") {
      this.setState({
        visible: true,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  }

  showAddButton() {
    if (this.state.role === "admin" || this.state.role === "kasir") {
      return (
        <button
          className="btn btn-sm btn-success my-3"
          onClick={() => this.tambahData()}
        >
          Tambah data Member
        </button>
      );
    }
  }

  render() {
    return (
      <div className="background-member">
        <Navbar />
        <div className="card-body">
          <div className="container member">
            <div className="row">
              <div className="col-lg-7">
                <h1 className="header mt-5">
                  Selamat Datang!
                  <br />
                  <span className="header-blue">Member </span>
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
                  Tambah Member
                </button>
              </div>
              <div className="col-lg-4 pb-2 ">
                <img src={gambar} width="500" ></img>
              </div>
            </div>
          </div>
        </div>

        <div className="container member">
          <div className="card-body mt-2 pb-4">
            <div className="row">
              <div className="col-lg-9 mb-3 ">
              <h4 className="headers">
                <i class="fa-solid fa-user-group" id="icon-header"></i>
                Data Member
              </h4>
              </div>
              <div className="col-lg-3 mb-3 d-grid d-md-flex justify-content-md-end ">
                <input type="text" placeholder = "Cari data Member" value={this.state.search} onChange={ev => this.setState({search: ev.target.value})} onKeyUp={(ev)=>this.searching(ev)} id="search-bar" />
              </div>
            </div>
            

            <ul className="list-group">
              {this.state.members.map((member) => (
                <li className="list-group-item data-list py-3 card">
                  <div className="row">
                    {/* bagian untuk nama */}
                    <div className="col-lg-1">
                      <img src={avatar} width="60"></img>
                    </div>
                    <div className="col-lg-2">
                      <small className="title-member">Nama</small> <br />
                      {member.nama}
                    </div>
                    {/* bagian untuk  gender*/}
                    <div className="col-lg-2">
                      <small className="title-member">Gender</small> <br />
                      {member.jenis_kelamin}
                    </div>
                    {/* bagian untuk telepon */}
                    <div className="col-lg-2">
                      <small className="title-member">Telepon</small> <br />
                      {member.telepon}
                    </div>
                    {/* bagian untuk alamat */}
                    <div className="col-lg-3">
                      <small className="title-member">Alamat</small> <br />
                      {member.alamat}
                    </div>
                    {/* bagian untuk button */}
                    <div className="col-lg-2 px-5">
                      <button
                        className={`btn btn-warning btn-sm mt-1 mx-2 text-white ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.ubahData(member.id_member)}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className={`btn btn-danger btn-sm mt-1 ${
                          this.state.visible ? `` : `d-none`
                        }`}
                        onClick={() => this.hapusData(member.id_member)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* form modal member */}
          <div className="modal" id="modal-member">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="d-grid d-md-flex justify-content-md-end ">
                    <button
                      type="button"
                      class="btn btn-md"
                      data-bs-dismiss="modal"
                    >
                      <i class="fa-solid fa-xmark text-white"></i>
                    </button>
                  </div>
                  <h4 className="modal-title">Hai kembali lagi!</h4>
                  <h3 className="modal-desc">
                    Buat Member baru Rello<span className="dot">.</span>
                  </h3>
                  <form onSubmit={(ev) => this.simpanData(ev)}>
                    <h4 className="modal-title mb-2">Nama</h4>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={this.state.nama}
                      onChange={(ev) =>
                        this.setState({ nama: ev.target.value })
                      }
                      required
                    />
                    <h4 className="modal-title mb-2">Alamat</h4>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={this.state.alamat}
                      onChange={(ev) =>
                        this.setState({ alamat: ev.target.value })
                      }
                      required
                    />
                    <h4 className="modal-title mb-2">Telepon</h4>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={this.state.telepon}
                      onChange={(ev) =>
                        this.setState({ telepon: ev.target.value })
                      }
                      required
                    />
                    <h4 className="modal-title mb-2">Jenis Kelamin</h4>
                    <select
                      className="form-control mb-2"
                      value={this.state.jenis_kelamin}
                      onChange={(ev) =>
                        this.setState({ jenis_kelamin: ev.target.value })
                      }
                    >
                      <option value="">Pilih Gender</option>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </select>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-1">
                      <button
                        type="submit"
                        className="btn btn-success btn-sm text-white"id="btn-sv"
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

export default Member;
