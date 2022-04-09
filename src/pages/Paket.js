import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";
import gambar from "./img-paket.png";
import Navbar from "../Navbar";

class Paket extends React.Component {
  constructor() {
    super();
    this.state = {
      pakets: [],
      id_paket: "",
      jenis_paket: "",
      harga: 0,
      visible: true,
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  tambahData() {
    //memunculkan modal
    this.modalPaket = new Modal(document.getElementById("modal-paket"));
    this.modalPaket.show();

    //mengosongkan inputannya
    this.setState({
      harga: 0,
      jenis_paket: "",
      id_paket: Math.random(1, 1000000),
      action: "tambah",
    });
  }

  ubahData(id_paket) {
    this.modalPaket = new Modal(document.getElementById("modal-paket"));
    this.modalPaket.show();

    //mencari posisi index dari data paket berdasarkan id_paket pada array pakets
    let index = this.state.pakets.findIndex(
      (paket) => paket.id_paket === id_paket
    );

    this.setState({
      id_paket: id_paket,
      jenis_paket: this.state.pakets[index].jenis_paket,
      harga: this.state.pakets[index].harga,
      action: "ubah",
    });
  }

  simpanData(event) {
    event.preventDefault();
    //mencegah berjalannya aksi default
    //dari form submit

    //cek aksi tambah atau ubah
    if (this.state.action === "tambah") {
      let endpoint = `${baseUrl}/paket`;
      //menampung data dari pengguna
      let newPaket = {
        id_paket: this.state.id_paket,
        jenis_paket: this.state.jenis_paket,
        harga: this.state.harga,
      };
      axios
        .post(endpoint, newPaket, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
      this.modalPaket.hide();
      // let temp = this.state.pakets
      // temp.push(newPaket)
      // this.setState({pakets : temp})
    } else if (this.state.action === "ubah") {
      this.modalPaket.hide();
      let endpoint = `${baseUrl}/paket/` + this.state.id_paket;
      //mencari posisi index dari data paket berdasarkan id_paket pada array pakets
      // let index = this.state.pakets.findIndex(paket => paket.id_paket === this.state.id_paket)

      // let temp = this.state.pakets
      // temp[index].jenis_paket = this.state.jenis_paket
      // temp[index].harga = this.state.harga

      // this.setState({pakets: temp})

      let newPaket = {
        id_paket: this.state.id_paket,
        jenis_paket: this.state.jenis_paket,
        harga: this.state.harga,
      };

      axios
        .put(endpoint, newPaket, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }
  hapusData(id_paket) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      let endpoint = `${baseUrl}/paket/` + id_paket;
      //mencari posisi index dari data yang dihapus
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
    let endpoint = `${baseUrl}/paket`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ pakets: response.data });
      })
      .catch((error) => console.log(error));
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

  render() {
    return (
      <div className="background-paket">
        <Navbar />
        <div className="card-body">
          <div className="container paket">
            <div className="row">
              <div className="col-lg-7">
                <h1 className="header mt-5">
                  Selamat Datang!
                  <br />
                  <span className="header-blue">Bundle </span>
                  <span className="header-black">Paket</span>
                </h1>
                <h1 className="header-2">
                  Terbaik <span className="header-black">Untukmu</span>
                </h1>
                <button
                  class={`btn btn-warning btn-add mt-4 text-white ${
                    this.state.visible ? `` : `d-none`
                  }`}
                  type="button"
                  onClick={() => this.tambahData()}
                >
                  Tambah Paket
                </button>
              </div>
              <div className="col-lg-4 pt-2">
                <img src={gambar} width="500"></img>
              </div>
            </div>
          </div>
        </div>

        <div className="paket-page">
          <div className="container mt-5">
            <div className="row paket">
              {this.state.pakets.map((paket) => (
                <div className="col-lg-3 my-1">
                  <div className="card">
                    {/* bagian untuk nama */}
                    <div className="row">
                      <div className="col-lg-12 text-center pt-4">
                        <i class="fa-solid fa-shirt p-3" id="icon-baju"></i>
                        <br />
                        <h4 className="text-paket">{paket.jenis_paket}</h4>
                      </div>
                      <div className="text-center">
                        <i class="fa-solid fa-tags px-2" id="icon-harga"></i>
                        <span className="paket-price">{paket.harga}/kg</span>
                      </div>
                    </div>
                    <div className="row ">
                      <div className="col-lg-4 ">   </div>
                      <div className="col-lg-2 p-4">
                        <button
                          className={`btn btn-warning btn-sm mt-1 text-white ${
                            this.state.visible ? `` : `d-none`
                          }`}
                          onClick={() => this.ubahData(paket.id_paket)}
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                      </div>
                      <div className="col-lg-2 p-4">
                        <button
                          className={`btn btn-danger btn-sm mt-1 ${
                            this.state.visible ? `` : `d-none`
                          }`}
                          onClick={() => this.hapusData(paket.id_paket)}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                        <div className="col-lg-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* form modal paket */}
          <div className="modal" id="modal-paket">
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
                    Buat Paket baru Rello<span className="dot">.</span>
                  </h3>
                  <form onSubmit={(ev) => this.simpanData(ev)}>
                    <h4 className="modal-title mb-2">Jenis Paket </h4>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={this.state.jenis_paket}
                      onChange={(ev) =>
                        this.setState({ jenis_paket: ev.target.value })
                      }
                      required
                    />
                    <h4 className="modal-title mb-2">Harga </h4>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={this.state.harga}
                      onChange={(ev) =>
                        this.setState({ harga: ev.target.value })
                      }
                      required
                    />
                    <div className=" btn-sv d-grid gap-2 d-md-flex justify-content-md-end mt-1">
                      <button
                        type="submit"
                        className="btn btn-success btn-sm text-white"
                        id="btn-sv"
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

export default Paket;
