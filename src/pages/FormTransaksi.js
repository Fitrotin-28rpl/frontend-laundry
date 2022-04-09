import React from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { baseUrl, authorization, formatNumber } from "../config";
import Navbar from "../Navbar";

export default class FormTransaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      id_member: "",
      tgl: "",
      batas_waktu: "",
      tgl_bayar: "",
      dibayar: false,
      id_user: "",
      detail_transaksi: [],
      members: [],
      pakets: [],
      id_paket: "",
      qty: 0,
      jenis_paket: "",
      harga: 0,
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  getMember() {
    let endpoint = `${baseUrl}/member`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ members: response.data });
      })
      .catch((error) => console.log(error));
  }
  getPaket() {
    let endpoint = `${baseUrl}/paket`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ pakets: response.data });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getMember();
    this.getPaket();

    let user = JSON.parse(localStorage.getItem("user"));
    if (user.role !== "Admin" && user.role !== "Kasir") {
      window.alert(`Maaf anda bukan Admin atau kasir!`);
      window.location.href = "/";
    }
  }
  tambahPaket(e) {
    e.preventDefault();
    //tutup modal
    this.modal.hide();
    //untuk menyimpan data paket yang dipilih beserta jumlahnya ke dalam array detail-transaksi
    let idPaket = this.state.id_paket;
    let selectedPaket = this.state.pakets.find(
      (paket) => paket.id_paket == idPaket
    );
    let newPaket = {
      id_paket: this.state.id_paket,
      qty: this.state.qty,
      jenis_paket: selectedPaket.jenis_paket,
      harga: selectedPaket.harga,
    };
    //ambil array detail_transaksinya
    let temp = this.state.detail_transaksi;
    temp.push(newPaket);
    this.setState({ detail_transaksi: temp });
  }
  addPaket() {
    //menampilkan form modal untuk memilih paket
    this.modal = new Modal(document.getElementById("modal_paket"));
    this.modal.show();

    //kosongkan form nya
    this.setState({
      id_paket: "",
      qty: 0,
      jenis_paket: "",
      harga: 0,
    });
  }

  hapusData(id_paket) {
    if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {
      //mencari posisi index dari data yang akan dihapus
      let temp = this.state.detail_transaksi;
      let index = temp.findIndex((detail) => detail.id_paket === id_paket);

      //menghapus data pada array
      temp.splice(index, 1);
      this.setState({ detail: temp });
    }
  }

  simpanTransaksi() {
    if (document.getElementById("member").value == "") {
      alert("Missing Member");
      return;
    }
    if (document.getElementById("tgl").value == "") {
      alert("Missing Tanggal Transaksi");
      return;
    }
    if (document.getElementById("batas_waktu").value == "") {
      alert("Missing Batas Waktu");
      return;
    }
    if (document.getElementById("status").value == "") {
      alert("Missing Status");
      return;
    }
    if (this.state.detail_transaksi.length == 0) {
      alert("Missing Paket");
      return;
    }

    let endpoint = `${baseUrl}/transaksi`;
    //Menampung data
    let user = JSON.parse(localStorage.getItem("user"));
    let newData = {
      id_user: user.id_user,
      tgl: this.state.tgl,
      batas_waktu: this.state.batas_waktu,
      tgl_bayar: this.state.tgl_bayar,
      id_member: this.state.id_member,
      dibayar: this.state.dibayar,
      detail_transaksi: this.state.detail_transaksi,
    };
    axios
      .post(endpoint, newData, authorization)
      .then((response) => {
        window.alert(response.data.message);
        window.location.href = "/transaksi";
        // this.getData()
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="background">
        <Navbar />
        <div className="card-content">
          <div className="container form" style={{ width: 850, paddingBottom: 45 }}>
            <h4 className="card-desc text-center">Hai kembali lagi!</h4>
            <h3 className="card-desc text-center">
              Yuk laundry pakaian di Rello<span className="dot">.</span>
            </h3>

            <div className="card mt-4">
              <div className="card-body">
                <h4 className="card-title mb-2">Member </h4>
                <select
                  id="member"
                  className="form-control mb-2"
                  value={this.state.id_member}
                  onChange={(e) => this.setState({ id_member: e.target.value })}
                >
                  <option value="">Pilih Member </option>
                  {this.state.members.map((member) => (
                    <option value={member.id_member}>{member.nama}</option>
                  ))}
                </select>
                <div className="row">
                  <div className="col-lg-4">
                    <h4 className="card-title mb-2">Tanggal Transaksi</h4>
                    <input
                      id="tgl"
                      type="date"
                      className="form-control mb-2"
                      value={this.state.tgl}
                      onChange={(e) => this.setState({ tgl: e.target.value })}
                    />
                  </div>
                  <div className="col-lg-4">
                    <h4 className="card-title mb-2">Batas Waktu</h4>
                    <input
                      id="batas_waktu"
                      type="date"
                      className="form-control mb-2"
                      value={this.state.batas_waktu}
                      onChange={(e) =>
                        this.setState({ batas_waktu: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-lg-4">
                    <h4 className="card-title mb-2">Tanggal Bayar</h4>
                    <input
                      id="tgl_bayar"
                      type="date"
                      className="form-control mb-2"
                      value={this.state.tgl_bayar}
                      onChange={(e) =>
                        this.setState({ tgl_bayar: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8">
                    <h4 className="card-title mb-2">Status Bayar </h4>
                    <select
                      id="status"
                      className="form-control mb-2"
                      value={this.state.dibayar}
                      onChange={(e) =>
                        this.setState({ dibayar: e.target.value })
                      }
                    >
                      <option value={false}>Pilih Bayar</option>
                      <option value={1}>Sudah Dibayar</option>
                      <option value={0}>Belum Dibayar</option>
                    </select>
                  </div>
                  <div className="col-lg-4">
                    <h4 className="card-title mb-2">Tambah Paket</h4>
                    <button
                      className="btn btn-warning btn-add text-white"
                      onClick={() => this.addPaket()}
                    >
                      Paket
                    </button>
                  </div>
                </div>

                <div className="col-lg-12">
                  {/* tampilkan isi detail */}
                  <h4 className="card-title mb-2">Detail Transaksi</h4>
                  {this.state.detail_transaksi.map((detail) => (
                    <div className="row">
                      <div className="col-lg-3 my-2 mx-2">{detail.jenis_paket}</div>
                      <div className="col-lg-2 my-2">Qty : {detail.qty}</div>
                      <div className="col-lg-2 my-2">
                        Rp {formatNumber(detail.harga)}
                      </div>
                      <div className="col-lg-3 my-2">
                        Rp {formatNumber(detail.harga * detail.qty)}
                      </div>
                      <div className="col-lg-1 my-2 d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => this.hapusData(detail.id_paket)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-1">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm text-white text-center"
                    onClick={()=> this.simpanTransaksi()}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>

            {/* modal untuk pilihan paket */}
            <div className="modal" id="modal_paket">
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
                    <form onSubmit={(e) => this.tambahPaket(e)}>
                      <h4 className="modal-title mb-2">Paket </h4>
                      <select
                        className="form-control mb-2"
                        value={this.state.id_paket}
                        onChange={(e) =>
                          this.setState({ id_paket: e.target.value })
                        }
                      >
                        <option value="">Pilih Paket</option>
                        {this.state.pakets.map((paket) => (
                          <option value={paket.id_paket}>
                            {paket.jenis_paket}
                          </option>
                        ))}
                      </select>
                      <h4 className="modal-title mb-2">Jumlah </h4>
                      <input
                        type="number"
                        className="form-control mb-2"
                        value={this.state.qty}
                        onChange={(e) => this.setState({ qty: e.target.value })}
                      />
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
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
      </div>
    );
  }
}
