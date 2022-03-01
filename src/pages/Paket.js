import React from "react"
import {Modal} from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config";


class Paket extends React.Component{
    constructor(){
        super()
        this.state = {
            pakets : [
                {
                    id_paket: "1", 
                    jenis_paket : "Kiloan",
                    harga: "15000"
                },
                {
                    id_paket: "2", 
                    jenis_paket : "bed-cover",
                    harga: "6500"
                    
                },
                {
                    id_paket: "3", 
                    jenis_paket : "Kaos",
                    harga: "150000"
                    
                },
                {
                    id_paket: "6", 
                    jenis_paket : "Selimut",
                    harga: "15000"
                    
                }
            ],
            id_paket:"",
            jenis_paket:"",
            harga:0,
            visible:true
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData(){
        //memunculkan modal
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        //mengosongkan inputannya
        this.setState({
            harga:0, jenis_paket:"",
            id_paket: Math.random(1,1000000), action:"tambah"
        })
    }

    ubahData(id_paket){
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        //mencari posisi index dari data paket berdasarkan id_paket pada array pakets
    let index = this.state.pakets.findIndex(paket => paket.id_paket === id_paket)

    this.setState({
        id_paket : id_paket,
        jenis_paket : this.state.pakets[index].jenis_paket,
        harga : this.state.pakets[index].harga,
        action : "ubah"
        })
    }
    

    simpanData(event){
        event.preventDefault()
        //mencegah berjalannya aksi default
        //dari form submit

        //cek aksi tambah atau ubah
        if(this.state.action === "tambah"){
            let endpoint = `${baseUrl}/paket`
            //menampung data dari pengguna
            let newPaket = {
                id_paket: this.state.id_paket,
                jenis_paket : this.state.jenis_paket,
                harga : this.state.harga,
            } 
            axios.post(endpoint, newPaket, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch (error => console.log(error))
                this.modalPaket.hide();
            // let temp = this.state.pakets
            // temp.push(newPaket)
            // this.setState({pakets : temp})
            
        }else if(this.state.action === "ubah"){
            this.modalPaket.hide()
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket
            //mencari posisi index dari data paket berdasarkan id_paket pada array pakets
            // let index = this.state.pakets.findIndex(paket => paket.id_paket === this.state.id_paket)

            // let temp = this.state.pakets
            // temp[index].jenis_paket = this.state.jenis_paket
            // temp[index].harga = this.state.harga

            // this.setState({pakets: temp})

            let newPaket = {
                id_paket: this.state.id_paket,
                jenis_paket : this.state.jenis_paket,
                harga : this.state.harga,
            } 

            axios.put(endpoint, newPaket, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch (error => console.log(error))
        }
    }
    hapusData(id_paket){
        if(window.confirm("Apakah anda yakin menghapus data ini?")){
            let endpoint = `${baseUrl}/paket/` + id_paket
            //mencari posisi index dari data yang dihapus
            axios.delete(endpoint, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch (error => console.log(error))
        }
    }
    getData(){
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({pakets: response.data})
            })
            .catch(error => console.log(error))
    }

    componentDidMount(){
        //fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
    if(user.role === 'admin'){
      this.setState({
        visible:true
      })
    }else{
      this.setState({
        visible:false
      })
    }
    }

    render(){
        return (
            <div className="container">
            <div className="card">
                <div className="card-header bg-dark">
                    <h4 className="text-white">
                        List Data Paket
                    </h4>
                </div>

                <div className="card-body">
                <div className="d-grid gap-2 d-md-flex justify-content-md-end" >
                <button className="btn btn-success mb-4"
                onClick={() => this.tambahData()}>Tambah Paket</button>
            </div>
                    <ul className="list-group">
                        {this.state.pakets.map(paket => (
                            <li className="list-group-item">
                                <div className="row">
                                    {/* bagian untuk ID */}
                                    <div className="col-lg-1">
                                        <small className="text-info">ID</small> <br />
                                        {paket.id_paket}
                                    </div>
                                    {/* bagian untuk nama */}
                                    <div className="col-lg-4">
                                        <small className="text-info">Jenis Paket</small> <br />
                                        {paket.jenis_paket}
                                    </div>
                                    {/* bagian untuk  gender*/}
                                    <div className="col-lg-4">
                                        <small className="text-info">Harga</small> <br />
                                        {paket.harga}
                                    </div>
                                    <div className="col-lg-2">
                                        <button className="btn btn-warning btn-sm mt-4 mx-2" 
                                        onClick={() => this.ubahData(paket.id_paket)}>Edit </button>
                                        <button className="btn btn-danger btn-sm mt-4" 
                                        onClick={() => this.hapusData(paket.id_paket)}>Delete </button>
                                    </div>
                                    {/* bagian untuk alamat */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* form modal paket */}
                <div className="modal" id="modal-paket">
                    <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-success">
                                    <h4 className="text-white">
                                        Form Tambah Paket
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}> 

                                        Jenis Paket
                                        <input type="text" className="form-control mb-2"
                                        value={this.state.jenis_paket}
                                        onChange={ev => this.setState({jenis_paket: ev.target.value})}/>
                                           

                                        Harga
                                        <input type="text" className="form-control mb-2" 
                                        value={this.state.harga}
                                        onChange={ev => this.setState({harga: ev.target.value})}
                                        required />

                                        <button className="btn btn-success btn-sm" 
                                        type="submit">Simpan</button>
                                    </form>
                                </div>
                            </div>
                      </div>
                </div>
        </div>
    </div>
        )
    }
}

export default Paket
