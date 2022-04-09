import React from "react";
import axios from "axios";
import { baseUrl, authorization, formatNumber } from "../config";
import domToPdf from "dom-to-pdf";
import Navbar from "../Navbar";
import moment from "moment";
import gambar from "./img-transaksi.png";
import { Link } from "react-router-dom";

export default class Transaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      transaksi: [],
      masterPacks:[],
      search:""
    };

    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  getData() {
    let endpoint = `${baseUrl}/transaksi`;
    axios
      .get(endpoint, authorization) //mengambil data dari backend
      .then((response) => {
        let dataTransaksi = response.data;
        for (let i = 0; i < dataTransaksi.length; i++) {
          let total = 0;
          for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
            let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
            let qty = dataTransaksi[i].detail_transaksi[j].qty;

            total += harga * qty;
          }
          //tambahkan key ke "total"
          dataTransaksi[i].total = total;
        }
        this.setState({ transaksi: dataTransaksi });
        this.setState({ masterPacks: dataTransaksi });
      })
      .catch((error) => console.log(error));
  }

  searching(ev){
    let code = ev.keyCode;
    if (code === 13){
      let data = this.state.masterPacks;
      let found = data.filter(it =>
        it.member.nama.toLowerCase().includes(this.state.search.toLowerCase()))
        this.setState({transaksi: found});
    }
  }
  componentDidMount() {
    this.getData();
    let user = JSON.parse(localStorage.getItem("user"))
    if(user.role === 'Admin'||user.role === 'Kasir'){
      this.setState({
        visible:true
      })
    }else{
      this.setState({
        visible:false
      })
    }
  }

  convertStatus(id_transaksi, status) {
    if (status === 1) {
      return (
        <div className="badge bg-info">
          <a
            onClick={() => this.changeStatus(id_transaksi, 2)}
            className="text-white desc-trans"
          >
            Transaksi baru<i class="fa-solid fa-angles-right" id="icon-status"></i>
          </a>
        </div>
      );
    } else if (status === 2) {
      return (
        <div className="badge bg-warning">
          <a
            onClick={() => this.changeStatus(id_transaksi, 3)}
            className="text-white desc-trans"
          >
            Sedang diproses<i class="fa-solid fa-angles-right" id="icon-status"></i>
          </a>
        </div>
      );
    } else if (status === 3) {
      return (
        <div className="badge bg-secondary">
          <a
            onClick={() => this.changeStatus(id_transaksi, 4)}
            className="text-white desc-trans"
          >
          Siap diambil <i class="fa-solid fa-angles-right" id="icon-status"></i>
          </a>
        </div>
      );
    } else if (status === 4) {
      return <div className="badge bg-success">
        Telah diambil</div>;
    }
  }

  changeStatus(id, status) {
    if (
      window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini?`)
    ) {
      let endpoint = `${baseUrl}/transaksi/status/${id}`;
      let data = {
        status: status,
      };

      axios
        .post(endpoint, data, authorization)
        .then((response) => {
          window.alert(`Status telah diubah`);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  convertStatusBayar(id_transaksi, dibayar) {
    if (dibayar == 0) {
      return (
        <div className="badge bg-danger text-white">

          <a
            onClick={() => this.changeStatusBayar(id_transaksi, 1)}
            className="text-white desc-trans"
          >
            Belum Bayar <i class="fa-solid fa-angles-right" id="icon-status"></i>
          </a>
        </div>
        
      );
    } else if (dibayar == 1) {
      return <div className="badge bg-success text-white">Sudah dibayar</div>;
    }
  }

  changeStatusBayar(id, status) {
    if (window.confirm(`Apakah anda yakin mengubah status bayar?`)) {
      let endpoint = `${baseUrl}/transaksi/bayar/${id}`;

      axios
        .get(endpoint, authorization)
        .then((response) => {
          window.alert(`Status bayar berhasil diubah`);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  deleteTransaksi(id) {
    if (window.confirm(`Apakah anda yakin menghapus data tersebut?`)) {
      let endpoint = `${baseUrl}/transaksi/${id}`;
      axios
        .delete(endpoint, authorization)
        .then((response) => {
          window.alert(response.data.message);
          this.getData();
        })
        .catch((error) => console.log(error));
    }
  }

  printStruk(id) {
    var element = document.getElementById(`struk${id}`);
    var options = {
      filename: `Detail Struk-${id}.pdf`,
    };
    domToPdf(element, options, function (pdf) {
      window.alert("File will download soon");
    });
  }
                                                                                                                                                                                                                                                                                       
  render() {
    const target = React.createRef();
    const optionPDF = {
      orientation: `landscape`,
      unit: `cm`,
      format: [21, 29.7],
    };
    return (
      <div className="background-trans">
        <Navbar />
        <div className="card-body">
          <div className="container transaksi">
            <div className="row">
              <div className="col-lg-6">
                <h1 className="header mt-5">
                  Selamat Datang!
                  <br />
                  <span className="header-blue">Transaksi </span>
                  <span className="header-black">Rello</span>
                </h1>
                <h1 className="header-2">
                  Lihat<span className="header-black"> Datamu</span>
                </h1>
                <button
                  class={`btn btn-warning btn-add mt-4 btn-paket text-white ${
                    this.state.visible ? `` : `d-none`
                  }`}
                  type="button">
                  <Link to="/FormTransaksi" className="btn-transaction text-white">
                  Tambah Transaksi
                </Link>
                </button>
              </div>
              <div className="col-lg-6">
                <img src={gambar} width="550"></img>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-light">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6 mt-4">
                <h4 className="headers">
                  <i class="fa-solid fa-cart-shopping" id="icon-header"></i>Data
                  Transaksi
                </h4>
              </div>
              <div className="col-lg-6 mt-4 d-grid d-md-flex justify-content-md-end ">
                <input type="text" placeholder = "Cari data transaksi" value={this.state.search} onChange={ev => this.setState({search: ev.target.value})} onKeyUp={(ev)=>this.searching(ev)} id="search-bar" />
              </div>
            </div>

            <ul ref={target} className="list-group">
              {this.state.transaksi.map((trans) => (
                <li className="list-group-item mt-4 pb-3">
                  <div className="row my-2 ">
                    {/* this is member area */}
                    <div className="col-lg-2 ">
                      <small className="title-trans mb-2">Nama</small>
                      <br />
                      <h6>{trans.member.nama}</h6>
                    </div>
                    {/* this is tgl transaksi area */}
                    <div className="col-lg-3">
                      <small className="title-trans py-2">Tgl Transaksi</small>
                      <br />
                      <h6>{moment(trans.tgl).format("L")}</h6>
                      <br />
                      {/*Batas Waktu*/}
                      <small className="title-trans">Batas waktu</small>
                      <br />
                      {moment(trans.batas_waktu).format("L")}
                    </div>
                    {/* tgl bayar */}
                    <div className="col-lg-3">
                      <small className="title-trans py-2">Tgl Bayar</small>
                      <h6>{moment(trans.tgl_bayar).format("L")}</h6>
                      {/*Batas Waktu*/}
                      <br />
                        <small className="title-trans">Status Bayar</small>
                        <br />
                      {this.convertStatusBayar(
                        trans.id_transaksi,
                        trans.dibayar
                      )}
                    </div>
                    {/* Total */}
                    <div className="col-lg-2">
                      <small className="title-trans py-2">Total</small>
                      <h6>Rp {formatNumber(trans.total)}</h6>
                      {/*Batas Waktu*/}
                      <br />
                        <small className="title-trans">Status Transaksi</small>
                        <br />
                        {this.convertStatus(trans.id_transaksi, trans.status)}
                    </div>
                    {/* button */}
                    <div className="col-lg-2 mt-5">
                    <button
                          className="btn btn-info text-white mx-2 "
                          onClick={() => this.printStruk(trans.id_transaksi)}
                        >
                          <i class="fa-solid fa-file-arrow-down" id="icon-struck"></i>
                        </button>
                        <button
                          className={`btn btn-danger text-white mx-1 ${
                            this.state.visible ? `` : `d-none`
                          }`}
                          onClick={() => this.deleteTransaksi(trans.id_transaksi)}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>


                    {/* struk */}
                    <div style={{ display: `none` }}>
                      <div
                        className="col-lg-12 p-3"
                        id={`struk${trans.id_transaksi}`}
                      >
                        <h3 className="text-center" style={{fontSize:`50px`, marginTop:`120px`}} id="struk">
                        <i class="fa-solid fa-rocket" id="logo-trans"></i> <b>RELLO</b></h3>
                        <h5 className="text-center pt-3" style={{fontSize:`22px`}} id="struk-address">
                          Jalan Danau Poso G3 A8 Sawojajar, Malang <br />
                          <br />
                          Telp. 0898-8989-9898 
                        </h5>
                        <h5 className="text-dark  mt-5 pt-3" >
                          <b id="struk-faktur" style={{fontSize:`23px`}} >Faktur Penerimaan</b>
                          <span className="text-dark" style={{fontSize:`20px`, paddingTop:`10px`}} id="struk-date">
                            {moment(trans.tgl).format("LL")}
                          </span>
                        </h5>
                        <h5 className="text-dark"  style={{fontSize:`20px`, paddingTop:`10px`}}>
                          <b  id="struk-faktur">Member :</b> <span id="struk-desc">{trans.member.nama}</span> 
                        </h5>
                        <h5 className="text-dark"  style={{fontSize:`20px`, paddingTop:`10px`}}>
                          <b id="struk-faktur">Oleh :</b> <span id="struk-desc">{trans.user.nama}</span>
                        </h5>

                        <div
                          className="row mt-5"
                          style={{ borderBottom: `1px dotted black`, }}
                        >
                          <div className="col-3 pt-3">
                            <h4>
                              <b id="struk-table">Paket</b>
                            </h4>
                          </div>
                          <div className="col-3 pt-3">
                            <h4>
                              <b id="struk-table">Qty</b>
                            </h4>
                          </div>
                          <div className="col-3 pt-3">
                            <h4>
                              <b id="struk-table">Harga </b>
                            </h4>
                          </div>
                          <div className="col-3 pt-3">
                            <h4>
                              <b id="struk-table">Total</b>
                            </h4>
                          </div>
                        </div>
                        {trans.detail_transaksi.map((item) => (
                          <div
                            className="row mt-3"
                            style={{ borderBottom: `1px dotted black` }}
                          >
                            <div className="col-3">
                              <h5 id="struk-table-desc">{item.paket.jenis_paket}</h5>
                            </div>
                            <div className="col-3">
                              <h5 id="struk-table-desc">{item.qty}</h5>
                            </div>
                            <div className="col-3">
                              <h5 id="struk-table-desc">Rp. {formatNumber(item.paket.harga)}</h5>
                            </div>
                            <div className="col-3">
                              <h5 id="struk-table-desc">
                                Rp. {formatNumber(item.paket.harga * item.qty)}
                              </h5>
                            </div>
                          </div>
                        ))}

                        <div className="row mt-2">
                          <div className="col-lg-9"> </div>
                          <div className="col-lg-3">
                            <h4>
                              <b id="struk-table-total">Rp. {formatNumber(trans.total)}</b>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* // area detail transaksi */}
                  <small className="title-trans">Detail Transaksi</small>
                  {trans.detail_transaksi.map((detail) => (
                    <div className="row">
                      {/* this is for name package area */}
                      <div className="col-lg-2 pt-2 ">
                        <h6>{detail.paket.jenis_paket}</h6>
                      </div>
                      {/* this is for qty area */}
                      <div className="col-lg-3 pt-2">
                        <h6>Qty: {detail.qty}</h6>
                      </div>
                      {/* this is for price area */}
                      <div className="col-lg-3 pt-2">
                        <h6>Rp {formatNumber(detail.paket.harga)}</h6>
                      </div>
                      {/* this is for total price area */}
                      <div className="col-lg-3 pt-2">
                        <h6>
                          Rp {formatNumber(detail.paket.harga * detail.qty)}
                        </h6>
                      </div>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
