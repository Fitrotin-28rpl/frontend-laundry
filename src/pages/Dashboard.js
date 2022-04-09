import React from "react";
import axios from "axios";
import { formatNumber, baseUrl, authorization } from "../config";
import gambar from "./icon1.png";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";

export default class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = {
      jmlMember: 0,
      jmlPaket: 0,
      jmlTransaksi: 0,
      income: 0,
    };
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }

  getSummary() {
    let endpoint = `http://localhost:8000/member`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ jmlMember: response.data.length});
      })
      .catch((error) => console.log(error));

    //paket
    endpoint = `http://localhost:8000/paket`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ jmlPaket: response.data.length });
      })
      .catch((error) => console.log(error));

    //transaksi
    endpoint = `http://localhost:8000/transaksi`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        let dataTransaksi = response.data;
        let income = 0;
        for (let i = 0; i < dataTransaksi.length; i++) {
          let total = 0;
          for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
            let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
            let qty = dataTransaksi[i].detail_transaksi[j].qty;

            total += harga * qty;
          }
          //tambahkan key ke "total"
          income += total;
        }
        this.setState({
          jmlTransaksi: response.data.length,
          income: income,
        });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getSummary();
  }
  render() {
    return (
      <div className="background">
        <Navbar />
        <div className="container dashboard">
          <div className="row">
            <div className="col-lg-7">
              <h1 className="header">
                Fastest <br />
                <span className="header-yellow">Service</span>
                <span className="header-1">&</span>
              </h1>
              <h1 className="header-2">
                Easy <span className="header-black">Pick Up</span>
              </h1>
              <button class="btn btn-warning mt-4" type="button">
                <Link to="/FormTransaksi" className="btn-transaction text-white">
                  Tambah Transaksi
                </Link>
              </button>
            </div>
            <div className="col-lg-5 pt-4">
              <img src={gambar} width="370"></img>
            </div>
          </div>
          <div className="summary">
            <div className="card">
              <div className="row p-3">
                <div className="col-lg-3">
                  <div className="row">
                    <div className="col-lg-4">
                      <i class="fa-solid fa-user p-3" id="icon-member"></i>{" "}
                      <br />
                    </div>
                    <div className="col-lg-8  text-left">
                      <h5>Member</h5>
                      <h4>{this.state.jmlMember}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="row">
                    <div className="col-lg-4">
                      <i
                        class="fa-solid fa-box-archive p-3"
                        id="icon-paket"
                      ></i>{" "}
                      <br />
                    </div>
                    <div className="col-lg-8 text-left">
                      <h5>Paket</h5>
                      <h4>{this.state.jmlPaket}</h4>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="row">
                    <div className="col-lg-4">
                      <i
                        class="fa-solid fa-cart-shopping p-3"
                        id="icon-transaksi"
                      ></i>{" "}
                      <br />
                    </div>
                    <div className="col-lg-8 text-left">
                      <h5>Transaksi</h5>
                      <h4>{this.state.jmlTransaksi}</h4>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="row">
                    <div className="col-lg-4">
                      <i class="fa-solid fa-wallet p-3" id="icon-income"></i>{" "}
                      <br />
                    </div>
                    <div className="col-lg-8 text-left">
                      <h5>Income</h5>
                      <h5 className="text-income">
                        Rp {formatNumber(this.state.income)}
                      </h5>
                    </div>
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
