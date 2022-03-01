import React from "react";
import axios from "axios";
import {Modal} from "bootstrap";
import { baseUrl, authorization } from "../config";

export default class FormTransaksi extends React.Component{
    constructor(){
        super()
        this.state = {
            id_member : "",
            tgl : "",
            batas_waktu : "",
            tgl_bayar : "",
            dibayar: false,
            id_user :"",
            detail_transaksi :[],
            members:[],
            pakets:[],
            id_paket :"",
            qty:0,
            jenis_paket : "",
            harga : 0
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getMember(){
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({members: response.data})
        })
        .catch(error => console.log(error))
    }
    getPaket(){
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({pakets: response.data})
        })
        .catch(error => console.log(error))
    }

    componentDidMount(){
        this.getMember()
        this.getPaket()
        
    let user = JSON.parse(localStorage.getItem("user"))
    if (user.role !== 'admin' && user.role !== 'kasir') {
      window.alert(`Maaf anda bukan admin atau kasir!`)
      window.location.href = "/"
    }
}
    tambahPaket(e){
        e.preventDefault()
        //tutup modal
        this.modal.hide()
        //untuk menyimpan data paket yang dipilih beserta jumlahnya ke dalam array detail-transaksi
        let idPaket = this.state.id_paket
        let selectedPaket = this.state.pakets.find(
            paket => paket.id_paket == idPaket
        )
        let newPaket ={
            id_paket : this.state.id_paket,
            qty : this.state.qty,
            jenis_paket : selectedPaket.jenis_paket,
            harga : selectedPaket.harga
        }
        //ambil array detail_transaksinya
        let temp = this.state.detail_transaksi
        temp.push(newPaket)
        this.setState({detail_transaksi: temp})
    }
    addPaket(){
        //menampilkan form modal untuk memilih paket
        this.modal = new Modal(document.getElementById('modal_paket')
        )
        this.modal.show()

        //kosongkan form nya
        this.setState({
            id_paket : "",
            qty : 0,
            jenis_paket : "",
            harga : 0
        })
    }

    hapusData(id_paket){
		if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            //mencari posisi index dari data yang akan dihapus
            let temp = this.state.detail_transaksi
            let index = temp.findIndex(detail => detail.id_paket === id_paket)

            //menghapus data pada array
            temp.splice(index,1)
            this.setState({detail: temp})
        }
	}

    simpanTransaksi(){
        let endpoint = `${baseUrl}/transaksi`
            //Menampung data
            let user = JSON.parse(localStorage.getItem("user"))
            let newData = {
                id_user : user.id_user,
                tgl : this.state.tgl,
                batas_waktu : this.state.alamat,
                tgl_bayar : this.state.tgl_bayar,
                id_member : this.state.id_member,
                dibayar : this.state.dibayar,
                detail_transaksi : this.state.detail_transaksi
            }
            axios.post(endpoint, newData, authorization)
            .then(response => {
                window.alert(response.data.message)
                // this.getData()
            })
            .catch(error => console.log(error))
    }

    render(){
        return(
            <div className="card">
                <div className="card-header bg-dark">
                    <h4 className="text-white">Form Transaksi</h4>
                </div>
                <div className="cad-body">
                    Member
                    <select className="form-control mb-2"
                    value={this.state.id_member}
                    onChange={e => this.setState({id_member: e.target.value})}>
                        {this.state.members.map(member => (
                            <option value={member.id_member}>
                                {member.nama}
                            </option>
                        ))}
                    </select>
                    Tanggal Transaksi
                    <input type="date" className="form-control mb-2"
                    value={this.state.tgl} onChange={e => this.setState({tgl:e.target.value})}/>

                    Batas Waktu
                    <input type="date" className="form-control mb-2"
                    value={this.state.batas_waktu} onChange={e => this.setState({batas_waktu:e.target.value})}/>

                    Tanggal Bayar
                    <input type="date" className="form-control mb-2"
                    value={this.state.tgl_bayar} onChange={e => this.setState({tgl_bayar:e.target.value})}/>

                    Status Bayar 
                    <select className="form-control mb-2"
                    value={this.state.dibayar}
                    onChange={e => this.setState({dibayar:e.target.value})}>
                        <option value={true}>Sudah Dibayar</option>
                        <option value={false}>Belum Dibayar</option>
                    </select>

                    <button className="btn btn-success" onClick={()=> this.addPaket()}>
                        Tambah Paket
                    </button>
                    {/* tampilkan isi detail */}
                    <h5>Detail Transaksi</h5>
                    {this.state.detail_transaksi.map(detail => (
                        <div className="row">
                            <div className="col-lg-3">
                                {detail.jenis_paket}
                            </div>
                            <div className="col-lg-2">
                                Qty : {detail.qty}
                            </div>
                            <div className="col-lg-3">
                                @ Rp {detail.harga}
                            </div>
                            <div className="col-lg-3">
                                Rp {detail.harga * detail.qty}
                            </div>
                            <div className="col-lg-1">
								<button className="btn btn-danger btn-sm"
								onClick={() => this.hapusData(detail.id_paket)}>
								Hapus
                                </button>
							</div>
                        </div>
                    ))}

                    {/* modal untuk pilihan paket */}
                    <div className="modal" id="modal_paket">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-dark">
                                    <h4 className="text-white">Pilih Paket</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={(e) => this.tambahPaket(e)}>
                                        Pilih Paket
                                        <select className="form-control mb-2" value={this.state.id_paket}
                                        onChange={e => this.setState({id_paket : e.target.value})}>
                                            <option value="">Pilih Paket</option>
                                            {this.state.pakets.map(paket => (
                                                <option value ={paket.id_paket}>
                                                    {paket.jenis_paket}
                                                </option>
                                            ))}
                                        </select>
                                        Jumlah
                                        <input type="number" className="form-control mb-2" value={this.state.qty}
                                        onChange={e => this.setState({qty : e.target.value})}/>

                                        <button type="submit" className="btn btn-success">Tambah</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-info text-white" onClick={()=> this.simpanTransaksi()}>Simpan Transaksi</button>
                </div>
            </div>
        )
    }
}

