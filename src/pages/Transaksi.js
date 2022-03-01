import React from "react";
import axios from "axios";
import { baseUrl, authorization } from "../config";
import { data } from "jquery";

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: [
            ]
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`

        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++){
                    let total = 0;
                    for(let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++){
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }
                    //tambahkan key ke "total"
                    dataTransaksi[i].total = total
                }
                this.setState({transaksi: dataTransaksi})
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
    }

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-info">Transaksi Baru
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 2)} className="text-danger">
                        Click here to next status
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div className="badge bg-warning">Sedang diproses
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 3)} className="text-danger">
                        Click here to next status
                    </a></div>
            )
        } else if (status === 3) {
            return (
                <div className="badge bg-secondary">Siap diambil
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 4)} className="text-danger">
                        Click here to next status
                    </a></div>
            )
        } else if (status === 4) {
            return (
                <div className="badge bg-success">Telah diambil</div>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini?`)) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(`Status telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))

        }
    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar == 0) {
            return (
                <div className="badge bg-danger text-white">
                    belum dibayar
                    <br />
                    <a onClick={() => this.changeStatusBayar(id_transaksi, 1)} className="text-white">
                        Change status bayar
                    </a>
                </div>
            )
        } else if (dibayar == 1) {
            return (
                <div className="badge bg-success text-white">
                    Sudah dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah anda yakin mengubah status bayar?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`

            axios.get(endpoint, authorization)
                .then(response => {
                    window.alert(`Status bayar berhasil diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    
    deleteTransaksi(id){
        if(window.confirm(`Apakah anda yakin menghapus data tersebut?`)){
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint)
            .then(response =>{
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }


    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header bg-dark">
                        <h4 className="text-white">
                            Transaction list
                        </h4>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {this.state.transaksi.map(trans => (
                                <li className="list-group-item">
                                    <div className="row my-2">
                                        {/* this is member area */}
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Member</small>
                                            <br />
                                            <h6>{trans.member.nama}</h6>
                                        </div>

                                        {/* this is tgl transaksi area */}
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Tgl Transaksi</small>
                                            <br />
                                            <h6>{trans.tgl}</h6>
                                        </div>

                                        {/* this is for batas waktu area */}
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Batas waktu</small>
                                            <br />
                                            <h6>{trans.batas_waktu}</h6>
                                        </div>

                                        {/* this is for tanggal bayar area */}
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Tgl Bayar</small>
                                            <br />
                                            <h6>{trans.tgl_bayar}</h6>
                                        </div>

                                        {/* this is for status area */}
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Status</small>
                                            <br />
                                            <h6>{this.convertStatus(trans.id_transaksi, trans.status)}</h6>
                                        </div>

                                        {/* this is for status pembayaran */}
                                        <div className="col-lg-3">
                                            <small className="text-secondary">Status Bayar</small>
                                            <br />
                                            <h6>{this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}</h6>
                                        </div>
                                        {/* total */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Total
                                            </small>
                                            <br></br>
                                            Rp {trans.total}
                                        </div>

                                    </div>

                                    <hr />
                                    {/* // area detail transaksi */}
                                    <small className="text-secondary">Detail Transaksi</small>
                                    {trans.detail_transaksi.map(detail => (
                                        <div className="row">
                                            {/* this is for name package area */}
                                            <div className="col-lg-3">
                                                <h6>{detail.paket.jenis_paket}</h6>
                                            </div>
                                            {/* this is for qty area */}
                                            <div className="col-lg-3">
                                                <h6>Qty: {detail.qty}</h6>
                                            </div>
                                            {/* this is for price area */}
                                            <div className="col-lg-3">
                                                <h6>Rp {detail.paket.harga}</h6>
                                            </div>
                                            {/* this is for total price area */}
                                            <div className="col-lg-3">
                                                <h6>Rp {detail.paket.harga * detail.qty}</h6>
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}